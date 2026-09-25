export const profile = {
  "name": "谢沛霖",
  "english": "Peilin Xie",
  "email": "xiepeilin123@sina.cn",
  "github": "https://github.com/w48669664-bit",
  "introduction": "同济大学管理科学与工程硕士，2027 届。拥有京东集团、eBay 与哈啰出行的数据科学与分析实践，关注业务增长、因果推断，以及 AI 应用和 Agent 工作流的落地。",
  "strengths": [
    {
      "title": "业务理解与因果分析",
      "text": "围绕增长、用户体验与资源分配，结合 A/B 实验、Uplift 和因果森林，识别策略的真实增量。"
    },
    {
      "title": "从分析到应用落地",
      "text": "将 SQL、建模与归因能力封装为 Skill，实践 Multi-Agent 协作，也独立开发可运行的 AI 应用。"
    },
    {
      "title": "持续学习与严谨验证",
      "text": "以扎实的数理与编程基础学习新工具，重视数据口径、过程记录和结果复核，持续迭代解决方案。"
    }
  ],
  "selfEvaluation": [
    "习惯先厘清业务目标与问题边界，再选择合适的方法。面对复杂问题，能够从数据口径、用户行为与业务机制三个层面拆解原因，用实验和模型验证判断，也关注结论是否能转化为实际行动。",
    "对新技术保持好奇，愿意主动学习并动手验证。从分析脚本到 AI 应用，会把重复工作沉淀成可复用的工具与流程；在迭代中重视细节、结果复核和过程记录，持续改进使用体验。",
    "工作中注重责任心、沟通与协作，能够清楚表达分析依据、方案取舍与不确定性。既愿意独立推进任务，也重视与业务、算法及运营团队对齐目标，以可交付、可验证的结果回应真实需求。"
  ]
};

