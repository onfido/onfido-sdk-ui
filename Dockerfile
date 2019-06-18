FROM node:12-alpine

WORKDIR /home/app
COPY . /home/app

RUN npm install
