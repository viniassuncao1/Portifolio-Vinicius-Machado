import AxeBuilder from '@axe-core/playwright';
import type { Page, Route } from '@playwright/test';
import { readFile } from 'node:fs/promises';

import { abrirHidratada } from './apoio';
import { expect, test } from './fixtures';

const REPOSITORIO = 'viniassuncao1/Portifolio-Vinicius-Machado';
const ENDERECO = '**/git/historico.json';
const DESKTOP = { width: 1920, height: 1080 };
const CELULAR = { width: 390, height: 844 };

const commitDe = (n: number, assunto: string, dia = 14) => ({
  sha: n.toString(16).padStart(40, '0'),
  pais: [(n - 1).toString(16).padStart(40, '0')],
  autor: 'Vinicius Machado',
  data: `2026-10-${String(dia).padStart(2, '0')}T12:${String(n % 60).padStart(2, '0')}:00-03:00`,
  assunto,
});

const mergeDe = (n: number, pr: number, branch: string, titulo: string) => ({
  ...commitDe(n, `Merge pull request #${pr} from viniassuncao1/${branch}`),
  pais: [(n - 1).toString(16).padStart(40, '0'), (n + 1000).toString(16).padStart(40, '0')],
  pr,
  branch,
  titulo,
});

/**
 * Histórico fixo (do mais novo ao mais antigo), para os testes não dependerem do repositório real:
 * 10 merges de PR (a lista mostra 8), commits de vários tipos (ci e build ficam abaixo de 3% e vão
 * para "outros") e duas marcações de tarefa, que não entram em "Últimos commits".
 */
const COMMITS = [
  commitDe(100, 'docs: marca a tarefa 3.1 como concluída'),
  commitDe(99, 'docs: marca a tarefa 2.1 como concluída'),
  mergeDe(98, 31, 'feat/fotos-de-perfil', 'feat: fotos de perfil no Javadoc'),
  commitDe(97, 'feat: mostra a foto da Luana em Depoimentos'),
  commitDe(96, 'test: cobre o retrato no Javadoc'),
  commitDe(95, 'fix: corrige o recuo do Javadoc no celular'),
  commitDe(94, 'feat: adiciona a página do repositório'),
  mergeDe(93, 30, 'feat/janela-de-run', 'feat: janela de Run'),
  ...[29, 28, 27, 26, 25, 24, 23, 22].map((pr, i) =>
    mergeDe(80 - i, pr, `feat/mudanca-${pr}`, `feat: mudança ${pr}`),
  ),
  ...Array.from({ length: 12 }, (_, i) => commitDe(60 - i, `feat: funcionalidade ${i + 1}`, 13)),
  ...Array.from({ length: 8 }, (_, i) => commitDe(40 - i, `test: teste ${i + 1}`, 13)),
  ...Array.from({ length: 6 }, (_, i) => commitDe(30 - i, `docs: documento ${i + 1}`, 12)),
  ...Array.from({ length: 3 }, (_, i) => commitDe(20 - i, `fix: correção ${i + 1}`, 12)),
  commitDe(10, 'ci: roda o lint no GitHub Actions', 11),
  commitDe(9, 'build: atualiza o Angular', 11),
  { ...commitDe(1, 'chore: inicia o portfólio', 10), pais: [] },
];

const HISTORICO = {
  geradoEm: '2026-10-14T18:00:00.000Z',
  repositorio: REPOSITORIO,
  commits: COMMITS,
};
const VAZIO = { geradoEm: '2026-10-14T18:00:00.000Z', repositorio: REPOSITORIO, commits: [] };

const responder = (corpo: unknown) => (rota: Route) =>
  rota.fulfill({ contentType: 'application/json', body: JSON.stringify(corpo) });

const pagina = (page: Page) => page.getByRole('article');
const aba = (page: Page) => page.getByRole('tab', { name: 'Portfolio-Vinicius-Machado' });
const ramo = (page: Page) =>
  page.getByRole('button', { name: 'Branch master, abrir o repositório' });
const commit = (page: Page) => page.getByRole('button', { name: 'Commit', exact: true });
const numeros = (page: Page) => page.locator('main dl.numeros');
const prs = (page: Page) =>
  page.getByRole('region', { name: 'Últimos pull requests' }).getByRole('listitem');
const commitsRecentes = (page: Page) =>
  page.getByRole('region', { name: 'Últimos commits' }).getByRole('listitem');
