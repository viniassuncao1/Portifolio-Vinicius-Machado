import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';

import { SECOES } from '../../core/secoes';
import { BuscaDeSecoes } from './busca-de-secoes';

@Component({ template: '' })
class Vazia {}

describe('BuscaDeSecoes', () => {
  beforeEach(() => {
    // O jsdom não implementa <dialog>: simulamos só o que a busca usa.
    HTMLDialogElement.prototype.showModal ??= function (this: HTMLDialogElement) {
      this.setAttribute('open', '');
    };
    HTMLDialogElement.prototype.close ??= function (this: HTMLDialogElement) {
      this.removeAttribute('open');
      this.dispatchEvent(new Event('close'));
    };
    TestBed.configureTestingModule({
      providers: [
        provideRouter([
          { path: '', component: Vazia },
          ...SECOES.map((secao) => ({ path: secao.slug, component: Vazia })),
        ]),
      ],
    });
  });

  async function montar() {
    const fixture = TestBed.createComponent(BuscaDeSecoes);
    document.body.append(fixture.nativeElement);
    fixture.componentInstance.abrir();
    fixture.detectChanges();
    await fixture.whenStable();
    const raiz = fixture.nativeElement as HTMLElement;
    const campo = raiz.querySelector('input') as HTMLInputElement;
    const digitar = async (texto: string) => {
      campo.value = texto;
      campo.dispatchEvent(new Event('input'));
      fixture.detectChanges();
      await fixture.whenStable();
    };
    const tecla = (key: string) => {
      campo.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true }));
      fixture.detectChanges();
    };
    const opcoes = () => Array.from(raiz.querySelectorAll('[role="option"]'));
    return { fixture, raiz, campo, digitar, tecla, opcoes };
  }

  it('abre com o foco no campo e lista as 16 opções (Início e 15 seções)', async () => {
    const { raiz, campo, opcoes } = await montar();

    expect(raiz.querySelector('dialog')?.hasAttribute('open')).toBe(true);
    expect(document.activeElement).toBe(campo);
    expect(opcoes()).toHaveLength(16);
    raiz.remove();
  });

  it('segue o padrão combobox: papéis, aria-controls e aria-activedescendant', async () => {
    const { raiz, campo, tecla } = await montar();

    expect(campo.getAttribute('role')).toBe('combobox');
    expect(campo.getAttribute('aria-controls')).toBe('resultados-busca');
    expect(raiz.querySelector('[role="listbox"]')?.id).toBe('resultados-busca');
    expect(campo.getAttribute('aria-activedescendant')).toBe('opcao-busca-0');

    tecla('ArrowDown');
    expect(campo.getAttribute('aria-activedescendant')).toBe('opcao-busca-1');
    expect(raiz.querySelectorAll('[aria-selected="true"]')).toHaveLength(1);
    raiz.remove();
  });

  it('filtra sem diferenciar maiúsculas e acentos, por arquivo ou título', async () => {
    const { raiz, digitar, opcoes } = await montar();

    await digitar('EXP');
    expect(opcoes().map((o) => o.querySelector('.arquivo')?.textContent)).toEqual([
      'Experiencias.java',
    ]);

    await digitar('experiências');
    expect(opcoes()).toHaveLength(1);

    await digitar('Projeto2.j');
    expect(opcoes().map((o) => o.querySelector('.titulo')?.textContent)).toEqual(['Projeto 2']);
    raiz.remove();
  });

  it('mostra "Nenhum resultado" e nenhum activedescendant quando nada casa', async () => {
    const { raiz, campo, digitar, opcoes } = await montar();

    await digitar('zzz');

    expect(opcoes()).toHaveLength(0);
    expect(raiz.querySelector('[role="status"]')?.textContent?.trim()).toBe('Nenhum resultado');
    expect(campo.hasAttribute('aria-activedescendant')).toBe(false);
    raiz.remove();
  });

  it('Enter abre a seção escolhida e fecha a busca', async () => {
    const harness = await RouterTestingHarness.create();
    const { fixture, raiz, digitar, tecla } = await montar();

    await digitar('exp');
    tecla('Enter');
    await fixture.whenStable();

    expect(TestBed.inject(Router).url).toBe('/experiencias');
    expect(raiz.querySelector('dialog')?.hasAttribute('open')).toBe(false);
    expect(harness).toBeDefined();
    raiz.remove();
  });

  it('setas dão a volta na lista', async () => {
    const { raiz, campo, tecla } = await montar();

    tecla('ArrowUp');
    expect(campo.getAttribute('aria-activedescendant')).toBe('opcao-busca-15');
    tecla('ArrowDown');
    expect(campo.getAttribute('aria-activedescendant')).toBe('opcao-busca-0');
    raiz.remove();
  });

  it('devolve o foco para onde estava ao fechar', async () => {
    const botao = document.createElement('button');
    document.body.append(botao);
    botao.focus();
    const { fixture, raiz } = await montar();

    raiz.querySelector('dialog')?.close();
    fixture.detectChanges();

    expect(document.activeElement).toBe(botao);
    botao.remove();
    raiz.remove();
  });

  it('usa o plural com vários resultados e o singular com um só', async () => {
    const { raiz, digitar } = await montar();
    const contagem = () => raiz.querySelector('.contagem')?.textContent?.trim();

    expect(contagem()).toBe('16 resultados');
    await digitar('projeto');
    expect(contagem()).toBe('4 resultados');
    await digitar('formacao');
    expect(contagem()).toBe('1 resultado');
    await digitar('zzzz');
    expect(contagem()).toBe('Nenhum resultado');
    raiz.remove();
  });

  it('"formacao" acha Formação e "exp" acha Experiências', async () => {
    const { raiz, digitar, opcoes } = await montar();

    await digitar('formacao');
    expect(opcoes().map((o) => o.querySelector('.titulo')?.textContent)).toEqual(['Formação']);

    await digitar('exp');
    expect(opcoes().map((o) => o.querySelector('.titulo')?.textContent)).toEqual(['Experiências']);
    raiz.remove();
  });

  it('as setas mudam o aria-activedescendant e a opção selecionada', async () => {
    const { raiz, campo, tecla, opcoes } = await montar();
    expect(campo.getAttribute('aria-activedescendant')).toBe('opcao-busca-0');

    tecla('ArrowDown');

    expect(campo.getAttribute('aria-activedescendant')).toBe('opcao-busca-1');
    expect(opcoes()[1].getAttribute('aria-selected')).toBe('true');
    expect(opcoes()[0].getAttribute('aria-selected')).toBe('false');
    raiz.remove();
  });

  it('volta o índice ativo ao primeiro resultado ao digitar', async () => {
    const { raiz, campo, tecla, digitar } = await montar();
    tecla('ArrowDown');
    tecla('ArrowDown');

    await digitar('p');

    expect(campo.getAttribute('aria-activedescendant')).toBe('opcao-busca-0');
    raiz.remove();
  });
});
