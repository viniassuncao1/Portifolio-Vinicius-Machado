import AxeBuilder from '@axe-core/playwright';
import type { Locator, Page } from '@playwright/test';

import { abrirHidratada, abrirPastas, arquivoDaArvore, arvoreDeSecoes } from './apoio';
import { expect, test } from './fixtures';

const DESKTOP = { width: 1920, height: 1080 };
const CELULAR = { width: 390, height: 844 };
const javadoc = (page: Page) => page.locator('main .javadoc').first();
const alternar = (page: Page) =>
  page.getByRole('button', { name: 'Alternar modo de leitura' }).first();

/** Abre a rota com o modo de leitura desligado (comentário cru) ou ligado (padrão). */
async function abrir(page: Page, rota: string, modo: 'leitura' | 'cru' = 'leitura'): Promise<void> {
  if (modo === 'cru') {
    await page.addInitScript(() => sessionStorage.setItem('modo-de-leitura', 'desligado'));
  }
  await abrirHidratada(page, rota);
}

/**
 * Número que a coluna da calha mostra para cada linha de código: o texto da linha → o número da
 * faixa que cobre a metade da altura dela. Linhas quebradas (celular) ficam sob uma faixa só.
 */
async function numeroPorLinha(page: Page): Promise<Map<string, number>> {
  const pares = await page.evaluate(() => {
    const faixas = [...document.querySelectorAll('main .numeros span')].map((el) => ({
      numero: el.textContent?.trim() ?? '',
      caixa: el.getBoundingClientRect(),
    }));
    return [...document.querySelectorAll('main code > .linha:not(.vazia)')].map((linha) => {
      const caixa = linha.getBoundingClientRect();
      const meio = caixa.top + caixa.height / 2;
      const faixa = faixas.find((f) => f.caixa.top <= meio && meio < f.caixa.bottom);
      return [(linha.textContent ?? '').replace(/\s+/g, ' ').trim(), faixa?.numero ?? ''] as const;
    });
  });
  return new Map(pares.map(([texto, numero]) => [texto, Number(numero)]));
}

