import { Component, DOCUMENT, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { ENDERECO_DO_CURRICULO } from '../../core/perfil';
import { MovimentoConfig } from '../../core/movimento/movimento-config';
import { AcoesDoRecrutador } from '../../shared/acoes-do-recrutador/acoes-do-recrutador';
import { AlternarVisao } from '../../shared/alternar-visao/alternar-visao';
import { Revelar } from '../../shared/movimento/revelar';
import { TemaDeSecao } from '../../shared/movimento/tema-de-secao';
import { Hero } from './hero';
import { ContatoEmTerminal } from './secoes/contato-em-terminal';
import { ExperienciaEmGrafo } from './secoes/experiencia-em-grafo';
import { FormacaoEIdiomas } from './secoes/formacao-e-idiomas';
import { ProjetosEmDestaque } from './secoes/projetos-em-destaque';
import { Provas } from './secoes/provas';
import { SobreEmCartoes } from './secoes/sobre-em-cartoes';
import { StackEmGradle } from './secoes/stack-em-gradle';

/**
 * A visão "Cartão" do Início: a página que quem recruta lê em segundos (ADR-0019). Cada bloco tem o
 * seu tema de cor, que o `appTemaDeSecao` aplica ao `<html>` quando ele passa da metade da janela.
 * O código Java do Início continua na visão "Código".
 */
@Component({
  selector: 'app-visao-geral',
  imports: [
    AcoesDoRecrutador,
    AlternarVisao,
    ContatoEmTerminal,
    ExperienciaEmGrafo,
    FormacaoEIdiomas,
    Hero,
    ProjetosEmDestaque,
    Provas,
    RouterLink,
    Revelar,
    SobreEmCartoes,
    StackEmGradle,
    TemaDeSecao,
  ],
  templateUrl: './visao-geral.html',
  styleUrl: './visao-geral.scss',
})
export class VisaoGeral {
  private readonly documento = inject(DOCUMENT);
  private readonly movimento = inject(MovimentoConfig);
  protected readonly curriculo = ENDERECO_DO_CURRICULO;

  /** Atalho do celular: leva à faixa do contato, sem animação com movimento reduzido. */
  protected irParaOContato(): void {
    this.documento.getElementById('contato-do-inicio')?.scrollIntoView({
      behavior: this.movimento.reduzido() ? 'auto' : 'smooth',
      block: 'start',
    });
  }
}
