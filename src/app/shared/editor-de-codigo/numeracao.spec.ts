import { comum, javadoc, linha, vazia } from './conteudo';
import { faixasDeNumeracao, linhasDoJavadoc } from './numeracao';

const medidas = (alturas: number[], extra: object = {}) => ({
  alturas,
  alturaDaLinhaDoJavadoc: 22,
  leitura: false,
  visao: null,
  ...extra,
});

describe('linhasDoJavadoc', () => {
  it('conta a abertura, o texto quebrado em 72 colunas e o fechamento', () => {
    expect(linhasDoJavadoc(javadoc(0, 'curto'))).toBe(3);
    expect(linhasDoJavadoc(javadoc(0, `${'palavra '.repeat(15)}fim`))).toBe(4);
  });

  it('põe uma linha em branco entre parágrafos e conta o @author', () => {
    const texto = 'um\n\ndois';
    const comAutor = { ...javadoc(0, texto), autor: { nome: 'A', href: 'https://a.example' } };

    expect(linhasDoJavadoc(javadoc(0, texto))).toBe(2 + 2 + 1);
    expect(linhasDoJavadoc(comAutor)).toBe(2 + 3 + 2);
  });
});

describe('faixasDeNumeracao', () => {
  it('dá um número por linha lógica: a linha que quebra na tela tem um só, na primeira linha visual', () => {
    const { faixas, numeroDoItem } = faixasDeNumeracao(
      [linha(0, comum('a')), linha(0, comum('b muito longa')), vazia(), linha(0, comum('c'))],
      medidas([22, 66, 22, 22]),
    );

    expect(faixas.slice(0, 4)).toEqual([
      { numero: 1, altura: 22 },
      { numero: 2, altura: 66 },
      { numero: 3, altura: 22 },
      { numero: 4, altura: 22 },
    ]);
    expect(numeroDoItem).toEqual([1, 2, 3, 4]);
  });

  it('numera cada linha do Javadoc cru, e a última leva o resto da altura', () => {
    const { faixas, numeroDoItem } = faixasDeNumeracao(
      [javadoc(0, 'curto'), linha(0, comum('a'))],
      medidas([100, 22]),
    );

    expect(faixas.slice(0, 4).map((f) => f.numero)).toEqual([1, 2, 3, 4]);
    expect(faixas[2].altura).toBe(100 - 2 * 22);
    expect(numeroDoItem).toEqual([1, 4]);
  });

  it('no modo de leitura o Javadoc tem um só número, e a numeração segue igual à do modo cru', () => {
    const itens = [javadoc(0, 'curto'), linha(0, comum('a'))];
    const leitura = faixasDeNumeracao(itens, medidas([100, 22], { leitura: true }));
    const cru = faixasDeNumeracao(itens, medidas([100, 22]));

    expect(leitura.faixas.slice(0, 2)).toEqual([
      { numero: 1, altura: 100 },
      { numero: 4, altura: 22 },
    ]);
    expect(leitura.numeroDoItem).toEqual(cru.numeroDoItem);
  });

  it('põe um espaço sem número para o code vision, antes da linha da classe', () => {
    const { faixas } = faixasDeNumeracao(
      [linha(0, comum('a')), { ...linha(0, comum('class')), executavel: true }],
      medidas([22, 22], { visao: { antesDoItem: 1, altura: 18 } }),
    );

    expect(faixas.slice(0, 3)).toEqual([
      { numero: 1, altura: 22 },
      { numero: null, altura: 18 },
      { numero: 2, altura: 22 },
    ]);
  });

  it('completa os números até o 99 depois do conteúdo', () => {
    const { faixas } = faixasDeNumeracao([linha(0, comum('a'))], medidas([22]));

    expect(faixas).toHaveLength(99);
    expect(faixas.at(-1)).toEqual({ numero: 99, altura: null });
  });
});
