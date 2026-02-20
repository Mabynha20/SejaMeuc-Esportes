import { useState, useCallback } from "react";
import { Trophy, Plus, Pencil, Trash2, UserPlus, X, Check } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import {
  getEsportes, addEsporte, updateEsporte, deleteEsporte,
  getEquipes, getParticipantes, getParticipacoes, addParticipacoes, removeParticipacao,
  type Esporte, type Equipe, type Participante, type Participacao,
} from "@/lib/store";

export default function EsportesPage() {
  const [esportes, setEsportes] = useState<Esporte[]>(getEsportes);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [modalidade, setModalidade] = useState<"Individual" | "Coletivo">("Individual");
  const [nome, setNome] = useState("");
  const [data, setData] = useState("");
  const [horario, setHorario] = useState("");
  const [error, setError] = useState("");

  // Manage participants
  const [managingEsporte, setManagingEsporte] = useState<Esporte | null>(null);
  const [selectedEquipeId, setSelectedEquipeId] = useState<number | null>(null);
  const [equipes, setEquipes] = useState<Equipe[]>([]);
  const [equipeParts, setEquipeParts] = useState<Participante[]>([]);
  const [checked, setChecked] = useState<Set<number>>(new Set());
  const [participacoes, setParticipacoes] = useState<(Participacao & { partNome: string; equipeNome: string })[]>([]);

  const refresh = useCallback(() => setEsportes(getEsportes()), []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); setError("");
    if (!nome.trim() || !data || !horario.trim()) { setError("Preencha todos os campos."); return; }
    if (editingId) {
      const err = updateEsporte(editingId, modalidade, nome.trim(), data, horario.trim());
      if (err) { setError(err); return; }
    } else {
      const res = addEsporte(modalidade, nome.trim(), data, horario.trim());
      if (typeof res === "string") { setError(res); return; }
    }
    setShowForm(false); setEditingId(null); resetForm(); refresh();
  };

  const resetForm = () => { setNome(""); setData(""); setHorario(""); setModalidade("Individual"); };

  const handleEdit = (esp: Esporte) => {
    setEditingId(esp.id); setNome(esp.nome); setData(esp.data); setHorario(esp.horario); setModalidade(esp.modalidade); setShowForm(true);
  };

  const handleDelete = (id: number) => {
    if (confirm("Excluir esporte?")) { deleteEsporte(id); refresh(); if (managingEsporte?.id === id) setManagingEsporte(null); }
  };

  const openManage = (esp: Esporte) => {
    setManagingEsporte(esp);
    const eqs = getEquipes(); setEquipes(eqs);
    setSelectedEquipeId(null); setEquipeParts([]); setChecked(new Set());
    refreshParticipacoes(esp.id);
  };

  const refreshParticipacoes = (esporteId: number) => {
    const parts = getParticipacoes(esporteId);
    const allParts = getParticipantes();
    const allEquipes = getEquipes();
    setParticipacoes(parts.map((p) => ({
      ...p,
      partNome: allParts.find((x) => x.id === p.participanteId)?.nome || "—",
      equipeNome: allEquipes.find((x) => x.id === p.equipeId)?.nome || "—",
    })));
  };

  const handleSelectEquipe = (eqId: number) => {
    setSelectedEquipeId(eqId);
    setEquipeParts(getParticipantes(eqId));
    setChecked(new Set());
  };

  const toggleCheck = (id: number) => {
    setChecked((prev) => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });
  };

  const handleSaveParticipantes = () => {
    if (!managingEsporte || checked.size === 0) return;
    addParticipacoes(managingEsporte.id, Array.from(checked));
    setChecked(new Set());
    refreshParticipacoes(managingEsporte.id);
  };

  const handleRemoveParticipacao = (id: number) => {
    removeParticipacao(id);
    if (managingEsporte) refreshParticipacoes(managingEsporte.id);
  };

  return (
    <div>
      <PageHeader icon={Trophy} title="Esportes" subtitle="Cadastre esportes e gerencie participantes" />

      {!showForm && (
        <button onClick={() => { setShowForm(true); setEditingId(null); resetForm(); setError(""); }}
          className="btn-gold flex items-center gap-2 mb-6">
          <Plus className="w-4 h-4" /> Novo Esporte
        </button>
      )}

      {showForm && (
        <div className="card-styled p-6 mb-6 max-w-lg">
          <h3 className="text-lg font-semibold mb-4">{editingId ? "Editar Esporte" : "Novo Esporte"}</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Modalidade *</label>
              <select className="form-input-styled" value={modalidade} onChange={(e) => setModalidade(e.target.value as any)}>
                <option value="Individual">Individual</option>
                <option value="Coletivo">Coletivo</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Nome do Esporte *</label>
              <input className="form-input-styled" value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Ex: Futebol" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Data *</label>
                <input type="date" className="form-input-styled" value={data} onChange={(e) => setData(e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Horário *</label>
                <input type="time" className="form-input-styled" value={horario} onChange={(e) => setHorario(e.target.value)} />
              </div>
            </div>
            {error && <p className="text-destructive text-sm">{error}</p>}
            <div className="flex gap-3">
              <button type="submit" className="btn-gold">{editingId ? "Salvar" : "Cadastrar"}</button>
              <button type="button" onClick={() => { setShowForm(false); setEditingId(null); }} className="btn-navy">Cancelar</button>
            </div>
          </form>
        </div>
      )}

      <div className="card-styled overflow-hidden">
        <table className="table-modern">
          <thead>
            <tr>
              <th>Modalidade</th><th>Nome</th><th>Data</th><th>Horário</th><th className="text-right">Ações</th>
            </tr>
          </thead>
          <tbody>
            {esportes.length === 0 && (
              <tr><td colSpan={5} className="text-center py-8 text-muted-foreground">Nenhum esporte cadastrado</td></tr>
            )}
            {esportes.map((esp) => (
              <tr key={esp.id}>
                <td><span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold ${esp.modalidade === "Coletivo" ? "bg-primary/15 text-primary" : "bg-secondary/15 text-secondary"}`}>{esp.modalidade}</span></td>
                <td className="font-medium">{esp.nome}</td>
                <td>{esp.data}</td>
                <td>{esp.horario}</td>
                <td className="text-right">
                  <div className="flex gap-2 justify-end">
                    <button onClick={() => openManage(esp)} className="btn-navy text-xs flex items-center gap-1 !px-3 !py-1.5">
                      <UserPlus className="w-3.5 h-3.5" /> Participantes
                    </button>
                    <button onClick={() => handleEdit(esp)} className="p-2 rounded-lg hover:bg-primary/10 transition-colors text-primary">
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(esp.id)} className="p-2 rounded-lg hover:bg-destructive/10 transition-colors text-destructive">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Manage Participants Panel */}
      {managingEsporte && (
        <div className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-primary" /> Participantes — {managingEsporte.nome}
            </h3>
            <button onClick={() => setManagingEsporte(null)} className="p-2 rounded-lg hover:bg-muted transition-colors"><X className="w-5 h-5" /></button>
          </div>

          {/* Select equipe + checkboxes */}
          <div className="card-styled p-5 mb-4">
            <div className="flex flex-wrap gap-4 items-end mb-4">
              <div className="flex-1 min-w-[200px]">
                <label className="block text-sm font-medium mb-1">Selecionar Equipe</label>
                <select className="form-input-styled" value={selectedEquipeId || ""} onChange={(e) => handleSelectEquipe(Number(e.target.value))}>
                  <option value="">— Selecione —</option>
                  {equipes.map((eq) => <option key={eq.id} value={eq.id}>{eq.nome}</option>)}
                </select>
              </div>
              <button onClick={handleSaveParticipantes} disabled={checked.size === 0} className="btn-gold flex items-center gap-2 disabled:opacity-40">
                <Check className="w-4 h-4" /> Salvar Selecionados
              </button>
            </div>

            {selectedEquipeId && equipeParts.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                {equipeParts.map((p) => {
                  const alreadyAdded = participacoes.some((pp) => pp.participanteId === p.id);
                  return (
                    <label key={p.id} className={`flex items-center gap-2 p-2.5 rounded-lg border transition-colors cursor-pointer ${
                      alreadyAdded ? "bg-muted/50 border-border opacity-60" : checked.has(p.id) ? "bg-primary/10 border-primary" : "border-border hover:bg-muted/30"
                    }`}>
                      <input type="checkbox" disabled={alreadyAdded} checked={checked.has(p.id) || alreadyAdded}
                        onChange={() => toggleCheck(p.id)} className="accent-primary w-4 h-4" />
                      <span className="text-sm">{p.nome}</span>
                      {alreadyAdded && <span className="text-[10px] text-muted-foreground ml-auto">já adicionado</span>}
                    </label>
                  );
                })}
              </div>
            )}
            {selectedEquipeId && equipeParts.length === 0 && (
              <p className="text-sm text-muted-foreground">Nenhum membro nesta equipe.</p>
            )}
          </div>

          {/* Current participants */}
          <div className="card-styled overflow-hidden">
            <table className="table-modern">
              <thead><tr><th>Participante</th><th>Equipe</th><th className="text-right">Ações</th></tr></thead>
              <tbody>
                {participacoes.length === 0 && (
                  <tr><td colSpan={3} className="text-center py-6 text-muted-foreground">Nenhum participante vinculado</td></tr>
                )}
                {participacoes.map((p) => (
                  <tr key={p.id}>
                    <td className="font-medium">{p.partNome}</td>
                    <td>{p.equipeNome}</td>
                    <td className="text-right">
                      <button onClick={() => handleRemoveParticipacao(p.id)} className="btn-danger text-xs flex items-center gap-1 ml-auto">
                        <Trash2 className="w-3.5 h-3.5" /> Remover
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
