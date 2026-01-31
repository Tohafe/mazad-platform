#!/bin/bash
set -e

# Use variables passed from docker-compose
psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" <<-EOSQL
    CREATE USER $BID_DB_USER WITH PASSWORD '$BID_DB_PASSWORD';
    CREATE DATABASE $BID_DB_NAME;
    GRANT ALL PRIVILEGES ON DATABASE $BID_DB_NAME TO $BID_DB_USER;
EOSQL

# 2. Connect to the NEW database to fix the schema permissions
psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" -d "$BID_DB_NAME" <<-EOSQL
    GRANT ALL ON SCHEMA public TO $BID_DB_USER;
EOSQL
