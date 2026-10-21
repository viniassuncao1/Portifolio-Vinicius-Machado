import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { PROJETOS } from '../../core/projetos';
import { CartaoDeProjeto } from './cartao-de-projeto';

const COM_IMAGEM = PROJETOS.find((p) => p.imagens.length > 0)!;
const SEM_IMAGEM = PROJETOS.find((p) => p.imagens.length === 0)!;

function montar(projeto = SEM_IMAGEM) {
  TestBed.configureTestingModule({ providers: [provideRouter([{ path: '**', children: [] }])] });
  const fixture = TestBed.createComponent(CartaoDeProjeto);
  fixture.componentRef.setInput('projeto', projeto);
  fixture.detectChanges();
  const raiz = fixture.nativeElement as HTMLElement;
  return { fixture, raiz, link: raiz.querySelector('a.cartao') as HTMLAnchorElement };
}

describe('CartaoDeProjeto', () => {
  it('é um link real para os detalhes do projeto', () => {
    const { link } = montar(PROJETOS[3]);

    expect(link.getAttribute('href')).toBe('/projetos/ana');
    expect(link.getAttribute('data-slug')).toBe('ana');
  });

  it('mostra o contador, o título, as etiquetas e os destaques', () => {
    const { raiz } = montar(PROJETOS[3]);

    expect(raiz.querySelector('.numero')?.textContent).toBe('04 / 06');
    expect(raiz.querySelector('.titulo')?.textContent).toBe(PROJETOS[3].titulo);
    expect(raiz.querySelectorAll('.etiqueta')).toHaveLength(PROJETOS[3].etiquetas.length);
    expect(raiz.querySelectorAll('.destaque')).toHaveLength(PROJETOS[3].destaques.length);
  });

  it('com captura de tela mostra a imagem, com texto alternativo e dimensões', () => {
    const { raiz } = montar(COM_IMAGEM);

    const img = raiz.querySelector('img');
    expect(img?.getAttribute('alt')).toBe(COM_IMAGEM.imagens[0].alt);
    expect(img?.getAttribute('width')).toBe(String(COM_IMAGEM.imagens[0].largura));
    expect(raiz.querySelector('app-capa-em-codigo')).toBeNull();
  });

  it('sem captura mostra a capa em código, escondida de leitores de tela', () => {
    const { raiz } = montar(SEM_IMAGEM);

    const capa = raiz.querySelector('app-capa-em-codigo');
    expect(capa?.getAttribute('aria-hidden')).toBe('true');
    expect(capa?.textContent).toContain(SEM_IMAGEM.capa.classe);
    expect(raiz.querySelector('img')).toBeNull();
  });

  it('o clique comum abre os detalhes sem seguir o link', () => {
    const { fixture, link } = montar(PROJETOS[1]);
    const abertos: unknown[] = [];
    fixture.componentInstance.abrir.subscribe((valor) => abertos.push(valor));

    const evento = new MouseEvent('click', { bubbles: true, cancelable: true });
    link.dispatchEvent(evento);

    expect(evento.defaultPrevented).toBe(true);
    expect(abertos).toEqual([{ projeto: PROJETOS[1], origem: link }]);
  });

  it('o clique com Ctrl segue o link normal (nova aba)', () => {
    const { fixture, link } = montar(PROJETOS[1]);
    const abertos: unknown[] = [];
    fixture.componentInstance.abrir.subscribe((valor) => abertos.push(valor));

    const evento = new MouseEvent('click', { bubbles: true, cancelable: true, ctrlKey: true });
    link.dispatchEvent(evento);

    expect(evento.defaultPrevented).toBe(false);
    expect(abertos).toEqual([]);
  });

  it('o cartão fora do centro do carrossel fica marcado como inativo', () => {
    const { fixture, link } = montar();
    expect(link.getAttribute('data-ativo')).toBe('true');

    fixture.componentRef.setInput('ativo', false);
    fixture.detectChanges();

    expect(link.getAttribute('data-ativo')).toBe('false');
  });
});
