FROM node:20.10-bullseye-slim AS base

RUN apt-get update && apt-get install -y \
    bash \
    net-tools

ARG NODE_ENV=development
ENV NODE_ENV=${NODE_ENV}

WORKDIR /dir

RUN npm install -g --arch=x64 --platform=linux --libc=glibc sharp@0.33.0-rc.2
RUN npm install --force @img/sharp-linux-x64

RUN yarn global add node-gyp
RUN yarn install --frozen-lockfile
ENV PATH /app/node_modules/.bin:$PATH


WORKDIR /app

EXPOSE 3000