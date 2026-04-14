#!/bin/bash
DB_FILE="db_file.db"

if [ "$1" == "backend" ]; then
    if [ "$2" == "--clean" ]; then
        if [ -f "$DB_FILE" ]; then
            echo "Cleaning database..."
            rm "$DB_FILE"
        fi
    fi
    cd backend/src
    uvicorn main:app --reload
elif [ "$1" == "frontend" ]; then
    cd frontend
    npm run dev
else
    echo "Usage: ./start.sh [backend|frontend] [--clean]"
fi
