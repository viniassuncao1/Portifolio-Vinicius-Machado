import { DOCUMENT } from '@angular/common';
import {
  Component,
  ElementRef,
  Injector,
  afterNextRender,
  computed,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { Router } from '@angular/router';

import { ARQUIVO_INICIO, SECOES } from '../../core/secoes';

interface Resultado {
  readonly arquivo: string;
  readonly titulo: string;
  readonly rota: string;
}

const ARQUIVOS: readonly Resultado[] = [
  { arquivo: ARQUIVO_INICIO, titulo: 'Início', rota: '/' },
  ...SECOES.map((secao) => ({
    arquivo: secao.arquivo,
    titulo: secao.titulo,
    rota: `/${secao.slug}`,
  })),
];

/** Minúsculas e sem acentos: "Experiências" casa com "exp". */
const normalizar = (texto: string): string =>
  texto.normalize('NFD').replace(/\p{M}/gu, '').toLowerCase();

/**
 * Busca de seções no estilo "Go to File": um `<dialog>` modal com combobox WAI-ARIA. Ctrl/Cmd+P
 * (tratado pela casca) ou o botão da faixa de abas chamam `abrir()`.
 */
@Component({
  selector: 'app-busca-de-secoes',
  templateUrl: './busca-de-secoes.html',
  styleUrl: './busca-de-secoes.scss',
})
export class BuscaDeSecoes {
  private readonly router = inject(Router);
  private readonly documento = inject(DOCUMENT);
  private readonly injector = inject(Injector);
  private readonly dialogo = viewChild.required<ElementRef<HTMLDialogElement>>('dialogo');
  private readonly campo = viewChild.required<ElementRef<HTMLInputElement>>('campo');
  private focoAnterior: HTMLElement | null = null;

  protected readonly consulta = signal('');
  protected readonly indiceAtivo = signal(0);
  protected readonly resultados = computed(() => {
    const termo = normalizar(this.consulta().trim());
    return ARQUIVOS.filter((r) => normalizar(`${r.arquivo} ${r.titulo}`).includes(termo));
  });
  protected readonly resumo = computed(() => {
    const total = this.resultados().length;
    if (total === 0) return 'Nenhum resultado';
    return total === 1 ? '1 resultado' : `${total} resultados`;
  });
  protected readonly idDoAtivo = computed(() =>
    this.resultados().length > 0 ? `opcao-busca-${this.indiceAtivo()}` : null,
  );

  abrir(): void {
    const dialogo = this.dialogo().nativeElement;
    if (dialogo.open) return;
    this.focoAnterior = this.documento.activeElement as HTMLElement | null;
    this.consulta.set('');
    this.indiceAtivo.set(0);
    // O binding [value] não reescreve o DOM se a consulta já era '' no último render: zera o campo.
    this.campo().nativeElement.value = '';
    dialogo.showModal();
    this.campo().nativeElement.focus();
  }

  protected digitar(texto: string): void {
    this.consulta.set(texto);
    this.indiceAtivo.set(0);
  }

  protected aoTeclar(evento: KeyboardEvent): void {
    const total = this.resultados().length;
    switch (evento.key) {
      case 'ArrowDown':
        this.mover(evento, total ? (this.indiceAtivo() + 1) % total : 0);
        break;
      case 'ArrowUp':
        this.mover(evento, total ? (this.indiceAtivo() - 1 + total) % total : 0);
        break;
      case 'Enter':
        evento.preventDefault();
        this.escolher(this.resultados()[this.indiceAtivo()]);
        break;
    }
  }

  protected escolher(resultado: Resultado | undefined): void {
    if (!resultado) return;
    this.dialogo().nativeElement.close();
    void this.router.navigateByUrl(resultado.rota);
  }

  /** Devolve o foco para onde estava (Escape, escolha ou clique fora). */
  protected aoFechar(): void {
    this.focoAnterior?.focus();
    this.focoAnterior = null;
  }

  protected cliqueNoFundo(evento: MouseEvent): void {
    if (evento.target === this.dialogo().nativeElement) this.dialogo().nativeElement.close();
  }

  private mover(evento: KeyboardEvent, indice: number): void {
    evento.preventDefault();
    this.indiceAtivo.set(indice);
    afterNextRender(
      () =>
        this.documento
          .getElementById(`opcao-busca-${indice}`)
          ?.scrollIntoView?.({ block: 'nearest' }),
      { injector: this.injector },
    );
  }
}
