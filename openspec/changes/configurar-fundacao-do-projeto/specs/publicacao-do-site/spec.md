# Spec Delta

## Purpose

Manter a versão pública do portfólio sempre igual ao conteúdo da `main`, servida como site
estático pré-renderizado, rápido e indexável por buscadores.

## ADDED Requirements

### Requirement: Publicação contínua a partir da main
O sistema SHALL publicar automaticamente o site no GitHub Pages a cada push na `main`, desde
que o build de produção termine com sucesso.

#### Scenario: Merge de PR na main
- **WHEN** um Pull Request é mesclado na `main`
- **THEN** uma nova versão do site fica disponível no endereço público do GitHub Pages

#### Scenario: Build quebrado
- **WHEN** o build de produção falha
- **THEN** nada é publicado e a versão anterior do site continua no ar

### Requirement: Páginas pré-renderizadas
O sistema MUST entregar o HTML de cada rota já renderizado, sem depender de JavaScript para
exibir o conteúdo inicial.

#### Scenario: Acesso sem JavaScript
- **WHEN** a página inicial é carregada com JavaScript desabilitado
- **THEN** o conteúdo principal da página aparece no HTML recebido

### Requirement: Rota inexistente
O sistema SHALL responder a uma rota inexistente exibindo a aplicação, em vez da página de
erro padrão do GitHub Pages.

#### Scenario: Acesso a URL inválida
- **WHEN** o visitante acessa um caminho que não existe no site
- **THEN** o site do portfólio é exibido no lugar da página 404 padrão do GitHub
