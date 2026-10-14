import { dataDoLog, montarLog } from './log';

const INICIO = new Date(2026, 9, 14, 15, 2, 11, 482);

describe('montarLog', () => {
  it('tem o banner do Spring, a versão e as linhas de inicialização', () => {
    const texto = montarLog(INICIO)
      .map((linha) => linha.texto)
      .join('\n');

    expect(texto).toContain(':: Spring Boot ::');
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

  it('tem a data com o deslocamento do fuso', () => {
    expect(dataDoLog(INICIO)).toMatch(/^2026-10-14T15:02:11\.482[+-]\d{2}:\d{2}$/);
  });
});
