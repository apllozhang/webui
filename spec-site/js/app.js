/* ============================================================
   ALE WebUI v5.1 — app.js（主题 / 导航 / 模态 / Toast / 演示）
   ============================================================ */
(function () {
  "use strict";
  var ALE = (window.ALE = window.ALE || {});
  var i18n = ALE.i18n;

  /* ── 主题（14A.7） ── */
  var themeBtn = document.getElementById("theme-toggle");
  function applyTheme(theme, animate) {
    var root = document.documentElement;
    if (animate) {
      root.classList.add("theme-transitioning");
      setTimeout(function () { root.classList.remove("theme-transitioning"); }, 300);
    }
    root.classList.toggle("dark", theme === "dark");
    var moon = themeBtn.querySelector(".icon-moon");
    var sun = themeBtn.querySelector(".icon-sun");
    moon.style.display = theme === "dark" ? "none" : "block";
    sun.style.display = theme === "dark" ? "block" : "none";
  }
  var savedTheme = localStorage.getItem("theme") || "light";
  applyTheme(savedTheme, false);
  themeBtn.addEventListener("click", function () {
    var next = document.documentElement.classList.contains("dark") ? "light" : "dark";
    localStorage.setItem("theme", next);
    applyTheme(next, true);
  });

  /* ── 移动端导航 ── */
  var navToggle = document.getElementById("nav-toggle");
  var nav = document.getElementById("primary-nav");
  navToggle.addEventListener("click", function () {
    var open = nav.classList.toggle("open");
    navToggle.setAttribute("aria-expanded", String(open));
  });
  nav.addEventListener("click", function (e) {
    if (e.target.closest("a") && nav.classList.contains("open")) {
      nav.classList.remove("open");
      navToggle.setAttribute("aria-expanded", "false");
    }
  });

  /* 当前导航项（IntersectionObserver 驱动 aria-current） */
  var navLinks = Array.prototype.slice.call(nav.querySelectorAll('a[href^="#"]'));
  var sections = navLinks
    .map(function (a) { return document.querySelector(a.getAttribute("href")); })
    .filter(Boolean);
  if ("IntersectionObserver" in window && sections.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          navLinks.forEach(function (a) {
            a.setAttribute("aria-current", String(a.getAttribute("href") === "#" + en.target.id));
          });
        }
      });
    }, { rootMargin: "-40% 0px -55% 0px" });
    sections.forEach(function (s) { io.observe(s); });
  }

  /* ── 语言菜单（14A.8） ── */
  var langBtn = document.getElementById("lang-btn");
  var langMenu = document.getElementById("lang-menu");
  function renderLangMenu() {
    langMenu.innerHTML = "";
    i18n.languages.forEach(function (l) {
      var b = document.createElement("button");
      b.type = "button";
      b.setAttribute("role", "menuitemradio");
      b.setAttribute("aria-checked", String(l.code === i18n.lang));
      b.innerHTML = "<span>" + l.label + "</span>" + (l.code === i18n.lang ? "✓" : "");
      b.addEventListener("click", function () {
        i18n.setLang(l.code);
        langMenu.classList.remove("open");
        langBtn.setAttribute("aria-expanded", "false");
      });
      langMenu.appendChild(b);
    });
  }
  langBtn.addEventListener("click", function () {
    renderLangMenu();
    var open = langMenu.classList.toggle("open");
    langBtn.setAttribute("aria-expanded", String(open));
  });
  document.addEventListener("click", function (e) {
    if (!e.target.closest(".lang-menu")) {
      langMenu.classList.remove("open");
      langBtn.setAttribute("aria-expanded", "false");
    }
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      langMenu.classList.remove("open");
      langBtn.setAttribute("aria-expanded", "false");
    }
  });

  /* ── Toast（16.3） ── */
  var toastRegion = document.getElementById("toast-region");
  var ICONS = {
    success: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg>',
    info: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 8h.01M12 12v5"/></svg>',
    error: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 8v5m0 3h.01"/></svg>'
  };
  ALE.toast = function (type, msg) {
    var el = document.createElement("div");
    el.className = "toast " + type;
    el.setAttribute("role", type === "error" ? "alert" : "status");
    el.innerHTML = '<span class="t-icon">' + ICONS[type] + '</span><span></span>';
    el.lastElementChild.textContent = msg;
    toastRegion.appendChild(el);
    setTimeout(function () {
      el.style.opacity = "0";
      el.style.transition = "opacity 240ms ease";
      setTimeout(function () { el.remove(); }, 260);
    }, 3600);
  };

  /* ── 模态框（17 章：焦点入内/圈闭/Esc/焦点归还） ── */
  ALE.openModal = function (overlay) {
    overlay.classList.add("open");
    overlay._trigger = document.activeElement;
    var focusables = overlay.querySelectorAll("button, [href], input, select, textarea");
    var first = overlay.querySelector(".modal h3") || focusables[0];
    (first && first.focus ? focusables[0] : first).focus();
    overlay.addEventListener("keydown", function trap(e) {
      if (e.key === "Escape") { ALE.closeModal(overlay); return; }
      if (e.key !== "Tab") return;
      var list = Array.prototype.filter.call(overlay.querySelectorAll("button, [href], input, select, textarea"), function (el) { return !el.disabled; });
      if (!list.length) return;
      var firstEl = list[0], lastEl = list[list.length - 1];
      if (e.shiftKey && document.activeElement === firstEl) { lastEl.focus(); e.preventDefault(); }
      else if (!e.shiftKey && document.activeElement === lastEl) { firstEl.focus(); e.preventDefault(); }
    });
  };
  ALE.closeModal = function (overlay) {
    overlay.classList.remove("open");
    if (overlay._trigger && overlay._trigger.focus) overlay._trigger.focus();
  };
  document.querySelectorAll("[data-modal-close]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      ALE.closeModal(btn.closest(".modal-overlay"));
    });
  });
  document.querySelectorAll(".modal-overlay").forEach(function (ov) {
    ov.addEventListener("mousedown", function (e) {
      if (e.target === ov && ov.dataset.dismissable !== "false") ALE.closeModal(ov);
    });
  });

  /* ── 演示：加载按钮 ── */
  var loadBtn = document.getElementById("demo-loading-btn");
  loadBtn.addEventListener("click", function () {
    if (loadBtn.disabled) return;
    var original = loadBtn.innerHTML;
    loadBtn.disabled = true;
    loadBtn.innerHTML = '<span class="spinner" aria-hidden="true"></span>' + i18n.t("comp.button.loading.on");
    setTimeout(function () {
      loadBtn.disabled = false;
      loadBtn.innerHTML = original;
      i18n.apply();
      ALE.toast("success", i18n.t("toast.saved"));
    }, 1600);
  });

  /* ── 演示：表单错误态 ── */
  var demoInput = document.getElementById("demo-title");
  document.getElementById("demo-error-btn").addEventListener("click", function () {
    demoInput.setAttribute("aria-invalid", "true");
    demoInput.closest(".field").classList.add("has-error");
    demoInput.closest(".field").querySelector(".error").hidden = false;
    demoInput.focus();
  });
  document.getElementById("demo-reset-btn").addEventListener("click", function () {
    demoInput.removeAttribute("aria-invalid");
    demoInput.value = "";
    demoInput.closest(".field").classList.remove("has-error");
    demoInput.closest(".field").querySelector(".error").hidden = true;
  });
  demoInput.addEventListener("input", function () {
    if (demoInput.value && demoInput.getAttribute("aria-invalid") === "true") {
      demoInput.removeAttribute("aria-invalid");
      demoInput.closest(".field").classList.remove("has-error");
      demoInput.closest(".field").querySelector(".error").hidden = true;
    }
  });

  /* ── 演示：模态框打开 ── */
  document.getElementById("demo-modal-btn").addEventListener("click", function () {
    ALE.openModal(document.getElementById("demo-modal"));
  });
  document.getElementById("demo-modal-cancel").addEventListener("click", function () {
    ALE.closeModal(document.getElementById("demo-modal"));
  });
  document.getElementById("demo-modal-ok").addEventListener("click", function () {
    ALE.closeModal(document.getElementById("demo-modal"));
    ALE.toast("error", i18n.t("toast.failed"));
  });

  /* ── 演示：Toast ── */
  document.getElementById("demo-toast-success").addEventListener("click", function () { ALE.toast("success", i18n.t("toast.saved")); });
  document.getElementById("demo-toast-info").addEventListener("click", function () { ALE.toast("info", i18n.t("toast.hint")); });
  document.getElementById("demo-toast-error").addEventListener("click", function () { ALE.toast("error", i18n.t("toast.failed")); });

  /* ── 演示：入场动画重放 ── */
  document.getElementById("motion-replay").addEventListener("click", function () {
    var tiles = document.getElementById("motion-tiles");
    tiles.classList.remove("enter-once");
    void tiles.offsetWidth; /* reflow 重新触发 */
    tiles.classList.add("enter-once");
  });

  /* ── 启动 ── */
  /* 版本徽章:运行时取 design-system.version.json 真源渲染(迭代只改 JSON,徽章自动跟随) */
  fetch("design-system.version.json", { cache: "no-cache" })
    .then(function (r) { return r.ok ? r.json() : null; })
    .then(function (vj) {
      if (!vj) return;
      var short_ = vj.short || ("v" + vj.version.split(".").slice(0, 2).join("."));
      var badge = document.getElementById("ver-badge");
      if (badge) badge.innerHTML = '<span class="ver-short"></span><span class="ver-date"></span>';
      if (badge) {
        badge.querySelector(".ver-short").textContent = short_;
        badge.querySelector(".ver-date").textContent = vj.released ? " · " + vj.released : "";
      }
    })
    .catch(function () { /* 真源不可达时徽章留空,不阻塞页面 */ });

  i18n.apply();
  if (!localStorage.getItem("lang")) {
    document.documentElement.lang = "zh-CN";
  } else {
    document.documentElement.lang = i18n.lang === "zh" ? "zh-CN" : i18n.lang;
  }
})();
