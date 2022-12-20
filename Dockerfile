FROM node:alpine as builder

COPY --chown=node:node package*.json .
RUN npm ci
COPY --chown=node:node . .

FROM builder as dev
EXPOSE 3000
CMD [ "npm", "run", "dev" ]