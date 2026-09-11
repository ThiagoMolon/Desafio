# 📚 TECNOLOGIAS - Sistema de Login e Cadastro Seguro

Documentação completa das tecnologias utilizadas no projeto, incluindo justificativas, alternativas e guias de uso.

---

## 📋 Índice

- [Stack Overview](#stack-overview)
- [Backend](#backend)
- [Frontend](#frontend)
- [Banco de Dados](#banco-de-dados)
- [Segurança](#segurança)
- [DevOps & Deployment](#devops--deployment)
- [Alternativas Consideradas](#alternativas-consideradas)

---

## 🎯 Stack Overview

```
┌─────────────────────────────────────────────────────────┐
│                  FRONTEND (React)                       │
│  ┌─────────────────────────────────────────────────┐   │
│  │ • React 18                                      │   │
│  │ • React Router v6                              │   │
│  │ • Axios + Interceptadores                      │   │
│  │ • React Hook Form + Zod                        │   │
│  │ • Tailwind CSS + Radix UI                      │   │
│  └─────────────────────────────────────────────────┘   │
└────────────────────────┬────────────────────────────────┘
                         │ HTTPS
                         ▼
┌─────────────────────────────────────────────────────────┐
│              BACKEND (Node.js/Express)                  │
│  ┌─────────────────────────────────────────────────┐   │
│  │ • Express.js                                    │   │
│  │ • JWT / Sessions                               │   │
│  │ • Bcrypt / Argon2 (Password Hashing)          │   │
│  │ • AES-256-GCM (Data Encryption)               │   │
│  │ • Helmet, CORS, Rate Limiting                 │   │
│  └─────────────────────────────────────────────────┘   │
└────────────────────────┬────────────────────────────────┘
                         │ SQL
                         ▼
┌─────────────────────────────────────────────────────────┐
│          DATABASE (PostgreSQL/MySQL)                    │
│  ┌─────────────────────────────────────────────────┐   │
│  │ • Usuários (Hash + Dados Criptografados)       │   │
│  │ • Sessões                                       │   │
│  │ • Logs de Auditoria                            │   │
│  └─────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

---

## 🖥️ Backend

### Core Framework
#### **Express.js** (Node.js)
- **Por quê:** Framework minimalista, rápido e com grande comunidade
- **Alternativas:** Fastify, Koa, Hapi
- **Instalação:**
```bash
npm install express
```

### Autenticação & Autorização

#### **JWT (JSON Web Tokens)**
- **O que é:** Token stateless para autenticação
- **Por quê:** Escalável e funciona bem com APIs REST
- **Pacotes:**
```bash
npm install jsonwebtoken
npm install @types/jsonwebtoken  # TypeScript
```

**Exemplo básico:**
```javascript
const jwt = require('jsonwebtoken');

// Gerar token
const token = jwt.sign(
  { userId: user.id, email: user.email },
  process.env.JWT_SECRET,
  { expiresIn: '24h' }
);

// Verificar token
const decoded = jwt.verify(token, process.env.JWT_SECRET);
```

#### **bcryptjs** (Password Hashing)
- **O que é:** Algoritmo de hash seguro para senhas
- **Por quê:** Resistente a brute force (salt + rounds)
- **Alternativa superior:** Argon2
- **Instalação:**
```bash
npm install bcryptjs
# ou para melhor performance
npm install argon2
```

**Exemplo:**
```javascript
const bcrypt = require('bcryptjs');

// Hash senha
const hashedPassword = await bcrypt.hash(password, 10);

// Verificar senha
const isValid = await bcrypt.compare(password, hashedPassword);
```

### Criptografia de Dados

#### **crypto** (Node.js nativo)
- **O que é:** Módulo nativo para criptografia
- **Algoritmo:** AES-256-GCM
- **Por quê:** Reversível para dados pessoais, secure e padrão

**Exemplo:**
```javascript
const crypto = require('crypto');

const algorithm = 'aes-256-gcm';
const key = Buffer.from(process.env.ENCRYPTION_KEY, 'hex');
const iv = crypto.randomBytes(16);

function encrypt(text) {
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  const authTag = cipher.getAuthTag();
  return iv.toString('hex') + ':' + authTag.toString('hex') + ':' + encrypted;
}

function decrypt(text) {
  const parts = text.split(':');
  const iv = Buffer.from(parts[0], 'hex');
  const authTag = Buffer.from(parts[1], 'hex');
  const encrypted = parts[2];
  
  const decipher = crypto.createDecipheriv(algorithm, key, iv);
  decipher.setAuthTag(authTag);
  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}
```

### Validação & Sanitização

#### **joi** ou **zod**
- **Joi:** Validação schema-based
- **Zod:** TypeScript-first (recomendado)

```bash
npm install zod
```

**Exemplo:**
```javascript
const { z } = require('zod');

const registerSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(8, 'Mínimo 8 caracteres').regex(/[A-Z]/, 'Precisa de maiúscula'),
  cpf: z.string().regex(/^\d{11}$/, 'CPF inválido'),
  phone: z.string().regex(/^\d{10,11}$/, 'Telefone inválido'),
});
```

### Middleware de Segurança

#### **helmet**
- **O que faz:** Define headers HTTP seguro
- **Instalação:**
```bash
npm install helmet
```
**Uso:**
```javascript
const helmet = require('helmet');
app.use(helmet());
```

#### **cors**
- **O que faz:** Controla Cross-Origin Resource Sharing
```bash
npm install cors
```
**Uso:**
```javascript
const cors = require('cors');
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
}));
```

#### **express-rate-limit**
- **O que faz:** Rate limiting contra brute force
```bash
npm install express-rate-limit
```
**Uso:**
```javascript
const rateLimit = require('express-rate-limit');

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,  // 15 minutos
  max: 5,                     // 5 tentativas
  message: 'Muitas tentativas de login. Tente novamente mais tarde.',
  standardHeaders: true,
  legacyHeaders: false,
});

