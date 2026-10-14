# Spec Delta

## MODIFIED Requirements

### Requirement: Abrir pelo Executar
Nos projetos com site, o ícone de executar ▶ na calha (à esquerda da linha da declaração da
classe, como no IntelliJ) e o botão Executar da barra de ferramentas SHALL abrir a janela de
preview do projeto. Nos demais projetos e seções, o Executar da barra abre a janela de Run e não
há ícone na calha.

#### Scenario: Executar o Projeto 2
- **WHEN** o visitante está no Projeto 2 e ativa o ▶ da calha na linha `public class`
- **THEN** a janela de preview abre sobre a IDE com o site da Dra. Juliana

#### Scenario: Seção sem site
- **WHEN** o visitante está em "Sobre Mim"
- **THEN** a calha não tem ícone de executar e o Executar da barra abre a janela de Run
