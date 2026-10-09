import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';

import { EstadoDoEditor } from '../../core/estado-do-editor';
import { BarraDeStatus } from './barra-de-status';

@Component({ template: '' })
class Vazia {}

describe('BarraDeStatus', () => {
  beforeEach(() => {
    sessionStorage.clear();
    TestBed.configureTestingModule({
      providers: [
        provideRouter([
          { path: '', component: Vazia },
          { path: 'skills', component: Vazia },
          { path: 'contato', component: Vazia },
        ]),
      ],
    });
  });

  async function abrir(...urls: string[]) {
    const harness = await RouterTestingHarness.create();
    const fixture = TestBed.createComponent(BarraDeStatus);
    for (const url of urls) await harness.navigateByUrl(url);
    fixture.detectChanges();
    await fixture.whenStable();
    return { harness, fixture, raiz: fixture.nativeElement as HTMLElement };
  }

  it('mostra o arquivo da aba ativa, UTF-8, Java 21 e main', async () => {
    const { raiz } = await abrir('/skills');
    const texto = raiz.textContent ?? '';

    ['Skills.java', 'UTF-8', 'Java 21', 'main', '1:1'].forEach((t) => expect(texto).toContain(t));
  });

  it('mostra ViniciusMachado.java no Início', async () => {
    const { raiz } = await abrir('/');

    expect(raiz.querySelector('.arquivo')?.textContent).toBe('ViniciusMachado.java');
  });

  it('troca o arquivo quando a seção muda', async () => {
    const { harness, fixture, raiz } = await abrir('/skills');

    await harness.navigateByUrl('/contato');
    fixture.detectChanges();

    expect(raiz.querySelector('.arquivo')?.textContent).toBe('Contato.java');
  });

  it('acompanha linha e coluna do EstadoDoEditor', async () => {
    const { fixture, raiz } = await abrir('/skills');

    TestBed.inject(EstadoDoEditor).posicionar(7, 1);
    fixture.detectChanges();

    expect(raiz.querySelector('.posicao')?.textContent).toBe('7:1');
  });

  it('é uma região status e só o arquivo fica na leitura, sem a posição do cursor', async () => {
    const { raiz } = await abrir('/skills');

    expect(raiz.querySelector('[role="status"]')).not.toBeNull();
    expect(raiz.querySelector('.posicao')?.getAttribute('aria-hidden')).toBe('true');
    expect(raiz.querySelector('.arquivo')?.hasAttribute('aria-hidden')).toBe(false);
  });
});
