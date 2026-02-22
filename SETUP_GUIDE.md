# 🚀 Setup Guia Completo

Instruções passo-a-passo para setup local do projeto Campionato Lovable.

## 📋 Pré-requisitos

- Node.js 18+ ([Download](https://nodejs.org))
- npm 9+ (vem com Node.js)
- Git
- Editor: VSCode, WebStorm, etc.

## ⚙️ Instalação

### Passo 1: Clonar o repositório

```bash
git clone https://github.com/Mabynha20/campionato-lovable.git
cd campionato-lovable
```

### Passo 2: Instalar dependências da raiz

```bash
npm install
```

Isto instala `concurrently` que permite rodar frontend e backend simultaneamente.

### Passo 3: Instalar dependências do frontend

```bash
cd frontend
npm install
cd ..
```

### Passo 4: Instalar dependências do backend

```bash
cd backend
npm install
cd ..
```

### Passo 5: Configurar banco de dados

```bash
cd backend
npx prisma generate
npx prisma migrate dev --name init
cd ..
```

Isto:
1. Gera o cliente Prisma
2. Cria/sincroniza o banco de dados SQLite

Seu arquivo de banco de dados será criado em `backend/dev.db`

## 🏃 Executar o Projeto

### Opção A: Rodar tudo de uma vez (Recomendado)

```bash
npm run dev
```

Isto inicia:
- **Frontend**: http://localhost:8080
- **Backend**: http://localhost:3000

### Opção B: Rodar separadamente

**Terminal 1 - Frontend:**
```bash
npm run dev:frontend
```
Acesse: http://localhost:8080

**Terminal 2 - Backend:**
```bash
npm run dev:backend
```
API disponível em: http://localhost:3000/api

## 🎯 Primeiros Passos

1. Abra http://localhost:8080 no navegador
2. Vá para "Equipes" e crie uma equipe de teste
3. Vá para "Esportes" e crie um esporte
4. Vá para "Relatórios" e veja o ranking

## 📁 Estrutura do Projeto

```
campionato-lovable/
├── frontend/          # React + Vite
├── backend/           # Next.js + Prisma + SQLite
├── package.json       # Monorepo
└── README.md
```

### Frontend (`/frontend`)
- **Desenvolvimento**: `npm run dev`
- **Build**: `npm run build`
- **Testes**: `npm run test`
- **Port**: 8080

### Backend (`/backend`)
- **Desenvolvimento**: `npm run dev`
- **Build**: `npm run build`
- **Port**: 3000
- **DB**: SQLite (`dev.db`)

## 🔧 Configurações

### Frontend - Variáveis de Ambiente

Nenhuma variável obrigatória. A URL da API é configurada em:
- `frontend/src/lib/api.ts` → `API_BASE_URL`

Para mudar:
```typescript
const API_BASE_URL = "http://localhost:3000/api";
```

### Backend - Variáveis de Ambiente

Arquivo: `backend/.env`

```env
DATABASE_URL="file:./dev.db"
NODE_ENV="development"
```

## 🗄️ Banco de Dados

### Visualizar dados

```bash
cd backend
npx prisma studio
```

Abre interface em http://localhost:5555

### Reset do banco

```bash
cd backend
npx prisma migrate reset
# Confirme com 'y'
cd ..
```

⚠️ Isto delete todos os dados!

### Criar migração

```bash
cd backend
npx prisma migrate dev --name descricao_da_mudanca
cd ..
```

## 📝 Desenvolvimento

### Adicionar página nova

1. Criar arquivo em `frontend/src/pages/NovaPage.tsx`
2. Importar em `frontend/src/App.tsx`
3. Adicionar rota em `App.tsx`

```typescript
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NovaPage from './pages/NovaPage';

<Routes>
  <Route path="/nova" element={<NovaPage />} />
</Routes>
```

### Adicionar endpoint API

1. Criar arquivo em `backend/app/api/novo/route.ts`
2. Exportar `GET`, `POST`, `PUT`, `DELETE`

```typescript
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";

export async function GET(req: NextRequest) {
  const dados = await prisma.modelo.findMany();
  return NextResponse.json(dados);
}
```

### Adicionar cliente API

1. Editar `frontend/src/lib/api.ts`
2. Adicionar método na classe `ApiClient`

```typescript
static getNovo() {
  return this.request("/novo");
}
```

## 🐛 Troubleshooting

### Porta 8080/3000 já em uso

**Frontend:**
```bash
cd frontend
npm run dev -- --port 8081
```

**Backend:**
```bash
cd backend
npm run dev -- -p 3001
```

### CORS Error

1. Verifique se backend está rodando (`http://localhost:3000`)
2. Frontend deve estar em `http://localhost:8080`
3. Não use `127.0.0.1` como endereço

### Banco de dados corrompido

```bash
cd backend
rm dev.db
npx prisma migrate dev --name init
cd ..
```

### Módulos não encontrados

```bash
# Limpar cache
rm -r node_modules frontend/node_modules backend/node_modules
npm install
cd frontend && npm install && cd ..
cd backend && npm install && cd ..
```

### Build falha

```bash
# Limpar builds anteriores
rm -rf frontend/dist backend/.next
npm run build
```

## 🚢 Deploy

### Frontend (Vercel/Netlify)

1. Push para GitHub
2. Conectar repositório em Vercel/Netlify
3. Build command: `npm run build:frontend`
4. Output directory: `frontend/dist`

### Backend (Vercel/Railway)

1. Deploym `backend/` como servidor Node.js
2. Variável de ambiente: `DATABASE_URL`
3. Build command: `npm run build:backend`
4. Start command: `npm run start:backend`

## 📚 Documentação

- `README.md` - Overview do projeto
- `INTEGRATION_GUIDE.md` - Integração frontend-backend
- `frontend/README.md` - Documentação do frontend
- `frontend/API_CLIENT.md` - Documentação da API
- `backend/README.md` - Documentação do backend

## 💡 Dicas

- Use `git branch` para features: `git checkout -b feature/minha-feature`
- Commit frequente: `git commit -m "Descrição clara"`
- Push e abra PR quando terminar
- Ative Dev Tools (F12) para debug
- Use console.log para debug rápido

## ❓ Suporte

- Abra uma issue no GitHub
- Consulte a documentação
- Verifique Troubleshooting acima

## 📄 Licença

MIT License

---

**Pronto para começar?** 🎉

```bash
npm run dev
```
