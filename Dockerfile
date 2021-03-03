FROM node:14.14.0-alpine3.12

COPY . ./app

WORKDIR /app

RUN npm install

RUN npm install pm2 -g

EXPOSE 3000

CMD ["npm", "start"]
