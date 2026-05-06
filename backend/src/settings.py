import pathlib
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    db_filepath: pathlib.Path = pathlib.Path("db_file.db")
    log_dir: pathlib.Path = pathlib.Path("logs")
    debug: bool = False

    model_config = SettingsConfigDict(
        env_file=pathlib.Path(__file__).parent.parent / ".env",
        env_file_encoding="utf-8",
    )


settings = Settings()
