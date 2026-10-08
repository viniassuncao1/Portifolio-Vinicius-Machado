# Spec Delta

## Purpose

Manter a versão pública do portfólio sempre igual ao conteúdo da `main`, servida como site
estático pré-renderizado, e permitir revisar cada Pull Request numa versão de preview.

## ADDED Requirements

### Requirement: Publicação contínua a partir da main
O sistema SHALL publicar automaticamente o site em produção a cada push na `main`, somente
depois que todas as verificações do pipeline de qualidade passarem.

#### Scenario: Merge de PR na main
- **WHEN** um Pull Request é mesclado na `main`
- **THEN** uma nova versão do site fica disponível no endereço público de produção

#### Scenario: Verificação falhando
- **WHEN** alguma verificação do pipeline falha
- **THEN** nada é publicado e a versão anterior do site continua no ar

### Requirement: Preview por Pull Request
O sistema SHALL publicar uma versão de preview, com endereço próprio, para cada Pull Request
do repositório cujas verificações passarem, sem alterar a versão de produção.

#### Scenario: PR aprovado nas verificações
- **WHEN** um Pull Request passa em todas as verificações
- **THEN** o endereço do preview aparece no Pull Request e a produção continua inalterada

### Requirement: Páginas pré-renderizadas
O sistema MUST entregar o HTML de cada rota já renderizado, sem depender de JavaScript para
exibir o conteúdo inicial.

#### Scenario: Acesso sem JavaScript
- **WHEN** a página inicial é carregada com JavaScript desabilitado
- **THEN** o conteúdo principal da página aparece no HTML recebido

### Requirement: Rota inexistente
O sistema SHALL responder a uma rota inexistente exibindo a aplicação, em vez da página de
erro padrão da hospedagem.

#### Scenario: Acesso a URL inválida
- **WHEN** o visitante acessa um caminho que não existe no site
- **THEN** o site do portfólio é exibido no lugar da página 404 padrão da hospedagem
