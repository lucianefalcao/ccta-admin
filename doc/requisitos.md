# Requisitos - CCTA Admin

## Requisitos Funcionais

- **[RF001] Gerenciar editais**:
A aplicação deve permitir que o usuário com a permissão “gerenciar-editais” possa criar, editar e deletar as publicações de editais. Durante o cadastro, o usuário deve disponibilizar um título.

- **[RF002] Upload de arquivos de editais em PDF**:
A aplicação deve permitir que o usuário com a permissão “gerenciar-editais” possa realizar um upload de um arquivo em PDF de até 5 MB com os detalhes de um edital no momento da sua criação e edição.

- **[RF003] Gerenciar notícias**:
A aplicação deve permitir que o usuário com a permissão “gerenciar-noticias” possa visualizar, criar, editar e deletar as notícias cadastradas. Durante o usuário deve disponibilizar um título e o texto.

- **[RF004] Definir estados das notícias**:
Ao criar ou editar uma notícia, o usuário que possui a permissão “gerenciar-noticias” pode definir o estado da mesma como “Rascunho” ou “Publicado”. Porém, se a entidade já está no estado “Publicado”, a mesma não poderá voltar para “Rascunho”.

- **[RF005] Adicionar capa a uma notícia**:
A aplicação deve permitir que o usuário com a permissão “gerenciar-noticias” possa realizar o upload de uma imagem no formato PNG ou JPG, que irá atuar como a capa da notícia. Este item não é obrigatório durante o cadastro ou edição.

- **[RF006] Remover a capa de uma notícia**:
A aplicação deve permitir que o usuário com a permissão “gerenciar-noticias” possa remover a capa de uma notícia durante edição.

- **[RF007] Gerenciar eventos**:
A aplicação deve permitir que o usuário com a permissão “gerenciar-eventos” possa visualizar, criar, editar e deletar os eventos cadastrados. Durante a criação o usuário deve disponibilizar um título, uma descrição e a data que o evento deve ocorrer.

- **[RF008] Realizar atendimento via mensagens**:
A aplicação deve permitir que o usuário com a permissão “gerenciar-chat” possa realizar e visualizar os atendimentos recebidos por meio de troca de mensagens simples.

- **[RF009] Entrar em um atendimento**:
A aplicação deve permitir que o usuário com a permissão “gerenciar-chat” possa entrar em um atendimento. Essa ação deve cadastrar o usuário como atendente, e caso seja existia outro atendente, o mesmo deve ser removido.

- **[RF010] Encerrar um atendimento**:
A aplicação deve permitir que o usuário com a permissão “gerenciar-chat” possa encerrar um atendimento.

- **[RF011] Gerenciar informações do centro**:
A aplicação deve permitir que o usuário com a permissão “gerenciar-info-centro” possa cadastrar, editar e visualizar a descrição do centro.

- **[RF012] Gerenciar informações dos cursos do centro**:
A aplicação deve permitir que o usuário com a permissão “gerenciar-info-centro” possa cadastrar, editar, visualizar e deletar informações dos cursos do centro. Durante o cadastro, o usuário deve informar o nome, o tipo e subtipo, a quantidade de períodos e uma descrição.

- **[RF012] Gerenciar usuários**:
A aplicação deve permitir que o usuário com a permissão “gerenciar-usuarios” possa cadastrar, visualizar, deletar e modificar as permissões dos usuários cadastrados. Durante a criação, o usuário deve informar o nome e o e-mail do novo usuário.

- **[RF013] Login**:
Qualquer usuário cadastrado que já acessou o sistema deve ser capaz de realizar o login na plataforma informando o seu e-mail e senha.

- **[RF014] Primeiro acesso**:
Qualquer usuário cadastrado que nunca acessou o sistema deve realizar o primeiro acesso cadastrando uma senha para ser utilizada no login.

- **[RF015] Modificar informações pessoais**:
Qualquer usuário cadastrado pode modificar o seu nome, e-mail e senha.

- **[RF016] Logout**:
Qualquer usuário que estiver utilizando o sistema deve ser capaz de sair dele.

## Requisitos Não Funcionais

### Usabilidade

- **[RNF001] Fácil manipulação**:
A aplicação deverá ser operada por usuários sem a necessidade de treinamento prévio.

- **[RNF002] Responsividade**:
A aplicação deverá fazer uso de design responsivo na implementação de sua interface gráfica que se adapta a tela do usuário.

- **[RNF003] Linguagem**:
A aplicação deverá ser disponibilizada em português.

- **[RNF004] Internet**:
O usuário deverá ter acesso à Internet para acessar o sistema.

- **[RNF005] Limite do tamanho de imagens e documentos**:
A aplicação deverá permitir apenas o upload de arquivos e documentos com tamanho de no máximo 5 MB

### Portabilidade

- **[RNF006] Compatibilidade**:
A aplicação deverá funcionar no Google Chrome e Firefox a partir da versão 96.0 para ambos os navegadores.

## Confiabilidade

- **[RNF007] Disponibilidade**:
A aplicação deverá ter alta disponibilidade, por exemplo, 97% do tempo.

- **[RNF008] Erros no sistema**:
A aplicação deverá exibir os 80% dos erros que impedem o fluxo das atividades para o usuário.

### Organizacional

- **[RNF009] Versionamento**:
O versionamento da aplicação deverá ser feito a partir da plataforma GitHub da autora deste trabalho.

- **[RNF010] Gerenciamento de atividades**:
Uso do GitHub, para definir e administrar o andamento das tarefas.

### Implementação

- **[RNF011] Paradigma de programação**:
A implementação deverá utilizar programação orientada a objeto.

- **[RNF012] Princípios SOLID**:
A implementação deverá obedecer os padrões SOLID sempre que possível.

- **[RNF013] SPA (do inglês, “Single Page Application”)**:
A aplicação deverá ser implementada utilizando a arquitetura SPA.

- **[RNF014] Tecnologias**:
A implementação utilizará os frameworks Vue.js, Vuetify e NuxtJS, os três na versão mínima 2.0. A linguagem TypeScript na versão mínima 4.3. Para gerenciamento do estado, deve-se utilizar o Vuex Module Decorator na versão 1.0.

- **[RNF015] Testes automatizados**
A implementação deverá conter testes automatizados utilizando o pacote Jest.

### Interoperabilidade

- **[RNF016] Comunicação com Firestore Database**:
A aplicação deverá utilizar o Firestore Database do Firebase para realizar a persistência e consulta de dados.

- **[RNF017] Comunicação com Realtime Database**:
A aplicação deverá utilizar o Realtime Database do Firebase para a troca de mensagens.

- **[RNF018] Comunicação com Firebase Storage**:
A aplicação deverá utilizar o Firebase Storage para guardar documentos e imagens. Assim como, permitir que o usuário realize o download desses itens.

- **[RNF019] Comunicação com Firebase Authentication**:
A aplicação deverá utilizar o Firebase Authentication para realizar a autenticação dos usuários na aplicação.

- **[RNF020] Comunicação com Firebase Cloud Functions**:
A aplicação deverá utilizar o Firebase Cloud Functions para executar comandos de autenticação que não podem ser realizados do lado do servidor.

### Segurança

- **[RNF021] Alteração dos dados do usuário**:
A aplicação garantirá que todos os dados relacionados aos usuários só sejam alterados por eles.


