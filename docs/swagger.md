# Swagger Documentation

The API uses **Swagger** for interactive API documentation. Below are the key configurations and guidelines for maintaining the Swagger documentation.

## Base Configuration

Swagger is configured in the `main.ts` file using the `DocumentBuilder` provided by NestJS. Key configurations include:

```typescript
const swaggerConfig = new DocumentBuilder()
.setTitle('Project API')
.setDescription('The Project API description')
.setVersion('1.0')
.addTag('Project')
.addBearerAuth()
.addGlobalParameters({
name: 'x-correlation-id',
description: 'Correlation identifier for related requests',
required: false,
in: 'header',
})
.build();
```

## Global Headers

- **x-correlation-id**
  - **Description**: A unique identifier to trace related requests.
  - **Type**: `string`
  - **Required**: `false`
  - **Scope**: Request headers.

- **x-app-version**
  - **Description**: The client’s API version. Used to validate compatibility.
  - **Type**: `string`
  - **Required**: `false`
  - **Format**: Semantic versioning (e.g., `1.0.0`).

## Customizing Swagger

You can customize Swagger by:

1. Adding or modifying tags using `addTag()`.
2. Adding security schemes like Bearer Auth with `addBearerAuth()`.
3. Including global request headers with `addGlobalParameters()`.

## Accessing Swagger

The Swagger documentation is available at:
[http://localhost:3000/api/docs](http://localhost:3000/api/docs)

For further information on extending Swagger, refer to the [NestJS Swagger Documentation](https://docs.nestjs.com/openapi/introduction).
