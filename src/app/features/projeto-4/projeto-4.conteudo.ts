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

/** Uma página: o texto do case em Javadoc, o record `Caso` e o case com o título e as tecnologias. */
function paginaDoCase(
  texto: string,
  variavel: string,
  titulo: string,
  tecnologias: readonly string[],
): ConteudoDoEditor {
  return [
    vazia(),
    linha(0, palavraChave('package'), comum(' dev.vinicius.portfolio.projetos;')),
    vazia(),
    linha(0, palavraChave('import'), comum(' java.util.List;')),
    vazia(),
    javadoc(0, texto),
    linha(0, palavraChave('public class'), comum(' CasosDaMemora {')),
    vazia(),
    linha(1, comentario('// Um case que entreguei na Memora')),
    linha(1, palavraChave('record'), comum(' Caso(String titulo, List<String> tecnologias) {}')),
    vazia(),
    linha(1, comum(`Caso ${variavel} = `), palavraChave('new'), comum(' Caso(')),
    linha(2, literal(`"${titulo}"`), comum(',')),
    linha(2, ...listaDeTextos(tecnologias, '')),
    linha(1, comum(');')),
    vazia(),
    linha(0, comum('}')),
  ];
}

/** Conteúdo de cada página da seção (telas 16, 17 e 18), na ordem das páginas. */
export const CONTEUDOS_PROJETO_4: readonly ConteudoDoEditor[] = [
  paginaDoCase(
    'Atuei na migração de APIs e microsserviços em produção (login, financeiro), adaptando entidades, DTOs e scripts SQL nativos um a um pra manter compatibilidade sem quebrar regras de negócio.',
    'migracao',
    'Oracle → PostgreSQL',
    ['Java', 'Oracle', 'PostgreSQL', 'SQL'],
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
