/* ============================================================
   ALE WebUI Kit — shared/js/i18n.js（规范 14A.8 轻量档模式）
   用法：
     ALEI18n.init({ zh: {...}, en: {...}, default: "zh" });
     ALEI18n.t("table.col.title")
     ALEI18n.setLang("en")   // 持久化 + <html lang> 同步 + 重渲染 [data-i18n]
   ============================================================ */
(function (global) {
  "use strict";
  var LANG_KEY = "lang";
  var listeners = [];
  var state = { dicts: {}, lang: "zh", fallback: "zh" };

  var I18n = {
    get lang() { return state.lang; },
    init: function (opts) {
      state.dicts = opts.dicts || {};
      state.fallback = opts.default || "zh";
      state.lang = localStorage.getItem(LANG_KEY) || state.fallback;
      if (!state.dicts[state.lang]) state.lang = state.fallback;
      document.documentElement.lang = state.lang === "zh" ? "zh-CN" : state.lang;
      this.apply();
    },
    t: function (key) {
      var args = Array.prototype.slice.call(arguments, 1);
      var str = (state.dicts[state.lang] || {})[key];
      if (str == null) str = (state.dicts[state.fallback] || {})[key];
      if (str == null) str = key;
      var i = 0;
      return String(str).replace(/%[sd]/g, function () {
        var v = args[i++];
        return v != null ? v : "";
      });
    },
    setLang: function (lng) {
      if (!state.dicts[lng] || lng === state.lang) return;
      state.lang = lng;
      localStorage.setItem(LANG_KEY, lng);
      document.documentElement.lang = lng === "zh" ? "zh-CN" : lng;
      this.apply();
      listeners.forEach(function (fn) { fn(lng); });
    },
    apply: function () {
      var self = this;
      document.querySelectorAll("[data-i18n]").forEach(function (el) {
        var v = self.t(el.getAttribute("data-i18n"));
        if (el.tagName === "INPUT") el.setAttribute("placeholder", v);
        else el.textContent = v;
      });
      document.querySelectorAll("[data-i18n-aria]").forEach(function (el) {
        el.setAttribute("aria-label", self.t(el.getAttribute("data-i18n-aria")));
      });
      document.querySelectorAll("[data-i18n-placeholder]").forEach(function (el) {
        el.setAttribute("placeholder", self.t(el.getAttribute("data-i18n-placeholder")));
      });
    },
    onChange: function (fn) { listeners.push(fn); }
  };

  global.ALEI18n = I18n;
})(window);
