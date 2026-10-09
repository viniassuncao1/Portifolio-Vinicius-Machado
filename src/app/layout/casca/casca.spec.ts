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
            children: [{ path: 'contato', title: 'Contato', component: Pagina }],
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
});
