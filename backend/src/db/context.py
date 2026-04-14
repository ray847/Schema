import sqlite3
from settings import settings
from .view import View
import asyncio


class DBContext:
    def __init__(self) -> None:
        self.conn = sqlite3.connect(settings.db_filepath)
        self.conn.row_factory = sqlite3.Row
        self.conn.execute("PRAGMA foreign_keys = ON;")

    def __del__(self):
        self.conn.close()

    async def execute(self, view: View):
        def run_sql(view: View):
            conn = sqlite3.connect(settings.db_filepath)
            conn.row_factory = sqlite3.Row
            conn.execute("PRAGMA foreign_keys = ON;")
            result = None
            for command in view.sql:
                result = conn.execute(
                    command.format, command.arguments
                ).fetchall()
            conn.commit()
            conn.close()
            return result

        return await asyncio.to_thread(run_sql, view)
