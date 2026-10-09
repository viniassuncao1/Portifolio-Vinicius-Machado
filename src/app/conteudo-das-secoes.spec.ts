import { CONTEUDOS_CERTIFICACOES } from './features/certificacoes/certificacoes.conteudo';
import { CONTEUDO_COMO_USO_IA } from './features/como-uso-ia/como-uso-ia.conteudo';
import { CONTEUDO_CONTATO } from './features/contato/contato.conteudo';
import { CONTEUDO_DIFERENCIAIS } from './features/diferenciais/diferenciais.conteudo';
import { CONTEUDO_EVENTOS } from './features/eventos/eventos.conteudo';
import { CONTEUDOS_EXPERIENCIAS } from './features/experiencias/experiencias.conteudo';
import { CONTEUDO_FORMACAO } from './features/formacao/formacao.conteudo';
import { CONTEUDO_IDIOMAS } from './features/idiomas/idiomas.conteudo';
import { CONTEUDO_INICIO } from './features/inicio/inicio.conteudo';
import { CONTEUDOS_SKILLS } from './features/skills/skills.conteudo';
import { CONTEUDO_SOBRE_MIM } from './features/sobre-mim/sobre-mim.conteudo';
import type { ConteudoDoEditor } from './shared/editor-de-codigo/conteudo';
import { DOCUMENTOS, aspasRetas, codigoDe, literaisDe, textoDe } from './conteudo-das-secoes.apoio';

const PARES: Readonly<Record<string, string>> = { ')': '(', '}': '{', ']': '[' };

/** Diz se (), {} e [] fecham na ordem certa e terminam zerados; devolve o problema ou `null`. */
function problemaDeBalanceamento(codigo: string): string | null {
  const abertos: string[] = [];
  for (const [posicao, caractere] of Array.from(codigo).entries()) {
    if ('({['.includes(caractere)) abertos.push(caractere);
    if (caractere in PARES && abertos.pop() !== PARES[caractere]) {
      return `"${caractere}" sem abertura correspondente (posição ${posicao})`;
    }
  }
  return abertos.length ? `sobraram abertos: ${abertos.join(' ')}` : null;
}

