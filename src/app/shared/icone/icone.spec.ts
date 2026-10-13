import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { Icone, NOMES_DE_ICONE } from './icone';
import type { NomeDoIcone } from './icone';

@Component({
  imports: [Icone],
  template: `<app-icone [nome]="nome" />`,
})
class Hospedeiro {
  nome: NomeDoIcone = 'java';
}

describe('Icone', () => {
  it('carrega o SVG do nome informado, sem texto alternativo', async () => {
    const fixture = TestBed.createComponent(Hospedeiro);
    await fixture.whenStable();
    const imagem = (fixture.nativeElement as HTMLElement).querySelector('img');

    expect(imagem?.getAttribute('src')).toContain('icones/new-ui/java.svg');
    expect(imagem?.getAttribute('alt')).toBe('');
  });

  it('expõe os dezessete ícones da New UI', () => {
    expect(NOMES_DE_ICONE).toHaveLength(17);
  });

  it.each(NOMES_DE_ICONE)('aponta o ícone %s para o seu arquivo SVG', async (nome) => {
    const fixture = TestBed.createComponent(Hospedeiro);
    fixture.componentInstance.nome = nome;
    await fixture.whenStable();
    const imagem = (fixture.nativeElement as HTMLElement).querySelector('img');

    expect(imagem?.getAttribute('src')).toContain(`icones/new-ui/${nome}.svg`);
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
