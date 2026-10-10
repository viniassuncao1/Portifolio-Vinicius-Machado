import { TestBed } from '@angular/core/testing';

import { Contato } from './contato';

describe('Contato', () => {
  async function codigo(): Promise<string> {
    const fixture = TestBed.createComponent(Contato);
    await fixture.whenStable();
    return (fixture.nativeElement as HTMLElement).querySelector('code')?.textContent ?? '';
  }

  it('mostra o conteúdo da seção em Java', async () => {
    const texto = await codigo();

    expect(texto).toContain('viniciusmassuncao@gmail.com');
    expect(texto).toContain('+55 61 98283-7805');
    expect(texto).toContain('linkedin.com/in/viniassuncao');
    expect(texto).toContain('github.com/viniassuncao1');
    expect(texto).not.toContain('URI');
  });

  it('transforma os quatro contatos em links reais', async () => {
    const fixture = TestBed.createComponent(Contato);
    await fixture.whenStable();
    const hrefs = Array.from((fixture.nativeElement as HTMLElement).querySelectorAll('a'), (a) =>
      a.getAttribute('href'),
    );

    expect(hrefs).toEqual([
      'mailto:viniciusmassuncao@gmail.com',
      'tel:+5561982837805',
      'https://linkedin.com/in/viniassuncao',
      'https://github.com/viniassuncao1',
    ]);
  });
});
