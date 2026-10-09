import { Routes } from '@angular/router';

import { SECOES } from './core/secoes';
import { TITULO_INICIO } from './core/titulos';
import { Casca } from './layout/casca/casca';

export const routes: Routes = [
  {
    path: '',
    component: Casca,
    children: [
      {
        path: '',
        title: TITULO_INICIO,
        loadComponent: () => import('./features/inicio/inicio').then((m) => m.Inicio),
      },
      // Enquanto a seção não tem feature própria, a rota carrega o aviso de "em construção".
      ...SECOES.map((secao) => ({
        path: secao.slug,
        title: secao.titulo,
        loadComponent: () =>
          import('./shared/secao-em-construcao/secao-em-construcao').then(
            (m) => m.SecaoEmConstrucao,
          ),
      })),
    ],
  },
  { path: '**', redirectTo: '' },
];
