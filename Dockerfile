FROM node:12.16.1-alpine

LABEL author="Saurabh Agarwal"

ENV CONTAINER=true
ENV USE_NGINX=false

WORKDIR /var/www/node-service

COPY package.json package-lock.json ./
RUN npm install --only=prod

RUN ls -al

COPY ./server.js .
COPY ./api .
COPY ./data .
COPY ./jiraclient.js .
COPY ./dist .

EXPOSE 8080
EXPOSE 8443

ENTRYPOINT ["node", "server.js"]