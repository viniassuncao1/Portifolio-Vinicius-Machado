import { TestBed } from '@angular/core/testing';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import {
  AVISO_DE_INICIALIZACAO,
  BoasVindas,
  CHAVE_DAS_BOAS_VINDAS,
  DURACAO_DO_AVISO_MS,
} from './boas-vindas';

describe('BoasVindas', () => {
  beforeEach(() => sessionStorage.clear());
  afterEach(() => vi.useRealTimers());

  it('só é a primeira vista uma vez por sessão', () => {
    const servico = TestBed.inject(BoasVindas);

    expect(servico.registrarPrimeiraVista()).toBe(true);
    expect(sessionStorage.getItem(CHAVE_DAS_BOAS_VINDAS)).toBe('1');
    expect(servico.registrarPrimeiraVista()).toBe(false);
  });

  it('com o armazenamento bloqueado mostra e segue', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('bloqueado');
    });

    expect(TestBed.inject(BoasVindas).registrarPrimeiraVista()).toBe(true);
    vi.restoreAllMocks();
  });

  it('o aviso de inicialização dura 6 s e some', () => {
    vi.useFakeTimers();
    const servico = TestBed.inject(BoasVindas);
    expect(servico.aviso()).toBe('');

    servico.avisarInicializacao();
    expect(servico.aviso()).toBe(AVISO_DE_INICIALIZACAO);
    expect(AVISO_DE_INICIALIZACAO).toBe('PortfolioApplication started in 1.8 s');

    vi.advanceTimersByTime(DURACAO_DO_AVISO_MS - 1);
    expect(servico.aviso()).toBe(AVISO_DE_INICIALIZACAO);
    vi.advanceTimersByTime(1);
    expect(servico.aviso()).toBe('');
  });
});
