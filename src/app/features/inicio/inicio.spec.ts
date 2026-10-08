import { TestBed } from '@angular/core/testing';
import { Inicio } from './inicio';

describe('Inicio', () => {
  it('exibe o título do portfólio', async () => {
    const fixture = TestBed.createComponent(Inicio);
    await fixture.whenStable();
    const element = fixture.nativeElement as HTMLElement;

    expect(element.querySelector('h1')?.textContent).toContain('Portfolio_Vinicius');
  });
});
