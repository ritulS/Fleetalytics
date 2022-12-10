# dockerfile for node fuzzy search server
FROM node:16-alpine
WORKDIR /nodeanalytics

MAINTAINER AlfredDaimari

COPY package.json ./
COPY yarn.lock ./
COPY tsconfig.json ./

RUN npm install yarn
RUN npx yarn install 

COPY backend.ts ./

EXPOSE 8082

CMD ["npx", "ts-node", "backend.ts"]
