/** 表单字段容器：Label + 控件 + Help + Error（CMP-FORM，规范 form.md） */
import { cn } from "@/lib/utils";

export function Field({
  label, htmlFor, required, help, error, children, className,
}: {
  label: string; htmlFor?: string; required?: boolean;
  help?: string; error?: string; children: React.ReactNode; className?: string;
}) {
  const errId = error ? `${htmlFor}-error` : undefined;
  const helpId = help ? `${htmlFor}-help` : undefined;
  return (
    <div className={cn("mb-4", className)}>
      <label htmlFor={htmlFor} className="mb-1.5 block text-sm font-bold">
        {label} {required && <span className="text-[color:var(--status-danger-text)]" aria-hidden="true">*</span>}
      </label>
      {children}
      {help && <p id={helpId} className="mt-1.5 text-[13px] text-text-muted">{help}</p>}
      {error && <p id={errId} role="alert" className="mt-1.5 text-[13px] text-[color:var(--status-danger-text)]">{error}</p>}
    </div>
  );
}

/** 给输入控件合成 aria 属性（与 Field 的 help/error 关联） */
export function fieldAria(htmlFor?: string, error?: string, invalid?: boolean) {
  return {
    "aria-invalid": invalid || error ? true : undefined,
    "aria-describedby": [help(htmlFor), errId(htmlFor)].filter(Boolean).join(" ") || undefined,
  };
}
const help = (id?: string) => (id ? `${id}-help` : undefined);
const errId = (id?: string) => (id ? `${id}-error` : undefined);

export { help as helpId, errId as errorId };
