# dockerfile for node server

FROM node:16-alpine
WORKDIR ~/cont/nodeserver

MAINTAINER AlfredDaimari

COPY package.json ./
COPY yarn.lock ./

RUN npm install yarn
RUN npx yarn install

# source code
COPY backend.ts ./
COPY public ./

EXPOSE 8080

CMD ["npx", "ts-node", "backend.ts"]
