FROM node:latest

WORKDIR /server

COPY . .

RUN npm install

CMD [ "npm", "run", "start" ]