const legenda = (page: Page) => page.locator('main .legenda .item-da-legenda');

/** Abre `/repositorio` hidratada, sem animação, com o histórico fixo. */
async function abrirRepositorio(page: Page, historico: unknown = HISTORICO): Promise<void> {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.route(ENDERECO, responder(historico));
  await abrirPagina(page);
  // O esqueleto de carregamento vem no HTML; some quando o histórico chega (ou falha).
  await expect(carregando(page)).toHaveCount(0);
}

const carregando = (page: Page) =>
  page.getByRole('status').filter({ hasText: 'Carregando o histórico' });

/** A página do repositório não tem editor: espera o título do HTML, sem depender do editor. */
async function abrirPagina(page: Page): Promise<void> {
  await page.goto('/repositorio');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Portfolio-Vinicius-Machado');
}

test.describe('Página do repositório (/repositorio)', () => {
  test('abre a aba Portfolio-Vinicius-Machado, ativa, e mostra o nome, o selo e o botão para o GitHub', async ({
    page,
  }) => {
    await abrirRepositorio(page);

    await expect(page).toHaveTitle('Portfolio-Vinicius-Machado | Vinicius Machado');
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Portfolio-Vinicius-Machado');
    await expect(aba(page)).toHaveAttribute('aria-selected', 'true');
    await expect(pagina(page)).toContainText('Público');
    await expect(pagina(page)).toContainText('equipe de agentes de IA');
    const botao = pagina(page).getByRole('link', { name: /Ver no GitHub/ });
    await expect(botao).toHaveAttribute('href', `https://github.com/${REPOSITORIO}`);
  });

  test('mostra os números: commits, pull requests mesclados, primeiro commit e último deploy', async ({
    page,
  }) => {
    await abrirRepositorio(page);
    const dados = numeros(page);

    await expect(dados.locator('.numero', { hasText: 'Commits' }).locator('dd')).toHaveText(
      String(COMMITS.length),
    );
    await expect(
      dados.locator('.numero', { hasText: 'Pull requests mesclados' }).locator('dd'),
    ).toHaveText('10');
    await expect(dados.locator('.numero', { hasText: 'Desde' }).locator('dd')).toHaveText(
      '10/10/2026',
    );
    await expect(dados.locator('.numero', { hasText: 'Último deploy' })).toBeVisible();
  });

  test('a divisão por tipo tem legenda em texto, quantidade e porcentagem, e a barra é só decoração', async ({
    page,
  }) => {
    await abrirRepositorio(page);

    await expect(page.locator('main .barra')).toHaveAttribute('aria-hidden', 'true');
    await expect(legenda(page).filter({ hasText: 'feat' }).first()).toContainText(
      'funcionalidade nova',
    );
    await expect(
      legenda(page)
        .filter({ hasText: /^\s*test/ })
        .first(),
    ).toContainText('testes automatizados');
    for (const item of await legenda(page).all()) {
      await expect(item).toContainText(/\d+ \(\d+%\)/);
    }
    await expect(page.locator('main .barra .trecho')).toHaveCount(await legenda(page).count());
  });

  test('os tipos pequenos e os commits sem tipo ficam em "outros", listrado, com legenda', async ({
    page,
  }) => {
    await abrirRepositorio(page);
    const outros = legenda(page).filter({ has: page.locator('code', { hasText: /^outros$/ }) });

    await expect(outros).toHaveCount(1);
    await expect(outros).toContainText('chore, ci e build');
    await expect(outros.locator('.amostra')).toHaveAttribute('data-tipo', 'outros');
    const fundo = await page
      .locator('main .barra .trecho[data-tipo="outros"]')
      .evaluate((el) => getComputedStyle(el).backgroundImage);
    expect(fundo, 'listras, para não depender só da cor').toContain('repeating-linear-gradient');
    await expect(outros).toHaveText(/\d+ \(\d+%\)/);
  });

  test('lista os 8 pull requests mais recentes, do mais novo ao mais antigo, cada um com link para o PR', async ({
    page,
  }) => {
    await abrirRepositorio(page);

    await expect(prs(page)).toHaveCount(8);
    await expect(prs(page).first()).toContainText('feat: fotos de perfil no Javadoc');
    await expect(prs(page).first()).toContainText('#31');
    await expect(prs(page).first()).toContainText('feat/fotos-de-perfil');
    const links = prs(page).getByRole('link');
    await expect(links.first()).toHaveAttribute(
      'href',
      `https://github.com/${REPOSITORIO}/pull/31`,
    );
    const numerosDosPrs = await links.evaluateAll((els) =>
      els.map((el) => Number(/\/pull\/(\d+)$/.exec(el.getAttribute('href') ?? '')?.[1])),
    );
    expect(numerosDosPrs).toEqual([31, 30, 29, 28, 27, 26, 25, 24]);
  });

  test('lista os 5 commits de código mais recentes, sem merges nem marcações de tarefa', async ({
    page,
  }) => {
    await abrirRepositorio(page);

    await expect(commitsRecentes(page)).toHaveCount(5);
    await expect(commitsRecentes(page).first()).toContainText(
      'feat: mostra a foto da Luana em Depoimentos',
    );
    await expect(page.getByRole('region', { name: 'Últimos commits' })).not.toContainText(
      'marca a tarefa',
    );
    await expect(page.getByRole('region', { name: 'Últimos commits' })).not.toContainText(
      'Merge pull request',
    );
    const primeiro = commitsRecentes(page).first().getByRole('link');
    await expect(primeiro).toHaveAttribute(
      'href',
      new RegExp(`/${REPOSITORIO}/commit/[0-9a-f]{40}$`),
    );
  });

  test('todos os links externos abrem em nova aba, com rel seguro e aviso no nome acessível', async ({
    page,
  }) => {
    await abrirRepositorio(page);
    const externos = pagina(page).locator('a[href^="https://"]');

    expect(await externos.count()).toBeGreaterThanOrEqual(1 + 8 + 5 + 1);
    for (const link of await externos.all()) {
      await expect(link).toHaveAttribute('target', '_blank');
      await expect(link).toHaveAttribute('rel', 'noopener noreferrer');
      await expect(link).toHaveAccessibleName(/abre em nova aba/);
    }
    await expect(
      pagina(page).getByRole('link', { name: /Ver todo o histórico no GitHub/ }),
    ).toHaveAttribute('href', `https://github.com/${REPOSITORIO}/commits`);
  });

  test('ativar o link de um PR abre o GitHub numa nova aba e o site continua aberto', async ({
    page,
    context,
  }) => {
    await context.route('https://github.com/**', (rota) =>
      rota.fulfill({ contentType: 'text/html', body: '<title>GitHub</title>' }),
    );
    await abrirRepositorio(page);

    const [nova] = await Promise.all([
      context.waitForEvent('page'),
      prs(page).first().getByRole('link').click(),
    ]);

    await expect(nova).toHaveURL(`https://github.com/${REPOSITORIO}/pull/31`);
    expect(await nova.evaluate(() => window.opener)).toBeNull();
    await expect(page).toHaveURL(/\/repositorio$/);
  });

  test('o HTML pré-renderizado traz o nome e o esqueleto de carregamento, sem commits', async ({
    request,
  }) => {
    const html = await (await request.get('/repositorio')).text();

    expect(html).toContain('Portfolio-Vinicius-Machado');
    expect(html).toContain('Carregando o histórico do repositório');
    expect(html).not.toContain('Últimos pull requests');
  });
});

