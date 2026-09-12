import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { AppShell } from "@/components/AppShell";
import { DataTable } from "@/components/DataTable";
import { ThemeToggle, LangToggle } from "@/components/Toggles";
import { toast } from "@/lib/toast";
import { seedData, type DemoRow } from "@/lib/demoData";

export default function DemoPage() {
  const { t } = useTranslation();
  const [data, setData] = useState<DemoRow[]>(() => seedData());

  return (
    <AppShell
      appTitle={t("app.title")}
      logo={{ src: "assets/ale-logo.png", alt: "Alcatel-Lucent Enterprise", whiteSrc: "assets/ale-logo-white.png" }}
      nav={[
        { label: t("table.title"), href: "#/", current: true },
        { label: "Form / Feedback", href: "#/forms", current: false },
      ]}
      breadcrumb={[{ label: "首页" }]}
      title={t("table.title")}
      description={t("table.subtitle")}
      actions={<>
        <LangToggle />
        <ThemeToggle />
      </>}
    >
      <DataTable
        data={data}
        onDelete={(rows) => {
          const ids = new Set(rows.map((r) => r.id));
          setData((prev) => prev.filter((r) => !ids.has(r.id)));
          toast("success", t("table.deleted", { count: rows.length }));
        }}
      />
      <p className="mt-4 text-xs text-text-muted">
        sample: {data.length} rows · Form / Feedback 链路见导航第二项（#/forms）
      </p>
    </AppShell>
  );
}
