# ALE WebUI 设计体系 · 工作交接文档

> 交接日期：2026-09-12
> 交接对象：接手本项目的同事
> 建议阅读顺序：先读本文 → 再读 `docs/v6/USAGE.md`（开发者视角）→ 最后按需查 `docs/v6/` 规范
> 读完本文你应能：独立运行/修改/部署这套体系，理解每个决策为什么这么做，知道下一步该做什么

---

## 1. 项目起因（为什么做这件事）

公司要建立 **ALE 品牌的 WebUI 设计规范**，用于统一内部 Web 系统的视觉与交互。交付规划分三阶段：

1. **Web（B/S）规范** ← 本项目，已基本完成
2. Doc（文档规范）— 未开始，v6.0 只保证令牌可复用
3. PPT（演示规范）— 未开始

**业务背景**：公司存在三类异构 Web 系统，视觉各自漂移：

| 类型 | 代表系统 | 特点 |
|---|---|---|
| 复杂工具应用 | [ale-dan-cpl-system](https://github.com/apllozhang/ale-dan-cpl-system)（报价管理） | React+Vite+TS+shadcn，登录/表格/导入 |
| 轻量工具应用 | [nvci-lite](https://github.com/apllozhang/nvci-lite)（采集向导） | 原生 HTML/JS + Express |
| 静态内容站 | [TSSKB](https://github.com/apllozhang/TSSKB)（培训知识库） | Python/Jinja2，视觉最佳 |

**硬约束**：ALE Corporate Brand Guidelines（September 2025，PDF 在 `X:\BP 目录\Marketing Resources\ALE Brand\Brand Guidelines\`）——主紫 Pantone 267C `#6B489D`、Trebuchet 字体、Logo 硬规则、官方法律声明。品牌资产目录：`X:\BP 目录\Marketing Resources\ALE Brand\`。

**一句话目标**（专家语）：让 TSSKB、复杂业务系统、轻量向导"看起来属于同一个品牌，同时又不被迫长成同一个页面"，并且这套一致性**可以被工程自动验证**。

---

## 2. 演进经过（每版为什么存在）

| 版本 | 日期 | 干了什么 | 为什么 |
|---|---|---|---|
| v4.1 | 上游 | 通用版规范（先于本项目存在） | 品牌事实已核实过一轮 |
| v5.0 | 09-11 | 三形态锚定三仓库、登录页/向导/表格规范、部署到内网 | 把通用规范落到我们的真实系统 |
| v5.1 | 09-12 | 源码级学习 TSSKB 的 CSS：清爽感四来源、按钮浮起-按压动画、卡片浮动、紫灰阴影、3px 紫底条顶栏；修圆角令牌矛盾 | 用户要求"配色清爽 + 动效" |
| v5.2 | 09-12 | 工程化：**ale-webui-kit 三骨架**（React/Alpine/Static）+ shared 令牌单一来源 + sync 脚本；附录 F 踩坑 F1-F9；附录 G 全量对比度实测（**修掉 muted 4.44:1 不达标**） | "markdown+样式"不够，要可拷贝的骨架 |
| — | 09-12 | 部署：规范站 :8091、Kit :8095（10.10.10.218 Docker）；推 GitHub `apllozhang/webui` | 用户要求线上可看 |
| v5.3 | 09-12 | **M3 机制吸收**（用户决策：底座自研，M3 只吸收机制）：on-* 前景色角色、状态层 8/10/12%、emphasized 缓动、附录 H Ant Design 映射表；**中文字体换自托管 Noto Sans SC**（用户提出雅黑版权顾虑） | 提升质量而不换风格 |
| **专家评审一** | 09-12 | **78/100（B+）**：五项 P0（版本漂移/320px 溢出/热区不达标/排版矛盾/分类轴混用）+ "规范与演示未闭环"总判断 | 提交外部评审 |
| v5.4 | 09-12 | 五项 P0 整改：`design-system.version.json` 版本真源、网格 min() 钳制、热区三档令牌+伪元素扩区、排版五角色表、2 家族×交互模式二维模型；**期间引入 F13 回归**（icon-btn 缺 position:relative，热区铺满顶栏，点导航串扰主题）——用户发现，当日修复回流 | 第一阶段止血 |
| **专家复核二** | 09-12 | **DONE_WITH_CONCERNS，80/100**：确认 320/热区/版本已修复；但指出 **fonts 404（生产）**、二维模型没上演示站、15.2px 卡片标题残留、汇报材料版本残留；给出 v6.0 八周路线（§11）与发布完成定义（§15） | 用户提交复核 |
| v5.4.1 | 09-12 | 勘误：fonts 404 双层根因（deploy tar 清单 + Dockerfile COPY 都漏 fonts）修复 + **资产 200 门禁**；二维模型上演示站；卡片标题统一 16px；汇报编号统一 P0-1~5 | 复核收口 |
| M1 | 09-12 | `design:check` 门禁 12 项（puppeteer-core 驱动本机 Edge，零下载）+ selftest 三类缺陷注入证明能拦 | 专家"门禁先行" |
| M2 | 09-12 | `docs/v6/` 四层信息架构（00-foundations/10-patterns/20-components/30-governance，31 文件）+ 规则稳定 ID + 术语表 + 例外 Schema + 迁移映射 | 长文难查，评审 §5 |
| M3 | 09-12 | **Token JSON 生成链**：tokens/*.json 真源 → build-tokens.mjs 生成 tokens.css×2/preset/文档表格/对比度输入；`--check` 零漂移；contrast-check 46 配对断言 ALL PASS（还抓出并修了 success-bg 4.498:1） | 评审 O3：机器可读令牌 |
| M4 一批 | 09-12 | 四条链路：**App Shell**（AppShell.tsx：顶栏+侧栏+面包屑+页头+移动抽屉）、**Form**（Field/Switch/Radio/Checkbox/ErrorSummary/beforeunload）、**Feedback**（Alert/Skeleton/EmptyState/Drawer/Progress）、Table（已有 14A）；规范四文件按专家模板重写 | 评审 O4 |
| F14 修复 | 09-12 | 用户发现拖列宽带动其他列 → 根因 `min-width:100%`+fixed 的比例分摊 → 双模式宽度（拖过即切精确像素）→ puppeteer 两次拖动法验证两站逐像素通过 | 用户实测 |
| 注释泄漏修复 | 09-12 | 用户发现第一列渲染出中文注释 → JSX 属性行内 `//` 被当文本节点 → 移注释到标签上方 | 用户实测 |

**重要里程碑 tag**：`v5.4.1`（只读基线）。当前 main ≈ `3db914d`。

---

## 3. 专家两轮意见要点（后续工作的依据）

**第一轮（78/100）核心判断**："方向正确、品牌明确，但还是优秀的内部指导，不是可治理、可自动验收的企业级 Design System。先解决文档/令牌/演示/骨架四者不一致，再扩展组件。"

**第二轮复核（80/100）要点**：
- 复核状态 DONE_WITH_CONCERNS；"整改声明不直接视为完成证据，要有命令/截图/URL/SHA"
- 评分别自己改（78→81 应写"内部预测，待外部复核"）
- 门禁 A 从三项扩为五项：版本一致性 / 320px 溢出 / 44px hit-test / **核心资产 HTTP 200 + 控制台零错误** / **演示站文案与规范分类一致**
- 复核通过条件（§8）八条；v6.0 定义（§9）：O1 二维模型、O2 四层文档、O3 机器可读令牌、O4 四条链路、O5 自动门禁、O6 版本与例外治理
- 八周路线（§11）与质量门禁矩阵（§14）；**"门禁先行、契约居中、样板验证、逐步迁移"**

两轮评审原件都在 `docs/review/` 与工作区 `X:\ALE-WEBUI-v5.3-专业评审与优化指南.md`、`X:\ALE-WEBUI-v5.4-整改复核报告.md`。

---

## 4. 环境与访问（接手即用）

### 4.1 在线站点（同一台机器两个地址：203=外网视角，218=内网）

| 地址 | 内容 | 容器名 |
|---|---|---|
| http://10.20.30.203:8091 ≡ http://10.10.10.218:8091 | 规范演示站（自举实现） | `ale-webui-spec` |
| http://10.20.30.203:8095 ≡ http://10.10.10.218:8095 | Kit Hub + react/alpine/static 三骨架 | `ale-webui-kit` |

SSH：`alec@10.10.10.218`（或 10.20.30.203），密码见 `X:\AIWork\10.20.30.203.txt`（P@ssw0rd@5121）。远端目录：`/home/alec/ale-webui-spec`、`/home/alec/ale-webui-kit`。容器均 `--restart unless-stopped`。

### 4.2 本地工作区

- 开发工作区：`D:\AIWork\ZCode\Vibe Coding\WEBUI\`
  - `ale-webui-site/` = spec-site 源码（工作副本）
  - `ale-webui-kit/` = kit 源码（工作副本，tokens/tools 也在这）
  - `ale-webui-site` + `_deploy/` + `ale-webui-kit/deploy/` = 部署脚本
  - `ALE-WEBUI-设计规范-v5.x.md` = 各版规范（工作副本）
  - `_repo_stage/` = **仓库镜像**（push 前把工作副本拷进来；结构见仓库 README）
- GitHub：`apllozhang/webui`，SSH key 已配好（`C:\Users\Administrator\.ssh\id_ed25519`，config 已写）。commit 需带 `-c user.name=apllozhang -c user.email=apllozhang@users.noreply.github.com`（或 git config 进仓库）。
- ⚠️ 注意：`_repo_stage` 与工作区是**手动同步**的（`_sync_stage.py` 是全量脚本）。push 前务必把工作区改动拷进 stage，否则线上有、仓库没有（v5.4.1 注释泄漏 hotfix 就吃过这个亏）。

### 4.3 常用命令

```bash
# 本地起服务
cd ale-webui-site && python -m http.server 8765
cd ale-webui-kit/skeleton-react && npm install && npm run dev   # 开发
cd ale-webui-kit/skeleton-static && pip install jinja2 && python build.py

# 令牌链（改设计只改 kit/tokens/*.json）
cd ale-webui-kit/tools
npm run tokens:build        # 生成 tokens.css×2 + preset + 文档表格 + pairs
npm run tokens:check        # 零漂移校验（CI 用）
npm run tokens:contrast     # 46 对比度断言（ALL PASS 才过）
npm run design:check        # 12 项浏览器门禁（默认测 218:8091，--url 可换）
npm run design:check:selftest
npm run verify:colresize    # 列宽独立性（两次拖动法）

# 部署（工作区执行；内含版本/资产/文案门禁）
cd _deploy && set DEPLOY_HOST=10.10.10.218&& set DEPLOY_PORT=8091&& node deploy.js
cd ale-webui-kit/deploy && set DEPLOY_HOST=10.10.10.218&& set DEPLOY_PORT=8095&& node deploy-kit.js
```

⚠️ Windows shell 注意：`_` 开头的 python 脚本是历次修改的记录（可参考），bash heredoc 不可用，长 python 用脚本文件别用 `-c`（引号会坏），PowerShell 写文件会带 BOM/GBK 问题（read_text 用 `utf-8-sig`，write 用 `io.open(..., newline="\n")`）。

---

## 5. 已完成（可信基线 v5.4.1 + M1–M4 一批）

**体系资产**：
- 规范：单体 v5.4（38 章+附录 A–H，含 F1–F14 踩坑簿、G 对比度表、H Ant 映射）+ docs/v6 四层结构（31 文件，规则 ID 注册表）
- 令牌：tokens/*.json 真源 → 生成 tokens.css（spec-site+kit 同源）、tailwind.preset、文档表格、46 对比度配对
- 骨架：React（AppShell/Form 集/Feedback 集/DataTable 14A 全功能/Toggles/hash 路由双 demo）、Alpine（表格+向导+表单模式）、Static（Jinja2+Pagefind 接入）
- 门禁：design:check 12 项（版本/资产/五档溢出/hit-test/热区/控制台）+ selftest 证明能拦 + tokens:contrast + deploy 内嵌资产/版本/文案门禁
- 线上：两站四个入口全部健康；中文字体 Noto Sans SC 自托管（OFL，真实加载已验证）
- 治理：version.json 真源 + deploy 版本一致性检查；v5.4.1 tag；exceptions Schema 已定义（未启用）

**质量数据**：320px 零溢出；状态文字对比度亮 5.08–6.57 / 暗 6.24–7.65；热区排序/分页/复选框 44px；卡片标题 16px；列宽拖动独立性 puppeteer 验证通过。

## 6. 未完成（按优先级排序）

### 立即（M4 收尾，建议 1 周内）
1. **CI 化**：把 design:check / tokens:check / tokens:contrast 挂 GitHub Actions（PR 即拦截；现在只在部署脚本里）
2. **正确/错误示例库**：四链路各配 ✅/❌ 对照图（评审 §20-components 模板要求）
3. **Alpine/Static 对齐四链路**：Alpine 表格补 Advanced 能力或明确写死 Core 上限；Static 补 App Shell 变体说明
4. **规则 ID 全面覆盖**：当前自动注册只扫"必须/禁止"行，表格内条款有遗漏

### 短期（M5，2–3 周）
5. **三真实项目试点**：TSSKB/dan-cpl/nvci 各选 1–2 页用 v6 组件改造，记录迁移耗时/缺失令牌/例外——**这是 v6.0 发布的硬条件**（评审 §11 第 7 周）
6. **design-exceptions.yml 启用**：Schema 已有，开始真实登记
7. **字体分片化**：unicode-range 分包（现首载 ~2.2MB，评审指出偏重）

### 中期（M6，发布）
8. **干净交付目录**（`tools/make-release.mjs`：拼装+校验+zip）、v6.0 tag + GitHub Release、§15 发布完成定义逐项打勾、三方签字

### Backlog（v6.1+）
Date Picker/Tree/Combobox、图表封装、Figma Variables 同步、五档截图视觉回归、Doc/PPT 阶段规范。

## 7. 未来预期效果（v6.0 完成后什么样）

按专家 §9 六项成果（O1–O6），最终验收是新项目能回答并**自动验证**六个问题：

1. 我属于内容网站还是工具应用？（index.md 决策树，2 分钟）
2. 用哪种交互模式和工程档？（同一张表）
3. 复用哪些 Pattern 和 Component？（四链路 + 20-components）
4. 品牌色/排版/间距/状态是否来自统一令牌？（tokens:check 零漂移）
5. 偏离是否留下原因/责任人/复审时间？（design-exceptions.yml）
6. 发布前能否自动发现版本漂移/资源 404/溢出/热区/无障碍回归？（design:check + CI 门禁）

**验收的黄金标准**：让一个没参与项目的开发者，只拿 USAGE.md + 骨架，在半天内做出一个符合规范的页面，且 design:check 全绿——他不卡壳的地方就是体系成功的地方。

## 8. 关键教训（F1–F15，接手人必读）

| # | 教训 | 一句话 |
|---|---|---|
| F1 | fixed 表格动态列宽 | 显式总宽=Σ列宽；别混 min-width:100% |
| F2/F3 | i18n 插值/页码 | 分支渲染要有兜底；插值函数要单测 |
| F4 | 无哈希文件强缓存 | CSS/JS 用协商缓存（no-cache+etag） |
| F5 | 双清除按钮 | 自定义清除就用 type="text" |
| F6 | Jinja2 内建名 | 模板用下标语法 data["list"] |
| F7 | muted 4.44:1 | 任何文字令牌变更重跑对比度断言 |
| F8/F14 | 子路径 404 / 拖列宽联动 | 构建用相对路径；fixed 表格拖动切精确像素模式 |
| F9/F14b | 热区例外 | 伪元素扩热区的控件必须 position:relative；改完跑 elementFromPoint |
| F10 | 320px 溢出 | 网格列 minmax(min(Npx,100%),1fr) |
| F11 | Times/Arial 回退 | 按钮类必须 font:inherit；mono 栈带中文回退 |
| F12 | 版本漂移 | version.json + 发布前一致性检查 |
| **F13** | **点导航切主题** | **热区/状态层伪元素 + 忘 position:relative = 全栏热区层**；改完必须 hit-test |
| F15 | JSX 注释泄漏 | JSX 标签内禁行内 //，用 {/* */} 或移标签外 |
| 通用 | **fonts.check 假阳性** | 验证字体必须"资产 HTTP 200 + document.fonts 注册数 + check"三件套，单独 check 会被系统字体骗 |
| 通用 | **build 绿 ≠ 运行对** | React import 丢失/FAB 断点写反都是构建不报错的；截图回归是刚需 |
| 通用 | **工作区↔stage 双副本** | push 前必同步，否则线上有仓库没有 |

## 9. 风险与依赖

- **网络**：github.com HTTPS 常被重置（SSH 22 可用，push 走 SSH）；api/codeload 可达。Noto 字体来自 npm（@fontsource/noto-sans-sc），已本地化进仓库。
- **单点**：SSH key 在 Administrator 账户下，接手人需自行生成并加到 GitHub（或让原账号授权）。
- **安全决策记录（负责人已拍板，选 A）**：仓库保持 **Private**；服务器密码硬编码在 `deploy/*/deploy*.js` 是**已知且接受的例外**，不是疏漏。前提与约束：①仓库永不转 Public、不给外部承包商访问；②若未来需要公开或扩大访问面，先执行"密码外置"改造（读未入库的 deploy.secret.json）并更换服务器密码；③服务器密码同时存于 `D:\AIWork\10.20.30.203.txt` 与 deploy 脚本，改动密码需两处同步。
- **203/218 认知**：同一台机器，别当两台部署。
- **品牌依赖**：官方品牌 PDF 与 Logo 在 X:\ 网络盘（`Marketing Resources\ALE Brand\`），接手人确认有权限。**品牌资料移交策略**：日常开发零依赖（Logo 已嵌入骨架、色/字已令牌化）；仅换 Logo/对外发布/Doc-PPT 阶段需要原盘；内部同事给盘权限即可，外部人员只给最小集（两张 PNG + 指南 PDF + 法律 docx）并签使用约束。
- **仓库品牌资产边界**：骨架 `assets/` 内嵌两张官方 Logo PNG 仅限**内部演示**使用；若仓库转公开或交外部承包商，应替换为占位图，Logo 走内部资产渠道分发（品牌资产不进公共 Git）。

## 10. 移交确认清单

> **移交方复核结论（2026-09-12）**：§10 前两项由接手方完成并回填证据，移交方独立复验**全部属实**——
> design-check.json 时间戳/URL 证明为接手方自跑（127.0.0.1:8765 @ 09:23Z）、46 对对比度断言通过、
> 决策树演练截图（1440/320）真实且符合"只改品牌位与业务语义"约束、卡点解除与环境差异已记录并经确认纳入 AGENTS.md。
> **接手确认成立。批准接手方开工 M4 收尾（CI 化 / 示例库 / 骨架对齐 / 规则 ID 全覆盖）。**
> 详见 `review/2026-09-12-接手验收与确认报告.md`。


- [x] 接手人克隆 `apllozhang/webui`，按 §4.3 跑通本地服务与 design:check（12 PASS）——2026-09-12 完成：线上 203:8091 与本地 spec-site 各 12/12 PASS，tokens:contrast 46 对 ALL PASS，证据见 `review/2026-09-12-接手验收与确认报告.md`
- [x] 读 docs/v6/USAGE.md 并完成一次"决策树选型 → 拷骨架 → 改一个页面"——2026-09-12 完成：工具应用型→数据工作台→React，浏览器实测通过，演练记录与截图同上
- [ ] 确认能 SSH 到 218/203 并看到两站（8091/8095）
- [ ] 读完 §8 教训表
- [ ] 与原负责人做一次 30 分钟术语对齐（四概念/二维模型/规则 ID）
- [ ] 确认 v6.0 立项范围与排期（M4 收尾 → M5 试点 → M6 发布）
