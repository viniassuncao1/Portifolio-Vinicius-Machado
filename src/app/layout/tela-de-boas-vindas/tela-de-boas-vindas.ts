import { NgOptimizedImage } from '@angular/common';
import {
  ApplicationRef,
  Component,
  DOCUMENT,
  DestroyRef,
  afterNextRender,
  computed,
  inject,
  signal,
} from '@angular/core';

import { BoasVindas } from '../../core/boas-vindas';

const MOVIMENTO_REDUZIDO = '(prefers-reduced-motion: reduce)';
const DURACAO_MINIMA_MS = 600;
const TETO_MS = 2000;
const TETO_COM_MOVIMENTO_REDUZIDO_MS = 1000;
/** Duração do fade de saída (`--duracao-media`); um teto de tempo garante a remoção sem animationend. */
const SAIDA_MS = 200;

const ETAPAS = [
  'Starting PortfolioApplication using Java 21',
  'Initializing Spring embedded WebApplicationContext',
  'Started PortfolioApplication in 1.8 seconds',
] as const;

/**
 * Tela de boas-vindas no estilo da splash do IntelliJ: uma camada sobre a página, só no navegador
 * e uma vez por sessão. O conteúdo pré-renderizado fica no DOM o tempo todo; o resto da casca só
 * fica `inert` enquanto a tela está aberta (no máximo 2 s). Fecha quando passou 0,6 s, as fontes
 * carregaram e o app está estável, com teto rígido de 2 s (1 s com movimento reduzido). A barra
 * avança pelas etapas reais e completa ao fechar. Não tem botão de pular nem rouba o foco.
 */
@Component({
  selector: 'app-tela-de-boas-vindas',
  imports: [NgOptimizedImage],
  templateUrl: './tela-de-boas-vindas.html',
  styleUrl: './tela-de-boas-vindas.scss',
})
export class TelaDeBoasVindas {
  private readonly documento = inject(DOCUMENT);
  private readonly aplicacao = inject(ApplicationRef);
  private readonly boasVindas = inject(BoasVindas);
  private readonly temporizadores: ReturnType<typeof setTimeout>[] = [];
  private bloqueados: Element[] = [];
  private movimentoReduzido = false;

  protected readonly estado = signal<'oculta' | 'aberta' | 'saindo'>('oculta');
  /** Etapas já cumpridas (1 a 3): a barra e a linha de status acompanham. */
  protected readonly etapa = signal(1);
  protected readonly linhaDeStatus = computed(() => ETAPAS[Math.min(this.etapa(), 3) - 1]);
  /** Fração da barra (0 a 1), animada só por `transform`. */
  protected readonly progresso = computed(() =>
    this.estado() === 'saindo' ? 1 : this.etapa() / 3,
  );

  constructor() {
    inject(DestroyRef).onDestroy(() => this.encerrar());
    afterNextRender(() => this.iniciar());
  }

  private iniciar(): void {
    if (!this.boasVindas.registrarPrimeiraVista()) return;
    const janela = this.documento.defaultView;
    this.movimentoReduzido = janela?.matchMedia?.(MOVIMENTO_REDUZIDO).matches ?? false;
    this.bloquearOResto();
    this.estado.set('aberta');

    const inicio = Date.now();
    let fontes = false;
    let estavel = false;
    const tentarFechar = (): void => {
      if (!fontes || !estavel) return;
      const falta = DURACAO_MINIMA_MS - (Date.now() - inicio);
      if (falta > 0) this.agendar(tentarFechar, falta);
      else this.fechar();
    };

    // Teto rígido: fecha mesmo que as fontes ou a estabilidade não terminem.
    this.agendar(
      () => this.fechar(),
      this.movimentoReduzido ? TETO_COM_MOVIMENTO_REDUZIDO_MS : TETO_MS,
    );
    const fontesPromessa: Promise<unknown> = this.documento.fonts?.ready ?? Promise.resolve();
    void fontesPromessa.then(() => {
      fontes = true;
      this.etapa.update((e) => Math.max(e, 2));
      tentarFechar();
    });
    void this.aplicacao.whenStable().then(() => {
      estavel = true;
      this.etapa.update((e) => Math.max(e, 3));
      tentarFechar();
    });
  }

  private fechar(): void {
    if (this.estado() !== 'aberta') return;
    this.cancelarTemporizadores();
    this.etapa.set(3);
    this.liberarOResto();
    this.boasVindas.avisarInicializacao();
    if (this.movimentoReduzido) {
      this.estado.set('oculta');
      return;
    }
    this.estado.set('saindo');
    this.agendar(() => this.estado.set('oculta'), SAIDA_MS);
  }

  /** O resto da página fica inerte só enquanto a tela está aberta; ela mesma e o conteúdo seguem no DOM. */
  private bloquearOResto(): void {
    const host = this.documento.querySelector('app-tela-de-boas-vindas');
    const irmaos = Array.from(host?.parentElement?.children ?? []).filter((el) => el !== host);
    this.bloqueados = irmaos.filter((el) => !el.hasAttribute('inert'));
    this.bloqueados.forEach((el) => el.setAttribute('inert', ''));
  }

  private liberarOResto(): void {
    this.bloqueados.forEach((el) => el.removeAttribute('inert'));
    this.bloqueados = [];
  }

  private agendar(acao: () => void, ms: number): void {
    this.temporizadores.push(setTimeout(acao, ms));
  }

  private cancelarTemporizadores(): void {
    this.temporizadores.forEach(clearTimeout);
    this.temporizadores.length = 0;
  }

  private encerrar(): void {
    this.cancelarTemporizadores();
    this.liberarOResto();
  }
}
