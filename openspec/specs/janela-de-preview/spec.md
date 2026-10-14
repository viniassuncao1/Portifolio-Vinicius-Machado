# janela-de-preview Specification

## Purpose
Mostrar um site de projeto dentro do portfólio, numa janela no estilo da IDE, sem obrigar o
visitante a sair e sem carregar sites de terceiros antes de ele pedir.

## Requirements

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

### Requirement: Captura primeiro
A janela SHALL abrir mostrando uma captura de página inteira do site, rolável dentro da janela,
servida pelo próprio portfólio, com texto alternativo que descreve o site.

#### Scenario: Abertura rápida
- **WHEN** a janela abre
- **THEN** a captura aparece sem nenhuma requisição ao site do projeto

### Requirement: Ver ao vivo
O botão "Ver ao vivo" SHALL trocar a captura pelo site real num iframe com título acessível,
`sandbox` e `referrerpolicy="no-referrer"`, e "Abrir em nova aba" SHALL abrir o site numa nova
aba com `rel="noopener noreferrer"`.

#### Scenario: Site ao vivo
- **WHEN** o visitante ativa "Ver ao vivo"
- **THEN** o site real carrega dentro da janela e o botão passa a "Ver captura"

### Requirement: Janela acessível
A janela MUST ser um diálogo modal com nome (o nome do projeto), foco preso dentro dela enquanto
aberta, Escape e o botão de fechar (×) fechando-a, e o foco voltando ao botão que a abriu.

#### Scenario: Fechar com Escape
- **WHEN** a janela está aberta e o visitante pressiona Escape
- **THEN** a janela fecha e o foco volta para "▶ Executar"

### Requirement: Animação da janela
A janela SHALL abrir e fechar com uma animação curta no estilo de janela de IDE, desligada com
`prefers-reduced-motion: reduce`.

#### Scenario: Movimento reduzido
- **WHEN** o visitante com movimento reduzido abre a janela
- **THEN** ela aparece pronta, sem animação

### Requirement: Celular
No celular, a janela SHALL ocupar a tela inteira, com os mesmos controles.

#### Scenario: Preview no celular
- **WHEN** o visitante abre o preview numa tela de 390x844
- **THEN** a janela ocupa a tela e a página por trás não rola
