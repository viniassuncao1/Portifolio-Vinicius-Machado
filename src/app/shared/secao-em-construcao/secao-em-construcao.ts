import { Component } from '@angular/core';

import { comum, linha, palavraChave, paragrafo, vazia } from '../editor-de-codigo/conteudo';
import type { ConteudoDoEditor } from '../editor-de-codigo/conteudo';
import { EditorDeCodigo } from '../editor-de-codigo/editor-de-codigo';

const CONTEUDO: ConteudoDoEditor = [
  vazia(),
  linha(0, palavraChave('public class'), comum('  EmConstrucao {')),
  vazia(),
  paragrafo(1, 'Esta seção está em construção. Volte em breve para ver o conteúdo completo.'),
  linha(0, comum('}')),
];

/** Conteúdo provisório das rotas cujas seções ainda não foram implementadas. */
@Component({
  selector: 'app-secao-em-construcao',
  imports: [EditorDeCodigo],
  template: `<app-editor-de-codigo [conteudo]="conteudo" />`,
})
export class SecaoEmConstrucao {
  protected readonly conteudo = CONTEUDO;
}
