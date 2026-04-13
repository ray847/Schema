@echo off
set DB_FILE=db_file.db

cd src

if "%1"=="--clean" (
    if exist %DB_FILE% (
        echo Cleaning database...
        del %DB_FILE%
    )
)

uvicorn backend.main:app
