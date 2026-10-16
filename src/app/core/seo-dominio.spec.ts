/// <reference types="node" />
import { readFileSync } from 'node:fs';

import { URL_DO_SITE } from './seo';

const ler = (caminho: string): string => readFileSync(caminho, 'utf8');

describe('domínio do site', () => {
  it('o sitemap usa o mesmo domínio de core/seo.ts', () => {
    const dominio = /const DOMINIO = '([^']+)'/.exec(ler('scripts/gerar-sitemap.mjs'))?.[1];

    expect(dominio).toBe(URL_DO_SITE);
  });

  it('o robots.txt aponta para o sitemap do mesmo domínio', () => {
    expect(ler('public/robots.txt')).toContain(`Sitemap: ${URL_DO_SITE}/sitemap.xml`);
  });
});
