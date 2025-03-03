FROM node:18-alpine 

WORKDIR /webapp

COPY package*.json package-lock.json ./

RUN npm install

COPY . .

RUN npx playwright install

CMD npm run dev -- --host