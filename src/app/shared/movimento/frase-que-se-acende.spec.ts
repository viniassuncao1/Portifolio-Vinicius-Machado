import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { FraseQueSeAcende } from './frase-que-se-acende';

@Component({
  imports: [FraseQueSeAcende],
  template: `<h3 appFraseQueSeAcende id="frase">Java no back, Angular no front</h3>`,
})
class Hospedeiro {}

function simular({ css, reduzido }: { css: boolean; reduzido: boolean }) {
  vi.stubGlobal('navigator', { hardwareConcurrency: 8 });
  vi.stubGlobal('matchMedia', (consulta: string) => ({
    matches: consulta.includes('reduced-motion') ? reduzido : true,
    addEventListener: () => undefined,
  }));
  vi.stubGlobal('CSS', { supports: () => css });
}

async function montar() {
  const fixture = TestBed.createComponent(Hospedeiro);
  fixture.detectChanges();
  await fixture.whenStable();
  return fixture.nativeElement.querySelector('#frase') as HTMLElement;
}

describe('FraseQueSeAcende', () => {
  afterEach(() => vi.unstubAllGlobals());

  it('separa as palavras e mantém a frase legível para leitores de tela', async () => {
    simular({ css: true, reduzido: false });

    const frase = await montar();

    expect(frase.querySelectorAll('.w')).toHaveLength(6);
    expect(frase.getAttribute('aria-label')).toBe('Java no back, Angular no front');
    expect(frase.querySelector('.w')?.getAttribute('aria-hidden')).toBe('true');
    expect(frase.textContent).toBe('Java no back, Angular no front');
    expect(frase.classList.contains('frase-acesa')).toBe(true);
    expect((frase.querySelectorAll('.w')[2] as HTMLElement).style.getPropertyValue('--i')).toBe(
      '2',
    );
  });

  it('sem animation-timeline o texto fica como veio', async () => {
    simular({ css: false, reduzido: false });

    const frase = await montar();

    expect(frase.querySelector('.w')).toBeNull();
    expect(frase.classList.contains('frase-acesa')).toBe(false);
  });

  it('com movimento reduzido o texto fica como veio', async () => {
    simular({ css: true, reduzido: true });

    const frase = await montar();

    expect(frase.querySelector('.w')).toBeNull();
  });
});
