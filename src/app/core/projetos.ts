/** Imagem de um projeto, em `public/projetos/`, com as dimensões para evitar salto de layout. */
export interface ImagemDeProjeto {
  readonly src: string;
  readonly largura: number;
  readonly altura: number;
  readonly alt: string;
}

/** Capa gerada no estilo do editor, para os projetos sem captura de tela. */
export interface CapaEmCodigo {
  readonly classe: string;
  /** Linhas do trecho em Java mostrado na capa; vazias viram espaço. */
  readonly linhas: readonly string[];
}

export interface LinkDeProjeto {
  readonly url: string;
  readonly rotulo: 'Ver site' | 'Ver repositório';
}

export interface Projeto {
  /** Segmento do endereço da vitrine: `/projetos/<slug>`. */
  readonly slug: string;
  /** Seção do arquivo `.java` do projeto (`/projeto-N`). */
  readonly secao: string;
  readonly numero: number;
  readonly titulo: string;
  readonly etiquetas: readonly string[];
  /** Até três destaques curtos, para ler o projeto em segundos. */
  readonly destaques: readonly string[];
  readonly descricao: string;
  /** O papel do Vinicius no projeto, para a aba Stack dos detalhes. */
  readonly papel: string;
  /** Capturas de tela; sem elas o cartão usa `capa`. */
  readonly imagens: readonly ImagemDeProjeto[];
  readonly capa: CapaEmCodigo;
  /** Projetos de cliente ou internos não têm endereço público. */
  readonly link?: LinkDeProjeto;
}

