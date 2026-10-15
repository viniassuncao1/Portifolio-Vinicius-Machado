import type { Route } from '@angular/router';

import { SECOES_COM_ENDERECO_ANTIGO, routes } from './app.routes';
import { SECOES } from './core/secoes';
import { TITULO_INICIO, TITULO_REPOSITORIO } from './core/titulos';
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
  it('têm o Início, uma rota por seção, o redirecionamento dos endereços antigos e o repositório', () => {
    expect(filhas.map((rota) => rota.path)).toEqual([
      '',
      ...SECOES.map((secao) => secao.slug),
      ...SECOES_COM_ENDERECO_ANTIGO.map((slug) => `${slug}/:pagina`),
      'repositorio',
    ]);
  });

  it('dão a cada seção o título da árvore e ao Início o título do Início', () => {
    expect(rotaDe('')?.title).toBe(TITULO_INICIO);
    SECOES.forEach((secao) => expect(rotaDe(secao.slug)?.title).toBe(secao.titulo));
  });

  it('não guardam número de página no data das rotas', () => {
    SECOES.forEach((secao) => expect(rotaDe(secao.slug)?.data).toBeUndefined());
  });

  it('redirecionam /<seção>/<n> para /<seção>, que mantém os links antigos funcionando', () => {
    SECOES_COM_ENDERECO_ANTIGO.forEach((slug) =>
      expect(rotaDe(`${slug}/:pagina`)).toMatchObject({ redirectTo: `/${slug}` }),
    );
  });

  it('carregam a página do repositório, com o título que dá nome à aba', async () => {
    expect(rotaDe('repositorio')?.title).toBe(TITULO_REPOSITORIO);
    expect(typeof (await carregar('repositorio'))).toBe('function');
  });

  it('carregam o Início na rota raiz', async () => {
    expect(await carregar('')).toBe(Inicio);
  });

  it('carregam a feature de cada seção que a tem', async () => {
    for (const secao of SECOES.filter((s) => s.slug in FEATURES)) {
      expect(await carregar(secao.slug)).toBe(FEATURES[secao.slug]);
    }
  });

  it('carregam um componente em toda rota de seção', async () => {
    for (const secao of SECOES) {
      expect(typeof (await carregar(secao.slug))).toBe('function');
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
