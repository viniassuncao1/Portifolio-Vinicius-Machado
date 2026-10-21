/**
 * Fatos sobre o Vinicius para as superfícies pensadas em quem recruta (visão geral, barra de ações,
 * busca). Os textos vêm das seções em código (`features/*`); `perfil.spec.ts` confere que as
 * informações daqui continuam presentes lá, para os dois lados não divergirem.
 */
export const EMAIL_DE_CONTATO = 'viniciusmassuncao@gmail.com';
export const TELEFONE_DE_CONTATO = '+55 61 98283-7805';
export const ENDERECO_DO_CURRICULO = 'CV_Vinicius_Machado_Desenvolvedor_FullStack_Java.pdf';
export const ENDERECO_DO_LINKEDIN = 'https://linkedin.com/in/viniassuncao';
export const ENDERECO_DO_GITHUB = 'https://github.com/viniassuncao1';

export interface ContatoDoPerfil {
  readonly rotulo: string;
  readonly valor: string;
  readonly href: string;
  /** Abre em outra aba (sites); e-mail e telefone abrem o aplicativo do sistema. */
  readonly externo: boolean;
}

export const CONTATOS: readonly ContatoDoPerfil[] = [
  { rotulo: 'E-mail', valor: EMAIL_DE_CONTATO, href: `mailto:${EMAIL_DE_CONTATO}`, externo: false },
  {
    rotulo: 'Telefone',
    valor: TELEFONE_DE_CONTATO,
    href: 'tel:+5561982837805',
    externo: false,
  },
  {
    rotulo: 'LinkedIn',
    valor: 'linkedin.com/in/viniassuncao',
    href: ENDERECO_DO_LINKEDIN,
    externo: true,
  },
  {
    rotulo: 'GitHub',
    valor: 'github.com/viniassuncao1',
    href: ENDERECO_DO_GITHUB,
    externo: true,
  },
];

export const PERFIL = {
  nome: 'Vinicius Machado',
  cargo: 'Desenvolvedor Full Stack',
  /** Uma frase para quem só vai ler uma. */
  resumo:
    'Java 21 e Spring Boot no back-end, Angular no front-end, em sistemas de produção sobre Oracle, PostgreSQL e MySQL.',
  stack: ['Java', 'Spring Boot', 'Angular', 'SQL'],
  disponibilidade: 'Disponível',
  cidade: 'Brasília, DF',
} as const;

/** Provas curtas, todas já afirmadas nas seções (Sobre Mim, Projetos e Skills). */
export interface ProvaDoPerfil {
  readonly valor: number;
  readonly sufixo: string;
  readonly rotulo: string;
}

export const PROVAS: readonly ProvaDoPerfil[] = [
  { valor: 2, sufixo: '', rotulo: 'anos em sistemas de produção (cerca de)' },
  { valor: 21, sufixo: '', rotulo: 'versão do Java que uso no trabalho' },
  { valor: 3, sufixo: '', rotulo: 'bancos de dados: Oracle, PostgreSQL e MySQL' },
  { valor: 6, sufixo: '', rotulo: 'projetos na vitrine, com site ou código' },
];

export interface ResumoDoSobre {
  readonly titulo: string;
  readonly texto: string;
}

/** O Sobre Mim em quatro afirmações, na ordem em que a seção em código as dá. */
export const SOBRE: readonly ResumoDoSobre[] = [
  {
    titulo: 'Back-end',
    texto:
      'APIs REST em Java 21 e Spring Boot, com Spring Data JPA e Spring Security, em microsserviços.',
  },
  {
    titulo: 'Front-end',
    texto: 'Componentes em Angular 17 que consomem essas APIs por services.',
  },
  {
    titulo: 'Equipe',
    texto:
      'Liderança de squad no Scrum na Memora: dúvidas técnicas, planejamento e revisão de merge requests.',
  },
  {
    titulo: 'IA no dia a dia',
    texto:
      'Agentes de IA e CRMs na Watts Company, empresa de automação que co-fundei, e Claude Code com SDD.',
  },
];

export type NivelDeConhecimento = 'dominio' | 'projeto' | 'pontual' | 'teorico';

export interface GrupoDeStack {
  readonly nivel: NivelDeConhecimento;
  readonly titulo: string;
  readonly descricao: string;
  readonly itens: readonly string[];
}

/** Mesmos níveis e tecnologias de `Skills.java`. */
export const STACK: readonly GrupoDeStack[] = [
  {
    nivel: 'dominio',
    titulo: 'Domínio diário',
    descricao: 'Uso todo dia no trabalho',
    itens: [
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
    nivel: 'projeto',
    titulo: 'Projeto completo',
    descricao: 'Já entreguei um projeto inteiro com ela',
    itens: ['PHP'],
  },
  {
    nivel: 'pontual',
    titulo: 'Uso pontual',
    descricao: 'Usei em tarefas isoladas',
    itens: ['React Native', 'CI/CD', 'JUnit'],
  },
  {
    nivel: 'teorico',
    titulo: 'Conhecimento teórico',
    descricao: 'Estudei, mas ainda não usei em produção',
    itens: ['Python', 'AWS', 'Azure', 'Docker', 'Kubernetes'],
  },
];

export interface ExperienciaDoPerfil {
  readonly empresa: string;
  readonly cargo: string;
  readonly periodo: string;
  readonly destaques: readonly string[];
}

/** Da mais recente à mais antiga, como em `Experiencias.java`. */
export const EXPERIENCIAS: readonly ExperienciaDoPerfil[] = [
  {
    empresa: 'Memora',
    cargo: 'Desenvolvedor Full Stack Júnior',
    periodo: '08/2026 - Presente',
    destaques: [
      'APIs REST em Java 21 e Spring Boot, com Spring Data JPA e Spring Security',
      'Microsserviços de login, gateway, financeiro e RH',
      'Componentes em Angular 17 integrados às APIs por services',
      'Entregas pelo GitLab CI/CD, com Docker e Kubernetes',
      'Liderança de squad no Scrum: dúvidas, planejamento e merge requests',
    ],
  },
  {
    empresa: 'Memora',
    cargo: 'Estagiário de Desenvolvimento',
    periodo: '08/2025 - 07/2026',
    destaques: [
      'Migração de APIs e microsserviços de Oracle para PostgreSQL',
      'Entidades JPA, DTOs e SQL nativo adaptados na migração',
      'Scrapers em Java + Playwright',
      'AyoForms em PHP 8, JavaScript e MySQL',
      'Correção de bug crítico no faturamento (Sankhya)',
    ],
  },
  {
    empresa: 'Watts Company',
    cargo: 'Co-fundador & Desenvolvedor Full Stack',
    periodo: '02/2025 - Presente',
    destaques: [
      'Agência de automação e IA co-fundada do zero',
      'Sistemas de CRM e agentes de IA',
      'Painel de gestão para clínica, com deploy via Vercel',
      'Modelos de IA integrados via n8n',
    ],
  },
];

export const FORMACAO = {
  instituicao: 'UniCEUB',
  curso: 'Bacharelado em Ciência da Computação',
  previsao: 2027,
  foco: 'Engenharia de Software, Sistemas Distribuídos e Arquitetura de Software',
} as const;

export const IDIOMAS = [
  { idioma: 'Inglês', nivel: 'Básico' },
  { idioma: 'Espanhol', nivel: 'Básico' },
] as const;
