import { Component, PLATFORM_ID } from '@angular/core';
import { ApplicationRef } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';

import { AbasAbertas } from './abas-abertas';

@Component({ template: '' })
class Vazia {}

const CHAVE = 'abas-abertas';
const slugs = (abas: AbasAbertas) => abas.abas().map((a) => a.slug);

describe('AbasAbertas', () => {
  beforeEach(() => {
    sessionStorage.clear();
    TestBed.configureTestingModule({
      providers: [
        provideRouter([
          { path: '', component: Vazia },
          { path: 'skills', component: Vazia },
          { path: 'skills/2', component: Vazia },
          { path: 'contato', component: Vazia },
          { path: 'eventos', component: Vazia },
        ]),
      ],
    });
  });

  async function iniciar(url: string) {
    const harness = await RouterTestingHarness.create();
    const abas = TestBed.inject(AbasAbertas);
    await harness.navigateByUrl(url);
    return { harness, abas };
  }

  it('abre a aba da rota atual com o nome do arquivo', async () => {
    const { abas } = await iniciar('/contato');

    expect(abas.abas().map((a) => a.arquivo)).toEqual(['Contato.java']);
    expect(abas.ativa()?.slug).toBe('contato');
  });

  it('abre o Início como ViniciusMachado.java', async () => {
    const { abas } = await iniciar('/');

    expect(abas.abas().map((a) => a.arquivo)).toEqual(['ViniciusMachado.java']);
  });

  it('abre uma aba por seção, sem duplicar, e as páginas da seção usam a mesma aba', async () => {
    const { harness, abas } = await iniciar('/skills');
    await harness.navigateByUrl('/skills/2');
    await harness.navigateByUrl('/contato');
    await harness.navigateByUrl('/skills');

    expect(slugs(abas)).toEqual(['skills', 'contato']);
    expect(abas.ativa()?.slug).toBe('skills');
  });

  it('fechar a aba ativa vai para a vizinha da direita, senão da esquerda', async () => {
    const { harness, abas } = await iniciar('/skills');
    await harness.navigateByUrl('/contato');
    await harness.navigateByUrl('/eventos');
    await harness.navigateByUrl('/contato');

    abas.fechar('contato');
    await harness.fixture.whenStable();
    expect(TestBed.inject(Router).url).toBe('/eventos');

    abas.fechar('eventos');
    await harness.fixture.whenStable();
    expect(TestBed.inject(Router).url).toBe('/skills');
    expect(slugs(abas)).toEqual(['skills']);
  });

  it('fechar uma aba inativa não navega', async () => {
    const { harness, abas } = await iniciar('/skills');
    await harness.navigateByUrl('/contato');

    abas.fechar('skills');

    expect(TestBed.inject(Router).url).toBe('/contato');
    expect(slugs(abas)).toEqual(['contato']);
  });

  it('fechar a última aba leva ao Início e reabre a aba dele', async () => {
    const { abas } = await iniciar('/contato');

    abas.fechar('contato');
    await new Promise((resolve) => setTimeout(resolve));

    expect(TestBed.inject(Router).url).toBe('/');
    expect(slugs(abas)).toEqual(['']);
  });

  it('guarda a ordem na sessão e a restaura depois da hidratação', async () => {
    sessionStorage.setItem(CHAVE, JSON.stringify(['eventos', 'skills', 'inexistente']));
    const { abas } = await iniciar('/contato');

    TestBed.inject(ApplicationRef).tick();

    expect(slugs(abas)).toEqual(['eventos', 'skills', 'contato']);
    expect(JSON.parse(sessionStorage.getItem(CHAVE) ?? '[]')).toEqual([
      'eventos',
      'skills',
      'contato',
    ]);
  });

  it('segue funcionando quando o sessionStorage falha', async () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('bloqueado');
    });
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('bloqueado');
    });
    const { harness, abas } = await iniciar('/contato');

    TestBed.inject(ApplicationRef).tick();
    await harness.navigateByUrl('/eventos');

    expect(slugs(abas)).toEqual(['contato', 'eventos']);
    vi.restoreAllMocks();
  });
});

describe('AbasAbertas no servidor', () => {
  it('tem só a aba da rota atual e não lê nem grava a sessão', async () => {
    sessionStorage.clear();
    sessionStorage.setItem(CHAVE, JSON.stringify(['eventos']));
    TestBed.configureTestingModule({
      providers: [
        { provide: PLATFORM_ID, useValue: 'server' },
        provideRouter([{ path: 'contato', component: Vazia }]),
      ],
    });
    const harness = await RouterTestingHarness.create();
    const abas = TestBed.inject(AbasAbertas);
    await harness.navigateByUrl('/contato');
    TestBed.inject(ApplicationRef).tick();

    expect(slugs(abas)).toEqual(['contato']);
    expect(sessionStorage.getItem(CHAVE)).toBe(JSON.stringify(['eventos']));
  });
});
