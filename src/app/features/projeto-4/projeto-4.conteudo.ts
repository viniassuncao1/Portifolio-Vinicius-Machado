import {
  comentario,
  comum,
  javadoc,
  linha,
  literal,
  palavraChave,
  vazia,
} from '../../shared/editor-de-codigo/conteudo';
import type { ConteudoDoEditor, Trecho } from '../../shared/editor-de-codigo/conteudo';

/** `List.of("A", "B", ...)` numa linha só, fechado com `fim`. */
function listaDeTextos(itens: readonly string[], fim: string): readonly Trecho[] {
  return [
    comum('List.of('),
    ...itens.flatMap((item, i) =>
      i === 0 ? [literal(`"${item}"`)] : [comum(', '), literal(`"${item}"`)],
    ),
    comum(`)${fim}`),
  ];
}

interface CaseDaMemora {
  /** Nome da variável Java do case. */
  readonly variavel: string;
  readonly titulo: string;
  readonly tecnologias: readonly string[];
  readonly texto: string;
}

const CASES: readonly CaseDaMemora[] = [
  {
    variavel: 'migracao',
    titulo: 'Oracle → PostgreSQL',
    tecnologias: ['Java', 'Oracle', 'PostgreSQL', 'SQL'],
    texto:
      'Atuei na migração de APIs e microsserviços em produção (login, financeiro), adaptando entidades, DTOs e scripts SQL nativos um a um pra manter compatibilidade sem quebrar regras de negócio.',
  },
  {
    variavel: 'scraper',
    titulo: 'Scraper de licitações',
    tecnologias: ['Java', 'Playwright', 'Coren', 'Sanesul'],
    texto:
      'Desenvolvi scrapers em Java com Playwright pra automatizar coleta de dados em sistemas como Coren e Sanesul, sem usar APIs, só interface web, entendendo o HTML e a lógica de cada sistema individualmente.',
  },
  {
    variavel: 'ayoForms',
    titulo: 'AyoForms',
    tecnologias: ['PHP', 'MySQL', 'Google Workspace', 'Microsoft Azure', 'SharePoint'],
    texto:
      'Sistema de formulários em PHP puro e MySQL pra campanha interna, com login via Google Workspace e Microsoft Azure, upload de vídeo, geração de insights de origem de acesso e fase de votação carregando conteúdo do SharePoint.',
  },
];

/** Um bloco por case: comentário com o título, o texto em Javadoc e o case com as tecnologias. */
const blocoDoCase = (caso: CaseDaMemora): ConteudoDoEditor => [
  linha(1, comentario(`// ${caso.titulo}`)),
  javadoc(1, caso.texto),
  linha(1, comum(`Caso ${caso.variavel} = `), palavraChave('new'), comum(' Caso(')),
  linha(2, literal(`"${caso.titulo}"`), comum(',')),
  linha(2, ...listaDeTextos(caso.tecnologias, '')),
  linha(1, comum(');')),
  vazia(),
];

/**
 * Conteúdo da seção (telas 16, 17 e 18) num arquivo só: o cabeçalho e o record uma vez, depois um
 * bloco por case.
 */
export const CONTEUDO_PROJETO_4: ConteudoDoEditor = [
  vazia(),
  linha(0, palavraChave('package'), comum(' dev.vinicius.portfolio.projetos;')),
  vazia(),
  linha(0, palavraChave('import'), comum(' java.util.List;')),
  vazia(),
  linha(0, palavraChave('public class'), comum(' CasosDaMemora {')),
  vazia(),
  linha(1, comentario('// Cases que entreguei na Memora')),
  linha(1, palavraChave('record'), comum(' Caso(String titulo, List<String> tecnologias) {}')),
  vazia(),
  ...CASES.flatMap(blocoDoCase),
  linha(0, comum('}')),
];
