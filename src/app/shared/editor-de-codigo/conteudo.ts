export type Papel =
  'palavra-chave' | 'declaracao' | 'literal' | 'valor' | 'anotacao' | 'comentario' | 'comum';

/**
 * Altura da linha. Sem valor é a linha normal; `compacta` (3/4) e `apertada` (3/5) vêm das listas
 * das telas, onde várias linhas ocupam menos espaço que o número de linha.
 */
export type Densidade = 'compacta' | 'apertada';

export interface Trecho {
  readonly texto: string;
  readonly papel: Papel;
  /** Quando existe, o trecho vira um link (`https://`, `mailto:`, `tel:`). */
  readonly href?: string;
}

export interface LinhaDeCodigo {
  readonly tipo: 'codigo';
  readonly recuo: number;
  /** `compacta`: a lista de strings da tela 01 (4 linhas ocupam 3 linhas de número). */
  readonly densidade?: Densidade;
  readonly trechos: readonly Trecho[];
}

export interface LinhaDeParagrafo {
  readonly tipo: 'paragrafo';
  readonly recuo: number;
  readonly texto: string;
}

/**
 * Comentário Javadoc: o editor desenha a abertura, a coluna de asteriscos e o fechamento como
 * elementos só visuais, então o texto copiado e lido por leitores de tela é apenas `texto`.
 */
export interface LinhaDeJavadoc {
  readonly tipo: 'javadoc';
  readonly recuo: number;
  readonly texto: string;
}

export interface LinhaVazia {
  readonly tipo: 'vazia';
  /** Vazia com a altura das linhas da mesma densidade (telas 03 a 06). */
  readonly densidade?: Densidade;
}

export type Linha = LinhaDeCodigo | LinhaDeParagrafo | LinhaDeJavadoc | LinhaVazia;

export type ConteudoDoEditor = readonly Linha[];

export const palavraChave = (texto: string): Trecho => ({ texto, papel: 'palavra-chave' });
export const declaracao = (texto: string): Trecho => ({ texto, papel: 'declaracao' });
export const literal = (texto: string): Trecho => ({ texto, papel: 'literal' });
export const valor = (texto: string): Trecho => ({ texto, papel: 'valor' });
export const anotacao = (texto: string): Trecho => ({ texto, papel: 'anotacao' });
export const comentario = (texto: string): Trecho => ({ texto, papel: 'comentario' });
export const comum = (texto: string): Trecho => ({ texto, papel: 'comum' });

/** Transforma um trecho em link: `link(literal('"site.com"'), 'https://site.com')`. */
export const link = (trecho: Trecho, href: string): Trecho => ({ ...trecho, href });

export const linha = (recuo: number, ...trechos: readonly Trecho[]): LinhaDeCodigo => ({
  tipo: 'codigo',
  recuo,
  trechos,
});

const comDensidade =
  (densidade: Densidade) =>
  (recuo: number, ...trechos: readonly Trecho[]): LinhaDeCodigo => ({
    tipo: 'codigo',
    recuo,
    densidade,
    trechos,
  });

export const linhaCompacta = comDensidade('compacta');
export const linhaApertada = comDensidade('apertada');

export const paragrafo = (recuo: number, texto: string): LinhaDeParagrafo => ({
  tipo: 'paragrafo',
  recuo,
  texto,
});

/** Bloco Javadoc com o texto quebrado em 72 colunas, alinhado ao recuo da declaração. */
export const javadoc = (recuo: number, texto: string): LinhaDeJavadoc => ({
  tipo: 'javadoc',
  recuo,
  texto,
});

export const vazia = (): LinhaVazia => ({ tipo: 'vazia' });
export const vaziaCompacta = (): LinhaVazia => ({ tipo: 'vazia', densidade: 'compacta' });
export const vaziaApertada = (): LinhaVazia => ({ tipo: 'vazia', densidade: 'apertada' });
