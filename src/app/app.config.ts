import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';

import { routes } from './app.routes';
import { AuthService } from './core/services/auth.service';
import { ApiService } from './services/api.service';
import { PlaceService } from './services/place.service';
import { TravelRecordService } from './services/travel-record.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }), 
    provideRouter(routes), 
    provideHttpClient(),
    AuthService,
    provideAnimations(),
    ApiService,
    PlaceService,
    TravelRecordService
  ]
};
