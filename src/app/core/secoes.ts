import type { NomeDoIcone } from '../shared/icone/icone';

export interface Secao {
  readonly slug: string;
  readonly titulo: string;
  readonly icone: NomeDoIcone;
}

/** Fonte única das seções: dela saem os itens da árvore e as rotas, na ordem do design. */
export const SECOES: readonly Secao[] = [
  { slug: 'sobre-mim', titulo: 'Sobre Mim', icone: 'arquivo' },
  { slug: 'diferenciais', titulo: 'Diferenciais', icone: 'pasta' },
  { slug: 'como-uso-ia', titulo: 'Como uso a IA', icone: 'ia' },
  { slug: 'skills', titulo: 'Skills / STACK', icone: 'ferramenta' },
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
