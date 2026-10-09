import { TestBed } from '@angular/core/testing';
import { Title } from '@angular/platform-browser';
import { TitleStrategy, provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';

import { routes } from '../app.routes';
import { EstrategiaDeTitulo } from './estrategia-de-titulo';
import { SECOES, totalDePaginas } from './secoes';

describe('rotas com várias páginas', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideRouter(routes, withComponentInputBinding()),
        { provide: TitleStrategy, useExisting: EstrategiaDeTitulo },
      ],
    });
  });

  const filhas = routes[0].children ?? [];

  it('geram <slug>/2 até <slug>/N só para as seções com mais de uma página', () => {
    const caminhos = filhas.map((rota) => rota.path);
    const esperados = SECOES.flatMap((s) =>
      Array.from({ length: totalDePaginas(s) }, (_, i) =>
        i === 0 ? s.slug : `${s.slug}/${i + 1}`,
      ),
    );

    expect(caminhos).toEqual(['', ...esperados]);
    expect(caminhos).toContain('skills/2');
    expect(caminhos).not.toContain('skills/3');
  });

  it('guardam a página e o total no data da rota', () => {
    const pagina2 = filhas.find((rota) => rota.path === 'skills/2');

    expect(pagina2?.data).toEqual({ pagina: 2, totalDePaginas: 2 });
  });

  it('acrescenta "(X/N)" ao título a partir da página 2', async () => {
    const harness = await RouterTestingHarness.create();

    await harness.navigateByUrl('/skills');
    expect(TestBed.inject(Title).getTitle()).toBe('Skills / STACK | Vinicius Machado');

    await harness.navigateByUrl('/skills/2');
    expect(TestBed.inject(Title).getTitle()).toBe('Skills / STACK (2/2) | Vinicius Machado');
  });

  it('leva /skills/9 ao Início', async () => {
    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl('/skills/9');

    expect(TestBed.inject(Title).getTitle()).toBe('Vinicius Machado | Desenvolvedor Full Stack');
  });
});