export const projects = [
  {
    "id": "lumiframe",
    "name": "智帧华象",
    "english": "Lumiframe",
    "category": "AI 应用",
    "tagline": "把一句话变成可编辑、可配音、可导出的 HTML 视频与 SVG 动画。",
    "description": "面向知识讲解、产品演示与创意表达的一站式 AI 创作工作室。用户描述主题、时长与视觉风格后，可以先审阅分镜，再生成画面和旁白，在同一工作台内完成修改与交付。",
    "image": "lumiframe-home.webp",
    "images": [
      "lumiframe-home.webp",
      "lumiframe-transformer.webp",
      "lumiframe-create.webp"
    ],
    "imageLabels": [
      "创作室首页",
      "Transformer 架构演示",
      "创作与作品设置"
    ],
    "tags": [
      "多模态创作",
      "分镜编排",
      "视频导出"
    ],
    "state": "独立应用",
    "url": "https://lumiframe-dxps.onrender.com",
    "background": "#e7e5e0",
    "problem": "内容创作需要在脚本、画面、配音和剪辑工具间反复切换，修改一个想法往往意味着重做多个环节。",
    "approach": "将文本生成、分镜规划、语音合成与时间线编辑串成一个工作流。支持逐镜修改源码和画面，按真实配音时长组织动画，再通过浏览器与 FFmpeg 渲染导出。",
    "features": [
      "SVG 动效、HTML 讲解短片与交互网页创作",
      "分镜、源码、图层、配音与时间线编辑",
      "SVG / HTML / PNG / GIF / MP4 / WebM 导出"
    ],
    "boundary": "在线服务使用免费实例，首次打开可能需要等待唤醒。复杂视频的生成与渲染耗时取决于作品规模。",
    "stack": "React / TypeScript / Node.js / Chromium / FFmpeg",
    "details": [
      {
        "title": "从描述到分镜",
        "text": "支持 SVG 动画、HTML 讲解短片与交互网页；可选择比例、风格、参考图和声音，先规划分镜，逐镜调整标题、旁白与画面说明。"
      },
      {
        "title": "从生成到成片",
        "text": "将脚本、画面、TTS 配音与时间线连接起来，按实际旁白时长组织动画。支持源码、分镜与音频编辑，并导出 HTML、SVG、PNG、GIF、MP4 等格式。"
      }
    ]
  },
  {
    "id": "workrelay",
    "name": "WorkRelay",
    "english": "工作接力",
    "category": "Agent",
    "tagline": "围绕项目上下文，持续跟进需求变化与交付的工作 Agent。",
    "description": "把会议、反馈、需求和产物放进同一份可追溯的项目记录。项目出现变化时，先厘清来源、比较方案和评估影响，再由使用者确认修改，帮助后续工作延续已有决策。",
    "image": "workrelay-home.webp",
    "images": [
      "workrelay-home.webp",
      "workrelay-compare.webp",
      "workrelay-tasks.webp"
    ],
    "imageLabels": [
      "决策工作台",
      "方案比较与影响分析",
      "任务与交付"
    ],
    "tags": [
      "MCP",
      "项目上下文",
      "可追溯决策"
    ],
    "state": "开源项目",
    "repo": "https://github.com/w48669664-bit/WorkRelay",
    "video": "workrelay-demo.mp4",
    "background": "#e3ece6",
    "problem": "需求散落在会议、聊天与文档中，项目发生变化后，团队很难准确判断哪些任务和交付需要同步更新。",
    "approach": "把来源、要求、任务和文档连接起来。共享领域引擎通过网页与 MCP 提供能力，先展示变化及影响，再由用户确认应用，并保存版本和工作断点。",
    "features": [
      "有来源的方案比较与变更影响分析",
      "文档修复、任务依赖与交付一致性检查",
      "工作断点恢复、项目交接与导出"
    ],
    "boundary": "当前为本地项目工作台，包含 Alexa+ 方向的规则引导体验模拟；未连接真实 Alexa 服务。",
    "stack": "React / TypeScript / Node.js / MCP SDK",
    "details": [
      {
        "title": "识别变化与影响",
        "text": "关联来源、要求、任务和文档，比较候选方案，定位需求变化影响的任务与交付，减少在分散记录中反复寻找上下文。"
      },
      {
        "title": "带着依据继续工作",
        "text": "通过网页和 MCP 共用领域能力，支持文档修复、任务依赖与交付一致性检查。保存版本、工作断点和交接内容，便于回看与恢复。"
      }
    ]
  },
  {
    "id": "collagent",
    "name": "Colla Agent",
    "english": "多 Agent 协作工作台",
    "category": "Agent",
    "tagline": "让多 Agent 的实施、独立审查与验证过程清晰可见。",
    "description": "为 Codex 与 Antigravity 协作构建的本地工作台。围绕同一项任务组织实施、只读审查、验证与交接，将公开活动与真实产物放在一起，便于追踪每轮工作发生了什么。",
    "image": "collagent-overview.webp",
    "images": [
      "collagent-overview.webp",
      "collagent-review.webp",
      "collagent-artifact.webp"
    ],
    "imageLabels": [
      "协作总览 · 历史运行",
      "独立审查与验证记录",
      "实际产物预览"
    ],
    "tags": [
      "Agentic Engineering",
      "独立审查",
      "过程回放"
    ],
    "state": "开源项目",
    "repo": "https://github.com/w48669664-bit/colla-agent",
    "background": "#e8e9f0",
    "problem": "多个 Agent 一起工作时，责任划分、修改权限和停止条件容易变得模糊，最终结果也难以复核。",
    "approach": "保持 Codex 为唯一实现者，让 Antigravity 承担只读规划与审查。记录公开活动、命令、验证与交接，并设置轮次上限及明确停止条件。",
    "features": [
      "唯一写入者与独立只读审查",
      "按轮展示公开活动、验证证据和交接",
      "网页、图片、文档等真实产物预览"
    ],
    "boundary": "本地优先，需要相应 CLI 环境。展示的是公开活动摘要和工具输出，不是模型私有思维链。",
    "stack": "React / TypeScript / Local broker / Agent CLI",
    "details": [
      {
        "title": "明确分工与权限",
        "text": "保持 Codex 为唯一实现者，Antigravity 负责只读规划和审查，设置明确的轮次上限与停止条件，避免多个 Agent 同时修改造成冲突。"
      },
      {
        "title": "让交付可以复核",
        "text": "按轮展示活动摘要、命令、验证证据和交接记录，支持网页、图片与文档产物预览，让审查意见与实际输出对应。"
      }
    ]
  },
  {
    "id": "xiange",
    "name": "弦歌",
    "english": "吉他和弦工作室",
    "category": "AI 应用",
    "tagline": "把歌曲音频转换为可以边听、边看、边校对的吉他练习稿。",
    "description": "从个人吉他练习需求出发，将调性分析、基础和弦估计、歌词时间与指法展示组织在一个播放界面中。上传音频后得到草稿，再通过听辨与编辑逐步校准。",
    "image": "xiange-home.webp",
    "images": [
      "xiange-home.webp",
      "xiange-timeline.webp",
      "xiange-edit.webp"
    ],
    "imageLabels": [
      "歌词与和弦 · 原创示例",
      "和弦时间轴",
      "歌词编辑与校准"
    ],
    "tags": [
      "浏览器音频分析",
      "和弦识别",
      "Whisper"
    ],
    "state": "应用原型",
    "background": "#e9e7e0",
    "problem": "会弹基础和弦，却不容易从一首歌中听出调性和每句对应的和弦。",
    "approach": "在浏览器 Worker 内提取音高特征，结合和弦模板、平滑算法与调性估计生成草稿。分开处理原调与演奏指法，并允许编辑歌词时间和和弦结果。",
    "features": [
      "本地音频解码、调性与基础和弦估计",
      "变调夹建议、吉他指法与慢速播放",
      "歌词时间校准与可选本地 Whisper 识词"
    ],
    "boundary": "自动分析结果为练习草稿，需要人工听辨校正；复杂和声、转调和人声会影响结果。",
    "stack": "React / Web Audio / Web Worker / Meyda / Transformers.js",
    "details": [
      {
        "title": "本地分析与和弦估计",
        "text": "在浏览器 Worker 中提取音高特征，结合和弦模板、平滑算法与调性估计生成基础和弦，减少手动听写的起步成本。"
      },
      {
        "title": "围绕实际演奏设计",
        "text": "区分歌曲原调与演奏指法，提供变调夹建议、慢速播放、指法展示和歌词时间校准；可选本地 Whisper 辅助识别歌词。"
      }
    ]
  },
  {
    "id": "review-desk",
    "name": "交易复盘工作台",
    "english": "Trade Review Workbench 2.0",
    "category": "数据工具",
    "tagline": "从一张持仓截图，完成每日快照、风险检查与交易复盘。",
    "description": "围绕每日收盘后的真实使用流程构建本地交易工作台：导入截图、识别与核对账户数据、保存快照，再查看资金曲线、持仓归因和纪律表现，让零散记录形成连续的复盘过程。",
    "image": "trade-snapshots.webp",
    "images": [
      "trade-snapshots.webp",
      "trade-dashboard.webp",
      "trade-records.webp"
    ],
    "imageLabels": [
      "每日快照 · 示例账户",
      "风险与策略 · 示例账户",
      "交易记录 · 示例账户"
    ],
    "tags": [
      "本地 OCR",
      "风险与归因",
      "复盘执行卡"
    ],
    "state": "本地应用",
    "background": "#e0e7ed",
    "problem": "账户信息分散在截图与交易记录中，手工录入容易遗漏，也难以持续比较风险、策略表现和执行纪律。",
    "approach": "将本地中文 OCR、字段解析、质量校验和人工确认串成日常导入流程。以账户快照与交易记录为基础，计算资金、风险与策略指标，通过同一工作台展示复盘与行动记录。",
    "features": [
      "同花顺截图上传、粘贴、本地 OCR 与人工校对",
      "每日账户快照、资金曲线、持仓归因与风险预警",
      "交易策略、情绪与纪律记录，规则复盘与明日执行卡",
      "本地状态持久化、原子写入与每日结构化备份"
    ],
    "boundary": "截图来自实际运行的 2.0 工作台，使用隔离的合成示例账户；不展示个人真实持仓或收益。当前版本使用本地 OCR 与规则计算，不连接券商、不提供下单能力，也不依赖 AI API。",
    "stack": "React / Vite / JavaScript / macOS Vision / Swift",
    "details": [
      {
        "title": "一张截图完成日常记录",
        "text": "支持拖入、选图或粘贴同花顺截图，通过 macOS Vision 在本机识别资产、资金、盈亏和持仓。展示识别质量、缺失字段与资产勾稽差额，经核对确认后保存，同日期快照自动更新。"
      },
      {
        "title": "从记录走向复盘与执行",
        "text": "整合账户曲线、回撤、策略表现和交易纪律，动态提示仓位、快照时效与异常 R 值。生成规则型复盘摘要和可复制的明日执行卡，通过本地持久化与每日备份保留记录。"
      }
    ]
  },
  {
    "id": "flowquant",
    "name": "FlowQuant",
    "english": "A 股主力资金图谱",
    "category": "数据工具",
    "tagline": "沿着统一的盘中时间轴，观察与比较 A 股板块资金流向。",
    "description": "把分散在行情表格里的资金数据组织成可阅读的图谱，通过资金曲线、焦点板块和行情回放，帮助理解不同板块在同一时点的相对变化。",
    "image": "flowquant-overview.webp",
    "images": [
      "flowquant-overview.webp",
      "flowquant-replay.webp",
      "flowquant-analysis.webp"
    ],
    "imageLabels": [
      "资金全景 · 演示数据",
      "盘中回放 · 演示数据",
      "板块分析 · 演示数据"
    ],
    "tags": [
      "数据可视化",
      "行情回放",
      "市场观察"
    ],
    "state": "可视化原型",
    "background": "#e2e8ec",
    "problem": "多个板块的资金流向分散在表格里，很难直观比较流入流出与变化节奏。",
    "approach": "围绕统一交易时间轴组织资金曲线、板块焦点和回放控制，保留数据来源、日期与模拟状态提示。",
    "features": [
      "板块资金流入流出与时间光标联动",
      "重点板块观察和盘中回放交互",
      "真实数据与回退演示状态区分"
    ],
    "boundary": "原型依赖公开数据可用性；截图中的数据仅展示界面，不代表实时行情或投资建议。",
    "stack": "HTML / CSS / JavaScript / Canvas",
    "details": [
      {
        "title": "把分散指标放到一起",
        "text": "围绕交易时间组织板块资金流入流出、走势曲线与重点板块观察，减少切换表格比较数据的负担。"
      },
      {
        "title": "可回看的交互图谱",
        "text": "时间光标联动图表，支持盘中回放与板块切换，并保留数据日期、来源和模拟状态提示，让展示口径清晰可辨。"
      }
    ]
  }
];

