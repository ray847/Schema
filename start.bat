@echo off
set DB_FILE=backend\src\db_file.db

if "%1"=="backend" (
    if "%2"=="--clean" (
        if exist %DB_FILE% (
            echo Cleaning database...
            del %DB_FILE%
        )
    )
    cd backend\src
    uvicorn main:app --reload
) else if "%1"=="frontend" (
    cd frontend
    npm run dev
) else (
    echo Usage: start.bat [backend|frontend] [--clean]
)

