FROM ghcr.io/puppeteer/puppeteer:latest
WORKDIR /usr/src/app
COPY package.json package.json
RUN npm i
COPY index.ts index.ts
RUN npm run build
CMD ["npm", "start"]