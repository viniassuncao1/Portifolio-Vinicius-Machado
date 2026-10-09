import { Route, Routes } from '@angular/router';

import { DADO_ARVORE_NO_INICIO, SECOES } from './core/secoes';
import { TITULO_INICIO } from './core/titulos';
import { Casca } from './layout/casca/casca';

type CarregadorDeSecao = NonNullable<Route['loadComponent']>;

/**
 * Seções com feature própria, por slug. Uma seção nova só acrescenta uma entrada aqui; as demais
 * mostram o aviso de "em construção".
 */
const FEATURES_DAS_SECOES: Readonly<Record<string, CarregadorDeSecao>> = {
  'sobre-mim': () => import('./features/sobre-mim/sobre-mim').then((m) => m.SobreMim),
  diferenciais: () => import('./features/diferenciais/diferenciais').then((m) => m.Diferenciais),
};

const EM_CONSTRUCAO: CarregadorDeSecao = () =>
  import('./shared/secao-em-construcao/secao-em-construcao').then((m) => m.SecaoEmConstrucao);

export const routes: Routes = [
  {
    path: '',
    component: Casca,
    children: [
      {
        path: '',
        title: TITULO_INICIO,
        data: { [DADO_ARVORE_NO_INICIO]: true },
        loadComponent: () => import('./features/inicio/inicio').then((m) => m.Inicio),
      },
      ...SECOES.map((secao) => ({
        path: secao.slug,
        title: secao.titulo,
        loadComponent: FEATURES_DAS_SECOES[secao.slug] ?? EM_CONSTRUCAO,
      })),
    ],
  },
  { path: '**', redirectTo: '' },
];
