import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';

import { FaixaDeAbas } from './faixa-de-abas';

@Component({ template: '' })
class Vazia {}

@Component({ template: '<app-faixa-de-abas />', imports: [FaixaDeAbas] })
class Hospedeira {}

describe('FaixaDeAbas', () => {
  beforeEach(() => {
    sessionStorage.clear();
    TestBed.configureTestingModule({
      providers: [
        provideRouter([
          { path: '', component: Vazia },
          { path: 'sobre-mim', component: Vazia },
          { path: 'skills', component: Vazia },
          { path: 'contato', component: Vazia },
        ]),
      ],
    });
  });

  async function abrir(...urls: string[]) {
    const harness = await RouterTestingHarness.create();
    const fixture = TestBed.createComponent(Hospedeira);
    for (const url of urls) await harness.navigateByUrl(url);
    fixture.detectChanges();
    await fixture.whenStable();
    const raiz = fixture.nativeElement as HTMLElement;
    return { harness, fixture, raiz };
  }

  const abas = (raiz: HTMLElement) =>
    Array.from(raiz.querySelectorAll<HTMLElement>('[role="tab"]'));

  it('mostra uma aba por seção aberta, com o arquivo, e marca a ativa', async () => {
    const { raiz } = await abrir('/sobre-mim', '/skills');

    expect(abas(raiz).map((a) => a.textContent?.trim())).toEqual(['SobreMim.java', 'Skills.java']);
    expect(abas(raiz).map((a) => a.getAttribute('aria-selected'))).toEqual(['false', 'true']);
    expect(raiz.querySelector('[role="tablist"]')?.getAttribute('aria-label')).toBe(
      'Arquivos abertos',
    );
  });

  it('usa roving tabindex: só a aba ativa entra na ordem de Tab', async () => {
    const { raiz } = await abrir('/sobre-mim', '/skills');

    expect(abas(raiz).map((a) => a.getAttribute('tabindex'))).toEqual(['-1', '0']);
  });

  it('clicar numa aba abre a seção', async () => {
    const { fixture, raiz } = await abrir('/sobre-mim', '/skills');

    abas(raiz)[0].click();
    await fixture.whenStable();

    expect(TestBed.inject(Router).url).toBe('/sobre-mim');
  });

  it('o × fecha a aba e dá a ela um nome acessível', async () => {
    const { fixture, raiz } = await abrir('/sobre-mim', '/skills');
    const fechar = raiz.querySelectorAll<HTMLButtonElement>('.fechar');

    expect(fechar[1].getAttribute('aria-label')).toBe('Fechar Skills.java');
    fechar[1].click();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(TestBed.inject(Router).url).toBe('/sobre-mim');
    expect(abas(raiz).map((a) => a.textContent?.trim())).toEqual(['SobreMim.java']);
  });

  it('setas movem o foco entre as abas, com volta ao início e Home/End', async () => {
    const { raiz } = await abrir('/sobre-mim', '/skills', '/contato');
    document.body.append(raiz);
    const [primeira, segunda, terceira] = abas(raiz);
    terceira.focus();

    terceira.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
    expect(document.activeElement).toBe(primeira);

    primeira.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
    expect(document.activeElement).toBe(segunda);

    segunda.dispatchEvent(new KeyboardEvent('keydown', { key: 'End', bubbles: true }));
    expect(document.activeElement).toBe(terceira);

    terceira.dispatchEvent(new KeyboardEvent('keydown', { key: 'Home', bubbles: true }));
    expect(document.activeElement).toBe(primeira);
    raiz.remove();
  });

  it('Delete fecha a aba focada', async () => {
    const { fixture, raiz } = await abrir('/sobre-mim', '/skills', '/contato');

    abas(raiz)[1].dispatchEvent(new KeyboardEvent('keydown', { key: 'Delete', bubbles: true }));
    await fixture.whenStable();
    fixture.detectChanges();

    expect(abas(raiz).map((a) => a.textContent?.trim())).toEqual(['SobreMim.java', 'Contato.java']);
  });
});
