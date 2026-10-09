import { Component, input } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { EstadoDoEditor } from '../../core/estado-do-editor';
import { comum, linha, paragrafo, vazia } from './conteudo';
import type { ConteudoDoEditor } from './conteudo';
import { EditorDeCodigo } from './editor-de-codigo';
import { HistoricoDeDigitacao } from './historico-de-digitacao';

const DURACAO_MAXIMA_MS = 1500;
const MS_POR_ITEM = 40;

const conteudoComItens = (quantidade: number): ConteudoDoEditor =>
  Array.from({ length: quantidade }, (_, i) =>
    i % 5 === 4 ? vazia() : linha(0, comum(`int linha${i} = ${i};`)),
  );

@Component({
  imports: [EditorDeCodigo],
  template: `<app-editor-de-codigo [conteudo]="conteudo()" />`,
})
class Hospedeiro {
  readonly conteudo = input.required<ConteudoDoEditor>();
}

@Component({ template: '' })
class Vazia {}

describe('Digitação do editor: comportamento', () => {
  const matchMediaOriginal = document.defaultView!.matchMedia;
  const quadros = new Map<number, FrameRequestCallback>();
  let proximoId = 0;

  const simularMovimentoReduzido = (reduzir: boolean) => {
    document.defaultView!.matchMedia = ((consulta: string) => ({
      matches: reduzir && consulta.includes('prefers-reduced-motion'),
    })) as typeof matchMedia;
  };

  /** Simula um quadro de animação no instante `agora` (ms). */
  const avancar = (agora: number) => {
    const pendentes = [...quadros.values()];
    quadros.clear();
    pendentes.forEach((quadro) => quadro(agora));
    TestBed.tick();
  };

  const abrir = (conteudo: ConteudoDoEditor = conteudoComItens(80)): HTMLElement => {
    const fixture = TestBed.createComponent(Hospedeiro);
    fixture.componentRef.setInput('conteudo', conteudo);
    document.body.append(fixture.nativeElement);
    fixture.detectChanges();
    TestBed.tick();
    return (fixture.nativeElement as HTMLElement).querySelector('app-editor-de-codigo')!;
  };

  /** CSS dos componentes, sem os atributos de encapsulamento (`[_ngcontent-…]`, `[_nghost-…]`). */
  const estilos = () =>
    Array.from(document.head.querySelectorAll('style'))
      .map((estilo) => estilo.textContent ?? '')
      .join('\n')
      .replace(/\[_ng(content|host)-[^\]]*\]/g, '');

  beforeEach(() => {
    simularMovimentoReduzido(false);
    quadros.clear();
    proximoId = 0;
    vi.spyOn(document.defaultView!, 'requestAnimationFrame').mockImplementation((chamada) => {
      quadros.set(++proximoId, chamada);
      return proximoId;
    });
    vi.spyOn(document.defaultView!, 'cancelAnimationFrame').mockImplementation((id) => {
      quadros.delete(id);
    });
  });

  afterEach(() => {
    document.defaultView!.matchMedia = matchMediaOriginal;
    vi.restoreAllMocks();
    document.body.replaceChildren();
  });

  describe('duração', () => {
    it('só termina no quadro de 1,5 s em conteúdo longo: aos 1499 ms ainda digita', () => {
      const editor = abrir(conteudoComItens(200));

      avancar(0);
      avancar(DURACAO_MAXIMA_MS - 1);
      expect(editor.classList).toContain('digitando');

      avancar(DURACAO_MAXIMA_MS);
      expect(editor.classList).not.toContain('digitando');
    });

    it('nunca passa de 1,5 s, por mais itens que o conteúdo tenha', () => {
      const editor = abrir(conteudoComItens(5000));

      avancar(0);
      avancar(DURACAO_MAXIMA_MS);

      expect(editor.classList).toContain('pronto');
    });

    it('é proporcional ao conteúdo quando ele é curto (40 ms por item)', () => {
      const editor = abrir(conteudoComItens(10));
      const total = 10 * MS_POR_ITEM;

      avancar(0);
      avancar(total - 1);
      expect(editor.classList).toContain('digitando');

      avancar(total);
      expect(editor.classList).toContain('pronto');
    });

    it('revela os itens de forma proporcional ao tempo, via --digitado', () => {
      const editor = abrir(conteudoComItens(80));

      avancar(0);
      avancar(DURACAO_MAXIMA_MS / 2);

      expect(Number(editor.style.getPropertyValue('--digitado'))).toBeCloseTo(40, 5);
    });

    it('pede um quadro por vez enquanto digita e nenhum depois de terminar', () => {
      abrir(conteudoComItens(80));

      avancar(0);
      expect(quadros.size).toBe(1);
      avancar(DURACAO_MAXIMA_MS);

      expect(quadros.size).toBe(0);
    });

    it('não digita um conteúdo vazio', () => {
      const editor = abrir([]);

      avancar(0);
      avancar(DURACAO_MAXIMA_MS);

      expect(editor.classList).not.toContain('digitando');
      expect(editor.classList).toContain('pronto');
      expect(editor.style.getPropertyValue('--digitado')).toBe('');
    });
  });

  describe('primeira e segunda abertura', () => {
    beforeEach(() => {
      TestBed.configureTestingModule({
        providers: [provideRouter([{ path: '**', component: Vazia }])],
      });
    });

    it('digita cada endereço uma vez: voltar ao mesmo mostra pronto', async () => {
      const router = TestBed.inject(Router);

      await router.navigateByUrl('/sobre-mim');
      expect(abrir().classList).toContain('digitando');

      await router.navigateByUrl('/sobre-mim');
      expect(abrir().classList).toContain('pronto');
    });

    it('digita a primeira abertura de outra seção, mesmo depois de ver a primeira', async () => {
      const router = TestBed.inject(Router);
      await router.navigateByUrl('/sobre-mim');
      abrir();

      await router.navigateByUrl('/diferenciais');

      expect(abrir().classList).toContain('digitando');
    });

    it('trata cada página de uma seção como uma abertura própria', async () => {
      const router = TestBed.inject(Router);
      await router.navigateByUrl('/skills');
      abrir();

      await router.navigateByUrl('/skills/2');

      expect(abrir().classList).toContain('digitando');
    });

    it('ignora query e fragmento ao decidir se já viu a seção', async () => {
      const router = TestBed.inject(Router);
      await router.navigateByUrl('/contato');
      abrir();

      await router.navigateByUrl('/contato?x=1#topo');

      expect(abrir().classList).toContain('pronto');
    });
  });

  describe('HistoricoDeDigitacao', () => {
    it('diz que é a primeira vez só na primeira chamada de cada chave', () => {
      const historico = TestBed.inject(HistoricoDeDigitacao);

      expect(historico.registrarPrimeiraVista('/a')).toBe(true);
      expect(historico.registrarPrimeiraVista('/a')).toBe(false);
      expect(historico.registrarPrimeiraVista('/b')).toBe(true);
    });
  });

  describe('pular a digitação', () => {
    it('cancela o quadro pendente ao completar com uma tecla', () => {
      const editor = abrir();
      avancar(0);
      expect(quadros.size).toBe(1);

      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
      TestBed.tick();

      expect(quadros.size).toBe(0);
      expect(editor.classList).toContain('pronto');
      expect(editor.style.getPropertyValue('--digitado')).toBe('');
    });

    it('completa com qualquer tecla, inclusive as de controle', () => {
      for (const key of ['Enter', 'Tab', ' ', 'ArrowDown']) {
        document.body.replaceChildren();
        TestBed.resetTestingModule();
        const editor = abrir();

        document.dispatchEvent(new KeyboardEvent('keydown', { key }));
        TestBed.tick();

        expect(editor.classList, `tecla "${key}"`).not.toContain('digitando');
      }
    });

    it('completa ao clicar num trecho de código, sem mover a linha atual', () => {
      const editor = abrir();
      avancar(0);
      const atual = editor.querySelector('.atual')!.getAttribute('data-indice');

      editor.querySelector<HTMLElement>('[data-indice="1"] span')!.click();
      TestBed.tick();

      expect(editor.classList).toContain('pronto');
      expect(editor.querySelector('.atual')!.getAttribute('data-indice')).toBe(atual);
    });

    it('posiciona a barra de status no fim do código ao completar', () => {
      const conteudo = conteudoComItens(80);
      abrir(conteudo);
      avancar(0);

      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'a' }));
      TestBed.tick();

      const ultima = conteudo.map((item) => item.tipo).lastIndexOf('codigo');
      expect(TestBed.inject(EstadoDoEditor).linha()).toBe(ultima + 1);
      expect(TestBed.inject(EstadoDoEditor).coluna()).toBe(1);
    });

    it('uma tecla depois de pronto não reinicia nem muda nada', () => {
      const editor = abrir();
      avancar(0);
      avancar(DURACAO_MAXIMA_MS);
      const antes = editor.className;

      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'a' }));
      TestBed.tick();

      expect(editor.className).toBe(antes);
      expect(quadros.size).toBe(0);
    });
  });

  describe('conteúdo completo durante a digitação', () => {
    const CONTEUDO = conteudoComItens(80);
    const textoCompleto = CONTEUDO.map((item) =>
      item.tipo === 'codigo' ? item.trechos.map((t) => t.texto).join('') : '',
    ).join('');

    it('tem todo o texto no DOM antes do primeiro quadro', () => {
      const editor = abrir(CONTEUDO);

      expect(editor.classList).toContain('digitando');
      expect(editor.querySelector('code')!.textContent).toBe(textoCompleto);
    });

    it('mantém o texto idêntico em todos os instantes da digitação', () => {
      const editor = abrir(CONTEUDO);

      for (const instante of [0, 100, 700, 1400, DURACAO_MAXIMA_MS]) {
        avancar(instante);
        expect(editor.querySelector('code')!.textContent, `aos ${instante} ms`).toBe(textoCompleto);
      }
    });

    it('não esconde o código das tecnologias assistivas durante a digitação', () => {
      const editor = abrir(CONTEUDO);
      const pre = editor.querySelector('pre')!;

      expect(editor.classList).toContain('digitando');
      for (const elemento of [editor, pre, pre.querySelector('code')!]) {
        expect(elemento.getAttribute('aria-hidden')).not.toBe('true');
        expect(elemento.hasAttribute('hidden')).toBe(false);
      }
      expect(pre.getAttribute('role')).toBe('region');
    });

    it('esconde só visualmente, por recorte (clip-path), nunca por display ou visibility', () => {
      abrir(CONTEUDO);
      const css = estilos();

      expect(css).toMatch(/clip-path:\s*inset\(/);
      expect(css).not.toMatch(/\.digitando[^{]*\{[^}]*(display:\s*none|visibility:\s*hidden)/);
    });

    it('mantém os parágrafos completos no DOM', () => {
      const editor = abrir([linha(0, comum('a')), paragrafo(0, 'Texto longo do parágrafo.')]);

      expect(editor.querySelector('.paragrafo')!.textContent).toBe('Texto longo do parágrafo.');
    });
  });

  describe('movimento reduzido', () => {
    beforeEach(() => simularMovimentoReduzido(true));

    it('não anima: nem rodando os quadros pendentes há digitação', () => {
      const editor = abrir();

      avancar(0);
      avancar(DURACAO_MAXIMA_MS / 2);

      expect(editor.style.getPropertyValue('--digitado')).toBe('');
      expect(editor.classList).not.toContain('digitando');
    });

    it('nunca define --digitado nem usa a classe digitando', () => {
      const editor = abrir();

      expect(editor.style.getPropertyValue('--digitado')).toBe('');
      expect(editor.classList).not.toContain('digitando');
      expect(editor.classList).toContain('pronto');
    });

    it('mostra o código completo e a linha atual no fim, sem cursor piscando', () => {
      const editor = abrir();

      expect(editor.querySelector('code')!.textContent).toContain('int linha78');
      expect(editor.querySelectorAll('.atual')).toHaveLength(1);
      expect(estilos()).toMatch(
        /prefers-reduced-motion[\s\S]*\.pronto[^{]*\.linha\.atual:not\(\.vazia\)::after[^{]*\{[^}]*animation:\s*none/,
      );
    });

    it('mesmo na primeira abertura não digita', () => {
      const editor = abrir();

      expect(TestBed.inject(HistoricoDeDigitacao).registrarPrimeiraVista('/')).toBe(false);
      expect(editor.classList).not.toContain('digitando');
    });

    it('posiciona a barra de status na linha atual sem esperar a digitação', () => {
      abrir(conteudoComItens(80));

      const estado = TestBed.inject(EstadoDoEditor);

      expect(estado.coluna()).toBe(1);
    });
  });

  describe('cursor e linha atual', () => {
    it('só mostra o cursor com o editor pronto, nunca durante a digitação', () => {
      abrir();
      const css = estilos();

      expect(css).toMatch(/\.pronto[^{]*\.linha\.atual:not\(\.vazia\)::after/);
      expect(css).toMatch(/\.digitando[^{]*\.atual\s*\{[^}]*background:\s*none/);
    });

    it('pisca por animação com os tokens de duração e curva', () => {
      abrir();
      const css = estilos();

      expect(css).toMatch(
        /animation:\s*\S*piscar\s+var\(--duracao-cursor\)\s+var\(--curva-cursor\)/,
      );
      expect(css).toMatch(/@keyframes\s+\S*piscar/);
    });

    it('não põe cursor em linha vazia', () => {
      abrir();

      expect(estilos()).toMatch(/\.linha\.atual:not\(\.vazia\)::after/);
    });

    it('termina com um único item destacado, o último de código', () => {
      const conteudo = conteudoComItens(80);
      const editor = abrir(conteudo);
      avancar(0);
      avancar(DURACAO_MAXIMA_MS);

      const ultima = conteudo.map((item) => item.tipo).lastIndexOf('codigo');

      expect(editor.querySelectorAll('.atual')).toHaveLength(1);
      expect(editor.querySelector('.atual')!.getAttribute('data-indice')).toBe(String(ultima));
    });

    it('move o destaque ao clicar num trecho dentro da linha', () => {
      simularMovimentoReduzido(true);
      const editor = abrir();

      editor.querySelector<HTMLElement>('[data-indice="2"] span')!.click();
      TestBed.tick();

      expect(editor.querySelector('.atual')!.getAttribute('data-indice')).toBe('2');
      expect(TestBed.inject(EstadoDoEditor).linha()).toBe(3);
    });

    it('move o destaque também ao clicar numa linha vazia', () => {
      simularMovimentoReduzido(true);
      const editor = abrir();

      editor.querySelector<HTMLElement>('[data-indice="4"]')!.click();
      TestBed.tick();

      expect(editor.querySelector('.atual')!.getAttribute('data-indice')).toBe('4');
      expect(TestBed.inject(EstadoDoEditor).linha()).toBe(5);
    });

    it('move o destaque para um parágrafo clicado', () => {
      simularMovimentoReduzido(true);
      const editor = abrir([linha(0, comum('a')), paragrafo(0, 'Texto'), linha(0, comum('b'))]);

      editor.querySelector<HTMLElement>('.paragrafo')!.click();
      TestBed.tick();

      expect(editor.querySelector('.atual')!.classList).toContain('paragrafo');
      expect(TestBed.inject(EstadoDoEditor).linha()).toBe(2);
    });

    it('ignora cliques fora das linhas, como a coluna de números', () => {
      simularMovimentoReduzido(true);
      const editor = abrir();
      const antes = editor.querySelector('.atual')!.getAttribute('data-indice');

      editor.querySelector<HTMLElement>('.numeros span')!.click();
      TestBed.tick();

      expect(editor.querySelector('.atual')!.getAttribute('data-indice')).toBe(antes);
    });

    it('volta o destaque ao fim do código quando o conteúdo muda', () => {
      simularMovimentoReduzido(true);
      const fixture = TestBed.createComponent(Hospedeiro);
      fixture.componentRef.setInput('conteudo', conteudoComItens(20));
      document.body.append(fixture.nativeElement);
      fixture.detectChanges();
      TestBed.tick();
      const editor = (fixture.nativeElement as HTMLElement).querySelector('app-editor-de-codigo')!;
      editor.querySelector<HTMLElement>('[data-indice="1"]')!.click();

      fixture.componentRef.setInput('conteudo', conteudoComItens(10));
      fixture.detectChanges();

      expect(editor.querySelector('.atual')!.getAttribute('data-indice')).toBe('8');
    });
  });
});
