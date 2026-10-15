import { proximaSecao } from './proxima-secao';
import { SECOES } from './secoes';

describe('proximaSecao', () => {
  it('devolve a seção seguinte da árvore', () => {
    expect(proximaSecao('/sobre-mim')?.arquivo).toBe('Diferenciais.java');
    expect(proximaSecao('/diferenciais')?.arquivo).toBe('ComoUsoIA.java');
  });

  it('não devolve nada no Início nem em rotas desconhecidas', () => {
    expect(proximaSecao('/')).toBeNull();
    expect(proximaSecao('/repositorio')).toBeNull();
  });

  it('não devolve nada na última seção', () => {
    expect(proximaSecao(`/${SECOES.at(-1)?.slug}`)).toBeNull();
  });

  it('numa seção paginada, só aparece na última página', () => {
    expect(proximaSecao('/skills')).toBeNull();
    expect(proximaSecao('/skills/2')).toBeNull();
    expect(proximaSecao('/skills/3')?.arquivo).toBe('Experiencias.java');
  });

  it('ignora a query e o fragmento', () => {
    expect(proximaSecao('/sobre-mim?x=1#topo')?.arquivo).toBe('Diferenciais.java');
  });

  it('segue a ordem da árvore para todas as seções', () => {
    SECOES.slice(0, -1).forEach((secao, i) => {
      const ultima =
        secao.paginas && secao.paginas > 1 ? `/${secao.slug}/${secao.paginas}` : `/${secao.slug}`;
      expect(proximaSecao(ultima)?.slug).toBe(SECOES[i + 1].slug);
    });
  });
});
