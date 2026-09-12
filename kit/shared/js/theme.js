/* ============================================================
   ALE WebUI Kit — shared/js/theme.js（规范 14A.7）
   Theme.init({ toggleId }) / Theme.apply / Theme.toggle
   localStorage 持久化 + .dark class + ≤300ms 过渡
   ============================================================ */
(function (global) {
  "use strict";
  var Theme = {
    get: function () { return localStorage.getItem("theme") || "light"; },
    apply: function (theme, animate) {
      var root = document.documentElement;
      if (animate) {
        root.classList.add("theme-transitioning");
        setTimeout(function () { root.classList.remove("theme-transitioning"); }, 300);
      }
      root.classList.toggle("dark", theme === "dark");
      document.querySelectorAll("[data-theme-toggle]").forEach(function (btn) {
        var moon = btn.querySelector(".icon-moon"), sun = btn.querySelector(".icon-sun");
        if (moon) moon.style.display = theme === "dark" ? "none" : "block";
        if (sun) sun.style.display = theme === "dark" ? "block" : "none";
      });
    },
    toggle: function () {
      var next = document.documentElement.classList.contains("dark") ? "light" : "dark";
      localStorage.setItem("theme", next);
      this.apply(next, true);
    },
    init: function () {
      var self = this;
      this.apply(this.get(), false);
      document.querySelectorAll("[data-theme-toggle]").forEach(function (btn) {
        btn.addEventListener("click", function () { self.toggle(); });
      });
    }
  };
  global.ALETheme = Theme;
})(window);
