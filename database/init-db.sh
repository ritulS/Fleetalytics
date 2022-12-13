#!/bin/bash
set -e

psql -v ON_ERROR_STOP=1 --username "postgres" --dbname "$POSTGRES_DB" <<-EOSQL
	CREATE USER log;
	CREATE DATABASE carlogs;
	GRANT ALL PRIVILEGES ON DATABASE carlogs TO log;
EOSQL
