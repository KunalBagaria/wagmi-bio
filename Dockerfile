FROM node:16
WORKDIR /usr/src/app
COPY package.json yarn.lock ./
RUN yarn
RUN yarn add stream-browserify --dev
COPY . ./
RUN yarn build
CMD yarn start