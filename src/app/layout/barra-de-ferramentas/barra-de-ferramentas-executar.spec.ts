import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';

import { JanelaDePreview } from '../../core/janela-de-preview';
import { PREVIEWS } from '../../core/previews';
import { BarraDeFerramentas } from './barra-de-ferramentas';

@Component({ imports: [BarraDeFerramentas], template: '<app-barra-de-ferramentas />' })
class Pagina {}

describe('BarraDeFerramentas: play', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideRouter([
          { path: 'projeto-3', component: Pagina },
          { path: 'contato', component: Pagina },
        ]),
      ],
    });
  });

  it('vira o botão "Executar o projeto" nas rotas com preview', async () => {
    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl('/projeto-3');
    const barra = (harness.routeNativeElement as HTMLElement).querySelector(
      'app-barra-de-ferramentas',
    )!;
    const botao = barra.querySelector<HTMLButtonElement>('button.executar')!;

    expect(botao.getAttribute('aria-label')).toBe('Executar o projeto');
    expect(botao.hasAttribute('aria-hidden')).toBe(false);

    botao.click();
    expect(TestBed.inject(JanelaDePreview).preview()).toBe(PREVIEWS['projeto-3']);
  });

  it('segue decorativo e sem foco nas demais rotas', async () => {
    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl('/contato');
    const barra = (harness.routeNativeElement as HTMLElement).querySelector(
      'app-barra-de-ferramentas',
    )!;

    const executar = barra.querySelector('.executar')!;

    expect(executar.getAttribute('aria-hidden')).toBe('true');
    expect(executar.matches('button, a, [tabindex]')).toBe(false);
  });
});
