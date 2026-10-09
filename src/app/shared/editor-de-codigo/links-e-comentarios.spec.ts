import { TestBed } from '@angular/core/testing';

import { comentario, comum, linha, link, literal } from './conteudo';
import type { ConteudoDoEditor } from './conteudo';
import { EditorDeCodigo } from './editor-de-codigo';

describe('papel comentario e links', () => {
  async function renderizar(conteudo: ConteudoDoEditor): Promise<HTMLElement> {
    const fixture = TestBed.createComponent(EditorDeCodigo);
    fixture.componentRef.setInput('conteudo', conteudo);
    await fixture.whenStable();
    return fixture.nativeElement as HTMLElement;
  }

  it('comentario cria um trecho com o papel comentario e a classe do papel', async () => {
    expect(comentario('// 2x')).toEqual({ texto: '// 2x', papel: 'comentario' });

    const raiz = await renderizar([linha(1, comentario('// 2x'))]);

    expect(raiz.querySelector('span.papel-comentario')?.textContent).toBe('// 2x');
  });

  it('link guarda o href sem perder o papel do trecho', () => {
    expect(link(literal('"site"'), 'https://site.com')).toEqual({
      texto: '"site"',
      papel: 'literal',
      href: 'https://site.com',
    });
  });

  it('renderiza link externo como <a> com target e rel seguros', async () => {
    const raiz = await renderizar([
      linha(1, comum('url = '), link(literal('"site.com"'), 'https://site.com')),
    ]);
    const a = raiz.querySelector('a');

    expect(a?.className).toBe('papel-literal');
    expect(a?.getAttribute('href')).toBe('https://site.com');
    expect(a?.getAttribute('target')).toBe('_blank');
    expect(a?.getAttribute('rel')).toBe('noopener noreferrer');
  });

  it('links mailto: e tel: abrem na mesma aba, sem target nem rel', async () => {
    const raiz = await renderizar([
      linha(1, link(literal('"a@b.com"'), 'mailto:a@b.com')),
      linha(1, link(literal('"+55"'), 'tel:+5561999999999')),
    ]);

    raiz.querySelectorAll('a').forEach((a) => {
      expect(a.hasAttribute('target')).toBe(false);
      expect(a.hasAttribute('rel')).toBe(false);
    });
    expect(raiz.querySelectorAll('a')).toHaveLength(2);
  });

  it('trecho sem href continua <span>', async () => {
    const raiz = await renderizar([linha(1, comum('x'))]);

    expect(raiz.querySelector('a')).toBeNull();
  });

  it('as classes usam os tokens do papel e o link tem sublinhado e foco visível', async () => {
    await renderizar([linha(1, comentario('// x'))]);
    const estilos = Array.from(document.head.querySelectorAll('style'))
      .map((e) => e.textContent ?? '')
      .join('\n');

    expect(estilos).toMatch(/\.papel-comentario[^{]*\{[^}]*var\(--cor-sintaxe-comentario\)/);
    expect(estilos).toMatch(/:hover[^{]*\{[^}]*underline/);
    expect(estilos).toMatch(/:focus-visible[^{]*\{[^}]*outline/);
  });
});
