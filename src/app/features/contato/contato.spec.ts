import { TestBed } from '@angular/core/testing';

import { Contato } from './contato';
import { VisaoDoConteudoEscolhida } from '../../core/visao-do-conteudo';

describe('Contato', () => {
  // Estes testes cobrem a visão em código; o cartão tem os seus em `shared/cartoes` e nos E2E.
  beforeEach(() => TestBed.inject(VisaoDoConteudoEscolhida).escolher('codigo'));
  afterEach(() => localStorage.clear());

  async function codigo(): Promise<string> {
    const fixture = TestBed.createComponent(Contato);
    await fixture.whenStable();
    return (fixture.nativeElement as HTMLElement).querySelector('code')?.textContent ?? '';
  }

  it('mostra o conteúdo da seção em Java', async () => {
    const texto = await codigo();

    expect(texto).toContain('package dev.vinicius.portfolio.contato;');
    expect(texto).toContain('record Contatos(');
    expect(texto).toContain('Contatos vinicius = new Contatos(');
    expect(texto).not.toContain('static final');
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

  describe('Copiar e-mail', () => {
    const botao = (raiz: HTMLElement) => raiz.querySelector<HTMLButtonElement>('button.copiar');

    afterEach(() => vi.unstubAllGlobals());

    it('copia o e-mail e anuncia "E-mail copiado"', async () => {
      const writeText = vi.fn().mockResolvedValue(undefined);
      vi.stubGlobal('navigator', { clipboard: { writeText } });
      const fixture = TestBed.createComponent(Contato);
      await fixture.whenStable();
      const raiz = fixture.nativeElement as HTMLElement;

      botao(raiz)?.click();
      await fixture.whenStable();

      expect(writeText).toHaveBeenCalledWith('viniciusmassuncao@gmail.com');
      const aviso = raiz.querySelector('[aria-live=polite]');
      expect(aviso?.getAttribute('role')).toBe('status');
      expect(aviso?.textContent).toBe('E-mail copiado');
    });

    it('avisa quando a cópia falha', async () => {
      vi.stubGlobal('navigator', {
        clipboard: { writeText: vi.fn().mockRejectedValue(new Error('negado')) },
      });
      const fixture = TestBed.createComponent(Contato);
      await fixture.whenStable();
      const raiz = fixture.nativeElement as HTMLElement;

      botao(raiz)?.click();
      await fixture.whenStable();

      expect(raiz.querySelector('[aria-live=polite]')?.textContent).toBe(
        'Não foi possível copiar o e-mail',
      );
    });

    it('não mostra o botão sem a Clipboard API', async () => {
      vi.stubGlobal('navigator', {});
      const fixture = TestBed.createComponent(Contato);
      await fixture.whenStable();

      expect(botao(fixture.nativeElement as HTMLElement)).toBeNull();
    });
  });
});
