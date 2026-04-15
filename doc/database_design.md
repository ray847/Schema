# Database Design

## Space Domain

### Campus

| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `key` | INTEGER | **PRIMARY KEY** | Auto-generated surrogate key |
| `name` | VARCHAR | **NOT NULL**, **UNIQUE** | Campus Name |
| `address` | VARCHAR | | Address |

### Building

| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `key` | INTEGER | **PRIMARY KEY** | Auto-generated surrogate key |
| `campus_key` | INTEGER | **FOREIGN KEY** → Campus, **NOT NULL** | 所属校区 |
| `name` | VARCHAR | **NOT NULL** | Building Name |
| `building_type` | VARCHAR | | Building type: `academic`, `cafeteria`, `library`, `other` |
| `location` | VARCHAR | | Physical location description |

### Room

| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `key` | INTEGER | **PRIMARY KEY** | Auto-generated surrogate key |
| `building_key` | INTEGER | **FOREIGN KEY** → Building, **NOT NULL** | 所属建筑 |
| `name` | VARCHAR | **NOT NULL** | Room name/number |
| `room_type` | VARCHAR | | Room type: `lecture`, `office`, `laboratory`, `auditorium`, `other` |
| `capacity` | INTEGER | **CHECK** (`capacity` > 0) | 容纳人数 |
| `facility` | JSON | **DEFAULT** `{"power_outlet": 0.0}` | 设施信息 (JSON 格式) |

---

## People & User Domain

### Person

| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `key` | INTEGER | **PRIMARY KEY** | Auto-generated surrogate key |
| `person_code` | VARCHAR | | 人员编号 (如学号、工号) |
| `name` | VARCHAR | **NOT NULL** | 姓名 |
| `role` | VARCHAR | | 角色 (如 Student, Teacher 等) |

### User (待实现)

| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `user_key` | INTEGER | **PRIMARY KEY** | |
| `person_key` | INTEGER | **FOREIGN KEY**, **UNIQUE**, NOT NULL | Associated person |
| `email` | VARCHAR | **UNIQUE**, NOT NULL| |
| `password` | VARCHAR | NOT NULL | Encripted password |
| `type` | VARCHAR | E.g. User, Admin, etc. |

---

## Business Entities

### Course

| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `key` | INTEGER | **PRIMARY KEY** | Auto-generated surrogate key |
| `course_code` | VARCHAR | **UNIQUE**, **NOT NULL** | 课程代码 (如 COMP130001) |
| `name` | VARCHAR | **NOT NULL** | 课程名称 |

### Activity

| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `key` | INTEGER | **PRIMARY KEY** | Auto-generated surrogate key |
| `name` | VARCHAR | **NOT NULL** | 活动名称 |
| `person_key` | INTEGER | **FOREIGN KEY** → Person | 主办人/负责人 |

---

## Associative Domain

### CourseTeacher (课程-教师关联表)

| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `person_key` | INTEGER | **PRIMARY KEY**, **FOREIGN KEY** → Person | 教师 |
| `course_key` | INTEGER | **PRIMARY KEY**, **FOREIGN KEY** → Course | 课程 |
| `responsibility` | VARCHAR | | 授课职责 (如 Lecturer, TA 等) |

> 采用联合主键设计，确保同一教师与课程组合唯一。

### Allocation (排期表)

| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `key` | INTEGER | **PRIMARY KEY** | Auto-generated surrogate key |
| `room_key` | INTEGER | **FOREIGN KEY** → Room, **NOT NULL** | 占用房间 |
| `event_type` | VARCHAR | | 事件类型: `Course`, `Activity` |
| `event_key` | INTEGER | **NOT NULL** | 事件 ID (对应 Course 或 Activity 的 key) |
| `start_time` | DATETIME | **NOT NULL** | 开始时间 |
| `end_time` | DATETIME | **NOT NULL**, **CHECK** (`start_time` < `end_time`) | 结束时间 |

> 作为系统的"时间枢纽"，统一管理房间在特定时间段的占用情况，支持课程与活动的时空排期。

