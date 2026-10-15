import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { javadoc, linha, comum } from './conteudo';
import type { ConteudoDoEditor } from './conteudo';
import { EditorDeCodigo } from './editor-de-codigo';
import { CHAVE_DO_MODO_DE_LEITURA, ModoDeLeitura } from './modo-de-leitura';

@Component({
  imports: [EditorDeCodigo],
  template: `<app-editor-de-codigo [conteudo]="conteudo" />`,
})
class Hospedeiro {
  readonly conteudo: ConteudoDoEditor = [
    javadoc(0, 'Primeiro.'),
    javadoc(0, 'Segundo.'),
    linha(0, comum('class A {}')),
  ];
}

describe('Modo de leitura do Javadoc', () => {
  beforeEach(() => {
    sessionStorage.clear();
    TestBed.configureTestingModule({ providers: [provideRouter([])] });
  });

  it('vem ligado por padrão e guarda só o desligado na sessão', () => {
    const modo = TestBed.inject(ModoDeLeitura);

    expect(modo.ativo()).toBe(true);
    modo.alternar();
    expect(modo.ativo()).toBe(false);
    expect(sessionStorage.getItem(CHAVE_DO_MODO_DE_LEITURA)).toBe('desligado');
    modo.alternar();
    expect(sessionStorage.getItem(CHAVE_DO_MODO_DE_LEITURA)).toBeNull();
  });

  it('respeita a escolha guardada na sessão', () => {
    sessionStorage.setItem(CHAVE_DO_MODO_DE_LEITURA, 'desligado');

    expect(TestBed.inject(ModoDeLeitura).ativo()).toBe(false);
  });

  it('o botão da calha tem nome e aria-pressed, e troca o modo de todos os Javadocs', () => {
    const fixture = TestBed.createComponent(Hospedeiro);
    fixture.detectChanges();
    const raiz = fixture.nativeElement as HTMLElement;
    const botoes = raiz.querySelectorAll<HTMLButtonElement>('.alternar-leitura');

    expect(botoes).toHaveLength(1);
    expect(botoes[0].getAttribute('aria-label')).toBe('Alternar modo de leitura');
    expect(botoes[0].getAttribute('aria-pressed')).toBe('true');
    raiz
      .querySelectorAll('.javadoc')
      .forEach((j) => expect(j.getAttribute('data-modo')).toBe('leitura'));

    botoes[0].click();
    fixture.detectChanges();

    expect(botoes[0].getAttribute('aria-pressed')).toBe('false');
    raiz
      .querySelectorAll('.javadoc')
      .forEach((j) => expect(j.getAttribute('data-modo')).toBe('cru'));
  });

  it('o texto do Javadoc é o mesmo nos dois modos', () => {
    const fixture = TestBed.createComponent(Hospedeiro);
    fixture.detectChanges();
    const raiz = fixture.nativeElement as HTMLElement;
    const texto = () => raiz.querySelector('.javadoc-corpo')?.textContent;
    const leitura = texto();

    TestBed.inject(ModoDeLeitura).alternar();
    fixture.detectChanges();

    expect(texto()).toBe(leitura);
  });
});

describe('Links internos do editor', () => {
  it('navegam pelo roteador no clique simples e deixam o clique com Ctrl para o navegador', async () => {
    const { Router } = await import('@angular/router');
    const { comum: c, link, linha: l } = await import('./conteudo');
    @Component({
      imports: [EditorDeCodigo],
      template: `<app-editor-de-codigo [conteudo]="conteudo" />`,
    })
    class ComLink {
      readonly conteudo: ConteudoDoEditor = [l(0, link(c('ir'), '/contato'))];
    }
    TestBed.configureTestingModule({ providers: [provideRouter([])] });
    const router = TestBed.inject(Router);
    const navegar = vi.spyOn(router, 'navigateByUrl').mockResolvedValue(true);
    const fixture = TestBed.createComponent(ComLink);
    fixture.detectChanges();
    const a = (fixture.nativeElement as HTMLElement).querySelector('a')!;

    a.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, ctrlKey: true }));
    expect(navegar).not.toHaveBeenCalled();
    const simples = new MouseEvent('click', { bubbles: true, cancelable: true });
    a.dispatchEvent(simples);

    expect(navegar).toHaveBeenCalledWith('/contato');
    expect(simples.defaultPrevented).toBe(true);
  });
});
