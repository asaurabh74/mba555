FROM node:12.16.1-alpine

LABEL author="Saurabh Agarwal"

ENV CONTAINER=true
ENV USE_NGINX=false

WORKDIR /var/www/node-service

COPY package.json package-lock.json ./
COPY ./server.js .
COPY ./api .
COPY ./data .
COPY ./jiraclient.js .
COPY ./dist .
COPY ./src .

RUN npm install --only=prod && \
    npm install -g @angular/cli@7.3.9 && \
    npm build

RUN ls -al

EXPOSE 8080
EXPOSE 8443

ENTRYPOINT ["node", "server.js"]