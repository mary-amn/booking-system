
FROM node:20-alpine AS builder

WORKDIR /usr/src/app

COPY package*.json ./


COPY . .

RUN npm run build


FROM node:20-alpine

WORKDIR /usr/src/app

COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/dist ./dist

EXPOSE 3000

# The command to start the application
CMD ["node", "dist/main"]