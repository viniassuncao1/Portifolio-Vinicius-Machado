import { ApplicationRef } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { AVISO_DE_EMAIL_COPIADO, AVISO_DE_EMAIL_NAO_COPIADO, CopiarEmail } from './copiar-email';
import { EMAIL_DE_CONTATO } from './perfil';

describe('CopiarEmail', () => {
  afterEach(() => vi.unstubAllGlobals());

  function criar(escrever: ((texto: string) => Promise<void>) | undefined) {
    vi.stubGlobal('navigator', escrever ? { clipboard: { writeText: escrever } } : {});
    const servico = TestBed.inject(CopiarEmail);
    TestBed.inject(ApplicationRef).tick();
    return servico;
  }

  it('só fica disponível com a Clipboard API, depois da hidratação', () => {
    expect(criar(vi.fn().mockResolvedValue(undefined)).disponivel()).toBe(true);
  });

  it('sem a Clipboard API o botão não aparece', () => {
    TestBed.resetTestingModule();

    expect(criar(undefined).disponivel()).toBe(false);
  });

  it('copia o e-mail de contato e avisa', async () => {
    const escrever = vi.fn().mockResolvedValue(undefined);
    const servico = criar(escrever);

    await servico.copiar();

    expect(escrever).toHaveBeenCalledWith(EMAIL_DE_CONTATO);
    expect(servico.aviso()).toBe(AVISO_DE_EMAIL_COPIADO);
  });

  it('avisa quando a cópia falha', async () => {
    const servico = criar(vi.fn().mockRejectedValue(new Error('negado')));

    await servico.copiar();

    expect(servico.aviso()).toBe(AVISO_DE_EMAIL_NAO_COPIADO);
  });
});
