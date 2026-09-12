/* skeleton-alpine 演示应用：14A 轻量表格 + 三步向导 */
function demoApp() {
  return {
    /* ── 表格状态 ── */
    q: "",
    status: "all",
    page: 1,
    pageSize: 10,
    sortBy: null,
    sortAsc: true,
    columns: [
      { key: "no", label: "编号", w: "150px", sortable: true },
      { key: "title", label: "标题", w: "auto", sortable: true },
      { key: "type", label: "类型", w: "110px", sortable: false },
      { key: "status", label: "状态", w: "110px", sortable: true },
      { key: "size", label: "大小 (KB)", w: "110px", sortable: true },
    ],
    typeLabel: { doc: "文档", dataset: "数据集", report: "报表" },
    statusLabel: { draft: "草稿", doing: "进行中", published: "已发布" },
    statusTone: { draft: "neutral", doing: "info", published: "success" },
    rows: [],

    /* ── 向导状态 ── */
    step: 0,
    steps: ["基础信息", "分类", "确认"],
    form: { name: "", type: "doc" },

    init() {
      /* 演示数据 */
      var titles = ["网络配置手册", "品牌资源中心", "季度运营报告", "培训课程大纲", "故障排查指南",
                    "供应商评估表", "安全合规清单", "版本发布说明", "用户调研汇总", "接口对接文档",
                    "系统架构图集", "采购流程指引", "库存盘点结果", "培训效果评估", "权限审计报告"];
      var types = ["doc", "dataset", "report"];
      var statuses = ["draft", "doing", "published"];
      var s = 7;
      for (var i = 0; i < 23; i++) {
        s = (s * 9301 + 49297) % 233280;
        this.rows.push({
          id: i + 1,
          no: "REC-2026-" + (1001 + i),
          title: titles[i % titles.length],
          type: types[s % 3],
          status: statuses[(s >> 2) % 3],
          size: Math.round(s % 9000 + 60),
        });
      }
      ALETheme.init();
    },

    toggleSort(key) {
      if (this.sortBy === key) this.sortAsc = !this.sortAsc;
      else { this.sortBy = key; this.sortAsc = true; }
    },
    total() {
      return this.filtered().length;
    },
    totalPages() {
      return Math.max(1, Math.ceil(this.total() / this.pageSize));
    },
    filtered() {
      var q = this.q.trim().toLocaleLowerCase();
      return this.rows.filter(function (r) {
        var hitQ = !q || r.no.toLowerCase().includes(q) || r.title.toLowerCase().includes(q);
        var hitS = this.status === "all" || r.status === this.status;
        return hitQ && hitS;
      }, this);
    },
    paged() {
      var list = this.filtered().slice();
      if (this.sortBy) {
        var k = this.sortBy, dir = this.sortAsc ? 1 : -1, self = this;
        list.sort(function (a, b) {
          var va = a[k], vb = b[k];
          var c = typeof va === "number" && typeof vb === "number" ? va - vb : String(va).localeCompare(String(vb));
          return c * dir;
        });
      }
      if (this.page > this.totalPages()) this.page = this.totalPages();
      return list.slice((this.page - 1) * this.pageSize, this.page * this.pageSize);
    },
    submit() {
      toast("success", "已创建：" + (this.form.name || "（未命名）"));
      this.step = 0;
      this.form = { name: "", type: "doc" };
    },
  };
}


/* 表单模式演示（CMP-FORM） */
function formDemo() {
  return {
    name: "",
    touched: false,
    submitted: false,
    init() {
      const h = (e) => { if (this.dirty) { e.preventDefault(); e.returnValue = ""; } };
      window.addEventListener("beforeunload", h);
    },
    get dirty() { return !!this.name; },
    get showNameError() { return (this.touched || this.submitted) && !this.name.trim(); },
    submit() {
      this.submitted = true;
      if (!this.name.trim()) return;
      toast("success", "已创建：" + this.name);
      this.name = "";
      this.touched = false;
      this.submitted = false;
    },
  };
}

/* Toast（规范 16.3） */
function toast(type, msg) {
  var region = document.getElementById("toasts");
  var el = document.createElement("div");
  el.className = "toast " + type;
  el.setAttribute("role", type === "error" ? "alert" : "status");
  el.textContent = msg;
  region.appendChild(el);
  setTimeout(function () {
    el.style.opacity = "0";
    el.style.transition = "opacity 240ms ease";
    setTimeout(function () { el.remove(); }, 260);
  }, 3200);
}
