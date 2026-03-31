#!/bin/bash

set -e

# 1. Create the user (role with login)
psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" \
  -c "CREATE ROLE \"$BID_DB_USER\" LOGIN PASSWORD '$BID_DB_PASSWORD';"

# 2. Create the database
psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" \
  -c "CREATE DATABASE \"$BID_DB_NAME\";"

# 3. Grant privileges on the database
psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" \
  -c "GRANT ALL PRIVILEGES ON DATABASE \"$BID_DB_NAME\" TO \"$BID_DB_USER\";"

# 4. Connect to the NEW database and grant schema privileges
psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" -d "$BID_DB_NAME" \
  -c "GRANT ALL ON SCHEMA public TO \"$BID_DB_USER\";"