import sqlite3
from settings import settings
from .view import View
import asyncio
from shared.log import log


def sql_operation(sql: str) -> str:
    return sql.strip().split(maxsplit=1)[0].upper() if sql.strip() else "SQL"


class DBContext:
    def __init__(self) -> None:
        self.conn = sqlite3.connect(
            settings.db_filepath,
            detect_types=sqlite3.PARSE_DECLTYPES
        )
        self.conn.row_factory = sqlite3.Row
        self.conn.execute("PRAGMA foreign_keys = ON;")
        log("PRAGMA", "Enabled sqlite foreign keys")

    def __del__(self):
        self.conn.close()

    async def execute(self, view: View):
        def run_sql(view: View):
            conn = sqlite3.connect(
                settings.db_filepath,
                detect_types=sqlite3.PARSE_DECLTYPES,
            )
            conn.row_factory = sqlite3.Row
            conn.execute("PRAGMA foreign_keys = ON;")
            log("PRAGMA", "Enabled sqlite foreign keys")
            result = None
            for command in view.sql:
                operation = sql_operation(command.format)
                log(
                    operation,
                    "Executing database command",
                    sql=command.format,
                    arguments=command.arguments,
                )
                try:
                    result = conn.execute(
                        command.format, command.arguments
                    ).fetchall()
                except sqlite3.Error as error:
                    log(
                        operation,
                        "Database command failed",
                        sql=command.format,
                        arguments=command.arguments,
                        error=str(error),
                    )
                    raise
                log(operation, "Database command completed", rows=len(result))
            conn.commit()
            log("COMMIT", "Committed database transaction")
            conn.close()
            return result

        return await asyncio.to_thread(run_sql, view)
