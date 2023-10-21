# Build React App
FROM node:16-alpine AS node_builder

RUN mkdir /app
ADD . /app
WORKDIR /app/frontend

RUN npm ci
RUN npm run build

# Build Go App and add React app
FROM golang:1.21.3-alpine AS builder

RUN apk add build-base

RUN mkdir /app
WORKDIR /app

COPY go.mod .
COPY go.sum .

RUN go mod download
RUN go mod tidy

COPY . .
COPY --from=node_builder /app/frontend/build ./frontend/build

RUN go build -o main ./cmd/server

EXPOSE 8080

CMD ["/app/main"]