test.describe('master e Commit levam ao repositório', () => {
  test('o indicador master tem nome acessível e abre a aba do repositório', async ({ page }) => {
    await page.route(ENDERECO, responder(HISTORICO));
    await abrirHidratada(page, '/sobre-mim');

    await expect(ramo(page)).toBeVisible();
    await ramo(page).click();

    await expect(page).toHaveURL(/\/repositorio$/);
    await expect(aba(page)).toHaveAttribute('aria-selected', 'true');
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Portfolio-Vinicius-Machado');
  });

  test('o Commit da faixa abre o repositório e fica com aria-current="page"; nas seções não', async ({
    page,
  }) => {
    await page.route(ENDERECO, responder(HISTORICO));
    await abrirHidratada(page, '/sobre-mim');
    await expect(commit(page)).not.toHaveAttribute('aria-current', 'page');

    await commit(page).click();

    await expect(page).toHaveURL(/\/repositorio$/);
    await expect(commit(page)).toHaveAttribute('aria-current', 'page');
    await expect(aba(page)).toHaveAttribute('aria-selected', 'true');
  });

  test('por teclado: master e Commit entram na ordem de Tab e Enter abre o repositório', async ({
    page,
  }) => {
    await page.route(ENDERECO, responder(HISTORICO));
    await abrirHidratada(page, '/skills');

    await ramo(page).focus();
    await expect(ramo(page)).toBeFocused();
    await page.keyboard.press('Enter');
    await expect(page).toHaveURL(/\/repositorio$/);

    await page.goto('/skills');
    await commit(page).focus();
    await expect(commit(page)).toBeFocused();
    await page.keyboard.press('Enter');
    await expect(page).toHaveURL(/\/repositorio$/);
  });

  test('voltar para uma seção pelas abas ou pelo histórico tira o aria-current do Commit', async ({
    page,
  }) => {
    await page.route(ENDERECO, responder(HISTORICO));
    await abrirHidratada(page, '/sobre-mim');
    await commit(page).click();
    await expect(commit(page)).toHaveAttribute('aria-current', 'page');

    await page.goBack();

    await expect(page).toHaveURL(/\/sobre-mim$/);
    await expect(commit(page)).not.toHaveAttribute('aria-current', 'page');
  });

  test('não existe mais o painel do Git: nem região "Git" nem área de baixo dividida', async ({
    page,
  }) => {
    await abrirRepositorio(page);

    await expect(page.getByRole('region', { name: 'Git' })).toHaveCount(0);
    await expect(page.locator('app-painel-do-git')).toHaveCount(0);
  });

  test('o Run abre sozinho embaixo, sem cobrir o repositório, e o Executar segue funcionando', async ({
    page,
  }) => {
    await abrirRepositorio(page);

    await page.getByRole('button', { name: 'Executar PortfolioApplication' }).click();

    await expect(page.locator('app-janela-de-run')).toHaveAttribute('data-aberto', 'true');
    await expect(pagina(page)).toBeVisible();
    await expect(aba(page)).toHaveAttribute('aria-selected', 'true');
    const main = (await page.locator('main').boundingBox())!;
    const run = (await page.locator('app-janela-de-run').boundingBox())!;
    expect(main.y + main.height).toBeLessThanOrEqual(run.y + 1);
  });
});

