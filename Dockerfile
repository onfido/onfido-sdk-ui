FROM node:14-alpine

WORKDIR /home/app
COPY . /home/app

RUN npm install
