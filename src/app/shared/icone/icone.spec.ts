import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import {
  Icone,
  NOMES_DE_ICONE,
  caminhoClaroDoIcone,
  caminhoDoIcone,
  temVarianteClara,
} from './icone';
import type { NomeDoIcone } from './icone';

@Component({
  imports: [Icone],
  template: `<app-icone [nome]="nome" />`,
})
class Hospedeiro {
  nome: NomeDoIcone = 'design-pasta';
}

describe('Icone', () => {
  it('carrega o SVG do nome informado, sem texto alternativo', async () => {
    const fixture = TestBed.createComponent(Hospedeiro);
    await fixture.whenStable();
    const imagem = (fixture.nativeElement as HTMLElement).querySelector('img');

    expect(imagem?.getAttribute('src')).toContain('icones/pasta.svg');
    expect(imagem?.getAttribute('alt')).toBe('');
  });

  it('expõe os onze ícones do design e os oito da IntelliJ Platform', () => {
    expect(NOMES_DE_ICONE).toHaveLength(19);
  });

  it.each(NOMES_DE_ICONE)('aponta o ícone %s para o seu arquivo SVG', async (nome) => {
    const fixture = TestBed.createComponent(Hospedeiro);
    fixture.componentInstance.nome = nome;
    await fixture.whenStable();
    const imagem = (fixture.nativeElement as HTMLElement).querySelector('img');

    expect(imagem?.getAttribute('src')).toContain(caminhoDoIcone(nome));
  });

  it('manda os ícones do design para public/icones e os da IntelliJ para icones/new-ui', () => {
    expect(caminhoDoIcone('design-arquivo')).toBe('icones/arquivo.svg');
    expect(caminhoDoIcone('executar')).toBe('icones/new-ui/executar.svg');
  });

  it('os ícones da IntelliJ Platform trazem as duas variantes, escura e clara, e os do design uma só', async () => {
    const fixture = TestBed.createComponent(Hospedeiro);
    fixture.componentInstance.nome = 'ramo';
    await fixture.whenStable();
    const srcs = Array.from((fixture.nativeElement as HTMLElement).querySelectorAll('img')).map(
      (img) => img.getAttribute('src'),
    );

    expect(srcs).toEqual([
      expect.stringContaining('icones/new-ui/ramo.svg'),
      expect.stringContaining('icones/new-ui/claro/ramo.svg'),
    ]);
    expect(caminhoClaroDoIcone('ramo')).toBe('icones/new-ui/claro/ramo.svg');
    expect(temVarianteClara('design-pasta')).toBe(false);
  });

  it('não tem papel de imagem para tecnologias assistivas', async () => {
    const fixture = TestBed.createComponent(Hospedeiro);
    await fixture.whenStable();

    expect((fixture.nativeElement as HTMLElement).querySelector('img[alt=""]')).not.toBeNull();
    expect(
      (fixture.nativeElement as HTMLElement).querySelector('img[alt]:not([alt=""])'),
    ).toBeNull();
  });
});
