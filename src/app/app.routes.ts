import { Route, Routes } from '@angular/router';

import { DADO_ARVORE_NO_INICIO, SECOES, totalDePaginas } from './core/secoes';
import type { DadosDePagina, Secao } from './core/secoes';
import { TITULO_INICIO } from './core/titulos';
import { Casca } from './layout/casca/casca';

type CarregadorDeSecao = NonNullable<Route['loadComponent']>;

/**
 * Seções com feature própria, por slug. Uma seção nova só acrescenta uma entrada aqui; as demais
 * mostram o aviso de "em construção".
 */
const FEATURES_DAS_SECOES: Readonly<Record<string, CarregadorDeSecao>> = {
  'sobre-mim': () => import('./features/sobre-mim/sobre-mim').then((m) => m.SobreMim),
  'como-uso-ia': () => import('./features/como-uso-ia/como-uso-ia').then((m) => m.ComoUsoIa),
  skills: () => import('./features/skills/skills').then((m) => m.Skills),
  diferenciais: () => import('./features/diferenciais/diferenciais').then((m) => m.Diferenciais),
};

const EM_CONSTRUCAO: CarregadorDeSecao = () =>
  import('./shared/secao-em-construcao/secao-em-construcao').then((m) => m.SecaoEmConstrucao);

/** Rotas de uma seção: `<slug>` (página 1) e `<slug>/2` ... `<slug>/N`, cada uma com sua página. */
function rotasDaSecao(secao: Secao): Routes {
  const total = totalDePaginas(secao);
  return Array.from({ length: total }, (_, i) => {
    const pagina = i + 1;
    const dados: DadosDePagina = { pagina, totalDePaginas: total };
    return {
      path: pagina === 1 ? secao.slug : `${secao.slug}/${pagina}`,
      title: secao.titulo,
      data: { ...dados },
      loadComponent: FEATURES_DAS_SECOES[secao.slug] ?? EM_CONSTRUCAO,
    };
  });
}

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
      ...SECOES.flatMap(rotasDaSecao),
    ],
  },
  { path: '**', redirectTo: '' },
];
