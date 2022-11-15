# dockerfile for redis server

FROM redis:7.0.5-alpine
WORKDIR ~/cont/rediscache

MAINTAINER AlfredDaimari

COPY redis.conf ./

EXPOSE 6379

CMD [ "redis-server", "redis.conf" ]