test.describe('Carregamento sob demanda', () => {
  test('nenhuma requisição ao histórico até o repositório abrir, e só uma depois', async ({
    page,
  }) => {
    let requisicoes = 0;
    await page.route(ENDERECO, async (rota) => {
      requisicoes++;
      await responder(HISTORICO)(rota);
    });
    await abrirHidratada(page, '/sobre-mim');
    await page.getByRole('button', { name: 'Executar PortfolioApplication' }).click();
    await page.waitForTimeout(300);
    expect(requisicoes, 'antes de abrir o repositório').toBe(0);

    await ramo(page).click();
    await expect(numeros(page)).toBeVisible();
    expect(requisicoes).toBe(1);

    await page.goBack();
    await commit(page).click();
    await expect(numeros(page)).toBeVisible();
    expect(requisicoes, 'reabrir não baixa de novo').toBe(1);
  });

  test('mostra o carregamento enquanto o JSON não chega', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    let liberar!: () => void;
    const portao = new Promise<void>((resolver) => (liberar = resolver));
    await page.route(ENDERECO, async (rota) => {
      await portao;
      await responder(HISTORICO)(rota);
    });
    await abrirPagina(page);

    await expect(
      page.getByRole('status').filter({ hasText: 'Carregando o histórico' }),
    ).toBeVisible();
    await expect(numeros(page)).toHaveCount(0);
    liberar();

    await expect(numeros(page)).toBeVisible();
  });
});

test.describe('Estados de erro e de histórico vazio', () => {
  test('com erro 500 mostra o alerta e "Tentar de novo" carrega o histórico', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    let falhar = true;
    await page.route(ENDERECO, (rota) =>
      falhar ? rota.fulfill({ status: 500, body: 'erro' }) : responder(HISTORICO)(rota),
    );
    await abrirPagina(page);

    const alerta = page.getByRole('alert');
    await expect(alerta).toContainText('Não foi possível carregar o histórico do repositório');
    falhar = false;
    await alerta.getByRole('button', { name: 'Tentar de novo' }).click();

    await expect(numeros(page)).toBeVisible();
    await expect(alerta).toHaveCount(0);
    await expect(prs(page)).toHaveCount(8);
  });

  test('um JSON fora do formato também cai no erro, sem quebrar a página', async ({ page }) => {
    await abrirRepositorio(page, { commits: 'nada' }).catch(() => undefined);

    await expect(page.getByRole('alert')).toContainText('Não foi possível carregar');
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Portfolio-Vinicius-Machado');
  });

  test('histórico vazio avisa que não está disponível e mantém o link para o GitHub', async ({
    page,
  }) => {
    await abrirRepositorio(page, VAZIO);

    await expect(pagina(page)).toContainText('O histórico do repositório não está disponível');
    await expect(numeros(page)).toHaveCount(0);
    await expect(pagina(page).getByRole('link', { name: /Ver no GitHub/ })).toHaveAttribute(
      'href',
      `https://github.com/${REPOSITORIO}`,
    );
    await expect(pagina(page).getByRole('link', { name: /Ver todo o histórico/ })).toBeVisible();
  });
});

