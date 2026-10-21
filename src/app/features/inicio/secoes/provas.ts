import { Component } from '@angular/core';

import { PROVAS } from '../../../core/perfil';
import { Contador } from '../../../shared/movimento/contador';

/** Quatro fatos curtos, todos já afirmados nas seções do site; os números contam ao entrar na janela. */
@Component({
  selector: 'app-provas',
  imports: [Contador],
  template: `
    <ul class="provas" aria-label="O Vinicius em números">
      @for (prova of provas; track prova.rotulo) {
        <li class="prova">
          <span class="valor"
            ><span [appContador]="prova.valor">{{ prova.valor }}</span
            >{{ prova.sufixo }}</span
          >
          <span class="rotulo">{{ prova.rotulo }}</span>
        </li>
      }
    </ul>
  `,
  styleUrl: './provas.scss',
})
export class Provas {
  protected readonly provas = PROVAS;
}
