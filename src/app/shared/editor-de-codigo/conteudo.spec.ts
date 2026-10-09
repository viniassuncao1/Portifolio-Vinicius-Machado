import {
  anotacao,
  comum,
  declaracao,
  linha,
  literal,
  palavraChave,
  paragrafo,
  vazia,
  type Papel,
} from './conteudo';

describe('construtoras de conteúdo do editor', () => {
  it.each<[string, (texto: string) => { texto: string; papel: Papel }, Papel]>([
    ['palavraChave', palavraChave, 'palavra-chave'],
    ['declaracao', declaracao, 'declaracao'],
    ['literal', literal, 'literal'],
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
});
