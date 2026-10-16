import { TestBed } from '@angular/core/testing';
import { Title } from '@angular/platform-browser';
import { Router, TitleStrategy, provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';

import { routes } from '../app.routes';
import { EstrategiaDeTitulo } from './estrategia-de-titulo';

describe('endereços antigos de página', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideRouter(routes, withComponentInputBinding()),
        { provide: TitleStrategy, useExisting: EstrategiaDeTitulo },
      ],
    });
  });

  it.each([
    ['/skills/2', '/skills'],
    ['/skills/3', '/skills'],
    ['/experiencias/3', '/experiencias'],
    ['/projeto-4/2', '/projeto-4'],
    ['/projeto-5/4', '/projeto-5'],
    ['/certificacoes/3', '/certificacoes'],
  ])('%s leva a %s, sem o "(n/N)" no título', async (antigo, novo) => {
    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl(antigo);

    expect(TestBed.inject(Router).url).toBe(novo);
    expect(TestBed.inject(Title).getTitle()).not.toMatch(/\(\d+\/\d+\)/);
  });

  it('um endereço de página de seção que não existe também leva à seção', async () => {
    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl('/skills/9');

    expect(TestBed.inject(Router).url).toBe('/skills');
  });
});
