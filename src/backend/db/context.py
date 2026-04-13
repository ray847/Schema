import sqlite3
from backend.settings import settings
from .view import View
import asyncio


class DBContext:
    def __init__(self) -> None:
        self.conn = sqlite3.connect(settings.db_filepath)
        self.conn.row_factory = sqlite3.Row
        self.conn.execute("PRAGMA foreign_keys = ON;")

    async def execute(self, view: View):
        def run_sql(view):
            conn = sqlite3.connect(settings.db_filepath)
            conn.row_factory = sqlite3.Row
            conn.execute("PRAGMA foreign_keys = ON;")
            result = conn.execute(view.sql).fetchall()
            conn.close()
            return result

        return await asyncio.to_thread(run_sql, view)
