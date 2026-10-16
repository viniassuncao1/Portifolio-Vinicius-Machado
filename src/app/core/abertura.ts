import { DOCUMENT, PLATFORM_ID, Service, computed, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ApplicationRef } from '@angular/core';

import {
  CLASSES_COMPILADAS,
  INICIO_DA_REVELACAO_MS,
  INSTANTE_DO_STARTED_MS,
  LINHA_DO_TEMPO,
  caminhoDaClasse,
  instanteDaClasse,
  instanteDaLinhaDoLog,
} from './linha-do-tempo-da-abertura';
import { montarBanner, montarLog } from './log-do-spring';
import type { LinhaDoLog } from './log-do-spring';

export type FaseDaAbertura =
  'splash' | 'pronto' | 'compilando' | 'iniciando' | 'revelando' | 'encerrada';

/** Marca a sessão em que a abertura (ou o aviso, num link direto) já foi exibida. */
export const CHAVE_DA_ABERTURA = 'abertura-exibida';
/** Atributo no `<html>` ligado pelo script inline do `index.html`: só em `/`, com JavaScript. */
export const ATRIBUTO_DA_ABERTURA = 'data-abertura';
export const AVISO_DE_INICIALIZACAO = 'PortfolioApplication started in 1.8 s';

const MOVIMENTO_REDUZIDO = '(prefers-reduced-motion: reduce)';
/** Quanto o ▶ pulsa (um pulso curto, depois volta ao normal). */
const DURACAO_DO_PULSO_MS = 480;

/** O banner do Spring, a linha da versão e uma linha em branco, que entram de uma vez. */
const bannerDoSpring = (): readonly LinhaDoLog[] => [...montarBanner(), { texto: '', trechos: [] }];

/**
 * Abertura do site: splash, Run, build, log do Spring e a revelação da IDE. Só relógio e estado
 * (signals): o DOM, o foco e o `inert` ficam no componente `app-abertura`, e o movimento no CSS.
 * Acontece só em `/` e uma vez por sessão; num link direto não há abertura, só o aviso na barra
 * de status. Não há como pular: toda fase tem teto de tempo e, sem clique, a execução começa
 * sozinha. Com movimento reduzido as etapas são as mesmas, sem movimento.
 */
@Service()
export class Abertura {
  private readonly documento = inject(DOCUMENT);
  private readonly navegador = isPlatformBrowser(inject(PLATFORM_ID));
  private readonly aplicacao = inject(ApplicationRef);
  private temporizadores: ReturnType<typeof setTimeout>[] = [];
  private iniciada = false;
  private reduzidoNaExecucao = false;

  readonly fase = signal<FaseDaAbertura>('encerrada');
  /** No navegador, sem abertura nesta visita: o componente sai do DOM. */
  readonly dispensada = signal(false);
  readonly etapaTexto = signal<string>(LINHA_DO_TEMPO.etapas[0].texto);
  readonly progresso = signal(0);
  readonly pulso = signal(false);
  readonly dicaEmDestaque = signal(false);
  readonly tarefas = signal<readonly string[]>([]);
  readonly arquivosCompilados = signal<readonly string[]>([]);
  readonly totalDeClasses = CLASSES_COMPILADAS.length;
  readonly progressoDoBuild = signal(0);
  readonly buildConcluido = signal(false);
  readonly abaAtiva = signal<'build' | 'run'>('build');
  readonly linhasDoLog = signal<readonly LinhaDoLog[]>([]);
  readonly anuncio = signal('');
  readonly reduzido = signal(false);
  /** O logger mostra "Started" (a última linha do log) com destaque. */
  readonly iniciado = signal(false);
  readonly aviso = signal('');

  readonly ehMac = this.detectarMac();
  /** Atalho de executar mostrado e anunciado: ⌃R no Mac, ⇧F10 nos outros sistemas. */
  readonly atalho = this.ehMac ? '⌃R' : '⇧F10';
  readonly teclasDoAtalho = this.ehMac ? 'Control+R' : 'Shift+F10';
  /** A abertura está acontecendo (não é `encerrada`). */
  readonly ativa = computed(() => this.fase() !== 'encerrada');

  /** Começa a abertura, se esta visita pede, ou só o aviso, num link direto. Só no navegador. */
  iniciar(): void {
    if (!this.navegador || this.iniciada) return;
    this.iniciada = true;
    const raiz = this.documento.documentElement;
    const pedida = raiz.hasAttribute(ATRIBUTO_DA_ABERTURA);
    const primeiraDaSessao = this.registrarPrimeiraDaSessao();
    this.reduzido.set(this.movimentoReduzido());

    if (!pedida) {
      this.dispensada.set(true);
      if (primeiraDaSessao) this.avisar();
      return;
    }
    this.fase.set('splash');
    this.anunciar('Carregando o portfólio de Vinicius Machado');
    if (this.reduzido()) {
      this.progresso.set(1);
      this.etapaTexto.set(LINHA_DO_TEMPO.etapas.at(-1)?.texto ?? '');
      this.pronto();
      return;
    }
    this.rodarSplash();
  }

