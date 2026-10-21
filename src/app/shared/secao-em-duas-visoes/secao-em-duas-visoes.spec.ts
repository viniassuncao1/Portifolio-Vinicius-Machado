import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap } from '@angular/router';

import { VisaoDoConteudoEscolhida } from '../../core/visao-do-conteudo';
import { comum, linha, vazia } from '../editor-de-codigo/conteudo';
import type { ConteudoDoEditor } from '../editor-de-codigo/conteudo';
import { SecaoEmDuasVisoes } from './secao-em-duas-visoes';

const CONTEUDO: ConteudoDoEditor = [vazia(), linha(0, comum('class Exemplo {}'))];

@Component({
  imports: [SecaoEmDuasVisoes],
  template: `
    <app-secao-em-duas-visoes [conteudo]="conteudo" tema="stack">
      <ng-template #cartao><p class="meu-cartao">Cartão</p></ng-template>
      <ng-template #extraDoCodigo><p class="meu-extra">Extra</p></ng-template>
    </app-secao-em-duas-visoes>
  `,
})
class Hospedeiro {
  protected readonly conteudo = CONTEUDO;
}

@Component({
  imports: [SecaoEmDuasVisoes],
  template: `
    <app-secao-em-duas-visoes [conteudo]="conteudo" tema="sobre">
      <ng-template #cartao><p class="meu-cartao">Cartão</p></ng-template>
    </app-secao-em-duas-visoes>
  `,
})
class SemExtra {
  protected readonly conteudo = CONTEUDO;
}

describe('SecaoEmDuasVisoes', () => {
  afterEach(() => localStorage.clear());

  async function montar<T>(componente: new () => T) {
    const fixture = TestBed.createComponent(componente);
    await fixture.whenStable();
    return { fixture, raiz: fixture.nativeElement as HTMLElement };
  }

  it('abre no cartão, com o tema da seção e o botão para o código', async () => {
    const { raiz } = await montar(Hospedeiro);

    expect(raiz.querySelector('.meu-cartao')).not.toBeNull();
    expect(raiz.querySelector('app-editor-de-codigo')).toBeNull();
    expect(raiz.querySelector('.meu-extra')).toBeNull();
    expect(raiz.querySelector('app-alternar-visao button')?.textContent).toContain(
      'Ver como código',
    );
  });

  it('na visão em código mostra o editor e o extra do código, sem o cartão', async () => {
    const { fixture, raiz } = await montar(Hospedeiro);

    TestBed.inject(VisaoDoConteudoEscolhida).escolher('codigo');
    await fixture.whenStable();

    expect(raiz.querySelector('app-editor-de-codigo')).not.toBeNull();
    expect(raiz.querySelector('.meu-extra')).not.toBeNull();
    expect(raiz.querySelector('.meu-cartao')).toBeNull();
    expect(raiz.querySelector('app-alternar-visao button')?.textContent).toContain(
      'Ver como cartão',
    );
  });

  it('o extra do código é opcional', async () => {
    const { fixture, raiz } = await montar(SemExtra);

    TestBed.inject(VisaoDoConteudoEscolhida).escolher('codigo');
    await fixture.whenStable();

    expect(raiz.querySelector('app-editor-de-codigo')).not.toBeNull();
    expect(raiz.querySelector('.meu-extra')).toBeNull();
  });

  it('?visao=codigo abre o código sem mudar a preferência guardada', async () => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { queryParamMap: convertToParamMap({ visao: 'codigo' }) } },
        },
      ],
    });

    const { raiz } = await montar(Hospedeiro);

    expect(raiz.querySelector('app-editor-de-codigo')).not.toBeNull();
    expect(localStorage.getItem('visao-do-conteudo')).toBeNull();
  });
});
