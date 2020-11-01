FROM node:12.16.1-alpine

LABEL author="Saurabh Agarwal"

ENV CONTAINER=true
ENV USE_NGINX=false

WORKDIR /var/www/node-service

# COPY package.json package-lock.json ./
# COPY ./server.js .
# COPY ./api .
# COPY ./data .
# COPY ./jiraclient.js .
# COPY ./src .

# RUN cat package.json

COPY . .

RUN npm install -g @angular/cli@7.3.9
RUN npm install
RUN ng build --outputPath=dist

RUN npm install oauth
RUN mv node_oauth/lib/*.js node_modules/oauth/lib/
RUN mv node_oauth/index.js node_modules/oauth/

EXPOSE 8080
EXPOSE 8443

ENTRYPOINT ["node", "server.js"]