# dockerfile for node fuzzy search server
FROM node:16-alpine
WORKDIR /nodefuzzysearcher

MAINTAINER AlfredDaimari

COPY package.json ./
COPY yarn.lock ./
COPY tsconfig.json ./

RUN npm install yarn
RUN npx yarn install 

COPY backend.ts ./
COPY cars.json ./

EXPOSE 8081

CMD ["npx", "ts-node", "backend.ts"]
