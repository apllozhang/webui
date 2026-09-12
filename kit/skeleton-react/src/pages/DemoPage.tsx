import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { DataTable, type DemoRow } from "@/components/DataTable";
import { toast } from "@/lib/toast";

/** 演示数据：57 条中性记录（无真实凭据，规范 27 章） */
function seedData(): DemoRow[] {
  const titles = ["网络配置手册", "品牌资源中心", "季度运营报告", "培训课程大纲", "故障排查指南",
    "供应商评估表", "安全合规清单", "版本发布说明", "用户调研汇总", "接口对接文档",
    "系统架构图集", "采购流程指引", "库存盘点结果", "培训效果评估", "权限审计报告",
    "备份恢复演练", "容量规划模型", "工单统计分析", "资产折旧明细", "服务等级协议"];
  const types = ["doc", "dataset", "report"];
  const statuses = ["draft", "doing", "published", "archived"];
  const rows: DemoRow[] = [];
  let s = 42;
  for (let i = 0; i < 57; i++) {
    s = (s * 9301 + 49297) % 233280;
    rows.push({
      id: i + 1,
      no: `REC-2026-${1001 + i}`,
      title: titles[i % titles.length] + (i >= titles.length ? `（续${Math.floor(i / titles.length)}）` : ""),
      type: types[s % 3],
      status: statuses[(s >> 2) % 4],
      size: (s % 9000) + 60,
    });
  }
  return rows;
}

export default function DemoPage() {
  const { t } = useTranslation();
  const [data, setData] = useState<DemoRow[]>(() => seedData());

  const sample = useMemo(() => data.slice(0, 8), [data]);

  return (
    <main id="main" tabIndex={-1} className="mx-auto w-[min(calc(100%-2rem),var(--content-max))] py-8">
      <p className="eyebrow">14A · Feature Pack</p>
      <h2 className="text-2xl">{t("table.title")}</h2>
      <p className="mb-6 text-sm text-text-muted">{t("table.subtitle")}</p>

      <DataTable
        data={data}
        onDelete={(rows) => {
          const ids = new Set(rows.map((r) => r.id));
          setData((prev) => prev.filter((r) => !ids.has(r.id)));
          toast("success", t("table.deleted", { count: rows.length }));
        }}
      />

      <p className="mt-4 text-xs text-text-muted">
        sample: {sample.length} rows shown · 数据仅演示结构（规范：示例使用中性占位，不含真实凭据）
      </p>
    </main>
  );
}
