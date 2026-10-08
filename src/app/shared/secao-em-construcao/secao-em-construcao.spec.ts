import { TestBed } from '@angular/core/testing';

import { SecaoEmConstrucao } from './secao-em-construcao';

describe('SecaoEmConstrucao', () => {
  it('mostra no editor um comentário avisando que a seção está em construção', async () => {
    const fixture = TestBed.createComponent(SecaoEmConstrucao);
    await fixture.whenStable();
    const aviso = (fixture.nativeElement as HTMLElement).querySelector('.paragrafo');

    expect(aviso?.textContent).toContain('em construção');
  });
});
