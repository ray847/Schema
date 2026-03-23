#set page(paper: "a4", margin: (x: 2.5cm, y: 2.5cm))
#set text(font: "Linux Libertine", size: 11pt)

#align(center)[
  #block(inset: 2em)[
    #text(weight: "bold", size: 1.5em)[复旦百事通：智能校园调度与问答系统] \
    #v(0.5em)
    #text(style: "italic")[数据库系统课程项目说明书 (Checkpoint 1)]
  ]
]

== 1. 项目背景
随着校园信息量的激增，学生在查询课程安排、设施空闲及地理位置时面临效率低下的困境 [cite: 4]。现有的系统往往信息孤立，缺乏对个人行程的动态优化。

== 2. 系统愿景
本项目旨在设计一个以数据库为核心的智能问答与规划系统 [cite: 5]。不同于传统的静态查询工具，本系统将实现以下核心价值：
- *集中管理*：整合校区、建筑、设施、课程及活动数据 [cite: 12]。
- *智能调度*：根据用户课表（Enrollment）与实时排期（Allocation），提供最优的自习与行动建议。
- *自然语言支持*：通过 NL2SQL 技术，将用户提问转化为精确的数据库查询 [cite: 11]。

== 3. 技术路线
本系统采用轻量化 Web 架构：
- *后端*：FastAPI (Python) 负责逻辑调度与 API 驱动。
- *存储*：SQLite 确保数据的便携性与关系完整性。
- *界面*：Streamlit 提供交互式数据可视化演示。