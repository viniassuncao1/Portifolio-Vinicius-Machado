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

/** Conteúdo de cada página da seção (telas 05 e 06 e 23 a 27), no estilo de leitura (ADR-0011). */
export const CONTEUDOS_SKILLS: readonly ConteudoDoEditor[] = [
  [
    vazia(),
    linha(0, palavraChave('package'), comum(' dev.vinicius.portfolio.skills;')),
    vazia(),
    linha(0, palavraChave('import'), comum(' java.util.List;')),
    vazia(),
    linha(0, comentario('// Linguagens, frameworks e bancos de dados que uso')),
    linha(0, palavraChave('public class'), comum(' Skills {')),
    vazia(),
    linha(1, palavraChave('record'), comum(' Tecnologias(')),
    linha(3, comum('List<String> linguagens,')),
    linha(3, comum('List<String> frameworks,')),
    linha(3, comum('List<String> bancosDeDados) {}')),
    vazia(),
    linha(1, comum('Tecnologias minhas = '), palavraChave('new'), comum(' Tecnologias(')),
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
    linha(0, palavraChave('class'), comum(' Infraestrutura {')),
    vazia(),
    linha(1, palavraChave('record'), comum(' Ferramentas(')),
    linha(3, comum('List<String> nuvemEInfra,')),
    linha(3, comum('List<String> ferramentas) {}')),
    vazia(),
    linha(1, comum('Ferramentas minhas = '), palavraChave('new'), comum(' Ferramentas(')),
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
    linha(0, palavraChave('enum'), comum(' NivelDeConhecimento {')),
    linha(
      1,
      comum('DominioDiario('),
      literal('"Domínio diário: uso todo dia no trabalho"'),
      comum('),'),
    ),
    linha(
      1,
      comum('ProjetoCompleto('),
      literal('"Projeto completo: já entreguei um projeto inteiro com ela"'),
      comum('),'),
    ),
    linha(1, comum('UsoPontual('), literal('"Uso pontual: usei em tarefas isoladas"'), comum('),')),
    linha(
      1,
      comum('ConhecimentoTeorico('),
      literal('"Conhecimento teórico: estudei, mas ainda não usei em produção"'),
      comum(');'),
    ),
    vazia(),
    linha(1, comum('String descricao;')),
    vazia(),
    linha(1, comum('NivelDeConhecimento(String descricao) {')),
    linha(2, palavraChave('this'), comum('.descricao = descricao;')),
    linha(1, comum('}')),
    linha(0, comum('}')),
    vazia(),
    linha(0, comentario('// Tecnologias de cada nível')),
    linha(
      0,
      palavraChave('record'),
      comum(' Habilidades(NivelDeConhecimento nivel, List<String> tecnologias) {'),
    ),
    linha(1, palavraChave('static'), comum(' List<Habilidades> porNivel = List.of(')),
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
    linha(0, comum('}')),
  ],
];
