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
