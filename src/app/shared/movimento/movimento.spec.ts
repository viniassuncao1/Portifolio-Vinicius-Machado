import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { Contador } from './contador';
import { Magnetico } from './magnetico';
import { Revelar } from './revelar';

@Component({
  imports: [Revelar, Magnetico, Contador],
  template: `
    <p appRevelar id="texto">Olá</p>
    <button appMagnetico id="botao">Ir</button>
    <span [appContador]="42" id="numero">42</span>
  `,
})
class Hospedeiro {}

function simularAmbiente({ reduzido, topo }: { reduzido: boolean; topo: number }) {
  vi.stubGlobal('navigator', { hardwareConcurrency: 8 });
  vi.stubGlobal('matchMedia', (consulta: string) => ({
    matches: consulta.includes('reduced-motion') ? reduzido : true,
    addEventListener: () => undefined,
  }));
  vi.stubGlobal(
    'IntersectionObserver',
    class {
      observe = vi.fn();
      unobserve = vi.fn();
      disconnect = vi.fn();
    },
  );
  vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockReturnValue({
    top: topo,
    left: 0,
    width: 10,
    height: 10,
    right: 10,
    bottom: topo + 10,
    x: 0,
    y: topo,
    toJSON: () => ({}),
  });
}

async function montar() {
  const fixture = TestBed.createComponent(Hospedeiro);
  fixture.detectChanges();
  await fixture.whenStable();
  await new Promise((resolver) => setTimeout(resolver, 50));
  return fixture.nativeElement as HTMLElement;
}

describe('diretivas de movimento', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it('com movimento reduzido deixam tudo visível e inalterado', async () => {
    simularAmbiente({ reduzido: true, topo: 5000 });

    const raiz = await montar();

    expect(raiz.querySelector<HTMLElement>('#texto')?.style.opacity).toBe('');
    expect(raiz.querySelector('#numero')?.textContent).toBe('42');
  });

  it('o revelar esconde só o que está abaixo da janela, depois da hidratação', async () => {
    simularAmbiente({ reduzido: false, topo: 5000 });

    const raiz = await montar();

    expect(raiz.querySelector<HTMLElement>('#texto')?.style.opacity).toBe('0');
  });

  it('não esconde o que já está na primeira dobra', async () => {
    simularAmbiente({ reduzido: false, topo: 10 });

    const raiz = await montar();

    expect(raiz.querySelector<HTMLElement>('#texto')?.style.opacity).toBe('');
    expect(raiz.querySelector('#numero')?.textContent).toBe('42');
  });

  it('se a vista sai de cena antes de a biblioteca chegar, não registra nada nem falha', async () => {
    simularAmbiente({ reduzido: false, topo: 5000 });
    const fixture = TestBed.createComponent(Hospedeiro);
    fixture.detectChanges();

    fixture.destroy();
    await new Promise((resolver) => setTimeout(resolver, 80));

    expect(fixture.nativeElement.querySelector('#texto')?.style.opacity ?? '').toBe('');
  });
});
