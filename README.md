# cards-110-frontend

The frontend for the [Cards 110 application](https://github.com/daithihearn/cards-110)

# Reqirements

An instance of [Cards 110 API](https://github.com/daithihearn/cards-110-api) must be available
An instance of [Cards 110 Websocket Service](https://github.com/daithihearn/cards-110-websocket-service) must be available
You will also need an application and API configured in Auth0.

All of the above can be configured in the `.env` file.

# Technical Stack

-   NPM >=v14
-   Yarn
-   React

# Building

To build locally run `yarn && yarn build`
To build the docker image run `docker build . -t cards110-frontend`

# Running

To run locally built docker image run `docker run -d -p 3000:80 --env-file .env --name cards110-frontend cards110-frontend`
