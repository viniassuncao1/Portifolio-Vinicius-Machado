import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { Icone, NOMES_DE_ICONE } from './icone';
import type { NomeDoIcone } from './icone';

@Component({
  imports: [Icone],
  template: `<app-icone [nome]="nome" />`,
})
class Hospedeiro {
  nome: NomeDoIcone = 'globo';
}

describe('Icone', () => {
  it('carrega o SVG do nome informado, sem texto alternativo', async () => {
    const fixture = TestBed.createComponent(Hospedeiro);
    await fixture.whenStable();
    const imagem = (fixture.nativeElement as HTMLElement).querySelector('img');

    expect(imagem?.getAttribute('src')).toContain('icones/globo.svg');
    expect(imagem?.getAttribute('alt')).toBe('');
  });

  it('expõe os nove ícones usados nas telas', () => {
    expect(NOMES_DE_ICONE).toHaveLength(9);
  });
});
