/* skeleton-static：导航折叠 + 主题（theme.js 已含主题逻辑） */
(function () {
  "use strict";
  if (window.ALETheme) ALETheme.init();
  var toggle = document.getElementById("nav-toggle");
  var nav = document.getElementById("primary-nav");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", String(open));
    });
  }
})();
