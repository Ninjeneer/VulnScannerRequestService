FROM node:alpine as builder
WORKDIR /app
COPY --chown=node:node package.json yarn.lock ./
RUN yarn install --frozen-lockfile 

COPY --chown=node:node . .
RUN yarn build


# Prod stage
FROM node:alpine as prod
WORKDIR /app
COPY --from=builder /app/node_modules ./dist/node_modules
COPY --from=builder /app/dist/src ./dist/src
CMD ["node", "dist/src/index.js"]