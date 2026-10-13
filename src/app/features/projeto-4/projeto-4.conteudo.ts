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

/** Uma página: o record `Case`, o texto do case em Javadoc e a constante com o título e a stack. */
function paginaDoCase(
  texto: string,
  variavel: string,
  titulo: string,
  stack: readonly string[],
): ConteudoDoEditor {
  return [
    vazia(),
    linha(0, palavraChave('import'), comum(' java.util.List;')),
    vazia(),
    linha(0, comentario('// Um case que entreguei na Memora')),
    linha(0, palavraChave('record'), comum(' Case(String title, List<String> stack) {}')),
    vazia(),
    javadoc(0, texto),
    linha(0, palavraChave('public class'), comum(' MemoraCases {')),
    linha(1, comum(`Case ${variavel} = `), palavraChave('new'), comum(' Case(')),
    linha(3, literal(`"${titulo}"`), comum(',')),
    linha(3, ...listaDeTextos(stack, '')),
    linha(1, comum(');')),
    linha(0, comum('}')),
  ];
}

/** Conteúdo de cada página da seção (telas 16, 17 e 18), na ordem das páginas. */
export const CONTEUDOS_PROJETO_4: readonly ConteudoDoEditor[] = [
  paginaDoCase(
    'Atuei na migração de APIs e microsserviços em produção (login, financeiro), adaptando entidades, DTOs e scripts SQL nativos um a um pra manter compatibilidade sem quebrar regras de negócio.',
    'migration',
    'Oracle → PostgreSQL',
    ['Java', 'Spring Boot', 'Oracle', 'PostgreSQL', 'SQL'],
  ),
  paginaDoCase(
    'Desenvolvi scrapers em Java com Playwright pra automatizar coleta de dados em sistemas como Coren e Sanesul, sem usar APIs, só interface web, entendendo o HTML e a lógica de cada sistema individualmente.',
    'scraper',
    'Scraper de licitações',
    ['Java', 'Playwright', 'Coren', 'Sanesul'],
  ),
  paginaDoCase(
    'Sistema de formulários em PHP puro e MySQL pra campanha interna, com login via Google Workspace e Microsoft Azure, upload de vídeo, geração de insights de origem de acesso e fase de votação carregando conteúdo do SharePoint.',
    'ayoForms',
    'AyoForms',
    ['PHP', 'MySQL', 'Google Workspace', 'Microsoft Azure', 'SharePoint'],
  ),
];
