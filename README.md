# importPI

Ferramenta para importação de dados públicos da Receita Federal (CNPJs) para um banco de dados MySQL.

## Visão Geral

Este projeto realiza a automação de download, extração e importação em massa dos dados abertos de CNPJ da Receita Federal, populando um banco de dados MySQL com essas informações.

## Estrutura do Projeto

- **`index.js`**  
  Ponto de entrada da aplicação. Responsável por orquestrar os módulos de download, extração e importação.

- **`importer/`**  
  Diretório onde estão os módulos responsáveis pela leitura e importação dos arquivos CSV para o MySQL. Cada tipo de dado (ex: *estabelecimentos*) possui sua própria função de importação.  
  O arquivo `importer.js` importa essas funções específicas e executa a lógica de processamento em massa.

- **`download.js`**  
  Script que automatiza o download dos arquivos da Receita Federal. Ele verifica a data atual e obtém automaticamente a versão mais recente dos dados.

- **`utils/`**  
  Contém funções auxiliares, como `unzip`, usada para descompactar os arquivos baixados.

## Como Usar

1. Clone o repositório.
2. Instale as dependências.
3. Execute o script principal (`index.js`).
4. Os dados serão baixados, extraídos e importados para seu banco de dados MySQL automaticamente.

## Requisitos

- Node.js
- MySQL
- Acesso à internet para download dos dados