/** Os seis projetos, na ordem da árvore do projeto (spec `secao-projetos`). */
export const PROJETOS: readonly Projeto[] = [
  {
    slug: 'memora',
    papel: 'Estagiário e depois Desenvolvedor Full Stack Júnior na Memora',
    secao: 'projeto-1',
    numero: 1,
    titulo: 'Cases da Memora',
    etiquetas: ['Java', 'PostgreSQL', 'Playwright'],
    destaques: [
      'APIs e microsserviços migrados de Oracle para PostgreSQL em produção',
      'Scrapers de licitações em Java com Playwright (Coren e Sanesul)',
      'AyoForms em PHP e MySQL, com login Google Workspace e Azure',
    ],
    descricao:
      'Três cases do estágio e do trabalho na Memora: a migração de APIs e microsserviços de Oracle para PostgreSQL em produção, os scrapers de licitações em Java com Playwright e o AyoForms, sistema de formulários para uma campanha interna do grupo.',
    imagens: [],
    capa: {
      classe: 'MigracaoOracleParaPostgres',
      linhas: [
        'migrate("Oracle", "PostgreSQL");',
        'develop("Java + Playwright", "Scrapers");',
        'create("AyoForms", "PHP + MySQL");',
      ],
    },
  },
  {
    slug: 'portfolio',
    papel: 'Projeto pessoal, feito de ponta a ponta',
    secao: 'projeto-2',
    numero: 2,
    titulo: 'Este portfólio',
    etiquetas: ['Angular', 'TypeScript', 'SDD'],
    destaques: [
      'Angular pré-renderizado, com testes unitários, E2E e axe',
      'Desenvolvido com SDD (OpenSpec) e uma equipe de agentes de IA',
      'Cada decisão registrada em ADRs e no diário de desenvolvimento',
    ],
    descricao:
      'O próprio portfólio, como estudo de desenvolvimento com IA: especificações com OpenSpec, as regras do ECC e uma equipe de agentes no Maestri, com cada decisão registrada em ADRs.',
    imagens: [],
    capa: {
      classe: 'PortfolioViniciusMachado',
      linhas: [
        'String framework = "Angular 22";',
        'String metodo = "SDD com OpenSpec";',
        'int adrs = 19;',
      ],
    },
    link: {
      url: 'https://github.com/viniassuncao1/Portifolio-Vinicius-Machado',
      rotulo: 'Ver repositório',
    },
  },
  {
    slug: 'launcher-de-tv',
    papel: 'Fork do CleanYourTV, do Gathin, levado para o Android 4.4',
    secao: 'projeto-3',
    numero: 3,
    titulo: 'Launcher de TV',
    etiquetas: ['Java', 'Android 4.4'],
    destaques: [
      'Fork do CleanYourTV levado do Android 8 para o Android 4.4',
      'Cerca de 70 avisos de compatibilidade resolvidos, 42 testes passando',
      'Testado numa TV Philco com 456 MB de RAM',
    ],
    descricao:
      'Fork do CleanYourTV, do Gathin: um launcher Android em Java que troca a tela inicial cheia de anúncios por uma tela limpa. Levei o projeto do Android 8 para o Android 4.4, isolando o que depende de versões novas em classes chamadas só depois de checar a versão do sistema.',
    imagens: [],
    capa: {
      classe: 'LauncherDeTv',
      linhas: ['int minSdkOriginal = 26;', 'int minSdkNovo = 19;', 'int testesPassando = 42;'],
    },
    link: { url: 'https://github.com/viniassuncao1/cleanyourtv', rotulo: 'Ver repositório' },
  },
  {
    slug: 'ana',
    papel: 'Desenvolvedor na Watts Company, para uma fisioterapeuta autônoma',
    secao: 'projeto-4',
    numero: 4,
    titulo: 'Ana, agente de IA',
    etiquetas: ['n8n', 'WhatsApp', 'React'],
    destaques: [
      'Atende pacientes pelo WhatsApp: marca, desmarca e cancela sessões',
      'Integrações com Google OAuth 2.0 e a API do WhatsApp',
      'Painel de controle e CRM em React, feito com Claude Code e SDD',
    ],
    descricao:
      'A Ana é um agente de IA em n8n que ajuda uma fisioterapeuta autônoma a atender pacientes pelo WhatsApp, com um painel de controle e CRM em React onde a profissional gerencia pacientes, agenda, sessões e prontuário.',
    imagens: [],
    capa: {
      classe: 'Ana',
      linhas: [
        'String plataforma = "WhatsApp";',
        'String automacao = "n8n";',
        'Integration google = new GoogleOAuth();',
      ],
    },
  },
  {
    slug: 'dra-juliana',
    papel: 'Design e desenvolvimento, para a Dra. Juliana Maluhy',
    secao: 'projeto-5',
    numero: 5,
    titulo: 'Dra. Juliana Maluhy',
    etiquetas: ['HTML', 'JavaScript', 'Landing page'],
    destaques: [
      'Design autoral e estrutura pensada para conversão',
      'Prova social com avaliação 5.0 no Doctoralia',
      'Todo o caminho do site converge para o WhatsApp',
    ],
    descricao:
      'Landing page em HTML e JavaScript puro, com design autoral do zero: hero com proposta de valor clara, prova social, especialidades, convênios e depoimentos, e todo o caminho convergindo para o WhatsApp.',
    imagens: [
      {
        src: 'projetos/dra-juliana-capa.webp',
        largura: 960,
        altura: 600,
        alt: 'Landing page da Dra. Juliana Maluhy: título "Seu corpo não foi feito pra doer", foto da médica e botão para agendar pelo WhatsApp.',
      },
    ],
    capa: { classe: 'DraJulianaMaluhy', linhas: ['String CTA = "Agendar via WhatsApp";'] },
    link: { url: 'https://www.drajulianamaluhy.com/', rotulo: 'Ver site' },
  },
  {
    slug: 'watts-company',
    papel: 'Desenvolvedor e co-fundador da Watts Company',
    secao: 'projeto-6',
    numero: 6,
    titulo: 'Watts Company',
    etiquetas: ['React', 'Landing page', 'IA'],
    destaques: [
      'Foco em conversão de leads e venda direta dos serviços',
      'Proposta direta: "Automatize. Escale. Domine."',
      'CTA de diagnóstico gratuito levando ao funil comercial',
    ],
    descricao:
      'Landing page da própria Watts Company, feita em React, com foco em conversão de leads e venda direta dos serviços de automação e IA da agência.',
    imagens: [
      {
        src: 'projetos/watts-company-capa.webp',
        largura: 960,
        altura: 600,
        alt: 'Landing page da Watts Company: fundo escuro, título "Automatize. Escale. Domine." e botão de diagnóstico gratuito.',
      },
    ],
    capa: { classe: 'WattsCompany', linhas: ['String type = "Landing Page";'] },
    link: { url: 'https://wattscompany.com.br/', rotulo: 'Ver site' },
  },
];

export const projetoDoSlug = (slug: string | null | undefined): Projeto | undefined =>
  PROJETOS.find((projeto) => projeto.slug === slug);

/** Posição no carrossel e nos detalhes: `NN / 06`. */
export const contadorDoProjeto = (projeto: Projeto): string =>
  `${String(projeto.numero).padStart(2, '0')} / ${String(PROJETOS.length).padStart(2, '0')}`;

/** O projeto de uma seção (`projeto-1` a `projeto-6`). */
export const projetoDaSecao = (secao: string): Projeto | undefined =>
  PROJETOS.find((projeto) => projeto.secao === secao);
