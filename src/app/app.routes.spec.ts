import type { Route } from '@angular/router';

import { routes } from './app.routes';
import { SECOES } from './core/secoes';
import { TITULO_INICIO } from './core/titulos';
import { Diferenciais } from './features/diferenciais/diferenciais';
import { Inicio } from './features/inicio/inicio';
import { SobreMim } from './features/sobre-mim/sobre-mim';
import { SecaoEmConstrucao } from './shared/secao-em-construcao/secao-em-construcao';

const filhas = (routes[0].children ?? []) as readonly Route[];
const rotaDe = (caminho: string) => filhas.find((rota) => rota.path === caminho);
const carregar = async (caminho: string) => {
  const carregador = rotaDe(caminho)?.loadComponent as (() => Promise<unknown>) | undefined;
  return carregador?.();
};

describe('rotas', () => {
  it('têm o Início e uma rota por seção, na ordem de SECOES', () => {
    expect(filhas.map((rota) => rota.path)).toEqual(['', ...SECOES.map((secao) => secao.slug)]);
  });

  it('dão a cada seção o título da árvore e ao Início o título Portfolio_Vinicius', () => {
    expect(rotaDe('')?.title).toBe(TITULO_INICIO);
    SECOES.forEach((secao) => expect(rotaDe(secao.slug)?.title).toBe(secao.titulo));
  });

  it('carregam o Início, Sobre Mim e Diferenciais nas suas features', async () => {
    expect(await carregar('')).toBe(Inicio);
    expect(await carregar('sobre-mim')).toBe(SobreMim);
    expect(await carregar('diferenciais')).toBe(Diferenciais);
  });

  it('carregam o aviso de em construção nas seções sem feature', async () => {
    const semFeature = SECOES.filter(
      (secao) => !['sobre-mim', 'diferenciais'].includes(secao.slug),
    );

    for (const secao of semFeature) {
      expect(await carregar(secao.slug)).toBe(SecaoEmConstrucao);
    }
  });

  it('redirecionam rotas inexistentes para o Início', () => {
    expect(routes[1]).toMatchObject({ path: '**', redirectTo: '' });
  });
});
