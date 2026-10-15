# Proposal

## Why

A auditoria de UX de 14/10 (skills do ECC: web-design-guidelines, make-interfaces-feel-better,
redesign-existing-projects e accessibility, com capturas em desktop e celular nos dois temas)
mostrou que um recrutador com 30 segundos tem dificuldade para saber quem é o Vinicius, para
onde ir e como entrar em contato. O axe também acusou `target-size` nos contatos no celular.

## What Changes

- **Início que se apresenta:** "Vinicius Machado" e o cargo em destaque (`@author` no Javadoc e
  `h1` "Vinicius Machado, Desenvolvedor Full Stack") e, no fim do código, atalhos clicáveis
  `// Próximo: ver os projetos →` e `// Fale comigo →`.
- **"Próximo arquivo →"** no fim de cada seção, na ordem da árvore, para seguir lendo sem voltar
  à árvore.
- **Contatos que parecem links:** sublinhado pontilhado, ícone ↗ nos externos, área de toque de
  pelo menos 24 px (44 px no celular) e o botão "Copiar e-mail".
- **Preview fácil de achar:** nos projetos com site, uma linha no estilo *code vision* do
  IntelliJ acima da classe: `▶ Executar · Ver o site ao vivo`.
- **Celular:** quebra de linha suave no código (sem cortar texto à direita), rótulo "Seções" no
  botão da árvore e pastas abertas na gaveta.
- **Modo de leitura do Javadoc:** bio, descrições e depoimentos aparecem como texto formatado
  (Rendered View do IntelliJ), com um botão na calha para ver o comentário cru.
- **Abas:** no máximo 5 abertas (fecha a mais antiga, como o "Tab limit" do IntelliJ).
- **Ícones decorativos** da barra mais apagados e sem efeito de hover, para não parecerem
  clicáveis.
- Entrada do diário.

## Capabilities

### New Capabilities

Nenhuma.

### Modified Capabilities

- `secao-inicio`, `paginas-de-secao`, `secao-contato`, `janela-de-preview`, `editor-de-codigo`,
  `casca-da-ide`, `abas-do-editor`.

## Impact

- Código: conteúdo do Início, editor (quebra suave, code vision, atalhos), seções (próximo
  arquivo), contato, abas, casca no celular, barra superior.
- Testes: unitários e E2E (atalhos, próximo arquivo, alvo de toque, copiar e-mail, celular sem
  corte, limite de abas, axe nos dois temas).
