import {
  anotacao,
  comum,
  declaracao,
  linha,
  linhaApertada,
  linhaCompacta,
  literal,
  palavraChave,
  paragrafo,
  valor,
  vazia,
  vaziaApertada,
  vaziaCompacta,
  type Papel,
} from './conteudo';

describe('construtoras de conteúdo do editor', () => {
  it.each<[string, (texto: string) => { texto: string; papel: Papel }, Papel]>([
    ['palavraChave', palavraChave, 'palavra-chave'],
    ['declaracao', declaracao, 'declaracao'],
    ['literal', literal, 'literal'],
    ['valor', valor, 'valor'],
    ['anotacao', anotacao, 'anotacao'],
    ['comum', comum, 'comum'],
  ])('%s cria um trecho com o papel %s', (_nome, construtora, papel) => {
    expect(construtora('x')).toEqual({ texto: 'x', papel });
  });

  it('linha guarda o recuo e os trechos na ordem', () => {
    const resultado = linha(1, declaracao('String cargo'), comum(' = '), literal('"Java"'));

    expect(resultado).toEqual({
      tipo: 'codigo',
      recuo: 1,
      trechos: [
        { texto: 'String cargo', papel: 'declaracao' },
        { texto: ' = ', papel: 'comum' },
        { texto: '"Java"', papel: 'literal' },
      ],
    });
  });

  it('linha sem trechos resulta em lista vazia', () => {
    expect(linha(0).trechos).toEqual([]);
  });

  it('paragrafo guarda o recuo e o texto', () => {
    expect(paragrafo(0, 'Sou dev.')).toEqual({ tipo: 'paragrafo', recuo: 0, texto: 'Sou dev.' });
  });

  it('vazia cria uma linha em branco', () => {
    expect(vazia()).toEqual({ tipo: 'vazia' });
  });

  it('valor cria um trecho de valor literal, distinto do literal de texto', () => {
    expect(valor('true')).toEqual({ texto: 'true', papel: 'valor' });
    expect(valor('true').papel).not.toBe(literal('true').papel);
  });

  it('linhaCompacta marca a linha como compacta e guarda recuo e trechos', () => {
    const resultado = linhaCompacta(2, literal('“Java”'), comum(','));

    expect(resultado).toEqual({
      tipo: 'codigo',
      recuo: 2,
      densidade: 'compacta',
      trechos: [
        { texto: '“Java”', papel: 'literal' },
        { texto: ',', papel: 'comum' },
      ],
    });
  });

  it('linha comum não é compacta', () => {
    expect(linha(1).densidade).toBeUndefined();
  });

  it('vaziaCompacta cria uma linha em branco compacta', () => {
    expect(vaziaCompacta()).toEqual({ tipo: 'vazia', densidade: 'compacta' });
  });

  it('vazia não é compacta', () => {
    expect(vazia()).not.toHaveProperty('densidade');
  });

  it('linhaApertada marca a densidade apertada e guarda recuo e trechos', () => {
    expect(linhaApertada(2, literal('“Java”'), comum(','))).toEqual({
      tipo: 'codigo',
      recuo: 2,
      densidade: 'apertada',
      trechos: [
        { texto: '“Java”', papel: 'literal' },
        { texto: ',', papel: 'comum' },
      ],
    });
  });

  it('vaziaApertada cria uma linha em branco de densidade apertada', () => {
    expect(vaziaApertada()).toEqual({ tipo: 'vazia', densidade: 'apertada' });
  });

  it('as densidades compacta e apertada são distintas', () => {
    expect(linhaApertada(0).densidade).not.toBe(linhaCompacta(0).densidade);
    expect(vaziaApertada().densidade).not.toBe(vaziaCompacta().densidade);
  });
});
