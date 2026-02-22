# Teste de Integração Frontend-Backend

## Resumo das Mudanças

A integração frontend-backend foi implementada com sucesso. O projeto agora funciona com:

- **Frontend (Vite)**: Porta 8080 - Aplicação React com chamadas HTTP para a API
- **Backend (Next.js)**: Porta 3000 - API REST com Prisma e SQLite

## Como Testar

### 1. Iniciar o Backend

```bash
cd backend
npm run dev
```

O backend estará rodando em `http://localhost:3000`

### 2. Iniciar o Frontend (em outro terminal)

```bash
npm run dev
```

O frontend estará rodando em `http://localhost:8080`

### 3. Testar Funcionalidades

Acesse `http://localhost:8080` no navegador e teste:

#### **Equipes**
- Cadastrar nova equipe
- Editar equipe
- Deletar equipe
- Adicionar/editar/deletar participantes

#### **Esportes**
- Cadastrar novo esporte
- Editar esporte
- Deletar esporte
- Gerenciar participantes por esporte

#### **Relatórios**
- Ver ranking geral das equipes
- Ver ranking por esporte
- Atualizar pontuações

### 4. Verificar Requisições no Network

Abra o DevTools (F12 → Network) e verifique se as requisições estão sendo enviadas para:
- `http://localhost:3000/api/equipes`
- `http://localhost:3000/api/esportes`
- `http://localhost:3000/api/participantes`
- etc.

## Arquivos Modificados

### Frontend
- `src/lib/api.ts` - Nova classe ApiClient com métodos HTTP
- `src/lib/store.ts` - Migrado de localStorage para API
- `src/pages/EquipesPage.tsx` - Atualizado para usar async/await
- `src/pages/EsportesPage.tsx` - Atualizado para usar async/await
- `src/pages/RelatoriosPage.tsx` - Atualizado para usar async/await

### Backend
- `backend/lib/cors.ts` - Middleware de CORS (opcional, já havia nas rotas)

## Fluxo de Dados

```
User Interaction → React Component
                      ↓
                  useEffect/Event Handler
                      ↓
                  ApiClient Methods
                      ↓
                  HTTP Request (fetch)
                      ↓
              Backend (Next.js API Route)
                      ↓
                  Prisma Query
                      ↓
                  SQLite Database
                      ↓
              HTTP Response (JSON)
                      ↓
                  React Component State
                      ↓
                  UI Re-render
```

## Possíveis Erros e Soluções

### CORS Error
**Problema**: Erro de CORS ao fazer requisições
**Solução**: Verifique se o backend está rodando em `http://localhost:3000` e se o frontend está em `http://localhost:8080`

### 404 Not Found
**Problema**: API retorna 404
**Solução**: Verifique se as rotas existem no backend em `backend/app/api/`

### Timeout
**Problema**: Requisição demora ou nunca retorna
**Solução**: Verifique se o backend está rodando e se não há erros no console

## Dados Persistem?

Sim! Todos os dados agora são salvos no banco de dados SQLite através do Prisma. Ao reiniciar o backend, os dados continuarão lá.

## Próximos Passos

1. **Adicionar autenticação** (se necessário)
2. **Implementar validações mais robustas** no backend
3. **Adicionar paginação** para grandes conjuntos de dados
4. **Configurar variáveis de ambiente** para URLs de API
5. **Deploy** em servidor de produção
