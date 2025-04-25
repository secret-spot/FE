# SecretSpot

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 19.2.5.

## Environment Variables Setup

Before running the application, you need to set up the environment variables:

1. Copy the example environment file:
   ```bash
   cp src/environments/environment.example.ts src/environments/environment.ts
   ```

2. Edit the `environment.ts` file and replace the placeholder values with your actual API keys and configuration:
   ```typescript
   export const environment = {
     production: false,
     apiUrl: 'https://your-api-url.com/',
     frontendUrl: 'http://localhost:4200',
     googleMapsApiKey: 'your_google_maps_api_key_here' // Replace with your actual API key
   };
   ```

3. For production, create a production environment file:
   ```bash
   cp src/environments/environment.example.ts src/environments/environment.prod.ts
   ```

4. Edit the `environment.prod.ts` file with your production configuration.

**Note:** The environment files are ignored by Git to prevent sensitive information from being exposed. Make sure to keep your API keys and other sensitive information secure.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
# FE
