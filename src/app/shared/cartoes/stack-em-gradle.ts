import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { PROJETOS } from '../../core/projetos';
import { STACK } from '../../core/perfil';
import type { GrupoDeStack } from '../../core/perfil';
import { FraseQueSeAcende } from '../movimento/frase-que-se-acende';

interface ItemDaStack {
  readonly nome: string;
  /** Primeiro projeto da vitrine que cita a tecnologia: a evidência do uso. */
  readonly projeto: { slug: string; titulo: string } | null;
}

interface GrupoComEvidencias extends Omit<GrupoDeStack, 'itens'> {
  readonly itens: readonly ItemDaStack[];
}

const normalizar = (texto: string): string => texto.toLowerCase();

/** A stack como o bloco `dependencies` de um `build.gradle`; cada tecnologia aponta o projeto onde foi usada. */
const GRUPOS: readonly GrupoComEvidencias[] = STACK.map((grupo) => ({
  ...grupo,
  itens: grupo.itens.map((nome) => {
    const projeto = PROJETOS.find((p) =>
      p.etiquetas.some((etiqueta) => normalizar(etiqueta) === normalizar(nome)),
    );
    return { nome, projeto: projeto ? { slug: projeto.slug, titulo: projeto.titulo } : null };
  }),
}));

@Component({
  selector: 'app-stack-em-gradle',
  imports: [FraseQueSeAcende, RouterLink],
  templateUrl: './stack-em-gradle.html',
  styleUrl: './stack-em-gradle.scss',
})
export class StackEmGradle {
  protected readonly grupos = GRUPOS;
}
