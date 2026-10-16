export type PapelDoLog =
  | 'banner'
  | 'versao'
  | 'data'
  | 'nivel'
  | 'pid'
  | 'thread'
  | 'logger'
  | 'logger-curto'
  | 'mensagem';

export interface TrechoDoLog {
  readonly texto: string;
  readonly papel: PapelDoLog;
}

export interface LinhaDoLog {
  readonly trechos: readonly TrechoDoLog[];
  /** A linha como texto corrido, para quem copia ou ouve o log. */
  readonly texto: string;
}

/** Banner do Spring Boot, como o `spring-boot` imprime. */
const BANNER: readonly string[] = [
  '  .   ____          _            __ _ _',
  " /\\\\ / ___'_ __ _ _(_)_ __  __ _ \\ \\ \\ \\",
  "( ( )\\___ | '_ | '_| | '_ \\/ _` | \\ \\ \\ \\",
  ' \\\\/  ___)| |_)| | | | | || (_| |  ) ) ) )',
  "  '  |____| .__|_| |_|_| |_\\__, | / / / /",
  ' =========|_|==============|___/=/_/_/_/',
];

const VERSAO_DO_SPRING = ':: Spring Boot ::                (v3.5.0)';
const LARGURA_DO_LOGGER = 40;

interface Mensagem {
  readonly logger: string;
  /** Nome curto do logger, que o celular mostra no lugar do logger completo. */
  readonly loggerCurto: string;
  readonly texto: (pid: number) => string;
  /** Milissegundos depois da linha anterior. */
  readonly depois: number;
}

const MENSAGENS: readonly Mensagem[] = [
  {
    logger: 'd.v.portfolio.PortfolioApplication',
    loggerCurto: 'PortfolioApplication',
    texto: (pid) => `Starting PortfolioApplication using Java 21 with PID ${pid}`,
    depois: 0,
  },
  {
    logger: 'd.v.portfolio.PortfolioApplication',
    loggerCurto: 'PortfolioApplication',
    texto: () => 'No active profile set, falling back to 1 default profile: "default"',
    depois: 6,
  },
  {
    logger: 'o.s.b.w.embedded.tomcat.TomcatWebServer',
    loggerCurto: 'TomcatWebServer',
    texto: () => 'Tomcat initialized with port 8080 (http)',
    depois: 410,
  },
  {
    logger: 'o.apache.catalina.core.StandardService',
    loggerCurto: 'StandardService',
    texto: () => 'Starting service [Tomcat]',
    depois: 12,
  },
  {
    logger: 'o.apache.catalina.core.StandardEngine',
    loggerCurto: 'StandardEngine',
    texto: () => 'Starting Servlet engine: [Apache Tomcat/10.1.40]',
    depois: 3,
  },
  {
    logger: 'o.a.c.c.C.[Tomcat].[localhost].[/]',
    loggerCurto: '[localhost].[/]',
    texto: () => 'Initializing Spring embedded WebApplicationContext',
    depois: 24,
  },
  {
    logger: 'w.s.c.ServletWebServerApplicationContext',
    loggerCurto: 'ServletWebServerAppCtx',
    texto: () => 'Root WebApplicationContext: initialization completed in 612 ms',
    depois: 2,
  },
  {
    logger: 'o.s.b.w.embedded.tomcat.TomcatWebServer',
    loggerCurto: 'TomcatWebServer',
    texto: () => "Tomcat started on port 8080 (http) with context path '/'",
    depois: 640,
  },
  {
    logger: 'd.v.portfolio.PortfolioApplication',
    loggerCurto: 'PortfolioApplication',
    texto: () => 'Started PortfolioApplication in 1.8 seconds (process running for 2.1)',
    depois: 9,
  },
];

/** Quantas mensagens INFO o log tem (a última é o "Started"). */
export const QUANTIDADE_DE_MENSAGENS_DO_LOG = MENSAGENS.length;

const doisDigitos = (n: number): string => String(n).padStart(2, '0');

/** Data e hora no formato do log do Spring Boot 3: `2026-10-14T15:02:11.482-03:00`. */
export function dataDoLog(data: Date): string {
  const deslocamento = -data.getTimezoneOffset();
  const sinal = deslocamento >= 0 ? '+' : '-';
  const horas = doisDigitos(Math.trunc(Math.abs(deslocamento) / 60));
  const minutos = doisDigitos(Math.abs(deslocamento) % 60);
  return (
    `${data.getFullYear()}-${doisDigitos(data.getMonth() + 1)}-${doisDigitos(data.getDate())}` +
    `T${doisDigitos(data.getHours())}:${doisDigitos(data.getMinutes())}:${doisDigitos(data.getSeconds())}` +
    `.${String(data.getMilliseconds()).padStart(3, '0')}${sinal}${horas}:${minutos}`
  );
}

const LINHA_EM_BRANCO: LinhaDoLog = { texto: '', trechos: [] };

/** O banner do Spring e a linha `:: Spring Boot ::`, que aparecem de uma vez antes das mensagens. */
export function montarBanner(): readonly LinhaDoLog[] {
  const banner: LinhaDoLog[] = BANNER.map((texto) => ({
    texto,
    trechos: [{ texto, papel: 'banner' }],
  }));
  const versao: LinhaDoLog = {
    texto: VERSAO_DO_SPRING,
    trechos: [{ texto: VERSAO_DO_SPRING, papel: 'versao' }],
  };
  return [...banner, versao];
}

/**
 * As 9 mensagens INFO de inicialização do `PortfolioApplication`, no formato do Spring Boot 3 (data,
 * nível, PID, thread, logger e mensagem), sem o banner. Só o instante e o PID mudam: vêm do relógio
 * do navegador na abertura, então o pré-render nunca tem datas. A última é o "Started".
 */
export function montarLog(inicio: Date): readonly LinhaDoLog[] {
  const pid = 4000 + (inicio.getTime() % 5000);
  let instante = inicio.getTime();
  return MENSAGENS.map((mensagem): LinhaDoLog => {
    instante += mensagem.depois;
    const data = dataDoLog(new Date(instante));
    const thread = '[           main]';
    const logger = mensagem.logger.padEnd(LARGURA_DO_LOGGER);
    const texto = mensagem.texto(pid);
    return {
      texto: `${data}  INFO ${pid} --- ${thread} ${logger} : ${texto}`,
      trechos: [
        { texto: `${data}  `, papel: 'data' },
        { texto: 'INFO', papel: 'nivel' },
        { texto: ' ', papel: 'mensagem' },
        { texto: String(pid), papel: 'pid' },
        { texto: ` --- ${thread} `, papel: 'thread' },
        { texto: logger, papel: 'logger' },
        { texto: mensagem.loggerCurto, papel: 'logger-curto' },
        { texto: ` : ${texto}`, papel: 'mensagem' },
      ],
    };
  });
}

/** O log inteiro como a janela de Run mostra: banner, linha em branco e as mensagens. */
export const montarLogCompleto = (inicio: Date): readonly LinhaDoLog[] => [
  ...montarBanner(),
  LINHA_EM_BRANCO,
  ...montarLog(inicio),
];
