import { ApiClient } from "./api";

// Types
export interface Equipe {
  id: number;
  nome: string;
  cidade: string;
}

export interface Participante {
  id: number;
  nome: string;
  cpf: string;
  equipeId: number;
}

export interface Esporte {
  id: number;
  modalidade: "Individual" | "Coletivo";
  nome: string;
  data: string;
  horario: string;
}

export interface Participacao {
  id: number;
  participanteId: number;
  equipeId: number;
  esporteId: number;
}

export interface Resultado {
  id: number;
  equipeId: number;
  esporteId: number;
  pontos: number;
}

// Equipes
export async function getEquipes(): Promise<Equipe[]> {
  try {
    return await ApiClient.getEquipes();
  } catch (error) {
    console.error("Erro ao buscar equipes:", error);
    return [];
  }
}

export async function addEquipe(nome: string, cidade: string): Promise<Equipe | null> {
  try {
    return await ApiClient.createEquipe(nome, cidade);
  } catch (error) {
    console.error("Erro ao criar equipe:", error);
    return null;
  }
}

export async function updateEquipe(id: number, nome: string, cidade: string): Promise<Equipe | null> {
  try {
    return await ApiClient.updateEquipe(id, nome, cidade);
  } catch (error) {
    console.error("Erro ao atualizar equipe:", error);
    return null;
  }
}

export async function deleteEquipe(id: number): Promise<boolean> {
  try {
    await ApiClient.deleteEquipe(id);
    return true;
  } catch (error) {
    console.error("Erro ao deletar equipe:", error);
    return false;
  }
}

// Participantes
export async function getParticipantes(equipeId?: number): Promise<Participante[]> {
  try {
    return await ApiClient.getParticipantes(equipeId);
  } catch (error) {
    console.error("Erro ao buscar participantes:", error);
    return [];
  }
}

export async function addParticipante(nome: string, cpf: string, equipeId: number): Promise<Participante | string | null> {
  try {
    return await ApiClient.createParticipante(nome, cpf, equipeId);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erro ao criar participante";
    console.error(message, error);
    return message;
  }
}

export async function updateParticipante(id: number, nome: string, cpf: string, equipeId?: number): Promise<Participante | string | null> {
  try {
    if (!equipeId) return "Equipe ID é necessário";
    return await ApiClient.updateParticipante(id, nome, cpf, equipeId);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erro ao atualizar participante";
    console.error(message, error);
    return message;
  }
}

export async function deleteParticipante(id: number): Promise<boolean> {
  try {
    await ApiClient.deleteParticipante(id);
    return true;
  } catch (error) {
    console.error("Erro ao deletar participante:", error);
    return false;
  }
}

// Esportes
export async function getEsportes(): Promise<Esporte[]> {
  try {
    return await ApiClient.getEsportes();
  } catch (error) {
    console.error("Erro ao buscar esportes:", error);
    return [];
  }
}

export async function addEsporte(
  modalidade: "Individual" | "Coletivo",
  nome: string,
  data: string,
  horario: string
): Promise<Esporte | string | null> {
  try {
    return await ApiClient.createEsporte(modalidade, nome, data, horario);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erro ao criar esporte";
    console.error(message, error);
    return message;
  }
}

export async function updateEsporte(
  id: number,
  modalidade: "Individual" | "Coletivo",
  nome: string,
  data: string,
  horario: string
): Promise<Esporte | string | null> {
  try {
    return await ApiClient.updateEsporte(id, modalidade, nome, data, horario);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erro ao atualizar esporte";
    console.error(message, error);
    return message;
  }
}

export async function deleteEsporte(id: number): Promise<boolean> {
  try {
    await ApiClient.deleteEsporte(id);
    return true;
  } catch (error) {
    console.error("Erro ao deletar esporte:", error);
    return false;
  }
}

// Participacoes
export async function getParticipacoes(esporteId?: number): Promise<Participacao[]> {
  try {
    return await ApiClient.getParticipacoes(esporteId);
  } catch (error) {
    console.error("Erro ao buscar participações:", error);
    return [];
  }
}

export async function addParticipacoes(esporteId: number, participanteIds: number[]): Promise<boolean> {
  try {
    for (const participanteId of participanteIds) {
      try {
        // Buscar participante para pegar equipeId
        const participantes = await ApiClient.getParticipantes();
        const participante = participantes.find((p) => p.id === participanteId);
        if (participante) {
          await ApiClient.createParticipacao(participanteId, participante.equipeId, esporteId);
        }
      } catch (error) {
        console.error(`Erro ao adicionar participante ${participanteId}:`, error);
      }
    }
    return true;
  } catch (error) {
    console.error("Erro ao adicionar participações:", error);
    return false;
  }
}

export async function removeParticipacao(id: number): Promise<boolean> {
  try {
    await ApiClient.deleteParticipacao(id);
    return true;
  } catch (error) {
    console.error("Erro ao remover participação:", error);
    return false;
  }
}

// Resultados
export async function getResultados(esporteId?: number): Promise<Resultado[]> {
  try {
    return await ApiClient.getResultados();
  } catch (error) {
    console.error("Erro ao buscar resultados:", error);
    return [];
  }
}

export async function setResultado(
  equipeId: number,
  esporteId: number,
  pontos: number
): Promise<Resultado | null> {
  try {
    return await ApiClient.createResultado(equipeId, esporteId, pontos);
  } catch (error) {
    console.error("Erro ao definir resultado:", error);
    return null;
  }
}

export async function deleteResultado(id: number): Promise<boolean> {
  try {
    await ApiClient.deleteResultado(id);
    return true;
  } catch (error) {
    console.error("Erro ao deletar resultado:", error);
    return false;
  }
}

// Helpers
export async function getRankingGeral(): Promise<{ equipeId: number; nome: string; totalPontos: number }[]> {
  try {
    return await ApiClient.getRanking();
  } catch (error) {
    console.error("Erro ao buscar ranking:", error);
    return [];
  }
}
