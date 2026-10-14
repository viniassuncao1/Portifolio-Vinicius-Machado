# Spec Delta

## MODIFIED Requirements

### Requirement: Abrir pelo Executar
Nos projetos com site, o ícone de executar ▶ na calha (à esquerda da linha da declaração da
classe, como no IntelliJ) e o botão Executar da barra de ferramentas SHALL abrir a janela de
preview do projeto. O botão "▶ Executar" sobre o código deixa de existir. Nos demais projetos e
seções, o Executar da barra continua decorativo e não há ícone na calha.

#### Scenario: Executar o Projeto 2
- **WHEN** o visitante está no Projeto 2 e ativa o ▶ da calha na linha `public class`
- **THEN** a janela de preview abre sobre a IDE com o site da Dra. Juliana

#### Scenario: Seção sem site
- **WHEN** o visitante está em "Sobre Mim"
- **THEN** o play da barra de ferramentas não é um botão e não recebe foco, e a calha não tem
  ícone de executar
