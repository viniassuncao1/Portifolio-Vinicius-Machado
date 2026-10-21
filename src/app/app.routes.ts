import { Route, Routes } from '@angular/router';

import { projetoDoSlug } from './core/projetos';
import { DADO_ARVORE_NO_INICIO, SECOES } from './core/secoes';
import type { Secao } from './core/secoes';
import { TITULO_INICIO, TITULO_REPOSITORIO } from './core/titulos';
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
  experiencias: () => import('./features/experiencias/experiencias').then((m) => m.Experiencias),
  certificacoes: () =>
    import('./features/certificacoes/certificacoes').then((m) => m.Certificacoes),
  projetos: () => import('./features/projetos/vitrine').then((m) => m.Vitrine),
  'projeto-1': () => import('./features/projeto-1/projeto-1').then((m) => m.Projeto1),
  'projeto-2': () => import('./features/projeto-2/projeto-2').then((m) => m.Projeto2),
  'projeto-3': () => import('./features/projeto-3/projeto-3').then((m) => m.Projeto3),
  'projeto-4': () => import('./features/projeto-4/projeto-4').then((m) => m.Projeto4),
  'projeto-5': () => import('./features/projeto-5/projeto-5').then((m) => m.Projeto5),
  'projeto-6': () => import('./features/projeto-6/projeto-6').then((m) => m.Projeto6),
  eventos: () => import('./features/eventos/eventos').then((m) => m.Eventos),
  formacao: () => import('./features/formacao/formacao').then((m) => m.Formacao),
  idiomas: () => import('./features/idiomas/idiomas').then((m) => m.Idiomas),
  depoimentos: () => import('./features/depoimentos/depoimentos').then((m) => m.Depoimentos),
  contato: () => import('./features/contato/contato').then((m) => m.Contato),
};

const EM_CONSTRUCAO: CarregadorDeSecao = () =>
  import('./shared/secao-em-construcao/secao-em-construcao').then((m) => m.SecaoEmConstrucao);

/**
 * Seções que já tiveram várias páginas (`/skills/2`, `/projeto-5/4`...) e podem estar em links já
 * compartilhados: esses endereços redirecionam para a seção.
 */
export const SECOES_COM_ENDERECO_ANTIGO: readonly string[] = [
  'skills',
  'experiencias',
  'projeto-4',
  'projeto-5',
  'certificacoes',
];

/**
 * A vitrine continua montada quando o projeto aberto muda (`/projetos/<slug>`), para o carrossel
 * não perder a posição: o slug é uma rota filha sem componente, e a vitrine lê o endereço.
 */
const ROTAS_FILHAS: Readonly<Record<string, Routes>> = {
  projetos: [
    {
      path: ':slug',
      title: (rota) => projetoDoSlug(rota.paramMap.get('slug'))?.titulo ?? 'Vitrine de projetos',
      children: [],
    },
  ],
};

/** Rotas de uma seção: `<slug>`, com o arquivo inteiro. */
function rotaDaSecao(secao: Secao): Route {
  return {
    path: secao.slug,
    title: secao.titulo,
    loadComponent: FEATURES_DAS_SECOES[secao.slug] ?? EM_CONSTRUCAO,
    children: ROTAS_FILHAS[secao.slug],
  };
}

const redirecionamentosDeEnderecosAntigos: Routes = SECOES_COM_ENDERECO_ANTIGO.map((slug) => ({
  path: `${slug}/:pagina`,
  redirectTo: `/${slug}`,
}));

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
      ...SECOES.map(rotaDaSecao),
      ...redirecionamentosDeEnderecosAntigos,
      {
        path: 'repositorio',
        title: TITULO_REPOSITORIO,
        loadComponent: () =>
          import('./features/repositorio/repositorio').then((m) => m.Repositorio),
      },
    ],
  },
  { path: '**', redirectTo: '' },
];
