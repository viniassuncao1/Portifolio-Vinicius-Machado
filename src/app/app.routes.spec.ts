import type { Route } from '@angular/router';

import { routes } from './app.routes';
import { SECOES, totalDePaginas } from './core/secoes';
import type { Secao } from './core/secoes';
import { TITULO_INICIO } from './core/titulos';
import { ComoUsoIa } from './features/como-uso-ia/como-uso-ia';
import { Diferenciais } from './features/diferenciais/diferenciais';
import { Inicio } from './features/inicio/inicio';
import { Skills } from './features/skills/skills';
import { SobreMim } from './features/sobre-mim/sobre-mim';

const filhas = (routes[0].children ?? []) as readonly Route[];
const rotaDe = (caminho: string) => filhas.find((rota) => rota.path === caminho);
const carregar = async (caminho: string) => {
  const carregador = rotaDe(caminho)?.loadComponent as (() => Promise<unknown>) | undefined;
  return carregador?.();
};

/** Caminhos de uma seção: `<slug>` (página 1) e `<slug>/2` até `<slug>/N`. */
const caminhosDe = (secao: Secao): readonly string[] =>
  Array.from({ length: totalDePaginas(secao) }, (_, i) =>
    i === 0 ? secao.slug : `${secao.slug}/${i + 1}`,
  );

/**
 * Seções que já têm feature. Uma seção nova com feature acrescenta uma entrada aqui; as que não
 * estão no mapa só precisam carregar algum componente (o aviso de em construção ou a feature).
 */
const FEATURES: Readonly<Record<string, unknown>> = {
  'sobre-mim': SobreMim,
  diferenciais: Diferenciais,
  'como-uso-ia': ComoUsoIa,
  skills: Skills,
};

describe('rotas', () => {
  it('têm o Início e as rotas de cada seção (uma por página), na ordem de SECOES', () => {
    expect(filhas.map((rota) => rota.path)).toEqual(['', ...SECOES.flatMap(caminhosDe)]);
  });

  it('dão a cada página de cada seção o título da árvore e ao Início o Portfolio_Vinicius', () => {
    expect(rotaDe('')?.title).toBe(TITULO_INICIO);
    SECOES.flatMap((secao) => caminhosDe(secao).map((caminho) => ({ caminho, secao }))).forEach(
      ({ caminho, secao }) => expect(rotaDe(caminho)?.title).toBe(secao.titulo),
    );
  });

  it('numeram as páginas no data de cada rota', () => {
    for (const secao of SECOES) {
      caminhosDe(secao).forEach((caminho, i) => {
        expect(rotaDe(caminho)?.data).toEqual({
          pagina: i + 1,
          totalDePaginas: totalDePaginas(secao),
        });
      });
    }
  });

  it('carregam o Início na rota raiz', async () => {
    expect(await carregar('')).toBe(Inicio);
  });

  it('carregam a feature de cada seção que a tem, em todas as páginas', async () => {
    for (const secao of SECOES.filter((s) => s.slug in FEATURES)) {
      for (const caminho of caminhosDe(secao)) {
        expect(await carregar(caminho)).toBe(FEATURES[secao.slug]);
      }
    }
  });

  it('carregam um componente em toda rota, o mesmo em todas as páginas da seção', async () => {
    for (const secao of SECOES) {
      const carregados = await Promise.all(caminhosDe(secao).map(carregar));

      expect(carregados.every((componente) => typeof componente === 'function')).toBe(true);
      expect(new Set(carregados).size).toBe(1);
    }
  });

  it('não repetem caminhos', () => {
    const caminhos = filhas.map((rota) => rota.path);

    expect(new Set(caminhos).size).toBe(caminhos.length);
  });

  it('redirecionam rotas inexistentes para o Início', () => {
    expect(routes[1]).toMatchObject({ path: '**', redirectTo: '' });
  });
});
