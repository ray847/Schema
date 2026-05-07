def test_first_user_is_admin_and_second_user_is_standard(users):
    assert users["admin"]["type"] == "admin"
    assert users["standard"]["type"] == "standard"
