# Build the frontend
FROM node:22-alpine as frontend-builder

COPY ./Frontend /app

WORKDIR /app

RUN npm install

RUN npm run build

# Build the backend
FROM node:22-alpine as backend-builder

COPY ./Backend /app

WORKDIR /app

RUN npm install

COPY --from=frontend-builder /app/dist  /app/public

CMD ["node", "server.js"]