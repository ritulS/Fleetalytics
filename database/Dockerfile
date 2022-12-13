FROM postgres:11.1

ENV POSTGRES_PASSWORD=password 
ENV POSTGRES_DB=postgres

WORKDIR /docker-entrypoint-initdb.d

COPY ./init-db.sh ./
