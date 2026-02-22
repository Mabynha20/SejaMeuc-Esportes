# SejaMeuc - Esportes

Plataforma moderna de gerenciamento de campeonatos com frontend React e backend Next.js.

## 📁 Estrutura do Projeto

```
campionato-lovable/
├── frontend/          # Aplicação React (Vite)
│   ├── src/
│   ├── public/
│   ├── package.json
│   ├── vite.config.ts
│   └── ...
├── backend/           # API REST (Next.js + Prisma + SQLite)
│   ├── app/
│   ├── prisma/
│   ├── lib/
````markdown
# Campionato Lovable

Projeto para gerenciar campeonatos esportivos com um frontend em React (Vite) e um backend em Next.js (API + Prisma).

**Objetivo:** fornecer um painel simples para gerenciar equipes, participantes, esportes, resultados e gerar rankings/relatórios.

**Público-alvo:** desenvolvedores que querem rodar localmente para desenvolvimento ou testar a API.

## Estrutura do repositório

```
campionato-lovable/
├── frontend/        # Aplicação React (Vite)
├── backend/         # API Next.js + Prisma
├── INTEGRATION_GUIDE.md
├── example.env      # Modelo de variáveis de ambiente (não conter segredos)
└── README.md
```

## Rápido (pré-requisitos)
- Node.js 18+
- npm

## Instalação (passo a passo)

1. Clone o repositório

```powershell
git clone [https://github.com/Mabynha20/SejaMeuc-Esportes.git]
cd sejameuc-esportes
```

2. Instale dependências na raiz (scripts de conveniência)

```powershell
npm install
```

3. Instale dependências específicas (caso queira manualmente)

```powershell
cd frontend && npm install && cd ..
cd backend && npm install && cd ..
```

4. Configure o banco e o Prisma (backend)

```powershell
cd backend
npx prisma generate
# Se for necessário criar/migrar o banco durante dev:
npx prisma migrate dev --name init
cd ..
```

5. Copie `example.env` para `.env` e ajuste valores locais

```powershell
copy example.env .env
# editar .env conforme necessário
```

## Rodando em desenvolvimento

Rodar frontend + backend juntos (script na raiz):

```powershell
npm run dev
```

URLs padrão:
- Frontend: `http://localhost:8080`
- Backend (API): `http://localhost:3000`

Rodar separadamente:

```powershell
npm run dev:frontend
npm run dev:backend
```

## Scripts importantes (raiz)

- `npm run dev` — inicia ambos em modo desenvolvimento
- `npm run dev:frontend` — inicia apenas o frontend
- `npm run dev:backend` — inicia apenas o backend
- `npm run build` — build para produção

## Variáveis de ambiente

Use o arquivo `example.env` como referência. Nunca comite arquivos que contenham segredos reais (ex.: `.env`).

## Contribuição

- Faça um fork
- Crie uma branch com descrição clara: `feature/nome-da-feature`
- Abra um PR descrevendo a mudança e como testar

## Recursos e documentação

- Integração e endpoints detalhados: `INTEGRATION_GUIDE.md`
- Backend: `backend/README.md`
- Frontend: `frontend/README.md`

## Licença

MIT

````
| GET | `/api/ranking` | Obter ranking geral |
