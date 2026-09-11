# 🎨 Frontend - Sistema de Login Seguro

Interface frontend para o sistema de login e cadastro seguro, desenvolvida com **React** e boas práticas de segurança.

---

## 📋 Índice

- [Visão Geral](#visão-geral)
- [Stack Tecnológico](#stack-tecnológico)
- [Requisitos](#requisitos)
- [Instalação](#instalação)
- [Scripts Disponíveis](#scripts-disponíveis)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Recursos](#recursos)
- [Segurança](#segurança)
- [Contribuindo](#contribuindo)

---

## 👁️ Visão Geral

Este é o frontend da aplicação de login e cadastro seguro. A interface foi construída com foco em:

- ✅ **Segurança:** Proteção contra XSS, CSRF e outras vulnerabilidades web
- ✅ **Usabilidade:** Interface intuitiva e responsiva
- ✅ **Performance:** Otimização de bundle e lazy loading
- ✅ **Acessibilidade:** Conformidade com padrões WCAG

---

## 🛠️ Stack Tecnológico

### Core
- **[React 18](https://react.dev/)** - UI library
- **[React Router v6](https://reactrouter.com/)** - Roteamento de páginas

### Gerenciamento de Estado
- **[Context API](https://react.dev/reference/react/useContext)** - Gerenciamento de autenticação
- **[Redux Toolkit](https://redux-toolkit.js.org/)** *(opcional)* - Para estado global complexo

### HTTP & API
- **[Axios](https://axios-http.com/)** - Cliente HTTP com interceptadores
- **[React Query](https://tanstack.com/query/latest)** *(recomendado)* - Cache e sincronização de dados

### Formulários
- **[React Hook Form](https://react-hook-form.com/)** - Gerenciamento eficiente de formulários
- **[Zod](https://zod.dev/)** ou **[Yup](https://github.com/jquense/yup)** - Validação de schema

### Estilo & Componentes
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first CSS
- **[Radix UI](https://www.radix-ui.com/)** ou **[Shadcn/ui](https://ui.shadcn.com/)** - Componentes unstyled acessíveis

### Testes
- **[Jest](https://jestjs.io/)** - Test runner
- **[React Testing Library](https://testing-library.com/react)** - Testes de componentes

### Ferramentas de Desenvolvimento
- **[Vite](https://vitejs.dev/)** *(recomendado para novo projeto)* ou **Create React App** - Build tool
- **[ESLint](https://eslint.org/)** - Linting
- **[Prettier](https://prettier.io/)** - Code formatting

---

## 📦 Requisitos

Antes de começar, certifique-se de ter instalado:

- **Node.js** >= 16.x
- **npm** >= 8.x (ou **yarn** >= 3.x)

```bash
node --version  # v16.0.0 ou superior
npm --version   # 8.0.0 ou superior
```

---

## 🚀 Instalação

### 1. Clonar o repositório

```bash
git clone https://github.com/ThiagoMolon/Desafio.git
cd Desafio/desafio-login
```

### 2. Instalar dependências

```bash
npm install
# ou
yarn install
```

### 3. Configurar variáveis de ambiente

```bash
# Copiar arquivo de exemplo
cp .env.example .env.local

# Editar com valores locais
nano .env.local
```

**Arquivo `.env.example`:**

```env
# API Backend
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_API_TIMEOUT=10000

# Ambiente
REACT_APP_ENV=development
REACT_APP_DEBUG=true
```

### 4. Iniciar servidor de desenvolvimento

```bash
npm start
```

A aplicação estará disponível em `http://localhost:3000`

---

## 📜 Scripts Disponíveis

### Desenvolvimento

```bash
# Iniciar servidor de desenvolvimento com hot reload
npm start

# Executar testes em modo watch
npm test

# Executar testes com coverage
npm run test:coverage
```

### Build & Deploy

```bash
# Build para produção
npm run build

# Visualizar build localmente
npm run serve

# Análise do bundle
npm run analyze
```

### Qualidade de Código

```bash
# Lint com ESLint
npm run lint

# Lint e fix automático
npm run lint:fix

# Verificar formatação com Prettier
npm run format:check

# Formatar com Prettier
npm run format
```

---

## 📁 Estrutura do Projeto

```
desafio-login/
├── public/
│   ├── index.html
│   └── favicon.ico
├── src/
│   ├── components/
│   │   ├── Auth/
│   │   │   ├── LoginForm.jsx
│   │   │   ├── RegisterForm.jsx
│   │   │   └── ForgotPasswordForm.jsx
│   │   ├── Layout/
│   │   │   ├── Header.jsx
│   │   │   ├── Footer.jsx
│   │   │   └── Navbar.jsx
│   │   ├── Common/
│   │   │   ├── Button.jsx
│   │   │   ├── Input.jsx
│   │   │   └── Modal.jsx
│   │   └── Profile/
│   │       └── ProfileCard.jsx
│   ├── pages/
│   │   ├── LoginPage.jsx
│   │   ├── RegisterPage.jsx
│   │   ├── ProfilePage.jsx
│   │   └── NotFoundPage.jsx
│   ├── services/
│   │   ├── api.js          # Cliente Axios configurado
│   │   ├── authService.js  # Chamadas de autenticação
│   │   └── userService.js  # Operações de usuário
│   ├── hooks/
│   │   ├── useAuth.js      # Hook de autenticação
│   │   ├── useFetch.js     # Hook para requisições
│   │   └── useForm.js      # Hook para formulários
│   ├── context/
│   │   └── AuthContext.jsx # Contexto de autenticação
│   ├── utils/
│   │   ├── validators.js   # Funções de validação
│   │   ├── storage.js      # LocalStorage seguro
│   │   └── errors.js       # Tratamento de erros
│   ├── styles/
│   │   ├── globals.css
│   │   └── variables.css
│   ├── App.jsx
│   └── main.jsx
├── .env.example
├── .gitignore
├── .eslintrc.json
├── .prettierrc
├── package.json
└── README.md
```

---

## ✨ Recursos Principais

### 🔐 Autenticação

- Formulário de login com validação
- Cadastro de usuários com dados pessoais
- Recuperação de senha via e-mail
- Sessão segura com JWT/tokens

### 👤 Perfil do Usuário

- Visualização de dados pessoais descriptografados
- Edição segura de informações
- Alteração de senha

### 🛡️ Segurança Integrada

- Proteção contra XSS (sanitização de conteúdo)
- CSRF tokens em requisições POST/PUT/DELETE
- Armazenamento seguro de tokens (HttpOnly cookies)
- Validação de formulários no cliente
- Interceptadores para renovação de sessão

---

## 🔒 Segurança

### Boas Práticas Implementadas

#### 1. Gerenciamento de Tokens

```javascript
// ❌ EVITAR
localStorage.setItem('token', token);

// ✅ FAZER
// Usar HttpOnly cookies (do servidor)
// Ou session storage com expiração automática
```

#### 2. Validação de Entrada

```javascript
// Usar bibliotecas como Zod/Yup para validação
const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(8, 'Senha deve ter no mínimo 8 caracteres'),
});
```

#### 3. Proteção contra XSS

```javascript
// ❌ NUNCA faça
<div dangerouslySetInnerHTML={{ __html: userInput }} />

// ✅ FAZER
<div>{userInput}</div>  // React escapa automaticamente
```

#### 4. CSRF Protection

```javascript
// Interceptador Axios para enviar CSRF token
api.interceptors.request.use((config) => {
  const token = document.querySelector('meta[name="csrf-token"]')?.content;
  if (token) {
    config.headers['X-CSRF-Token'] = token;
  }
  return config;
});
```

#### 5. Tratamento de Erros Seguro

```javascript
// ❌ EVITAR expor detalhes
console.log(error.response.data);  // Pode conter informações sensíveis

// ✅ FAZER
const userMessage = getUserFriendlyMessage(error.code);
```

---

## 🧪 Testes

### Executar Testes

```bash
# Todos os testes
npm test

# Teste específico
npm test LoginForm.test.jsx

# Com coverage
npm run test:coverage
```

### Exemplo de Teste

```javascript
import { render, screen, fireEvent } from '@testing-library/react';
import LoginForm from './LoginForm';

describe('LoginForm', () => {
  it('should submit form with valid data', async () => {
    render(<LoginForm />);
    
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole('button', { name: /login/i });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);

    expect(submitButton).toBeDisabled();
  });
});
```

---

## 🚢 Deploy

### Preparar para Produção

```bash
# Build otimizado
npm run build

# Verificar bundle size
npm run analyze
```

### Variáveis de Produção

```env
REACT_APP_API_URL=https://api.seu-dominio.com
REACT_APP_ENV=production
REACT_APP_DEBUG=false
```

### Plataformas Recomendadas

- **[Vercel](https://vercel.com/)** - Otimizado para React
- **[Netlify](https://www.netlify.com/)** - Fácil deploy com CI/CD
- **[AWS S3 + CloudFront](https://aws.amazon.com/s3/)** - Escalável
- **[GitHub Pages](https://pages.github.com/)** - Para projects estáticos

---

## 📚 Documentação Adicional

- [React Documentation](https://react.dev/)
- [React Router Docs](https://reactrouter.com/)
- [OWASP Frontend Security](https://owasp.org/www-community/attacks/xss/)
- [Web Security Academy](https://portswigger.net/web-security)

---

## 🤝 Contribuindo

1. Crie uma branch para sua feature: `git checkout -b feature/minha-feature`
2. Commit suas mudanças: `git commit -m 'Add: minha feature'`
3. Push para a branch: `git push origin feature/minha-feature`
4. Abra um Pull Request

---

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](../LICENSE) para mais detalhes.

---

**Última atualização:** 2026-09-11 | **Versão:** 1.0.0
