# API Client - Frontend

Documentação sobre como usar o cliente API do frontend.

## 📋 Visão Geral

O arquivo `src/lib/api.ts` exporta a classe `ApiClient` com todos os métodos para comunicação com a API backend.

## 🔗 Configuração

```typescript
const API_BASE_URL = "http://localhost:3000/api";
```

Para mudar a URL, edite a constante no arquivo `src/lib/api.ts`.

## 📚 Métodos Disponíveis

### Equipes

```typescript
// Listar todas as equipes
const equipes = await ApiClient.getEquipes();

// Criar nova equipe
const novaEquipe = await ApiClient.createEquipe(nome, cidade);

// Editar equipe
await ApiClient.updateEquipe(id, novoNome, novaCidade);

// Deletar equipe
await ApiClient.deleteEquipe(id);
```

### Participantes

```typescript
// Listar participantes (opcionalmente filtrar por equipe)
const participantes = await ApiClient.getParticipantes();
const participantesEquipe = await ApiClient.getParticipantes(equipeId);

// Criar participante
await ApiClient.createParticipante(nome, cpf, equipeId);

// Editar participante
await ApiClient.updateParticipante(id, nome, cpf, equipeId);

// Deletar participante
await ApiClient.deleteParticipante(id);
```

### Esportes

```typescript
// Listar esportes
const esportes = await ApiClient.getEsportes();

// Criar esporte
await ApiClient.createEsporte(modalidade, nome, data, horario);

// Editar esporte
await ApiClient.updateEsporte(id, modalidade, nome, data, horario);

// Deletar esporte
await ApiClient.deleteEsporte(id);
```

### Participações

```typescript
// Listar participações (opcionalmente por esporte)
const participacoes = await ApiClient.getParticipacoes();
const participacoesEsporte = await ApiClient.getParticipacoes(esporteId);

// Criar participação
await ApiClient.createParticipacao(participanteId, equipeId, esporteId);

// Deletar participação
await ApiClient.deleteParticipacao(id);
```

### Resultados

```typescript
// Listar resultados
const resultados = await ApiClient.getResultados();

// Criar/Editar resultado
await ApiClient.createResultado(equipeId, esporteId, pontos);

// Deletar resultado
await ApiClient.deleteResultado(id);
```

### Ranking

```typescript
// Obter ranking geral
const ranking = await ApiClient.getRanking();

// Formato esperado:
// [
//   { equipeId: 1, nome: "Equipe A", totalPontos: 150 },
//   { equipeId: 2, nome: "Equipe B", totalPontos: 130 },
//   ...
// ]
```

## 🎯 Exemplo de Uso

```typescript
import { ApiClient } from '@/lib/api';

// Em um componente React
export default function MinhaComponente() {
  const [equipes, setEquipes] = useState([]);

  useEffect(() => {
    const carregarEquipes = async () => {
      try {
        const dados = await ApiClient.getEquipes();
        setEquipes(dados);
      } catch (error) {
        console.error('Erro:', error.message);
      }
    };
    carregarEquipes();
  }, []);

  const handleCriarEquipe = async (nome, cidade) => {
    try {
      const novaEquipe = await ApiClient.createEquipe(nome, cidade);
      setEquipes([...equipes, novaEquipe]);
    } catch (error) {
      alert(`Erro: ${error.message}`);
    }
  };

  return (
    // JSX...
  );
}
```

## ⚠️ Tratamento de Erros

Todos os métodos lançam erros em caso de falha. Use try/catch:

```typescript
try {
  const equipe = await ApiClient.createEquipe("Equipe", "Cidade");
} catch (error) {
  // error é uma instância de Error
  console.error(error.message);
}
```

Erros possíveis:
- Network error - Servidor não respondeu
- 400 Bad Request - Dados inválidos
- 404 Not Found - Recurso não existe
- 500 Server Error - Erro no servidor

## 🔄 Integração com Store

O arquivo `src/lib/store.ts` encapsula o `ApiClient` e fornece uma API simplificada:

```typescript
import { 
  getEquipes, 
  addEquipe, 
  updateEquipe, 
  deleteEquipe 
} from '@/lib/store';

// Usar direto (sem criar instância)
const equipes = await getEquipes();
const novaEquipe = await addEquipe(nome, cidade);
```

## 🌐 Headers HTTP

Todas as requisições incluem:

```
Content-Type: application/json
```

CORS é configurado automaticamente no backend.

## 📡 Requisições

### GET
```typescript
// Sem body
await ApiClient.getEquipes();
```

### POST
```typescript
// Com body JSON
await ApiClient.createEquipe("Equipe A", "São Paulo");
```

### PUT
```typescript
// Edita recurso existente
await ApiClient.updateEquipe(1, "Equipe Atualizada", "Rio de Janeiro");
```

### DELETE
```typescript
// Remove recurso
await ApiClient.deleteEquipe(1);
```

## 🔐 Autenticação

Atualmente não há autenticação. Para adicionar tokens JWT, modifique `src/lib/api.ts`:

```typescript
private static async request<T>(endpoint: string, options: RequestInit = {}) {
  const token = localStorage.getItem('token');
  const headers = {
    "Content-Type": "application/json",
    ...(token ? { "Authorization": `Bearer ${token}` } : {}),
    ...options.headers,
  };
  
  // ... resto do código
}
```

## 📊 Response Tipos

As respostas vêm em JSON com estrutura definida:

```typescript
// Equipe
{
  id: number;
  nome: string;
  cidade: string;
}

// Participante
{
  id: number;
  nome: string;
  cpf: string;
  equipeId: number;
}

// Esporte
{
  id: number;
  modalidade: "Individual" | "Coletivo";
  nome: string;
  data: string;
  horario: string;
}
```

## 🚀 Performance

- As requisições são feitas com `fetch` nativo (sem bibliotecas)
- Use `Promise.all()` para requisições paralelas
- Implemente cache local se necessário

```typescript
// Requisições paralelas
const [equipes, esportes] = await Promise.all([
  ApiClient.getEquipes(),
  ApiClient.getEsportes(),
]);
```

## 🐛 Debug

Ative logs nos métodos da API adicionando `console.log`:

```typescript
private static async request<T>(endpoint: string, options: RequestInit = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  console.log(`${options.method || 'GET'} ${url}`);
  
  // ... resto do código
}
```

Ou use a aba Network do DevTools (F12) para inspecionar requisições.
