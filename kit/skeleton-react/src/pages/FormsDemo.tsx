import { useEffect, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { Field } from "@/components/form/Field";
import { ErrorSummary } from "@/components/form/ErrorSummary";
import { Switch, Radio, Checkbox } from "@/components/form/Controls";
import { Alert, Skeleton, EmptyState, Drawer, Progress } from "@/components/feedback";
import { toast } from "@/lib/toast";

/** M4 链路演示页：CMP-FORM / CMP-FB / CMP-SHELL 组合实例 */
export default function FormsDemo() {
  const [name, setName] = useState("");
  const [tier, setTier] = useState("standard");
  const [notify, setNotify] = useState(true);
  const [agree, setAgree] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [drawer, setDrawer] = useState(false);
  const [progress] = useState(68);
  const [loading, setLoading] = useState(true);

  const nameError = submitted && !name.trim() ? "请输入名称。" : "";
  const errors = nameError ? [{ id: "demo-name", label: "名称", message: "请输入名称。" }] : [];

  // 未保存离开提示（FORM：beforeunload）
  useEffect(() => {
    const h = (e: BeforeUnloadEvent) => { if (dirty) { e.preventDefault(); e.returnValue = ""; } };
    window.addEventListener("beforeunload", h);
    return () => window.removeEventListener("beforeunload", h);
  }, [dirty]);

  const submit = () => {
    setSubmitted(true);
    if (!name.trim()) return;
    toast("success", "已创建：" + name);
    setDirty(false);
  };

  return (
    <AppShell
      appTitle="ALE WebUI · M4 Demo"
      logo={{ src: "assets/ale-logo.png", alt: "Alcatel-Lucent Enterprise", whiteSrc: "assets/ale-logo-white.png" }}
      nav={[
        { label: "数据表格", href: "#/", current: false },
        { label: "表单与反馈", href: "#/forms", current: true },
      ]}
      breadcrumb={[{ label: "首页", href: "#/" }, { label: "表单与反馈演示" }]}
      title="表单与反馈链路"
      description="CMP-FORM / CMP-FB / CMP-SHELL 组合实例：Field + 错误摘要 + 只读/禁用 + 未保存提示 + Alert/Skeleton/Empty/Drawer/Progress。"
      actions={<button type="button" className="btn btn-primary" onClick={submit}>创建</button>}
    >
      <ErrorSummary errors={submitted ? errors : []} />
      <Alert tone="info" title="提示">试着输入内容后刷新页面——未保存修改会触发离开提示。</Alert>

      <form className="max-w-[560px]" onSubmit={(e) => { e.preventDefault(); submit(); }}>
        <Field label="名称" htmlFor="demo-name" required help="使用能准确描述内容的简短名称。" error={nameError || undefined}>
          <input id="demo-name" className="input" value={name}
                 onChange={(e) => { setName(e.target.value); setDirty(true); }} />
        </Field>
        <Field label="层级" htmlFor="demo-tier">
          <select id="demo-tier" className="input" value={tier} onChange={(e) => { setTier(e.target.value); setDirty(true); }}>
            <option value="standard">标准</option>
            <option value="pro">专业</option>
          </select>
        </Field>
        <fieldset className="mb-4 border-0 p-0">
          <legend className="mb-1.5 text-sm font-bold">通知渠道</legend>
          <Radio name="ch" value="mail" checked={tier === "standard"} onChange={() => { setTier("standard"); setDirty(true); }} label="邮件" />
          <Radio name="ch" value="sms" checked={tier === "pro"} onChange={() => { setTier("pro"); setDirty(true); }} label="短信" />
        </fieldset>
        <div className="mb-4 flex flex-col gap-1">
          <Switch checked={notify} onChange={(v) => { setNotify(v); setDirty(true); }} label="接收通知" />
          <Checkbox checked={agree} onChange={(v) => { setAgree(v); setDirty(true); }} label="我已阅读并同意条款（必选）" />
        </div>
        <div className="mb-4 flex gap-3">
          <button type="button" className="btn btn-secondary" disabled>只读示例</button>
          <button type="button" className="btn btn-secondary" onClick={() => setDrawer(true)}>打开 Drawer</button>
        </div>
      </form>

      <section className="mt-6 max-w-[560px]">
        <h2 className="text-lg">Feedback 组件</h2>
        <Alert tone="warning" title="警告">配额已使用 80%。</Alert>
        <Alert tone="danger" title="错误">同步失败，已保留本地副本。</Alert>
        <div className="my-3"><Progress value={progress} label="批量导入" /></div>
        <div className="my-3 space-y-2"><Skeleton w="60%" /><Skeleton w="90%" /><Skeleton w="75%" /></div>
        <div className="rounded-[12px] border border-border bg-surface">
          {loading
            ? <div className="p-4"><Skeleton w="40%" h={14} /></div>
            : <EmptyState title="没有待处理的任务" description="全部已完成" action={{ label: "重新加载", onClick: () => setLoading(true) }} />}
        </div>
        <button type="button" className="btn btn-secondary btn-sm mt-2" onClick={() => setLoading((v) => !v)}>切换 Empty / Skeleton</button>
      </section>

      <Drawer open={drawer} onClose={() => setDrawer(false)} title="辅助详情（Drawer）">
        <p className="text-sm text-text-secondary">辅助详情或较长表单使用 Drawer：保留列表上下文，Esc 关闭，焦点圈闭并归还。</p>
        <button type="button" className="btn btn-primary mt-3" onClick={() => { setDrawer(false); toast("success", "已保存"); }}>保存</button>
      </Drawer>
    </AppShell>
  );
}
