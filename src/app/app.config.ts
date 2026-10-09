import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { TitleStrategy, provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { EstrategiaDeTitulo } from './core/estrategia-de-titulo';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    { provide: TitleStrategy, useExisting: EstrategiaDeTitulo },
    provideClientHydration(withEventReplay()),
  ],
};
