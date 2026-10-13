import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';

import { JanelaDePreview } from '../../core/janela-de-preview';
import { PREVIEWS } from '../../core/previews';
import { BotaoExecutar } from './botao-executar';

@Component({ imports: [BotaoExecutar], template: '<app-botao-executar />' })
class Pagina {}

describe('BotaoExecutar', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideRouter([
          { path: 'projeto-2', component: Pagina },
          { path: 'contato', component: Pagina },
        ]),
      ],
    });
  });

  it('aparece nos projetos com site e abre o preview ao ativar', async () => {
    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl('/projeto-2');
    const botao = (harness.routeNativeElement as HTMLElement).querySelector('button')!;

    expect(botao.textContent).toContain('Executar');
    botao.click();

    expect(TestBed.inject(JanelaDePreview).preview()).toBe(PREVIEWS['projeto-2']);
  });

  it('não aparece nas seções sem site', async () => {
    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl('/contato');

    expect((harness.routeNativeElement as HTMLElement).querySelector('button')).toBeNull();
  });
});
