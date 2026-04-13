# Genderize API (NestJS)

Simple REST API that predicts gender from a given first name using the public Genderize service.

## Overview

This project is built with NestJS and exposes one main endpoint:

- GET /api/classify?name=<first_name>

The API fetches data from https://api.genderize.io and transforms it into a normalized response format.

## Tech Stack

- Node.js
- NestJS 11
- TypeScript
- @nestjs/axios for outbound HTTP requests

## Project Structure

```text
genderize-api/
  src/
    main.ts
    app.module.ts
    app.controller.ts
    app.service.ts
    classify/
      classify.module.ts
      classify.controller.ts
      classify.service.ts
    classifize/
      classifyResult.ts
  test/
    app.e2e-spec.ts
    jest-e2e.json
```

## How It Works

1. Client calls GET /api/classify?name=alex.
2. Controller validates query parameter name.
3. Service calls Genderize API with the same name.
4. Service maps response into this shape:
   - status
   - data.name
   - data.gender
   - data.probability
   - data.sample_size
   - data.is_confident
   - data.processed_at

Confidence logic:

- is_confident is true when:
  - probability >= 0.7
  - sample_size >= 100

## Prerequisites

- Node.js 18+ (recommended)
- npm

## Installation

```bash
npm install
```

## Run Locally

```bash
# start
npm run start

# watch mode
npm run start:dev

# production build + run
npm run build
npm run start:prod
```

Default server port is 8900.

You can override it with:

```bash
set PORT=3000
npm run start
```

## API Endpoints

### Health / Hello

GET /

Example response:

```json
"Hello World!"
```

### Classify Name

GET /api/classify?name=<first_name>

Example request:

```bash
curl "http://localhost:8900/api/classify?name=alex"
```

Success response example:

```json
{
  "status": "success",
  "data": {
    "name": "alex",
    "gender": "male",
    "probability": 0.98,
    "sample_size": 12345,
    "is_confident": true,
    "processed_at": "2026-04-13T15:30:12.123Z"
  }
}
```

Validation / error responses:

- 400 when name is missing, empty, or whitespace.
- 422 when name is present but not a string.
- 502 when the upstream Genderize API cannot be reached.
- 200 with an error body when no prediction is available.

Example missing name response:

```json
{
  "status": "error",
  "message": "Query parameter \"name\" is required and must not be empty"
}
```

Example no prediction response:

```json
{
  "status": "error",
  "message": "No prediction available for the provided name"
}
```

## CORS

Global CORS is enabled for all origins, with GET and OPTIONS methods.

## Scripts

```bash
npm run build
npm run start
npm run start:dev
npm run start:prod
npm run lint
npm run test
npm run test:e2e
npm run test:cov
```

## Testing

```bash
npm run test
npm run test:e2e
```

## Notes

- This API depends on a third-party service (genderize.io). Availability and response quality depend on that upstream service.
- Timestamps are returned in UTC ISO 8601 format.
