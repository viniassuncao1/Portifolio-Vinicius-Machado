import { dataCompleta, dataRelativa } from './data-relativa';

const AGORA = new Date('2026-10-14T12:00:00Z');

describe('dataRelativa', () => {
  it.each([
    ['2026-10-14T11:59:30Z', 'agora há pouco'],
    ['2026-10-14T11:55:00Z', 'há 5 minutos'],
    ['2026-10-14T09:00:00Z', 'há 3 horas'],
    ['2026-10-13T12:00:00Z', 'ontem'],
    ['2026-10-09T12:00:00Z', 'há 5 dias'],
    ['2026-09-01T12:00:00Z', 'mês passado'],
  ])('%s vira "%s"', (iso, esperado) => {
    expect(dataRelativa(iso, AGORA)).toBe(esperado);
  });

  it('mostra a data completa em pt-BR', () => {
    expect(dataCompleta('2026-10-14T12:00:00Z')).toContain('outubro de 2026');
  });
});
