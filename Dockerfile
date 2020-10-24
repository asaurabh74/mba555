FROM node:12.16.1-alpine

LABEL author="Saurabh Agarwal"

# ENV CONTAINER=true

ENV usename
ENV password

WORKDIR /var/www/node-service

COPY package.json package-lock.json ./
RUN npm install --only=prod && \
    npm run build

COPY ./server.js .
COPY ./api .
COPY ./data .
COPY ./jiraclient.js .
COPY /dist .

EXPOSE 8080
EXPOSE 8443

ENTRYPOINT ["node", "server.js"]