import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';

import { Component } from '@angular/core';
import { JanelaDePreview } from './janela-de-preview';
import { PREVIEWS } from './previews';

@Component({ template: '' })
class Pagina {}

describe('JanelaDePreview (serviço)', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideRouter([
          { path: 'projeto-2', component: Pagina },
          { path: 'sobre-mim', component: Pagina },
        ]),
      ],
    });
  });

  it('acha o preview da rota nos projetos com site', async () => {
    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl('/projeto-2');

    expect(TestBed.inject(JanelaDePreview).previewDaRota()).toBe(PREVIEWS['projeto-2']);
  });

  it('não acha preview em seções sem site', async () => {
    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl('/sobre-mim');

    expect(TestBed.inject(JanelaDePreview).previewDaRota()).toBeUndefined();
  });

  it('abre o preview e devolve o foco ao botão de origem ao fechar', () => {
    const janela = TestBed.inject(JanelaDePreview);
    const origem = document.createElement('button');
    document.body.append(origem);

    janela.abrir(PREVIEWS['projeto-2'], origem);
    expect(janela.preview()).toBe(PREVIEWS['projeto-2']);

    janela.fechar();
    expect(janela.preview()).toBeNull();
    expect(document.activeElement).toBe(origem);
    origem.remove();
  });
});
