# Example-4

This example demonstrates end to end testing a microservice with Cypress.

First you must boot the microservices application:

```bash
docker-compose up --build
```

Now install dependencies for testing:

```bash
cd example-4
npm install
```

Then run headless Cypress tests:

```bash
npm test
```

Or to show the Cypress UI:

```bash
npm run test:watch
```