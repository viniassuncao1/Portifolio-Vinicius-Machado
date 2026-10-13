import { TestBed } from '@angular/core/testing';

import { Projeto3 } from './projeto-3';

describe('Projeto3', () => {
  async function codigo(): Promise<string> {
    const fixture = TestBed.createComponent(Projeto3);
    await fixture.whenStable();
    return (fixture.nativeElement as HTMLElement).querySelector('code')?.textContent ?? '';
  }

  it('mostra a landing page e o link real do site', async () => {
    const fixture = TestBed.createComponent(Projeto3);
    await fixture.whenStable();
    const el = fixture.nativeElement as HTMLElement;

    expect(el.querySelector('code')?.textContent).toContain('Landing Page');
    expect(el.querySelector('a[href^="https://"]')).not.toBeNull();
  });

  it('descreve o projeto em pt-BR', async () => {
    expect(await codigo()).toContain('Automatize. Escale. Domine.');
  });
});
