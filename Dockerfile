# syntax = docker/dockerfile:1.2
FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

COPY . .
RUN yarn build

FROM node:20-alpine

WORKDIR /app

COPY --from=builder /app/package.json /app/yarn.lock ./
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules

EXPOSE 3000

# Secret 파일 마운트
#RUN --mount=type=secret,id=_FILE_NAME,dst=/etc/secrets/FILE_NAME cat /etc/secrets/FILE_NAME

CMD ["node", "dist/main"] 
