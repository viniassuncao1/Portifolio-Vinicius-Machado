import {
  CLASSES_COMPILADAS,
  CLIQUE_ATE_O_PORTFOLIO_MS,
  INICIO_DA_REVELACAO_MS,
  INSTANTE_DO_STARTED_MS,
  LINHA_DO_TEMPO,
  PIOR_CASO_SEM_CLIQUE_MS,
  caminhoDaClasse,
  instanteDaClasse,
  instanteDaLinhaDoLog,
} from './linha-do-tempo-da-abertura';
import { QUANTIDADE_DE_MENSAGENS_DO_LOG } from './log-do-spring';

describe('linha do tempo da abertura', () => {
  it('compila 16 classes, na ordem da árvore e terminando em PortfolioApplication', () => {
    expect(CLASSES_COMPILADAS).toEqual([
      'sobre/SobreMim',
      'sobre/Diferenciais',
      'sobre/ComoUsoIA',
      'skills/Skills',
      'experiencias/Experiencias',
      'projetos/Projeto1',
      'projetos/Projeto2',
      'projetos/Projeto3',
      'projetos/Projeto4',
      'formacao/Certificacoes',
      'formacao/Eventos',
      'formacao/Formacao',
      'formacao/Idiomas',
      'recomendacoes/Depoimentos',
      'contato/Contato',
      'PortfolioApplication',
    ]);
  });

  it('lista o caminho do pacote Java de cada classe', () => {
    expect(caminhoDaClasse(CLASSES_COMPILADAS[0])).toBe(
      'dev/vinicius/portfolio/sobre/SobreMim.java',
    );
    expect(caminhoDaClasse('PortfolioApplication')).toBe(
      'dev/vinicius/portfolio/PortfolioApplication.java',
    );
  });

  it('o splash tem 4 etapas dentro dos 3 s, que enchem a barra, e o teto é de 5 s', () => {
    const { etapas, splash, tetoDoSplash } = LINHA_DO_TEMPO;

    expect(etapas.map((e) => e.em)).toEqual([400, 1100, 1800, 2500]);
    expect(etapas.at(-1)?.progresso).toBe(1);
    expect(etapas[2].texto).toBe(`Indexing ${CLASSES_COMPILADAS.length} Java classes…`);
    expect(Math.max(...etapas.map((e) => e.em)) + 500).toBeLessThanOrEqual(splash + 400);
    expect(splash).toBeLessThan(tetoDoSplash);
  });

  it('as classes aparecem a cada 60 ms, da primeira (260) à última (1160)', () => {
    expect(instanteDaClasse(0)).toBe(LINHA_DO_TEMPO.primeiraClasse);
    expect(instanteDaClasse(CLASSES_COMPILADAS.length - 1)).toBe(1160);
    expect(instanteDaClasse(15)).toBeLessThan(LINHA_DO_TEMPO.tarefas[0].em);
  });

  it('as tarefas do Gradle vêm antes da troca para a aba Run', () => {
    expect(LINHA_DO_TEMPO.tarefas.map((t) => t.nome)).toEqual([
      ':processResources',
      ':classes',
      ':bootRun',
    ]);
    expect(LINHA_DO_TEMPO.tarefas.at(-1)?.em).toBeLessThan(LINHA_DO_TEMPO.trocaParaRun);
  });

  it('o log tem 9 mensagens, uma a cada 150 ms, e o Started chega aos 2940 ms', () => {
    expect(QUANTIDADE_DE_MENSAGENS_DO_LOG).toBe(9);
    expect(instanteDaLinhaDoLog(0)).toBe(1740);
    expect(INSTANTE_DO_STARTED_MS).toBe(2940);
    expect(LINHA_DO_TEMPO.banner).toBeLessThan(LINHA_DO_TEMPO.primeiraLinhaDoLog);
  });

  it('a revelação começa depois da pausa de leitura de 500 ms', () => {
    expect(INICIO_DA_REVELACAO_MS).toBe(3440);
  });

  it('do clique ao portfólio leva cerca de 4,2 s, abaixo do teto de 5 s', () => {
    expect(CLIQUE_ATE_O_PORTFOLIO_MS).toBe(3440 + LINHA_DO_TEMPO.fimDaRevelacao);
    expect(CLIQUE_ATE_O_PORTFOLIO_MS).toBeCloseTo(4200, -2);
    expect(CLIQUE_ATE_O_PORTFOLIO_MS).toBeLessThanOrEqual(LINHA_DO_TEMPO.tetoDaExecucao);
  });

  it('sem clique, o ▶ executa sozinho aos 5 s e o pior caso fica em ~12 s', () => {
    expect(LINHA_DO_TEMPO.execucaoAutomatica).toBe(5000);
    expect(PIOR_CASO_SEM_CLIQUE_MS).toBeCloseTo(12000, -3);
  });

  it('o movimento reduzido lê o log por mais tempo, com fades de 150 ms', () => {
    expect(LINHA_DO_TEMPO.reduzido).toEqual({ pausaDeLeitura: 1200, fade: 150 });
  });
});
