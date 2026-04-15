# Checkpoints

## Checkpoint 1: 需求分析与概念设计 (4/2)

  * 需求说明书：[`doc/requirement.md`](doc/requirement.md)
  * 核心算法与设计：[`doc/overview.pdf`](doc/overview.pdf)
  * 实体-关系图 (ER Diagram)：[`doc/asset/entity_relation_diagram.svg`](doc/asset/entity_relation_diagram.svg)

## Checkpoint 2: 关系模式设计 (4/16)

  * 关系模式与表结构说明：[`doc/database_design.md`](doc/database_design.md)
  * 主键与外键设计：[`doc/database_design.md`](doc/database_design.md)
  * 规范化分析 (3NF 论证)：[`doc/database_design.md`](doc/database_design.md)

## Checkpoint 3: 数据库逻辑结构定稿 (4/30)

  * 完整表结构说明：[`doc/database_design.md`](doc/database_design.md)
  * 约束设计说明 (主键、外键、非空、唯一、检查约束、默认值)：[`doc/database_design.md`](doc/database_design.md)
  * 核心 SQL 草稿：由代码实现：[`backend/src/shared/model/*.py`](backend/src/model/*.py), [`backend/src/db/table.py`](backend/src/db/table.py)

## Checkpoint 4: 数据库实现 (5/14)

  * 建表 SQL：由代码实现：[`backend/src/shared/model/*.py`](backend/src/model/*.py), [`backend/src/db/table.py`](backend/src/db/table.py)
  * 约束实现方案：由代码实现
  * 索引设计：[`doc/database_design.md`](doc/database_design.md)
  * 初始测试数据：待完成

## Checkpoint 5: 系统核心功能开发与阶段整合 (5/28)

  * 前端实现 (React + TypeScript)：[`frontend/src/`](frontend/src/)
  * 后端实现 (FastAPI + GraphQL)：[`backend/src/`](backend/src/)
  * 主要功能实现：已实现全表 CRUD (Campus, Building, Room, Person, Course, Activity, Course_Teacher, Allocation)
  * NL2SQL：待完成

## Checkpoint 6: 项目最终完善 (6/11)

  * 最终可运行版本：待完成
  * GitHub 仓库整理：待完成
  * 自我测试说明：待完成
  * 展示材料与演示视频：待完成