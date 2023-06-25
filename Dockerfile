# build
FROM node:16 AS builder

WORKDIR /app

COPY package.json ./

RUN yarn --network-timeout 100000

COPY ./src ./src
COPY ./public ./public
COPY ./substitute.env .env
COPY ./tsconfig.json tsconfig.json

RUN yarn build

# deployment
FROM nginx:1.25-alpine AS deployment

COPY --from=builder /app/build /usr/share/nginx/html
COPY ./nginx/default.conf /etc/nginx/conf.d/default.conf
COPY ./nginx/nginx.conf /etc/nginx/nginx.conf

CMD find /usr/share/nginx/html/static/js -type f -name '*.js' -exec sed -i -e 's|$API_URL|'"$API_URL"'|g' {} \; && find /usr/share/nginx/html/static/js -type f -name '*.js' -exec sed -i -e 's|$WEBSOCKET_URL|'"$WEBSOCKET_URL"'|g' {} \; && find /usr/share/nginx/html/static/js -type f -name '*.js' -exec sed -i -e 's|$AUTH0_DOMAIN|'"$AUTH0_DOMAIN"'|g' {} \; && find /usr/share/nginx/html/static/js -type f -name '*.js' -exec sed -i -e 's|$AUTH0_AUDIENCE|'"$AUTH0_AUDIENCE"'|g' {} \; && find /usr/share/nginx/html/static/js -type f -name '*.js' -exec sed -i -e 's|$AUTH0_CLIENT_ID|'"$AUTH0_CLIENT_ID"'|g' {} \; && find /usr/share/nginx/html/static/js -type f -name '*.js' -exec sed -i -e 's|$AUTH0_SCOPE|'"$AUTH0_SCOPE"'|g' {} \; && nginx -g 'daemon off;'
