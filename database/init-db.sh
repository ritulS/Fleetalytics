#!/bin/bash
set -e

psql -v ON_ERROR_STOP=1 --username "postgres" --dbname "$POSTGRES_DB" <<-EOSQL
        SELECT 'CREATE DATABASE db2' WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'db2');
	CREATE TABLE bus_data(sr_num INT NOT NULL, date0 CHAR(50) NOT NULL, time0 CHAR(30) NOT NULL, vin CHAR(10) NOT NULL, route INT NOT NULL, latitude FLOAT, longitude FLOAT, speed FLOAT, type CHAR(5) NOT NULL, date DATE NOT NULL, time TIME NOT NULL, delta_d FLOAT NOT NULL);
EOSQL





#CREATE USER log;
#GRANT ALL PRIVILEGES ON DATABASE carlogs TO log;
