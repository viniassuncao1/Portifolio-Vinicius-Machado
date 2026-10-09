import { TestBed } from '@angular/core/testing';

import { BarraDeFerramentas } from './barra-de-ferramentas';

describe('BarraDeFerramentas', () => {
  it('é decorativa: fica fora da leitura e não tem controles focáveis', async () => {
    const fixture = TestBed.createComponent(BarraDeFerramentas);
    await fixture.whenStable();
    const elemento = fixture.nativeElement as HTMLElement;

    expect(elemento.getAttribute('aria-hidden')).toBe('true');
    expect(elemento.querySelectorAll('button, a, [tabindex]')).toHaveLength(0);
  });

  it('exibe os oito ícones da barra', async () => {
    const fixture = TestBed.createComponent(BarraDeFerramentas);
    await fixture.whenStable();

    expect((fixture.nativeElement as HTMLElement).querySelectorAll('app-icone')).toHaveLength(8);
  });

  it('exibe os ícones na ordem do design', async () => {
    const fixture = TestBed.createComponent(BarraDeFerramentas);
    await fixture.whenStable();
    const origens = Array.from(
      (fixture.nativeElement as HTMLElement).querySelectorAll('app-icone img'),
    ).map((img) => /icones\/(.+)\.svg/.exec(img.getAttribute('src') ?? '')?.[1]);

    expect(origens).toEqual([
      'arquivo',
      'pasta',
      'projeto',
      'executar',
      'ferramenta',
      'ia',
      'relogio',
      'monitor',
    ]);
  });

  it('posiciona cada ícone pela variável --x', async () => {
    const fixture = TestBed.createComponent(BarraDeFerramentas);
    await fixture.whenStable();
    const botoes = (fixture.nativeElement as HTMLElement).querySelectorAll<HTMLElement>('.botao');

    expect(botoes[0].style.getPropertyValue('--x')).toBe('2.75');
    expect(botoes[7].style.getPropertyValue('--x')).toBe('25.1');
  });

  it('inclui os controles de janela sem foco', async () => {
    const fixture = TestBed.createComponent(BarraDeFerramentas);
    await fixture.whenStable();
    const controles = (fixture.nativeElement as HTMLElement).querySelector('.controles-janela');

    expect(controles?.getAttribute('focusable')).toBe('false');
  });
});
