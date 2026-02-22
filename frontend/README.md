````markdown
# Frontend — Aplicação (Vite + React)

Aplicação frontend para o painel de gestão dos campeonatos. Feito com Vite, React e TypeScript.

## Tecnologias principais

- React 19
- Vite
- TypeScript
- Tailwind CSS
- shadcn/ui

## Instruções rápidas

```powershell
cd frontend
npm install
npm run dev    # abre em http://localhost:8080
```

Build e preview:

```powershell
npm run build
npm run preview
```

## Configuração da API

O cliente HTTP está em `src/lib/api.ts`. A base padrão é `http://localhost:3000/api`.
Se necessário, ajuste a variável `NEXT_PUBLIC_API_URL` no `.env` (ou copie de `example.env`).

## Estrutura importante

```
src/
├── components/       # Componentes reutilizáveis e UI
├── pages/            # Páginas principais (Equipes, Esportes, Relatórios)
├── lib/              # Cliente API e utilitários
└── hooks/            # Hooks customizados
```

## Testes e lint

```powershell
npm run lint
npm run test
npm run test:watch
```

## Problemas comuns

- Porta 8080 ocupada: verifique `vite.config.ts`
- CORS: rode o backend em `localhost:3000`
- Dependências faltando: `npm install`

## Deploy

O build em `dist/` pode ser copiado para qualquer host estático ou publicado via Vercel/Netlify.

````
│   ├── store.ts     # Gerenciamento de estado
