import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Title } from '@angular/platform-browser';
import { TitleStrategy, provideRouter } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';

import { EstrategiaDeTitulo } from './estrategia-de-titulo';
import { TITULO_INICIO } from './titulos';

@Component({ template: '' })
class Vazia {}

describe('EstrategiaDeTitulo', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideRouter([
          { path: '', title: TITULO_INICIO, component: Vazia },
          { path: 'contato', title: 'Contato', component: Vazia },
        ]),
        { provide: TitleStrategy, useExisting: EstrategiaDeTitulo },
      ],
    });
  });

  it('mantém o título do site no Início', async () => {
    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl('/');

    expect(TestBed.inject(Title).getTitle()).toBe('Vinicius Machado | Desenvolvedor Full Stack');
    expect(TestBed.inject(EstrategiaDeTitulo).titulo()).toBe('Portfolio_Vinicius');
  });

  it('usa "<seção> | Vinicius Machado" nas demais rotas', async () => {
    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl('/contato');

    expect(TestBed.inject(Title).getTitle()).toBe('Contato | Vinicius Machado');
    expect(TestBed.inject(EstrategiaDeTitulo).titulo()).toBe('Contato');
  });

  it('volta ao título do Início ao navegar de uma seção para a raiz', async () => {
    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl('/contato');
    await harness.navigateByUrl('/');

    expect(TestBed.inject(Title).getTitle()).toBe('Vinicius Machado | Desenvolvedor Full Stack');
    expect(TestBed.inject(EstrategiaDeTitulo).titulo()).toBe('Portfolio_Vinicius');
  });

  it('começa com o título do Início antes de qualquer navegação', () => {
    expect(TestBed.inject(EstrategiaDeTitulo).titulo()).toBe('Portfolio_Vinicius');
  });

  it('usa o título do Início quando a rota não define título', async () => {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [
        provideRouter([{ path: 'sem-titulo', component: Vazia }]),
        { provide: TitleStrategy, useExisting: EstrategiaDeTitulo },
      ],
    });
    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl('/sem-titulo');

    expect(TestBed.inject(EstrategiaDeTitulo).titulo()).toBe('Portfolio_Vinicius');
  });

  describe('seção com várias páginas', () => {
    beforeEach(() => {
      TestBed.resetTestingModule();
      TestBed.configureTestingModule({
        providers: [
          provideRouter([
            { path: '', title: TITULO_INICIO, component: Vazia },
            {
              path: 'skills',
              title: 'Skills / STACK',
              data: { pagina: 1, totalDePaginas: 2 },
              component: Vazia,
            },
            {
              path: 'skills/2',
              title: 'Skills / STACK',
              data: { pagina: 2, totalDePaginas: 2 },
              component: Vazia,
            },
            { path: 'sem-pagina', title: 'Solta', data: { outro: 1 }, component: Vazia },
          ]),
          { provide: TitleStrategy, useExisting: EstrategiaDeTitulo },
        ],
      });
    });

    it('não acrescenta "(X/N)" na primeira página', async () => {
      const harness = await RouterTestingHarness.create();
      await harness.navigateByUrl('/skills');

      expect(TestBed.inject(EstrategiaDeTitulo).titulo()).toBe('Skills / STACK');
      expect(TestBed.inject(Title).getTitle()).toBe('Skills / STACK | Vinicius Machado');
    });

    it('acrescenta "(2/2)" ao h1 e à janela a partir da segunda página', async () => {
      const harness = await RouterTestingHarness.create();
      await harness.navigateByUrl('/skills/2');

      expect(TestBed.inject(EstrategiaDeTitulo).titulo()).toBe('Skills / STACK (2/2)');
      expect(TestBed.inject(Title).getTitle()).toBe('Skills / STACK (2/2) | Vinicius Machado');
    });

    it('tira o "(2/2)" ao voltar para a primeira página', async () => {
      const harness = await RouterTestingHarness.create();
      await harness.navigateByUrl('/skills/2');
      await harness.navigateByUrl('/skills');

      expect(TestBed.inject(EstrategiaDeTitulo).titulo()).toBe('Skills / STACK');
    });

    it('ignora um data sem página', async () => {
      const harness = await RouterTestingHarness.create();
      await harness.navigateByUrl('/sem-pagina');

      expect(TestBed.inject(EstrategiaDeTitulo).titulo()).toBe('Solta');
    });

    it('não leva "(X/N)" ao título do Início', async () => {
      const harness = await RouterTestingHarness.create();
      await harness.navigateByUrl('/skills/2');
      await harness.navigateByUrl('/');

      expect(TestBed.inject(EstrategiaDeTitulo).titulo()).toBe('Portfolio_Vinicius');
    });
  });
});
