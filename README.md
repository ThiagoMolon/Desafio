# Sistema de Login e Cadastro Seguro

Aplicação de login e cadastro com foco na proteção de credenciais e dados pessoais. O projeto separa autenticação, autorização e proteção de dados sensíveis desde o armazenamento até a apresentação ao usuário.

## Objetivos

- Permitir criação de contas, login, logout e gerenciamento de perfil.
- Armazenar senhas com hash seguro, sem possibilidade de recuperação da senha original.
- Criptografar dados pessoais que precisem ser recuperados posteriormente.
- Manter chaves e credenciais fora do código-fonte e do banco de dados.
- Restringir o acesso aos dados ao usuário autenticado e autorizado.

## Arquitetura

```text
Usuário
	|
	v
Interface -> Backend -> Banco de dados
					 |             |
					 +-> Hash      +-> Dados pessoais criptografados
					 |
					 +-> Chave de criptografia fornecida pelo ambiente
```

### Autenticação

Senhas não são criptografadas para serem descriptografadas. O fluxo correto é:

```text
Senha informada -> Hash seguro -> Banco de dados
```

Durante o login, a senha informada é verificada contra o hash armazenado. Após a validação, a aplicação cria uma sessão segura.

### Dados pessoais

Informações que precisam ser recuperadas, como CPF, telefone e endereço, podem usar criptografia reversível:

```text
Dado pessoal -> Criptografia -> Banco de dados
Banco de dados -> Descriptografia autorizada -> Aplicação
```

A descriptografia deve ocorrer somente quando for necessária, por exemplo, na visualização ou edição do perfil.

## Dados previstos

| Campo | Tratamento |
| --- | --- |
| ID do usuário | Armazenamento normal |
| Nome | Avaliar conforme a necessidade de busca e exibição |
| E-mail | Armazenamento pesquisável para login, com proteção adequada |
| Senha | Hash seguro |
| CPF, telefone e endereço | Criptografia reversível |
| Data de cadastro e alteração | Armazenamento normal |

O e-mail precisa continuar pesquisável para o login. A implementação deve avaliar uma representação normalizada ou um índice pesquisável, evitando expor dados além do necessário.

## Fluxos principais

### Cadastro

1. Validar campos obrigatórios, e-mail, senha e dados pessoais.
2. Confirmar que o e-mail ainda não está cadastrado.
3. Gerar o hash da senha com um algoritmo apropriado para senhas.
4. Criptografar os dados pessoais usando a chave do ambiente.
5. Persistir os dados no banco.

### Login

1. Receber e-mail e senha.
2. Localizar o usuário sem descriptografar seus dados pessoais.
3. Verificar a senha contra o hash armazenado.
4. Criar uma sessão segura após a autenticação.

### Perfil

1. Confirmar autenticação e autorização do usuário.
2. Consultar apenas o próprio registro.
3. Descriptografar somente os campos necessários para exibição.
4. Validar e criptografar novamente apenas os campos alterados.

### Recuperação de senha

O sistema deve usar um mecanismo temporário de recuperação. A nova senha substitui o hash anterior; a senha antiga nunca deve ser enviada ou armazenada de forma recuperável.

## Configuração do ambiente

Segredos, como a chave de criptografia e as credenciais do banco, devem ser fornecidos por variáveis de ambiente.

Crie um arquivo `.env` local a partir do exemplo:

```bash
cp .env.example .env
```

O arquivo `.env` não deve ser versionado. O `.env.example` deve conter somente os nomes das variáveis necessárias, sem valores reais. A chave de criptografia também não deve ser enviada ao frontend, registrada em logs ou armazenada junto aos dados criptografados.

## Segurança

O projeto deve considerar:

- consultas parametrizadas ou ORM para evitar SQL injection;
- validação de entrada no backend;
- mensagens de erro que não revelem se um e-mail está cadastrado;
- limitação de tentativas e proteção contra brute force;
- cookies de sessão com `HttpOnly`, `Secure` e política `SameSite` adequada;
- expiração, renovação e invalidação de sessões no logout;
- proteção contra XSS e CSRF quando aplicável;
- HTTPS em qualquer ambiente que transporte dados reais;
- logs de eventos sem senhas, chaves ou dados pessoais desnecessários.

HTTPS protege os dados durante o transporte; a criptografia de campos protege dados armazenados; o hash protege as senhas. São camadas diferentes e complementares.

## Fases do projeto

1. Definir funcionalidades, dados e campos protegidos.
2. Escolher frontend, backend, banco e mecanismo de sessão.
3. Criar o modelo de usuários e as migrações.
4. Configurar variáveis de ambiente e segredos.
5. Implementar cadastro, login, logout e perfil.
6. Adicionar recuperação de senha e controles de segurança.
7. Criar testes funcionais, de criptografia e de autorização.
8. Preparar deploy, banco, HTTPS e variáveis de produção.

## Testes de aceitação

- Cadastro, login e logout funcionam corretamente.
- Senhas não aparecem em texto puro no banco ou nos logs.
- Dados pessoais não aparecem em texto puro no banco.
- Dados criptografados são recuperados apenas com a chave correta.
- Usuários não conseguem acessar o perfil de outra pessoa.
- Rotas privadas rejeitam requisições sem autenticação.
- Tentativas repetidas de login são limitadas.
- Entradas inválidas e tentativas de injeção são tratadas com segurança.

## Regra de ouro

**Senha é armazenada com hash e nunca deve ser descriptografada. Dados pessoais que precisam ser recuperados podem ser criptografados. A chave deve permanecer fora do código, do frontend e do banco de dados.**