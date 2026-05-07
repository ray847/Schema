import pytest


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


def _find(items: list[dict], key: str, value: object) -> dict:
    for item in items:
        if item.get(key) == value:
            return item
    raise AssertionError(f"Could not find {key}={value!r} in {items!r}")


@pytest.fixture(scope="module")
def users(api):
    admin = api.register("admin@example.test", PASSWORD)
    assert admin["type"] == "admin"
    assert admin["person_key"] is None

    admin_token = api.token("admin@example.test", PASSWORD)
    admin_me = api.me(admin_token)
    assert admin_me["email"] == "admin@example.test"
    assert admin_me["type"] == "admin"

    standard = api.register("standard@example.test", PASSWORD)
    assert standard["type"] == "standard"
    standard_token = api.token("standard@example.test", PASSWORD)

    return {
        "admin": admin,
        "admin_token": admin_token,
        "standard": standard,
        "standard_token": standard_token,
    }


def test_first_user_is_admin_and_second_user_is_standard(users):
    assert users["admin"]["type"] == "admin"
    assert users["standard"]["type"] == "standard"


def test_admin_can_view_all_public_tables(api, users):
    token = users["admin_token"]
    for query in LIST_QUERIES.values():
        data = api.graphql(query, token=token)
        assert data


def test_standard_user_can_view_all_public_tables(api, users):
    token = users["standard_token"]
    for query in LIST_QUERIES.values():
        data = api.graphql(query, token=token)
        assert data


