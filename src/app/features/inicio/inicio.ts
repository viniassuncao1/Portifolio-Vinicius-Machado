import { Component } from '@angular/core';

import { SecaoEmConstrucao } from '../../shared/secao-em-construcao/secao-em-construcao';

// Provisório até a tarefa 5.1 trazer o conteúdo da tela 01; o h1 vem da casca.
@Component({
  selector: 'app-inicio',
  imports: [SecaoEmConstrucao],
  template: `<app-secao-em-construcao />`,
})
export class Inicio {}
