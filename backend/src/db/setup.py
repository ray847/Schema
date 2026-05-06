import sqlite3
from datetime import datetime
from settings import settings
from shared.log import log
from shared.model.facility import Facility
from .table_registry import TableRegistry
from .context import DBContext


def execute_logged(
    conn: sqlite3.Connection,
    operation: str,
    sql: str,
    arguments: tuple = (),
):
    log(
        operation,
        "Executing database setup command",
        sql=sql,
        arguments=arguments,
    )
    try:
        result = conn.execute(sql, arguments)
    except sqlite3.Error as error:
        log(
            operation,
            "Database setup command failed",
            sql=sql,
            arguments=arguments,
            error=str(error),
        )
        raise
    log(operation, "Database setup command completed")
    return result


def setup():
    sql_schema = TableRegistry.generate_sql_schema()
    context = DBContext()
    # Directly execute schema.
    for statement in sql_schema:
        execute_logged(context.conn, "CREATE", statement)
    if settings.debug:
        insert_mock_data(conn=context.conn)
    context.conn.commit()
    log("COMMIT", "Committed database setup transaction")


def insert_mock_data(conn: sqlite3.Connection):
    # Insert mock data for testing
    # Order matters due to foreign keys

    # Campus
    execute_logged(
        conn,
        "INSERT",
        "INSERT INTO Campus (name, address) VALUES (?, ?)",
        ("Main Campus", "123 University St"),
    )
    execute_logged(
        conn,
        "INSERT",
        "INSERT INTO Campus (name, address) VALUES (?, ?)",
        ("Downtown Campus", "456 City Ave"),
    )

    # Building
    execute_logged(
        conn,
        "INSERT",
        """
INSERT INTO Building (campus_key, name, building_type, location)
VALUES (?, ?, ?, ?)""",
        (1, "Engineering Hall", "academic", "North Wing"),
    )
    execute_logged(
        conn,
        "INSERT",
        """
INSERT INTO Building (campus_key, name, building_type, location)
VALUES (?, ?, ?, ?)""",
        (1, "Library", "library", "Central"),
    )
    execute_logged(
        conn,
        "INSERT",
        """
INSERT INTO Building (campus_key, name, building_type, location)
VALUES (?, ?, ?, ?)""",
        (2, "Business Center", "academic", "East Side"),
    )

    # Room
    execute_logged(
        conn,
        "INSERT",
        """
INSERT INTO Room (building_key, name, room_type, capacity, facility)
VALUES (?, ?, ?, ?, ?)""",
        (
            1,
            "101",
            "lecture",
            50,
            Facility(power_outlet=1.0).model_dump_json(),
        ),
    )
    execute_logged(
        conn,
        "INSERT",
        """
INSERT INTO Room (building_key, name, room_type, capacity)
VALUES (?, ?, ?, ?)""",
        (1, "102", "laboratory", 30),
    )
    execute_logged(
        conn,
        "INSERT",
        """
INSERT INTO Room (building_key, name, room_type, capacity, facility)
VALUES (?, ?, ?, ?, ?)""",
        (
            2,
            "Reading Room",
            "lecture",
            100,
            Facility(power_outlet=0.5).model_dump_json(),
        ),
    )
    execute_logged(
        conn,
        "INSERT",
        """
INSERT INTO Room (building_key, name, room_type, capacity, facility)
VALUES (?, ?, ?, ?, ?)""",
        (3, "201", "office", 10, Facility(power_outlet=15.0).model_dump_json()),
    )

    # Person
    execute_logged(
        conn,
        "INSERT",
        "INSERT INTO Person (person_code, name, role) VALUES (?, ?, ?)",
        ("T001", "Dr. Alice Smith", "Teacher"),
    )
    execute_logged(
        conn,
        "INSERT",
        "INSERT INTO Person (person_code, name, role) VALUES (?, ?, ?)",
        ("T002", "Prof. Bob Johnson", "Teacher"),
    )
    execute_logged(
        conn,
        "INSERT",
        "INSERT INTO Person (person_code, name, role) VALUES (?, ?, ?)",
        ("S001", "Charlie Brown", "Student"),
    )

    # Course
    execute_logged(
        conn,
        "INSERT",
        "INSERT INTO Course (course_code, name) VALUES (?, ?)",
        ("CS101", "Introduction to Computer Science"),
    )
    execute_logged(
        conn,
        "INSERT",
        "INSERT INTO Course (course_code, name) VALUES (?, ?)",
        ("MATH201", "Calculus II"),
    )

    # Activity
    execute_logged(
        conn,
        "INSERT",
        "INSERT INTO Activity (name, person_key) VALUES (?, ?)",
        ("Research Meeting", 1),
    )
    execute_logged(
        conn,
        "INSERT",
        "INSERT INTO Activity (name, person_key) VALUES (?, ?)",
        ("Club Event", 3),
    )

    # CourseTeacher
    execute_logged(
        conn,
        "INSERT",
        "INSERT INTO CourseTeacher (person_key, course_key, responsibility) VALUES (?, ?, ?)",
        (1, 1, "Lecturer"),
    )
    execute_logged(
        conn,
        "INSERT",
        "INSERT INTO CourseTeacher (person_key, course_key, responsibility) VALUES (?, ?, ?)",
        (2, 2, "Lecturer"),
    )

    # Allocation
    execute_logged(
        conn,
        "INSERT",
        "INSERT INTO Allocation (room_key, event_type, event_key, start_time, end_time) VALUES (?, ?, ?, ?, ?)",
        (
            1,
            "Course",
            1,
            datetime(2024, 4, 15, 9, 0, 0),
            datetime(2024, 4, 15, 10, 30, 0),
        ),
    )
    execute_logged(
        conn,
        "INSERT",
        "INSERT INTO Allocation (room_key, event_type, event_key, start_time, end_time) VALUES (?, ?, ?, ?, ?)",
        (
            2,
            "Activity",
            1,
            datetime(2024, 4, 15, 14, 0, 0),
            datetime(2024, 4, 15, 16, 0, 0),
        ),
    )

    conn.commit()
    log("COMMIT", "Committed mock data transaction")
