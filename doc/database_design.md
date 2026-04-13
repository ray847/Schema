# Database Design

## Space Domain

### Campus

| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `campus_id` | INTEGER | **PRIMARY KEY** | |
| `name` | VARCHAR | NOT NULL, **UNIQUE** | Campus Name |
| `address` | VARCHAR | | Address |

### Building

| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `building_id` | INTEGER | **PRIMARY KEY** | |
| `campus_id` | INTEGER | **FOREIGN KEY**, NOT NULL | |
| `name` | VARCHAR | NOT NULL | Building Name |
| `type` | VARCHAR | | Building type (e.g. Labatory, Cafeteria, Classroom, etc.)|
| `location` | VARCHAR | | Physical location (used for distance calculations) |

### Room & Facility

| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `room_id` | INTEGER | **PRIMARY KEY** | |
| `building_id` | INTEGER | **FOREIGN KEY** NOT NULL | |
| `name` | VARCHAR | NOT NULL | |
| `type` | VARCHAR | | Room type (e.g. Meeting room, Classroom, Reading Room) |
| `capacity` | INTEGER | **CHECK** (`capacity` > 0) ||
| `power_outlet` | INTEGER | DEFAULT FALSE | Power outlet availability |

---

## People & User Domain

### Person

| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `person_id` | INTEGER | **PRIMARY KEY** | |
| `person_code` | VARCHAR | | Commonly used alias (e.g. student number, etc.) |
| `name` | VARCHAR | NOT NULL | |
| `role` | VARCHAR | | E.g. Student, Professor, etc. |

### User

| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `user_id` | INTEGER | **PRIMARY KEY** | |
| `person_id` | INTEGER | **FOREIGN KEY**, **UNIQUE**, NOT NULL | Associated person |
| `email` | VARCHAR | **UNIQUE**, NOT NULL| |
| `password` | VARCHAR | NOT NULL | Encripted password |
| `type` | VARCHAR | E.g. User, Admin, etc. |

## Business Entities

### Course

| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `course_id` | INTEGER | **PRIMARY KEY** | |
| `course_code` | VARCHAR | **UNIQUE**, NOT NULL | course code (e.g. COMP130001) |
| `name` | VARCHAR | NOT NULL | |

### Activity

| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `activity_id` | INTEGER | **PRIMARY KEY** | |
| `name` | VARCHAR | NOT NULL | 活动名称 |
| `person_id` | INTEGER | **FOREIGN KEY** | Host |

---

## Associative Domain

### Enrollment

| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `person_id` | INTEGER | **PRIMARY KEY**, **FOREIGN KEY** | Student |
| `course_id` | INTEGER | **PRIMARY KEY**, **FOREIGN KEY**| |

*(`person_id` & `course_id` are both primary keys to prevent the same person from taking the same course multiple times)*

### Course-Teacher

| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `person_id` | INTEGER | **PRIMARY KEY**, **FOREIGN KEY** | Teacher |
| `course_id` | INTEGER | **PRIMARY KEY**, **FOREIGN KEY** (参考 `Course`) | |
| `responsibility`| VARCHAR | | E.g. Professor, TA, etc. |

### Preference (User-Room)

| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `user_id` | INTEGER | **PRIMARY KEY**, **FOREIGN KEY** | |
| `room_id` | INTEGER | **PRIMARY KEY**, **FOREIGN KEY** (参考 `Course`) | |
| `level`| INTEGER | **CHECK**(-10 <= `level` <= 10) | |

### Allocation (Time & Space)

| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `allocation_id` | INTEGER | **PRIMARY KEY** | |
| `room_id` | INTEGER | **FOREIGN KEY**, NOT NULL | |
| `event_type` | VARCHAR | **CHECK** (`ref_type` IN ('Course', 'Activity')) | Event type (Course / Activity) |
| `event_id` | INTEGER | NOT NULL | Event id |
| `start_time` | TIME | NOT NULL | |
| `end_time` | TIME | NOT NULL, **CHECK** (`end_time` > `start_time`) | |

## 规范化分析 (Normalization Analysis: 满足 3NF)

本系统数据库在设计之初，便严格遵循了关系型数据库的规范化理论。整体架构不仅彻底消除了数据冗余，还完美规避了插入异常 (Insertion Anomaly)、删除异常 (Deletion Anomaly) 和更新异常 (Update Anomaly)，全面达到了**第三范式 (3NF)** 的标准。

具体设计依据与论证如下：

### 1. 满足第一范式 (1NF)：属性的原子性
系统中所有表的所有字段均满足原子性要求，不存在多值属性或嵌套表。
* **设计体现**：在处理“一个用户选修多门课程”或“一个房间具有多个占用时段”时，本设计没有在 `User` 或 `Room` 表中采用逗号分隔的字符串或 JSON 数组来存储。所有复杂的集合概念均被拆解为独立的行级数据。

### 2. 满足第二范式 (2NF)：消除非主属性对主键的部分函数依赖
2NF 主要针对具有**联合主键**的表（如本系统中的各个多对多中间表）。本系统确保了中间表中的普通字段必须依赖于**完整的**联合主键，而不是主键的一部分。
* **设计体现 (`Preference` 表)**：该表通过 `user_id` 和 `room_id` 构成关联。其非主属性 `level` (偏好权重) 既不单单依赖于用户（同一个用户对不同房间评分不同），也不单单依赖于房间（同一个房间不同用户评分不同）。`level` 完全依赖于 `(user_id, room_id)` 这个联合主键，严格满足 2NF。
* **设计体现 (`Course-Teacher` 表)**：非主属性 `responsibility` (授课职责) 完全依赖于特定的“老师+课程”组合，满足 2NF。

### 3. 满足第三范式 (3NF)：消除非主属性对主键的传递函数依赖
3NF 是本系统架构设计的核心亮点。系统确保了每个非主属性都**直接**依赖于主键，而不依赖于其他非主属性，从而最大程度降低了数据冗余。

* **案例 A：空间域的层级解耦 (Campus -> Building -> Room)**
  * *常规错误设计*：在 `Room` 表中直接记录 `building_name` 和 `campus_name`。这会导致传递依赖 (`room_id` $\rightarrow$ `building_id` $\rightarrow$ `campus_name`)。如果某个校区改名，需要更新无数条房间记录。
  * *本系统设计*：`Room` 表仅保留 `building_id` (外键)。建筑名称和校区名称被严格隔离在各自的实体表中。当建筑或校区发生变更时，只需在 `Building` 或 `Campus` 表中修改一行数据，彻底消除了**更新异常**。
* **案例 B：人员与账户的解耦 (Person vs. User)**
  * *本系统设计*：将物理实体属性（`name`, `person_code`）归入 `Person` 表，将系统访问属性（`type`）归入 `User` 表，二者通过 `person_id` 关联。这种设计确保了“即便某个教授尚未注册本系统账号，其个人信息依然可以独立存在于系统中（被作为 `Course-Teacher` 的外键引用）”，彻底消除了**插入异常**。
* **案例 C：动态排期中心的纯粹性 (Allocation)**
  * *本系统设计*：作为智能调度的核心，`Allocation` 表仅存储时间戳、空间 ID (`room_id`) 和事件 ID (`event_id`)。它绝不冗余存储房间的容量 (`capacity`) 或课程的名称 (`name`)。这种高度规范化的设计，使得系统在执行高频的“空闲空间嗅探”算法时，只需在这一张极其轻量级的表上进行极速的索引扫描，大幅提升了查询性能。