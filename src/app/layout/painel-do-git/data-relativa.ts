const SEGUNDOS_POR_UNIDADE: readonly (readonly [Intl.RelativeTimeFormatUnit, number])[] = [
  ['year', 365 * 24 * 3600],
  ['month', 30 * 24 * 3600],
  ['week', 7 * 24 * 3600],
  ['day', 24 * 3600],
  ['hour', 3600],
  ['minute', 60],
];

/**
 * Data relativa em pt-BR ("há 3 dias", "ontem"). Só roda no navegador, depois que o painel abre:
 * no servidor `agora` seria a hora do build e a hidratação divergiria.
 */
export function dataRelativa(iso: string, agora: Date): string {
  const formato = new Intl.RelativeTimeFormat('pt-BR', { numeric: 'auto' });
  const segundos = (new Date(iso).getTime() - agora.getTime()) / 1000;
  for (const [unidade, duracao] of SEGUNDOS_POR_UNIDADE) {
    if (Math.abs(segundos) >= duracao)
      return formato.format(Math.trunc(segundos / duracao), unidade);
  }
  return 'agora há pouco';
}

/** Data e hora por extenso, para o título da data e para os detalhes. */
export const dataCompleta = (iso: string): string =>
  new Intl.DateTimeFormat('pt-BR', { dateStyle: 'long', timeStyle: 'short' }).format(new Date(iso));
