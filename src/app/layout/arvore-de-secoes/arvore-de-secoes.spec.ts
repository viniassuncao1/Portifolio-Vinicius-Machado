import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';

import { SECOES } from '../../core/secoes';
import { ArvoreDeSecoes } from './arvore-de-secoes';

@Component({ template: '' })
class Vazia {}

describe('ArvoreDeSecoes', () => {
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

  const abrir = async (url: string) => {
    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl(url);
    const fixture = TestBed.createComponent(ArvoreDeSecoes);
    await fixture.whenStable();
    return fixture;
  };

  it('lista as 15 seções como links', async () => {
    const fixture = await abrir('/');
    const links = (fixture.nativeElement as HTMLElement).querySelectorAll('a');

    expect(links).toHaveLength(15);
    expect(links[4].getAttribute('href')).toBe('/experiencias');
  });

  it('não marca nenhum item como página atual no Início', async () => {
    const fixture = await abrir('/');

    expect((fixture.nativeElement as HTMLElement).querySelector('[aria-current]')).toBeNull();
  });

  it('destaca a seção aberta e a anuncia como página atual', async () => {
    const fixture = await abrir('/experiencias');
    const atual = (fixture.nativeElement as HTMLElement).querySelectorAll('[aria-current="page"]');

    expect(atual).toHaveLength(1);
    expect(atual[0].textContent).toContain('Experiências');
    expect(atual[0].classList).toContain('atual');
  });

  it('foca o primeiro item e avisa quando uma seção é escolhida', async () => {
    const fixture = await abrir('/');
    const escolhidas: unknown[] = [];
    fixture.componentInstance.secaoEscolhida.subscribe(() => escolhidas.push(true));
    const elemento = fixture.nativeElement as HTMLElement;
    document.body.append(elemento);

    fixture.componentInstance.focarPrimeiroItem();
    elemento.querySelectorAll('a')[2].click();

    expect(document.activeElement).toBe(elemento.querySelector('a'));
    expect(escolhidas).toHaveLength(1);
    elemento.remove();
  });
});
