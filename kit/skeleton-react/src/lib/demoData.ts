/** 演示数据（中性占位，规范 27 章：示例不含真实凭据） */
export interface DemoRow {
  id: number;
  no: string;
  title: string;
  type: string;
  status: string;
  size: number;
}

const TITLES = ["网络配置手册", "品牌资源中心", "季度运营报告", "培训课程大纲", "故障排查指南",
  "供应商评估表", "安全合规清单", "版本发布说明", "用户调研汇总", "接口对接文档",
  "系统架构图集", "采购流程指引", "库存盘点结果", "培训效果评估", "权限审计报告",
  "备份恢复演练", "容量规划模型", "工单统计分析", "资产折旧明细", "服务等级协议"];
const TYPES = ["doc", "dataset", "report"];
const STATUSES = ["draft", "doing", "published", "archived"];

export function seedData(): DemoRow[] {
  const rows: DemoRow[] = [];
  let s = 42;
  for (let i = 0; i < 57; i++) {
    s = (s * 9301 + 49297) % 233280;
    rows.push({
      id: i + 1,
      no: `REC-2026-${1001 + i}`,
      title: TITLES[i % TITLES.length] + (i >= TITLES.length ? `（续${Math.floor(i / TITLES.length)}）` : ""),
      type: TYPES[s % 3],
      status: STATUSES[(s >> 2) % 4],
      size: (s % 9000) + 60,
    });
  }
  return rows;
}