export const experiences = [
  {
    "id": "jd",
    "company": "京东集团",
    "english": "JD.com",
    "logo": "jd-group-complete.svg",
    "role": "数据分析师",
    "team": "京东科技 · 平台量化策略组",
    "date": "2026.03 - 2026.08",
    "location": "北京",
    "focus": [
      "Multi-Agent",
      "Uplift 建模",
      "增长策略"
    ],
    "intro": "将数据分析能力产品化，连接智能工作流、人群策略与业务增长。",
    "contributions": [
      {
        "title": "Multi-Agent 自动化分析工作流",
        "label": "AI 应用实践",
        "result": "常规取数响应效率提升 85%，异动分析与报告生成周期缩短 75%。",
        "workflow": [
          "自然语言需求",
          "SQL 取数",
          "建模与归因",
          "结果解读"
        ],
        "paragraphs": [
          "针对日常取数繁琐、异动归因耗时长及建模流程重复等痛点，构建 Multi-Agent 系统，实现从自然语言需求到数据洞察的全链路自动化。",
          "将 SQL 提数、PSM、Uplift、特征选择（XGBoost / 随机森林）等分析能力封装为标准化 Skill，组织取数、建模、异动归因与结果解读的智能闭环，将重复分析步骤沉淀为可复用的工作流。"
        ]
      },
      {
        "title": "首页活跃场域差异化流量分发",
        "label": "策略建模与实验",
        "result": "低频用户活跃度提升 15%–20%，流量分发整体 ROI 提升 17%。",
        "paragraphs": [
          "为解决签到场景下人群重叠、流量分发失衡与补贴低效的问题，主导完成复杂人群分层与收敛，明确不同用户群体的触达策略。",
          "引入 LightGBM 构建 Uplift 模型，量化现金、业务钩子、活动等不同权益的增量转化，实现差异化智能触达。主导设计算法、人工、随机三轨 A/B 实验，验证模型收益并推动全量上线。"
        ]
      },
      {
        "title": "大 V 价值评估与分层体系建设",
        "label": "用户价值分析",
        "result": "流量与补贴差异化分发的投放精准度提升 20%。",
        "paragraphs": [
          "针对创作者运营粗放、资源分配低效的痛点，应用 XGBoost 构建创作者差异化补贴与流量分发模型，精准识别高留存价值作者。",
          "同时引入随机森林测算创作者 LTV 转化价值（R² = 0.61），以创作者的留存与转化价值为依据，支持流量、补贴的精细化分配，推动社区业务向精细化运营转型。"
        ]
      }
    ],
    "metrics": [
      {
        "value": "+85%",
        "label": "常规取数响应效率",
        "note": "Multi-Agent 自动化取数"
      },
      {
        "value": "−75%",
        "label": "异动分析与报告周期",
        "note": "归因到报告的闭环工作流"
      },
      {
        "value": "+17%",
        "label": "流量分发 ROI",
        "note": "Uplift 分层与三轨实验"
      }
    ],
    "caseStudy": {
      "title": "基于 A/B 实验与因果推断的社区直播场域重构",
      "period": "2026.03 - 2026.06",
      "description": "京东金融社区原视频 Tab 以泛娱乐内容为主，与平台专业金融定位不匹配，互动率及次日留存表现低于预期。通过对标同花顺、天天基金等行业竞品，推动引入专业财经大 V，将视频 Tab 升级为直播 Tab，同时兼顾社区 DAU 与留存稳定。",
      "steps": [
        {
          "title": "规模测算",
          "text": "交叉分析视频与直播用户画像，识别约 1/4–1/3 的潜在迁移用户，为场域改版及人群分层提供依据。"
        },
        {
          "title": "实验设计",
          "text": "基于 SQL 自主编写哈希与加盐取模分桶逻辑，构建实验正交底座。开展 AA 实验，严格校验分流同质性与方差齐性；计算实验最小样本量，在此基础上启动 10% 灰度 A/B 实验，确立 Tab 渗透率、社区次日留存率为核心观测指标。"
        },
        {
          "title": "异质性归因",
          "text": "实验初期大盘次日留存无显著提升，进一步使用 Causal Forest 分析异质性处理效应。发现低净值权益用户轻微受损，而持仓超过 1 万元的交易用户日均停留时长提升 25%、跟投转化率提升 3.2pp，定位整体平均效果背后的人群差异。"
        },
        {
          "title": "策略迭代",
          "text": "协同算法提高专业直播对高潜交易用户的推荐权重，并联合运营引入头部财经大 V。针对低净值用户设计签到激励、直播任务及入门理财内容，经多轮灰度验证后推动流量逐步推全。"
        }
      ],
      "results": [
        {
          "value": "+2.1pp",
          "label": "社区次日留存"
        },
        {
          "value": "+35%",
          "label": "直播 Tab 渗透率"
        },
        {
          "value": "近 60%",
          "label": "大 V 跟投 GMV 环比增长"
        }
      ],
      "conclusion": "全量落地后，形成以专业内容为抓手的高粘性场域，并沉淀「A/B 实验设计 → 异质性归因 → 定向策略调优 → 全量推全」的数据科学业务 SOP。"
    }
  },
  {
    "id": "ebay",
    "company": "eBay",
    "english": "eBay",
    "logo": "ebay.svg",
    "role": "数据科学",
    "team": "中国数据分析中心 CAC",
    "date": "2025.08 - 2026.02",
    "location": "上海",
    "focus": [
      "A/B 实验",
      "Causal Forest",
      "用户体验"
    ],
    "intro": "用因果推断识别用户差异，为跨境业务的产品策略提供依据。",
    "contributions": [
      {
        "title": "用户登录链路优化与策略评估",
        "label": "产品实验",
        "paragraphs": [
          "针对跨境业务新客占比高（超过 70%）导致的前置登录流失痛点，主导延迟登录策略的效果评估。通过设计 A/B 实验，对比延迟登录与原前置登录方案，评估登录时机调整对用户结算链路的影响。"
        ],
        "result": "建立前置登录与延迟登录的实验对照，围绕结算链路评估策略效果，为人群差异分析提供依据。"
      },
      {
        "title": "新老用户的异质性处理效应分析",
        "label": "因果推断",
        "result": "为平台落地差异化登录策略提供数据支撑，避免仅依据整体平均效果做统一决策。",
        "paragraphs": [
          "在实验评估基础上，运用 Causal Forest 因果森林模型，分析新老用户在结算链路中的异质性处理效应（HTE），精准量化延迟登录策略对新用户的正向增益，以及对老用户的负面影响。"
        ]
      }
    ],
    "metrics": [
      {
        "value": ">70%",
        "label": "跨境业务新客占比",
        "note": "登录链路优化的业务背景"
      },
      {
        "value": "A/B",
        "label": "前置与延迟登录对照",
        "note": "评估登录时机的策略效果"
      },
      {
        "value": "HTE",
        "label": "识别新老用户差异",
        "note": "Causal Forest · 异质性效应"
      }
    ],
    "comparison": [
      {
        "audience": "新用户",
        "direction": "正向增益",
        "description": "延迟登录对新客结算链路产生正向影响。",
        "positive": true
      },
      {
        "audience": "老用户",
        "direction": "负向影响",
        "description": "同一策略对老客存在负面影响，需要差异化判断。",
        "positive": false
      }
    ]
  },
  {
    "id": "hello",
    "company": "哈啰出行",
    "english": "Hello Inc.",
    "logo": "hello.png",
    "role": "数据分析师",
    "team": "四轮顺风车事业部",
    "date": "2025.03 - 2025.08",
    "location": "上海",
    "focus": [
      "渠道增长",
      "合成控制法",
      "补贴优化"
    ],
    "intro": "从获客成本到补贴增量，评估每一份投入带来的实际价值。",
    "contributions": [
      {
        "title": "获客渠道结构与预算优化",
        "label": "增长分析",
        "result": "外部获客渠道整体 ROI 从 1.5 提升至 1.8，获客 CPC 下降 8%。",
        "paragraphs": [
          "针对顺风车外部获客渠道占比达 45%、需要优化渠道结构以提升投放 ROI 的需求，收集各渠道 CAC 数据，估算用户 LTV，并据此计算潜在 ROI。",
          "结合不同渠道的获客成本与长期价值，制定按 ROI 排序的每两周预算微调策略，将渠道评估结果转化为可执行的投放预算调整，持续优化外部获客结构。"
        ]
      },
      {
        "title": "新车主首单补贴优化实验",
        "label": "因果推断",
        "result": "识别 40 元补贴的收益拐点，推动试点城市首单完成率达到 80%，7 日留存提升至 55%。",
        "paragraphs": [
          "针对新车主首单补贴同城定价敏感、传统 A/B 实验容易违反独立单元处理值（SUTVA）假设的问题，采用合成控制法（SCM）进行补贴效果评估。",
          "选取新一线城市组成权重池，进行高维特征的权重寻优，构建虚拟对照组。通过测算 30 / 40 / 50 元补贴下的平均处理效应与边际 ROI，精准锁定 40 元为收益拐点，为补贴策略调整提供依据。"
        ]
      }
    ],
    "metrics": [
      {
        "value": "1.5 → 1.8",
        "label": "外部获客渠道 ROI",
        "note": "依据渠道 ROI 调整预算"
      },
      {
        "value": "−8%",
        "label": "获客 CPC",
        "note": "优化获客成本"
      },
      {
        "value": "80%",
        "label": "试点城市首单完成率",
        "note": "合成控制法评估补贴"
      }
    ]
  }
];

