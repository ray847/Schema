#!/bin/bash
DB_FILE="backend/src/db_file.db"
LOG_FILE="backend/log/*.log"

if [ "$1" == "backend" ]; then
    if [ "$2" == "--clean" ]; then
        if [ -f "$DB_FILE" ]; then
            echo "Cleaning database..."
            rm "$DB_FILE"
            echo "Cleaning logs..."
            rm "$LOG_FILE"
        fi
    fi
    cd backend/src
    uvicorn main:app --reload
elif [ "$1" == "frontend" ]; then
    cd frontend
    npm run dev
elif [ "$1" == "test" ]; then
    python -m pytest tests
else
    echo "Usage: ./start.sh [backend|frontend|test] [--clean]"
fi
