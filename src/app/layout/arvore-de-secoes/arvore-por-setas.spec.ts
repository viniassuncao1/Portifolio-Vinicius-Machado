import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';

import { SECOES } from '../../core/secoes';
import { ArvoreDeSecoes } from './arvore-de-secoes';

@Component({ template: '' })
class Vazia {}

describe('ArvoreDeSecoes por teclado', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideRouter([
          { path: '', component: Vazia },
          ...SECOES.map((secao) => ({ path: secao.slug, component: Vazia })),
        ]),
      ],
    });
  });

  async function abrir(url: string) {
    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl(url);
    const fixture = TestBed.createComponent(ArvoreDeSecoes);
    await fixture.whenStable();
    const raiz = fixture.nativeElement as HTMLElement;
    document.body.append(raiz);
    return { fixture, raiz, links: Array.from(raiz.querySelectorAll('a')) };
  }

  const tecla = (alvo: HTMLElement, key: string) =>
    alvo.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true }));

  const tabindexes = (links: HTMLAnchorElement[]) => links.map((l) => l.getAttribute('tabindex'));

  it('a seção aberta é o único item na ordem de Tab', async () => {
    const { raiz, links } = await abrir('/diferenciais');

    expect(tabindexes(links).filter((t) => t === '0')).toHaveLength(1);
    expect(links[1].getAttribute('tabindex')).toBe('0');
    raiz.remove();
  });

  it('seta para baixo vai de "Diferenciais" a "Como uso a IA" e passa o tabindex', async () => {
    const { fixture, raiz, links } = await abrir('/diferenciais');
    links[1].focus();

    tecla(links[1], 'ArrowDown');
    fixture.detectChanges();

    expect(document.activeElement).toBe(links[2]);
    expect(links[2].getAttribute('tabindex')).toBe('0');
    expect(links[1].getAttribute('tabindex')).toBe('-1');
    raiz.remove();
  });

  it('seta para cima sobe um item e não passa dos extremos', async () => {
    const { raiz, links } = await abrir('/diferenciais');
    links[1].focus();

    tecla(links[1], 'ArrowUp');
    expect(document.activeElement).toBe(links[0]);
    tecla(links[0], 'ArrowUp');
    expect(document.activeElement).toBe(links[0]);
    raiz.remove();
  });

  it('Home e End vão ao primeiro e ao último item', async () => {
    const { raiz, links } = await abrir('/skills');
    links[3].focus();

    tecla(links[3], 'End');
    expect(document.activeElement).toBe(links[links.length - 1]);
    tecla(links[links.length - 1], 'Home');
    expect(document.activeElement).toBe(links[0]);
    raiz.remove();
  });

  it('outras teclas seguem o comportamento normal do link', async () => {
    const { raiz, links } = await abrir('/');
    const evento = new KeyboardEvent('keydown', { key: 'Enter', bubbles: true, cancelable: true });

    links[0].dispatchEvent(evento);

    expect(evento.defaultPrevented).toBe(false);
    raiz.remove();
  });
});
