import { TestBed } from '@angular/core/testing';

import { EstadoDoEditor } from './estado-do-editor';

describe('EstadoDoEditor', () => {
  it('começa na linha 1, coluna 1', () => {
    const estado = TestBed.inject(EstadoDoEditor);

    expect([estado.linha(), estado.coluna()]).toEqual([1, 1]);
  });

  it('posicionar atualiza linha e coluna e reiniciar volta ao começo', () => {
    const estado = TestBed.inject(EstadoDoEditor);

    estado.posicionar(7, 12);
    expect([estado.linha(), estado.coluna()]).toEqual([7, 12]);

    estado.reiniciar();
    expect([estado.linha(), estado.coluna()]).toEqual([1, 1]);
  });
});