test.describe('Repositório no celular (390x844)', () => {
  test.use({ viewport: CELULAR });

  test('abre pelo endereço, fica em uma coluna e não rola na horizontal', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.route(ENDERECO, responder(HISTORICO));
    // No celular a branch some da barra superior: o repositório abre pelo endereço.
    await page.goto('/repositorio');
    await expect(numeros(page)).toBeVisible();

    const blocos = await page
      .locator('main .bloco')
      .evaluateAll((els) => els.map((el) => el.getBoundingClientRect()));
    const rolagem = await page.evaluate(() => ({
      pagina: document.documentElement.scrollWidth,
      janela: document.documentElement.clientWidth,
    }));

    expect(blocos.length).toBe(3);
    expect(new Set(blocos.map((b) => Math.round(b.x))).size, 'todos alinhados à esquerda').toBe(1);
    for (const caixa of blocos) expect(caixa.x + caixa.width).toBeLessThanOrEqual(CELULAR.width);
    expect(blocos[1].y).toBeGreaterThan(blocos[0].y + blocos[0].height - 1);
    expect(rolagem.pagina).toBeLessThanOrEqual(rolagem.janela);
  });

  test('títulos longos de PR quebram dentro da largura, sem cortar', async ({ page }) => {
    const longo = {
      ...HISTORICO,
      commits: [
        mergeDe(
          90,
          99,
          'feat/um-nome-de-branch-muito-comprido-para-a-tela-do-celular',
          `feat: ${'palavra '.repeat(20)}final`,
        ),
        ...COMMITS,
      ],
    };
    await abrirRepositorio(page, longo);

    const caixa = (await prs(page).first().boundingBox())!;
    const rolagem = await page.evaluate(
      () => document.documentElement.scrollWidth <= document.documentElement.clientWidth,
    );

    expect(caixa.x + caixa.width).toBeLessThanOrEqual(CELULAR.width);
    expect(rolagem).toBe(true);
  });
});

for (const [nomeDaTela, viewport] of [
  ['desktop', DESKTOP],
  ['celular', CELULAR],
] as const) {
  test.describe(`Acessibilidade (axe, WCAG 2 A e AA) do repositório no ${nomeDaTela}`, () => {
    test.use({ viewport });

    for (const tema of ['dark', 'light'] as const) {
      const sem = async (page: Page) => {
        const { violations } = await new AxeBuilder({ page })
          .withTags(['wcag2a', 'wcag2aa'])
          .analyze();
        return violations.map(
          (v) => `${v.id}: ${v.nodes.map((n) => n.target.join(' ')).join(' | ')}`,
        );
      };

      test(`com o histórico carregado não tem violações (${tema})`, async ({ page }) => {
        await page.emulateMedia({ colorScheme: tema });
        await abrirRepositorio(page);
        await expect(numeros(page)).toBeVisible();

        expect(await sem(page)).toEqual([]);
      });

      test(`com erro e com histórico vazio não tem violações (${tema})`, async ({ page }) => {
        await page.emulateMedia({ colorScheme: tema });
        await page.route(ENDERECO, (rota) => rota.fulfill({ status: 500, body: 'erro' }));
        await abrirPagina(page);
        await expect(page.getByRole('alert')).toBeVisible();
        expect(await sem(page)).toEqual([]);

        await page.unroute(ENDERECO);
        await page.route(ENDERECO, responder(VAZIO));
        await page.getByRole('button', { name: 'Tentar de novo' }).click();
        await expect(page.getByText('não está disponível')).toBeVisible();
        expect(await sem(page)).toEqual([]);
      });
    }
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
});
