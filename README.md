# Currency exchange API - IBM backend developer interview assignment

## Description

Implementation as per the [Interview assignment](./interview-assignment.md)

## Tech stack overview

For the framework, I chose [nest](https://nestjs.com/) to get DI, testing, OpenAPI, validation and many other things out of the box. However, every single feature used from it could've very well been implemented in Next, if given enough time

[fp-ts](https://github.com/gcanti/fp-ts) is used to go from `any` to a guaranteed return type with the edge-cases and errors handled in a declarative and concise way

## Deployement

The API is live at [https://currency-exchange-api.vercel.app](https://currency-exchange-api.vercel.app), deployed using [Vercel](https://vercel.com/)

## Installation

```bash
$ npm install
```

## Configuration

Copy `.env.example` into `.env`, and provide the `RAPID_API_KEY`

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# e2e tests
$ npm run test:e2e
```

## OpenAPI

Swagger UI is available on `/api/v1/docs`, and the JSON — at `api/v1/docs-json`
