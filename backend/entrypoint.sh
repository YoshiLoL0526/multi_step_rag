#!/bin/bash

echo "Esperando a que PostgreSQL esté disponible..."

# wait_for_postgres() {
#     until PGPASSWORD=$POSTGRES_PASSWORD psql -h postgres -U $POSTGRES_USER -d $POSTGRES_DB -c '\q' 2>/dev/null; do
#         echo "PostgreSQL no está disponible aún - esperando..."
#         sleep 2
#     done
#     echo "PostgreSQL está disponible!"
# }

apt-get update && apt-get install -y postgresql-client

# wait_for_postgres

echo "Ejecutando migraciones de Alembic..."

if [ ! -d "alembic/versions" ]; then
    echo "Inicializando Alembic..."
    alembic init alembic
fi

if [ ! "$(ls -A alembic/versions)" ]; then
    echo "Creando migración inicial..."
    alembic revision --autogenerate -m "Initial migration"
fi

echo "Aplicando migraciones..."
alembic upgrade head

echo "Migraciones completadas. Iniciando aplicación..."

exec uvicorn run:app --host 0.0.0.0 --port 8083 --reload