  /** O ▶ (clique, Enter ou atalho). Só vale com o projeto pronto. */
  executar(): void {
    if (this.fase() !== 'pronto') return;
    this.cancelar();
    this.reduzidoNaExecucao = this.movimentoReduzido();
    this.fase.set('compilando');
    this.pulso.set(false);
    if (this.reduzidoNaExecucao) {
      this.executarSemMovimento();
      return;
    }
    this.executarComMovimento();
  }

  /** Marca o fim da revelação: a abertura sai do DOM e o aviso passa a valer. */
  encerrar(): void {
    this.cancelar();
    // Os 6 s do aviso contam do fim da abertura (a revelação o põe na tela antes, como destino da janela).
    this.avisar();
    this.fase.set('encerrada');
    this.dispensada.set(true);
    this.documento.documentElement.removeAttribute(ATRIBUTO_DA_ABERTURA);
  }

  /** Cancela os temporizadores (ao destruir o componente). */
  cancelar(): void {
    this.temporizadores.forEach(clearTimeout);
    this.temporizadores = [];
  }

  // ---------- splash ----------

  private rodarSplash(): void {
    const { etapas, splash, tetoDoSplash } = LINHA_DO_TEMPO;
    let fontes = false;
    let estavel = false;
    let tempoMinimo = false;
    let seguiu = false;
    const seguir = (): void => {
      if (seguiu) return;
      seguiu = true;
      this.progresso.set(1);
      this.etapaTexto.set(etapas.at(-1)?.texto ?? '');
      this.pronto();
    };
    const tentar = (): void => {
      if (fontes && estavel && tempoMinimo) seguir();
    };

    for (const etapa of etapas.slice(0, -1)) {
      this.agendar(() => {
        this.progresso.set(etapa.progresso);
        this.etapaTexto.set(etapa.texto);
      }, etapa.em);
    }
    // O último degrau só vale quando a página está pronta de verdade; teto de 5 s.
    this.agendar(() => {
      tempoMinimo = true;
      tentar();
    }, splash);
    this.agendar(seguir, tetoDoSplash);
    const fontesProntas: Promise<unknown> = this.documento.fonts?.ready ?? Promise.resolve();
    void fontesProntas.then(() => {
      fontes = true;
      tentar();
    });
    void this.aplicacao.whenStable().then(() => {
      estavel = true;
      tentar();
    });
  }

  // ---------- pronto para executar ----------

  private pronto(): void {
    if (this.fase() !== 'splash') return;
    this.cancelar();
    this.fase.set('pronto');
    this.anunciar(
      `Projeto carregado. Botão Executar PortfolioApplication disponível, atalho ${this.teclasDoAtalho}.`,
    );
    const { pulsoInicial, dicaEm, execucaoAutomatica } = LINHA_DO_TEMPO;
    if (!this.reduzido()) {
      this.agendar(() => this.pulsar(), pulsoInicial);
      this.agendar(() => this.pulsar(), dicaEm);
    }
    this.agendar(() => this.dicaEmDestaque.set(true), dicaEm);
    // Ninguém fica preso: sem clique, o ▶ é acionado sozinho.
    this.agendar(() => this.executar(), execucaoAutomatica);
  }

  private pulsar(): void {
    if (this.fase() !== 'pronto') return;
    this.pulso.set(true);
    this.agendar(() => this.pulso.set(false), DURACAO_DO_PULSO_MS);
  }

  // ---------- execução ----------

