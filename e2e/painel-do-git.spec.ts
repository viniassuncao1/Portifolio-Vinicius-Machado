import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';
import type { Page, Route } from '@playwright/test';
import { readFile } from 'node:fs/promises';

import { abrirHidratada } from './apoio';

const REPOSITORIO = 'viniassuncao1/Portifolio-Vinicius-Machado';
const ENDERECO = '**/git/historico.json';
const DESKTOP = { width: 1920, height: 1080 };
const CELULAR = { width: 390, height: 844 };
const SHA_DO_MERGE = '703a632197fe451347b40e37227240fb799304ce';

/** Histórico fixo, para os testes não dependerem do repositório real: um merge de PR e três commits. */
const HISTORICO = {
  geradoEm: '2026-10-14T18:00:00.000Z',
  repositorio: REPOSITORIO,
  commits: [
    {
      sha: 'c5d718c4f40e5568ca2fe6e2840f7de561498eed',
      pais: ['d9901e7322af168cd1ea7493bc74684a52babf05'],
      autor: 'Vinicius Machado',
      data: '2026-10-14T14:11:18-03:00',
      assunto: 'docs: marca as tarefas 2.1 e 2.2 como concluídas',
    },
    {
      sha: SHA_DO_MERGE,
      pais: [
        'cd6b4286d499ca607aaaa538f80d7185ff28a084',
        'd73fa64af45ddf93381b21ea355babe0d03c1248',
      ],
      autor: 'Vinicius Machado',
      data: '2026-10-14T13:54:42-03:00',
      assunto: 'Merge pull request #27 from viniassuncao1/feat/barras-e-icones-da-new-ui',
      pr: 27,
      branch: 'feat/barras-e-icones-da-new-ui',
    },
    {
      sha: 'd73fa64af45ddf93381b21ea355babe0d03c1248',
      pais: ['9a88b56000000000000000000000000000000000'],
      autor: 'Vinicius Machado',
      data: '2026-10-14T13:30:00-03:00',
      assunto: 'feat: encaixa a faixa e o painel escondível na casca',
    },
    {
      sha: 'cd6b4286d499ca607aaaa538f80d7185ff28a084',
      pais: [],
      autor: 'Vinicius Machado',
      data: '2026-10-13T10:00:00-03:00',
      assunto: 'chore: inicia o portfólio',
    },
  ],
};

const responder = (corpo: unknown) => (rota: Route) =>
  rota.fulfill({ contentType: 'application/json', body: JSON.stringify(corpo) });

const painel = (page: Page) => page.getByRole('region', { name: 'Git' });
const lista = (page: Page) => page.getByRole('listbox', { name: 'Commits' });
const detalhes = (page: Page) => page.getByRole('complementary', { name: 'Detalhes do commit' });
const ramo = (page: Page) =>
  page.getByRole('button', { name: 'Branch master, abrir o painel do Git' });
const commit = (page: Page) => page.getByRole('button', { name: 'Commit', exact: true });
const opcao = (page: Page, assunto: string | RegExp) =>
  lista(page).getByRole('option', { name: assunto });

/** Abre a rota hidratada, sem animação, com o histórico fixo. */
async function abrirComHistorico(page: Page, historico: unknown = HISTORICO): Promise<void> {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.route(ENDERECO, responder(historico));
  await abrirHidratada(page, '/');
}

test.describe('Carregamento sob demanda', () => {
  test('nenhuma requisição ao histórico até o painel abrir, e só uma depois', async ({ page }) => {
    const pedidos: string[] = [];
    page.on('request', (r) => {
      if (r.url().includes('git/historico.json')) pedidos.push(r.url());
    });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await abrirHidratada(page, '/');
    await page.goto('/skills');
    await page.waitForLoadState('networkidle');

    expect(pedidos).toEqual([]);

    await ramo(page).click();
    await expect(lista(page)).toBeVisible();
    await page.keyboard.press('Escape');
    await ramo(page).click();
    await expect(lista(page)).toBeVisible();

    expect(pedidos).toHaveLength(1);
  });

  test('sem JavaScript o painel não existe aberto e o JSON não é pedido', async ({ browser }) => {
    const contexto = await browser.newContext({ javaScriptEnabled: false });
    const pagina = await contexto.newPage();
    const pedidos: string[] = [];
    pagina.on('request', (r) => pedidos.push(r.url()));

    await pagina.goto('/');

    await expect(pagina.locator('app-painel-do-git')).toBeHidden();
    expect(pedidos.filter((url) => url.includes('historico.json'))).toEqual([]);
    await contexto.close();
  });
});

