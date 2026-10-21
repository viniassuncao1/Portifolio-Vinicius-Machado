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

  it('aparece em toda seção que tem outra depois, inclusive nas que eram paginadas', () => {
    expect(proximaSecao('/skills')?.arquivo).toBe('Experiencias.java');
    expect(proximaSecao('/experiencias')?.slug).toBe('projetos');
  });

  it('um endereço antigo de página leva à mesma seguinte da seção', () => {
    expect(proximaSecao('/skills/2')?.arquivo).toBe('Experiencias.java');
  });

  it('ignora a query e o fragmento', () => {
    expect(proximaSecao('/sobre-mim?x=1#topo')?.arquivo).toBe('Diferenciais.java');
  });

  it('segue a ordem da árvore para todas as seções', () => {
    SECOES.slice(0, -1).forEach((secao, i) => {
      expect(proximaSecao(`/${secao.slug}`)?.slug).toBe(SECOES[i + 1].slug);
    });
  });
});
