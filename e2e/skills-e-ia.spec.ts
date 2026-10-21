import { expect, test } from './fixtures';
import type { Locator, Page } from '@playwright/test';

import { arquivoDaArvore, linhasDoCodigo, normalizar } from './apoio';

const COR_VALOR = 'rgb(42, 172, 184)';
const COR_LITERAL = 'rgb(106, 171, 115)';
const COR_DECLARACAO = 'rgb(199, 125, 186)';

const cor = (alvo: Locator) => alvo.evaluate((el) => getComputedStyle(el).color);

const codigo = (page: Page) => page.locator('main code');
const controle = (page: Page) => page.getByRole('navigation', { name: 'Páginas da seção' });

test.describe('Como uso a IA (/como-uso-ia)', () => {
  test('exibe a classe InteligenciaArtificial com os campos em Java moderno', async ({ page }) => {
    await page.goto('/como-uso-ia');

    expect(await linhasDoCodigo(page)).toEqual([
      'package dev.vinicius.portfolio.sobre;',
      'import java.util.List;',
      'public class InteligenciaArtificial {',
      expect.stringMatching(/^\/\/ .+/),
      'boolean modismo = false;',
      'boolean parteDoTrabalho = true;',
      expect.stringMatching(/^\/\/ .+/),
      'List<String> ferramentas = List.of("Claude Code", "Codex");',
      'String metodologia = "SDD (Spec-Driven Development)";',
      '}',
    ]);
  });

  test('começa e termina o Javadoc com os textos da spec', async ({ page }) => {
    await page.goto('/como-uso-ia');

    const texto = normalizar(await page.locator('main .javadoc').textContent());

    expect(texto.startsWith('Não vejo IA como modismo')).toBe(true);
    expect(texto.endsWith('parte de como eu planejo e entrego código.')).toBe(true);
  });

  test('preserva a Ana, o WhatsApp, o Claude Code, o Codex e o SDD', async ({ page }) => {
    await page.goto('/como-uso-ia');
    const bloco = page.locator('main .javadoc');

    for (const trecho of [
      'Watts Company',
      'a Ana, por exemplo, atende pacientes de uma clínica pelo WhatsApp',
      'Claude Code e Codex com metodologia SDD (Spec-Driven Development)',
    ]) {
      await expect(bloco).toContainText(trecho);
    }
  });

  test('colore false e true com a cor de valor e os campos booleanos como declaração', async ({
    page,
  }) => {
    await page.goto('/como-uso-ia');
    const valores = page.locator('main .papel-valor');

    await expect(valores).toHaveText(['false', 'true']);
    expect(await cor(valores.nth(0))).toBe(COR_VALOR);
    expect(await cor(valores.nth(1))).toBe(COR_VALOR);
    await expect(page.locator('main .papel-declaracao')).toHaveText([
      'boolean modismo',
      'boolean parteDoTrabalho',
    ]);
    expect(await cor(page.locator('main .papel-declaracao').first())).toBe(COR_DECLARACAO);
  });

  test('lista as ferramentas e a metodologia como textos entre aspas', async ({ page }) => {
    await page.goto('/como-uso-ia');

    await expect(page.locator('main .papel-literal')).toHaveText([
      '"Claude Code"',
      '"Codex"',
      '"SDD (Spec-Driven Development)"',
    ]);
  });

  test('tem o título, o h1 e a árvore com a seção atual', async ({ page }) => {
    await page.goto('/como-uso-ia');

    const item = arquivoDaArvore(page, 'Como uso a IA');

    await expect(page).toHaveTitle('Como uso a IA | Vinicius Machado');
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Como uso a IA');
    await expect(item).toHaveAttribute('aria-current', 'page');
  });

  test('não mostra controle de páginas', async ({ page }) => {
    await page.goto('/como-uso-ia');

    await expect(controle(page)).toHaveCount(0);
  });
});

