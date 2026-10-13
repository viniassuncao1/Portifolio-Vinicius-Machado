import { TestBed } from '@angular/core/testing';

import { Projeto2 } from './projeto-2';

describe('Projeto2', () => {
  async function codigo(): Promise<string> {
    const fixture = TestBed.createComponent(Projeto2);
    await fixture.whenStable();
    return (fixture.nativeElement as HTMLElement).querySelector('code')?.textContent ?? '';
  }

  it('mostra a landing page e o link real do site', async () => {
    const fixture = TestBed.createComponent(Projeto2);
    await fixture.whenStable();
    const el = fixture.nativeElement as HTMLElement;

    expect(el.querySelector('code')?.textContent).toContain('Landing Page');
    expect(el.querySelector('a[href^="https://"]')).not.toBeNull();
  });

  it('descreve o projeto em pt-BR', async () => {
    expect(await codigo()).toContain('seu corpo não foi feito pra doer');
  });
});