  private executarComMovimento(): void {
    const t = LINHA_DO_TEMPO;
    const classes = CLASSES_COMPILADAS;
    const spring = bannerDoSpring();
    const mensagens = montarLog(new Date());

    this.anunciar(`Compilando ${classes.length} classes`);
    this.agendar(() => this.tarefas.set(['compileJava']), t.compileJava);
    classes.forEach((classe, i) => {
      this.agendar(() => {
        this.arquivosCompilados.update((lista) => [...lista, caminhoDaClasse(classe)]);
        this.progressoDoBuild.set(((i + 1) / classes.length) * 0.85);
      }, instanteDaClasse(i));
    });
    for (const tarefa of t.tarefas) {
      this.agendar(
        () => this.tarefas.update((lista) => [...lista, tarefa.nome.replace(/^:/, '')]),
        tarefa.em,
      );
    }
    const ultima = t.tarefas.at(-1);
    this.agendar(() => {
      this.progressoDoBuild.set(1);
      this.buildConcluido.set(true);
    }, ultima?.em ?? t.trocaParaRun);

    this.agendar(() => {
      this.fase.set('iniciando');
      this.abaAtiva.set('run');
      this.anunciar('Iniciando o Spring Boot');
    }, t.trocaParaRun);
    this.agendar(() => this.linhasDoLog.set(spring), t.banner);
    mensagens.forEach((linha, i) => {
      this.agendar(
        () => this.linhasDoLog.update((lista) => [...lista, linha]),
        instanteDaLinhaDoLog(i),
      );
    });
    this.agendar(() => {
      this.iniciado.set(true);
      this.anunciar('Portfólio pronto');
    }, INSTANTE_DO_STARTED_MS);
    this.agendar(() => this.revelar(), INICIO_DA_REVELACAO_MS);
    // Teto da execução: a IDE aparece mesmo que algum passo acima atrase.
    this.agendar(() => this.revelar(), t.tetoDaExecucao - t.fimDaRevelacao);
  }

  /** Movimento reduzido: build e log completos de uma vez, uma pausa para ler, e a IDE surge. */
  private executarSemMovimento(): void {
    const t = LINHA_DO_TEMPO;
    this.tarefas.set(['compileJava', ...t.tarefas.map((x) => x.nome.replace(/^:/, ''))]);
    this.arquivosCompilados.set(CLASSES_COMPILADAS.map(caminhoDaClasse));
    this.progressoDoBuild.set(1);
    this.buildConcluido.set(true);
    this.abaAtiva.set('run');
    this.fase.set('iniciando');
    this.linhasDoLog.set([...bannerDoSpring(), ...montarLog(new Date())]);
    this.iniciado.set(true);
    this.anunciar('Portfólio pronto');
    this.agendar(() => this.revelar(), t.reduzido.pausaDeLeitura);
  }

  // ---------- revelação ----------

  /** Hook do componente: roda a revelação dentro de uma View Transition, quando dá. */
  readonly transicaoDeRevelacao = signal<((atualizar: () => void) => void) | null>(null);

  private revelar(): void {
    if (this.fase() !== 'compilando' && this.fase() !== 'iniciando') return;
    this.cancelar();
    const entrar = (): void => {
      // Em aba oculta o callback da View Transition pode chegar depois do fim: não reabre nada.
      if (this.fase() === 'encerrada') return;
      this.fase.set('revelando');
      this.aviso.set(AVISO_DE_INICIALIZACAO);
    };
    const transicao = this.transicaoDeRevelacao();
    if (transicao && !this.reduzidoNaExecucao) transicao(entrar);
    else entrar();
    const duracao = this.reduzidoNaExecucao
      ? LINHA_DO_TEMPO.reduzido.fade
      : LINHA_DO_TEMPO.fimDaRevelacao;
    this.agendar(() => this.encerrar(), duracao);
  }

  // ---------- aviso e apoio ----------

  /** Mostra o aviso de inicialização na barra de status por 6 s. */
  avisar(): void {
    this.aviso.set(AVISO_DE_INICIALIZACAO);
    this.agendar(() => this.aviso.set(''), LINHA_DO_TEMPO.tetoDoAviso, false);
  }

  private anunciar(texto: string): void {
    this.anuncio.set(texto);
  }

  /** Temporizador cancelável pelo fim da abertura; o do aviso (`cancelavel` falso) sobrevive. */
  private agendar(acao: () => void, ms: number, cancelavel = true): void {
    const id = setTimeout(acao, ms);
    if (cancelavel) this.temporizadores.push(id);
  }

  private registrarPrimeiraDaSessao(): boolean {
    try {
      const sessao = this.documento.defaultView?.sessionStorage;
      if (!sessao) return true;
      if (sessao.getItem(CHAVE_DA_ABERTURA) !== null) return false;
      sessao.setItem(CHAVE_DA_ABERTURA, '1');
    } catch {
      // Armazenamento bloqueado: sem como lembrar, mostra nesta carga.
    }
    return true;
  }

  private movimentoReduzido(): boolean {
    return this.documento.defaultView?.matchMedia?.(MOVIMENTO_REDUZIDO).matches ?? false;
  }

  private detectarMac(): boolean {
    const janela = this.documento.defaultView;
    const plataforma = janela?.navigator?.platform ?? '';
    return /mac|iphone|ipad/i.test(plataforma);
  }
}
