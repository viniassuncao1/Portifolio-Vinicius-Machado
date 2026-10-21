import { Component } from '@angular/core';

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
    Revelar,
    SobreEmCartoes,
    StackEmGradle,
    TemaDeSecao,
  ],
  templateUrl: './visao-geral.html',
  styleUrl: './visao-geral.scss',
})
export class VisaoGeral {}