app.post('/login', loginLimiter, (req, res) => { ... });
```

### ORM/Query Builder

#### **Prisma** (Recomendado)
- **O que é:** ORM type-safe com migrations automáticas
- **Vantagens:** TypeScript, migrations gerenciadas, schema visual
```bash
npm install @prisma/client
npm install -D prisma
npx prisma init
```

**Schema exemplo:**
```prisma
model User {
  id        String    @id @default(cuid())
  email     String    @unique
  password  String    // Hash bcrypt
  cpf       String    // Criptografado
  phone     String    // Criptografado
  address   String    // Criptografado
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt
}
```

#### **TypeORM** (Alternativa)
```bash
npm install typeorm reflect-metadata
```

#### **Sequelize** (Alternativa simples)
```bash
npm install sequelize sqlite3
```

### Logging

#### **winston**
```bash
npm install winston
```
**Exemplo:**
```javascript
const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
  ],
});

// ✅ BOM: Log sem dados sensíveis
logger.info(`User login attempt: ${user.email}`);

// ❌ RUIM: Nunca logar senhas
logger.info(`User ${user.email} password: ${password}`);
```

---

## 🎨 Frontend

### Core Framework

#### **React 18**
- **O que é:** Biblioteca para UI interativa
- **Por quê:** Grande comunidade, performance otimizada, JSX
- **Instalação:** Via Vite ou Create React App
```bash
npm create vite@latest my-app -- --template react
# ou
npx create-react-app my-app
```

### Roteamento

#### **React Router v6**
```bash
npm install react-router-dom
```
**Exemplo:**
```javascript
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
```

### Requisições HTTP

#### **Axios**
- **Por quê:** Mais features que fetch nativo (interceptadores, timeout, etc)
```bash
npm install axios
```
**Exemplo com interceptadores:**
```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  timeout: 10000,
  withCredentials: true, // Enviar cookies
});

// Interceptar para adicionar token
api.interceptors.request.use((config) => {
  const token = sessionStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptar erros e renovar token
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Token expirado, fazer refresh
      const newToken = await refreshToken();
      if (newToken) {
        error.config.headers.Authorization = `Bearer ${newToken}`;
        return api(error.config);
      }
    }
    return Promise.reject(error);
  }
);

export default api;
```

#### **Alternativa: React Query (TanStack Query)**
```bash
npm install @tanstack/react-query
```
Melhor para cache e sincronização de dados.

### Gerenciamento de Formulários

#### **React Hook Form**
- **Por quê:** Leve, performance otimizada (sem re-renders desnecessários)
```bash
npm install react-hook-form
npm install zod @hookform/resolvers
```
**Exemplo:**
```javascript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const schema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(8, 'Mínimo 8 caracteres'),
});

function LoginForm() {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('email')} type="email" />
      {errors.email && <span>{errors.email.message}</span>}
      
      <input {...register('password')} type="password" />
      {errors.password && <span>{errors.password.message}</span>}
      
      <button type="submit">Entrar</button>
    </form>
  );
}
```

### Estilização

#### **Tailwind CSS**
- **Por quê:** Utility-first, muito produtivo, pequeno bundle
```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

#### **Componentes Acessíveis: Radix UI / Shadcn/ui**
```bash
npm install @radix-ui/react-dialog
# ou use shadcn/ui para pré-estilizados
npx shadcn-ui@latest init
```

### Gerenciamento de Estado

#### **Context API + useReducer** (Simples)
Para autenticação e dados do usuário.

```javascript
const AuthContext = createContext();

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Restaurar sessão ao carregar
    checkAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
```

#### **Redux Toolkit** (Complexo)
Para estado global complexo.
```bash
npm install @reduxjs/toolkit react-redux
```

### Testes

#### **Jest + React Testing Library**
```bash
npm install --save-dev @testing-library/react @testing-library/jest-dom jest
```
**Exemplo:**
```javascript
import { render, screen, fireEvent } from '@testing-library/react';
import LoginForm from './LoginForm';

test('submits form with valid data', async () => {
  render(<LoginForm onSubmit={mockFn} />);
  
  fireEvent.change(screen.getByLabelText(/email/i), {
    target: { value: 'test@example.com' }
  });
  
  fireEvent.click(screen.getByRole('button', { name: /login/i }));
  
  expect(mockFn).toHaveBeenCalledWith(
    expect.objectContaining({ email: 'test@example.com' })
  );
});
```

