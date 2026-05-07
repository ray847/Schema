# 系统设计

## 数据库设计

![ER](asset/entity_relation_diagram.svg)

### 核心实体说明
* **空间域**：校区（ID、名称、地址）、建筑（ID、名称、类型、坐标）、房间（ID、容量、设施描述）。
* **事件域**：
  * **课程 (Course)**：包含名称、开课院系、教师及固定排期。
  * **活动 (Activity)**：包含名称、主办单位、时间及地点。
* **关联域 (关键创新点)**：
  * **排期 (rel_Allocation)**：作为整个系统的“时间枢纽”，统一管理房间在特定时间段的占用情况。

### 约束与规范化
* **多对多关系**：用户与课程（Enrollment）、教师与课程（Course_Teacher）均通过中间表实现，确保符合第三范式 (3NF)。
* **数据完整性**：
  * 设置主键及外键引用。
  * 利用 `CHECK` 约束保证容量 > 0，利用 `UNIQUE` 约束保证房间号不重复。
* **索引策略**：针对 `room_id` 和 `start_time` 建立复合索引，以支持高性能的空闲空间检索。

## 架构设计

![Software](asset/software_architecture.svg)

### ToolChain

**API**:
* GraphQL: Database operations.

**Backend**:
* Python: Programming Language.
* SQLite3: For Database operation.
* FastAPI: For client-server communication.
* Strawberry(GraphQL): For creating the GraphQL schema & decoding client queries.

**Frontend**:
* TypeScript: Programming Language.
* React: GUI framework.
* Vite: Build system.
* Apollo Client: For sending queries.
* GraphQL Code Generator: For generating code from server GraphQL schema.

### Backend

#### DB

Functional Programming Wrappers

The database module is organized as a small composable query layer over SQLite instead of exposing raw SQL construction to the GraphQL resolvers. A resolver starts from `db.View(TableRegistry.X)` and then chains wrapper operations such as `filter(...)`, `select(...)`, `append(...)`, `replace(...)`, and `pop(...)`. Each wrapper returns a new view-like object, so database behavior can be described as a pipeline:

```text
TableRegistry -> TableView -> FilterView/SelectView/AppendView/... -> SQLCommand -> DBContext.execute
```

This design keeps three responsibilities separate:

* **Schema definition**: `TableRegistry` stores the canonical table metadata, including primary models, foreign-key models, primary keys, column attributes, and check constraints. `Table.get_create_sql()` derives the concrete `CREATE TABLE IF NOT EXISTS ...` statements from the Pydantic models.
* **SQL generation**: view wrappers are responsible for translating high-level operations into parameterized `SQLCommand` objects. For example, `AppendView` produces `INSERT` statements, `ReplaceView` produces `UPDATE` statements, `PopView` produces `DELETE` statements, and `TableView` provides the base `SELECT * FROM table` command.
* **Execution**: `DBContext.execute()` is the single async execution boundary. It opens a SQLite connection, enables foreign keys, executes the generated commands with bound parameters, commits the transaction, and returns the final result set to the GraphQL resolver.

The wrapper model also improves safety and observability. Values are passed through SQLite parameter binding rather than string interpolation, reducing SQL injection risk for data values. The shared logging utility records generated SQL commands, executed SQL commands, arguments, commits, row counts, and SQLite errors. The log directory is configured by `LOG_DIR` in `.env`, with `logs/database.log` as the default target.

For initialization, `db.setup()` asks `TableRegistry` to generate all schema statements and executes them before optional debug seed data is inserted. Cleanup is isolated in `db.clean()`, which removes the configured SQLite file and records the operation in the same log stream.

### Frontend

#### Pages

Different application pages. Very simple calls to functions / variables in other modules.

#### Components

Reusable React components, e.g. Table, List, Button, etc.

#### Features

Relatively high level features.

#### Api

Wrappers to GraphQL & https queries.

#### Domain

Pure `typescript` logic. Act as basis for high level features.