import type { NomeDoIcone } from '../shared/icone/icone';

export interface Secao {
  readonly slug: string;
  readonly titulo: string;
  readonly icone: NomeDoIcone;
  /** Nome do arquivo `.java` da seção, mostrado na aba, na barra de status e na busca. */
  readonly arquivo: string;
  /** Quantas páginas a seção tem (padrão 1): `/<slug>` e `/<slug>/2` até `/<slug>/N`. */
  readonly paginas?: number;
}

/** Fonte única das seções: dela saem os itens da árvore e as rotas, na ordem do design. */
export const SECOES: readonly Secao[] = [
  { slug: 'sobre-mim', titulo: 'Sobre Mim', icone: 'arquivo', arquivo: 'SobreMim.java' },
  { slug: 'diferenciais', titulo: 'Diferenciais', icone: 'pasta', arquivo: 'Diferenciais.java' },
  { slug: 'como-uso-ia', titulo: 'Como uso a IA', icone: 'ia', arquivo: 'ComoUsoIA.java' },
  {
    slug: 'skills',
    titulo: 'Skills / STACK',
    icone: 'ferramenta',
    arquivo: 'Skills.java',
    paginas: 3,
  },
  {
    slug: 'experiencias',
    titulo: 'Experiências',
    icone: 'pasta',
    arquivo: 'Experiencias.java',
    paginas: 3,
  },
  { slug: 'projeto-1', titulo: 'Projeto 1', icone: 'arquivo', arquivo: 'Projeto1.java' },
  { slug: 'projeto-2', titulo: 'Projeto 2', icone: 'arquivo', arquivo: 'Projeto2.java' },
  { slug: 'projeto-3', titulo: 'Projeto 3', icone: 'arquivo', arquivo: 'Projeto3.java' },
  { slug: 'projeto-4', titulo: 'Projeto 4', icone: 'arquivo', arquivo: 'Projeto4.java' },
  { slug: 'certificacoes', titulo: 'Certificações', icone: 'pasta', arquivo: 'Certificacoes.java' },
  { slug: 'eventos', titulo: 'Eventos', icone: 'projeto', arquivo: 'Eventos.java' },
  { slug: 'formacao', titulo: 'Formação', icone: 'globo', arquivo: 'Formacao.java' },
  { slug: 'idiomas', titulo: 'Idiomas', icone: 'executar', arquivo: 'Idiomas.java' },
  {
    slug: 'depoimentos',
    titulo: 'Depoimentos/Recomendações',
    icone: 'arquivo',
    arquivo: 'Depoimentos.java',
  },
  { slug: 'contato', titulo: 'Contato', icone: 'pasta', arquivo: 'Contato.java' },
];

/** Chave do `data` da rota que pede a árvore com a primeira seção destacada, sem página atual. */
export const DADO_ARVORE_NO_INICIO = 'arvoreNoInicio';

/** Chaves do `data` das rotas de seção: o nome é o dos inputs que a feature recebe da rota. */
export interface DadosDePagina {
  readonly pagina: number;
  readonly totalDePaginas: number;
}

export const totalDePaginas = (secao: Secao): number => secao.paginas ?? 1;

/** Arquivo da página inicial (rota `/`), que não é uma das seções da árvore. */
export const ARQUIVO_INICIO = 'ViniciusMachado.java';
