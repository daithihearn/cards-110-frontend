# build
FROM node:14 AS builder

RUN echo $PORT

WORKDIR /app

COPY package.json ./
COPY yarn.lock ./

RUN yarn

COPY ./src ./src
COPY ./public ./public
COPY .env ./

RUN yarn build

# deployment
FROM nginx:1.19-alpine AS deployment

RUN apk add gettext

COPY --from=builder /app/build /usr/share/nginx/html
COPY ./nginx/default.conf.template /etc/nginx/conf.d/default.conf.template
COPY ./nginx/nginx.conf /etc/nginx/nginx.conf

# ENV PORT=80

RUN envsubst '\$PORT' < /etc/nginx/conf.d/default.conf.template > /etc/nginx/conf.d/default.conf

RUN cat /etc/nginx/conf.d/default.conf

CMD ["nginx", "-g", "daemon off;"]