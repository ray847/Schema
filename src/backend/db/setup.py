import sqlite3
from backend.settings import settings
import backend.shared as shared
from backend.shared.model.facility import Facility
from .table_registry import TableRegistry
from .context import DBContext


def setup():
    sql_schema = TableRegistry.generate_sql_schema()
    context = DBContext()
    # Directly execute schema.
    for statement in sql_schema:
        context.conn.execute(statement)
        print(statement)
    if settings.debug:
        insert_mock_data(conn=context.conn)
    context.conn.commit()


def insert_mock_data(conn: sqlite3.Connection):
    # Insert mock data for testing
    # Order matters due to foreign keys

    # Campus
    conn.execute(
        "INSERT INTO Campus (name, address) VALUES (?, ?)",
        ("Main Campus", "123 University St"),
    )
    conn.execute(
        "INSERT INTO Campus (name, address) VALUES (?, ?)",
        ("Downtown Campus", "456 City Ave"),
    )

    # Building
    conn.execute(
        """
INSERT INTO Building (campus_key, name, building_type, location)
VALUES (?, ?, ?, ?)""",
        (1, "Engineering Hall", "academic", "North Wing"),
    )
    conn.execute(
        """
INSERT INTO Building (campus_key, name, building_type, location)
VALUES (?, ?, ?, ?)""",
        (1, "Library", "library", "Central"),
    )
    conn.execute(
        """
INSERT INTO Building (campus_key, name, building_type, location)
VALUES (?, ?, ?, ?)""",
        (2, "Business Center", "academic", "East Side"),
    )

    # Room
    conn.execute(
        """
INSERT INTO Room (building_key, name, room_type, capacity, facility)
VALUES (?, ?, ?, ?, ?)""",
        (1, "101", "lecture", 50, Facility(power_outlet=10.0).model_dump_json()),
    )
    conn.execute(
        """
INSERT INTO Room (building_key, name, room_type, capacity, facility)
VALUES (?, ?, ?, ?, ?)""",
        (1, "102", "laboratory", 30, Facility(power_outlet=20.0).model_dump_json()),
    )
    conn.execute(
        """
INSERT INTO Room (building_key, name, room_type, capacity, facility)
VALUES (?, ?, ?, ?, ?)""",
        (2, "Reading Room", "lecture", 100, Facility(power_outlet=5.0).model_dump_json()),
    )
    conn.execute(
        """
INSERT INTO Room (building_key, name, room_type, capacity, facility)
VALUES (?, ?, ?, ?, ?)""",
        (3, "201", "office", 10, Facility(power_outlet=15.0).model_dump_json()),
    )

    # # Person
    # conn.execute(
    #     "INSERT INTO Person (person_code, name, role) VALUES (?, ?, ?)",
    #     ("T001", "Dr. Alice Smith", "Teacher"),
    # )
    # conn.execute(
    #     "INSERT INTO Person (person_code, name, role) VALUES (?, ?, ?)",
    #     ("T002", "Prof. Bob Johnson", "Teacher"),
    # )
    # conn.execute(
    #     "INSERT INTO Person (person_code, name, role) VALUES (?, ?, ?)",
    #     ("S001", "Charlie Brown", "Student"),
    # )
    # conn.execute(
    #     "INSERT INTO Person (person_code, name, role) VALUES (?, ?, ?)",
    #     ("S002", "Diana Prince", "Student"),
    # )

    # # User
    # conn.execute(
    #     "INSERT INTO User (person_id, type, email, password) VALUES (?, ?, ?, ?)",
    #     (1, "admin", "alice@univ.edu", "password123"),
    # )
    # conn.execute(
    #     "INSERT INTO User (person_id, type, email, password) VALUES (?, ?, ?, ?)",
    #     (2, "standard", "bob@univ.edu", "password123"),
    # )
    # conn.execute(
    #     "INSERT INTO User (person_id, type, email, password) VALUES (?, ?, ?, ?)",
    #     (3, "standard", "charlie@univ.edu", "password123"),
    # )
    # conn.execute(
    #     "INSERT INTO User (person_id, type, email, password) VALUES (?, ?, ?, ?)",
    #     (4, "spectate", "diana@univ.edu", "password123"),
    # )

    # # Course
    # conn.execute(
    #     "INSERT INTO Course (course_code, name) VALUES (?, ?)",
    #     ("CS101", "Introduction to Computer Science"),
    # )
    # conn.execute(
    #     "INSERT INTO Course (course_code, name) VALUES (?, ?)",
    #     ("MATH201", "Calculus II"),
    # )

    # # Activity
    # conn.execute(
    #     "INSERT INTO Activity (name, person_id) VALUES (?, ?)",
    #     ("Research Meeting", 1),
    # )
    # conn.execute(
    #     "INSERT INTO Activity (name, person_id) VALUES (?, ?)",
    #     ("Club Event", 3),
    # )

    # # rel_Course_Teacher
    # conn.execute(
    #     "INSERT INTO rel_Course_Teacher (person_id, course_id, responsibility) VALUES (?, ?, ?)",
    #     (1, 1, "Lecturer"),
    # )
    # conn.execute(
    #     "INSERT INTO rel_Course_Teacher (person_id, course_id, responsibility) VALUES (?, ?, ?)",
    #     (2, 2, "Lecturer"),
    # )

    # # rel_Preference
    # conn.execute(
    #     "INSERT INTO rel_Preference (user_id, room_id, level) VALUES (?, ?, ?)",
    #     (1, 1, 8),
    # )
    # conn.execute(
    #     "INSERT INTO rel_Preference (user_id, room_id, level) VALUES (?, ?, ?)",
    #     (2, 2, 5),
    # )
    # conn.execute(
    #     "INSERT INTO rel_Preference (user_id, room_id, level) VALUES (?, ?, ?)",
    #     (3, 3, -2),
    # )

    # # rel_Allocation
    # conn.execute(
    #     "INSERT INTO rel_Allocation (room_id, event_type, event_id, day_of_week, start_time, end_time) VALUES (?, ?, ?, ?, ?, ?)",
    #     (1, "Course", 1, 1, "09:00", "10:30"),
    # )
    # conn.execute(
    #     "INSERT INTO rel_Allocation (room_id, event_type, event_id, day_of_week, start_time, end_time) VALUES (?, ?, ?, ?, ?, ?)",
    #     (2, "Activity", 1, 2, "14:00", "16:00"),
    # )

    # conn.commit()
