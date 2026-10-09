import {
  comum,
  linha,
  linhaApertada,
  literal,
  palavraChave,
  vazia,
  vaziaApertada,
} from '../../shared/editor-de-codigo/conteudo';
import type { ConteudoDoEditor } from '../../shared/editor-de-codigo/conteudo';

const CABECALHO = linha(0, palavraChave('public class'), comum('  TechSkills {'));

/** Array de strings como nas telas 05 e 06: cabeçalho, itens e `};`, todos na linha apertada. */
function arrayDeTextos(nome: string, itens: readonly string[]): ConteudoDoEditor {
  return [
    linhaApertada(1, comum(`String[] ${nome} = {`)),
    ...itens.map((item, i) =>
      linhaApertada(2, literal(`“${item}”`), ...(i < itens.length - 1 ? [comum(',')] : [])),
    ),
    linhaApertada(0, comum('};')),
  ];
}

/** Conteúdo de cada página da seção (telas 05 e 06), na ordem das páginas. */
export const CONTEUDOS_SKILLS: readonly ConteudoDoEditor[] = [
  [
    vazia(),
    CABECALHO,
    ...arrayDeTextos('linguagens', ['Java', 'TypeScript', 'JavaScript', 'PHP', 'SQL']),
    vaziaApertada(),
    ...arrayDeTextos('frameworks', ['Spring Boot', 'Spring Data JPA', 'Angular']),
    vaziaApertada(),
    ...arrayDeTextos('databases', ['Oracle', 'PostgreSQL', 'MySQL']),
  ],
  [
    vazia(),
    CABECALHO,
    ...arrayDeTextos('cloudAndInfra', ['Docker', 'Kubernetes', 'Nginx', 'AWS', 'Azure']),
    vaziaApertada(),
    ...arrayDeTextos('ferramentas', ['Git', 'GitLab CI/CD', 'Grafana', 'Scrum']),
  ],
];
