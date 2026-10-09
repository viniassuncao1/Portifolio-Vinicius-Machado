import { TestBed } from '@angular/core/testing';
import { Inicio } from './inicio';

describe('Inicio', () => {
  it('mostra o editor com o aviso provisório enquanto o conteúdo não chega', async () => {
    const fixture = TestBed.createComponent(Inicio);
    await fixture.whenStable();
    const element = fixture.nativeElement as HTMLElement;

    expect(element.querySelector('app-editor-de-codigo')).not.toBeNull();
    expect(element.querySelector('h1')).toBeNull();
  });
});
