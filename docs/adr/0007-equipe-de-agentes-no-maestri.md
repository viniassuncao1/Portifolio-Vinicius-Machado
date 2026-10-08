# ADR-0007: Equipe de agentes de IA no Maestri

- **Status:** Aceito
- **Data:** 2026-10-08

## Contexto

O portfólio envolve frentes diferentes: implementar o design com fidelidade, criar animações,
escrever testes e manter a documentação. Um único agente fazendo tudo perde o foco e mistura
responsabilidades. Também quero demonstrar como coordenar vários agentes de IA de forma
organizada.

## Decisão

Trabalhar com uma **equipe de agentes** no [Maestri](https://www.themaestri.app/pt-br), um
espaço de trabalho visual em que terminais de agentes, notas e navegadores ficam num canvas e se
comunicam entre si.

- **Um maestro (Claude Opus 5.5):** planeja com o OpenSpec, divide o trabalho, revisa, faz os
  commits de integração e abre os PRs.
- **Especialistas (Claude Sonnet 5.5):** design/UI, animações, testes e documentação, cada um com
  um papel e um escopo definidos.

Os papéis estão em [docs/equipe-de-agentes/](../equipe-de-agentes/README.md).

## Motivos

- **Modelo certo para cada tarefa.** O Opus fica com o que exige raciocínio (planejamento,
  revisão, decisões); o Sonnet executa tarefas bem definidas com custo menor e mais rapidez.
- **Foco por papel.** Cada agente carrega só o contexto do seu papel.
- **Paralelismo.** Testes e documentação andam junto com a implementação.
- **Visibilidade.** No canvas eu acompanho quem está fazendo o quê e posso intervir.

## Alternativas consideradas

- **Um único agente:** mais simples, mas sobrecarrega o contexto e mistura responsabilidades.
- **Subagentes dentro de uma sessão do Claude Code:** bons para tarefas curtas, mas não ficam
  disponíveis entre tarefas e não são visíveis como uma equipe.

## Consequências

- Agentes trabalhando na mesma cópia do repositório podem gerar conflitos. Por isso o maestro só
  dispara em paralelo tarefas que mexem em arquivos diferentes; o resto é feito em sequência.
- O processo continua o mesmo para todos: change no OpenSpec, branch, commits pequenos, PR e CI.
- A configuração da equipe (presets e papéis) vive no Maestri; o repositório guarda os prompts de
  cada papel para que a equipe possa ser recriada.