describe('conteúdo das seções em Java moderno', () => {
  it('cobre as 17 páginas das 11 seções (Início, Skills, Experiências e Certificações paginadas)', () => {
    expect(DOCUMENTOS).toHaveLength(17);
    expect(DOCUMENTOS.map(([nome]) => nome)).toEqual(
      expect.arrayContaining(['Skills 3/3', 'Experiências 3/3', 'Certificações 3/3']),
    );
  });

  describe('Java sintaticamente plausível', () => {
    it.each(DOCUMENTOS)('%s: chaves, parênteses e colchetes balanceados', (_nome, conteudo) => {
      expect(problemaDeBalanceamento(codigoDe(conteudo))).toBeNull();
    });

    it('o verificador acusa código desbalanceado', () => {
      expect(problemaDeBalanceamento('class A { void f( {')).not.toBeNull();
      expect(problemaDeBalanceamento('f(}')).not.toBeNull();
      expect(problemaDeBalanceamento('class A {}')).toBeNull();
    });

    it.each(DOCUMENTOS)(
      '%s: declara ao menos um tipo (class, record, interface ou enum)',
      (_n, c) => {
        expect(codigoDe(c)).toMatch(/\b(class|record|interface|enum)\s+[A-Z]\w*/);
      },
    );

    it.each(DOCUMENTOS)(
      '%s: todo import termina em ponto e vírgula e vem antes dos tipos',
      (_n, c) => {
        const linhas = codigoDe(c)
          .split('\n')
          .map((l) => l.trim());
        const imports = linhas.filter((l) => l.startsWith('import '));
        const primeiroTipo = linhas.findIndex((l) => /\b(class|record|interface|enum)\b/.test(l));
        const ultimoImport = linhas.reduce((u, l, i) => (l.startsWith('import ') ? i : u), -1);

        imports.forEach((i) => expect(i).toMatch(/^import [\w.]+;$/));
        expect(ultimoImport).toBeLessThan(primeiroTipo);
      },
    );

    it.each(DOCUMENTOS)('%s: sem arrays String[] (listas usam List.of)', (_n, c) => {
      expect(textoDe(c)).not.toContain('String[]');
    });

    it('só o Início declara o pacote portfolio.viniciusmachado', () => {
      const comPacote = DOCUMENTOS.filter(([, c]) => /^package /m.test(codigoDe(c))).map(
        ([n]) => n,
      );

      expect(comPacote).toEqual(['Início']);
      expect(codigoDe(CONTEUDO_INICIO)).toContain('package portfolio.viniciusmachado;');
    });
  });

  describe('convenções de mercado', () => {
    const declaracoes = (c: ConteudoDoEditor) =>
      Array.from(codigoDe(c).matchAll(/\b(?:class|record|interface|enum)\s+(\w+)/g), (m) => m[1]);

    it.each(DOCUMENTOS)('%s: tipos em PascalCase', (_n, c) => {
      declaracoes(c).forEach((nome) => expect(nome).toMatch(/^[A-Z][A-Za-z0-9]*$/));
    });

    it.each(DOCUMENTOS)('%s: constantes static final em UPPER_SNAKE_CASE', (_n, c) => {
      const constantes = Array.from(
        codigoDe(c).matchAll(/static final\s+[\w<>, ]+?\s+(\w+)\s*=/g),
        (m) => m[1],
      );

      constantes.forEach((nome) => expect(nome).toMatch(/^[A-Z][A-Z0-9_]*$/));
    });

    it('os campos do Diferenciais estão em inglês: city, extrovert, curious', () => {
      const texto = textoDe(CONTEUDO_DIFERENCIAIS);

      for (const campo of ['String city', 'boolean extrovert', 'boolean curious']) {
        expect(texto).toContain(campo);
      }
    });

    it('a cidade é "Brasília" no campo city, e o texto do leitor fica em pt-BR', () => {
      expect(literaisDe(CONTEUDO_DIFERENCIAIS)).toContain('"Brasília"');
      expect(textoDe(CONTEUDO_DIFERENCIAIS)).toContain('Moro em Brasília há 20 anos.');
    });
  });

  describe('Java moderno', () => {
    it('listas de tecnologias usam List.of, no Início e em Skills', () => {
      for (const c of [CONTEUDO_INICIO, ...CONTEUDOS_SKILLS]) {
        expect(textoDe(c)).toContain('List.of(');
      }
    });

    it('períodos e anos aparecem como texto e número simples, sem java.time avançado', () => {
      for (const [nome, c] of DOCUMENTOS) {
        expect(codigoDe(c), nome).not.toMatch(/\b(YearMonth|Year|Period)\b/);
      }
      expect(textoDe(CONTEUDOS_EXPERIENCIAS[0])).toContain('"08/2026 - Presente"');
      expect(textoDe(CONTEUDO_FORMACAO)).toMatch(/\b2027\b/);
    });

    it('usa records para dados em todas as seções que guardam um registro', () => {
      const comRecord: readonly (readonly [string, ConteudoDoEditor])[] = [
        ['Início', CONTEUDO_INICIO],
        ['Skills 1', CONTEUDOS_SKILLS[0]],
        ['Skills 3', CONTEUDOS_SKILLS[2]],
        ['Experiências 1', CONTEUDOS_EXPERIENCIAS[0]],
        ['Eventos', CONTEUDO_EVENTOS],
        ['Formação', CONTEUDO_FORMACAO],
        ['Contato', CONTEUDO_CONTATO],
        ['Certificações 1', CONTEUDOS_CERTIFICACOES[0]],
      ];

      for (const [nome, c] of comRecord) {
        expect(codigoDe(c), nome).toMatch(/\brecord\s+[A-Z]\w*\s*\(/);
      }
    });

    it('os Idiomas usam constantes simples, sem Map.of nem enum', () => {
      const codigo = codigoDe(CONTEUDO_IDIOMAS);

      expect(codigo).not.toContain('Map.of');
      expect(codigo).not.toMatch(/\benum\b/);
      expect(codigo).toMatch(/static final\s+String\s+\w+\s*=/);
    });

    it('textos longos vão em Javadoc (Sobre Mim, Diferenciais, IA, Experiências)', () => {
      for (const c of [
        CONTEUDO_SOBRE_MIM,
        CONTEUDO_DIFERENCIAIS,
        CONTEUDO_COMO_USO_IA,
        ...CONTEUDOS_EXPERIENCIAS,
      ]) {
        expect(c.filter((item) => item.tipo === 'javadoc')).toHaveLength(1);
      }
    });
  });

  describe('informações preservadas', () => {
    it('Início: pacote, cargo e a stack Java, Spring Boot, Angular e SQL', () => {
      expect(literaisDe(CONTEUDO_INICIO).map(aspasRetas)).toEqual([
        'Full Stack Júnior',
        'Java',
        'Spring Boot',
        'Angular',
        'SQL',
      ]);
    });

    it('Sobre Mim: todas as informações do parágrafo da tela 02', () => {
      const texto = textoDe(CONTEUDO_SOBRE_MIM);

      for (const trecho of [
        'cerca de 2 anos de experiência',
        'Java, Spring Boot, Angular e SQL',
        'sistemas críticos de produção',
        'Lidero um squad na Memora Processos Inovadores',
        'Scrum, com dailies, previsões de conclusão e reviews',
        'co-fundador da Watts Company, agência de automação e IA',
        'sistemas de CRM e agentes de IA para atendimento',
        'Ciência da Computação no UniCEUB',
        'Engenharia de Software, Sistemas Distribuídos e Arquitetura de Software.',
      ]) {
        expect(texto, trecho).toContain(trecho);
      }
    });

    it('Diferenciais: origem, cidade, 20 anos, traços e o texto da tela 03', () => {
      const texto = textoDe(CONTEUDO_DIFERENCIAIS);

      for (const trecho of [
        '"Mineiro"',
        '"Brasília"',
        'mineiro, extrovertido, curioso',
        'uma boa discussão',
        'back-end ou front-end',
        'encarar o que aparecer pela frente.',
      ]) {
        expect(texto, trecho).toContain(trecho);
      }
      const valores = CONTEUDO_DIFERENCIAIS.flatMap((i) =>
        i.tipo === 'codigo' ? i.trechos : [],
      ).filter((t) => t.papel === 'valor');

      expect(valores.filter((t) => t.texto === 'true')).toHaveLength(3);
      expect(valores.map((t) => t.texto)).toContain('20');
    });

    it('Como uso a IA: modismo, Ana, WhatsApp, Claude Code, Codex e SDD', () => {
      const texto = textoDe(CONTEUDO_COMO_USO_IA);

      for (const trecho of [
        'Não vejo IA como modismo',
        'Watts Company',
        'a Ana, por exemplo, atende pacientes de uma clínica pelo WhatsApp',
        'Claude Code e Codex',
        'SDD (Spec-Driven Development)',
        'parte de como eu planejo e entrego código.',
      ]) {
        expect(texto, trecho).toContain(trecho);
      }
      expect(texto).toMatch(/boolean\s+\w+\s*=\s*false;/);
      expect(texto).toMatch(/boolean\s+\w+\s*=\s*true;/);
    });

    it('Skills página 1: as 11 tecnologias das linguagens, frameworks e bancos', () => {
      expect(literaisDe(CONTEUDOS_SKILLS[0]).map(aspasRetas)).toEqual([
        'Java',
        'TypeScript',
        'JavaScript',
        'PHP',
        'SQL',
        'Spring Boot',
        'Spring Data JPA',
        'Angular',
        'Oracle',
        'PostgreSQL',
        'MySQL',
      ]);
    });

    it('Skills página 2: as 9 tecnologias de cloud, infraestrutura e ferramentas', () => {
      expect(literaisDe(CONTEUDOS_SKILLS[1]).map(aspasRetas)).toEqual([
        'Docker',
        'Kubernetes',
        'Nginx',
        'AWS',
        'Azure',
        'Git',
        'GitLab CI/CD',
        'Grafana',
        'Scrum',
      ]);
    });

    it('Skills página 3: os quatro níveis com descrição e as 15 tecnologias', () => {
      const texto = textoDe(CONTEUDOS_SKILLS[2]);

      for (const nivel of [
        'Domínio diário',
        'Projeto completo',
        'Uso pontual',
        'Conhecimento teórico',
      ]) {
        expect(texto, nivel).toContain(nivel);
      }
      expect(literaisDe(CONTEUDOS_SKILLS[2]).map(aspasRetas)).toEqual(
        expect.arrayContaining([
          ...['Java', 'Spring Boot', 'Angular', 'PostgreSQL', 'Oracle', 'TypeScript', 'Git'],
          'PHP',
          ...['React Native', 'CI/CD'],
          ...['Python', 'AWS', 'Azure', 'Docker', 'Kubernetes'],
        ]),
      );
    });

    it('Experiências: empresa, cargo e período de cada página', () => {
      const [memora, estagio, watts] = CONTEUDOS_EXPERIENCIAS.map(textoDe);

      expect(memora).toContain('"Memora"');
      expect(memora).toContain('"Desenvolvedor Full Stack Júnior"');
      expect(memora).toContain('"08/2026 - Presente"');
      expect(estagio).toContain('"Memora"');
      expect(estagio).toContain('"Estagiário de Desenvolvimento"');
      expect(estagio).toContain('"08/2025 - 07/2026"');
      expect(watts).toContain('"Watts Company"');
      expect(watts).toContain('"Co-fundador & Desenvolvedor Full Stack"');
      expect(watts).toContain('"02/2025 - Presente"');
    });

    it('Experiências 1: liderança de squad e Scrum', () => {
      const texto = textoDe(CONTEUDOS_EXPERIENCIAS[0]);

      for (const trecho of [
        'Liderança de squad',
        'dailies, previsões de conclusão e reviews',
        'próprias demandas do squad',
      ]) {
        expect(texto, trecho).toContain(trecho);
      }
    });

    it('Experiências 2: Sankhya, Oracle para PostgreSQL, Playwright, Coren, Sanesul e AyoForms', () => {
      const texto = textoDe(CONTEUDOS_EXPERIENCIAS[1]);

      for (const trecho of [
        'Sankhya',
        'pagamento de colaboradores',
        'Oracle para PostgreSQL',
        'scrapers em Java com Playwright',
        'Coren e Sanesul',
        'AyoForms',
        'PHP e MySQL',
        'Google Workspace e Microsoft Azure',
      ]) {
        expect(texto, trecho).toContain(trecho);
      }
    });

    it('Experiências 3: agência, CRM, agentes de IA, painel da clínica, Vercel e n8n', () => {
      const texto = textoDe(CONTEUDOS_EXPERIENCIAS[2]);

      for (const trecho of [
        'agência de automação e IA',
        'sistemas de CRM e agentes de IA',
        'painel de gestão completo para uma clínica (agenda, pacientes, financeiro)',
        'deploy contínuo via Vercel',
        'n8n',
        'qualificação de leads',
      ]) {
        expect(texto, trecho).toContain(trecho);
      }
    });

    it('Eventos: os três eventos e a Campus Party com duas participações', () => {
      const texto = textoDe(CONTEUDO_EVENTOS);

      expect(literaisDe(CONTEUDO_EVENTOS).map(aspasRetas)).toEqual([
        'Brasília IT',
        'Campus Party Brasília',
        'BB Digital Week',
      ]);
      expect(texto).toContain('new Event("Campus Party Brasília", 2),  // 2x');
      expect(texto).toContain('new Event("Brasília IT", 1),');
      expect(texto).toContain('new Event("BB Digital Week", 1)');
      expect(texto).not.toContain('// 1x');
    });

    it('Formação: UniCEUB, bacharelado em Ciência da Computação e 2027', () => {
      expect(literaisDe(CONTEUDO_FORMACAO).map(aspasRetas)).toEqual([
        'UniCEUB',
        'Bacharelado em Ciência da Computação',
      ]);
      expect(codigoDe(CONTEUDO_FORMACAO)).toMatch(/\b2027\b/);
    });

    it('Idiomas: inglês e espanhol, ambos em nível básico', () => {
      const codigo = codigoDe(CONTEUDO_IDIOMAS);

      expect(codigo).toMatch(/english/i);
      expect(codigo).toMatch(/spanish/i);
      expect(literaisDe(CONTEUDO_IDIOMAS).map(aspasRetas)).toEqual(['Básico', 'Básico']);
    });

    it('Contato: e-mail, telefone, LinkedIn e GitHub, todos como links reais', () => {
      const links = CONTEUDO_CONTATO.flatMap((i) => (i.tipo === 'codigo' ? i.trechos : []))
        .filter((t) => t.href)
        .map((t) => [aspasRetas(t.texto), t.href]);

      expect(links).toEqual([
        ['viniciusmassuncao@gmail.com', 'mailto:viniciusmassuncao@gmail.com'],
        ['+55 61 98283-7805', 'tel:+5561982837805'],
        ['linkedin.com/in/viniassuncao', 'https://linkedin.com/in/viniassuncao'],
        ['github.com/viniassuncao1', 'https://github.com/viniassuncao1'],
      ]);
    });
  });
});
