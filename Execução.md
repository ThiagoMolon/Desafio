# Guia de implementação

Este documento descreve o que cada página, pasta e parte do código deve conter e fazer no sistema de login e cadastro seguro.

## 1. Organização do projeto

```text
desafio-login/
└── src/
    ├── assets/       Imagens e arquivos estáticos usados pela interface
    ├── components/   Componentes reutilizáveis
    ├── context/      Estado global, principalmente autenticação
    ├── hooks/        Hooks personalizados
    ├── pages/        Páginas acessadas pelas rotas
    ├── services/     Comunicação com a API
    ├── styles/       Estilos específicos ou compartilhados
    ├── utils/        Validações e funções auxiliares
    ├── App.js        Rotas e estrutura principal da aplicação
    └── index.js      Ponto de entrada do React
```

Cada arquivo deve ter uma responsabilidade clara. A página organiza a tela, o componente cuida da apresentação, o serviço conversa com a API e a regra auxiliar fica em `utils`.

## 2. Páginas da aplicação

### 2.1 Login

Arquivo: `src/pages/Login.jsx`

Deve conter:

- Campo de e-mail;
- Campo de senha;
- Botão para entrar;
- Link para cadastro;
- Link para recuperação de senha;
- Mensagens de carregamento, sucesso e erro.

Deve fazer:

1. Validar os campos antes do envio.
2. Chamar o serviço de login.
3. Exibir mensagem genérica quando as credenciais forem inválidas.
4. Atualizar o estado de autenticação após o login.
5. Redirecionar o usuário autenticado para a página inicial ou perfil.

Não deve descriptografar dados pessoais nem armazenar a senha no frontend.

### 2.2 Cadastro

Arquivo: `src/pages/Cadastro.jsx`

Deve conter campos para:

- Nome;
- E-mail;
- Senha;
- Confirmação da senha;
- CPF, telefone ou outros dados pessoais definidos no escopo.

Deve fazer:

1. Validar campos obrigatórios e formatos.
2. Verificar tamanho e qualidade mínima da senha.
3. Confirmar que as senhas são iguais.
4. Enviar os dados ao backend pelo serviço de cadastro.
5. Informar o resultado sem revelar detalhes desnecessários.
6. Redirecionar para o login após o cadastro bem-sucedido.

A senha deve ser protegida no backend com hash. A chave de criptografia nunca deve ser usada ou enviada pelo frontend.

### 2.3 Página inicial autenticada

Arquivo: `src/pages/Home.jsx`

Deve conter:

- Identificação resumida do usuário autenticado;
- Acesso ao perfil;
- Botão de logout;
- Estado para sessão expirada.

Deve fazer:

1. Permitir acesso somente com sessão válida.
2. Encaminhar o usuário não autenticado para o login.
3. Encerrar a sessão ao executar logout.

### 2.4 Perfil

Arquivo: `src/pages/Perfil.jsx`

Deve conter:

- Dados do usuário autenticado;
- Modo de visualização;
- Modo de edição;
- Botão para salvar alterações;
- Mensagens de carregamento, sucesso e erro.

Deve fazer:

1. Buscar somente o perfil do usuário da sessão.
2. Exibir dados pessoais apenas após autorização.
3. Enviar somente os campos alterados.
4. Validar os novos valores antes do envio.
5. Atualizar a tela após uma alteração bem-sucedida.

A descriptografia deve acontecer no backend e somente para os campos necessários. O frontend recebe os dados já autorizados para exibição.

### 2.5 Recuperação de senha

Arquivo: `src/pages/RecuperarSenha.jsx`

Deve conter:

- Campo de e-mail;
- Botão para solicitar recuperação;
- Mensagem que não confirme se o e-mail está cadastrado.

Deve fazer:

1. Validar o e-mail.
2. Solicitar ao backend um token temporário.
3. Exibir sempre uma resposta neutra.

### 2.6 Redefinição de senha

Arquivo: `src/pages/RedefinirSenha.jsx`

Deve conter:

- Nova senha;
- Confirmação da nova senha;
- Token recebido no link de recuperação;
- Mensagens de validade e expiração do token.

Deve fazer:

1. Validar o token no backend.
2. Validar a nova senha.
3. Enviar a nova senha para gerar um novo hash.
4. Redirecionar para o login após a conclusão.

## 3. Componentes reutilizáveis

Local: `src/components/`

Criar componentes somente quando houver reutilização ou quando a tela ficar difícil de manter. Sugestões:

- `Input`: label, campo, erro e acessibilidade;
- `Button`: estados normal, carregando e desabilitado;
- `FormError`: mensagens de validação sem dados sensíveis;
- `Loading`: indicação de carregamento;
- `ProtectedRoute`: bloqueia páginas sem autenticação;
- `Header`: navegação e logout;
- `ProfileForm`: campos e ações do perfil.

Os componentes não devem chamar a API diretamente quando essa responsabilidade puder ficar em `services`.

## 4. Estado de autenticação

