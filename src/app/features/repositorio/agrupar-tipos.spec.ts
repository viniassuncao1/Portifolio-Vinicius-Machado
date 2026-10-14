import type { ContagemPorTipo } from '../../core/git/resumo';
import { agruparTiposPequenos } from './agrupar-tipos';

const tipo = (nome: string, porcentagem: number): ContagemPorTipo => ({
  tipo: nome,
  quantidade: Math.round(porcentagem),
  porcentagem,
});

describe('agruparTiposPequenos', () => {
  it('reúne em outros os tipos abaixo de 3% e os sem tipo, e lista quais entram', () => {
    const agrupados = agruparTiposPequenos([
      tipo('docs', 40),
      tipo('feat', 50),
      tipo('ci', 2),
      tipo('build', 1.5),
      tipo('style', 0.4),
      tipo('outros', 0.3),
    ]);

    expect(agrupados.map((t) => t.tipo)).toEqual(['docs', 'feat', 'outros']);
    expect(agrupados[2].reunidos).toBe('ci, build, style e sem tipo');
    expect(agrupados[2].porcentagem).toBeCloseTo(4.2);
    expect(agrupados[2].quantidade).toBe(2 + 2 + 0 + 0);
  });

  it('mantém os tipos de 3% ou mais', () => {
    const tipos = [tipo('feat', 90), tipo('fix', 7), tipo('chore', 3)];

    expect(agruparTiposPequenos(tipos)).toBe(tipos);
  });

  it('não renomeia um tipo pequeno que está sozinho', () => {
    const tipos = [tipo('feat', 98), tipo('perf', 2)];

    expect(agruparTiposPequenos(tipos)).toBe(tipos);
  });

  it('com dois tipos pequenos, junta e lista os dois', () => {
    const agrupados = agruparTiposPequenos([tipo('feat', 96), tipo('ci', 2), tipo('build', 2)]);

    expect(agrupados[1].reunidos).toBe('ci e build');
  });

  it('devolve lista vazia sem tipos', () => {
    expect(agruparTiposPequenos([])).toEqual([]);
  });
});
