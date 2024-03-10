FROM ghcr.io/puppeteer/puppeteer:22.4.1
WORKDIR /usr/src/app
COPY package.json package.json
RUN npm i
COPY index.ts index.ts
RUN npm run build
CMD ["npm", "start"]