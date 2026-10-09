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
});
