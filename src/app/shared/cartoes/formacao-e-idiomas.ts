import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { FORMACAO, IDIOMAS } from '../../core/perfil';
import { FraseQueSeAcende } from '../movimento/frase-que-se-acende';

@Component({
  selector: 'app-formacao-e-idiomas',
  imports: [FraseQueSeAcende, RouterLink],
  templateUrl: './formacao-e-idiomas.html',
  styleUrl: './formacao-e-idiomas.scss',
})
export class FormacaoEIdiomas {
  protected readonly formacao = FORMACAO;
  protected readonly idiomas = IDIOMAS;
}
