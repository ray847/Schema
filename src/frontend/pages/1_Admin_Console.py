import streamlit as st
import requests

if "server_url" not in st.session_state:
    st.session_state.server_url = "http://127.0.0.1:8000"

st.title("Admin Console")

st.sidebar.header("Controls")
selected_table = st.sidebar.radio(
    "Select Table", options=shared.DBTable, key="selected_table"
)

st.subheader("Database Editor")

if selected_table:
    table_name = (
        selected_table.value
        if hasattr(selected_table, "value")
        else selected_table
    )

    response = requests.get(
        f"{st.session_state.server_url}/api/admin/pageview",
        params={"table": table_name, "page": 0, "page_size": 10},
    )

    if response.status_code == 200:
        db_data = response.json()["data"]

        # 1. Replace st.dataframe with st.data_editor
        # The key is REQUIRED so Streamlit can track the edits in session_state
        st.data_editor(
            db_data,
            use_container_width=True,
            num_rows="dynamic",  # Allows adding and deleting rows!
            key="table_editor",  # Streamlit will save changes here
        )

        # 2. Extract the changes from the session state
        changes = st.session_state.table_editor

        # 3. Create a save button that only appears if edits were made
        if (
            changes["edited_rows"]
            or changes["added_rows"]
            or changes["deleted_rows"]
        ):
            st.warning("You have unsaved changes!")

            if st.button("💾 Save Changes to Database"):
                # Handle the network requests here
                st.write("Added:", changes["added_rows"])
                st.write("Edited:", changes["edited_rows"])
                st.write("Deleted:", changes["deleted_rows"])

                # After successful network calls, you would trigger a rerun
                # to fetch the fresh data from the server:
                # st.rerun()

    else:
        st.error(f"Failed to fetch data: {response.text}")
