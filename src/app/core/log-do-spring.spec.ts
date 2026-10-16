import { dataDoLog, montarBanner, montarLog, montarLogCompleto } from './log-do-spring';

const INICIO = new Date(2026, 9, 14, 15, 2, 11, 482);

describe('montarBanner', () => {
  it('tem o banner do Spring e a linha da versão, sem mensagens', () => {
    const linhas = montarBanner();

    expect(linhas).toHaveLength(7);
    expect(linhas.at(-1)?.texto).toContain(':: Spring Boot ::');
    expect(linhas.every((linha) => !linha.texto.includes('INFO'))).toBe(true);
  });
});

describe('montarLogCompleto', () => {
  it('junta banner, linha em branco e as 9 mensagens', () => {
    const linhas = montarLogCompleto(INICIO);

    expect(linhas).toHaveLength(7 + 1 + 9);
    expect(linhas[7].texto).toBe('');
    expect(linhas.at(-1)).toEqual(montarLog(INICIO).at(-1));
  });
});

describe('montarLog', () => {
  it('tem só as 9 mensagens INFO, sem o banner', () => {
    const linhas = montarLog(INICIO);

    expect(linhas).toHaveLength(9);
    expect(linhas.every((linha) => linha.texto.includes(' INFO '))).toBe(true);
  });

  it('tem as linhas de inicialização, da primeira ao Started', () => {
    const texto = montarLog(INICIO)
      .map((linha) => linha.texto)
      .join('\n');

    expect(texto).toContain('Starting PortfolioApplication using Java 21');
    expect(texto).toContain("Tomcat started on port 8080 (http) with context path '/'");
    expect(montarLog(INICIO).at(-1)?.texto).toContain(
      'Started PortfolioApplication in 1.8 seconds',
    );
  });

  it('formata as linhas como o Spring Boot 3: data, nível, PID, thread, logger e mensagem', () => {
    const linha = montarLog(INICIO).at(-1)!.texto;

    expect(linha).toMatch(
      /^2026-10-14T15:02:1\d\.\d{3}[+-]\d{2}:\d{2}\s{2}INFO \d{4} --- \[ {11}main\] \S.{39} : Started/,
    );
  });

  it('gera a data e o PID a partir do instante recebido, não de valores fixos', () => {
    const outra = new Date(2027, 0, 2, 3, 4, 5, 6);

    expect(montarLog(outra).at(-1)?.texto).toContain('2027-01-02T03:04:');
    expect(montarLog(INICIO).at(-1)?.texto).not.toContain('2027-01-02');
  });

  it('separa os trechos para as cores por papel', () => {
    const papeis = montarLog(INICIO)
      .at(-1)!
      .trechos.map((trecho) => trecho.papel);

    expect(papeis).toEqual(
      expect.arrayContaining(['data', 'nivel', 'pid', 'thread', 'logger', 'mensagem']),
    );
  });

  it('traz o logger curto logo depois do logger, sem mudar o texto corrido da linha', () => {
    const linha = montarLog(INICIO).at(-1)!;
    const papeis = linha.trechos.map((trecho) => trecho.papel);
    const curto = linha.trechos[papeis.indexOf('logger-curto')];

    expect(papeis.indexOf('logger-curto')).toBe(papeis.indexOf('logger') + 1);
    expect(curto.texto).toBe('PortfolioApplication');
    expect(linha.texto).not.toContain('logger-curto');
    expect(linha.texto).toMatch(/ d\.v\.portfolio\.PortfolioApplication {2,}: Started/);
  });

  it('tem um logger curto em todas as mensagens', () => {
    const curtos = montarLog(INICIO).map(
      (linha) => linha.trechos.find((t) => t.papel === 'logger-curto')?.texto,
    );

    expect(curtos.every((texto) => !!texto)).toBe(true);
    expect(new Set(curtos)).toEqual(
      new Set([
        'PortfolioApplication',
        'TomcatWebServer',
        'StandardService',
        'StandardEngine',
        '[localhost].[/]',
        'ServletWebServerAppCtx',
      ]),
    );
  });

  it('tem a data com o deslocamento do fuso', () => {
    expect(dataDoLog(INICIO)).toMatch(/^2026-10-14T15:02:11\.482[+-]\d{2}:\d{2}$/);
  });
});
