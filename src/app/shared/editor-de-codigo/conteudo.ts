export type Papel = 'palavra-chave' | 'declaracao' | 'literal' | 'valor' | 'anotacao' | 'comum';

/**
 * Altura da linha. Sem valor é a linha normal; `compacta` (3/4) e `apertada` (3/5) vêm das listas
 * das telas, onde várias linhas ocupam menos espaço que o número de linha.
 */
export type Densidade = 'compacta' | 'apertada';

export interface Trecho {
  readonly texto: string;
  readonly papel: Papel;
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

export interface LinhaVazia {
  readonly tipo: 'vazia';
  /** Vazia com a altura das linhas da mesma densidade (telas 03 a 06). */
  readonly densidade?: Densidade;
}

export type Linha = LinhaDeCodigo | LinhaDeParagrafo | LinhaVazia;

export type ConteudoDoEditor = readonly Linha[];

export const palavraChave = (texto: string): Trecho => ({ texto, papel: 'palavra-chave' });
export const declaracao = (texto: string): Trecho => ({ texto, papel: 'declaracao' });
export const literal = (texto: string): Trecho => ({ texto, papel: 'literal' });
export const valor = (texto: string): Trecho => ({ texto, papel: 'valor' });
export const anotacao = (texto: string): Trecho => ({ texto, papel: 'anotacao' });
export const comum = (texto: string): Trecho => ({ texto, papel: 'comum' });

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

export const vazia = (): LinhaVazia => ({ tipo: 'vazia' });
export const vaziaCompacta = (): LinhaVazia => ({ tipo: 'vazia', densidade: 'compacta' });
export const vaziaApertada = (): LinhaVazia => ({ tipo: 'vazia', densidade: 'apertada' });
