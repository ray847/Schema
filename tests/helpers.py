PASSWORD = "secret-pass"


LIST_QUERIES = {
    "campus": """
      query { listCampus { key name address } }
    """,
    "building": """
      query { listBuilding { key name buildingType location campus { key name } } }
    """,
    "room": """
      query { listRoom { key name roomType capacity facility building { key name } } }
    """,
    "person": """
      query { listPerson { key personCode name role } }
    """,
    "course": """
      query { listCourse { key courseCode name } }
    """,
    "activity": """
      query { listActivity { key name person { key name } } }
    """,
    "course_teacher": """
      query {
        listCourseTeacher {
          personKey
          courseKey
          responsibility
          person { key name }
          course { key name }
        }
      }
    """,
    "allocation": """
      query {
        listAllocation {
          key
          eventType
          eventKey
          startTime
          endTime
          room { key name building { key name } }
        }
      }
    """,
}


def find_item(items: list[dict], key: str, value: object) -> dict:
    for item in items:
        if item.get(key) == value:
            return item
    raise AssertionError(f"Could not find {key}={value!r} in {items!r}")
