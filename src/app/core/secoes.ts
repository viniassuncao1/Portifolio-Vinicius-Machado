import type { NomeDoIcone } from '../shared/icone/icone';

export interface Secao {
  readonly slug: string;
  readonly titulo: string;
  readonly icone: NomeDoIcone;
  /** Quantas páginas a seção tem (padrão 1): `/<slug>` e `/<slug>/2` até `/<slug>/N`. */
  readonly paginas?: number;
}

/** Fonte única das seções: dela saem os itens da árvore e as rotas, na ordem do design. */
export const SECOES: readonly Secao[] = [
  { slug: 'sobre-mim', titulo: 'Sobre Mim', icone: 'arquivo' },
  { slug: 'diferenciais', titulo: 'Diferenciais', icone: 'pasta' },
  { slug: 'como-uso-ia', titulo: 'Como uso a IA', icone: 'ia' },
  { slug: 'skills', titulo: 'Skills / STACK', icone: 'ferramenta', paginas: 2 },
  { slug: 'experiencias', titulo: 'Experiências', icone: 'pasta' },
  { slug: 'projeto-1', titulo: 'Projeto 1', icone: 'arquivo' },
  { slug: 'projeto-2', titulo: 'Projeto 2', icone: 'arquivo' },
  { slug: 'projeto-3', titulo: 'Projeto 3', icone: 'arquivo' },
  { slug: 'projeto-4', titulo: 'Projeto 4', icone: 'arquivo' },
  { slug: 'certificacoes', titulo: 'Certificações', icone: 'pasta' },
  { slug: 'eventos', titulo: 'Eventos', icone: 'projeto' },
  { slug: 'formacao', titulo: 'Formação', icone: 'globo' },
  { slug: 'idiomas', titulo: 'Idiomas', icone: 'executar' },
  { slug: 'depoimentos', titulo: 'Depoimentos/Recomendações', icone: 'arquivo' },
  { slug: 'contato', titulo: 'Contato', icone: 'pasta' },
];

/** Chave do `data` da rota que pede a árvore com a primeira seção destacada, sem página atual. */
export const DADO_ARVORE_NO_INICIO = 'arvoreNoInicio';

/** Chaves do `data` das rotas de seção: o nome é o dos inputs que a feature recebe da rota. */
export interface DadosDePagina {
  readonly pagina: number;
  readonly totalDePaginas: number;
}

export const totalDePaginas = (secao: Secao): number => secao.paginas ?? 1;
