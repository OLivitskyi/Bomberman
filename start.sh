#!/bin/bash
# Запуск бекенда
go run main.go &
BACKEND_PID=$!

# Перехід до клієнта та запуск фронтенду
cd client-dom
npm run dev &
FRONTEND_PID=$!

# Очікування завершення
wait $BACKEND_PID $FRONTEND_PID
