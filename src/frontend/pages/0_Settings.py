import streamlit as st

# 1. Initialize your PERMANENT variable
if "server_url" not in st.session_state:
    st.session_state.server_url = "http://127.0.0.1:8000"

st.title("Settings")


# 2. Create the callback function
def commit_server_url():
    # Copy the text from the disposable widget into the permanent variable
    st.session_state.server_url = st.session_state._url_input_widget


with st.expander("Advanced Settings", expanded=True):
    st.text_input(
        "Active Server",
        # 3. Seed the box with the permanent variable
        value=st.session_state.server_url,
        # 4. Give the widget a disposable key
        key="_url_input_widget",
        # 5. Trigger the copy function the moment the user finishes typing
        on_change=commit_server_url,
    )

# st.success(f"Currently targeting: {st.session_state.server_url}")