test.describe('Abrir o painel do Git (desktop)', () => {
  test.use({ viewport: DESKTOP });

  test('o indicador master abre o painel e marca aria-expanded', async ({ page }) => {
    await abrirComHistorico(page);

    await expect(ramo(page)).toHaveAttribute('aria-expanded', 'false');
    await expect(painel(page)).toBeHidden();
    await ramo(page).click();

    await expect(painel(page)).toBeVisible();
    await expect(ramo(page)).toHaveAttribute('aria-expanded', 'true');
    await expect(commit(page)).toHaveAttribute('aria-pressed', 'true');
    await expect(opcao(page, /docs: marca as tarefas/)).toBeVisible();
  });

  test('o Commit da faixa abre e fecha o painel, com aria-pressed', async ({ page }) => {
    await abrirComHistorico(page);

    await expect(commit(page)).toHaveAttribute('aria-pressed', 'false');
    await commit(page).click();
    await expect(painel(page)).toBeVisible();
    await expect(commit(page)).toHaveAttribute('aria-pressed', 'true');

    await commit(page).click();

    await expect(painel(page)).toBeHidden();
    await expect(commit(page)).toHaveAttribute('aria-pressed', 'false');
    await expect(ramo(page)).toHaveAttribute('aria-expanded', 'false');
  });

  test('o painel fica na parte de baixo da IDE, acima da barra de status', async ({ page }) => {
    await abrirComHistorico(page);
    await ramo(page).click();
    await expect(painel(page)).toBeVisible();

    const caixa = (await painel(page).boundingBox())!;
    const editor = (await page.getByRole('main').boundingBox())!;
    const status = (await page.getByRole('status').boundingBox())!;

    expect(caixa.y).toBeGreaterThanOrEqual(editor.y);
    expect(caixa.y + caixa.height).toBeLessThanOrEqual(status.y + 1);
    expect(caixa.width).toBeGreaterThan(1000);
  });

  test('master e Commit são botões com nome acessível e entram na ordem de Tab', async ({
    page,
  }) => {
    await abrirComHistorico(page);
    const alcancados = new Set<string>();

    for (let i = 0; i < 30; i++) {
      await page.keyboard.press('Tab');
      alcancados.add(
        await page.evaluate(() => document.activeElement?.getAttribute('aria-label') ?? ''),
      );
    }

    expect(alcancados).toContain('Branch master, abrir o painel do Git');
    expect(alcancados).toContain('Commit');
  });
});

