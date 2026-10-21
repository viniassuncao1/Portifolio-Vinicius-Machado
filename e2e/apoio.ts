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

/**
 * Espera a janela de Run terminar a revelação do log. Na primeira página ela abre sozinha e cada
 * linha faz um fade de `opacity`: o axe medido no meio dele reprova o contraste de uma linha que
 * ainda aparece. Sem a janela aberta (movimento reduzido, sessão já vista) volta na hora.
 */
export async function esperarLogDoRun(page: Page): Promise<void> {
  // A página do repositório não tem editor; nas demais o editor só fica `pronto` já hidratado.
  const editor = page.locator('main app-editor-de-codigo');
  if ((await editor.count()) > 0) await expect(editor).toHaveClass(/pronto/);
  await expect(
    page.locator('app-janela-de-run[data-aberto="true"] section[data-terminado="false"]'),
  ).toHaveCount(0);
  await expect
    .poll(() =>
      page
        .locator('app-janela-de-run')
        .evaluate((el) => el.getAnimations({ subtree: true }).length),
    )
    .toBe(0);
}

export const normalizar = (texto: string | null): string =>
  (texto ?? '').replace(/\s+/g, ' ').trim();

/** Linhas do código como o visitante lê, sem as vazias e com espaços normalizados. */
export async function linhasDoCodigo(page: Page): Promise<string[]> {
  // No Início o HTML traz o cartão; o código aparece quando a página hidrata na visão em código.
  await expect(page.locator('main code').first()).toBeAttached();
  const linhas = await page
    .locator('main code > span')
    .evaluateAll((els) => els.map((el) => el.textContent ?? ''));
  return linhas.map(normalizar).filter((linha) => linha !== '');
}

/**
 * Só o código que o compilador lê: sem textos entre aspas, comentários, Javadoc e code vision, uma
 * linha por linha do editor.
 */
export async function codigoSemTextos(page: Page): Promise<string> {
  await expect(page.locator('main code').first()).toBeAttached();
  return page.locator('main code > span').evaluateAll((linhas) =>
    linhas
      .filter(
        (linha) =>
          !linha.classList.contains('javadoc') && !linha.classList.contains('visao-de-codigo'),
      )
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
  await expect(page.locator('main code').first()).toBeAttached();
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

/**
 * Pede a primeira visita de verdade: desfaz a marca de sessão que `fixtures.ts` semeia, uma vez por
 * aba (`window.name` sobrevive às navegações da aba, então recarregar já conta como mesma sessão).
 */
export async function verAbertura(page: Page): Promise<void> {
  await page.addInitScript((chave) => {
    if (window.name.includes('sem-semente')) return;
    window.name += ' sem-semente';
    sessionStorage.removeItem(chave);
  }, 'abertura-exibida');
}
