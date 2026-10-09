import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import {
  TitleStrategy,
  provideRouter,
  withComponentInputBinding,
  withViewTransitions,
} from '@angular/router';

import { routes } from './app.routes';
import { EstrategiaDeTitulo } from './core/estrategia-de-titulo';
import { pularTransicaoSeMovimentoReduzido } from './core/transicao-de-rota';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(
      routes,
      withViewTransitions({ onViewTransitionCreated: pularTransicaoSeMovimentoReduzido }),
      withComponentInputBinding(),
    ),
    { provide: TitleStrategy, useExisting: EstrategiaDeTitulo },
    provideClientHydration(withEventReplay()),
  ],
};
