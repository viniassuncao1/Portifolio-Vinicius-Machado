import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { TitleStrategy, provideRouter } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';

import { EstrategiaDeTitulo } from '../../core/estrategia-de-titulo';
import { Casca } from './casca';

@Component({ template: '<p class="pagina">Conteúdo</p>' })
class Pagina {}

describe('Casca', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideRouter([
          {
            path: '',
            component: Casca,
            children: [
              { path: 'contato', title: 'Contato', component: Pagina },
              { path: 'ajuda', title: 'Ajuda', component: Pagina },
            ],
          },
        ]),
        { provide: TitleStrategy, useExisting: EstrategiaDeTitulo },
      ],
    });
  });

  it('monta a barra, o painel e a aba e exibe a rota filha no editor', async () => {
    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl('/contato');
    const elemento = harness.routeNativeElement as HTMLElement;

    expect(elemento.querySelector('app-barra-de-ferramentas')).not.toBeNull();
    expect(elemento.querySelector('app-painel-lateral')).not.toBeNull();
    expect(elemento.querySelector('app-aba-do-editor')).not.toBeNull();
    expect(elemento.querySelector('main .pagina')?.textContent).toBe('Conteúdo');
  });

  it('tem um único h1 com o título da rota', async () => {
    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl('/contato');
    const titulos = (harness.routeNativeElement as HTMLElement).querySelectorAll('h1');

    expect(titulos).toHaveLength(1);
    expect(titulos[0].textContent).toBe('Contato');
  });

  it('põe a barra antes do painel e o painel antes do editor', async () => {
    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl('/contato');
    const elemento = harness.routeNativeElement as HTMLElement;
    const ordem = Array.from(
      elemento.querySelectorAll(
        'app-barra-de-ferramentas, app-painel-lateral, app-aba-do-editor, main',
      ),
    ).map((e) => e.tagName.toLowerCase());

    expect(ordem).toEqual([
      'app-barra-de-ferramentas',
      'app-painel-lateral',
      'app-aba-do-editor',
      'main',
    ]);
  });

  it('põe a aba antes da área do editor', async () => {
    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl('/contato');
    const aba = (harness.routeNativeElement as HTMLElement).querySelector('app-aba-do-editor');

    expect(aba?.nextElementSibling?.tagName).toBe('MAIN');
  });

  it('põe o h1 como primeiro item do main, antes do conteúdo da rota', async () => {
    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl('/contato');
    const main = (harness.routeNativeElement as HTMLElement).querySelector('main');

    expect(main?.firstElementChild?.tagName).toBe('H1');
  });

  it('esconde a scrollbar decorativa da leitura', async () => {
    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl('/contato');
    const scrollbar = (harness.routeNativeElement as HTMLElement).querySelector('.scrollbar');

    expect(scrollbar?.getAttribute('aria-hidden')).toBe('true');
  });

  it('atualiza o h1 quando a rota muda', async () => {
    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl('/contato');
    await harness.navigateByUrl('/ajuda');
    harness.detectChanges();

    expect((harness.routeNativeElement as HTMLElement).querySelector('h1')?.textContent).toBe(
      'Ajuda',
    );
  });
});
