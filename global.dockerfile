FROM node:alpine as builder
WORKDIR /app
COPY --chown=node:node package.json yarn.lock ./
RUN yarn install --frozen-lockfile 
COPY --chown=node:node . .
RUN yarn build


# Dev stage
FROM builder as dev
WORKDIR /app
EXPOSE 3000
CMD ["yarn", "dev:global"]


# Prod stage
FROM node:alpine as prod
WORKDIR /app
COPY --from=builder /app/node_modules ./dist/node_modules
COPY --from=builder /app/dist/src ./dist/src
CMD ["node", "dist/src/services/global/index.js"]