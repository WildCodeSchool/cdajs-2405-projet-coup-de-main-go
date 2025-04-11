FROM node:18-alpine 

WORKDIR /server

COPY package*.json ./
RUN npm install

RUN apk add --no-cache curl

COPY . .

CMD npx ts-node ./src/index.ts