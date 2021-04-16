# build
FROM node:14 AS builder

WORKDIR /app

COPY package.json ./
COPY yarn.lock ./

RUN yarn

COPY ./src ./src
COPY ./public ./public
COPY .env ./

RUN yarn build

# deployment
FROM nginx:1.19
COPY --from=builder /app/build /usr/share/nginx/html
COPY ./nginx/default.conf /etc/nginx/conf.d/default.conf
COPY ./nginx/nginx.conf /etc/nginx/nginx.conf

CMD /bin/bash -c "envsubst '\$PORT' < /etc/nginx/conf.d/default.conf.template > /etc/nginx/conf.d/default.conf" && nginx -g 'daemon off;'