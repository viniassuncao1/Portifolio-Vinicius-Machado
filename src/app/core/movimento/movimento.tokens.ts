/**
 * Tokens do movimento em JavaScript (ADR-0019): única fonte das durações (segundos, como a
 * biblioteca `motion` espera), curvas, distâncias, escalas e molas. As skills do ECC `motion-*`
 * definem os mesmos papéis para React; aqui eles são usados pelas diretivas em
 * `shared/movimento/`. Nada de duração ou mola escrita direto num componente. Os tokens de CSS
 * ficam em `src/styles/_movimento.scss`.
 */
export const MOVIMENTO = {
  duracao: { instante: 0.08, rapida: 0.18, normal: 0.35, lenta: 0.6, longa: 1 },
  curva: {
    suave: [0.22, 1, 0.36, 1],
    seca: [0.4, 0, 0.2, 1],
    salto: [0.34, 1.56, 0.64, 1],
    linear: [0, 0, 1, 1],
  },
  distancia: { xs: 4, sm: 8, md: 16, lg: 24, xl: 48 },
  escala: { sutil: 0.98, pressionar: 0.95, destaque: 1.04 },
} as const;

/** Molas: `agil` é o padrão da interface; `suave` pousa cartões e painéis; `soltar` serve ao arrasto. */
export const MOLAS = {
  agil: { type: 'spring', stiffness: 300, damping: 30 },
  suave: { type: 'spring', stiffness: 120, damping: 14 },
  elastica: { type: 'spring', stiffness: 400, damping: 10 },
  instantanea: { type: 'spring', stiffness: 600, damping: 35 },
  soltar: { type: 'spring', stiffness: 200, damping: 20, restDelta: 0.001 },
} as const;
