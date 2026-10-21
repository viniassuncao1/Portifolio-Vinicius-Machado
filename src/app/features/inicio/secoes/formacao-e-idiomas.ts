import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { FORMACAO, IDIOMAS } from '../../../core/perfil';

@Component({
  selector: 'app-formacao-e-idiomas',
  imports: [RouterLink],
  templateUrl: './formacao-e-idiomas.html',
  styleUrl: './formacao-e-idiomas.scss',
})
export class FormacaoEIdiomas {
  protected readonly formacao = FORMACAO;
  protected readonly idiomas = IDIOMAS;
}
