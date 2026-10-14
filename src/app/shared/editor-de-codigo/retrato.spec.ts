import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { comum, javadoc, javadocComRetrato, linha } from './conteudo';
import type { ConteudoDoEditor } from './conteudo';
import { EditorDeCodigo } from './editor-de-codigo';

@Component({
  imports: [EditorDeCodigo],
  template: `<app-editor-de-codigo [conteudo]="conteudo" />`,
})
class Hospedeiro {
  readonly conteudo: ConteudoDoEditor = [
    javadocComRetrato(
      0,
      'Texto da recomendação.',
      { src: 'fotos/luana-porto.webp', alt: 'Foto de Luana Porto', tamanho: 'pequeno' },
      { nome: 'Luana Porto', href: 'https://www.linkedin.com/in/luana-porto-pereira-gomes/' },
    ),
    javadocComRetrato(0, 'Sem autor.', {
      src: 'fotos/vinicius.webp',
      alt: 'Foto de Vinicius Machado',
      tamanho: 'grande',
      prioridade: true,
    }),
    javadoc(0, 'Sem retrato.'),
    linha(0, comum('class A {}')),
  ];
}

describe('Javadoc com retrato', () => {
  function renderizar(): HTMLElement {
    const fixture = TestBed.createComponent(Hospedeiro);
    fixture.detectChanges();
    return fixture.nativeElement as HTMLElement;
  }

  it('cria a linha com retrato e autor', () => {
    const item = javadocComRetrato(1, 'T', { src: 's', alt: 'a', tamanho: 'grande' });

    expect(item).toEqual({
      tipo: 'javadoc',
      recuo: 1,
      texto: 'T',
      retrato: { src: 's', alt: 'a', tamanho: 'grande' },
    });
  });

  it('mostra a foto com alt, largura e altura fixas dentro do Javadoc', () => {
    const fotos = renderizar().querySelectorAll<HTMLImageElement>('.javadoc img.retrato');

    expect(fotos).toHaveLength(2);
    expect(fotos[0].getAttribute('alt')).toBe('Foto de Luana Porto');
    expect(fotos[0].getAttribute('src')).toContain('fotos/luana-porto.webp');
    expect([fotos[0].width, fotos[0].height]).toEqual([64, 64]);
    expect([fotos[1].width, fotos[1].height]).toEqual([96, 96]);
    expect(fotos[0].classList.contains('pequeno')).toBe(true);
  });

  it('só a foto com prioridade carrega sem preguiça', () => {
    const fotos = renderizar().querySelectorAll('img.retrato');

    expect(fotos[0].getAttribute('loading')).toBe('lazy');
    expect(fotos[1].getAttribute('fetchpriority')).toBe('high');
  });

  it('não põe foto no Javadoc sem retrato', () => {
    expect(renderizar().querySelectorAll('.javadoc')[2].querySelector('img')).toBeNull();
  });

  it('termina com @author e o nome como link externo seguro, com aviso de nova aba', () => {
    const autor = renderizar().querySelector('.javadoc-autor')!;
    const link = autor.querySelector('a')!;

    expect(autor.textContent).toContain('@author Luana Porto');
    expect(link.getAttribute('href')).toBe(
      'https://www.linkedin.com/in/luana-porto-pereira-gomes/',
    );
    expect(link.getAttribute('target')).toBe('_blank');
    expect(link.getAttribute('rel')).toBe('noopener noreferrer');
    expect(link.textContent).toContain('(abre em nova aba)');
  });

  it('o Javadoc sem autor não tem linha de @author', () => {
    expect(renderizar().querySelectorAll('.javadoc-autor')).toHaveLength(1);
  });
});
