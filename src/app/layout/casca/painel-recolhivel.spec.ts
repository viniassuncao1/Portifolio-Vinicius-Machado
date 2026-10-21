import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { Component } from '@angular/core';

import { Casca } from './casca';

@Component({ template: '' })
class Pagina {}

describe('Casca: painel do projeto recolhível', () => {
  beforeEach(() => {
    sessionStorage.removeItem('painel-do-projeto');
    HTMLDialogElement.prototype.showModal ??= function (this: HTMLDialogElement) {
      this.setAttribute('open', '');
    };
    TestBed.configureTestingModule({
      providers: [
        provideRouter([
          { path: '', component: Casca, children: [{ path: 'contato', component: Pagina }] },
        ]),
      ],
    });
  });

  afterEach(() => sessionStorage.removeItem('painel-do-projeto'));

  async function abrir() {
    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl('/contato');
    await harness.fixture.whenStable();
    return harness.routeNativeElement as HTMLElement;
  }

  const area = (raiz: HTMLElement) => raiz.querySelector<HTMLElement>('.area')!;
  const atalho = (raiz: HTMLElement, tecla: string, modificador: object) =>
    raiz.dispatchEvent(
      new KeyboardEvent('keydown', { key: tecla, bubbles: true, cancelable: true, ...modificador }),
    );

  it('começa aberto', async () => {
    const raiz = await abrir();

    expect(area(raiz).getAttribute('data-painel')).toBe('true');
  });

  it('o botão Projeto da faixa recolhe e mostra o painel, e a escolha fica na sessão', async () => {
    const raiz = await abrir();
    const botao = raiz.querySelector<HTMLButtonElement>('app-faixa-de-ferramentas button')!;

    botao.click();
    TestBed.tick();
    expect(area(raiz).getAttribute('data-painel')).toBe('false');
    expect(sessionStorage.getItem('painel-do-projeto')).toBe('recolhido');

    botao.click();
    TestBed.tick();
    expect(area(raiz).getAttribute('data-painel')).toBe('true');
    expect(sessionStorage.getItem('painel-do-projeto')).toBeNull();
  });

  it('Ctrl/Cmd+B alterna o painel e impede o atalho do navegador', async () => {
    const raiz = await abrir();

    const evento = new KeyboardEvent('keydown', {
      key: 'b',
      ctrlKey: true,
      bubbles: true,
      cancelable: true,
    });
    raiz.dispatchEvent(evento);
    TestBed.tick();

    expect(evento.defaultPrevented).toBe(true);
    expect(area(raiz).getAttribute('data-painel')).toBe('false');

    atalho(raiz, 'b', { metaKey: true });
    TestBed.tick();
    expect(area(raiz).getAttribute('data-painel')).toBe('true');
  });

  it('volta recolhido quando a sessão guardou o painel recolhido', async () => {
    sessionStorage.setItem('painel-do-projeto', 'recolhido');
    const raiz = await abrir();
    TestBed.tick();

    expect(area(raiz).getAttribute('data-painel')).toBe('false');
  });
});
