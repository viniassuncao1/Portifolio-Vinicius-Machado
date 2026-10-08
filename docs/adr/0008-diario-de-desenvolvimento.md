# ADR-0008: Diário de desenvolvimento

- **Status:** Aceito
- **Data:** 2026-10-08

## Contexto

O portfólio é uma vitrine e eu quero mostrar o processo, não só o resultado. Hoje as decisões
ficam espalhadas entre changes do OpenSpec, ADRs e Pull Requests. Isso serve ao código, mas não
conta a história para quem chega de fora. Também quero transformar o que aprendo em posts no
LinkedIn sem precisar reconstruir o raciocínio semanas depois.

## Decisão

Registrar **cada change** do OpenSpec numa entrada do diário em `docs/diario/`, no mesmo Pull
Request da change e antes do merge.

Cada entrada tem o problema, as decisões e as alternativas descartadas, o que foi aprendido, os
links para a change, o PR e os ADRs, e um **rascunho de post para o LinkedIn** em pt-BR. O
`docs/diario/README.md` guarda o modelo da entrada e o índice em ordem cronológica.

O Escriba escreve a entrada e eu reviso o rascunho do post antes de publicar. O diário começa
com uma entrada retroativa sobre a fundação do projeto.

## Alternativas consideradas

- **Só os ADRs:** registram decisões isoladas, mas não contam a evolução nem têm espaço para o
  aprendizado e para o post.
- **Blog ou newsletter externa:** teria mais alcance, mas separaria o texto do código e exigiria
  outra ferramenta para manter.
- **Escrever os posts quando houver tempo:** o contexto se perde e o post acaba não saindo.

## Consequências

- Todo PR de uma change inclui um arquivo novo em `docs/diario/` e a atualização do índice.
- Cada change ganha uma tarefa de documentação a mais, feita pelo Escriba.
- O rascunho do post é só um rascunho: nada é publicado sem a minha revisão.
- Os posts devem relatar fatos do projeto, sem números ou resultados inventados.
