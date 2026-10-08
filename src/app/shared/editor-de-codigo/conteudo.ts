export type Papel = 'palavra-chave' | 'declaracao' | 'literal' | 'anotacao' | 'comum';

export interface Trecho {
  readonly texto: string;
  readonly papel: Papel;
}

export interface LinhaDeCodigo {
  readonly tipo: 'codigo';
  readonly recuo: number;
  readonly trechos: readonly Trecho[];
}

export interface LinhaDeParagrafo {
  readonly tipo: 'paragrafo';
  readonly recuo: number;
  readonly texto: string;
}

export interface LinhaVazia {
  readonly tipo: 'vazia';
}

export type Linha = LinhaDeCodigo | LinhaDeParagrafo | LinhaVazia;

export type ConteudoDoEditor = readonly Linha[];

export const palavraChave = (texto: string): Trecho => ({ texto, papel: 'palavra-chave' });
export const declaracao = (texto: string): Trecho => ({ texto, papel: 'declaracao' });
export const literal = (texto: string): Trecho => ({ texto, papel: 'literal' });
export const anotacao = (texto: string): Trecho => ({ texto, papel: 'anotacao' });
export const comum = (texto: string): Trecho => ({ texto, papel: 'comum' });

export const linha = (recuo: number, ...trechos: readonly Trecho[]): LinhaDeCodigo => ({
  tipo: 'codigo',
  recuo,
  trechos,
});

export const paragrafo = (recuo: number, texto: string): LinhaDeParagrafo => ({
  tipo: 'paragrafo',
  recuo,
  texto,
});

export const vazia = (): LinhaVazia => ({ tipo: 'vazia' });
