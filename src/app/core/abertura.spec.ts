import { DOCUMENT } from '@angular/core';
import { PLATFORM_ID } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import {
  ATRIBUTO_DA_ABERTURA,
  AVISO_DE_INICIALIZACAO,
  Abertura,
  CHAVE_DA_ABERTURA,
} from './abertura';
import {
  CLASSES_COMPILADAS,
  INICIO_DA_REVELACAO_MS,
  LINHA_DO_TEMPO,
} from './linha-do-tempo-da-abertura';

describe('Abertura', () => {
  const matchMediaOriginal = document.defaultView!.matchMedia;
  const raiz = () => document.documentElement;

  const movimentoReduzido = (reduzir: boolean) => {
    document.defaultView!.matchMedia = ((q: string) => ({
      matches: reduzir && q.includes('reduce'),
    })) as typeof matchMedia;
  };

  /** Liga a abertura como o script inline do `index.html` faz e começa. */
  const comecar = () => {
    raiz().setAttribute(ATRIBUTO_DA_ABERTURA, '');
    const abertura = TestBed.inject(Abertura);
    abertura.iniciar();
    return abertura;
  };

  /** Anda o relógio e deixa as promessas (fontes, estabilidade) resolverem. */
  const avancar = (ms: number) => vi.advanceTimersByTimeAsync(ms);

  /** Splash até o ▶ ficar pronto. */
  const ateOPronto = async (abertura: Abertura) => {
    await avancar(LINHA_DO_TEMPO.splash);
    expect(abertura.fase()).toBe('pronto');
  };

  beforeEach(() => {
    vi.useFakeTimers();
    sessionStorage.clear();
    raiz().removeAttribute(ATRIBUTO_DA_ABERTURA);
    movimentoReduzido(false);
  });

  afterEach(() => {
    vi.useRealTimers();
    document.defaultView!.matchMedia = matchMediaOriginal;
    raiz().removeAttribute(ATRIBUTO_DA_ABERTURA);
    Reflect.deleteProperty(document, 'fonts');
  });

  describe('quando acontece', () => {
    it('em `/` com o atributo do script inline começa pelo splash e marca a sessão', () => {
      const abertura = comecar();

      expect(abertura.fase()).toBe('splash');
      expect(abertura.dispensada()).toBe(false);
      expect(sessionStorage.getItem(CHAVE_DA_ABERTURA)).toBe('1');
    });

    it('sem o atributo (link direto) não abre, é dispensada e só mostra o aviso', () => {
      const abertura = TestBed.inject(Abertura);

      abertura.iniciar();

      expect(abertura.fase()).toBe('encerrada');
      expect(abertura.dispensada()).toBe(true);
      expect(abertura.aviso()).toBe(AVISO_DE_INICIALIZACAO);
    });

    it('o aviso do link direto some em 6 s', async () => {
      const abertura = TestBed.inject(Abertura);
      abertura.iniciar();

      await avancar(LINHA_DO_TEMPO.tetoDoAviso - 1);
      expect(abertura.aviso()).toBe(AVISO_DE_INICIALIZACAO);
      await avancar(1);
      expect(abertura.aviso()).toBe('');
    });

    it('na mesma sessão não abre nem avisa de novo', () => {
      sessionStorage.setItem(CHAVE_DA_ABERTURA, '1');
      const abertura = TestBed.inject(Abertura);

      abertura.iniciar();

      expect(abertura.fase()).toBe('encerrada');
      expect(abertura.aviso()).toBe('');
    });

    it('no servidor (pré-render) não faz nada', () => {
      TestBed.configureTestingModule({
        providers: [{ provide: PLATFORM_ID, useValue: 'server' }],
      });
      const abertura = TestBed.inject(Abertura);

      abertura.iniciar();

      expect(abertura.fase()).toBe('encerrada');
      expect(abertura.dispensada()).toBe(false);
      expect(sessionStorage.length).toBe(0);
    });

    it('com o armazenamento bloqueado abre mesmo assim', () => {
      vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
        throw new Error('bloqueado');
      });

      const abertura = comecar();

      expect(abertura.fase()).toBe('splash');
      vi.restoreAllMocks();
    });
  });

  describe('splash', () => {
    it('avança a barra pelos degraus de 0,4, 1,1, 1,8 e 2,5 s', async () => {
      const abertura = comecar();
      const [a, b, c, d] = LINHA_DO_TEMPO.etapas;
      expect(abertura.progresso()).toBe(0);

      await avancar(a.em);
      expect(abertura.progresso()).toBe(a.progresso);
      expect(abertura.etapaTexto()).toBe(a.texto);
      await avancar(b.em - a.em);
      expect(abertura.etapaTexto()).toBe(b.texto);
      await avancar(c.em - b.em);
      expect(abertura.etapaTexto()).toBe(c.texto);
      expect(abertura.fase()).toBe('splash');
      await avancar(LINHA_DO_TEMPO.splash - c.em);

      expect(abertura.fase()).toBe('pronto');
      expect(abertura.progresso()).toBe(d.progresso);
      expect(abertura.etapaTexto()).toBe(d.texto);
    });

    it('dura 3 s quando a página já está pronta', async () => {
      const abertura = comecar();

      await avancar(LINHA_DO_TEMPO.splash - 1);
      expect(abertura.fase()).toBe('splash');
      await avancar(1);

      expect(abertura.fase()).toBe('pronto');
    });

    it('com rede lenta espera as fontes, mas nunca passa de 5 s', async () => {
      Object.defineProperty(document, 'fonts', {
        value: { ready: new Promise(() => undefined) },
        configurable: true,
      });
      const abertura = comecar();

      await avancar(LINHA_DO_TEMPO.splash + 1000);
      expect(abertura.fase()).toBe('splash');
      await avancar(LINHA_DO_TEMPO.tetoDoSplash - LINHA_DO_TEMPO.splash - 1000);

      expect(abertura.fase()).toBe('pronto');
    });

    it('o ▶ ainda não funciona no splash', async () => {
      const abertura = comecar();

      abertura.executar();

      expect(abertura.fase()).toBe('splash');
    });
  });

  describe('pronto', () => {
    it('anuncia o marco, pulsa em 0,3 s, destaca a dica em 3 s e executa sozinho em 5 s', async () => {
      const abertura = comecar();
      await ateOPronto(abertura);
      expect(abertura.anuncio()).toContain('Projeto carregado');
      expect(abertura.dicaEmDestaque()).toBe(false);

      await avancar(LINHA_DO_TEMPO.pulsoInicial);
      expect(abertura.pulso()).toBe(true);
      await avancar(LINHA_DO_TEMPO.dicaEm - LINHA_DO_TEMPO.pulsoInicial);
      expect(abertura.dicaEmDestaque()).toBe(true);
      expect(abertura.fase()).toBe('pronto');

      await avancar(LINHA_DO_TEMPO.execucaoAutomatica - LINHA_DO_TEMPO.dicaEm);
      expect(abertura.fase()).toBe('compilando');
    });

    it('o clique executa na hora e cancela a execução automática', async () => {
      const abertura = comecar();
      await ateOPronto(abertura);

      abertura.executar();

      expect(abertura.fase()).toBe('compilando');
      expect(abertura.pulso()).toBe(false);
    });

    it('Esc não executa o ▶: quem pula usa o método pular()', async () => {
      const abertura = comecar();
      await ateOPronto(abertura);

      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
      await avancar(100);

      expect(abertura.fase()).toBe('pronto');
    });

    it('pular() mostra o build e o log completos e revela a IDE com o fade curto', async () => {
      const abertura = comecar();
      await ateOPronto(abertura);

      abertura.pular();

      expect(abertura.buildConcluido()).toBe(true);
      expect(abertura.iniciado()).toBe(true);
      expect(abertura.abaAtiva()).toBe('run');
      expect(abertura.fase()).toBe('revelando');
      await avancar(LINHA_DO_TEMPO.reduzido.fade);
      expect(abertura.fase()).toBe('encerrada');
      expect(abertura.aviso()).toContain('PortfolioApplication');
    });

    it('pular() vale já no splash, antes de o projeto ficar pronto', async () => {
      const abertura = comecar();

      abertura.pular();

      expect(abertura.fase()).toBe('revelando');
      await avancar(LINHA_DO_TEMPO.reduzido.fade);
      expect(abertura.fase()).toBe('encerrada');
    });

    it('pular() não faz nada depois da revelação nem sem abertura', async () => {
      const abertura = comecar();
      await ateOPronto(abertura);
      abertura.pular();
      await avancar(LINHA_DO_TEMPO.reduzido.fade);

      abertura.pular();

      expect(abertura.fase()).toBe('encerrada');
    });
  });

  describe('execução', () => {
    const executar = async () => {
      const abertura = comecar();
      await ateOPronto(abertura);
      abertura.executar();
      return abertura;
    };

    it('compila as classes uma a uma e depois as tarefas, até concluir o build', async () => {
      const abertura = await executar();

      await avancar(LINHA_DO_TEMPO.compileJava);
      expect(abertura.tarefas()).toEqual(['compileJava']);
      await avancar(LINHA_DO_TEMPO.primeiraClasse - LINHA_DO_TEMPO.compileJava);
      expect(abertura.arquivosCompilados()).toHaveLength(1);
      expect(abertura.arquivosCompilados()[0]).toMatch(/^dev\/vinicius\/portfolio\/.+\.java$/);
      await avancar(LINHA_DO_TEMPO.tarefas.at(-1)!.em - LINHA_DO_TEMPO.primeiraClasse);

      expect(abertura.arquivosCompilados()).toHaveLength(CLASSES_COMPILADAS.length);
      expect(abertura.tarefas()).toEqual(['compileJava', 'processResources', 'classes', 'bootRun']);
      expect(abertura.buildConcluido()).toBe(true);
      expect(abertura.progressoDoBuild()).toBe(1);
      expect(abertura.fase()).toBe('compilando');
    });

    it('troca para a aba Run aos 1,46 s e mostra o banner, depois uma linha do Spring por vez', async () => {
      const abertura = await executar();

      await avancar(LINHA_DO_TEMPO.trocaParaRun);
      expect(abertura.fase()).toBe('iniciando');
      expect(abertura.abaAtiva()).toBe('run');
      expect(abertura.linhasDoLog()).toHaveLength(0);

      await avancar(LINHA_DO_TEMPO.banner - LINHA_DO_TEMPO.trocaParaRun);
      const doBanner = abertura.linhasDoLog().length;
      expect(doBanner).toBeGreaterThan(5);

      await avancar(LINHA_DO_TEMPO.primeiraLinhaDoLog - LINHA_DO_TEMPO.banner);
      expect(abertura.linhasDoLog()).toHaveLength(doBanner + 1);
      await avancar(LINHA_DO_TEMPO.intervaloDoLog);
      expect(abertura.linhasDoLog()).toHaveLength(doBanner + 2);
    });

    it('termina o log em "Started", anuncia o portfólio pronto e revela a IDE depois da pausa', async () => {
      const abertura = await executar();

      await avancar(INICIO_DA_REVELACAO_MS - LINHA_DO_TEMPO.pausaDeLeitura);
      expect(abertura.linhasDoLog().at(-1)?.texto).toContain('Started PortfolioApplication');
      expect(abertura.anuncio()).toBe('Portfólio pronto');
      expect(abertura.fase()).toBe('iniciando');

      await avancar(LINHA_DO_TEMPO.pausaDeLeitura);
      expect(abertura.fase()).toBe('revelando');
      expect(abertura.aviso()).toBe(AVISO_DE_INICIALIZACAO);
    });

    it('encerra 0,72 s depois, desliga o atributo do html e some do DOM', async () => {
      const abertura = await executar();

      await avancar(INICIO_DA_REVELACAO_MS + LINHA_DO_TEMPO.fimDaRevelacao - 1);
      expect(abertura.fase()).toBe('revelando');
      await avancar(1);

      expect(abertura.fase()).toBe('encerrada');
      expect(abertura.dispensada()).toBe(true);
      expect(raiz().hasAttribute(ATRIBUTO_DA_ABERTURA)).toBe(false);
    });

    it('do clique ao portfólio leva menos que o teto de 5 s', async () => {
      const abertura = await executar();

      await avancar(LINHA_DO_TEMPO.tetoDaExecucao);

      expect(abertura.fase()).toBe('encerrada');
    });

    it('o aviso fica 6 s depois da revelação e some', async () => {
      const abertura = await executar();
      await avancar(INICIO_DA_REVELACAO_MS + LINHA_DO_TEMPO.fimDaRevelacao);

      await avancar(LINHA_DO_TEMPO.tetoDoAviso - 1);
      expect(abertura.aviso()).toBe(AVISO_DE_INICIALIZACAO);
      await avancar(1);
      expect(abertura.aviso()).toBe('');
    });

    it('usa a transição de revelação do componente quando ela existe', async () => {
      const abertura = await executar();
      const transicao = vi.fn((atualizar: () => void) => atualizar());
      abertura.transicaoDeRevelacao.set(transicao);

      await avancar(INICIO_DA_REVELACAO_MS);

      expect(transicao).toHaveBeenCalledTimes(1);
      expect(abertura.fase()).toBe('revelando');
    });
  });

  describe('movimento reduzido', () => {
    beforeEach(() => movimentoReduzido(true));

    it('as mesmas etapas, mas o Run já fica disponível, com a barra cheia', () => {
      const abertura = comecar();

      expect(abertura.fase()).toBe('pronto');
      expect(abertura.progresso()).toBe(1);
      expect(abertura.reduzido()).toBe(true);
    });

    it('não pulsa, e ainda assim executa sozinho 5 s depois', async () => {
      const abertura = comecar();

      await avancar(LINHA_DO_TEMPO.pulsoInicial);
      expect(abertura.pulso()).toBe(false);
      await avancar(LINHA_DO_TEMPO.execucaoAutomatica);

      expect(abertura.fase()).not.toBe('pronto');
    });

    it('ao executar mostra build e log completos de uma vez', () => {
      const abertura = comecar();

      abertura.executar();

      expect(abertura.arquivosCompilados()).toHaveLength(CLASSES_COMPILADAS.length);
      expect(abertura.buildConcluido()).toBe(true);
      expect(abertura.abaAtiva()).toBe('run');
      expect(abertura.linhasDoLog().at(-1)?.texto).toContain('Started PortfolioApplication');
      expect(abertura.fase()).toBe('iniciando');
    });

    it('lê o log por 1,2 s e a IDE surge com um fade curto, sem a View Transition', async () => {
      const abertura = comecar();
      abertura.executar();
      const transicao = vi.fn();
      abertura.transicaoDeRevelacao.set(transicao);

      await avancar(LINHA_DO_TEMPO.reduzido.pausaDeLeitura - 1);
      expect(abertura.fase()).toBe('iniciando');
      await avancar(1);
      expect(abertura.fase()).toBe('revelando');
      await avancar(LINHA_DO_TEMPO.reduzido.fade);

      expect(abertura.fase()).toBe('encerrada');
      expect(transicao).not.toHaveBeenCalled();
    });
  });

  it('o callback atrasado da View Transition não reabre a revelação depois de encerrar', async () => {
    const abertura = comecar();
    await ateOPronto(abertura);
    abertura.executar();
    let atrasado: (() => void) | undefined;
    abertura.transicaoDeRevelacao.set((entrar) => (atrasado = entrar));

    await avancar(INICIO_DA_REVELACAO_MS + LINHA_DO_TEMPO.fimDaRevelacao);
    expect(abertura.fase()).toBe('encerrada');
    atrasado?.();

    expect(abertura.fase()).toBe('encerrada');
    expect(abertura.aviso()).toBe(AVISO_DE_INICIALIZACAO);
  });

  it('o atalho da plataforma é ⌃R no Mac e ⇧F10 nos outros', () => {
    const abertura = TestBed.inject(Abertura);
    const mac = /mac|iphone|ipad/i.test(
      TestBed.inject(DOCUMENT).defaultView?.navigator.platform ?? '',
    );

    expect(abertura.atalho).toBe(mac ? '⌃R' : '⇧F10');
    expect(abertura.teclasDoAtalho).toBe(mac ? 'Control+R' : 'Shift+F10');
  });
});
