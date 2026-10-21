import { DestroyRef, PLATFORM_ID, Service, afterNextRender, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

const INTERVALO_MS = 30_000;
const FORMATO = { hour: '2-digit', minute: '2-digit', timeZone: 'America/Sao_Paulo' } as const;

/**
 * Hora de Brasília em `HH:mm`, atualizada a cada 30 s, para a barra de status. Vazia no servidor e
 * até a hidratação: a hora do pré-render seria sempre outra e a tela trocaria o texto à toa.
 */
@Service()
export class RelogioDeBrasilia {
  private readonly navegador = isPlatformBrowser(inject(PLATFORM_ID));
  private readonly agora = signal('');

  readonly hora = this.agora.asReadonly();

  constructor() {
    const destruir = inject(DestroyRef);
    afterNextRender(() => {
      if (!this.navegador) return;
      this.atualizar();
      const id = setInterval(() => this.atualizar(), INTERVALO_MS);
      destruir.onDestroy(() => clearInterval(id));
    });
  }

  private atualizar(): void {
    this.agora.set(new Intl.DateTimeFormat('pt-BR', FORMATO).format(new Date()));
  }
}
