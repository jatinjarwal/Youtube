
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

RUN mkdir -p public/temp

EXPOSE 3000

CMD ["node", "src/index.js"]