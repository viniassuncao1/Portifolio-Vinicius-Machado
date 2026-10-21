import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { EXPERIENCIAS } from '../../core/perfil';
import { ExperienciaEmGrafo } from './experiencia-em-grafo';
import { SobreEmCartoes } from './sobre-em-cartoes';

describe('cartões das seções', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideRouter([{ path: '**', children: [] }])] });
  });

  async function montar<T>(componente: new () => T, entradas: Record<string, unknown> = {}) {
    const fixture = TestBed.createComponent(componente);
    for (const [nome, valor] of Object.entries(entradas)) {
      fixture.componentRef.setInput(nome, valor);
    }
    await fixture.whenStable();
    return fixture.nativeElement as HTMLElement;
  }

  it('a experiência no Início mostra três destaques por cartão e o atalho para a seção', async () => {
    const raiz = await montar(ExperienciaEmGrafo);

    for (const lista of Array.from(raiz.querySelectorAll('.miolo ul'))) {
      expect(lista.querySelectorAll('li')).toHaveLength(3);
    }
    expect(raiz.querySelector('a.mais')?.getAttribute('href')).toBe('/experiencias');
  });

  it('na página da seção mostra todos os destaques e não repete o atalho', async () => {
    const raiz = await montar(ExperienciaEmGrafo, { completo: true });

    const total = Array.from(raiz.querySelectorAll('.miolo ul li')).length;
    expect(total).toBe(EXPERIENCIAS.reduce((soma, e) => soma + e.destaques.length, 0));
    expect(raiz.querySelector('a.mais')).toBeNull();
  });

  it('o Sobre mostra o atalho para a seção só fora dela', async () => {
    expect((await montar(SobreEmCartoes)).querySelector('a.mais')).not.toBeNull();
    expect((await montar(SobreEmCartoes, { completo: true })).querySelector('a.mais')).toBeNull();
  });

  it('a foto do Sobre é decorativa (a do hero já descreve o Vinicius)', async () => {
    const raiz = await montar(SobreEmCartoes);

    expect(raiz.querySelector('img')?.getAttribute('alt')).toBe('');
  });
});