test.describe('Skills / STACK (/skills): tudo num arquivo só', () => {
  const NIVEIS = [
    {
      nome: 'Domínio diário',
      descricao: 'uso todo dia no trabalho',
      tecnologias: [
        'Java',
        'Spring Boot',
        'Spring Security',
        'Angular',
        'PostgreSQL',
        'Oracle',
        'TypeScript',
        'Git',
      ],
    },
    {
      nome: 'Projeto completo',
      descricao: 'já entreguei um projeto inteiro com ela',
      tecnologias: ['PHP'],
    },
    {
      nome: 'Uso pontual',
      descricao: 'usei em tarefas isoladas',
      tecnologias: ['React Native', 'CI/CD', 'JUnit'],
    },
    {
      nome: 'Conhecimento teórico',
      descricao: 'estudei, mas ainda não usei em produção',
      tecnologias: ['Python', 'AWS', 'Azure', 'Docker', 'Kubernetes'],
    },
  ];

  test('exibe as listas imutáveis das telas 05 e 06 e os níveis, no mesmo arquivo', async ({
    page,
  }) => {
    await page.goto('/skills');

    expect(await linhasDoCodigo(page)).toEqual([
      'package dev.vinicius.portfolio.skills;',
      'import java.util.List;',
      'public class Skills {',
      '// Linguagens, frameworks e bancos de dados que uso',
      'record Tecnologias(',
      'List<String> linguagens,',
      'List<String> frameworks,',
      'List<String> bancosDeDados) {}',
      'Tecnologias principais = new Tecnologias(',
      'List.of("Java", "TypeScript", "JavaScript", "PHP", "SQL"),',
      'List.of("Spring Boot", "Spring Data JPA", "Spring Security", "Angular", "JUnit"),',
      'List.of("Oracle", "PostgreSQL", "MySQL")',
      ');',
      '// Nuvem, infraestrutura e ferramentas do dia a dia',
      'record Ferramentas(',
      'List<String> nuvemEInfra,',
      'List<String> ferramentas) {}',
      'Ferramentas doDiaADia = new Ferramentas(',
      'List.of("Docker", "Kubernetes", "Nginx", "AWS", "Azure"),',
      'List.of("Git", "GitLab CI/CD", "Grafana", "Scrum")',
      ');',
      '// Quanto conheço cada tecnologia',
      'enum NivelDeConhecimento {',
      'DominioDiario("Domínio diário: uso todo dia no trabalho"),',
      'ProjetoCompleto("Projeto completo: já entreguei um projeto inteiro com ela"),',
      'UsoPontual("Uso pontual: usei em tarefas isoladas"),',
      'ConhecimentoTeorico("Conhecimento teórico: estudei, mas ainda não usei em produção");',
      'String descricao;',
      'NivelDeConhecimento(String descricao) {',
      'this.descricao = descricao;',
      '}',
      '}',
      '// Tecnologias de cada nível',
      'record Habilidades(NivelDeConhecimento nivel, List<String> tecnologias) {}',
      'List<Habilidades> porNivel = List.of(',
      'new Habilidades(NivelDeConhecimento.DominioDiario,',
      'List.of("Java", "Spring Boot", "Spring Security", "Angular", "PostgreSQL",',
      '"Oracle", "TypeScript", "Git")),',
      'new Habilidades(NivelDeConhecimento.ProjetoCompleto, List.of("PHP")),',
      'new Habilidades(NivelDeConhecimento.UsoPontual, List.of("React Native", "CI/CD", "JUnit")),',
      'new Habilidades(NivelDeConhecimento.ConhecimentoTeorico,',
      'List.of("Python", "AWS", "Azure", "Docker", "Kubernetes")));',
      '}',
    ]);
  });

  test('não tem controle de páginas nem links de próxima/anterior', async ({ page }) => {
    await page.goto('/skills');

    await expect(controle(page)).toHaveCount(0);
    await expect(page.getByRole('link', { name: /Próxima página|Página anterior/ })).toHaveCount(0);
    await expect(page.locator('main')).not.toContainText(/\b\d\/3\b/);
  });

  test('colore os textos das listas como literais, sem papel de valor', async ({ page }) => {
    await page.goto('/skills');
    const literais = page.locator('main .papel-literal');

    expect(await literais.count()).toBeGreaterThanOrEqual(11);
    expect(await cor(literais.first())).toBe(COR_LITERAL);
    await expect(page.locator('main .papel-valor')).toHaveCount(0);
  });

  test('mostra os quatro níveis, cada um com a sua explicação em pt-BR e as tecnologias', async ({
    page,
  }) => {
    await page.goto('/skills');
    const texto = (await linhasDoCodigo(page)).join(' ');

    for (const { nome, descricao, tecnologias } of NIVEIS) {
      await expect(codigo(page)).toContainText(`${nome}: ${descricao}`);
      const lista = tecnologias.map((t) => `"${t}"`).join(', ');
      expect(texto, nome).toContain(`List.of(${lista}`);
    }
  });

  test('não usa Optional nem genérico aninhado', async ({ page }) => {
    await page.goto('/skills');
    const texto = (await codigo(page).textContent()) ?? '';

    expect(texto).not.toContain('Optional');
    expect(texto).not.toMatch(/<[^<>\n]*<[^<>\n]*>/);
  });

  test('tem título e h1 de Skills / STACK, sem (n/N), e a árvore com a seção atual', async ({
    page,
  }) => {
    await page.goto('/skills');

    await expect(page).toHaveTitle('Skills / STACK | Vinicius Machado');
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Skills / STACK');
    await expect(arquivoDaArvore(page, 'Skills / STACK')).toHaveAttribute('aria-current', 'page');
  });

  test('o fim do arquivo termina com o "Próximo" da seção seguinte', async ({ page }) => {
    await page.goto('/skills');

    await expect(page.locator('app-proximo-arquivo a')).toHaveAttribute('href', '/experiencias');
  });
});

