import pytest

from tests.helpers import LIST_QUERIES


@pytest.mark.parametrize("table_name,query", LIST_QUERIES.items())
def test_admin_can_view_public_table(api, users, table_name, query):
    token = users["admin_token"]
    data = api.graphql(query, token=token)
    assert data, table_name


@pytest.mark.parametrize("table_name,query", LIST_QUERIES.items())
def test_standard_user_can_view_public_table(api, users, table_name, query):
    token = users["standard_token"]
    data = api.graphql(query, token=token)
    assert data, table_name
