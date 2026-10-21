import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { Inclinar } from './inclinar';
import { Parallax } from './parallax';

const animate = vi.fn();
vi.mock('motion', () => ({
  animate: (...argumentos: unknown[]) => animate(...argumentos),
  inView: vi.fn(),
}));

@Component({
  imports: [Inclinar, Parallax],
  template: `
    <div appInclinar id="cartao"></div>
    <div [appParallax]="20" id="foto"></div>
  `,
})
class Hospedeiro {}

function simular({ fino, reduzido }: { fino: boolean; reduzido: boolean }) {
  vi.stubGlobal('navigator', { hardwareConcurrency: 8 });
  vi.stubGlobal('matchMedia', (consulta: string) => ({
    matches: consulta.includes('reduced-motion') ? reduzido : fino,
    addEventListener: () => undefined,
  }));
}

async function montar() {
  const fixture = TestBed.createComponent(Hospedeiro);
  fixture.detectChanges();
  await fixture.whenStable();
  await new Promise((resolver) => setTimeout(resolver, 20));
  return fixture.nativeElement as HTMLElement;
}

/** A última animação de inclinação (o parallax também escuta o mesmo evento, que borbulha até a janela). */
function ultimaInclinacao(): string {
  const chamada = animate.mock.calls.filter(([, valores]) => 'transform' in valores).at(-1)!;
  return chamada[1].transform as string;
}

function mover(alvo: EventTarget, x: number, y: number) {
  alvo.dispatchEvent(new PointerEvent('pointermove', { clientX: x, clientY: y, bubbles: true }));
}

describe('inclinar e parallax', () => {
  beforeEach(() => animate.mockClear());
  afterEach(() => vi.unstubAllGlobals());

  it('o cartão se inclina na direção do ponteiro e volta ao lugar ao sair', async () => {
    simular({ fino: true, reduzido: false });
    const raiz = await montar();
    const cartao = raiz.querySelector('#cartao') as HTMLElement;
    vi.spyOn(cartao, 'getBoundingClientRect').mockReturnValue({
      left: 0,
      top: 0,
      width: 200,
      height: 100,
    } as DOMRect);

    mover(cartao, 200, 50);
    const inclinado = ultimaInclinacao();
    expect(inclinado).toContain('rotateY(5deg)');
    expect(inclinado).toContain('rotateX(0');

    cartao.dispatchEvent(new PointerEvent('pointerleave'));
    expect(ultimaInclinacao()).toContain('rotateY(0deg)');
  });

  it('a inclinação nunca passa de 5 graus', async () => {
    simular({ fino: true, reduzido: false });
    const raiz = await montar();
    const cartao = raiz.querySelector('#cartao') as HTMLElement;
    vi.spyOn(cartao, 'getBoundingClientRect').mockReturnValue({
      left: 0,
      top: 0,
      width: 100,
      height: 100,
    } as DOMRect);

    mover(cartao, 100, 0);

    expect(ultimaInclinacao()).toMatch(/rotateX\(5deg\) rotateY\(5deg\)/);
  });

  it('a foto se desloca no sentido oposto ao do ponteiro, até a intensidade pedida', async () => {
    simular({ fino: true, reduzido: false });
    await montar();
    vi.stubGlobal('innerWidth', 1000);
    vi.stubGlobal('innerHeight', 800);

    mover(globalThis, 1000, 800);

    const [, deslocamento] = animate.mock.calls.filter(([, v]) => 'x' in v).at(-1)!;
    expect(deslocamento).toEqual({ x: -20, y: -20 });
  });

  it('em toque (sem ponteiro fino) nada é aplicado', async () => {
    simular({ fino: false, reduzido: false });
    const raiz = await montar();

    mover(raiz.querySelector('#cartao')!, 10, 10);
    mover(globalThis, 10, 10);

    expect(animate).not.toHaveBeenCalled();
  });

  it('com movimento reduzido nada é aplicado', async () => {
    simular({ fino: true, reduzido: true });
    const raiz = await montar();

    mover(raiz.querySelector('#cartao')!, 10, 10);
    mover(globalThis, 10, 10);

    expect(animate).not.toHaveBeenCalled();
  });
});
