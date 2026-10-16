# Spec Delta

## MODIFIED Requirements

### Requirement: Metadados por página no HTML pré-renderizado
Cada página SHALL trazer no HTML entregue, sem depender de JavaScript, um título próprio, uma
descrição própria de até 160 caracteres em pt-BR e o endereço canônico absoluto da página, no
domínio próprio `https://vinimachado.wattscompany.com.br`.

#### Scenario: Página de Skills
- **WHEN** um robô baixa `/skills` sem executar JavaScript
- **THEN** o HTML tem o título "Skills / STACK | Vinicius Machado", a descrição da seção e o
  canônico `https://vinimachado.wattscompany.com.br/skills`
