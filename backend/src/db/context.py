import sqlite3
from settings import settings
from .view import View
import asyncio
from shared.log import log

DB_TIMEOUT_SECONDS = 30
DB_BUSY_TIMEOUT_MS = DB_TIMEOUT_SECONDS * 1000


def sql_operation(sql: str) -> str:
    return sql.strip().split(maxsplit=1)[0].upper() if sql.strip() else "SQL"


def connect() -> sqlite3.Connection:
    conn = sqlite3.connect(
        settings.db_filepath,
        detect_types=sqlite3.PARSE_DECLTYPES,
        timeout=DB_TIMEOUT_SECONDS,
        check_same_thread=False,
    )
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA foreign_keys = ON;")
    conn.execute(f"PRAGMA busy_timeout = {DB_BUSY_TIMEOUT_MS};")
    log("PRAGMA", "Enabled sqlite foreign keys")
    log("PRAGMA", "Configured sqlite busy timeout")
    return conn


class DBContext:
    def __init__(self, keep_connection: bool = False) -> None:
        self.conn = connect() if keep_connection else None

    def __del__(self):
        self.close()

    def close(self) -> None:
        if self.conn is None:
            return
        try:
            self.conn.close()
        except sqlite3.Error:
            pass
        self.conn = None

    async def execute(self, view: View):
        def run_sql(view: View):
            conn = connect()
            result = None
            last_command = None
            try:
                for command in view.sql:
                    last_command = command
                    operation = sql_operation(command.format)
                    log(
                        operation,
                        "Executing database command",
                        sql=command.format,
                        arguments=command.arguments,
                    )
                    result = conn.execute(
                        command.format, command.arguments
                    ).fetchall()
                    log(
                        operation,
                        "Database command completed",
                        rows=len(result),
                    )
                conn.commit()
                log("COMMIT", "Committed database transaction")
                return result
            except sqlite3.Error as error:
                conn.rollback()
                operation = (
                    sql_operation(last_command.format)
                    if last_command is not None
                    else "SQL"
                )
                log(
                    operation,
                    "Database transaction rolled back",
                    sql=last_command.format if last_command else "",
                    arguments=last_command.arguments if last_command else (),
                    error=str(error),
                )
                raise
            finally:
                conn.close()

        return await asyncio.to_thread(run_sql, view)
