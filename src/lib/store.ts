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

interface Store {
  equipes: Equipe[];
  participantes: Participante[];
  esportes: Esporte[];
  participacoes: Participacao[];
  resultados: Resultado[];
  nextIds: { equipe: number; participante: number; esporte: number; participacao: number; resultado: number };
}

const STORAGE_KEY = "sejameuc_data";

function getDefaultStore(): Store {
  return {
    equipes: [],
    participantes: [],
    esportes: [],
    participacoes: [],
    resultados: [],
    nextIds: { equipe: 1, participante: 1, esporte: 1, participacao: 1, resultado: 1 },
  };
}

function load(): Store {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return getDefaultStore();
}

function save(store: Store) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
}

// Equipes
export function getEquipes(): Equipe[] {
  return load().equipes;
}

export function addEquipe(nome: string, cidade: string): Equipe {
  const s = load();
  const equipe: Equipe = { id: s.nextIds.equipe++, nome, cidade };
  s.equipes.push(equipe);
  save(s);
  return equipe;
}

export function updateEquipe(id: number, nome: string, cidade: string) {
  const s = load();
  const e = s.equipes.find((x) => x.id === id);
  if (e) { e.nome = nome; e.cidade = cidade; save(s); }
}

export function deleteEquipe(id: number) {
  const s = load();
  s.equipes = s.equipes.filter((x) => x.id !== id);
  s.participantes = s.participantes.filter((x) => x.equipeId !== id);
  s.participacoes = s.participacoes.filter((x) => x.equipeId !== id);
  s.resultados = s.resultados.filter((x) => x.equipeId !== id);
  save(s);
}

// Participantes
export function getParticipantes(equipeId?: number): Participante[] {
  const s = load();
  return equipeId ? s.participantes.filter((p) => p.equipeId === equipeId) : s.participantes;
}

export function addParticipante(nome: string, cpf: string, equipeId: number): Participante | string {
  const s = load();
  if (s.participantes.some((p) => p.cpf === cpf)) return "CPF já cadastrado no sistema.";
  const p: Participante = { id: s.nextIds.participante++, nome, cpf, equipeId };
  s.participantes.push(p);
  save(s);
  return p;
}

export function updateParticipante(id: number, nome: string, cpf: string): string | null {
  const s = load();
  if (s.participantes.some((p) => p.cpf === cpf && p.id !== id)) return "CPF já cadastrado.";
  const p = s.participantes.find((x) => x.id === id);
  if (p) { p.nome = nome; p.cpf = cpf; save(s); }
  return null;
}

export function deleteParticipante(id: number) {
  const s = load();
  s.participantes = s.participantes.filter((x) => x.id !== id);
  s.participacoes = s.participacoes.filter((x) => x.participanteId !== id);
  save(s);
}

// Esportes
export function getEsportes(): Esporte[] {
  return load().esportes;
}

export function addEsporte(modalidade: "Individual" | "Coletivo", nome: string, data: string, horario: string): Esporte | string {
  const s = load();
  if (s.esportes.some((e) => e.nome === nome && e.data === data && e.horario === horario))
    return "Já existe esporte com mesmo nome, data e horário.";
  const esporte: Esporte = { id: s.nextIds.esporte++, modalidade, nome, data, horario };
  s.esportes.push(esporte);
  save(s);
  return esporte;
}

export function updateEsporte(id: number, modalidade: "Individual" | "Coletivo", nome: string, data: string, horario: string): string | null {
  const s = load();
  if (s.esportes.some((e) => e.nome === nome && e.data === data && e.horario === horario && e.id !== id))
    return "Já existe esporte com mesmo nome, data e horário.";
  const e = s.esportes.find((x) => x.id === id);
  if (e) { e.modalidade = modalidade; e.nome = nome; e.data = data; e.horario = horario; save(s); }
  return null;
}

export function deleteEsporte(id: number) {
  const s = load();
  s.esportes = s.esportes.filter((x) => x.id !== id);
  s.participacoes = s.participacoes.filter((x) => x.esporteId !== id);
  s.resultados = s.resultados.filter((x) => x.esporteId !== id);
  save(s);
}

// Participacoes
export function getParticipacoes(esporteId?: number): Participacao[] {
  const s = load();
  return esporteId ? s.participacoes.filter((p) => p.esporteId === esporteId) : s.participacoes;
}

export function addParticipacoes(esporteId: number, participanteIds: number[]) {
  const s = load();
  for (const pid of participanteIds) {
    if (s.participacoes.some((p) => p.participanteId === pid && p.esporteId === esporteId)) continue;
    const part = s.participantes.find((p) => p.id === pid);
    if (!part) continue;
    s.participacoes.push({ id: s.nextIds.participacao++, participanteId: pid, equipeId: part.equipeId, esporteId });
  }
  save(s);
}

export function removeParticipacao(id: number) {
  const s = load();
  s.participacoes = s.participacoes.filter((x) => x.id !== id);
  save(s);
}

// Resultados
export function getResultados(esporteId?: number): Resultado[] {
  const s = load();
  return esporteId ? s.resultados.filter((r) => r.esporteId === esporteId) : s.resultados;
}

export function setResultado(equipeId: number, esporteId: number, pontos: number) {
  const s = load();
  const existing = s.resultados.find((r) => r.equipeId === equipeId && r.esporteId === esporteId);
  if (existing) {
    existing.pontos = pontos;
  } else {
    s.resultados.push({ id: s.nextIds.resultado++, equipeId, esporteId, pontos });
  }
  save(s);
}

export function deleteResultado(id: number) {
  const s = load();
  s.resultados = s.resultados.filter((x) => x.id !== id);
  save(s);
}

// Helpers
export function getRankingGeral(): { equipeId: number; nome: string; totalPontos: number }[] {
  const s = load();
  const map = new Map<number, number>();
  for (const r of s.resultados) {
    map.set(r.equipeId, (map.get(r.equipeId) || 0) + r.pontos);
  }
  const ranking = s.equipes.map((e) => ({
    equipeId: e.id,
    nome: e.nome,
    totalPontos: map.get(e.id) || 0,
  }));
  ranking.sort((a, b) => b.totalPontos - a.totalPontos);
  return ranking;
}
