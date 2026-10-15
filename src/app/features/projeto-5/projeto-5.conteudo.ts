import {
  comentario,
  comum,
  declaracao,
  javadoc,
  link,
  linha,
  linhaExecutavel,
  literal,
  palavraChave,
  vazia,
} from '../../shared/editor-de-codigo/conteudo';
import type { ConteudoDoEditor, Linha } from '../../shared/editor-de-codigo/conteudo';

export const ENDERECO_DO_REPOSITORIO =
  'https://github.com/viniassuncao1/Portifolio-Vinicius-Machado';
const ENDERECO_DO_OPENSPEC = `${ENDERECO_DO_REPOSITORIO}/tree/main/openspec`;
const ENDERECO_DO_ECC = 'https://github.com/affaan-m/ECC';
const ENDERECO_DO_MAESTRI = 'https://www.producthunt.com/products/maestri';

/** As linhas que se repetem em toda página: pacote, classe e o record `Ferramenta`. */
function pagina(
  texto: string,
  variavel: string,
  ferramenta: readonly [nome: string, papel: string, href: string],
  extras: readonly Linha[] = [],
  executavel = false,
): ConteudoDoEditor {
  const [nome, papel, href] = ferramenta;
  return [
    vazia(),
    linha(0, palavraChave('package'), comum(' dev.vinicius.portfolio.projetos;')),
    vazia(),
    linha(0, palavraChave('import'), comum(' java.util.List;')),
    vazia(),
    javadoc(0, texto),
    (executavel ? linhaExecutavel : linha)(
      0,
      palavraChave('public class'),
      comum(' EstudoComIA {'),
    ),
    vazia(),
    linha(1, comentario('// Uma ferramenta deste estudo, com o papel dela e o link')),
    linha(
      1,
      palavraChave('record'),
      comum(' Ferramenta('),
      declaracao('String nome'),
      comum(', '),
      declaracao('String papel'),
      comum(', '),
      declaracao('String link'),
      comum(') {}'),
    ),
    vazia(),
    linha(1, comum(`Ferramenta ${variavel} = `), palavraChave('new'), comum(' Ferramenta(')),
    linha(2, literal(`"${nome}"`), comum(',')),
    linha(2, literal(`"${papel}"`), comum(',')),
    linha(2, link(literal(`"${href}"`), href)),
    linha(1, comum(');')),
    ...extras,
    vazia(),
    linha(0, comum('}')),
  ];
}

const skills = [
  'web-design-guidelines',
  'make-interfaces-feel-better',
  'redesign-existing-projects',
  'accessibility',
  'motion-foundations',
  'motion-patterns',
  'li-human',
];

const equipe = ['Regente', 'Pincel', 'Compasso', 'Sentinela', 'Escriba', 'Grafite', 'Nanquim'];

const listaEmLinhas = (itens: readonly string[], variavel: string): readonly Linha[] => [
  vazia(),
  linha(1, comum(`List<String> ${variavel} = List.of(`)),
  ...itens.map((item, i) => linha(3, literal(`"${item}"`), comum(i < itens.length - 1 ? ',' : ''))),
  linha(1, comum(');')),
];

/** Conteúdo de cada página do Projeto 5: o estudo, SDD com OpenSpec, ECC e Maestri. */
export const CONTEUDOS_PROJETO_5: readonly ConteudoDoEditor[] = [
  pagina(
    'Este portfólio é o meu estudo de desenvolvimento com IA. O site é em Angular 22, pré-renderizado, e parece uma IDE. Eu decido o que entra e reviso cada mudança. Os agentes implementam. O código está aberto no GitHub, e a página do repositório mostra como o trabalho se divide.',
    'portfolio',
    ['Este portfólio', 'Código aberto, com a história de cada mudança', ENDERECO_DO_REPOSITORIO],
    [
      vazia(),
      linha(1, comentario('// Os números do trabalho estão na página do repositório')),
      linha(1, link(comentario('// Ver o repositório →'), '/repositorio')),
    ],
    true,
  ),
  pagina(
    'Nada aqui começou pelo código. Cada mudança nasce como uma change no OpenSpec, com proposta, design, specs e tarefas, e só vira código depois que eu aprovo. As decisões ficam registradas em ADRs, e cada change termina num pull request. É Spec-Driven Development (SDD) na prática.',
    'openSpec',
    ['OpenSpec', 'Specs antes do código, uma change por mudança', ENDERECO_DO_OPENSPEC],
  ),
  pagina(
    'Para guiar os agentes usei o ECC, um conjunto de regras, skills e agentes do Affaan Mustafa, que venceu o hackathon Anthropic x Forum Ventures em setembro de 2025. Aqui ele entrou na auditoria de UX, no movimento, na acessibilidade e na revisão dos textos.',
    'ecc',
    ['ECC (Everything Claude Code)', 'Regras, skills e agentes de Affaan Mustafa', ENDERECO_DO_ECC],
    [
      vazia(),
      linha(1, comentario('// Skills do ECC que usei aqui')),
      ...listaEmLinhas(skills, 'skillsUsadas').slice(1),
    ],
  ),
  pagina(
    'O Maestri é um app de macOS com um canvas infinito para agentes de código, criado pelo desenvolvedor brasileiro Evert Junior. É nele que a equipe trabalha. Regente planeja e revisa; Pincel cuida dos componentes; Compasso, do movimento; Sentinela, dos testes; Escriba, da documentação; Grafite e Nanquim escrevem as seções.',
    'maestri',
    ['Maestri', 'Canvas de agentes de código, de Evert Junior', ENDERECO_DO_MAESTRI],
    [
      vazia(),
      linha(1, comentario('// A equipe de agentes deste portfólio')),
      ...listaEmLinhas(equipe, 'equipe').slice(1),
    ],
  ),
];
