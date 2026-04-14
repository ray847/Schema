from settings import settings


def clean():
    settings.db_filepath.unlink(missing_ok=True)
