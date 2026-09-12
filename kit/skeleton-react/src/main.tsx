import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import DemoPage from "./pages/DemoPage";
import FormsDemo from "./pages/FormsDemo";
import "./i18n";
import "./index.css";

/* 首帧前应用已保存主题（防闪烁） */
document.documentElement.classList.toggle("dark", localStorage.getItem("theme") === "dark");

/* 极简 hash 路由：#/ → 数据表格；#/forms → 表单与反馈演示 */
function useHashRoute() {
  const [hash, setHash] = useState(window.location.hash || "#/");
  useEffect(() => {
    const onHash = () => setHash(window.location.hash || "#/");
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);
  return hash;
}

function Router() {
  const hash = useHashRoute();
  return hash.startsWith("#/forms") ? <FormsDemo /> : <DemoPage />;
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Router />
  </React.StrictMode>,
);
