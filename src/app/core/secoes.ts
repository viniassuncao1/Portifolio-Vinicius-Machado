import type { NomeDoIcone } from '../shared/icone/icone';

/** Pacotes do projeto Spring que organiza as seções por assunto (ADR-0011). */
export type Pacote =
  'sobre' | 'skills' | 'experiencias' | 'projetos' | 'formacao' | 'recomendacoes' | 'contato';

export interface Secao {
  readonly slug: string;
  readonly titulo: string;
  readonly icone: NomeDoIcone;
  /** Nome do arquivo `.java` da seção, mostrado na aba, na barra de status e na busca. */
  readonly arquivo: string;
  /** Pacote Java da seção na árvore do projeto (ADR-0011). */
  readonly pacote: Pacote;
  /** Descrição da seção para quem recruta, com 80 a 160 caracteres: alimenta a meta description. */
  readonly descricao: string;
}

/** Seção da vitrine de projetos: a única que não é um arquivo de código (`/projetos`). */
export const SLUG_DA_VITRINE = 'projetos';

/** Fonte única das seções: dela saem os itens da árvore e as rotas, na ordem do design. */
export const SECOES: readonly Secao[] = [
  {
    slug: 'sobre-mim',
    titulo: 'Sobre Mim',
    icone: 'design-arquivo',
    arquivo: 'SobreMim.java',
    pacote: 'sobre',
    descricao:
      'Vinicius Machado, desenvolvedor Full Stack com cerca de 2 anos em Java 21, Spring Boot e Angular, com APIs em microsserviços e liderança de squad.',
  },
  {
    slug: 'diferenciais',
    titulo: 'Diferenciais',
    icone: 'design-arquivo',
    arquivo: 'Diferenciais.java',
    pacote: 'sobre',
    descricao:
      'Mineiro morando em Brasília há 20 anos, extrovertido e curioso, Vinicius gosta de aprender e encarar tanto back-end quanto front-end.',
  },
  {
    slug: 'como-uso-ia',
    titulo: 'Como uso a IA',
    icone: 'design-ia',
    arquivo: 'ComoUsoIA.java',
    pacote: 'sobre',
    descricao:
      'Como Vinicius usa IA no trabalho: agentes de IA na Watts Company e Claude Code e Codex com SDD (Spec-Driven Development) no dia a dia.',
  },
  {
    slug: 'skills',
    titulo: 'Skills / STACK',
    icone: 'design-ferramenta',
    arquivo: 'Skills.java',
    pacote: 'skills',
    descricao:
      'Stack de Vinicius Machado: Java, Spring Boot, Angular, TypeScript e SQL, com níveis de conhecimento por tecnologia.',
  },
  {
    slug: 'experiencias',
    titulo: 'Experiências',
    icone: 'design-arquivo',
    arquivo: 'Experiencias.java',
    pacote: 'experiencias',
    descricao:
      'Experiências de Vinicius: dev Full Stack e líder de squad na Memora, estagiário na Memora e co-fundador da Watts Company, agência de IA.',
  },
  {
    slug: 'projetos',
    titulo: 'Vitrine de projetos',
    icone: 'design-projeto',
    arquivo: 'Vitrine.java',
    pacote: 'projetos',
    descricao:
      'Vitrine dos seis projetos de Vinicius: cases da Memora, este portfólio, launcher de TV, o agente Ana e duas landing pages, com capturas e destaques.',
  },
  {
    slug: 'projeto-1',
    titulo: 'Projeto 1',
    icone: 'design-arquivo',
    arquivo: 'Projeto1.java',
    pacote: 'projetos',
    descricao:
      'Cases da Memora: migração de Oracle para PostgreSQL, scrapers em Java com Playwright (Coren e Sanesul) e o AyoForms em PHP e MySQL.',
  },
  {
    slug: 'projeto-2',
    titulo: 'Projeto 2',
    icone: 'design-arquivo',
    arquivo: 'Projeto2.java',
    pacote: 'projetos',
    descricao:
      'Este portfólio: um estudo de desenvolvimento com IA, com SDD no OpenSpec, as skills do ECC e uma equipe de agentes no Maestri.',
  },
  {
    slug: 'projeto-3',
    titulo: 'Projeto 3',
    icone: 'design-arquivo',
    arquivo: 'Projeto3.java',
    pacote: 'projetos',
    descricao:
      'Launcher de TV em Java: fork do CleanYourTV levado do Android 8 para o Android 4.4, com 42 testes passando, numa TV Philco.',
  },
  {
    slug: 'projeto-4',
    titulo: 'Projeto 4',
    icone: 'design-arquivo',
    arquivo: 'Projeto4.java',
    pacote: 'projetos',
    descricao:
      'Ana, agente de IA em n8n que atende pacientes de uma fisioterapeuta pelo WhatsApp, e o painel CRM em React feito com Claude Code e SDD.',
  },
  {
    slug: 'projeto-5',
    titulo: 'Projeto 5',
    icone: 'design-arquivo',
    arquivo: 'Projeto5.java',
    pacote: 'projetos',
    descricao:
      'Landing page em HTML e JavaScript da Dra. Juliana Maluhy, com design autoral e foco em conversão, levando o visitante ao WhatsApp.',
  },
  {
    slug: 'projeto-6',
    titulo: 'Projeto 6',
    icone: 'design-arquivo',
    arquivo: 'Projeto6.java',
    pacote: 'projetos',
    descricao:
      'Landing page em React da Watts Company, agência de automação e IA, com foco em conversão de leads e diagnóstico gratuito.',
  },
  {
    slug: 'certificacoes',
    titulo: 'Certificações',
    icone: 'design-arquivo',
    arquivo: 'Certificacoes.java',
    pacote: 'formacao',
    descricao:
      'Certificações de Vinicius em Spring Boot, Spring Data JPA, Angular, TypeScript, HTTP, Git, GitHub e Python, com horas e data de conclusão.',
  },
  {
    slug: 'eventos',
    titulo: 'Eventos',
    icone: 'design-projeto',
    arquivo: 'Eventos.java',
    pacote: 'formacao',
    descricao:
      'Eventos de tecnologia de que Vinicius participou: Brasília IT, Campus Party Brasília (2 vezes) e BB Digital Week.',
  },
  {
    slug: 'formacao',
    titulo: 'Formação',
    icone: 'design-globo',
    arquivo: 'Formacao.java',
    pacote: 'formacao',
    descricao:
      'Formação de Vinicius: Bacharelado em Ciência da Computação no UniCEUB, com formatura prevista para 2027.',
  },
  {
    slug: 'idiomas',
    titulo: 'Idiomas',
    icone: 'design-executar',
    arquivo: 'Idiomas.java',
    pacote: 'formacao',
    descricao:
      'Idiomas de Vinicius Machado: inglês e espanhol, ambos em nível básico, com o nível de cada idioma listado no código.',
  },
  {
    slug: 'depoimentos',
    titulo: 'Depoimentos/Recomendações',
    icone: 'design-arquivo',
    arquivo: 'Depoimentos.java',
    pacote: 'recomendacoes',
    descricao:
      'Recomendação recebida no LinkedIn de um colega de equipe, desenvolvedor backend Java, sobre o trabalho e a colaboração de Vinicius.',
  },
  {
    slug: 'contato',
    titulo: 'Contato',
    icone: 'design-arquivo',
    arquivo: 'Contato.java',
    pacote: 'contato',
    descricao:
      'Fale com Vinicius Machado: e-mail, telefone, LinkedIn e GitHub, com links diretos para cada contato.',
  },
];

/** Chave do `data` da rota que pede a árvore com a primeira seção destacada, sem página atual. */
export const DADO_ARVORE_NO_INICIO = 'arvoreNoInicio';

/** Arquivo da página inicial (rota `/`), que não é uma das seções da árvore. */
export const ARQUIVO_INICIO = 'PortfolioApplication.java';
