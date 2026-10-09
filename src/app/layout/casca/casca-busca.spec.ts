import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';

import { Casca } from './casca';

@Component({ template: '' })
class Pagina {}

describe('Casca: busca de seções', () => {
  beforeEach(() => {
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

  async function abrir() {
    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl('/contato');
    return harness.routeNativeElement as HTMLElement;
  }

  const aberta = (raiz: HTMLElement) => raiz.querySelector('dialog')?.hasAttribute('open');

  it('tem um botão identificado que abre a busca', async () => {
    const raiz = await abrir();
    const botao = raiz.querySelector('.botao-busca') as HTMLButtonElement;

    expect(botao.getAttribute('aria-label')).toBe('Buscar seção (Ctrl+P)');
    botao.click();

    expect(aberta(raiz)).toBe(true);
  });

  it.each([
    ['ctrlKey', { ctrlKey: true }],
    ['metaKey', { metaKey: true }],
  ])('abre com o atalho (%s + P) e impede a impressão do navegador', async (_nome, modificador) => {
    const raiz = await abrir();
    const evento = new KeyboardEvent('keydown', {
      key: 'p',
      bubbles: true,
      cancelable: true,
      ...modificador,
    });

    raiz.dispatchEvent(evento);

    expect(evento.defaultPrevented).toBe(true);
    expect(aberta(raiz)).toBe(true);
  });

  it('a tecla P sozinha não abre a busca', async () => {
    const raiz = await abrir();

    raiz.dispatchEvent(new KeyboardEvent('keydown', { key: 'p', bubbles: true }));

    expect(aberta(raiz)).toBeFalsy();
  });
});