test.describe('Skills: endereços antigos das páginas', () => {
  for (const antigo of ['/skills/2', '/skills/3']) {
    test(`${antigo} leva a /skills, com tudo no mesmo arquivo`, async ({ page }) => {
      await page.goto(antigo);

      await expect(page).toHaveURL(/\/skills$/);
      await expect(page).toHaveTitle('Skills / STACK | Vinicius Machado');
      await expect(codigo(page)).toContainText('record Ferramentas(');
      await expect(codigo(page)).toContainText('Conhecimento teórico');
    });
  }

  test('o botão voltar do navegador sai do site antigo sem ficar preso no redirecionamento', async ({
    page,
  }) => {
    await page.goto('/sobre-mim');
    await page.goto('/skills/3');
    await expect(page).toHaveURL(/\/skills$/);

    await page.goBack();

    await expect(page).toHaveURL(/\/sobre-mim$/);
  });

  test('uma página inexistente (/skills/9) também chega a /skills', async ({ page }) => {
    await page.goto('/skills/9');

    await expect(page).toHaveURL(/\/skills$/);
  });
});

test.describe('Sem JavaScript', () => {
  test.use({ javaScriptEnabled: false });

  test('/como-uso-ia entrega o código, os valores e o Javadoc no HTML', async ({ page }) => {
    await page.goto('/como-uso-ia');

    await expect(page.locator('main code')).toContainText('InteligenciaArtificial');
    await expect(page.locator('main .papel-valor')).toHaveText(['false', 'true']);
    await expect(page.locator('main .javadoc')).toContainText('Não vejo IA como modismo');
    await expect(arquivoDaArvore(page, 'Como uso a IA')).toHaveAttribute('aria-current', 'page');
  });

  test('/skills entrega os níveis no HTML, sem controle de páginas', async ({ page }) => {
    await page.goto('/skills');

    // Sem JavaScript o HTML traz o cartão: a stack como build.gradle, com os quatro níveis.
    await expect(page.locator('main .grupo')).toHaveCount(4);
    await expect(page.locator('main')).toContainText('Domínio diário');
    await expect(page.locator('main')).toContainText('Conhecimento teórico');
    await expect(controle(page)).toHaveCount(0);
    await expect(page).toHaveTitle('Skills / STACK | Vinicius Machado');
  });
});
