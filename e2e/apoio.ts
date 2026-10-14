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
    .getByRole('treeitem')
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

/** Cores de sintaxe do Java do IntelliJ (tokens `--cor-sintaxe-*`). */
export const CORES_DE_SINTAXE = {
  palavraChave: 'rgb(207, 142, 109)',
  campo: 'rgb(199, 125, 186)',
  literal: 'rgb(106, 171, 115)',
  valor: 'rgb(42, 172, 184)',
  anotacao: 'rgb(179, 174, 96)',
  comentario: 'rgb(143, 147, 154)',
} as const;

/** Rosa do acento e do anel de foco (`--cor-acento`). */
export const COR_DO_FOCO = 'rgb(222, 96, 210)';
export const COR_ROSA_ANTIGA = 'rgb(222, 96, 210)';

/** A árvore de seções do painel lateral. */
export const arvoreDeSecoes = (page: Page) =>
  page.getByRole('navigation', { name: 'Seções do portfólio' });

/** Expande todas as pastas da árvore que estiverem recolhidas. */
export async function abrirPastas(page: Page): Promise<void> {
  // No celular a gaveta ainda pode estar abrindo: só então a árvore entra na árvore de acessibilidade.
  await expect(arvoreDeSecoes(page)).toBeVisible();
  const pastas = arvoreDeSecoes(page).locator('[data-tipo=pasta]');
  const recolhidas = arvoreDeSecoes(page).locator('[data-tipo=pasta][aria-expanded=false]');
  for (let passada = 0; passada < 2 && (await recolhidas.count()) > 0; passada++) {
    for (let i = 0; i < (await pastas.count()); i++) {
      const pasta = pastas.nth(i);
      if ((await pasta.getAttribute('aria-expanded')) !== 'false') continue;
      await pasta.click();
      // Espera a pasta abrir antes da próxima: reler o estado cedo demais a fecharia de novo.
      await expect(pasta).toHaveAttribute('aria-expanded', 'true');
    }
  }
}

/**
 * Arquivo da árvore pelo título da seção (o nome acessível é "Título (Arquivo.java)"). Só existe
 * no DOM com a pasta expandida: use `abrirPastas` antes quando a pasta puder estar recolhida.
 */
export const arquivoDaArvore = (page: Page, titulo: string) =>
  arvoreDeSecoes(page).getByRole('treeitem', { name: new RegExp(`^${titulo} \\(`) });

/** Razão de contraste WCAG 2 entre duas cores "rgb(r, g, b)". */
export function contraste(a: string, b: string): number {
  const luminancia = (cor: string) => {
    const [r, g, bl] = (cor.match(/\d+/g) ?? []).slice(0, 3).map((canal) => {
      const c = Number(canal) / 255;
      return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
    });
    return 0.2126 * r + 0.7152 * g + 0.0722 * bl;
  };
  const [claro, escuro] = [luminancia(a), luminancia(b)].sort((x, y) => y - x);
  return (claro + 0.05) / (escuro + 0.05);
}
