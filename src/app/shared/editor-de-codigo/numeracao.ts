import { paragrafosDoJavadoc } from './conteudo';
import type { Linha, LinhaDeJavadoc } from './conteudo';

/** Uma linha da coluna de números: o número (ou `null` num espaço) e a altura que ela ocupa. */
export interface Faixa {
  readonly numero: number | null;
  /** Altura em px; `null` é a altura de uma linha de código. */
  readonly altura: number | null;
}

export interface Numeracao {
  readonly faixas: readonly Faixa[];
  /** Número da linha em que cada item do conteúdo começa. */
  readonly numeroDoItem: readonly number[];
}

/** O que a medição do navegador informa ao cálculo. */
export interface Medidas {
  /** Altura de cada item do conteúdo, na mesma ordem. */
  readonly alturas: readonly number[];
  /** Altura da linha dos Javadocs no modo cru, em px. */
  readonly alturaDaLinhaDoJavadoc: number;
  /** Os Javadocs aparecem no modo de leitura (um número por bloco). */
  readonly leitura: boolean;
  /** Code vision sem número, antes do item de índice `antesDoItem`. */
  readonly visao: { readonly antesDoItem: number; readonly altura: number } | null;
}

/** Quantos números a coluna mostra, no mínimo, como as telas do design (o resto é recortado). */
export const QUANTIDADE_MINIMA_DE_NUMEROS = 99;
const COLUNAS_DO_JAVADOC = 72;

/** Números 1 a 99 de linhas de código, para o servidor e antes da primeira medição. */
export const FAIXAS_PADRAO: readonly Faixa[] = Array.from(
  { length: QUANTIDADE_MINIMA_DE_NUMEROS },
  (_, i) => ({ numero: i + 1, altura: null }),
);

function linhasDoParagrafo(texto: string, colunas: number): number {
  let linhas = 1;
  let atual = 0;
  for (const palavra of texto.split(/\s+/).filter(Boolean)) {
    const tamanho = [...palavra].length;
    if (atual === 0) atual = tamanho;
    else if (atual + 1 + tamanho <= colunas) atual += 1 + tamanho;
    else {
      linhas += 1;
      atual = tamanho;
    }
    while (atual > colunas) {
      linhas += 1;
      atual -= colunas;
    }
  }
  return linhas;
}

/**
 * Quantas linhas o Javadoc tem no código-fonte: a abertura, o texto quebrado em 72 colunas, uma linha
 * em branco entre parágrafos, o `@author` e o fechamento. É o que o IntelliJ numera, no modo cru e no de leitura.
 */
export function linhasDoJavadoc(item: LinhaDeJavadoc): number {
  const paragrafos = paragrafosDoJavadoc(item.texto).map((texto) =>
    linhasDoParagrafo(texto, COLUNAS_DO_JAVADOC),
  );
  const blocos = paragrafos.length + (item.autor ? 1 : 0);
  const texto = paragrafos.reduce((soma, linhas) => soma + linhas, 0) + (item.autor ? 1 : 0);
  return 2 + texto + Math.max(0, blocos - 1);
}

/**
 * Numera por linha lógica, como o soft-wrap do IntelliJ: uma linha de código que quebra na tela
 * tem um só número, na primeira linha visual. O Javadoc cru tem um número por linha do comentário; no
 * modo de leitura, um só número (o da primeira linha) e a numeração continua como se fosse cru.
 */
export function faixasDeNumeracao(itens: readonly Linha[], medidas: Medidas): Numeracao {
  const faixas: Faixa[] = [];
  const numeroDoItem: number[] = [];
  let numero = 1;

  itens.forEach((item, indice) => {
    if (medidas.visao?.antesDoItem === indice) {
      faixas.push({ numero: null, altura: medidas.visao.altura });
    }
    numeroDoItem.push(numero);
    const altura = medidas.alturas[indice];

    if (item.tipo !== 'javadoc') {
      faixas.push({ numero, altura });
      numero += 1;
      return;
    }

    const linhas = linhasDoJavadoc(item);
    if (medidas.leitura) {
      faixas.push({ numero, altura });
    } else {
      const linha = medidas.alturaDaLinhaDoJavadoc;
      for (let i = 0; i < linhas; i++) {
        const ultima = i === linhas - 1;
        faixas.push({
          numero: numero + i,
          altura: ultima ? Math.max(linha, altura - i * linha) : linha,
        });
      }
    }
    numero += linhas;
  });

  for (; numero <= QUANTIDADE_MINIMA_DE_NUMEROS; numero++) faixas.push({ numero, altura: null });
  return { faixas, numeroDoItem };
}