test.describe('Commits, detalhes e links', () => {
  test.use({ viewport: DESKTOP });

  test('lista assunto, autor e data de cada commit, com o grafo fora da leitura', async ({
    page,
  }) => {
    await abrirComHistorico(page);
    await ramo(page).click();

    const itens = lista(page).getByRole('option');

    await expect(itens).toHaveCount(HISTORICO.commits.length);
    for (const { assunto, autor } of HISTORICO.commits) {
      const item = opcao(page, assunto);
      await expect(item).toContainText(autor);
      await expect(item.locator('time')).toHaveAttribute('datetime', /^\d{4}-\d{2}-\d{2}T/);
      await expect(item.locator('svg')).toHaveAttribute('aria-hidden', 'true');
    }
  });

  test('escolher o merge do PR #27 mostra SHA, mensagem, autor, data e os links do commit e do PR', async ({
    page,
  }) => {
    await abrirComHistorico(page);
    await ramo(page).click();

    await opcao(page, /Merge pull request #27/).click();

    const quadro = detalhes(page);
    await expect(opcao(page, /Merge pull request #27/)).toHaveAttribute('aria-selected', 'true');
    await expect(quadro).toContainText(SHA_DO_MERGE);
    await expect(quadro).toContainText('Merge pull request #27 from');
    await expect(quadro).toContainText('Vinicius Machado');
    await expect(quadro).toContainText('feat/barras-e-icones-da-new-ui');
    await expect(quadro.locator('dd').nth(2)).toContainText('2026');
    const linkDoCommit = quadro.getByRole('link', { name: /Ver o commit 703a632/ });
    const linkDoPr = quadro.getByRole('link', { name: 'Ver o PR #27 no GitHub' });
    await expect(linkDoCommit).toHaveAttribute(
      'href',
      `https://github.com/${REPOSITORIO}/commit/${SHA_DO_MERGE}`,
    );
    await expect(linkDoPr).toHaveAttribute('href', `https://github.com/${REPOSITORIO}/pull/27`);
    for (const link of [linkDoCommit, linkDoPr]) {
      await expect(link).toHaveAttribute('target', '_blank');
      await expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    }
  });

  test('um commit comum tem o link do commit e nenhum link de PR', async ({ page }) => {
    await abrirComHistorico(page);
    await ramo(page).click();

    await opcao(page, /feat: encaixa a faixa/).click();

    await expect(detalhes(page).getByRole('link', { name: /Ver o commit/ })).toBeVisible();
    await expect(detalhes(page).getByRole('link', { name: /Ver o PR/ })).toHaveCount(0);
  });

  test('antes de escolher, os detalhes pedem para escolher um commit', async ({ page }) => {
    await abrirComHistorico(page);
    await ramo(page).click();

    await expect(detalhes(page)).toContainText('Escolha um commit');
  });
});

test.describe('Teclado', () => {
  test.use({ viewport: DESKTOP });

  const idDe = (sha: string) => `commit-${sha.slice(0, 7)}`;
  const primeiro = idDe(HISTORICO.commits[0].sha);
  const ultimo = idDe(HISTORICO.commits.at(-1)!.sha);

  test('ao abrir, o foco vai para a lista, com o commit mais recente ativo', async ({ page }) => {
    await abrirComHistorico(page);
    await ramo(page).click();

    await expect(lista(page)).toBeFocused();
    await expect(lista(page)).toHaveAttribute('aria-activedescendant', primeiro);
  });

  test('setas, Home e End movem o commit ativo e param nas pontas', async ({ page }) => {
    await abrirComHistorico(page);
    await ramo(page).click();
    await expect(lista(page)).toBeFocused();

    await page.keyboard.press('ArrowDown');
    await expect(lista(page)).toHaveAttribute(
      'aria-activedescendant',
      idDe(HISTORICO.commits[1].sha),
    );
    await page.keyboard.press('ArrowDown');
    await expect(lista(page)).toHaveAttribute(
      'aria-activedescendant',
      idDe(HISTORICO.commits[2].sha),
    );
    await page.keyboard.press('ArrowUp');
    await expect(lista(page)).toHaveAttribute(
      'aria-activedescendant',
      idDe(HISTORICO.commits[1].sha),
    );
    await page.keyboard.press('End');
    await expect(lista(page)).toHaveAttribute('aria-activedescendant', ultimo);
    await page.keyboard.press('ArrowDown');
    await expect(lista(page)).toHaveAttribute('aria-activedescendant', ultimo);
    await page.keyboard.press('Home');
    await expect(lista(page)).toHaveAttribute('aria-activedescendant', primeiro);
    await page.keyboard.press('ArrowUp');
    await expect(lista(page)).toHaveAttribute('aria-activedescendant', primeiro);
  });

  test('Enter mostra os detalhes do commit ativo', async ({ page }) => {
    await abrirComHistorico(page);
    await ramo(page).click();
    await expect(lista(page)).toBeFocused();

    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('Enter');

    await expect(opcao(page, /Merge pull request #27/)).toHaveAttribute('aria-selected', 'true');
    await expect(detalhes(page)).toContainText(SHA_DO_MERGE);
    await expect(
      detalhes(page).getByRole('link', { name: 'Ver o PR #27 no GitHub' }),
    ).toBeVisible();
  });

  test('Esc fecha o painel e o foco volta para o master', async ({ page }) => {
    await abrirComHistorico(page);
    await ramo(page).click();
    await expect(lista(page)).toBeFocused();

    await page.keyboard.press('Escape');

    await expect(painel(page)).toBeHidden();
    await expect(ramo(page)).toBeFocused();
    await expect(ramo(page)).toHaveAttribute('aria-expanded', 'false');
  });

  test('aberto pelo Commit da faixa, Esc devolve o foco ao Commit', async ({ page }) => {
    await abrirComHistorico(page);
    await commit(page).click();
    await expect(lista(page)).toBeFocused();

    await page.keyboard.press('Escape');

    await expect(painel(page)).toBeHidden();
    await expect(commit(page)).toBeFocused();
    await expect(commit(page)).toHaveAttribute('aria-pressed', 'false');
  });

  test('o botão Fechar também fecha e devolve o foco a quem abriu', async ({ page }) => {
    await abrirComHistorico(page);
    await ramo(page).click();

    await page.getByRole('button', { name: 'Fechar o painel do Git' }).click();

    await expect(painel(page)).toBeHidden();
    await expect(ramo(page)).toBeFocused();
  });

  test('aberto por teclado (Enter no master), a lista recebe o foco e Esc volta ao master', async ({
    page,
  }) => {
    await abrirComHistorico(page);
    await ramo(page).focus();

    await page.keyboard.press('Enter');
    await expect(lista(page)).toBeFocused();
    await page.keyboard.press('Escape');

    await expect(ramo(page)).toBeFocused();
  });
});

test.describe('Estados de erro e de histórico vazio', () => {
  test.use({ viewport: DESKTOP });

  test('com erro 500 mostra a mensagem e Tentar de novo carrega o histórico', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    let tentativas = 0;
    await page.route(ENDERECO, (rota) => {
      tentativas += 1;
      return tentativas === 1
        ? rota.fulfill({ status: 500, body: 'erro' })
        : responder(HISTORICO)(rota);
    });
    await abrirHidratada(page, '/');

    await ramo(page).click();

    const alerta = page.getByRole('alert');
    await expect(alerta).toContainText('Não foi possível carregar o histórico do Git');
    await page.getByRole('button', { name: 'Tentar de novo' }).click();

    await expect(lista(page)).toBeVisible();
    await expect(opcao(page, /chore: inicia o portfólio/)).toBeVisible();
    await expect(page.getByRole('alert')).toHaveCount(0);
    expect(tentativas).toBe(2);
  });

  test('um JSON fora do formato também cai no erro, sem quebrar a página', async ({ page }) => {
    await abrirComHistorico(page, { commits: 'nenhum' });

    await ramo(page).click();

    await expect(page.getByRole('alert')).toContainText('Não foi possível carregar');
    await expect(page.getByRole('button', { name: 'Tentar de novo' })).toBeVisible();
  });

  test('histórico vazio mostra que o histórico não está disponível', async ({ page }) => {
    await abrirComHistorico(page, { ...HISTORICO, commits: [] });

    await ramo(page).click();

    await expect(painel(page)).toContainText('O histórico do Git não está disponível');
    await expect(lista(page)).toHaveCount(0);
  });

  test('no erro, Esc ainda fecha o painel e devolve o foco', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.route(ENDERECO, (rota) => rota.fulfill({ status: 500, body: '' }));
    await abrirHidratada(page, '/');
    await ramo(page).click();
    await expect(page.getByRole('alert')).toBeVisible();

    await painel(page).press('Escape');

    await expect(painel(page)).toBeHidden();
    await expect(ramo(page)).toBeFocused();
  });
});

test.describe('Celular (390x844)', () => {
  test.use({ viewport: CELULAR });

  test('o painel ocupa a tela, sem rolagem horizontal, com botão para fechar', async ({ page }) => {
    await abrirComHistorico(page);

    await ramo(page).click();

    await expect(lista(page)).toBeVisible();
    const caixa = (await painel(page).boundingBox())!;
    expect(caixa.x).toBeLessThanOrEqual(1);
    expect(caixa.width).toBeGreaterThanOrEqual(CELULAR.width - 1);
    expect(caixa.y + caixa.height).toBeGreaterThanOrEqual(CELULAR.height - 1);
    const { rolagem, largura } = await page.evaluate(() => ({
      rolagem: document.documentElement.scrollWidth,
      largura: document.documentElement.clientWidth,
    }));
    expect(rolagem).toBeLessThanOrEqual(largura);
    const fechar = page.getByRole('button', { name: 'Fechar o painel do Git' });
    await expect(fechar).toBeVisible();
    await fechar.click();
    await expect(painel(page)).toBeHidden();
    await expect(ramo(page)).toBeFocused();
  });

  test('os detalhes aparecem na tela ao escolher o merge, sem estourar a largura', async ({
    page,
  }) => {
    await abrirComHistorico(page);
    await ramo(page).click();

    await opcao(page, /Merge pull request #27/).click();

    await expect(detalhes(page)).toBeVisible();
    await expect(
      detalhes(page).getByRole('link', { name: 'Ver o PR #27 no GitHub' }),
    ).toBeVisible();
    const estourou = await page.evaluate(
      () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
    );
    expect(estourou).toBe(false);
  });

  test('Esc fecha o painel no celular e devolve o foco ao master', async ({ page }) => {
    await abrirComHistorico(page);
    await ramo(page).click();
    await expect(lista(page)).toBeFocused();

    await page.keyboard.press('Escape');

    await expect(painel(page)).toBeHidden();
    await expect(ramo(page)).toBeFocused();
  });
});

for (const [nome, viewport] of [
  ['desktop', DESKTOP],
  ['celular', CELULAR],
] as const) {
  test.describe(`Acessibilidade (axe, WCAG 2 A e AA) do painel do Git no ${nome}`, () => {
    test.use({ viewport });

    const violacoes = async (page: Page) => {
      const { violations } = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa'])
        .analyze();
      return violations.flatMap((v) => v.nodes.map((n) => `${v.id}: ${n.target.join(' ')}`));
    };

    test('com a lista aberta não tem violações', async ({ page }) => {
      await abrirComHistorico(page);
      await ramo(page).click();
      await expect(lista(page)).toBeVisible();

      expect(await violacoes(page)).toEqual([]);
    });

    test('com o merge escolhido e os detalhes na tela não tem violações', async ({ page }) => {
      await abrirComHistorico(page);
      await ramo(page).click();
      await opcao(page, /Merge pull request #27/).click();
      await expect(detalhes(page)).toContainText(SHA_DO_MERGE);

      expect(await violacoes(page)).toEqual([]);
    });

    test('com o erro e com o histórico vazio não tem violações', async ({ page }) => {
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await page.route(ENDERECO, (rota) => rota.fulfill({ status: 500, body: '' }));
      await abrirHidratada(page, '/');
      await ramo(page).click();
      await expect(page.getByRole('alert')).toBeVisible();

      expect(await violacoes(page)).toEqual([]);
    });
  });
}

test.describe('Histórico gerado no build', () => {
  test('o JSON publicado tem o formato esperado, do mais novo ao mais antigo, e nenhum e-mail', async ({
    request,
  }) => {
    const resposta = await request.get('/git/historico.json');
    expect(resposta.ok()).toBe(true);
    expect(resposta.headers()['content-type']).toContain('application/json');
    const historico = await resposta.json();

    expect(historico.repositorio).toMatch(/^[^/\s]+\/[^/\s]+$/);
    expect(Array.isArray(historico.commits)).toBe(true);
    expect(Number.isNaN(Date.parse(historico.geradoEm))).toBe(false);
    for (const c of historico.commits) {
      expect(c.sha, c.assunto).toMatch(/^[0-9a-f]{40}$/);
      expect(Array.isArray(c.pais)).toBe(true);
      expect(c.autor, c.sha).not.toContain('@');
      expect(c.autor, c.sha).not.toMatch(/<|>/);
      expect(Number.isNaN(Date.parse(c.data)), c.sha).toBe(false);
      expect(c.assunto.length).toBeGreaterThan(0);
    }
    const textoDosAutores = historico.commits.map((c: { autor: string }) => c.autor).join('\n');
    expect(textoDosAutores).not.toMatch(/\S+@\S+/);
    const datas = historico.commits.map((c: { data: string }) => Date.parse(c.data));
    expect(Math.max(...datas)).toBe(datas[0]);
  });

  test('os merges de PR trazem o número e a branch, e só eles', async ({ request }) => {
    const { commits } = await (await request.get('/git/historico.json')).json();

    for (const c of commits as { assunto: string; pr?: number; branch?: string }[]) {
      const merge = /^Merge pull request #(\d+) from [^/\s]+\/(\S+)/.exec(c.assunto);
      if (merge) {
        expect(c.pr, c.assunto).toBe(Number(merge[1]));
        expect(c.branch, c.assunto).toBe(merge[2]);
      } else {
        expect(c.pr, c.assunto).toBeUndefined();
      }
    }
  });

  test('o arquivo gerado fora do dist também não tem e-mail', async () => {
    const texto = await readFile('public/git/historico.json', 'utf8');

    expect(texto).not.toMatch(/"autor":"[^"]*@/);
    expect(texto).not.toMatch(/[\w.+-]+@[\w-]+\.[\w.-]+/);
  });

  test('o histórico real abre no painel, com o merge do PR #27 e o link certo', async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await abrirHidratada(page, '/');
    await ramo(page).click();
    await expect(lista(page)).toBeVisible();

    const item = opcao(page, /Merge pull request #27 from/);
    if ((await item.count()) === 0) return;
    await item.first().click();

    await expect(
      detalhes(page).getByRole('link', { name: 'Ver o PR #27 no GitHub' }),
    ).toHaveAttribute('href', /\/pull\/27$/);
  });
});