export const skills = [
  {
    "title": "AI 应用开发",
    "english": "AI Application Development",
    "text": "从需求拆解、原型搭建到功能验证，借助 AI 编程工具将想法转化为可运行的应用。",
    "items": [
      "Vibe Coding / Codex",
      "React / TypeScript",
      "多模态集成 / Whisper / TTS",
      "Git / GitHub / 网页部署"
    ],
    "evidence": "智帧华象、弦歌与个人应用开发"
  },
  {
    "title": "Agent 与工作流设计",
    "english": "Agentic Engineering",
    "text": "设计角色分工、上下文与工具接口，将可复用能力封装成 Skill，让工作过程可追溯、可审查。",
    "items": [
      "Multi-Agent 协作",
      "MCP / Skill 封装",
      "上下文管理 / 结构化输出",
      "独立审查 / 验证闭环"
    ],
    "evidence": "京东分析工作流、WorkRelay、Colla Agent"
  },
  {
    "title": "数据科学与因果推断",
    "english": "Data Science & Causal Inference",
    "text": "围绕业务问题，结合实验与机器学习评估策略增量，识别不同人群的异质性收益。",
    "items": [
      "SQL / Python / Pandas / NumPy",
      "A/B 实验 / PSM / SCM",
      "Uplift / Causal Forest",
      "LightGBM / XGBoost / 随机森林"
    ],
    "evidence": "京东集团、eBay 与哈啰出行实习"
  },
  {
    "title": "分析表达与业务协作",
    "english": "Analytics & Communication",
    "text": "建立清晰的指标口径，用可视化与结果解读支持决策，将分析结论转化为可执行的建议。",
    "items": [
      "Tableau / Power BI / Excel",
      "Matplotlib / 数据可视化",
      "指标体系 / 用户分层 / LTV",
      "英语工作沟通 / IELTS 6.5"
    ],
    "evidence": "增长分析、策略复盘与数据产品实践"
  }
];

