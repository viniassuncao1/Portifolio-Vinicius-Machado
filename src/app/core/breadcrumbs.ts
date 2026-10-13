import type { Pacote } from './secoes';

/** Caminho fixo do projeto até o pacote raiz, como numa estrutura Maven. */
const CAMINHO_DO_PROJETO: readonly string[] = [
  'portfolio-vinicius',
  'src',
  'main',
  'java',
  'dev',
  'vinicius',
  'portfolio',
];

/** O que os breadcrumbs precisam saber do arquivo: o nome e o pacote (sem pacote, fica na raiz). */
export interface ArquivoDoProjeto {
  readonly arquivo: string;
  readonly pacote?: Pacote;
}

/**
 * Segmentos do caminho do arquivo, do projeto até o `.java`, por exemplo
 * `portfolio-vinicius › src › main › java › dev › vinicius › portfolio › skills › Skills.java`.
 * Truncar os do meio quando faltar espaço é com quem desenha a barra.
 */
export const breadcrumbs = ({ arquivo, pacote }: ArquivoDoProjeto): readonly string[] => [
  ...CAMINHO_DO_PROJETO,
  ...(pacote ? [pacote] : []),
  arquivo,
];
