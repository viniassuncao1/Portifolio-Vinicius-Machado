/// <reference types="node" />
import { compile } from 'sass';

import { razaoDeContraste } from './contraste';

type Papel = 'fundo' | 'texto' | 'secundario' | 'linha' | 'acento' | 'acento-2' | 'sobre-acento';
type Tema = Record<Papel, string>;

const MINIMO = 4.5;
const SECOES = ['hero', 'sobre', 'stack', 'formacao', 'projetos', 'contato'] as const;
const PAPEIS: readonly Papel[] = [
  'fundo',
  'texto',
  'secundario',
  'linha',
  'acento',
  'acento-2',
  'sobre-acento',
];

/** Pares (texto, fundo) que precisam de 4,5:1. A linha é decorativa e fica de fora. */
const PARES: readonly (readonly [Papel, Papel])[] = [
  ['texto', 'fundo'],
  ['secundario', 'fundo'],
  ['acento', 'fundo'],
  ['acento-2', 'fundo'],
  ['sobre-acento', 'acento'],
];

/** Lê as variáveis `--s-*` de cada regra do CSS compilado, por tema (escuro/claro) e seção. */
function temasCompilados(): Record<'escuro' | 'claro', Partial<Record<string, Partial<Tema>>>> {
  const css = compile('src/styles/_tokens.scss').css;
  const temas: Record<'escuro' | 'claro', Partial<Record<string, Partial<Tema>>>> = {
    escuro: {},
    claro: {},
  };

  for (const [, seletores, corpo] of css.matchAll(/([^{}]+)\{([^{}]*)\}/g)) {
    for (const seletor of seletores.split(',').map((s) => s.trim())) {
      const forma =
        /^:root(\[data-tema=["']?claro["']?\])?(?:\[data-secao=["']?([\w-]+)["']?\])?$/.exec(
          seletor,
        );
      if (!forma) continue;
      const tema = forma[1] ? 'claro' : 'escuro';
      const secao = forma[2] ?? 'hero';
      const atual = (temas[tema][secao] ??= {});
      for (const [, nome, valor] of corpo.matchAll(/--s-([\w-]+):\s*(#[0-9a-f]{6})\s*;/gi)) {
        atual[nome as Papel] = valor;
      }
    }
  }
  return temas;
}

describe('temas de cor por seção', () => {
  const temas = temasCompilados();

  for (const nomeDoTema of ['escuro', 'claro'] as const) {
    for (const secao of SECOES) {
      describe(`${secao} (${nomeDoTema})`, () => {
        const tema = temas[nomeDoTema][secao];

        it('define os sete papéis', () => {
          expect(Object.keys(tema ?? {}).sort()).toEqual([...PAPEIS].sort());
        });

        for (const [texto, fundo] of PARES) {
          it(`${texto} sobre ${fundo} tem pelo menos ${MINIMO}:1`, () => {
            const razao = razaoDeContraste(tema?.[texto] ?? '#000000', tema?.[fundo] ?? '#000000');

            expect(
              razao,
              `${secao}/${nomeDoTema}: ${texto} ${tema?.[texto]} sobre ${fundo} ${tema?.[fundo]}`,
            ).toBeGreaterThanOrEqual(MINIMO);
          });
        }
      });
    }
  }

  it('o teste reprova um par abaixo do mínimo', () => {
    expect(razaoDeContraste('#777777', '#808080')).toBeLessThan(MINIMO);
  });
});
