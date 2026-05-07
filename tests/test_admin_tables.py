from tests.helpers import LIST_QUERIES, find_item


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
    campus = find_item(
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
    building = find_item(
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
    room = find_item(
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
    person = find_item(
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
    course = find_item(
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
    activity = find_item(
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
    course_teacher = find_item(
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
    allocation = find_item(
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
