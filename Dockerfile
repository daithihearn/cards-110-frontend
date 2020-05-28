FROM node:14

WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install

COPY ./public ./public
COPY ./src ./src

RUN npm install -g serve
RUN REACT_APP_API_URL="http://localhost:8080" npm run build

EXPOSE 80

CMD [ "serve",  "-s",  "build" ]