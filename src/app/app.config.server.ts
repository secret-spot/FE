import { mergeApplicationConfig, ApplicationConfig } from '@angular/core';
import { provideServerRendering } from '@angular/platform-server';
import { provideServerRouting } from '@angular/ssr';
import { appConfig } from './app.config';
import { serverRoutes } from './app.routes.server';
import { REQUEST } from '@nguniversal/express-engine/tokens';

const serverConfig: ApplicationConfig = {
  providers: [
    provideServerRendering(),
    provideServerRouting(serverRoutes),
    { provide: REQUEST, useValue: {} }
  ]
};

export const config = mergeApplicationConfig(appConfig, serverConfig);