---

## 🗄️ Banco de Dados

### **PostgreSQL** (Recomendado)
- **Por quê:** Robusto, confiável, suporta tipos avançados
- **Instalação:** Docker recomendado
```bash
docker run --name postgres \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=secure_login \
  -p 5432:5432 \
  -d postgres:15
```

**Connection String:**
```env
DATABASE_URL=postgresql://user:password@localhost:5432/secure_login
```

### **MySQL** (Alternativa)
```bash
docker run --name mysql \
  -e MYSQL_ROOT_PASSWORD=password \
  -e MYSQL_DATABASE=secure_login \
  -p 3306:3306 \
  -d mysql:8
```

### Migrations

#### **Prisma Migrations**
```bash
npx prisma migrate dev --name initial_schema
npx prisma migrate deploy  # Produção
```

---

## 🔒 Segurança - Bibliotecas Específicas

| Problema | Solução | Pacote |
|----------|---------|--------|
| Senhas em texto puro | Bcrypt/Argon2 | `bcryptjs` ou `argon2` |
| Dados pessoais expostos | Criptografia AES-256 | `crypto` (nativo) |
| Headers inseguros | Helmet | `helmet` |
| CORS mal configurado | CORS controlado | `cors` |
| Brute force login | Rate limiting | `express-rate-limit` |
| SQL Injection | ORM + Parametrização | `prisma` |
| XSS no frontend | Sanitização | React escapa automaticamente |
| CSRF | CSRF tokens | `csurf` |
| Senhas fracas | Validação | `zod` |

### **csurf** (CSRF Protection)
```bash
npm install csurf cookie-parser
```

---

## 🚀 DevOps & Deployment

### Containerização

#### **Docker**
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 5000

CMD ["node", "src/index.js"]
```

```bash
docker build -t secure-login:latest .
docker run -p 5000:5000 --env-file .env secure-login:latest
```

#### **Docker Compose** (Full Stack)
```yaml
version: '3.9'

services:
  db:
    image: postgres:15
    environment:
      POSTGRES_PASSWORD: ${DB_PASSWORD}
      POSTGRES_DB: secure_login
    volumes:
      - db_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  backend:
    build: ./backend
    ports:
      - "5000:5000"
    environment:
      DATABASE_URL: postgresql://postgres:${DB_PASSWORD}@db:5432/secure_login
      JWT_SECRET: ${JWT_SECRET}
      ENCRYPTION_KEY: ${ENCRYPTION_KEY}
    depends_on:
      - db

  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
    environment:
      REACT_APP_API_URL: http://localhost:5000/api

volumes:
  db_data:
```

### CI/CD

#### **GitHub Actions**
```yaml
name: Test & Deploy

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run lint
      - run: npm test
      - run: npm run build

  deploy:
    needs: test
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to production
        run: |
          # Deploy script
```

### Plataformas Recomendadas

| Plataforma | Melhor para | Custo |
|-----------|-----------|-------|
| **Vercel** | Frontend React | Grátis+ |
| **Netlify** | Frontend SPA | Grátis+ |
| **Render** | Full Stack | Grátis+ |
| **Railway** | Full Stack | Grátis+ |
| **AWS** | Qualquer coisa | Pay-as-you-go |
| **DigitalOcean** | VPS | $5-12/mês |

---

## 🔄 Alternativas Consideradas

### Backend

| Framework | Vantagens | Desvantagens |
|-----------|-----------|-------------|
| **Express** | Minimalista, grande comunidade | Pouco opinativo |
| **Fastify** | Mais rápido, TypeScript nativo | Comunidade menor |
| **NestJS** | Full-featured, TypeScript | Overhead para pequenos projetos |
| **Hapi** | Robusto, enterprise | Complexo para MVPs |

### Frontend

| Framework | Vantagens | Desvantagens |
|-----------|-----------|-------------|
| **React** | Flexível, grande comunidade | Curva de aprendizado |
| **Vue** | Simples, bom para MVPs | Comunidade menor que React |
| **Svelte** | Bundle pequeno, performance | Comunidade pequena |
| **Next.js** | SSR/SSG built-in | Opinativo, overhead |

### Banco de Dados

| Banco | Casos de Uso | Trade-offs |
|------|-------------|-----------|
| **PostgreSQL** | Dados estruturados, ACID | Overhead para NoSQL |
| **MySQL** | Compatibilidade, hosting barato | Performance relativa |
| **MongoDB** | Dados flexíveis, NoSQL | Sem ACID nativo |
| **Firebase** | Prototipagem rápida | Vendor lock-in |

---

## 📚 Referências

- [Node.js Security Best Practices](https://nodejs.org/en/docs/guides/security/)
- [OWASP Top 10 Web Application Security Risks](https://owasp.org/Top10/)
- [Express.js Security](https://expressjs.com/en/advanced/best-practice-security.html)
- [React Security](https://react.dev/learn)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)

---

**Última atualização:** 2026-09-11 | **Versão:** 1.0.0
