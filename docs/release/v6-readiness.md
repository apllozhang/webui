# V6.0 发布就绪台账(v6-readiness)

> 性质:发布控制工具,非叙事报告。RC 只读验收以本台账逐行核销为准。
> 维护:每轮 M6 结束更新;RC 验收时冻结为签收基线。
> 基线:第四轮深度评审(9e37e31f,84/100 CONDITIONAL)+ 移交方抽查复核。
> 角色:建设=移交方 AI(自 M6 起);独立评审=第三方评估 AI(M6 第一轮末 + RC 各一次)。

## 一、活动项(Open)

| ID | 严重级 | 发现 | 归属 | 目标 | 断言固化 | 状态 |
|---|---|---|---|---|---|---|
| R4-01 | P1 | NVCI 768px 破版(scrollWidth 865,唯一断点 760px 漏 768 档) | nvci-lite 试点 | M6-A | 768 三档断言(第一批) | open |
| R4-02 | P1 | 三试点未接入自托管 Noto(字体请求 0) | 三试点 | M6-A | FontFaceSet+请求+200 门禁 | open |
| R4-03 | P1 | 试点页面层硬编码色值/近似尺寸(TSSKB content.css、NVCI styles.css、dancpl bridge #fff) | 三试点 | M6-A | pilot:tokens-check 扫描(白名单+例外) | open |
| R4-04 | P1 | 性能预算未建立:主库字体 2,315,396B;dan-cpl 主 JS gzip 882.09kB | 主库+dan-cpl | M6-C | 字体/JS 预算门禁 | open |
| R4-05 | P2 | R18 交互断言未覆盖键盘链(排序/分页/批量/列宽在 React 实现良好但无 CI 保护) | 主库门禁 | M6-B | 第一批断言 6 项 | open |
| R4-06 | P2 | 命中区未做粗指针实测(NVCI 34×34 等) | 骨架+试点 | M6-B 二批 | pointer:coarse hit-test | open |
| R4-07 | P2 | 台账语义:未区分 not-applicable/exception;0005/0006 review-by 未绑 RC | 主库治理 | M6-A | exceptions:check schema v2 | open |
| R4-08 | P2 | clean clone 台账门禁非开箱即跑(缺 yaml);node_modules 入库 | 主库工程 | M6-A | README npm ci + CI clean install | open |
| R4-09 | P2 | dan-cpl 直接 npm install 失败(Vite7 peer 冲突),仅 pnpm | dan-cpl | M6-A | README 首屏 + guard | open |
| R4-10 | P3 | TSSKB overview 双 h1,验证器只查跳级 | TSSKB | M6-B 二批 | landmark 感知校验 | open |
| R4-G1 | — | 弹层 Esc 栈/i18n 动态文案/主题跨入口/reduced-motion 四项断言(§5 草案后四项) | 主库门禁 | M6-B 二批 | — | open |
| M6-V | — | 版本真源一次性切换 5.4.1→6.0.0-rc(全部"M2 迁移/进行中"标记清零) | 主库 | M6-RC | VER 门禁改为 6.0.0-rc | open |
| M6-F | — | 字体真 unicode-range 分片(现状:chinese-simplified 整块 1.1MB×2) | 主库 | M6-C | 预算门禁(≤350kB 起步) | open |
| M6-T | — | 试点回流 4 条款入 v6 文档(768 堆叠/徽章色板/中性底/bridge 模式) | 主库文档 | M6-B | — | open |

## 二、已关闭项(Closed,一行核销)

| ID | 结论 | 证据 |
|---|---|---|
| R1-R10(M4) | 全部修复,37 项门禁全绿 | docs/review/2026-09-13-R1-R10验收结论-移交方.md |
| R11 filler | DOM 量测关闭(Σ列宽=表宽,末列右缘对齐) | 同上 §二 |
| R12-R18(第二轮 N1-N6) | 全部修复;R18 交互门禁上线;注入回归门禁变红 | docs/review/2026-09-14-R11-R18验收结论-移交方.md |
| R19 台账 | 6 条入库,exceptions:check 本机复跑通过 | docs/review/2026-09-14-M5首轮验收结论-移交方.md |
| R20 复选框 aria-invalid | 线上实测 agreeAriaInvalidOnError=true | 同上 |
| M5 三试点首拍 | TSSKB 12/12、NVCI 8/8 独立复现;dan-cpl E2E 由第四轮补齐 6/6 | 同上 + evidence-round4 |

## 三、验收教训登记(F 系列)

- F18(新):验收断言的覆盖面必须 ≥ 验收声明的覆盖面。案例:两断点声明(320/1440)漏 768;查令牌变量解析≠查字体请求;"bridge 全覆盖"≠页面零硬编码。
- F19(新):门禁"形式通过"须区分语义类别(台账 not-applicable vs exception;对比度 PASS/SKIP/EXEMPT 三分类即先例)。

## 四、M6 放行路线(经评估方路线微调:A+B 合并)

- **M6-R1(A+B 合并)**:R4-01/02/03/07/08/09 + R4-05 第一批 6 断言(键盘排序/分页/批量/列宽/focus-visible/768 三档)+ M6-T 回流条款 + pilot:tokens-check 工具。出口:门禁全绿 + 三试点验证全过 + 评估 AI 中途复评。
- **M6-R2(C)**:M6-F 字体真分片 + 预算门禁(字体 ≤350kB 起步、dan-cpl JS 按设计系统增量拆账)、dan-cpl 路由级分割、R4-06/R4-10/R4-G1 第二批断言。出口:预算达标 + 全绿。
- **M6-RC**:M6-V 版本切换 6.0.0-rc + fresh clone 全门禁 + 三试点 E2E + 评估 AI 只读验收(对着本台账逐行核销)→ 三方签收 → 6.0.0 Release。

## 五、四轮分数轨迹

| 轮次 | SHA | 分数 | 裁决 | 覆盖面 |
|---|---|---:|---|---|
| 一 | 3312bf0 | 68 | BLOCKED | 主库 |
| 二 | 3ad63fd | 82 | CONDITIONAL | 主库 |
| 三 | 2b2af56 | 91 | PASS(M5 受控) | 主库 |
| 四 | 9e37e31 | 84 | CONDITIONAL | 主库+三试点+768+WCAG+性能(分母扩大,非退步) |
