# ADR-0013: Histórico do Git gerado no build

- **Status:** Aceito
- **Data:** 2026-10-14

## Contexto

O Vinicius quer que o indicador `master` e o ícone Commit abram um painel do Git como o do
IntelliJ, mostrando o histórico real do repositório (commits, branches e merges dos PRs). O site
é pré-renderizado e estático ([ADR-0003](0003-pre-renderizacao-estatica.md)), e o processo do
projeto (changes, Conventional Commits em pt-BR, PRs) é parte do que o portfólio mostra.

## Decisão

O histórico é lido com `git log` **durante o build**, por um script em `scripts/`, e gravado
num JSON estático servido pelo próprio site, carregado só quando o painel abre. O script grava
para cada commit o SHA, os pais, o nome do autor, a data, o assunto e, nos merges de PR, o
número e a branch. **E-mails não são publicados.** Os jobs do CI que fazem build usam
`fetch-depth: 0` para ter o histórico completo; sem histórico (clone raso ou sem `git`), o
painel mostra uma mensagem e o build não falha.

## Alternativas consideradas

- **API do GitHub no navegador.** Sempre atualizada, mas tem limite de 60 requisições por hora
  sem token, depende de rede e deixa o painel lento.
- **API do GitHub no build.** Exigiria token no CI para não esbarrar no limite, sem ganho sobre
  o `git log`, que já está no runner.

## Consequências

- O histórico se atualiza a cada deploy; entre deploys, fica igual ao do último build.
- O checkout dos jobs de build fica um pouco mais lento (histórico completo).
- O JSON gerado não é versionado (`.gitignore`).
