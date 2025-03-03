FROM mcr.microsoft.com/playwright:v1.50.1-noble

WORKDIR /e2e

COPY package.json /e2e/package.json

RUN npm install

COPY playwright.config.ts /e2e/playwright.config.ts

COPY __tests__/ /e2e/__tests__/