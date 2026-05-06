from settings import settings
from shared.log import log


def clean():
    log("DELETE", "Deleting database file", path=settings.db_filepath)
    settings.db_filepath.unlink(missing_ok=True)
    log("DELETE", "Database file delete completed", path=settings.db_filepath)
