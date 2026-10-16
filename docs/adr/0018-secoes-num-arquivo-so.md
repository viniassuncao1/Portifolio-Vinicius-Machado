# ADR-0018: Seções num arquivo só, sem paginação

- **Status:** Aceito
- **Data:** 2026-10-15
- **Refina:** [ADR-0011](0011-identidade-visual-intellij-new-ui.md), item 2 (que previa o fim da
  paginação com vários arquivos por seção)

## Contexto

Cinco seções (Skills, Experiências, Certificações, Projeto 4 e Projeto 5) eram divididas em
páginas, com rotas `/<seção>/<n>` e um controle `◂ n/N ▸` abaixo do código. O
[ADR-0011](0011-identidade-visual-intellij-new-ui.md) já apontava que a paginação não existe numa
IDE de verdade e previa que as seções com várias páginas virassem **vários arquivos no pacote**.
Ao ver o resultado, o Vinicius não gostou do controle: ele esconde conteúdo atrás de cliques. Ele
quer cada seção inteira na mesma tela, **como um arquivo Java que se rola**.

## Decisão

1. **Cada seção é um arquivo só, rolando.** O conteúdo de todas as partes fica no mesmo
   `.java`: o cabeçalho (`package`, `import` e a declaração da classe) aparece uma vez e cada parte
   vira um bloco da mesma classe, com um comentário de cabeçalho (`// Memora`, `// Watts
Company`), o Javadoc no modo de leitura e a instância. O Java continua válido, com
   identificadores em português.
2. **O controle de páginas sai do site inteiro**, junto com o campo `paginas` das seções e as rotas
   por página.
3. **Os endereços antigos continuam funcionando.** `/<seção>/<n>` (como `/skills/2` ou
   `/projeto-5/4`) leva a `/<seção>`, para não quebrar links já compartilhados, e deixa de constar
   do sitemap.
4. **Título, abas, busca e "Próximo arquivo" deixam de considerar páginas.** O "Próximo arquivo"
   fica no fim do arquivo.

## Alternativas consideradas

- **Vários arquivos por seção na árvore** (a previsão do ADR-0011). Fica fiel a um projeto Java, mas
  troca o clique de página pelo clique de arquivo, e a árvore enche de itens.
- **Manter a paginação.** Esconde conteúdo atrás de cliques e não existe numa IDE.

## Consequências

- O visitante lê cada seção de cima a baixo, sem clicar, e o fim do arquivo leva ao próximo.
- Seções longas pedem a quebra suave e o modo de leitura do Javadoc, que já existem; a digitação
  do código termina em até 1,5 s qualquer que seja o tamanho.
- Os endereços de página deixam de existir de verdade, e só os redirecionamentos os mantêm.
- A documentação do controle de páginas e do campo `paginas` fica obsoleta.