export const techStack = [
  {
    "title": "编程与数据处理",
    "items": [
      "SQL",
      "Python",
      "Pandas",
      "NumPy",
      "SciPy",
      "JavaScript",
      "TypeScript"
    ]
  },
  {
    "title": "机器学习与深度学习",
    "items": [
      "Scikit-learn",
      "LightGBM",
      "XGBoost",
      "随机森林",
      "分类 / 回归 / 聚类",
      "PyTorch",
      "CNN",
      "Transformer"
    ]
  },
  {
    "title": "实验与因果推断",
    "items": [
      "A/B 实验",
      "AA 检验",
      "PSM",
      "合成控制法 SCM",
      "Uplift Modeling",
      "Causal Forest",
      "HTE 分析"
    ]
  },
  {
    "title": "AI 应用与 Agent",
    "items": [
      "Codex",
      "Vibe Coding",
      "Multi-Agent",
      "MCP",
      "Skill 封装",
      "上下文管理",
      "Whisper",
      "TTS"
    ]
  },
  {
    "title": "应用工程与交付",
    "items": [
      "React",
      "Vite",
      "Node.js",
      "Git / GitHub",
      "GitHub Pages",
      "Web Audio",
      "Web Worker",
      "FFmpeg"
    ]
  },
  {
    "title": "可视化与业务分析",
    "items": [
      "Matplotlib",
      "Tableau",
      "Power BI",
      "Excel",
      "指标体系",
      "用户分层",
      "LTV / CAC / ROI"
    ]
  }
];

export const awards = [
  {
    "title": "本科生国家奖学金",
    "type": "国家级奖学金",
    "group": "scholarship",
    "featured": true
  },
  {
    "title": "苏州大学学业特等奖学金",
    "type": "校级奖学金",
    "group": "scholarship"
  },
  {
    "title": "苏州大学创新创业特等奖学金",
    "type": "校级奖学金",
    "group": "scholarship"
  },
  {
    "title": "黄乾亨捐助类奖学金",
    "type": "捐助类奖学金",
    "group": "scholarship"
  },
  {
    "title": "美国大学生数学建模竞赛",
    "prize": "F 题特等奖提名奖",
    "type": "国际竞赛 / 队长",
    "group": "competition",
    "featured": true
  },
  {
    "title": "华数杯全国大学生数学建模竞赛",
    "prize": "全国特等奖",
    "type": "全国竞赛",
    "group": "competition"
  },
  {
    "title": "全国大学生市场调研大赛",
    "prize": "全国三等奖",
    "type": "全国竞赛",
    "group": "competition"
  },
  {
    "title": "挑战杯全国大学生课外学术科技作品竞赛",
    "prize": "省级三等奖",
    "type": "省级竞赛",
    "group": "competition"
  }
];
