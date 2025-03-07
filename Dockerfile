FROM node:18

WORKDIR /app

COPY . .

RUN npm install

RUN npx prisma generate

RUN npm rebuild bycrpt --build-from-source

EXPOSE 3000

CMD ["node", "server.js"]
