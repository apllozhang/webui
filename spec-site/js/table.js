/* ============================================================
   ALE WebUI v5.1 — table.js
   规范 14A 数据表格功能包的参考实现：
   排序(aria-sort) · 列宽拖动(键盘可操作) · 换行 · 分页 ·
   防抖搜索 · 批量操作 · 状态筛选 · i18n 联动
   ============================================================ */
(function () {
  "use strict";
  var ALE = window.ALE;
  var i18n = ALE.i18n;

  /* ── 演示数据：57 条中性记录（无真实凭据，规范 27 章） ── */
  var TITLES_ZH = ["新员工入门路径", "品牌资源中心", "网络配置手册", "季度运营报告", "客户案例合集", "产品说明文档", "数据中心巡检记录", "培训课程大纲", "故障排查指南", "供应商评估表", "项目里程碑计划", "安全合规清单", "服务目录说明", "运维值班记录", "测试环境清单", "版本发布说明", "用户调研汇总", "会议纪要归档", "预算执行跟踪", "知识库迁移方案", "接口对接文档", "系统架构图集", "采购流程指引", "库存盘点结果", "培训效果评估", "机房巡检日志", "权限审计报告", "备份恢复演练", "容量规划模型", "工单统计分析", "资产折旧明细", "服务等级协议", "变更管理记录", "事件响应手册", "网络拓扑资料", "机房平面图纸", "设备台账清单", "能耗监测报表", "巡检路线方案", "备件库存清单", "外包服务评估", "培训签到记录", "满意度调查结果", "知识条目评审", "文档模板库", "流程优化建议", "技术雷达总览", "开源组件清单", "许可证台账", "灾备切换预案", "值班交接日志", "会议资源预订", "差旅费用报表", "团建活动方案", "公告通知归档", "访客登记记录", "快递收发台账"];
  var TYPES = ["course", "doc", "dataset", "report"];
  var STATUSES = ["draft", "doing", "published", "archived"];
  var OWNERS = ["ALE TSS", "Chen Wei", "Li Na", "Wang Fang", "Zhang Lei", "Liu Yang", "Zhao Min"];
  var DATA = [];
  (function seed() {
    var s = 42;
    function rnd() { s = (s * 9301 + 49297) % 233280; return s / 233280; }
    for (var i = 0; i < 57; i++) {
      var t = TITLES_ZH[i % TITLES_ZH.length] + (i >= TITLES_ZH.length ? "（续" + Math.floor(i / TITLES_ZH.length) + "）" : "");
      DATA.push({
        id: i + 1,
        no: "REC-2026-" + String(1001 + i),
        title: t,
        type: TYPES[Math.floor(rnd() * TYPES.length)],
        status: STATUSES[Math.floor(rnd() * STATUSES.length)],
        owner: OWNERS[Math.floor(rnd() * OWNERS.length)],
        date: new Date(2026, 7, 1 + Math.floor(rnd() * 40)),
        size: Math.round(rnd() * 9000 + 60)
      });
    }
  })();

  /* ── 状态 ── */
  var state = {
    search: "", debounced: "", status: "all",
    page: 1, pageSize: 10,
    sortBy: null, sortOrder: "asc",
    selected: new Set(),
    widths: { no: 130, title: 240, type: 100, status: 110, owner: 110, date: 120, size: 100 }
  };
  var COLS = [
    { key: "no", sortable: true },
    { key: "title", sortable: true },
    { key: "type", sortable: true },
    { key: "status", sortable: true },
    { key: "owner", sortable: true },
    { key: "date", sortable: true },
    { key: "size", sortable: true }
  ];

  var SORT_ICONS = {
    none: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m7 15 5 5 5-5M7 9l5-5 5 5"/></svg>',
    asc: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m17 11-5-5-5 5"/></svg>',
    desc: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m7 13 5 5 5-5"/></svg>'
  };
  var PG_ICONS = {
    first: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m17 18-6-6 6-6M7 6v12"/></svg>',
    prev: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m15 18-6-6 6-6"/></svg>',
    next: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m9 18 6-6-6-6"/></svg>',
    last: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m7 18 6-6-6-6M17 6v12"/></svg>'
  };

  var $ = function (sel) { return document.querySelector(sel); };
  var theadRow = $("#demo-thead-row");
  var tbody = $("#demo-tbody");
  var batchBar = $("#demo-batch-bar");
  var confirmModal = $("#demo-batch-modal");
  var tableEl = document.querySelector("table.data");
  var userResized = false;   // 用户调整过列宽 → 精确像素模式（拖哪列动哪列，F14）

  /* 宽度模式：初始 min-width:100% 填满容器；拖动后 width=Σ列宽+解除拉伸（只有目标列变） */
  function syncTableWidth() {
    var total = 44 + COLS.reduce(function (sum, c) { return sum + state.widths[c.key]; }, 0);
    if (userResized) {
      tableEl.style.width = total + "px";
      tableEl.style.minWidth = "0";
    } else {
      tableEl.style.width = "";
      tableEl.style.minWidth = "100%";
    }
  }

  function fmtDate(d) {
    return d.getFullYear() + "/" + (d.getMonth() + 1) + "/" + d.getDate();
  }
  function badge(status) {
    var map = { draft: "neutral", doing: "info", published: "success", archived: "warning" };
    return '<span class="badge ' + map[status] + '">' + i18n.t("table.status." + status) + "</span>";
  }

  /* ── 过滤 → 排序 → 分页 ── */
  function computeRows() {
    var q = state.debounced.trim().toLocaleLowerCase();
    var rows = DATA.filter(function (r) {
      var hitQ = !q || [r.no, r.title, r.owner].some(function (v) { return String(v).toLocaleLowerCase().indexOf(q) > -1; });
      var hitS = state.status === "all" || r.status === state.status;
      return hitQ && hitS;
    });
    if (state.sortBy) {
      var key = state.sortBy, dir = state.sortOrder === "asc" ? 1 : -1;
      rows = rows.slice().sort(function (a, b) {
        var va = a[key], vb = b[key];
        var cmp = typeof va === "number" && typeof vb === "number" ? va - vb : String(va).localeCompare(String(vb));
        return cmp * dir;
      });
    }
    return rows;
  }

  function pageNumbers(current, total) {
    if (total <= 7) {
      var all = []; for (var i = 1; i <= total; i++) all.push(i); return all;
    }
    var pages = [1];
    if (current > 3) pages.push("…");
    for (var j = Math.max(2, current - 1); j <= Math.min(total - 1, current + 1); j++) pages.push(j);
    if (current < total - 2) pages.push("…");
    pages.push(total);
    return pages;
  }

  /* ── 渲染：表头 ── */
  function renderHead() {
    theadRow.innerHTML = "";
    syncTableWidth();
    var selTh = document.createElement("th");
    selTh.style.width = "44px";
    selTh.innerHTML = '<input type="checkbox" id="sel-all" style="width:16px;height:16px;cursor:pointer" aria-label="' + i18n.t("table.sel.header") + '">';
    theadRow.appendChild(selTh);
    selTh.querySelector("input").addEventListener("change", function () {
      var rows = computeRows();
      var pageRows = rows.slice((state.page - 1) * state.pageSize, state.page * state.pageSize);
      var allSel = pageRows.every(function (r) { return state.selected.has(r.id); });
      pageRows.forEach(function (r) { allSel ? state.selected.delete(r.id) : state.selected.add(r.id); });
      renderBody(); renderBatch();
    });

    COLS.forEach(function (col, idx) {
      var th = document.createElement("th");
      th.className = "sortable";
      th.style.width = state.widths[col.key] + "px";
      th.style.position = "relative";
      var sorted = state.sortBy === col.key;
      if (sorted) th.classList.add("sorted");
      th.setAttribute("aria-sort", sorted ? (state.sortOrder === "asc" ? "ascending" : "descending") : "none");

      var label = i18n.t("table.col." + col.key);
      var inner = document.createElement("div");
      inner.className = "th-inner";
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "sort-btn";
      btn.setAttribute("aria-label", i18n.t("table.sort.aria", label));
      btn.innerHTML = SORT_ICONS[sorted ? state.sortOrder : "none"];
      btn.addEventListener("click", function () {
        if (state.sortBy === col.key) {
          state.sortOrder = state.sortOrder === "asc" ? "desc" : "asc";
        } else {
          state.sortBy = col.key; state.sortOrder = "asc";
        }
        renderHead(); renderBody();
      });
      inner.appendChild(document.createTextNode(label));
      inner.appendChild(btn);
      th.appendChild(inner);

      /* 列宽手柄：鼠标拖动 + 键盘方向键（14A.2） */
      var rz = document.createElement("div");
      rz.className = "col-resizer";
      rz.setAttribute("role", "separator");
      rz.setAttribute("tabindex", "0");
      rz.setAttribute("aria-orientation", "vertical");
      var ariaResize = function () {
        rz.setAttribute("aria-label", i18n.t("table.resize.aria", label, state.widths[col.key]));
      };
      ariaResize();
      rz.addEventListener("mousedown", function (e) {
        e.preventDefault();
        rz.classList.add("active");
        var startX = e.clientX, startW = state.widths[col.key];
        function move(ev) {
          userResized = true;
          state.widths[col.key] = Math.max(50, startW + (ev.clientX - startX));
          th.style.width = state.widths[col.key] + "px";
          syncTableWidth();
          ariaResize();
        }
        function up() {
          rz.classList.remove("active");
          document.removeEventListener("mousemove", move);
          document.removeEventListener("mouseup", up);
        }
        document.addEventListener("mousemove", move);
        document.addEventListener("mouseup", up);
      });
      rz.addEventListener("keydown", function (e) {
        userResized = true;
        var step = e.shiftKey ? 1 : 10;
        if (e.key === "ArrowLeft") { state.widths[col.key] = Math.max(50, state.widths[col.key] - step); }
        else if (e.key === "ArrowRight") { state.widths[col.key] = Math.max(50, state.widths[col.key] + step); }
        else return;
        e.preventDefault();
        th.style.width = state.widths[col.key] + "px";
        syncTableWidth();
        ariaResize();
      });
      th.appendChild(rz);
      theadRow.appendChild(th);
    });
  }

  /* ── 渲染：表体 ── */
  function renderBody() {
    var rows = computeRows();
    var total = rows.length;
    var totalPages = Math.max(1, Math.ceil(total / state.pageSize));
    if (state.page > totalPages) state.page = totalPages;
    var pageRows = rows.slice((state.page - 1) * state.pageSize, state.page * state.pageSize);

    tbody.innerHTML = "";
    if (total === 0) {
      var tr0 = document.createElement("tr");
      var td0 = document.createElement("td");
      td0.colSpan = 8;
      td0.className = "table-state";
      td0.innerHTML = "<div style='font-weight:700;color:var(--color-text-primary);margin-bottom:6px'>" + i18n.t("table.empty.title") + "</div>";
      var act = document.createElement("button");
      act.type = "button"; act.className = "button secondary sm";
      act.textContent = i18n.t("table.empty.action");
      act.addEventListener("click", function () {
        state.search = ""; state.debounced = ""; state.status = "all";
        $("#demo-search").value = ""; $("#demo-status").value = "all";
        $("#demo-search-box").classList.remove("has-value");
        state.page = 1; renderAll();
      });
      td0.appendChild(act);
      tr0.appendChild(td0);
      tbody.appendChild(tr0);
    } else {
      pageRows.forEach(function (r) {
        var tr = document.createElement("tr");
        tr.className = state.selected.has(r.id) ? "selected" : "";
        tr.setAttribute("aria-selected", String(state.selected.has(r.id)));

        var tdSel = document.createElement("td");
        var cb = document.createElement("input");
        cb.type = "checkbox"; cb.checked = state.selected.has(r.id);
        cb.style.cssText = "width:16px;height:16px;cursor:pointer";
        cb.setAttribute("aria-label", r.no);
        cb.addEventListener("change", function () {
          cb.checked ? state.selected.add(r.id) : state.selected.delete(r.id);
          tr.classList.toggle("selected", cb.checked);
          tr.setAttribute("aria-selected", String(cb.checked));
          renderBatch();
        });
        tdSel.appendChild(cb);
        tr.appendChild(tdSel);

        var meta = [
          { cls: "wrap", html: '<span class="rec-no mono">' + r.no + "</span>" },
          { cls: "wrap", html: r.title },
          { cls: "wrap muted", html: i18n.t("table.type." + r.type) },
          { cls: "", html: badge(r.status) },
          { cls: "wrap muted", html: r.owner },
          { cls: "muted", html: fmtDate(r.date) },
          { cls: "num", html: r.size.toLocaleString() }
        ];
        meta.forEach(function (m, i) {
          var td = document.createElement("td");
          td.className = m.cls;
          td.style.width = state.widths[COLS[i].key] + "px";
          td.innerHTML = m.html;
          tr.appendChild(td);
        });
        tbody.appendChild(tr);
      });
    }

    renderPager(total, totalPages);
    $("#sel-all").checked = pageRows.length > 0 && pageRows.every(function (r) { return state.selected.has(r.id); });
  }

  /* ── 渲染：分页（14A.4） ── */
  function renderPager(total, totalPages) {
    var left = $("#demo-pager-left");
    var right = $("#demo-pager-right");
    left.innerHTML = "";
    right.innerHTML = "";

    var perLabel = document.createElement("span");
    perLabel.textContent = i18n.t("table.perPage");
    var sel = document.createElement("select");
    sel.className = "select";
    sel.setAttribute("aria-label", i18n.t("table.perPage"));
    [10, 20, 50].forEach(function (n) {
      var o = document.createElement("option");
      o.value = n; o.textContent = n;
      if (n === state.pageSize) o.selected = true;
      sel.appendChild(o);
    });
    sel.addEventListener("change", function () {
      state.pageSize = Number(sel.value); state.page = 1;
      renderBody(); renderHead();
    });
    var itemsLabel = document.createElement("span");
    itemsLabel.textContent = i18n.t("table.items");
    left.appendChild(perLabel); left.appendChild(sel); left.appendChild(itemsLabel);

    var range = document.createElement("span");
    range.style.marginLeft = "8px";
    if (total > 0) {
      range.textContent = i18n.t("table.range",
        String((state.page - 1) * state.pageSize + 1),
        String(Math.min(state.page * state.pageSize, total)),
        total.toLocaleString());
    }
    left.appendChild(range);

    function pgBtn(icon, label, disabled, handler, current) {
      var b = document.createElement("button");
      b.type = "button";
      b.className = "pg-btn";
      if (current) b.setAttribute("aria-current", "true");
      if (icon) b.innerHTML = PG_ICONS[icon];
      else b.textContent = label;
      b.setAttribute("aria-label", label);
      b.disabled = !!disabled;
      if (handler) b.addEventListener("click", handler);
      return b;
    }
    var go = function (p) { state.page = p; renderBody(); };
    right.appendChild(pgBtn("first", "« 1", state.page <= 1, function () { go(1); }));
    right.appendChild(pgBtn("prev", "‹", state.page <= 1, function () { go(state.page - 1); }));
    pageNumbers(state.page, totalPages).forEach(function (p) {
      if (p === "…") {
        var dots = document.createElement("span");
        dots.className = "pg-ellipsis"; dots.textContent = "…";
        right.appendChild(dots);
      } else {
        right.appendChild(pgBtn(null, String(p), false, function () { go(p); }, state.page === p));
      }
    });
    right.appendChild(pgBtn("next", "›", state.page >= totalPages, function () { go(state.page + 1); }));
    right.appendChild(pgBtn("last", "» " + totalPages, state.page >= totalPages, function () { go(totalPages); }));
  }

  /* ── 批量条（14A.6） ── */
  function renderBatch() {
    var n = state.selected.size;
    batchBar.classList.toggle("show", n > 0);
    batchBar.querySelector(".count").textContent = i18n.t("table.batch.selected", n);
  }

  function renderAll() { renderHead(); renderBody(); renderBatch(); }

  /* ── 搜索（14A.5：300ms 防抖 + 清除 + 重置页码） ── */
  var searchBox = $("#demo-search-box");
  var searchInput = $("#demo-search");
  var timer = null;
  searchInput.addEventListener("input", function () {
    searchBox.classList.toggle("has-value", !!searchInput.value);
    clearTimeout(timer);
    timer = setTimeout(function () {
      state.debounced = searchInput.value;
      state.page = 1;
      renderAll();
    }, 300);
  });
  $("#demo-search-clear").addEventListener("click", function () {
    searchInput.value = ""; state.debounced = "";
    searchBox.classList.remove("has-value");
    state.page = 1; renderAll(); searchInput.focus();
  });

  /* 状态筛选 */
  $("#demo-status").addEventListener("change", function (e) {
    state.status = e.target.value; state.page = 1; renderAll();
  });

  /* 批量删除确认 */
  $("#demo-batch-clear").addEventListener("click", function () {
    state.selected.clear(); renderBody(); renderBatch();
  });
  $("#demo-batch-delete").addEventListener("click", function () {
    confirmModal.querySelector("h3").textContent = i18n.t("table.batch.confirmTitle", state.selected.size);
    ALE.openModal(confirmModal);
  });
  $("#demo-batch-cancel").addEventListener("click", function () { ALE.closeModal(confirmModal); });
  $("#demo-batch-ok").addEventListener("click", function () {
    var n = state.selected.size;
    DATA = DATA.filter(function (r) { return !state.selected.has(r.id); });
    state.selected.clear();
    ALE.closeModal(confirmModal);
    renderAll();
    ALE.toast("success", i18n.t("table.batch.done", n));
  });

  /* ── 语言切换联动重渲染 ── */
  i18n.onChange(function () { renderAll(); });

  renderAll();
})();
