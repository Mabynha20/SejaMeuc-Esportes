const API_BASE_URL = "http://localhost:3000/api";

export class ApiClient {
  private static async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const response = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: response.statusText }));
      throw new Error(error.error || `HTTP ${response.status}`);
    }

    return response.json();
  }

  // Equipes
  static getEquipes() {
    return this.request("/equipes");
  }

  static createEquipe(nome: string, cidade: string) {
    return this.request("/equipes", {
      method: "POST",
      body: JSON.stringify({ nome, cidade }),
    });
  }

  static updateEquipe(id: number, nome: string, cidade: string) {
    return this.request(`/equipes/${id}`, {
      method: "PUT",
      body: JSON.stringify({ nome, cidade }),
    });
  }

  static deleteEquipe(id: number) {
    return this.request(`/equipes/${id}`, { method: "DELETE" });
  }

  // Participantes
  static getParticipantes(equipeId?: number) {
    const endpoint = equipeId ? `/participantes?equipeId=${equipeId}` : "/participantes";
    return this.request(endpoint);
  }

  static createParticipante(nome: string, cpf: string, equipeId: number) {
    return this.request("/participantes", {
      method: "POST",
      body: JSON.stringify({ nome, cpf, equipeId }),
    });
  }

  static updateParticipante(id: number, nome: string, cpf: string, equipeId: number) {
    return this.request(`/participantes/${id}`, {
      method: "PUT",
      body: JSON.stringify({ nome, cpf, equipeId }),
    });
  }

  static deleteParticipante(id: number) {
    return this.request(`/participantes/${id}`, { method: "DELETE" });
  }

  // Esportes
  static getEsportes() {
    return this.request("/esportes");
  }

  static createEsporte(
    modalidade: string,
    nome: string,
    data: string,
    horario: string
  ) {
    return this.request("/esportes", {
      method: "POST",
      body: JSON.stringify({ modalidade, nome, data, horario }),
    });
  }

  static updateEsporte(
    id: number,
    modalidade: string,
    nome: string,
    data: string,
    horario: string
  ) {
    return this.request(`/esportes/${id}`, {
      method: "PUT",
      body: JSON.stringify({ modalidade, nome, data, horario }),
    });
  }

  static deleteEsporte(id: number) {
    return this.request(`/esportes/${id}`, { method: "DELETE" });
  }

  // Participações
  static getParticipacoes(esporteId?: number) {
    const endpoint = esporteId ? `/participacoes?esporteId=${esporteId}` : "/participacoes";
    return this.request(endpoint);
  }

  static createParticipacao(participanteId: number, equipeId: number, esporteId: number) {
    return this.request("/participacoes", {
      method: "POST",
      body: JSON.stringify({ participanteId, equipeId, esporteId }),
    });
  }

  static deleteParticipacao(id: number) {
    return this.request(`/participacoes/${id}`, { method: "DELETE" });
  }

  // Resultados
  static getResultados() {
    return this.request("/resultados");
  }

  static createResultado(equipeId: number, esporteId: number, pontos: number) {
    return this.request("/resultados", {
      method: "POST",
      body: JSON.stringify({ equipeId, esporteId, pontos }),
    });
  }

  static deleteResultado(id: number) {
    return this.request(`/resultados/${id}`, { method: "DELETE" });
  }

  // Ranking
  static getRanking() {
    return this.request("/ranking");
  }
}
