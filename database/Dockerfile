FROM postgres:11.1

ENV POSTGRES_PASSWORD=password 
ENV POSTGRES_DB=db2

WORKDIR /docker-entrypoint-initdb.d
EXPOSE 5432

COPY ./init-db.sh ./


# sudo docker build database -t db2 
# sudo docker run -p 5439:5432 --network=fbridge db2
# docker exec -it db2 psql
