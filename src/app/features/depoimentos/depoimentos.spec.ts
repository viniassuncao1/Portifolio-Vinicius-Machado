import { TestBed } from '@angular/core/testing';

import { Depoimentos } from './depoimentos';

describe('Depoimentos', () => {
  async function codigo(): Promise<string> {
    const fixture = TestBed.createComponent(Depoimentos);
    await fixture.whenStable();
    return (fixture.nativeElement as HTMLElement).querySelector('code')?.textContent ?? '';
  }

  it('mostra a recomendação real de Luana Porto', async () => {
    const texto = await codigo();

    expect(texto).toContain('Luana Porto');
    expect(texto).toContain('Desenvolvedor Backend Java');
    expect(texto).toContain('LocalDate.of(2026, 9, 22)');
    expect(texto).toContain('Recomendo o Vinícius com muita tranquilidade');
  });

  it('não mostra conteúdo de exemplo', async () => {
    expect(await codigo()).not.toMatch(/lorem ipsum/i);
  });

  it('lista as recomendações em ALL', async () => {
    expect(await codigo()).toContain('ALL = List.of(');
  });
});
