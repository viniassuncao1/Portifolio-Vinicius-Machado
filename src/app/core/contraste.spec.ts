import { razaoDeContraste } from './contraste';

describe('razaoDeContraste', () => {
  it('dá 21 entre preto e branco, em qualquer ordem', () => {
    expect(razaoDeContraste('#000000', '#ffffff')).toBeCloseTo(21, 5);
    expect(razaoDeContraste('#ffffff', '#000000')).toBeCloseTo(21, 5);
  });

  it('dá 1 entre cores iguais', () => {
    expect(razaoDeContraste('#de60d2', '#de60d2')).toBeCloseTo(1, 5);
  });

  it('reproduz o contraste medido do cinza de apoio sobre o fundo do hero', () => {
    expect(razaoDeContraste('#aaaaaa', '#1c1c1c')).toBeCloseTo(7.34, 1);
  });
});
