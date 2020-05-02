FROM node:8.9.1

RUN mkdir -p /opt/app

# set our node environment, either development or production
# defaults to production, compose overrides this to development on build and run
ARG NODE_ENV=production
ENV NODE_ENV $NODE_ENV

# default to port 80 for node, and 5858 or 9229 for debug
ARG PORT=80
ENV PORT $PORT
EXPOSE $PORT 5858 9229

# install dependencies first, in a different location for easier app bind mounting for local development
WORKDIR /opt/app
COPY package.json /opt/app
RUN npm install && npm cache clean --force
ENV PATH /opt/app/node_modules/.bin:$PATH

# copy in our source code last, as it changes the most
COPY . /opt/app

CMD [ "npm", "start" ]