import { useTranslation } from "react-i18next";
import { ThemeToggle, LangToggle } from "@/components/Toggles";
import DemoPage from "@/pages/DemoPage";

export default function App() {
  const { t } = useTranslation();
  return (
    <>
      <a className="fixed left-4 -top-20 z-[900] rounded-[8px] bg-[color:var(--ale-purple-700)] px-4 py-2 text-white no-underline focus:top-4"
         href="#main">跳到主要内容</a>

      {/* 顶栏（规范 10 章：3px 品牌紫底条 + 半透明模糊） */}
      <header className="topbar">
        <a className="flex items-center gap-3 font-bold no-underline" href="./" aria-label="Alcatel-Lucent Enterprise">
          <img src="assets/ale-logo.png" alt="" className="h-[34px] w-auto dark:hidden" />
          <img src="assets/ale-logo-white.png" alt="" className="hidden h-[34px] w-auto dark:block" />
        </a>
        <span className="text-[15px] text-heading">{t("app.title")}</span>
        <div className="ml-auto flex items-center gap-1">
          <LangToggle />
          <ThemeToggle />
        </div>
      </header>

      <DemoPage />
    </>
  );
}
