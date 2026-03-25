# Schema

**复旦大学数据库系统课程项目**

本项目是一个基于关系型数据库的校园智能调度系统。在提供基础信息检索之上，结合整数规划算法与用户偏好，动态推荐最优的空闲校园空间（如带插座的自习室）。

## 仓库目录 (Repository Structure)

```text
.
├── doc/                        # 项目文档
│   ├── overview.pdf            # 项目总览
│   ├── requirement.md          # 需求分析与业务场景实例
│   ├── database_design.md      # 表结构、主外键设计与 3NF 规范化分析
│   ├── system_design.md        # 系统架构设计
│   ├── todo.md                 # 进度追踪
│   ├── asset/                  # D2 源码与渲染生成的 SVG 图表 (ER图/流程图)
│   └── ...
│
├── src/                        # 源代码
│
├── checkpoint.md               # 阶段交付导航
├── README.md
└── ...
```

## 技术栈 (Tech Stack)

  * **数据库**: SQLite3 (原生 SQL + SQLAlchemy)
  * **后端**: FastAPI (Python)
  * **前端**: Streamlit
