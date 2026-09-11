# 🔐 Sistema de Login e Cadastro Seguro

Aplicação de login e cadastro com foco na **proteção de credenciais e dados pessoais**. O projeto separa autenticação, autorização e proteção de dados sensíveis desde o armazenamento até a apresentação.

---

## 📋 Índice

- [Objetivos](#objetivos)
- [Arquitetura](#arquitetura)
- [Dados Previstos](#dados-previstos)
- [Fluxos Principais](#fluxos-principais)
- [Configuração do Ambiente](#configuração-do-ambiente)
- [Segurança](#segurança)
- [Fases do Projeto](#fases-do-projeto)
- [Testes de Aceitação](#testes-de-aceitação)

---

## 🎯 Objetivos

- ✅ Permitir criação de contas, login, logout e gerenciamento de perfil
- ✅ Armazenar senhas com hash seguro, **sem possibilidade de recuperação da senha original**
- ✅ Criptografar dados pessoais que precisem ser recuperados posteriormente
- ✅ Manter chaves e credenciais **fora do código-fonte** e do banco de dados
- ✅ Restringir o acesso aos dados ao usuário autenticado e autorizado

---

## 🏗️ Arquitetura

### Fluxo Geral

```
┌─────────┐
│ Usuário │
└────┬────┘
     │
     ▼
┌───────────────┐
│  Interface    │
└────┬──────────┘
     │
     ▼
┌───────────────────────────────────────┐
│          Backend                      │
│  ┌─────────────────────────────────┐  │
│  │ • Hash de senhas                │  │
│  │ • Validações                    │  │
│  │ • Lógica de sessão              │  │
│  └─────────────────────────────────┘  │
└────┬──────────────────────────────────┘
     │
     ▼
┌──────────────────────────────────────────┐
│      Banco de Dados                      │
│  ┌────────────────────────────────────┐  │
│  │ • Senhas (hash)                    │  │
│  │ • Dados pessoais (criptografados)  │  │
│  └────────────────────────────────────┘  │
└──────────────────────────────────────────┘

🔑 Chave de criptografia: Ambiente (não no código)
```

### Autenticação

Senhas **NÃO são criptografadas** para serem descriptografadas. O fluxo correto é:

```
Senha informada ──► Hash seguro ──► Banco de dados
                        ▲
                        │
                   Verificação (login)
```

**Durante o login:** A senha informada é verificada contra o hash armazenado via comparação segura. Após validação, cria-se uma sessão segura.

### Dados Pessoais

Informações que precisam ser recuperadas (CPF, telefone, endereço) usam criptografia reversível:

```
Dado pessoal ──► Criptografia ──► Banco de dados
                                        │
                                        ▼
                          Descriptografia autorizada
                                        │
                                        ▼
                                   Aplicação
```

**Princípio:** Descriptografar apenas quando necessário (visualização, edição do perfil).

---

## 📊 Dados Previstos

| Campo | Tratamento | Notas |
|-------|-----------|-------|
| **ID do usuário** | Armazenamento normal | Identificador único |
| **Nome** | Avaliar conforme necessidade | Busca e exibição |
| **E-mail** | Pesquisável + protegido | Essencial para login |
| **Senha** | Hash seguro | Nunca armazenar em texto puro |
| **CPF, telefone, endereço** | Criptografia reversível | Dados sensíveis |
| **Data de cadastro/alteração** | Armazenamento normal | Auditoria |

**⚠️ Consideração importante:** O e-mail deve permanecer pesquisável para login. Avaliar uso de representação normalizada ou índice pesquisável sem expor dados além do necessário.

---

## 🔄 Fluxos Principais

### Cadastro

```
1️⃣  Validar campos obrigatórios (e-mail, senha, dados pessoais)
2️⃣  Confirmar que o e-mail ainda não está cadastrado
3️⃣  Gerar hash da senha com algoritmo apropriado (bcrypt, Argon2, etc)
4️⃣  Criptografar dados pessoais usando chave do ambiente
5️⃣  Persistir dados no banco
```

### Login

```
1️⃣  Receber e-mail e senha
2️⃣  Localizar usuário SEM descriptografar dados pessoais
3️⃣  Verificar senha contra hash armazenado
4️⃣  Criar sessão segura após autenticação
```

### Perfil

```
1️⃣  Confirmar autenticação e autorização do usuário
2️⃣  Consultar apenas o próprio registro
3️⃣  Descriptografar somente campos necessários para exibição
4️⃣  Validar e criptografar novamente apenas campos alterados
```

### Recuperação de Senha

```
1️⃣  Gerar token temporário (válido por tempo limitado)
2️⃣  Enviar link para reset via e-mail
3️⃣  Nova senha substitui o hash anterior
4️⃣  Senha antiga NUNCA é enviada ou armazenada de forma recuperável
```

---

## ⚙️ Configuração do Ambiente

Segredos devem ser fornecidos por **variáveis de ambiente**, nunca no código.

### Setup Inicial

```bash
# Copiar arquivo de exemplo
cp .env.example .env

# Editar .env com valores locais
nano .env
```

### Arquivo `.env.example`

```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/secure_login

# Encryption
ENCRYPTION_KEY=your-base64-encoded-key-here
ENCRYPTION_ALGORITHM=aes-256-gcm

# Session
SESSION_SECRET=your-session-secret-here
SESSION_MAX_AGE=86400

# Email (para recuperação de senha)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# App
NODE_ENV=development
APP_URL=http://localhost:3000
```

**✅ Boas práticas:**
- `.env` não deve ser versionado (adicionar ao `.gitignore`)
- `.env.example` contém apenas nomes de variáveis, sem valores reais
- Chave de criptografia NUNCA deve ser enviada ao frontend

---

## 🔒 Segurança

O projeto deve implementar todas as camadas de proteção:

### Backend

- ✅ Consultas parametrizadas ou ORM para evitar **SQL injection**
- ✅ Validação rigorosa de entrada no backend
- ✅ Mensagens de erro que **não revelam** se um e-mail está cadastrado
- ✅ Rate limiting e proteção contra **brute force**
- ✅ Logs de eventos **sem senhas, chaves ou dados sensíveis**

### Sessão

- ✅ Cookies com flags `HttpOnly`, `Secure`, `SameSite=Strict`
- ✅ Expiração automática de sessões
- ✅ Invalidação de sessão ao logout
- ✅ Renovação de sessão em operações sensíveis

### Transporte & Armazenamento

- ✅ HTTPS em **qualquer ambiente** que transporte dados reais
- ✅ Hash para proteção de senhas (não criptografia)
- ✅ Criptografia para dados pessoais que precisam ser recuperados

### Proteção do Frontend

- ✅ Proteção contra **XSS** (sanitização, CSP)
- ✅ Proteção contra **CSRF** (tokens, SameSite cookies)
- ✅ Nunca armazenar senhas em localStorage/sessionStorage

### Defesa em Camadas

```
🌐 HTTPS (transporte)
     ▼
🔐 Criptografia de campos (armazenamento)
     ▼
#️⃣  Hash de senhas (irreversível)
```

Estas são **camadas diferentes e complementares**.

---

## 📅 Fases do Projeto

- [ ] **Fase 1:** Definir funcionalidades, dados e campos protegidos
- [ ] **Fase 2:** Escolher stack (frontend, backend, banco, sessão)
- [ ] **Fase 3:** Criar modelo de usuários e migrações
- [ ] **Fase 4:** Configurar variáveis de ambiente e segredos
- [ ] **Fase 5:** Implementar cadastro, login, logout e perfil
- [ ] **Fase 6:** Adicionar recuperação de senha e controles de segurança
- [ ] **Fase 7:** Criar testes (funcionais, criptografia, autorização)
- [ ] **Fase 8:** Preparar deploy (banco, HTTPS, variáveis de produção)

---

## ✅ Testes de Aceitação

### Funcionalidades

- [ ] Cadastro, login e logout funcionam corretamente
- [ ] Usuário consegue editar seu próprio perfil
- [ ] Recuperação de senha funciona via e-mail

### Segurança de Dados

- [ ] Senhas não aparecem em texto puro no banco
- [ ] Senhas não aparecem nos logs do sistema
- [ ] Dados pessoais não aparecem em texto puro no banco
- [ ] Dados criptografados são recuperados apenas com a chave correta

### Controle de Acesso

- [ ] Usuários não conseguem acessar o perfil de outra pessoa
- [ ] Rotas privadas rejeitam requisições sem autenticação
- [ ] Sessão é invalidada corretamente no logout

### Proteção contra Ataques

- [ ] Tentativas repetidas de login são limitadas
- [ ] Entradas inválidas são tratadas com segurança
- [ ] Tentativas de SQL injection são bloqueadas
- [ ] Mensagens de erro não revelam informações sensíveis

---

## 🎯 Regra de Ouro

> **Senha é armazenada com hash e NUNCA deve ser descriptografada.**
> 
> **Dados pessoais que precisam ser recuperados PODEM ser criptografados.**
> 
> **A chave deve permanecer fora do código, do frontend e do banco.**

---

## 📚 Referências Recomendadas

- [OWASP Authentication Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html)
- [OWASP Password Storage Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html)
- [NIST Digital Identity Guidelines](https://pages.nist.gov/800-63-3/)
- Bcrypt/Argon2 para hash de senhas
- AES-256-GCM para criptografia de dados

---

**Última atualização:** 2026-09-11 | **Status:** 📋 Em Planejamento
