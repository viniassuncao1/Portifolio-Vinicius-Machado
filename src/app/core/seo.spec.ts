import { Component, DOCUMENT } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { TitleStrategy, provideRouter } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';

import { EstrategiaDeTitulo } from './estrategia-de-titulo';
import {
  DESCRICAO_DO_INICIO,
  IMAGEM_DE_COMPARTILHAMENTO,
  Seo,
  URL_DO_SITE,
  descricaoDaRota,
} from './seo';

@Component({ template: '' })
class Vazia {}

describe('Seo', () => {
  let documento: Document;
  const meta = (seletor: string) => documento.head.querySelector(seletor)?.getAttribute('content');

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideRouter([
          { path: '', component: Vazia },
          { path: 'skills', title: 'Skills / STACK', component: Vazia },
          { path: 'skills/2', title: 'Skills / STACK', component: Vazia },
        ]),
        { provide: TitleStrategy, useExisting: EstrategiaDeTitulo },
      ],
    });
    documento = TestBed.inject(DOCUMENT);
    TestBed.inject(Seo);
  });

  afterEach(() => {
    documento.head
      .querySelectorAll('meta[property^="og:"], meta[name^="twitter:"], link[rel="canonical"]')
      .forEach((no) => no.remove());
    documento.getElementById('dados-estruturados-pessoa')?.remove();
  });

  it('escreve canônico, Open Graph e Twitter com o endereço absoluto da rota', async () => {
    await RouterTestingHarness.create('/skills/2');

    expect(documento.head.querySelector('link[rel="canonical"]')?.getAttribute('href')).toBe(
      `${URL_DO_SITE}/skills/2`,
    );
    expect(meta('meta[property="og:url"]')).toBe(`${URL_DO_SITE}/skills/2`);
    expect(meta('meta[property="og:title"]')).toBe('Skills / STACK | Vinicius Machado');
    expect(meta('meta[property="og:image"]')).toBe(IMAGEM_DE_COMPARTILHAMENTO);
    expect(meta('meta[property="og:image:width"]')).toBe('1200');
    expect(meta('meta[property="og:image:height"]')).toBe('630');
    expect(meta('meta[property="og:locale"]')).toBe('pt_BR');
    expect(meta('meta[name="twitter:card"]')).toBe('summary_large_image');
    expect(meta('meta[name="twitter:image"]')).toBe(IMAGEM_DE_COMPARTILHAMENTO);
  });

  it('mantém uma só descrição de até 160 caracteres', async () => {
    const harness = await RouterTestingHarness.create('/');
    await harness.navigateByUrl('/skills');

    const descricao = meta('meta[name="description"]') ?? '';
    expect(descricao.length).toBeGreaterThan(0);
    expect(descricao.length).toBeLessThanOrEqual(160);
    expect(documento.head.querySelectorAll('meta[name="description"]').length).toBe(1);
  });

  it('põe o JSON-LD Person no Início e o tira nas outras rotas', async () => {
    const harness = await RouterTestingHarness.create('/');
    const script = documento.getElementById('dados-estruturados-pessoa');
    const dados = JSON.parse(script?.textContent ?? '{}');

    expect(dados['@type']).toBe('Person');
    expect(dados.name).toBe('Vinicius Machado');

    await harness.navigateByUrl('/skills');
    expect(documento.getElementById('dados-estruturados-pessoa')).toBeNull();
  });

  it('usa a descrição do Início quando a rota não é uma seção', () => {
    expect(descricaoDaRota('/')).toBe(DESCRICAO_DO_INICIO);
    expect(descricaoDaRota('/skills/2').length).toBeLessThanOrEqual(160);
    expect(DESCRICAO_DO_INICIO.length).toBeLessThanOrEqual(160);
  });
});
