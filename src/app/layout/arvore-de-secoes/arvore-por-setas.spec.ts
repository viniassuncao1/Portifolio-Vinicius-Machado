import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';

import { SECOES } from '../../core/secoes';
import { ArvoreDeSecoes } from './arvore-de-secoes';

@Component({ template: '' })
class Vazia {}

describe('ArvoreDeSecoes por teclado (tree view)', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideRouter([
          { path: '', component: Vazia },
          ...SECOES.map((secao) => ({ path: secao.slug, component: Vazia })),
        ]),
      ],
    });
  });

  async function abrir(url: string) {
    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl(url);
    const fixture = TestBed.createComponent(ArvoreDeSecoes);
    await fixture.whenStable();
    const raiz = fixture.nativeElement as HTMLElement;
    document.body.append(raiz);
    const itens = () =>
      Array.from(raiz.querySelectorAll<HTMLElement>('[role=treeitem]')).filter(
        (item) => !item.closest('[hidden]'),
      );
    const pasta = (nome: string) =>
      raiz.querySelector<HTMLElement>(`[data-tipo=pasta][data-pacote=${nome}]`)!;
    return { fixture, raiz, itens, pasta };
  }

  const tecla = async (
    fixture: { whenStable(): Promise<unknown> },
    alvo: HTMLElement,
    key: string,
  ) => {
    alvo.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true }));
    await fixture.whenStable();
  };

  it('o arquivo da seção aberta é o único item na ordem de Tab', async () => {
    const { raiz, itens } = await abrir('/projeto-2');

    const focaveis = itens().filter((i) => i.getAttribute('tabindex') === '0');
    expect(focaveis).toHaveLength(1);
    expect(focaveis[0].textContent).toContain('Projeto2.java');
    raiz.remove();
  });

  it('no Início a pasta "sobre" é o item focável', async () => {
    const { raiz, pasta } = await abrir('/');

    expect(pasta('sobre').getAttribute('tabindex')).toBe('0');
    raiz.remove();
  });

  it('seta para baixo e para cima percorrem os itens visíveis e passam o tabindex', async () => {
    const { fixture, raiz, itens } = await abrir('/projeto-2');
    const todos = itens();
    const atual = todos.findIndex((i) => i.textContent?.includes('Projeto2.java'));
    todos[atual].focus();

    await tecla(fixture, todos[atual], 'ArrowDown');
    expect(document.activeElement).toBe(todos[atual + 1]);
    expect(todos[atual + 1].getAttribute('tabindex')).toBe('0');
    expect(todos[atual].getAttribute('tabindex')).toBe('-1');

    await tecla(fixture, todos[atual + 1], 'ArrowUp');
    expect(document.activeElement).toBe(todos[atual]);
    raiz.remove();
  });

  it('Home e End vão ao primeiro e ao último item visível', async () => {
    const { fixture, raiz, itens } = await abrir('/projeto-2');
    const todos = itens();
    todos[4].focus();

    await tecla(fixture, todos[4], 'End');
    expect(document.activeElement).toBe(todos.at(-1));
    await tecla(fixture, todos.at(-1)!, 'Home');
    expect(document.activeElement).toBe(todos[0]);
    raiz.remove();
  });

  it('seta para a direita expande a pasta e, se já aberta, vai ao primeiro arquivo', async () => {
    const { fixture, raiz, pasta, itens } = await abrir('/');
    pasta('projetos').focus();

    await tecla(fixture, pasta('projetos'), 'ArrowRight');
    expect(pasta('projetos').getAttribute('aria-expanded')).toBe('true');

    await tecla(fixture, pasta('projetos'), 'ArrowRight');
    expect(document.activeElement).toBe(itens()[itens().indexOf(pasta('projetos')) + 1]);
    expect(document.activeElement?.textContent).toContain('Projeto1.java');
    raiz.remove();
  });

  it('seta para a esquerda recolhe a pasta aberta e, num arquivo, volta à pasta', async () => {
    const { fixture, raiz, pasta, itens } = await abrir('/projeto-2');
    const arquivo = itens().find((i) => i.textContent?.includes('Projeto2.java'))!;
    arquivo.focus();

    await tecla(fixture, arquivo, 'ArrowLeft');
    expect(document.activeElement).toBe(pasta('projetos'));

    await tecla(fixture, pasta('projetos'), 'ArrowLeft');
    expect(pasta('projetos').getAttribute('aria-expanded')).toBe('false');
    raiz.remove();
  });

  it('Enter e Espaço alternam a pasta e não interferem no link do arquivo', async () => {
    const { fixture, raiz, pasta, itens } = await abrir('/projeto-2');

    await tecla(fixture, pasta('projetos'), 'Enter');
    expect(pasta('projetos').getAttribute('aria-expanded')).toBe('false');
    await tecla(fixture, pasta('projetos'), ' ');
    expect(pasta('projetos').getAttribute('aria-expanded')).toBe('true');

    const arquivo = itens().find((i) => i.tagName === 'A')!;
    const evento = new KeyboardEvent('keydown', { key: 'Enter', bubbles: true, cancelable: true });
    arquivo.dispatchEvent(evento);
    expect(evento.defaultPrevented).toBe(false);
    raiz.remove();
  });

  it('o item focável vira a pasta quando a pasta do arquivo atual é recolhida', async () => {
    const { fixture, raiz, pasta } = await abrir('/projeto-2');

    await tecla(fixture, pasta('projetos'), 'Enter');

    expect(pasta('projetos').getAttribute('tabindex')).toBe('0');
    raiz.remove();
  });
});
