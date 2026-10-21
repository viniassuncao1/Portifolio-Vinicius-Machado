import { NgOptimizedImage } from '@angular/common';
import {
  Component,
  DestroyRef,
  Service,
  afterNextRender,
  computed,
  effect,
  inject,
  signal,
  untracked,
} from '@angular/core';
import { RouterLink } from '@angular/router';

import { Abertura } from '../../core/abertura';
import { MovimentoConfig } from '../../core/movimento/movimento-config';
import { MOVIMENTO } from '../../core/movimento/movimento.tokens';
import { ENDERECO_DO_CURRICULO, PERFIL } from '../../core/perfil';
import { Magnetico } from '../../shared/movimento/magnetico';

type TipoDeTrecho = 'palavra' | 'texto' | 'comum';
type Trecho = readonly [texto: string, tipo: TipoDeTrecho];

/** O que o hero "digita": a classe do perfil, que se resolve no cartão logo em seguida. */
const CODIGO: readonly (readonly Trecho[])[] = [
  [
    ['public class ', 'palavra'],
    ['ViniciusMachado ', 'comum'],
    ['extends ', 'palavra'],
    ['DesenvolvedorFullStack {', 'comum'],
  ],
  [
    ['    String ', 'palavra'],
    ['cargo = ', 'comum'],
    ['"Full Stack"', 'texto'],
    [';', 'comum'],
  ],
  [
    ['    List<String> ', 'palavra'],
    ['stack = List.of(', 'comum'],
    ['"Java"', 'texto'],
    [', ', 'comum'],
    ['"Spring Boot"', 'texto'],
    [', ', 'comum'],
    ['"Angular"', 'texto'],
    [', ', 'comum'],
    ['"SQL"', 'texto'],
    [');', 'comum'],
  ],
  [
    ['    boolean ', 'palavra'],
    ['disponivel = ', 'comum'],
    ['true', 'palavra'],
    [';', 'comum'],
  ],
  [['}', 'comum']],
];

const TOTAL_DE_CARACTERES = CODIGO.flat().reduce((soma, [texto]) => soma + texto.length, 0);
/** A digitação dura isto e o cartão aparece logo depois (spec `orientacao-do-visitante`: até 2,5 s). */
const DURACAO_DA_DIGITACAO_MS = 1500;
const PAUSA_ANTES_DO_CARTAO_MS = 350;

/**
 * Lembra se o hero já digitou nesta carga da página. É um serviço (um por aplicação) e não uma
 * variável do módulo para que cada teste comece do zero, em qualquer ordem de execução.
 */
@Service()
export class DigitacaoDoHero {
  private feita = false;

  /** `true` só na primeira chamada: a digitação acontece uma vez por carga da página. */
  marcar(): boolean {
    if (this.feita) return false;
    this.feita = true;
    return true;
  }
}

/**
 * Primeira dobra: nome, cargo, resumo e ações à esquerda (texto puro, que existe no HTML desde o
 * primeiro quadro, então a animação não atrasa o LCP) e, à direita, a janela da IDE: com movimento
 * ela digita a classe `ViniciusMachado` e se resolve no cartão de apresentação; sem movimento,
 * sem JavaScript e com movimento reduzido o cartão já está lá, sem digitação.
 */
@Component({
  selector: 'app-hero',
  imports: [NgOptimizedImage, RouterLink, Magnetico],
  templateUrl: './hero.html',
  styleUrl: './hero.scss',
})
export class Hero {
  private readonly movimento = inject(MovimentoConfig);
  private readonly abertura = inject(Abertura);
  private readonly digitacao = inject(DigitacaoDoHero);
  private readonly destruir = inject(DestroyRef);

  protected readonly perfil = PERFIL;
  protected readonly curriculo = ENDERECO_DO_CURRICULO;
  protected readonly codigo = CODIGO;

  /** `cartao` é o estado final e o do HTML; `digitando` só existe no navegador, com movimento. */
  protected readonly fase = signal<'cartao' | 'digitando'>('cartao');
  private readonly caracteres = signal(0);
  protected readonly pronto = signal(false);
  private rodando = false;

  /** Quantos caracteres de cada linha já foram digitados. */
  protected readonly visivel = computed(() => {
    let restante = this.caracteres();
    return CODIGO.map((linha) =>
      linha.map(([texto]) => {
        const mostrar = Math.max(0, Math.min(restante, texto.length));
        restante -= texto.length;
        return mostrar;
      }),
    );
  });

  constructor() {
    afterNextRender(() => this.pronto.set(true));
    // Espera a abertura (a janela de Run) sair de cena para digitar à vista.
    effect(() => {
      if (!this.pronto() || this.abertura.ativa()) return;
      untracked(() => void this.iniciar());
    });
  }

  private async iniciar(): Promise<void> {
    if (this.rodando || !this.movimento.deveAnimar({ essencial: true })) return;
    if (!this.digitacao.marcar()) return;
    this.rodando = true;
    this.fase.set('digitando');
    const inicio = performance.now();
    let quadro = 0;
    let pausa: ReturnType<typeof setTimeout> | undefined;
    const passo = (agora: number) => {
      const fracao = Math.min(1, (agora - inicio) / DURACAO_DA_DIGITACAO_MS);
      this.caracteres.set(Math.floor(fracao * TOTAL_DE_CARACTERES));
      if (fracao < 1) quadro = requestAnimationFrame(passo);
      else pausa = setTimeout(() => this.fase.set('cartao'), PAUSA_ANTES_DO_CARTAO_MS);
    };
    quadro = requestAnimationFrame(passo);
    this.destruir.onDestroy(() => {
      cancelAnimationFrame(quadro);
      clearTimeout(pausa);
    });
  }

  protected readonly duracaoDaTroca = `${MOVIMENTO.duracao.lenta}s`;
}
