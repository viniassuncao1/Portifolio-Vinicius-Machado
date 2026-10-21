/** Luminância relativa de uma cor `#rrggbb` (WCAG 2.x). */
function luminancia(hex: string): number {
  const [r, g, b] = [1, 3, 5].map((i) => {
    const canal = parseInt(hex.slice(i, i + 2), 16) / 255;
    return canal <= 0.03928 ? canal / 12.92 : ((canal + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/** Razão de contraste (de 1 a 21) entre duas cores `#rrggbb`, na ordem que for. */
export function razaoDeContraste(corA: string, corB: string): number {
  const [maior, menor] = [luminancia(corA), luminancia(corB)].sort((a, b) => b - a);
  return (maior + 0.05) / (menor + 0.05);
}
