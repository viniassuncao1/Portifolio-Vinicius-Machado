import { ARQUIVO_INICIO, SECOES } from './secoes';

describe('arquivo das seções', () => {
  it('toda seção tem um arquivo .java em PascalCase, único', () => {
    const arquivos = SECOES.map((secao) => secao.arquivo);

    arquivos.forEach((arquivo) => expect(arquivo).toMatch(/^[A-Z][A-Za-z0-9]*\.java$/));
    expect(new Set(arquivos).size).toBe(SECOES.length);
  });

  it('usa os nomes combinados e o arquivo do Início', () => {
    const porSlug = Object.fromEntries(SECOES.map((s) => [s.slug, s.arquivo]));

    expect(porSlug).toMatchObject({
      'sobre-mim': 'SobreMim.java',
      'como-uso-ia': 'ComoUsoIA.java',
      'projeto-1': 'Projeto1.java',
      contato: 'Contato.java',
    });
    expect(ARQUIVO_INICIO).toBe('ViniciusMachado.java');
  });
});
