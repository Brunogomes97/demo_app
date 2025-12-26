FROM node:18-alpine AS build
WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

COPY . .
RUN yarn build

FROM node:18-alpine
WORKDIR /app

COPY --from=build /app ./
EXPOSE 3000

CMD ["yarn", "start"]
