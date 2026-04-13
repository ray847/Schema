import sys
import pathlib
import streamlit as st


src_path = str(pathlib.Path(__file__).resolve().parent.parent)
if src_path not in sys.path:
    sys.path.append(src_path)

if "server_url" not in st.session_state:
    st.session_state.server_url = "http://127.0.0.1:8000"

# Configure the global page settings
st.set_page_config(page_title="Fudan Bestcom", page_icon="🏫", layout="wide")

st.title("Welcome to Fudan Bestcom")
st.write("Please select your role from the sidebar to continue.")

# You can add a nice image or campus announcement here
