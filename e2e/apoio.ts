import { expect } from '@playwright/test';
import type { Page } from '@playwright/test';

/**
 * Abre o endereço e espera a hidratação terminar: o editor só ganha a classe `pronto` no
 * navegador, depois que o Angular assumiu a página. Antes disso atalhos e setas ainda não existem.
 */
export async function abrirHidratada(page: Page, url: string): Promise<void> {
  await page.goto(url);
  await expect(page.locator('main app-editor-de-codigo')).toHaveClass(/pronto/);
}

/**
 * Abre o endereço hidratado e põe o foco num item da árvore. Os atalhos da casca estão no elemento
 * `app-casca`, então só chegam a ele com o foco dentro da casca (ver o teste de foco no corpo).
 */
export async function abrirComFocoNaCasca(page: Page, url: string): Promise<void> {
  await abrirHidratada(page, url);
  await page
    .getByRole('navigation', { name: 'Seções do portfólio' })
    .getByRole('link')
    .and(page.locator('[tabindex="0"]'))
    .focus();
}

export const normalizar = (texto: string | null): string =>
  (texto ?? '').replace(/\s+/g, ' ').trim();

/** Linhas do código como o visitante lê, sem as vazias e com espaços normalizados. */
export async function linhasDoCodigo(page: Page): Promise<string[]> {
  const linhas = await page
    .locator('main code > span')
    .evaluateAll((els) => els.map((el) => el.textContent ?? ''));
  return linhas.map(normalizar).filter((linha) => linha !== '');
}

/**
 * Só o código que o compilador lê: sem textos entre aspas, comentários e Javadoc, uma linha por
 * linha do editor.
 */
export async function codigoSemTextos(page: Page): Promise<string> {
  return page.locator('main code > span').evaluateAll((linhas) =>
    linhas
      .filter((linha) => !linha.classList.contains('javadoc'))
      .map((linha) =>
        Array.from(linha.children)
          .filter(
            (trecho) =>
              !trecho.classList.contains('papel-literal') &&
              !trecho.classList.contains('papel-comentario'),
          )
          .map((trecho) => trecho.textContent ?? '')
          .join(''),
      )
      .join('\n'),
  );
}

/** Os comentários `// ...` que o visitante lê, sem o `//` inicial. */
export async function comentariosDoCodigo(page: Page): Promise<string[]> {
  const comentarios = await page
    .locator('main code .papel-comentario')
    .evaluateAll((els) => els.map((el) => el.textContent ?? ''));
  return comentarios.map((c) => normalizar(c.replace(/^\s*\/\/\s*/, '')));
}

/** Linhas do código, uma por linha do editor, mantendo as quebras (as vazias ficam de fora). */
export async function textoDoCodigo(page: Page): Promise<string> {
  return (await linhasDoCodigo(page)).join('\n');
}

/** Cada `List.of(...)` do texto, do `(` ao `)` que o fecha, ignorando parênteses entre aspas. */
export function listasDe(texto: string): string[] {
  const listas: string[] = [];
  for (const { index } of texto.matchAll(/List\.of\(/g)) {
    let profundidade = 0;
    let dentroDeAspas = false;
    for (let i = index + 'List.of'.length; i < texto.length; i++) {
      const caractere = texto[i];
      if (caractere === '"') dentroDeAspas = !dentroDeAspas;
      if (dentroDeAspas) continue;
      if (caractere === '(') profundidade++;
      if (caractere === ')' && --profundidade === 0) {
        listas.push(texto.slice(index, i + 1));
        break;
      }
    }
  }
  return listas;
}
