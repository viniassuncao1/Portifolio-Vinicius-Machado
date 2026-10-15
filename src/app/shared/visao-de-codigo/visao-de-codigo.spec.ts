import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';

import { JanelaDePreview } from '../../core/janela-de-preview';
import { PREVIEWS } from '../../core/previews';
import { VisaoDeCodigo } from './visao-de-codigo';

@Component({ template: '<app-visao-de-codigo />', imports: [VisaoDeCodigo] })
class Pagina {}

const abrirRota = async (rota: string): Promise<HTMLElement> => {
  TestBed.configureTestingModule({
    providers: [provideRouter([{ path: '**', component: Pagina }])],
  });
  const harness = await RouterTestingHarness.create();
  await harness.navigateByUrl(rota);
  harness.detectChanges();
  return harness.routeNativeElement as HTMLElement;
};

describe('VisaoDeCodigo', () => {
  it('mostra "▶ Executar · Ver o site ao vivo" nos projetos com site', async () => {
    const pagina = await abrirRota('/projeto-2');
    const botao = pagina.querySelector<HTMLButtonElement>('button.visao');
    expect(botao?.textContent?.replace(/\s+/g, ' ').trim()).toBe('▶ Executar · Ver o site ao vivo');
  });

  it('não aparece nas seções sem site', async () => {
    const pagina = await abrirRota('/projeto-1');
    expect(pagina.querySelector('button.visao')).toBeNull();
  });

  it('abre a janela de preview do projeto ao ativar', async () => {
    const pagina = await abrirRota('/projeto-2');
    pagina.querySelector<HTMLButtonElement>('button.visao')?.click();
    expect(TestBed.inject(JanelaDePreview).preview()).toBe(PREVIEWS['projeto-2']);
  });
});
