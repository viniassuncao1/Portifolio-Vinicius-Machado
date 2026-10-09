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
  readonly constante: string;
  readonly nome: string;
  readonly horas: number;
  readonly concluidoEm: readonly [ano: number, mes: number, dia: number];
}

const CURSOS_POR_PAGINA = 3;

const CURSOS: readonly Curso[] = [
  {
    constante: 'SPRING_BOOT',
    nome: 'Spring Boot 3: desenvolva uma API Rest em Java',
    horas: 10,
    concluidoEm: [2025, 12, 19],
  },
  {
    constante: 'SPRING_DATA_JPA',
    nome: 'Java: persistência de dados e consultas com Spring Data JPA',
    horas: 16,
    concluidoEm: [2025, 12, 9],
  },
  {
    constante: 'JAVA_API_E_ARQUIVOS',
    nome: 'Java: consumindo API, gravando arquivos e lidando com erros',
    horas: 10,
    concluidoEm: [2025, 11, 5],
  },
  {
    constante: 'HTTP',
    nome: 'HTTP: entendendo a web por baixo dos panos',
    horas: 10,
    concluidoEm: [2025, 10, 14],
  },
  {
    constante: 'ANGULAR',
    nome: 'Angular: construa uma aplicação web com componentes, template e CLI',
    horas: 8,
    concluidoEm: [2025, 9, 22],
  },
  {
    constante: 'TYPESCRIPT',
    nome: 'TypeScript na prática: implemente um projeto completo',
    horas: 12,
    concluidoEm: [2025, 9, 11],
  },
  {
    constante: 'PYTHON_PARA_DADOS',
    nome: 'Python para Dados: primeiros passos',
    horas: 10,
    concluidoEm: [2025, 4, 8],
  },
  {
    constante: 'PYTHON_ORIENTACAO_A_OBJETOS',
    nome: 'Python: avance na Orientação a Objetos e consuma API',
    horas: 8,
    concluidoEm: [2025, 3, 27],
  },
  {
    constante: 'GIT_E_GITHUB',
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
      palavraChave('static final'),
      declaracao(' Certification'),
      comum(` ${c.constante} = `),
      palavraChave('new'),
      comum(' Certification('),
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

const registro: readonly Linha[] = [
  linha(1, comentario('// Cada curso tem o nome, as horas e a data de conclusão')),
  linha(
    1,
    palavraChave('record'),
    comum(' Certification('),
    declaracao('String course'),
    comum(', '),
    declaracao('int hours'),
    comum(', '),
    declaracao('LocalDate completedOn'),
    comum(') {}'),
  ),
  vazia(),
];

const pagina = (cursos: readonly Curso[], comRegistro: boolean): ConteudoDoEditor => [
  vazia(),
  linha(0, palavraChave('import'), comum(' java.time.LocalDate;')),
  vazia(),
  linha(0, palavraChave('public class'), comum('  Certifications {')),
  vazia(),
  ...(comRegistro ? registro : []),
  linha(1, comentario('// Cursos concluídos, do mais recente para o mais antigo')),
  ...cursos.flatMap(curso),
  linha(0, comum('}')),
];

/** Um item por página, três cursos em cada: `/certificacoes`, `/certificacoes/2` e `/3`. */
export const CONTEUDOS_CERTIFICACOES: readonly ConteudoDoEditor[] = Array.from(
  { length: Math.ceil(CURSOS.length / CURSOS_POR_PAGINA) },
  (_, i) => pagina(CURSOS.slice(i * CURSOS_POR_PAGINA, (i + 1) * CURSOS_POR_PAGINA), i === 0),
);
