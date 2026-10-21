import { Directive, ElementRef, afterNextRender, inject, signal } from '@angular/core';

import { MovimentoConfig } from '../../core/movimento/movimento-config';

/**
 * A frase passa de cinza a branco, palavra por palavra, enquanto o visitante rola até ela
 * (`animation-timeline: view()`, em `_movimento.scss`). O HTML pré-renderizado é o texto inteiro, no
 * estado final; as palavras só são separadas em `<span>` depois da hidratação, e só quando o
 * navegador tem a rolagem animada em CSS e há movimento. As duas cores (`--s-secundario` e
 * `--s-texto`) passam em 4,5:1 sobre o fundo, então a frase é legível em qualquer ponto da rolagem.
 */
@Directive({ selector: '[appFraseQueSeAcende]', host: { '[class.frase-acesa]': 'ativa()' } })
export class FraseQueSeAcende {
  protected readonly ativa = signal(false);

  constructor() {
    const elemento = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
    const movimento = inject(MovimentoConfig);

    afterNextRender(() => {
      const suportado = globalThis.CSS?.supports?.('animation-timeline: view()') ?? false;
      if (!suportado || !movimento.deveAnimar()) return;
      const palavras = (elemento.textContent ?? '').trim().split(/\s+/).filter(Boolean);
      if (palavras.length === 0) return;
      // O texto completo fica num atributo `aria-label`; os trechos viram decorativos para o leitor.
      elemento.setAttribute('aria-label', palavras.join(' '));
      elemento.style.setProperty('--n', String(palavras.length));
      elemento.replaceChildren(
        ...palavras.flatMap((palavra, i) => {
          const trecho = elemento.ownerDocument.createElement('span');
          trecho.className = 'w';
          trecho.setAttribute('aria-hidden', 'true');
          trecho.style.setProperty('--i', String(i));
          trecho.textContent = palavra;
          return i < palavras.length - 1
            ? [trecho, elemento.ownerDocument.createTextNode(' ')]
            : [trecho];
        }),
      );
      this.ativa.set(true);
    });
  }
}
