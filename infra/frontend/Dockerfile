FROM node:22-alpine AS build

WORKDIR /app

ARG VITE_API_URL=http://127.0.0.1:8000/api
ARG VITE_SITE_URL=http://127.0.0.1

ENV VITE_API_URL=${VITE_API_URL}
ENV VITE_SITE_URL=${VITE_SITE_URL}

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM alpine:3.20

WORKDIR /app

COPY --from=build /app/dist /app/dist

CMD ["sh", "-c", "rm -rf /frontend-dist/* && cp -r /app/dist/. /frontend-dist && tail -f /dev/null"]
