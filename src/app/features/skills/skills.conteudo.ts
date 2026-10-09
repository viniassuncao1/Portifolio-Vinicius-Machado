import {
  comentario,
  comum,
  linha,
  literal,
  palavraChave,
  vazia,
} from '../../shared/editor-de-codigo/conteudo';
import type { ConteudoDoEditor, Trecho } from '../../shared/editor-de-codigo/conteudo';

/** Textos entre aspas separados por vírgula, para caber numa linha só (até cinco itens). */
function textos(itens: readonly string[]): readonly Trecho[] {
  return itens.flatMap((item, i) =>
    i === 0 ? [literal(`"${item}"`)] : [comum(', '), literal(`"${item}"`)],
  );
}

/** `List.of("A", "B", ...)` fechado com `fim` (`,` ou nada). */
const listaDeTextos = (itens: readonly string[], fim: string): readonly Trecho[] => [
  comum('List.of('),
  ...textos(itens),
  comum(`)${fim}`),
];

/** Conteúdo de cada página da seção (telas 05 e 06 e 23 a 27), na ordem das páginas. */
export const CONTEUDOS_SKILLS: readonly ConteudoDoEditor[] = [
  [
    vazia(),
    linha(0, palavraChave('import'), comum(' java.util.List;')),
    vazia(),
    linha(0, comentario('// Linguagens, frameworks e bancos de dados que uso')),
    linha(0, palavraChave('public record'), comum(' TechSkills(')),
    linha(2, comum('List<String> languages,')),
    linha(2, comum('List<String> frameworks,')),
    linha(2, comum('List<String> databases')),
    linha(0, comum(') {')),
    vazia(),
    linha(
      1,
      palavraChave('public static final'),
      comum(' TechSkills MY_SKILLS = '),
      palavraChave('new'),
      comum(' TechSkills('),
    ),
    linha(3, ...listaDeTextos(['Java', 'TypeScript', 'JavaScript', 'PHP', 'SQL'], ',')),
    linha(3, ...listaDeTextos(['Spring Boot', 'Spring Data JPA', 'Angular'], ',')),
    linha(3, ...listaDeTextos(['Oracle', 'PostgreSQL', 'MySQL'], '')),
    linha(1, comum(');')),
    linha(0, comum('}')),
  ],
  [
    vazia(),
    linha(0, palavraChave('import'), comum(' java.util.List;')),
    vazia(),
    linha(0, comentario('// Nuvem, infraestrutura e ferramentas do dia a dia')),
    linha(0, palavraChave('public record'), comum(' InfraSkills(')),
    linha(2, comum('List<String> cloudAndInfra,')),
    linha(2, comum('List<String> tools')),
    linha(0, comum(') {')),
    vazia(),
    linha(
      1,
      palavraChave('public static final'),
      comum(' InfraSkills MY_SKILLS = '),
      palavraChave('new'),
      comum(' InfraSkills('),
    ),
    linha(3, ...listaDeTextos(['Docker', 'Kubernetes', 'Nginx', 'AWS', 'Azure'], ',')),
    linha(3, ...listaDeTextos(['Git', 'GitLab CI/CD', 'Grafana', 'Scrum'], '')),
    linha(1, comum(');')),
    linha(0, comum('}')),
  ],
  [
    vazia(),
    linha(0, palavraChave('import'), comum(' java.util.List;')),
    vazia(),
    linha(0, comentario('// Quanto conheço cada tecnologia')),
    linha(0, palavraChave('public enum'), comum(' KnowledgeLevel {')),
    linha(
      1,
      comum('DAILY_MASTERY('),
      literal('"Domínio diário: uso todo dia no trabalho"'),
      comum('),'),
    ),
    linha(
      1,
      comum('FULL_PROJECT('),
      literal('"Projeto completo: já entreguei um projeto inteiro com ela"'),
      comum('),'),
    ),
    linha(
      1,
      comum('OCCASIONAL_USE('),
      literal('"Uso pontual: usei em tarefas isoladas"'),
      comum('),'),
    ),
    linha(
      1,
      comum('THEORETICAL('),
      literal('"Conhecimento teórico: estudei, mas ainda não usei em produção"'),
      comum(');'),
    ),
    vazia(),
    linha(1, palavraChave('private final'), comum(' String description;')),
    vazia(),
    linha(1, comum('KnowledgeLevel(String description) {')),
    linha(2, palavraChave('this'), comum('.description = description;')),
    linha(1, comum('}')),
    linha(0, comum('}')),
    vazia(),
    linha(0, comentario('// Tecnologias de cada nível')),
    linha(
      0,
      palavraChave('record'),
      comum(' LevelSkills(KnowledgeLevel level, List<String> technologies) {'),
    ),
    linha(1, palavraChave('static final'), comum(' List<LevelSkills> MY_LEVELS = List.of(')),
    linha(3, palavraChave('new'), comum(' LevelSkills(KnowledgeLevel.DAILY_MASTERY,')),
    linha(
      5,
      comum('List.of('),
      ...textos(['Java', 'Spring Boot', 'Angular', 'PostgreSQL']),
      comum(','),
    ),
    linha(7, ...textos(['Oracle', 'TypeScript', 'Git']), comum(')),')),
    linha(
      3,
      palavraChave('new'),
      comum(' LevelSkills(KnowledgeLevel.FULL_PROJECT, '),
      ...listaDeTextos(['PHP'], '),'),
    ),
    linha(
      3,
      palavraChave('new'),
      comum(' LevelSkills(KnowledgeLevel.OCCASIONAL_USE, '),
      ...listaDeTextos(['React Native', 'CI/CD'], '),'),
    ),
    linha(3, palavraChave('new'), comum(' LevelSkills(KnowledgeLevel.THEORETICAL,')),
    linha(5, ...listaDeTextos(['Python', 'AWS', 'Azure', 'Docker', 'Kubernetes'], '));')),
    linha(0, comum('}')),
  ],
];
