FROM node:alpine as dev

WORKDIR /app
EXPOSE 3000
CMD [ "yarn", "dev" ]