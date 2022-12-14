# dockerfile for node server

FROM node:16-alpine
WORKDIR /nodeserver

MAINTAINER AlfredDaimari

COPY package.json ./
COPY yarn.lock ./
COPY tsconfig.json ./
COPY cars.json ./

RUN npm install yarn
RUN npx yarn install

RUN mkdir public

# source code
COPY backend.ts ./
COPY public ./public/

EXPOSE 8080
EXPOSE 6379

CMD ["npx", "ts-node", "backend.ts"]
