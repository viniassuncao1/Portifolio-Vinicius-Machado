import { SECOES } from './secoes';
import { QUANTIDADE_DE_MENSAGENS_DO_LOG } from './log-do-spring';

/**
 * Linha do tempo da abertura (openspec `abertura-com-run`, design.md e storyboard.md). Só números e
 * listas puras, sem DOM: o serviço `Abertura` agenda os passos por aqui e os testes conferem os
 * totais. Todos os tempos em milissegundos; `t` zera no início de cada ato.
 */

/**
 * Todos os tempos da abertura, em milissegundos. `em` e os demais instantes de cada ato contam desde
 * o início do ato (splash, clique no ▶, revelação), como no storyboard.
 */
export const LINHA_DO_TEMPO = {
  /** O splash dura 3 s e nunca passa de 5 s (rede lenta). */
  splash: 3000,
  tetoDoSplash: 5000,
  /** Degraus da barra do splash: começam em `em` e levam 500 ms (400 ms no último). */
  etapas: [
    { em: 400, progresso: 0.25, texto: 'Opening Portfolio_Vinicius…' },
    { em: 1100, progresso: 0.5, texto: 'Resolving Gradle dependencies…' },
    { em: 1800, progresso: 0.8, texto: 'Indexing 16 Java classes…' },
    { em: 2500, progresso: 1, texto: 'Project ready' },
  ],
  /** Pronto: pulso do ▶, dica aos 3 s e execução automática aos 5 s. Não há como pular. */
  pulsoInicial: 300,
  dicaEm: 3000,
  execucaoAutomatica: 5000,
  /** Build, desde o clique. As classes entram de `primeiraClasse`, uma a cada `intervaloEscalonado`. */
  janelaEntra: 80,
  compileJava: 200,
  primeiraClasse: 260,
  intervaloEscalonado: 60,
  tarefas: [
    { em: 1220, nome: ':processResources' },
    { em: 1280, nome: ':classes' },
    { em: 1340, nome: ':bootRun' },
  ],
  trocaParaRun: 1460,
  /** Log do Spring: banner, depois as 9 mensagens e a pausa de leitura sem nada se mexer. */
  banner: 1580,
  primeiraLinhaDoLog: 1740,
  intervaloDoLog: 150,
  pausaDeLeitura: 500,
  /** Revelação, desde o fim da pausa. */
  recolher: 360,
  fimDaRevelacao: 720,
  /** Tetos: o clique ao portfólio e quanto o aviso fica na barra de status. */
  tetoDaExecucao: 5000,
  tetoDoAviso: 6000,
  /** Movimento reduzido: log completo de uma vez, pausa maior e fades curtos. */
  reduzido: { pausaDeLeitura: 1200, fade: 150 },
} as const;

/** Instante, desde o clique, em que a classe `indice` (0 a N-1) aparece no Build. */
export const instanteDaClasse = (indice: number): number =>
  LINHA_DO_TEMPO.primeiraClasse + indice * LINHA_DO_TEMPO.intervaloEscalonado;

/** Instante, desde o clique, em que a mensagem `indice` aparece no log. */
export const instanteDaLinhaDoLog = (indice: number): number =>
  LINHA_DO_TEMPO.primeiraLinhaDoLog + indice * LINHA_DO_TEMPO.intervaloDoLog;

/** Desde o clique: a última mensagem (`Started PortfolioApplication`) aparece neste instante. */
export const INSTANTE_DO_STARTED_MS = instanteDaLinhaDoLog(QUANTIDADE_DE_MENSAGENS_DO_LOG - 1);

/** Quando a IDE começa a aparecer, desde o clique: depois da pausa de leitura. */
export const INICIO_DA_REVELACAO_MS = INSTANTE_DO_STARTED_MS + LINHA_DO_TEMPO.pausaDeLeitura;

/** Do clique até o portfólio pronto (cerca de 4,2 s; o teto é `tetoDaExecucao`). */
export const CLIQUE_ATE_O_PORTFOLIO_MS = INICIO_DA_REVELACAO_MS + LINHA_DO_TEMPO.fimDaRevelacao;

/** Sem clique: splash, espera pela execução automática e do clique ao portfólio (~12 s). */
export const PIOR_CASO_SEM_CLIQUE_MS =
  LINHA_DO_TEMPO.splash + LINHA_DO_TEMPO.execucaoAutomatica + CLIQUE_ATE_O_PORTFOLIO_MS;

// --- Classes compiladas ---------------------------------------------------------------------

const APLICACAO = 'PortfolioApplication';
const RAIZ_DOS_PACOTES = 'dev/vinicius/portfolio';

/**
 * As classes que o Build mostra compilando (`sobre/SobreMim`, …): uma por seção, na ordem da árvore
 * (`secoes.ts`, pacote + arquivo), terminando em `PortfolioApplication`. O Gradle real não lista
 * arquivo por arquivo; é uma licença para o visitante reconhecer as seções no que compila.
 */
export const CLASSES_COMPILADAS: readonly string[] = [
  ...SECOES.map((secao) => `${secao.pacote}/${secao.arquivo.replace(/\.java$/, '')}`),
  APLICACAO,
];

/** Caminho do arquivo como o Build lista: `sobre/SobreMim` vira `dev/vinicius/portfolio/sobre/SobreMim.java`. */
export const caminhoDaClasse = (classe: string): string => `${RAIZ_DOS_PACOTES}/${classe}.java`;
