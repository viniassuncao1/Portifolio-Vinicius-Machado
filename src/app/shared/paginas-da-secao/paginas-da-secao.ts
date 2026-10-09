import { Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';

/**
 * Controle `◂ 1/2 ▸` abaixo do código de uma seção com várias páginas. Não aparece com uma só.
 * Não existe no design: é o mínimo para navegar entre as telas de uma mesma seção.
 */
@Component({
  selector: 'app-paginas-da-secao',
  imports: [RouterLink],
  templateUrl: './paginas-da-secao.html',
  styleUrl: './paginas-da-secao.scss',
})
export class PaginasDaSecao {
  readonly slug = input.required<string>();
  readonly pagina = input.required<number>();
  readonly total = input.required<number>();

  protected readonly anterior = computed(() => this.rotaDaPagina(this.pagina() - 1));
  protected readonly proxima = computed(() => this.rotaDaPagina(this.pagina() + 1));

  private rotaDaPagina(pagina: number): readonly (string | number)[] {
    return pagina === 1 ? ['/', this.slug()] : ['/', this.slug(), pagina];
  }
}
