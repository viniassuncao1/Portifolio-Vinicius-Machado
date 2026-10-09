import { TestBed } from '@angular/core/testing';
import { TitleStrategy, provideRouter } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';

import { EstrategiaDeTitulo } from '../core/estrategia-de-titulo';
import { SECOES } from '../core/secoes';
import { SecaoEmConstrucao } from '../shared/secao-em-construcao/secao-em-construcao';
import { Casca } from './casca/casca';

const MOVIMENTO_REDUZIDO = 'prefers-reduced-motion: reduce';

/** Percorre as regras (inclusive as aninhadas em @media) e devolve as que o filtro aceita. */
function coletarRegras(
  regras: CSSRuleList,
  dentroDeMovimentoReduzido: boolean,
): { texto: string; reduzido: boolean }[] {
  return Array.from(regras).flatMap((regra) => {
    if (regra instanceof CSSMediaRule) {
      const reduzido =
        dentroDeMovimentoReduzido || regra.conditionText.includes(MOVIMENTO_REDUZIDO);
      return coletarRegras(regra.cssRules, reduzido);
    }
    return [{ texto: regra.cssText, reduzido: dentroDeMovimentoReduzido }];
  });
}

describe('Movimento reduzido na casca', () => {
  let raiz: HTMLElement;
  let regras: { texto: string; reduzido: boolean }[];

  beforeEach(async () => {
    TestBed.configureTestingModule({
      providers: [
        provideRouter([
          {
            path: '',
            component: Casca,
            children: SECOES.map((secao) => ({
              path: secao.slug,
              title: secao.titulo,
              component: SecaoEmConstrucao,
            })),
          },
        ]),
        { provide: TitleStrategy, useExisting: EstrategiaDeTitulo },
      ],
    });
    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl(`/${SECOES[0].slug}`);
    raiz = harness.routeNativeElement as HTMLElement;
    document.body.append(raiz);
    regras = Array.from(document.styleSheets).flatMap((folha) =>
      coletarRegras(folha.cssRules, false),
    );
  });

  afterEach(() => raiz.remove());

  const comTransicao = (seletor: string, reduzido: boolean) =>
    regras.filter(
      (regra) =>
        regra.reduzido === reduzido &&
        regra.texto.includes(seletor) &&
        regra.texto.includes('transition'),
    );

  it.each(['.seta', '.item', 'app-painel-lateral'])(
    'anima %s por padrão e desliga a transição com movimento reduzido',
    (seletor) => {
      const normais = comTransicao(seletor, false);
      const reduzidas = comTransicao(seletor, true);

      expect(normais.length).toBeGreaterThan(0);
      expect(reduzidas.length).toBeGreaterThan(0);
      expect(reduzidas.every((regra) => /transition(-property)?: none/.test(regra.texto))).toBe(
        true,
      );
    },
  );

  it('anima a gaveta e a árvore só com transform, rotate e opacity', () => {
    const animadas = regras
      .filter((regra) => !regra.reduzido && /\.seta|\.item|app-painel-lateral/.test(regra.texto))
      .map((regra) => /transition[^;]*;/.exec(regra.texto)?.[0] ?? '')
      .join(' ');

    expect(animadas).not.toMatch(/background|width|height|margin|padding|inset|left|top/);
  });
});
