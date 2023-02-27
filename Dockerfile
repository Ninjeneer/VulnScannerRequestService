FROM node:alpine as builder
WORKDIR /app
COPY --chown=node:node package.json yarn.lock ./
RUN yarn install --frozen-lockfile 

COPY --chown=node:node src .
RUN yarn build


# Prod stage
FROM node:alpine as prod
WORKDIR /app
COPY --from=builder /app ./dist
CMD ["node", "dist/src/index.js"]