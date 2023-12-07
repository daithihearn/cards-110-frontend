# build
FROM node:18.18 AS builder

WORKDIR /app

COPY package.json ./

RUN yarn --network-timeout 100000

COPY ./src ./src
COPY ./public ./public
COPY ./tsconfig.json tsconfig.json

# Set the build argument
ARG REACT_APP_API_URL
ARG REACT_APP_WEBSOCKET_URL
ARG REACT_APP_AUTH0_DOMAIN
ARG REACT_APP_AUTH0_AUDIENCE
ARG REACT_APP_AUTH0_CLIENT_ID
ARG REACT_APP_AUTH0_SCOPE

# Set the environment variable to the value of the build argument
ENV REACT_APP_API_URL=${REACT_APP_API_URL}
ENV REACT_APP_WEBSOCKET_URL=${REACT_APP_WEBSOCKET_URL}
ENV REACT_APP_AUTH0_DOMAIN=${REACT_APP_AUTH0_DOMAIN}
ENV REACT_APP_AUTH0_AUDIENCE=${REACT_APP_AUTH0_AUDIENCE}
ENV REACT_APP_AUTH0_CLIENT_ID=${REACT_APP_AUTH0_CLIENT_ID}
ENV REACT_APP_AUTH0_SCOPE=${REACT_APP_AUTH0_SCOPE}

RUN yarn build

# deployment
FROM nginx:1.19-alpine AS deployment

COPY --from=builder /app/build /usr/share/nginx/html
COPY ./nginx/default.conf /etc/nginx/conf.d/default.conf.template
COPY ./nginx/nginx.conf /etc/nginx/nginx.conf
COPY ./nginx/entrypoint.sh /entrypoint.sh

# Make our entrypoint script executable
RUN chmod +x /entrypoint.sh

CMD ["/entrypoint.sh"]
