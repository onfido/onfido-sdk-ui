FROM node:14

WORKDIR /home/app
COPY . /home/app

RUN npm install
