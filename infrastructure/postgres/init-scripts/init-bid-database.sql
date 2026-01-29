#!/bin/bash
set -e

# Use variables passed from docker-compose
psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" <<-EOSQL
    CREATE USER '$DB_USER' WITH PASSWORD '$BID_SERVICE_DB_PASSWORD';
    CREATE DATABASE '$DB_NAME';
    GRANT ALL PRIVILEGES ON DATABASE item_db TO bidding_user;
EOSQL