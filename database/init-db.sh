#!/bin/bash
set -e

psql -v ON_ERROR_STOP=1 --username "postgres" --dbname "$POSTGRES_DB" <<-EOSQL
	CREATE USER log;
	CREATE DATABASE carlogs;
	GRANT ALL PRIVILEGES ON DATABASE carlogs TO log;
    CREATE TABLE bus_data(sr_num INT NOT NULL, date0 CHAR(50) NOT NULL, time0 CHAR(30) NOT NULL, vin CHAR(10) NOT NULL, route INT NOT NULL, latitude FLOAT, longitude FLOAT, speed FLOAT, type CHAR(5) NOT NULL, date DATE NOT NULL, time TIME NOT NULL);
EOSQL
