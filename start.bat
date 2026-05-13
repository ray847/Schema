@echo off
set DB_FILE=backend\src\db_file.db
set LOG_FILE=backend\log\*.log

if "%1"=="backend" (
    if "%2"=="--clean" (
        if exist %DB_FILE% (
            echo Cleaning database...
            del %DB_FILE%
        )
        if exist %LOG_FILE% (
            echo Cleaning logs ...
            del %LOG_FILE%
        )
    )
    cd backend\src
    uvicorn main:app --reload
) else if "%1"=="frontend" (
    cd frontend
    npm run dev
) else if "%1"=="test" (
    python -m pytest tests
) else (
    echo Usage: start.bat [backend^|frontend^|test] [--clean]
)

