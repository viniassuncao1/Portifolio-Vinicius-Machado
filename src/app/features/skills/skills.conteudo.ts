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

/** O arquivo `Skills.java` inteiro: tecnologias, ferramentas e o nível de conhecimento de cada uma. */
export const CONTEUDO_SKILLS: ConteudoDoEditor = [
  vazia(),
  linha(0, palavraChave('package'), comum(' dev.vinicius.portfolio.skills;')),
  vazia(),
  linha(0, palavraChave('import'), comum(' java.util.List;')),
  vazia(),
  linha(0, palavraChave('public class'), comum(' Skills {')),
  vazia(),
  linha(1, comentario('// Linguagens, frameworks e bancos de dados que uso')),
  linha(1, palavraChave('record'), comum(' Tecnologias(')),
  linha(3, comum('List<String> linguagens,')),
  linha(3, comum('List<String> frameworks,')),
  linha(3, comum('List<String> bancosDeDados) {}')),
  vazia(),
  linha(1, comum('Tecnologias principais = '), palavraChave('new'), comum(' Tecnologias(')),
  linha(3, ...listaDeTextos(['Java', 'TypeScript', 'JavaScript', 'PHP', 'SQL'], ',')),
  linha(3, ...listaDeTextos(['Spring Boot', 'Spring Data JPA', 'Angular'], ',')),
  linha(3, ...listaDeTextos(['Oracle', 'PostgreSQL', 'MySQL'], '')),
  linha(1, comum(');')),
  vazia(),
  linha(1, comentario('// Nuvem, infraestrutura e ferramentas do dia a dia')),
  linha(1, palavraChave('record'), comum(' Ferramentas(')),
  linha(3, comum('List<String> nuvemEInfra,')),
  linha(3, comum('List<String> ferramentas) {}')),
  vazia(),
  linha(1, comum('Ferramentas doDiaADia = '), palavraChave('new'), comum(' Ferramentas(')),
  linha(3, ...listaDeTextos(['Docker', 'Kubernetes', 'Nginx', 'AWS', 'Azure'], ',')),
  linha(3, ...listaDeTextos(['Git', 'GitLab CI/CD', 'Grafana', 'Scrum'], '')),
  linha(1, comum(');')),
  vazia(),
  linha(1, comentario('// Quanto conheço cada tecnologia')),
  linha(1, palavraChave('enum'), comum(' NivelDeConhecimento {')),
  linha(
    2,
    comum('DominioDiario('),
    literal('"Domínio diário: uso todo dia no trabalho"'),
    comum('),'),
  ),
  linha(
    2,
    comum('ProjetoCompleto('),
    literal('"Projeto completo: já entreguei um projeto inteiro com ela"'),
    comum('),'),
  ),
  linha(2, comum('UsoPontual('), literal('"Uso pontual: usei em tarefas isoladas"'), comum('),')),
  linha(
    2,
    comum('ConhecimentoTeorico('),
    literal('"Conhecimento teórico: estudei, mas ainda não usei em produção"'),
    comum(');'),
  ),
  vazia(),
  linha(2, comum('String descricao;')),
  vazia(),
  linha(2, comum('NivelDeConhecimento(String descricao) {')),
  linha(3, palavraChave('this'), comum('.descricao = descricao;')),
  linha(2, comum('}')),
  linha(1, comum('}')),
  vazia(),
  linha(1, comentario('// Tecnologias de cada nível')),
  linha(
    1,
    palavraChave('record'),
    comum(' Habilidades(NivelDeConhecimento nivel, List<String> tecnologias) {}'),
  ),
  vazia(),
  linha(1, comum('List<Habilidades> porNivel = List.of(')),
  linha(3, palavraChave('new'), comum(' Habilidades(NivelDeConhecimento.DominioDiario,')),
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
    comum(' Habilidades(NivelDeConhecimento.ProjetoCompleto, '),
    ...listaDeTextos(['PHP'], '),'),
  ),
  linha(
    3,
    palavraChave('new'),
    comum(' Habilidades(NivelDeConhecimento.UsoPontual, '),
    ...listaDeTextos(['React Native', 'CI/CD'], '),'),
  ),
  linha(3, palavraChave('new'), comum(' Habilidades(NivelDeConhecimento.ConhecimentoTeorico,')),
  linha(5, ...listaDeTextos(['Python', 'AWS', 'Azure', 'Docker', 'Kubernetes'], '));')),
  vazia(),
  linha(0, comum('}')),
];
