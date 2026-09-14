# V6.0 发布就绪台账(v6-readiness)

> 性质:发布控制工具,非叙事报告。RC 只读验收以本台账逐行核销为准。
> 维护:每轮 M6 结束更新;RC 验收时冻结为签收基线。
> 基线:第四轮深度评审(9e37e31f,84/100 CONDITIONAL)+ 移交方抽查复核。
> 角色:建设=移交方 AI(自 M6 起);独立评审=第三方评估 AI(M6 第一轮末 + RC 各一次)。

## 一、活动项(Open)

| ID | 严重级 | 发现 | 归属 | 目标 | 断言固化 | 状态 |
|---|---|---|---|---|---|---|
| R4-01 | P1 | NVCI 768px 破版(scrollWidth 865,唯一断点 760px 漏 768 档) | nvci-lite 试点 | M6-A | check-kit OVF768×4 + verify-nvci OVF768 | **fixed(M6-R1,90d2e7e)** |
| R4-02 | P1 | 三试点未接入自托管 Noto(字体请求 0) | 三试点 | M6-A | _font_check.mjs(请求+200+FontFaceSet+字形命中) | **fixed(M6-R1,e42baaa/e3c1d18/4040391,三试点 FONT-CHAIN PASS)** |
| R4-03 | P1 | 试点页面层硬编码色值/近似尺寸 | 三试点 | M6-A/R2 | pilot:tokens-check enforce:**新鲜克隆态三试点全 PASS**(dancpl 0;nvci 3/tsskb 7 白名单带理由)。注:R5 曾证伪"全部 PASS"——dan-cpl 修复当时未提交(93df64b 补交,F20) | **fixed(M6-R2+R5 补丁,克隆态出证)** |
| R4-04 | P1 | 性能预算未建立:主库字体 2,315,396B;dan-cpl 主 JS gzip 882.09kB | 主库+dan-cpl | M6-C | FONT-BUDGET 门禁上线并**扩展覆盖全部交付面**(Kit 750KB;规范站 950KB 基线 894;试点 950/450/750)。真分片实测:Kit 538-677KB、规范站 894、tsskb 893-932、nvci 389。**A 方案已上线(400/700 双字重,线上 0×500 face 实证)**:演示/试点页本未用 500,传输与视觉零变化;≤350KB 的真实路径是 C 方案(按文本子集)——B/C 回退开关在 build-fonts.mjs WEIGHTS 注释。**C 方案已工具化并与 A 共存可切换**:build_fonts_text.py(字库 fonts-text-corpus.txt,525 字)+ 规范站 /fonts-compare.html 对比页(A/C 同屏切换+实时量测);线上实测同页 A 556KB/18 请求 vs C 133KB/2 请求(-76%)。剩:dan-cpl JS 拆账;是否全站切 C 待终审裁决;**dan-cpl JS 拆分已落**(React.lazy×14 页,入口 gzip 882→245,-72%,冒烟通过) | partial(M6-RC 仅剩 M6-V) |
| R4-05 | P2 | R18 交互断言未覆盖键盘链 | 主库门禁 | M6-B | 第一批 5 断言上线(排序/分页/勾选/列宽/focus-visible)+ OVF768;check-kit 34 项 | **fixed(M6-R1)** |
| R4-06 | P2 | 命中区未做粗指针实测(NVCI 34×34 等) | 骨架+试点 | M6-B 二批 | pointer:coarse hit-test | open |
| R4-07 | P2 | 台账语义:未区分 not-applicable/exception;review-by 未绑里程碑 | 主库治理 | M6-A | schema v2 上线(kind 必填 + milestone ≤+45d + 分类计数) | **fixed(M6-R1)** |
| R4-08 | P2 | clean clone 台账门禁缺 yaml;node_modules 半 vendor 态 | 主库工程 | M6-A | yaml 已入跟踪集;彻底去 vendor 化 → M6-R2 决策 | **partial** |
| R4-09 | P2 | dan-cpl 直接 npm install 失败 | dan-cpl | M6-A | preinstall guard + README 首屏声明 | **fixed(M6-R1,f471d9e)** |
| R4-10 | P3 | TSSKB overview 双 h1,验证器只查跳级 | TSSKB | M6-B 二批 | verify-tsskb HIERARCHY | **fixed(M6-RC:正文首 h1 降级,overview [1,2,2,2],661 页重建)** |
| R4-G1 | — | 弹层 Esc 栈/i18n 动态文案/主题跨入口/reduced-motion 四项断言(§5 草案后四项) | 主库门禁 | M6-B 二批 | — | open |
| M6-V | — | 版本真源一次性切换 5.4.1→6.0.0-rc(全部"M2 迁移/进行中"标记清零) | 主库 | M6-RC | VER 门禁改为 6.0.0-rc | open |
| M6-F | — | 字体真 unicode-range 分片(现状:chinese-simplified 整块 1.1MB×2) | 主库 | M6-C | 预算门禁(≤350kB 起步) | open |
| M6-T | — | 试点回流 4 条款入 v6 文档 | 主库文档 | M6-B | — | **done(M6-R1:规则注册表 60→62,零漂移)** |

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
- F20(新,R5 发现):**"已修复"必须以推送后的仓库状态为证,本地工作树验证不算数。** 案例:dan-cpl bridge.css 修复在工作树验证 PASS 但未提交,导致第五轮"三试点全部 PASS"声明被评估方以 GitHub 克隆证伪。对策:凡声明修复,先 `git status` 确认干净、必要时新鲜克隆复验(pilot-tokens-check 现以 _fresh 克隆态出证)。
- F21(新,R5 发现):**性能门禁必须覆盖全部交付面**(Kit/规范站/试点),否则内容页(spec 894KB/tsskb 893KB)超预算门禁不红。FONT-BUDGET 已扩至规范站(check.mjs,950KB 校准)与三试点验证器(950/450/750)。

## 四-M6R2、EXC-2026-0006 已关闭(M6-R2)

`--neutral-bg` 改映射 `var(--status-neutral-bg)`(kit 已有该角色,#EFEFEA≈#efeeec),nvci 不再需要本地中性底例外。台账现余 5 条(4 not-applicable / 1 exception)。

## 四-M6R2、第五轮阻断关闭与终审口径(负责人裁决,2026-09-14)

第五轮两项阻断已关闭:①dan-cpl bridge 修复补交(93df64b)并以 **GitHub 新鲜克隆态**复跑三试点 enforce 全 PASS(F20 对策落地);②FONT-BUDGET 扩展覆盖规范站与三试点(校准值 950/950/450/750,实测 894/893-932/389 全 PASS)。**负责人裁决:不安排单独复核轮,两项关闭证据并入 M6-RC 终审一并核验。**

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
