import { comum, linha, literal, palavraChave, vazia } from '../../shared/editor-de-codigo/conteudo';
import type { ConteudoDoEditor, Linha } from '../../shared/editor-de-codigo/conteudo';

/** `List.of(...)` com um item por linha, como em código Java formatado. */
function listaDeTextos(recuo: number, itens: readonly string[], fim: string): readonly Linha[] {
  return [
    linha(recuo, comum('List.of(')),
    ...itens.map((item, i) =>
      linha(recuo + 1, literal(`"${item}"`), ...(i < itens.length - 1 ? [comum(',')] : [])),
    ),
    linha(recuo, comum(`)${fim}`)),
  ];
}

/** Conteúdo de cada página da seção (telas 05 e 06), na ordem das páginas. */
export const CONTEUDOS_SKILLS: readonly ConteudoDoEditor[] = [
  [
    vazia(),
    linha(0, palavraChave('import'), comum(' java.util.List;')),
    vazia(),
    linha(0, palavraChave('public record'), comum(' TechSkills(')),
    linha(2, comum('List<String> languages,')),
    linha(2, comum('List<String> frameworks,')),
    linha(2, comum('List<String> databases')),
    linha(0, comum(') {')),
    vazia(),
    linha(
      1,
      palavraChave('public static final'),
      comum(' TechSkills CORE = '),
      palavraChave('new'),
      comum(' TechSkills('),
    ),
    ...listaDeTextos(3, ['Java', 'TypeScript', 'JavaScript', 'PHP', 'SQL'], ','),
    ...listaDeTextos(3, ['Spring Boot', 'Spring Data JPA', 'Angular'], ','),
    ...listaDeTextos(3, ['Oracle', 'PostgreSQL', 'MySQL'], ''),
    linha(1, comum(');')),
    linha(0, comum('}')),
  ],
  [
    vazia(),
    linha(0, palavraChave('import'), comum(' java.util.List;')),
    vazia(),
    linha(0, palavraChave('public record'), comum(' InfraSkills(')),
    linha(2, comum('List<String> cloudAndInfra,')),
    linha(2, comum('List<String> tools')),
    linha(0, comum(') {')),
    vazia(),
    linha(
      1,
      palavraChave('public static final'),
      comum(' InfraSkills CORE = '),
      palavraChave('new'),
      comum(' InfraSkills('),
    ),
    ...listaDeTextos(3, ['Docker', 'Kubernetes', 'Nginx', 'AWS', 'Azure'], ','),
    ...listaDeTextos(3, ['Git', 'GitLab CI/CD', 'Grafana', 'Scrum'], ''),
    linha(1, comum(');')),
    linha(0, comum('}')),
  ],
];