def test_admin_can_insert_update_and_delete_all_tables(api, users):
    token = users["admin_token"]

    api.graphql(
        """
        mutation($inputs: [CampusInput!]!) {
          createCampus(inputs: $inputs)
        }
        """,
        {
            "inputs": [
                {
                    "name": "Pytest Campus",
                    "address": "1 Test Road",
                }
            ]
        },
        token,
    )
    campus = _find(
        api.graphql(LIST_QUERIES["campus"], token=token)["listCampus"],
        "name",
        "Pytest Campus",
    )

    api.graphql(
        """
        mutation($inputs: [BuildingInput!]!) {
          createBuilding(inputs: $inputs)
        }
        """,
        {
            "inputs": [
                {
                    "campusKey": campus["key"],
                    "name": "Pytest Building",
                    "buildingType": "ACADEMIC",
                    "location": "North",
                }
            ]
        },
        token,
    )
    building = _find(
        api.graphql(LIST_QUERIES["building"], token=token)["listBuilding"],
        "name",
        "Pytest Building",
    )

    api.graphql(
        """
        mutation($inputs: [RoomInput!]!) {
          createRoom(inputs: $inputs)
        }
        """,
        {
            "inputs": [
                {
                    "buildingKey": building["key"],
                    "name": "Pytest Room",
                    "roomType": "LECTURE",
                    "capacity": 40,
                    "facility": {"power_outlet": 2},
                }
            ]
        },
        token,
    )
    room = _find(
        api.graphql(LIST_QUERIES["room"], token=token)["listRoom"],
        "name",
        "Pytest Room",
    )

    api.graphql(
        """
        mutation($inputs: [PersonInput!]!) {
          createPerson(inputs: $inputs)
        }
        """,
        {
            "inputs": [
                {
                    "personCode": "PTEST001",
                    "name": "Pytest Person",
                    "role": "Teacher",
                }
            ]
        },
        token,
    )
    person = _find(
        api.graphql(LIST_QUERIES["person"], token=token)["listPerson"],
        "personCode",
        "PTEST001",
    )

    api.graphql(
        """
        mutation($inputs: [CourseInput!]!) {
          createCourse(inputs: $inputs)
        }
        """,
        {
            "inputs": [
                {
                    "courseCode": "PYTEST101",
                    "name": "Pytest Course",
                }
            ]
        },
        token,
    )
    course = _find(
        api.graphql(LIST_QUERIES["course"], token=token)["listCourse"],
        "courseCode",
        "PYTEST101",
    )

    api.graphql(
        """
        mutation($inputs: [ActivityInput!]!) {
          createActivity(inputs: $inputs)
        }
        """,
        {
            "inputs": [
                {
                    "name": "Pytest Activity",
                    "personKey": person["key"],
                }
            ]
        },
        token,
    )
    activity = _find(
        api.graphql(LIST_QUERIES["activity"], token=token)["listActivity"],
        "name",
        "Pytest Activity",
    )

    api.graphql(
        """
        mutation($inputs: [CourseTeacherInput!]!) {
          createCourseTeacher(inputs: $inputs)
        }
        """,
        {
            "inputs": [
                {
                    "personKey": person["key"],
                    "courseKey": course["key"],
                    "responsibility": "Assistant",
                }
            ]
        },
        token,
    )
    course_teacher = _find(
        api.graphql(LIST_QUERIES["course_teacher"], token=token)["listCourseTeacher"],
        "responsibility",
        "Assistant",
    )

    api.graphql(
        """
        mutation($inputs: [AllocationInput!]!) {
          createAllocation(inputs: $inputs)
        }
        """,
        {
            "inputs": [
                {
                    "roomKey": room["key"],
                    "eventType": "COURSE",
                    "eventKey": int(course["key"]),
                    "startTime": "2026-05-07T09:00:00",
                    "endTime": "2026-05-07T10:00:00",
                }
            ]
        },
        token,
    )
    allocation = _find(
        api.graphql(LIST_QUERIES["allocation"], token=token)["listAllocation"],
        "eventKey",
        int(course["key"]),
    )

    update_cases = [
        (
            """
            mutation($key: ID!, $replacements: JSON!) {
              updateCampus(key: $key, replacements: $replacements)
            }
            """,
            {"key": campus["key"], "replacements": {"address": "2 Test Road"}},
        ),
        (
            """
            mutation($key: ID!, $replacements: JSON!) {
              updateBuilding(key: $key, replacements: $replacements)
            }
            """,
            {"key": building["key"], "replacements": {"location": "South"}},
        ),
        (
            """
            mutation($key: ID!, $replacements: JSON!) {
              updateRoom(key: $key, replacements: $replacements)
            }
            """,
            {"key": room["key"], "replacements": {"capacity": 45}},
        ),
        (
            """
            mutation($key: ID!, $replacements: JSON!) {
              updatePerson(key: $key, replacements: $replacements)
            }
            """,
            {"key": person["key"], "replacements": {"name": "Pytest Person Updated"}},
        ),
        (
            """
            mutation($key: ID!, $replacements: JSON!) {
              updateCourse(key: $key, replacements: $replacements)
            }
            """,
            {"key": course["key"], "replacements": {"name": "Pytest Course Updated"}},
        ),
        (
            """
            mutation($key: ID!, $replacements: JSON!) {
              updateActivity(key: $key, replacements: $replacements)
            }
            """,
            {"key": activity["key"], "replacements": {"name": "Pytest Activity Updated"}},
        ),
        (
            """
            mutation($personKey: ID!, $courseKey: ID!, $replacements: JSON!) {
              updateCourseTeacher(
                personKey: $personKey
                courseKey: $courseKey
                replacements: $replacements
              )
            }
            """,
            {
                "personKey": course_teacher["personKey"],
                "courseKey": course_teacher["courseKey"],
                "replacements": {"responsibility": "Lead"},
            },
        ),
        (
            """
            mutation($key: ID!, $replacements: JSON!) {
              updateAllocation(key: $key, replacements: $replacements)
            }
            """,
            {
                "key": allocation["key"],
                "replacements": {"endTime": "2026-05-07T11:00:00"},
            },
        ),
    ]
    for query, variables in update_cases:
        api.graphql(query, variables, token)

    delete_cases = [
        (
            """
            mutation($key: ID!) { deleteAllocation(key: $key) }
            """,
            {"key": allocation["key"]},
        ),
        (
            """
            mutation($personKey: ID!, $courseKey: ID!) {
              deleteCourseTeacher(personKey: $personKey, courseKey: $courseKey)
            }
            """,
            {
                "personKey": course_teacher["personKey"],
                "courseKey": course_teacher["courseKey"],
            },
        ),
        (
            """
            mutation($key: ID!) { deleteActivity(key: $key) }
            """,
            {"key": activity["key"]},
        ),
        (
            """
            mutation($key: ID!) { deleteRoom(key: $key) }
            """,
            {"key": room["key"]},
        ),
        (
            """
            mutation($key: ID!) { deleteBuilding(key: $key) }
            """,
            {"key": building["key"]},
        ),
        (
            """
            mutation($key: ID!) { deleteCourse(key: $key) }
            """,
            {"key": course["key"]},
        ),
        (
            """
            mutation($key: ID!) { deletePerson(key: $key) }
            """,
            {"key": person["key"]},
        ),
        (
            """
            mutation($key: ID!) { deleteCampus(key: $key) }
            """,
            {"key": campus["key"]},
        ),
    ]
    for query, variables in delete_cases:
        api.graphql(query, variables, token)
