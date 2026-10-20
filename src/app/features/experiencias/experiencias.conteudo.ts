import {
  comentario,
  comum,
  declaracao,
  linha,
  literal,
  palavraChave,
  javadoc,
  vazia,
} from '../../shared/editor-de-codigo/conteudo';
import type { ConteudoDoEditor, Linha, Trecho } from '../../shared/editor-de-codigo/conteudo';

/** Dados de um bloco: as telas 07 a 09 (design/telas), uma experiência por bloco. */
interface Experiencia {
  /** Nome da variável Java da experiência. */
  readonly variavel: string;
  readonly empresa: string;
  readonly cargo: string;
  /** Texto do período, como "08/2026 - Presente". */
  readonly periodo: string;
  readonly destaques: readonly string[];
  /** Texto original da tela, no Javadoc da variável. */
  readonly descricao: string;
}

const aspas = (texto: string): Trecho => literal(`"${texto}"`);

const destaques = (itens: readonly string[]): readonly Linha[] => [
  linha(2, comum('List.of(')),
  ...itens.map((item, i) => linha(3, aspas(item), comum(i < itens.length - 1 ? ',' : ''))),
  linha(2, comum(')')),
];

const importacoes: readonly Linha[] = [linha(0, palavraChave('import'), comum(' java.util.List;'))];

/** O record que as três experiências usam. */
const registro: readonly Linha[] = [
  linha(1, comentario('// Cada experiência tem empresa, cargo, período e destaques')),
  linha(1, palavraChave('record'), comum(' Experiencia(')),
  linha(2, declaracao('String empresa'), comum(',')),
  linha(2, declaracao('String cargo'), comum(',')),
  linha(2, declaracao('String periodo'), comum(',')),
  linha(2, declaracao('List<String> destaques'), comum(') {}')),
  vazia(),
];

/** Um bloco da seção: comentário de título, Javadoc com o texto e a instância da experiência. */
const bloco = (titulo: string, experiencia: Experiencia): readonly Linha[] => [
  linha(1, comentario(`// ${titulo}`)),
  javadoc(1, experiencia.descricao),
  linha(
    1,
    declaracao('Experiencia'),
    comum(` ${experiencia.variavel} = `),
    palavraChave('new'),
    comum(' Experiencia('),
  ),
  linha(2, aspas(experiencia.empresa), comum(',')),
  linha(2, aspas(experiencia.cargo), comum(',')),
  linha(2, aspas(experiencia.periodo), comum(',')),
  ...destaques(experiencia.destaques),
  linha(1, comum(');')),
  vazia(),
];

const MEMORA: Experiencia = {
  variavel: 'memora',
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
  descricao:
    'Desenvolvo APIs REST em Java 21 e Spring Boot, com repositórios Spring Data JPA e Spring Security, numa arquitetura de microsserviços (login, gateway, financeiro, RH, entre outros). No front-end, crio componentes em Angular 17 e integro às APIs que desenvolvo por meio de services. As entregas passam pelo pipeline do GitLab CI/CD, com Docker e Kubernetes em servidores locais. Também lidero um squad no Scrum: oriento trainees e estagiários nas dúvidas técnicas, no planejamento das demandas e na revisão de merge requests, além de desenvolver as minhas próprias demandas.',
};

const MEMORA_ESTAGIO: Experiencia = {
  variavel: 'estagioNaMemora',
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
  descricao:
    'Corrigi bug crítico na integração de faturamento com o Sankhya que afetaria o pagamento de colaboradores. Migrei APIs e microsserviços de Oracle para PostgreSQL em produção, adaptando entidades JPA, DTOs e SQL nativo. Desenvolvi scrapers em Java com Playwright para automatizar coleta de dados em sistemas de licitação como Coren e Sanesul. Criei o AyoForms, sistema de formulários em PHP 8 puro, JavaScript e MySQL para campanha interna do grupo, com login via Google Workspace e Microsoft Azure.',
};

const WATTS_COMPANY: Experiencia = {
  variavel: 'wattsCompany',
  empresa: 'Watts Company',
  cargo: 'Co-fundador & Desenvolvedor Full Stack',
  periodo: '02/2025 - Presente',
  destaques: [
    'Agência de automação e IA co-fundada do zero',
    'Sistemas de CRM e agentes de IA',
    'Painel de gestão para clínica, com deploy via Vercel',
    'Modelos de IA integrados via n8n',
  ],
  descricao:
    'Co-fundei uma agência de automação e IA do zero. Desenvolvo sistemas de CRM e agentes de IA que atendem clientes de ponta a ponta, da criação do agente até o painel que a empresa usa no dia a dia. Entreguei um painel de gestão completo para uma clínica (agenda, pacientes, financeiro), com deploy contínuo via Vercel, e integrei modelos de IA via n8n para automatizar atendimento e qualificação de leads.',
};

/** O arquivo `Experiencias.java` inteiro: o record e uma experiência por bloco, da mais recente à mais antiga. */
export const CONTEUDO_EXPERIENCIAS: ConteudoDoEditor = [
  vazia(),
  linha(0, palavraChave('package'), comum(' dev.vinicius.portfolio.experiencias;')),
  vazia(),
  ...importacoes,
  vazia(),
  linha(0, palavraChave('public class'), comum(' Experiencias {')),
  vazia(),
  ...registro,
  ...bloco('Memora', MEMORA),
  ...bloco('Estágio na Memora', MEMORA_ESTAGIO),
  ...bloco('Watts Company', WATTS_COMPANY),
  linha(0, comum('}')),
];
