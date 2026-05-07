from tests.helpers import LIST_QUERIES, find_item


def test_preferences_are_scoped_to_the_requested_user(api, users):
    admin_token = users["admin_token"]
    standard_key = int(users["standard"]["key"])
    admin_key = int(users["admin"]["key"])

    api.graphql(
        """
        mutation($inputs: [CampusInput!]!) {
          createCampus(inputs: $inputs)
        }
        """,
        {"inputs": [{"name": "Preference Campus", "address": "9 Pref Road"}]},
        admin_token,
    )
    campus = find_item(
        api.graphql(LIST_QUERIES["campus"], token=admin_token)["listCampus"],
        "name",
        "Preference Campus",
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
                    "name": "Preference Building",
                    "buildingType": "ACADEMIC",
                    "location": "East",
                }
            ]
        },
        admin_token,
    )
    building = find_item(
        api.graphql(LIST_QUERIES["building"], token=admin_token)["listBuilding"],
        "name",
        "Preference Building",
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
                    "name": "Preference Room",
                    "roomType": "LECTURE",
                    "capacity": 12,
                    "facility": {"power_outlet": 1},
                }
            ]
        },
        admin_token,
    )
    room = find_item(
        api.graphql(LIST_QUERIES["room"], token=admin_token)["listRoom"],
        "name",
        "Preference Room",
    )

    create_preference = """
      mutation($userKey: ID!, $input: PreferenceInput!) {
        createPreference(userKey: $userKey, input: $input) {
          key
          roomKey
          buildingKey
          campusKey
          value
        }
      }
    """
    list_preference = """
      query($userKey: ID!) {
        listPreference(userKey: $userKey) {
          key
          roomKey
          buildingKey
          campusKey
          value
        }
      }
    """
    delete_preference = """
      mutation($userKey: ID!, $preferenceKey: ID!) {
        deletePreference(userKey: $userKey, preferenceKey: $preferenceKey)
      }
    """
    update_preference = """
      mutation($userKey: ID!, $preferenceKey: ID!, $input: PreferenceInput!) {
        updatePreference(userKey: $userKey, preferenceKey: $preferenceKey, input: $input) {
          key
          roomKey
          buildingKey
          campusKey
          value
        }
      }
    """

    created = api.graphql(
        create_preference,
        {
            "userKey": str(standard_key),
            "input": {"roomKey": room["key"], "value": 0.75},
        },
    )["createPreference"]
    assert created["roomKey"] == room["key"]
    assert created["buildingKey"] is None
    assert created["campusKey"] is None
    assert created["value"] == 0.75

    created = api.graphql(
        update_preference,
        {
            "userKey": str(standard_key),
            "preferenceKey": created["key"],
            "input": {"buildingKey": building["key"], "value": 0.5},
        },
    )["updatePreference"]
    assert created["roomKey"] is None
    assert created["buildingKey"] == building["key"]
    assert created["campusKey"] is None
    assert created["value"] == 0.5

    admin_created = api.graphql(
        create_preference,
        {
            "userKey": str(admin_key),
            "input": {"roomKey": room["key"], "value": -0.25},
        },
    )["createPreference"]

    preferences = api.graphql(
        list_preference,
        {"userKey": str(standard_key)},
    )["listPreference"]
    assert preferences == [created]

    admin_preferences = api.graphql(
        list_preference,
        {"userKey": str(admin_key)},
    )["listPreference"]
    assert admin_preferences == [admin_created]

    api.graphql(
        delete_preference,
        {"userKey": str(standard_key), "preferenceKey": created["key"]},
    )
    api.graphql(
        delete_preference,
        {"userKey": str(admin_key), "preferenceKey": admin_created["key"]},
    )
    assert api.graphql(
        list_preference,
        {"userKey": str(standard_key)},
    )["listPreference"] == []
