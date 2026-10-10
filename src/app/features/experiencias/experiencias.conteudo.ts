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

/** Dados de uma página: as telas 07 a 09 (design/telas), uma experiência por página. */
interface Experiencia {
  readonly constante: string;
  readonly empresa: string;
  readonly cargo: string;
  /** Texto do período, como "08/2026 - Presente". */
  readonly periodo: string;
  readonly destaques: readonly string[];
  /** Texto original da tela, no Javadoc da constante. */
  readonly descricao: string;
}

const aspas = (texto: string): Trecho => literal(`"${texto}"`);

const destaques = (itens: readonly string[]): readonly Linha[] => [
  linha(2, comum('List.of(')),
  ...itens.map((item, i) => linha(3, aspas(item), comum(i < itens.length - 1 ? ',' : ''))),
  linha(2, comum(')')),
];

const importacoes: readonly Linha[] = [linha(0, palavraChave('import'), comum(' java.util.List;'))];

/** O record vem só na página 1; as outras duas páginas o usam como a mesma classe `Experiences`. */
const registro: readonly Linha[] = [
  linha(1, comentario('// Cada experiência tem empresa, cargo, período e destaques')),
  linha(1, palavraChave('record'), comum(' Experience(')),
  linha(2, declaracao('String company'), comum(',')),
  linha(2, declaracao('String role'), comum(',')),
  linha(2, declaracao('String period'), comum(',')),
  linha(2, declaracao('List<String> highlights'), comum(') {}')),
  vazia(),
];

const pagina = (experiencia: Experiencia, comRegistro: boolean): ConteudoDoEditor => [
  vazia(),
  ...importacoes,
  vazia(),
  linha(0, palavraChave('public class'), comum('  Experiences {')),
  vazia(),
  ...(comRegistro
    ? registro
    : [linha(1, comentario('// Outra experiência, no mesmo formato da primeira página'))]),
  javadoc(1, experiencia.descricao),
  linha(
    1,
    palavraChave('static final'),
    declaracao(' Experience'),
    comum(` ${experiencia.constante} = `),
    palavraChave('new'),
    comum(' Experience('),
  ),
  linha(2, aspas(experiencia.empresa), comum(',')),
  linha(2, aspas(experiencia.cargo), comum(',')),
  linha(2, aspas(experiencia.periodo), comum(',')),
  ...destaques(experiencia.destaques),
  linha(1, comum(');')),
  vazia(),
  linha(0, comum('}')),
];

const MEMORA: Experiencia = {
  constante: 'MEMORA',
  empresa: 'Memora',
  cargo: 'Desenvolvedor Full Stack Júnior',
  periodo: '08/2026 - Presente',
  destaques: [
    'Liderança de squad',
    'Scrum: dailies, previsões de conclusão e reviews',
    'Desenvolvimento das demandas do squad',
  ],
  descricao:
    'Lidero um squad, orientando o time nas demandas, tirando dúvidas técnicas e garantindo que sigamos Scrum, com dailies, previsões de conclusão e reviews, além de atuar como desenvolvedor nas próprias demandas do squad.',
};

const MEMORA_ESTAGIO: Experiencia = {
  constante: 'MEMORA_INTERNSHIP',
  empresa: 'Memora',
  cargo: 'Estagiário de Desenvolvimento',
  periodo: '08/2025 - 07/2026',
  destaques: [
    'Migração de APIs de Oracle para PostgreSQL',
    'Scrapers em Java + Playwright',
    'AyoForms em PHP + MySQL',
    'Correção de bug crítico no faturamento (Sankhya)',
  ],
  descricao:
    'Corrigi bug crítico na integração de faturamento com o Sankhya que afetaria o pagamento de colaboradores. Migrei APIs de Oracle para PostgreSQL em produção. Desenvolvi scrapers em Java com Playwright para automatizar coleta de dados em sistemas de licitação como Coren e Sanesul. Criei o AyoForms, sistema de formulários em PHP e MySQL para campanha interna do grupo, com login via Google Workspace e Microsoft Azure.',
};

const WATTS_COMPANY: Experiencia = {
  constante: 'WATTS_COMPANY',
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

/** Um item por página: `/experiencias`, `/experiencias/2` e `/experiencias/3`. */
export const CONTEUDOS_EXPERIENCIAS: readonly ConteudoDoEditor[] = [
  pagina(MEMORA, true),
  pagina(MEMORA_ESTAGIO, false),
  pagina(WATTS_COMPANY, false),
];
