FROM node:16-alpine

WORKDIR /home/app
COPY . /home/app

RUN npm install