Local: `src/context/AuthContext.jsx`

Deve controlar:

- Usuário autenticado;
- Estado de carregamento da sessão;
- Estado de erro;
- Funções `login`, `logout` e `refreshSession`.

O contexto não deve armazenar senha, chave de criptografia ou dados pessoais desnecessários. Ao carregar a aplicação, deve verificar se existe uma sessão válida e limpar o estado quando ela expirar.

## 5. Serviços da API

Local: `src/services/`

Criar um cliente HTTP centralizado, por exemplo `api.js`, responsável por:

- URL base da API;
- Cabeçalhos;
- Cookies ou token de sessão;
- Tratamento de respostas de erro;
- Timeout e comportamento em falhas de rede.

Criar serviços separados por domínio:

- `authService.js`: login, cadastro, logout e sessão;
- `profileService.js`: consulta e atualização do perfil;
- `passwordService.js`: recuperação e redefinição de senha.

O frontend nunca deve conter a chave de criptografia. Os serviços também não devem registrar senhas, tokens ou dados pessoais em logs.

## 6. Hooks personalizados

Local: `src/hooks/`

Sugestões:

- `useAuth.js`: acesso ao `AuthContext`;
- `useForm.js`: valores, erros e envio de formulários;
- `useProtectedRoute.js`: verificação de sessão quando necessário.

Hooks devem reutilizar comportamento. Regras específicas de uma única página devem permanecer na própria página.

## 7. Funções auxiliares e validações

Local: `src/utils/`

Podem conter:

- Validação de e-mail;
- Validação de senha;
- Normalização de campos;
- Máscaras de telefone ou CPF apenas para apresentação;
- Conversão e tratamento de erros da API.

Validação no frontend melhora a experiência, mas nunca substitui a validação obrigatória no backend.

## 8. Rotas e entrada da aplicação

### `src/App.js`

Deve:

- Configurar as rotas públicas e privadas;
- Envolver a aplicação com o contexto de autenticação;
- Definir a página inicial de cada estado;
- Usar `ProtectedRoute` nas páginas autenticadas.

Rotas esperadas:

```text
/login
/cadastro
/recuperar-senha
/redefinir-senha/:token
/home              (privada)
/perfil            (privada)
```

### `src/index.js`

Deve apenas inicializar o React, importar os estilos globais e renderizar `App`. Não deve renderizar uma página de login separadamente.

## 9. Contrato esperado do backend

Rotas sugeridas:

| Método | Rota | Função |
| --- | --- | --- |
| `POST` | `/auth/register` | Criar usuário, gerar hash e criptografar dados pessoais |
| `POST` | `/auth/login` | Verificar credenciais e criar sessão |
| `POST` | `/auth/logout` | Invalidar sessão |
| `GET` | `/auth/session` | Verificar sessão atual |
| `GET` | `/users/me` | Retornar o perfil do usuário autenticado |
| `PATCH` | `/users/me` | Atualizar somente campos enviados |
| `POST` | `/auth/forgot-password` | Solicitar recuperação sem revelar cadastro |
| `POST` | `/auth/reset-password` | Validar token e substituir o hash |

O backend deve validar autorização pelo usuário da sessão, e não por um identificador recebido livremente pelo frontend.

## 10. Banco de dados e criptografia

O banco deve armazenar:

- ID;
- E-mail pesquisável e normalizado;
- Hash da senha;
- Dados pessoais criptografados;
- Datas de criação e alteração;
- Controle de sessão ou tokens temporários, quando aplicável.

Regras obrigatórias:

- Senhas usam hash seguro e nunca são descriptografadas.
- Dados pessoais recuperáveis usam criptografia reversível no backend.
- A chave vem de variável de ambiente ou serviço de segredos.
- A chave não fica no código, frontend, banco ou logs.
- Consultas usam parâmetros ou ORM.

## 11. Ordem recomendada de implementação

1. Corrigir a entrada da aplicação e criar as rotas básicas.
2. Renomear `login.jsx` para `Login.jsx` e concluir a tela de login.
3. Criar componentes de formulário e validações compartilhadas.
4. Implementar cadastro e mensagens de estado.
5. Criar `AuthContext` e proteção de rotas.
6. Conectar login, logout e sessão à API.
7. Implementar perfil e edição dos dados.
8. Implementar recuperação e redefinição de senha.
9. Adicionar testes de páginas, serviços, autorização e segurança.
10. Configurar banco, variáveis de ambiente, HTTPS e deploy.

## 12. Critérios de conclusão

- Cada rota prevista possui uma página funcional.
- Páginas privadas não abrem sem autenticação.
- O usuário só consulta e altera o próprio perfil.
- Senhas não aparecem em texto puro.
- Dados pessoais não aparecem em texto puro no banco.
- A chave de criptografia não chega ao frontend.
- Erros não revelam informações sensíveis.
- Logout e expiração invalidam o acesso privado.
- Testes funcionais e de segurança foram executados.
