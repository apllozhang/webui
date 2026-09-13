/**
 * ALE WebUI Kit — Tailwind 预设（复杂档用）
 * 颜色一律映射 shared/css/tokens.css 的 CSS 变量，禁止在此写具体色值。
 * 用法（skeleton-react/tailwind.config.ts）：
 *   import preset from "./tailwind.preset";
 *   export default { presets: [preset], content: [...], darkMode: "class" };
 */
/** @type {import('tailwindcss').Config} */
export default {
  theme: {
    extend: {
      colors: {
        canvas: "var(--color-canvas)",
        surface: "var(--color-surface)",
        "text-primary": "var(--color-text-primary)",
        "text-secondary": "var(--color-text-secondary)",
        "text-muted": "var(--color-text-muted)",
        border: "var(--color-border)",
        "border-soft": "var(--color-border-soft)",
        action: { DEFAULT: "var(--color-action)", hover: "var(--color-action-hover)" },
        tint: "var(--color-purple-tint)",
        heading: "var(--color-heading-accent)",
        link: "var(--color-link)",
        status: {
          "neutral-text": "var(--status-neutral-text)",
          "neutral-bg": "var(--status-neutral-bg)",
          "info-text": "var(--status-info-text)",
          "info-bg": "var(--status-info-bg)",
          "success-text": "var(--status-success-text)",
          "success-bg": "var(--status-success-bg)",
          "warning-text": "var(--status-warning-text)",
          "warning-bg": "var(--status-warning-bg)",
          "danger-text": "var(--status-danger-text)",
          "danger-bg": "var(--status-danger-bg)",
        },
      },
      borderRadius: { sm: "8px", DEFAULT: "8px", md: "12px", lg: "16px" },
      boxShadow: {
        sm: "var(--shadow-sm)",
        md: "var(--shadow-md)",
        hover: "var(--shadow-hover)",
      },
      transitionDuration: { fast: "160ms", panel: "240ms", enter: "560ms" },
      fontFamily: {
        sans: ['"Trebuchet MS"', '"Noto Sans SC"', '"PingFang SC"', "sans-serif"],
        mono: ['"SFMono-Regular"', "Consolas", '"Liberation Mono"', "monospace"],
      },
      maxWidth: { content: "1180px" },
    },
  },
};
