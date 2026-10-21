import { contadorDoProjeto, PROJETOS, projetoDoSlug } from './projetos';
import { SECOES } from './secoes';

describe('PROJETOS', () => {
  it('tem os seis projetos, numerados de 1 a 6, na ordem da árvore', () => {
    expect(PROJETOS.map((p) => p.numero)).toEqual([1, 2, 3, 4, 5, 6]);
    expect(PROJETOS.map((p) => p.secao)).toEqual([
      'projeto-1',
      'projeto-2',
      'projeto-3',
      'projeto-4',
      'projeto-5',
      'projeto-6',
    ]);
  });

  it('cada projeto aponta para uma seção que existe', () => {
    for (const projeto of PROJETOS) {
      expect(SECOES.some((secao) => secao.slug === projeto.secao)).toBe(true);
    }
  });

  it('os slugs são únicos', () => {
    expect(new Set(PROJETOS.map((p) => p.slug)).size).toBe(PROJETOS.length);
  });

  it('cada projeto diz o papel do Vinicius', () => {
    for (const projeto of PROJETOS) expect(projeto.papel.length).toBeGreaterThan(10);
  });

  it('cada projeto tem até três destaques e uma capa em código', () => {
    for (const projeto of PROJETOS) {
      expect(projeto.destaques.length).toBeGreaterThan(0);
      expect(projeto.destaques.length).toBeLessThanOrEqual(3);
      expect(projeto.capa.linhas.length).toBeGreaterThan(0);
    }
  });

  it('o rótulo do link diz se o destino é um site ou um repositório', () => {
    for (const projeto of PROJETOS) {
      if (!projeto.link) continue;
      const repositorio = projeto.link.url.startsWith('https://github.com/');
      expect(projeto.link.rotulo).toBe(repositorio ? 'Ver repositório' : 'Ver site');
    }
  });

  it('toda imagem tem texto alternativo e dimensões', () => {
    for (const imagem of PROJETOS.flatMap((p) => p.imagens)) {
      expect(imagem.alt.length).toBeGreaterThan(20);
      expect(imagem.largura).toBeGreaterThan(0);
      expect(imagem.altura).toBeGreaterThan(0);
    }
  });
});

describe('projetoDoSlug e contadorDoProjeto', () => {
  it('acha o projeto pelo slug e devolve undefined para um slug desconhecido', () => {
    expect(projetoDoSlug('ana')?.numero).toBe(4);
    expect(projetoDoSlug('nao-existe')).toBeUndefined();
    expect(projetoDoSlug(null)).toBeUndefined();
  });

  it('formata o contador com dois dígitos', () => {
    expect(contadorDoProjeto(PROJETOS[0])).toBe('01 / 06');
    expect(contadorDoProjeto(PROJETOS[5])).toBe('06 / 06');
  });
});