### Preference (待实现)

| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `user_key` | INTEGER | **PRIMARY KEY**, **FOREIGN KEY** | |
| `room_key` | INTEGER | **PRIMARY KEY**, **FOREIGN KEY** (参考 `Course`) | |
| `level`| INTEGER | **CHECK**(-10 <= `level` <= 10) | |

---

## 规范化分析 (Normalization Analysis: 满足 3NF)

本系统数据库在设计之初，便严格遵循了关系型数据库的规范化理论。整体架构不仅彻底消除了数据冗余，还完美规避了插入异常 (Insertion Anomaly)、删除异常 (Deletion Anomaly) 和更新异常 (Update Anomaly)，全面达到了**第三范式 (3NF)** 的标准。

具体设计依据与论证如下：

### 1. 满足第一范式 (1NF)：属性的原子性

系统中所有表的所有字段均满足原子性要求，不存在多值属性或嵌套表。

* **设计体现**：在处理"一个房间具有多个设施属性"时，本设计采用 JSON 格式存储 `facility` 字段，其中的 `power_outlet` 等属性为原子值。在处理"一个用户选修多门课程"或"一个教师讲授多门课程"时，本设计没有在 `Person` 或 `Course` 表中采用逗号分隔的字符串来存储。所有复杂的集合概念均被拆解为独立的行级数据（通过 `CourseTeacher` 等关联表实现）。

### 2. 满足第二范式 (2NF)：消除非主属性对主键的部分函数依赖

2NF 主要针对具有**联合主键**的表（如本系统中的 `CourseTeacher` 表）。本系统确保了中间表中的普通字段必须依赖于**完整的**联合主键，而不是主键的一部分。

* **设计体现 (`CourseTeacher` 表)**：该表通过 `person_key` 和 `course_key` 构成联合主键。其非主属性 `responsibility` (授课职责) 完全依赖于特定的"教师+课程"组合——同一教师在不同课程中可能承担不同职责（如某教师在课程 A 是 Lecturer，在课程 B 是 TA）。`responsibility` 完全依赖于 `(person_key, course_key)` 这个联合主键，严格满足 2NF。

### 3. 满足第三范式 (3NF)：消除非主属性对主键的传递函数依赖

3NF 是本系统架构设计的核心亮点。系统确保了每个非主属性都**直接**依赖于主键，而不依赖于其他非主属性，从而最大程度降低了数据冗余。

* **案例 A：空间域的层级解耦 (Campus → Building → Room)**
  * *常规错误设计*：在 `Room` 表中直接记录 `building_name` 和 `campus_name`。这会导致传递依赖 (`room_key` → `building_key` → `campus_name`)。如果某个校区改名，需要更新无数条房间记录。
  * *本系统设计*：`Room` 表仅保留 `building_key` (外键)，`Building` 表仅保留 `campus_key` (外键)。建筑名称和校区名称被严格隔离在各自的实体表中。当建筑或校区发生变更时，只需在对应表中修改一行数据，彻底消除了**更新异常**。

* **案例 B：人员与账户的解耦 (Person vs. User)**
  * *本系统设计*：将物理实体属性（`name`, `person_code`）归入 `Person` 表，将系统访问属性（`type`）归入 `User` 表，二者通过 `person_key` 关联。这种设计确保了"即便某个教授尚未注册本系统账号，其个人信息依然可以独立存在于系统中（被作为 `CourseTeacher` 的外键引用）"，彻底消除了**插入异常**。

* **案例 C：事件排期的纯粹性 (Allocation)**
  * *本系统设计*：作为智能调度的核心，`Allocation` 表仅存储时间戳、空间 ID (`room_key`) 和事件 ID (`event_key`)。它绝不冗余存储房间的容量 (`capacity`) 或课程的名称 (`name`)。这种高度规范化的设计，使得系统在执行高频的"空闲空间嗅探"算法时，只需在这一张极其轻量级的表上进行极速的索引扫描，大幅提升了查询性能。