test.describe('Modo de leitura do Javadoc', () => {
  test.use({ viewport: DESKTOP });

  test('Sobre Mim abre como texto formatado: Inter, sem /**, * nem */ e com fundo destacado', async ({
    page,
  }) => {
    await abrir(page, '/sobre-mim');
    const bloco = javadoc(page);

    await expect(bloco).toHaveAttribute('data-modo', 'leitura');
    await expect(bloco).toContainText('Sou desenvolvedor Full Stack');
    const texto = (await bloco.innerText()).trim();
    expect(texto).not.toMatch(/\/\*\*|\*\/|^\s*\*/m);
    const estilo = await bloco.evaluate((el) => {
      const cs = getComputedStyle(el);
      return { fonte: cs.fontFamily, fundo: cs.backgroundColor };
    });
    expect(estilo.fonte).toMatch(/^Inter/);
    expect(estilo.fundo, 'fundo levemente destacado').not.toBe('rgba(0, 0, 0, 0)');
    await expect(page.getByRole('button', { name: 'Alternar modo de leitura' })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
  });

  test('o texto do Javadoc usa a cor de texto normal, e não a de comentário', async ({ page }) => {
    await abrir(page, '/sobre-mim');

    const [javadocCor, comentarioCor, textoCor] = await Promise.all([
      javadoc(page).evaluate(
        (el) => getComputedStyle(el.querySelector('.javadoc-paragrafo')!).color,
      ),
      page
        .locator('main .papel-comentario')
        .first()
        .evaluate((el) => getComputedStyle(el).color),
      page
        .locator('main .papel-comum')
        .first()
        .evaluate((el) => getComputedStyle(el).color),
    ]);

    expect(javadocCor).toBe(textoCor);
    expect(javadocCor).not.toBe(comentarioCor);
  });

  test('a largura de leitura não passa de 65 caracteres', async ({ page }) => {
    await abrir(page, '/sobre-mim');

    const { corpo, limite } = await page
      .locator('main .javadoc-corpo')
      .first()
      .evaluate((el) => {
        const sonda = document.createElement('div');
        sonda.style.cssText = 'position:absolute;visibility:hidden;width:65ch';
        el.appendChild(sonda);
        const largura = sonda.getBoundingClientRect().width;
        sonda.remove();
        return { corpo: el.getBoundingClientRect().width, limite: largura };
      });

    expect(corpo).toBeLessThanOrEqual(limite + 1);
    expect(corpo).toBeGreaterThan(300);
  });

  test('o botão da calha mostra o comentário cru (com /**, * e */) e a escolha vale para todas as seções', async ({
    page,
  }) => {
    await abrir(page, '/sobre-mim');

    await alternar(page).click();

    await expect(javadoc(page)).toHaveAttribute('data-modo', 'cru');
    await expect(alternar(page)).toHaveAttribute('aria-pressed', 'false');
    const cru = await javadoc(page).evaluate((el) => getComputedStyle(el).fontFamily);
    expect(cru).toMatch(/JetBrains Mono/);
    expect(await page.evaluate(() => sessionStorage.getItem('modo-de-leitura'))).toBe('desligado');

    await abrirPastas(page);
    await arquivoDaArvore(page, 'Diferenciais').click();
    await expect(page).toHaveURL(/\/diferenciais$/);
    await expect(javadoc(page)).toHaveAttribute('data-modo', 'cru');

    await alternar(page).click();
    await expect(javadoc(page)).toHaveAttribute('data-modo', 'leitura');
  });

  test('o texto copiável do Javadoc é o mesmo nos dois modos', async ({ page }) => {
    await abrir(page, '/sobre-mim');
    const normal = (s: string | null) => (s ?? '').replace(/\s+/g, ' ').trim();
    const leitura = normal(await page.locator('main .javadoc-corpo').first().textContent());

    await alternar(page).click();
    const cru = normal(await page.locator('main .javadoc-corpo').first().textContent());

    expect(cru).toBe(leitura);
    expect(leitura.startsWith('Sou desenvolvedor Full Stack com foco em Java 21')).toBe(true);
  });

  test('Depoimentos no modo de leitura mantém a foto da Luana e o @author com o link', async ({
    page,
  }) => {
    await abrir(page, '/depoimentos');
    const bloco = javadoc(page);

    await expect(bloco).toHaveAttribute('data-modo', 'leitura');
    await expect(bloco.getByRole('img', { name: 'Foto de Luana Porto' })).toBeVisible();
    await expect(bloco.getByRole('link', { name: /Luana Porto/ })).toHaveAttribute(
      'href',
      'https://www.linkedin.com/in/luana-porto-pereira-gomes/',
    );
    await expect(bloco).toContainText('@author');
  });

  test('o botão alterna por teclado (Enter e Espaço) e tem nome acessível', async ({ page }) => {
    await abrir(page, '/sobre-mim');

    await alternar(page).focus();
    await page.keyboard.press('Enter');
    await expect(javadoc(page)).toHaveAttribute('data-modo', 'cru');
    await page.keyboard.press('Space');

    await expect(javadoc(page)).toHaveAttribute('data-modo', 'leitura');
    await expect(alternar(page)).toBeFocused();
  });

  test('a calha numera os dois modos igual: um número por Javadoc na leitura e a numeração seguinte não muda', async ({
    page,
  }) => {
    for (const rota of ['/', '/sobre-mim', '/depoimentos', '/como-uso-ia']) {
      await abrir(page, rota);
      const leitura = await numeroPorLinha(page);
      await alternar(page).click();
      await expect(javadoc(page)).toHaveAttribute('data-modo', 'cru');
      const cru = await numeroPorLinha(page);

      expect([...leitura.entries()], rota).toEqual([...cru.entries()]);
      expect(Math.max(...leitura.values()), rota).toBeGreaterThan(5);
      await alternar(page).click();
    }
  });

  test('no modo de leitura o Javadoc ocupa um número só, e no cru, um por linha do comentário', async ({
    page,
  }) => {
    await abrir(page, '/sobre-mim');
    const faixas = () =>
      page.locator('main .numeros span').evaluateAll((els) =>
        els.map((el) => ({
          n: el.textContent?.trim() ?? '',
          h: el.getBoundingClientRect().height,
        })),
      );

    const leitura = await faixas();
    await alternar(page).click();
    await expect
      .poll(async () => Math.max(...(await faixas()).map((f) => f.h)), {
        message: 'no modo cru cada faixa é uma linha de código (22 px)',
      })
      .toBeLessThan(40);

    const alturaDoBloco = (await javadoc(page).boundingBox())!.height;
    expect(
      leitura.some((f) => f.h > 100),
      'uma faixa alta cobre o Javadoc',
    ).toBe(true);
    expect(alturaDoBloco).toBeGreaterThan(100);
  });
});

test.describe('Numeração por linha lógica no celular (390x844)', () => {
  test.use({ viewport: CELULAR });

  test('uma linha de código que quebra continua com um número só', async ({ page }) => {
    await abrir(page, '/projeto-5');

    const quebradas = await page.evaluate(() => {
      const faixas = [...document.querySelectorAll('main .numeros span')].map((el) => ({
        numero: el.textContent?.trim() ?? '',
        caixa: el.getBoundingClientRect(),
      }));
      return [...document.querySelectorAll('main code > .linha:not(.vazia)')]
        .map((linha) => {
          const c = linha.getBoundingClientRect();
          const cobre = (y: number) => faixas.find((f) => f.caixa.top <= y && y < f.caixa.bottom);
          return {
            texto: (linha.textContent ?? '').trim().slice(0, 40),
            altura: c.height,
            topo: cobre(c.top + 2)?.numero,
            base: cobre(c.bottom - 2)?.numero,
          };
        })
        .filter((l) => l.altura > 30);
    });

    expect(quebradas.length, 'alguma linha quebra em 390 px').toBeGreaterThan(0);
    for (const linha of quebradas) {
      expect(linha.topo, linha.texto).toBeTruthy();
      expect(linha.base, linha.texto).toBe(linha.topo);
    }
  });

  test('os números das linhas de código só crescem, sem repetir (o Javadoc em leitura pula o intervalo do comentário)', async ({
    page,
  }) => {
    await abrir(page, '/projeto-5');

    const numeros = (
      await page
        .locator('main .numeros span')
        .evaluateAll((els) => els.map((e) => e.textContent?.trim() ?? ''))
    )
      .filter((n) => n !== '')
      .map(Number);

    expect(numeros.length).toBeGreaterThan(10);
    numeros.forEach((n, i) => i > 0 && expect(n).toBeGreaterThan(numeros[i - 1]));
    expect(numeros[0]).toBe(1);
  });
});

test.describe('Início: nome, cargo e atalhos', () => {
  test.use({ viewport: DESKTOP });

  test('o h1 e o Javadoc dizem o nome e o cargo, com o @author linkando o LinkedIn em nova aba', async ({
    page,
  }) => {
    await abrir(page, '/');

    await expect(page.getByRole('heading', { level: 1 })).toHaveText(
      'Vinicius Machado, Desenvolvedor Full Stack',
    );
    await expect(javadoc(page)).toContainText('Vinicius Machado');
    await expect(javadoc(page)).toContainText('Desenvolvedor Full Stack:');
    const autor = javadoc(page).getByRole('link', { name: /Vinicius Machado/ });
    await expect(autor).toHaveAttribute('href', 'https://linkedin.com/in/viniassuncao');
    await expect(autor).toHaveAttribute('target', '_blank');
    await expect(autor).toHaveAttribute('rel', 'noopener noreferrer');
  });

  test('"// Próximo: ver os projetos →" leva ao Projeto 1', async ({ page }) => {
    await abrir(page, '/');

    await page.getByRole('link', { name: '// Próximo: ver os projetos →' }).click();

    await expect(page).toHaveURL(/\/projeto-1$/);
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Projeto 1');
  });

  test('"// Fale comigo →" leva ao Contato', async ({ page }) => {
    await abrir(page, '/');

    await page.getByRole('link', { name: '// Fale comigo →' }).click();

    await expect(page).toHaveURL(/\/contato$/);
  });

  test('os atalhos são os últimos itens do código e se alcançam pelo teclado', async ({ page }) => {
    await abrir(page, '/');
    const projetos = page.getByRole('link', { name: '// Próximo: ver os projetos →' });

    await projetos.focus();
    await expect(projetos).toBeFocused();
    await page.keyboard.press('Enter');

    await expect(page).toHaveURL(/\/projeto-1$/);
  });
});

test.describe('Próximo arquivo', () => {
  test.use({ viewport: DESKTOP });

  test('cada seção termina com "// Próximo: <Arquivo>.java →" para a seguinte na ordem da árvore; a última não tem', async ({
    page,
  }) => {
    await abrirHidratada(page, '/sobre-mim');
    await abrirPastas(page);
    const ordem = await arvoreDeSecoes(page)
      .locator('a[href]')
      .evaluateAll((els) => els.map((el) => el.getAttribute('href') ?? ''));
    expect(ordem.length).toBeGreaterThan(10);

    for (const [i, rota] of ordem.entries()) {
      await page.goto(rota);
      const proximo = page.locator('app-proximo-arquivo a');
      if (i === ordem.length - 1) {
        await expect(proximo, `${rota} é a última`).toHaveCount(0);
      } else {
        await expect(proximo, rota).toHaveAttribute('href', ordem[i + 1]);
        await expect(proximo, rota).toHaveText(/^\/\/ Próximo: \S+\.java →$/);
      }
    }
  });

  test('depois de Sobre Mim, ativar o próximo arquivo abre Diferenciais', async ({ page }) => {
    await abrirHidratada(page, '/sobre-mim');

    await page.getByRole('link', { name: /^\/\/ Próximo: Diferenciais\.java →$/ }).click();

    await expect(page).toHaveURL(/\/diferenciais$/);
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Diferenciais');
  });

  test('o Início não tem "Próximo arquivo" (tem os atalhos) e o link está no HTML sem JavaScript', async ({
    browser,
  }) => {
    const contexto = await browser.newContext({ javaScriptEnabled: false });
    const pagina = await contexto.newPage();

    await pagina.goto('/sobre-mim');
    await expect(pagina.locator('app-proximo-arquivo a')).toHaveAttribute('href', '/diferenciais');
    await pagina.goto('/');
    await expect(pagina.locator('app-proximo-arquivo a')).toHaveCount(0);
    await contexto.close();
  });
});

test.describe('Code vision nos projetos com site', () => {
  test.use({ viewport: DESKTOP });

  for (const projeto of ['projeto-5', 'projeto-6']) {
    test(`/${projeto}: o botão "▶ Executar · Ver o site ao vivo" fica acima da classe e abre o preview`, async ({
      page,
    }) => {
      await abrir(page, `/${projeto}`);
      const botao = page.getByRole('button', { name: /Ver o site ao vivo/ });

      await expect(botao).toBeVisible();
      await expect(botao).toContainText('Executar · Ver o site ao vivo');
      const classe = (await page
        .locator('main code > .linha', { hasText: 'public class' })
        .boundingBox())!;
      const visao = (await botao.boundingBox())!;
      expect(visao.y + visao.height).toBeLessThanOrEqual(classe.y + 1);

      await botao.click();

      await expect(page.getByRole('dialog')).toBeVisible();
    });
  }

  test('as seções sem site não têm o code vision', async ({ page }) => {
    for (const rota of ['/projeto-4', '/projeto-1', '/sobre-mim']) {
      await abrir(page, rota);
      await expect(page.getByRole('button', { name: /Ver o site ao vivo/ }), rota).toHaveCount(0);
    }
  });

  test('o code vision não tem número de linha e tem o foco visível no teclado', async ({
    page,
  }) => {
    await abrir(page, '/projeto-5');
    const botao = page.getByRole('button', { name: /Ver o site ao vivo/ });

    await botao.focus();

    await expect(botao).toBeFocused();
    expect(await botao.evaluate((el) => getComputedStyle(el).outlineStyle)).not.toBe('none');
    const numeroDaVisao = await page.evaluate(() => {
      const visao = document.querySelector('main .visao-de-codigo')!.getBoundingClientRect();
      const meio = visao.top + visao.height / 2;
      const faixa = [...document.querySelectorAll('main .numeros span')].find((el) => {
        const c = el.getBoundingClientRect();
        return c.top <= meio && meio < c.bottom;
      });
      return (faixa?.textContent ?? '').trim();
    });
    expect(numeroDaVisao, 'a linha do code vision fica sem número').toBe('');
  });
});

test.describe('Contato: cara de link, alvo de toque e Copiar e-mail', () => {
  const contatos = (page: Page): Locator => page.locator('main code a');

  test('os contatos parecem links: sublinhado pontilhado e ↗ só nos externos', async ({ page }) => {
    await abrir(page, '/contato');
    const links = contatos(page);

    await expect(links).toHaveCount(4);
    for (const link of await links.all()) {
      expect(await link.evaluate((el) => getComputedStyle(el).textDecorationLine)).toContain(
        'underline',
      );
      expect(await link.evaluate((el) => getComputedStyle(el).textDecorationStyle)).toBe('dotted');
    }
    const seta = (i: number) =>
      links.nth(i).evaluate((el) => getComputedStyle(el, '::after').content);
    expect(await seta(0)).not.toContain('↗');
    expect(await seta(1)).not.toContain('↗');
    expect(await seta(2)).toContain('↗');
    expect(await seta(3)).toContain('↗');
  });

  test('no desktop cada contato tem pelo menos 24 px de área de toque', async ({ page }) => {
    await page.setViewportSize(DESKTOP);
    await abrir(page, '/contato');

    for (const link of await contatos(page).all()) {
      const caixa = (await link.boundingBox())!;
      expect(caixa.height).toBeGreaterThanOrEqual(24);
    }
  });

  test('no celular cada contato tem pelo menos 44 px de altura de toque e o axe não acusa target-size', async ({
    page,
  }) => {
    await page.setViewportSize(CELULAR);
    await abrir(page, '/contato');

    for (const link of await contatos(page).all()) {
      const caixa = (await link.boundingBox())!;
      expect(caixa.height).toBeGreaterThanOrEqual(44);
    }
    const { violations } = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag22aa'])
      .analyze();
    expect(
      violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(' ')).join(' | ')}`),
    ).toEqual([]);
  });

  test('"Copiar e-mail" copia o endereço e anuncia "E-mail copiado"', async ({ page, context }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    await abrir(page, '/contato');

    await page.getByRole('button', { name: 'Copiar e-mail' }).click();

    await expect(page.getByText('E-mail copiado')).toBeAttached();
    expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(
      'viniciusmassuncao@gmail.com',
    );
    const viva = page.locator('main [aria-live]').filter({ hasText: 'E-mail copiado' });
    await expect(viva).toHaveAttribute('aria-live', /polite|assertive/);
  });

  test('"Copiar e-mail" se usa só com o teclado e tem alvo de toque de 44 px no celular', async ({
    page,
    context,
  }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    await page.setViewportSize(CELULAR);
    await abrir(page, '/contato');
    const botao = page.getByRole('button', { name: 'Copiar e-mail' });

    expect((await botao.boundingBox())!.height).toBeGreaterThanOrEqual(44);
    await botao.focus();
    await page.keyboard.press('Enter');

    await expect(page.getByText('E-mail copiado')).toBeAttached();
  });

  test('sem a Clipboard API o botão não aparece e a página segue funcionando', async ({ page }) => {
    await page.addInitScript(() => {
      Object.defineProperty(navigator, 'clipboard', { value: undefined, configurable: true });
    });
    await abrir(page, '/contato');

    await expect(page.getByRole('button', { name: 'Copiar e-mail' })).toHaveCount(0);
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Contato');
    await expect(contatos(page)).toHaveCount(4);
  });
});

test.describe('Celular sem corte horizontal (390x844)', () => {
  test.use({ viewport: CELULAR });

  test('o Projeto 5 mostra o endereço do site e as descrições inteiros, sem rolagem horizontal', async ({
    page,
  }) => {
    await abrir(page, '/projeto-5');

    const site = page.locator('main code a', { hasText: 'https://www.drajulianamaluhy.com/' });
    await expect(site).toBeVisible();
    const caixa = (await site.boundingBox())!;
    expect(caixa.x).toBeGreaterThanOrEqual(0);
    expect(caixa.x + caixa.width).toBeLessThanOrEqual(CELULAR.width);
    const cortadas = await page
      .locator('main code > .linha')
      .evaluateAll((els) =>
        els.filter((el) => el.scrollWidth > el.clientWidth + 1).map((el) => el.textContent),
      );
    expect(cortadas, 'nenhuma linha com texto cortado').toEqual([]);
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth),
    ).toBe(true);
  });

  test('o código quebra linha com recuo pendurado em vez de cortar', async ({ page }) => {
    await abrir(page, '/projeto-4');

    const estilo = await page
      .locator('main code > .linha', { hasText: 'tarefas' })
      .first()
      .evaluate((el) => {
        const cs = getComputedStyle(el);
        return { espaco: cs.whiteSpace, quebra: cs.overflowWrap, recuo: cs.textIndent };
      });

    expect(estilo.espaco).toMatch(/pre-wrap|break-spaces|normal/);
    expect(estilo.recuo, 'recuo pendurado: texto-indent negativo').toMatch(/^-/);
  });

  test('nenhuma página rola na horizontal no celular', async ({ page }) => {
    for (const rota of [
      '/',
      '/sobre-mim',
      '/skills',
      '/skills/3',
      '/experiencias',
      '/certificacoes',
      '/projeto-4',
      '/projeto-5',
      '/projeto-6',
      '/projeto-1',
      '/depoimentos',
      '/contato',
      '/repositorio',
    ]) {
      await page.goto(rota);
      await expect(page.getByRole('heading', { level: 1 })).toBeAttached();
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth),
        rota,
      ).toBe(true);
    }
  });
});

test.describe('Limite de 5 abas', () => {
  test.use({ viewport: DESKTOP });
  const abas = (page: Page) => page.getByRole('tab');

  test('abrir uma sexta seção fecha a aba usada há mais tempo, nunca a ativa', async ({ page }) => {
    await abrirHidratada(page, '/');
    await abrirPastas(page);
    for (const secao of ['Sobre Mim', 'Diferenciais', 'Skills / STACK', 'Experiências']) {
      await arquivoDaArvore(page, secao).click();
    }
    await expect(abas(page)).toHaveCount(5);
    // Reusa a primeira (Início): a mais antiga passa a ser Sobre Mim.
    await abas(page).filter({ hasText: 'PortfolioApplication.java' }).click();
    await expect(page).toHaveURL(/\/$/);

    await arquivoDaArvore(page, 'Formação').click();

    await expect(page).toHaveURL(/\/formacao$/);
    await expect(abas(page)).toHaveCount(5);
    await expect(abas(page).filter({ hasText: 'SobreMim.java' })).toHaveCount(0);
    await expect(abas(page).filter({ hasText: 'PortfolioApplication.java' })).toHaveCount(1);
    await expect(abas(page).filter({ hasText: 'Formacao.java' })).toHaveAttribute(
      'aria-selected',
      'true',
    );
  });

  test('nunca passa de 5 abas, por mais seções que se abram', async ({ page }) => {
    await abrirHidratada(page, '/');
    await abrirPastas(page);
    for (const secao of [
      'Sobre Mim',
      'Diferenciais',
      'Skills / STACK',
      'Experiências',
      'Formação',
      'Idiomas',
      'Contato',
    ]) {
      await arquivoDaArvore(page, secao).click();
      expect(await abas(page).count()).toBeLessThanOrEqual(5);
    }
    await expect(abas(page).filter({ hasText: 'Contato.java' })).toHaveAttribute(
      'aria-selected',
      'true',
    );
  });
});

test.describe('Ícones decorativos discretos', () => {
  test.use({ viewport: DESKTOP });

  test('são mais apagados que os botões reais e não mudam ao passar o mouse', async ({ page }) => {
    await abrirHidratada(page, '/skills');
    const decorativo = page.locator('app-barra-de-ferramentas .decorativo').first();
    const real = page.getByRole('button', { name: 'Buscar seção (Ctrl+P)' });
    const medir = (alvo: Locator) =>
      alvo.evaluate((el) => {
        const cs = getComputedStyle(el);
        const icone = el.querySelector('app-icone') ?? el;
        return {
          fundo: cs.backgroundColor,
          opacidade: Number(getComputedStyle(icone).opacity) * Number(cs.opacity),
          cursor: cs.cursor,
        };
      });

    const antes = await medir(decorativo);
    await decorativo.hover();
    const depois = await medir(decorativo);
    const realMedido = await medir(real);

    expect(antes.opacidade).toBeLessThan(realMedido.opacidade);
    expect(depois).toEqual(antes);
    expect(antes.cursor).not.toBe('pointer');
  });
});

for (const [nomeDaTela, viewport] of [
  ['desktop', DESKTOP],
  ['celular', CELULAR],
] as const) {
  test.describe(`Acessibilidade (axe, WCAG 2 A e AA) das melhorias no ${nomeDaTela}`, () => {
    test.use({ viewport });

    for (const tema of ['dark', 'light'] as const) {
      for (const rota of ['/', '/sobre-mim', '/depoimentos', '/projeto-5', '/contato']) {
        test(`${rota} passa no axe sem exclusões (${tema}, modo de leitura)`, async ({ page }) => {
          await page.emulateMedia({ colorScheme: tema, reducedMotion: 'reduce' });
          await abrir(page, rota);

          const { violations } = await new AxeBuilder({ page })
            .withTags(['wcag2a', 'wcag2aa'])
            .analyze();

          expect(
            violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(' ')).join(' | ')}`),
          ).toEqual([]);
        });
      }

      test(`/sobre-mim e /depoimentos passam no axe com o comentário cru (${tema})`, async ({
        page,
      }) => {
        await page.emulateMedia({ colorScheme: tema, reducedMotion: 'reduce' });
        for (const rota of ['/sobre-mim', '/depoimentos']) {
          await abrir(page, rota, 'cru');
          await expect(javadoc(page)).toHaveAttribute('data-modo', 'cru');

          const { violations } = await new AxeBuilder({ page })
            .withTags(['wcag2a', 'wcag2aa'])
            .analyze();

          expect(
            violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(' ')).join(' | ')}`),
            rota,
          ).toEqual([]);
        }
      });
    }
  });
}
