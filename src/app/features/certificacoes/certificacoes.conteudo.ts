import {
  comentario,
  comum,
  declaracao,
  linha,
  literal,
  palavraChave,
  valor,
  vazia,
} from '../../shared/editor-de-codigo/conteudo';
import type { ConteudoDoEditor, Linha } from '../../shared/editor-de-codigo/conteudo';

/** Um curso concluído: as telas 19 a 21 (design/telas), do mais recente para o mais antigo. */
interface Curso {
  /** Nome da variável Java do curso. */
  readonly variavel: string;
  readonly nome: string;
  readonly horas: number;
  readonly concluidoEm: readonly [ano: number, mes: number, dia: number];
}

const CURSOS: readonly Curso[] = [
  {
    variavel: 'springBoot',
    nome: 'Spring Boot 3: desenvolva uma API Rest em Java',
    horas: 10,
    concluidoEm: [2025, 12, 19],
  },
  {
    variavel: 'springDataJpa',
    nome: 'Java: persistência de dados e consultas com Spring Data JPA',
    horas: 16,
    concluidoEm: [2025, 12, 9],
  },
  {
    variavel: 'javaApiEArquivos',
    nome: 'Java: consumindo API, gravando arquivos e lidando com erros',
    horas: 10,
    concluidoEm: [2025, 11, 5],
  },
  {
    variavel: 'http',
    nome: 'HTTP: entendendo a web por baixo dos panos',
    horas: 10,
    concluidoEm: [2025, 10, 14],
  },
  {
    variavel: 'angular',
    nome: 'Angular: construa uma aplicação web com componentes, template e CLI',
    horas: 8,
    concluidoEm: [2025, 9, 22],
  },
  {
    variavel: 'typescript',
    nome: 'TypeScript na prática: implemente um projeto completo',
    horas: 12,
    concluidoEm: [2025, 9, 11],
  },
  {
    variavel: 'pythonParaDados',
    nome: 'Python para Dados: primeiros passos',
    horas: 10,
    concluidoEm: [2025, 4, 8],
  },
  {
    variavel: 'pythonOrientadoAObjetos',
    nome: 'Python: avance na Orientação a Objetos e consuma API',
    horas: 8,
    concluidoEm: [2025, 3, 27],
  },
  {
    variavel: 'gitEGithub',
    nome: 'Git e GitHub: repositório, commit e versões',
    horas: 8,
    concluidoEm: [2025, 3, 25],
  },
];

const curso = (c: Curso): readonly Linha[] => {
  const [ano, mes, dia] = c.concluidoEm;
  return [
    linha(
      1,
      declaracao('Certificacao'),
      comum(` ${c.variavel} = `),
      palavraChave('new'),
      comum(' Certificacao('),
    ),
    linha(2, literal(`"${c.nome}"`), comum(',')),
    linha(
      2,
      valor(String(c.horas)),
      comum(', LocalDate.of('),
      valor(String(ano)),
      comum(', '),
      valor(String(mes)),
      comum(', '),
      valor(String(dia)),
      comum('));'),
    ),
    vazia(),
  ];
};

/**
 * Conteúdo da seção (telas 19 a 21) num arquivo só: o cabeçalho e o record uma vez, e os nove
 * cursos num bloco, do mais recente para o mais antigo.
 */
export const CONTEUDO_CERTIFICACOES: ConteudoDoEditor = [
  vazia(),
  linha(0, palavraChave('package'), comum(' dev.vinicius.portfolio.formacao;')),
  vazia(),
  linha(0, palavraChave('import'), comum(' java.time.LocalDate;')),
  vazia(),
  linha(0, palavraChave('public class'), comum(' Certificacoes {')),
  vazia(),
  linha(1, comentario('// Cada curso tem o nome, as horas e a data de conclusão')),
  linha(
    1,
    palavraChave('record'),
    comum(' Certificacao('),
    declaracao('String curso'),
    comum(', '),
    declaracao('int horas'),
    comum(', '),
    declaracao('LocalDate concluidoEm'),
    comum(') {}'),
  ),
  vazia(),
  linha(1, comentario('// Cursos concluídos, do mais recente para o mais antigo')),
  ...CURSOS.flatMap(curso),
  linha(0, comum('}')),
];
