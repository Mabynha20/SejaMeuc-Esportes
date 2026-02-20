import { useState, useCallback } from "react";
import { Users, Plus, Eye, Pencil, Trash2, X, UserPlus } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import {
  getEquipes, addEquipe, updateEquipe, deleteEquipe,
  getParticipantes, addParticipante, updateParticipante, deleteParticipante,
  type Equipe, type Participante,
} from "@/lib/store";

function formatCPF(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `${digits.slice(0, 3)}.${digits.slice(3)}`;
  if (digits.length <= 9) return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}`;
  return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9)}`;
}

export default function EquipesPage() {
  const [equipes, setEquipes] = useState<Equipe[]>(getEquipes);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [nome, setNome] = useState("");
  const [cidade, setCidade] = useState("");
  const [error, setError] = useState("");

  // Members
  const [viewingEquipe, setViewingEquipe] = useState<Equipe | null>(null);
  const [membros, setMembros] = useState<Participante[]>([]);
  const [showMemberForm, setShowMemberForm] = useState(false);
  const [editingMemberId, setEditingMemberId] = useState<number | null>(null);
  const [membroNome, setMembroNome] = useState("");
  const [membroCpf, setMembroCpf] = useState("");
  const [memberError, setMemberError] = useState("");

  const refresh = useCallback(() => setEquipes(getEquipes()), []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!nome.trim() || !cidade.trim()) { setError("Preencha todos os campos."); return; }
    if (editingId) {
      updateEquipe(editingId, nome.trim(), cidade.trim());
    } else {
      addEquipe(nome.trim(), cidade.trim());
    }
    setShowForm(false); setEditingId(null); setNome(""); setCidade(""); refresh();
  };

  const handleEdit = (eq: Equipe) => {
    setEditingId(eq.id); setNome(eq.nome); setCidade(eq.cidade); setShowForm(true);
  };

  const handleDelete = (id: number) => {
    if (confirm("Excluir equipe e todos os seus membros?")) { deleteEquipe(id); refresh(); if (viewingEquipe?.id === id) setViewingEquipe(null); }
  };

  const openMembers = (eq: Equipe) => {
    setViewingEquipe(eq);
    setMembros(getParticipantes(eq.id));
    setShowMemberForm(false);
  };

  const refreshMembers = () => {
    if (viewingEquipe) setMembros(getParticipantes(viewingEquipe.id));
  };

  const handleMemberSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setMemberError("");
    if (!membroNome.trim() || !membroCpf.trim()) { setMemberError("Preencha todos os campos."); return; }
    const cpfClean = membroCpf.replace(/\D/g, "");
    if (cpfClean.length !== 11) { setMemberError("CPF deve ter 11 dígitos."); return; }
    if (editingMemberId) {
      const err = updateParticipante(editingMemberId, membroNome.trim(), cpfClean);
      if (err) { setMemberError(err); return; }
    } else {
      const res = addParticipante(membroNome.trim(), cpfClean, viewingEquipe!.id);
      if (typeof res === "string") { setMemberError(res); return; }
    }
    setShowMemberForm(false); setEditingMemberId(null); setMembroNome(""); setMembroCpf(""); refreshMembers();
  };

  const handleEditMember = (p: Participante) => {
    setEditingMemberId(p.id); setMembroNome(p.nome); setMembroCpf(formatCPF(p.cpf)); setShowMemberForm(true);
  };

  const handleDeleteMember = (id: number) => {
    if (confirm("Excluir participante?")) { deleteParticipante(id); refreshMembers(); }
  };

  return (
    <div>
      <PageHeader icon={Users} title="Equipes" subtitle="Gerencie as equipes e seus membros" />

      {/* Add button */}
      {!showForm && (
        <button onClick={() => { setShowForm(true); setEditingId(null); setNome(""); setCidade(""); setError(""); }}
          className="btn-gold flex items-center gap-2 mb-6">
          <Plus className="w-4 h-4" /> Nova Equipe
        </button>
      )}

      {/* Form */}
      {showForm && (
        <div className="card-styled p-6 mb-6 max-w-lg">
          <h3 className="text-lg font-semibold mb-4">{editingId ? "Editar Equipe" : "Nova Equipe"}</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Nome da Equipe *</label>
              <input className="form-input-styled" value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Nome da equipe" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Cidade *</label>
              <input className="form-input-styled" value={cidade} onChange={(e) => setCidade(e.target.value)} placeholder="Cidade" />
            </div>
            {error && <p className="text-destructive text-sm">{error}</p>}
            <div className="flex gap-3">
              <button type="submit" className="btn-gold">{editingId ? "Salvar" : "Cadastrar"}</button>
              <button type="button" onClick={() => { setShowForm(false); setEditingId(null); }} className="btn-navy">Cancelar</button>
            </div>
          </form>
        </div>
      )}

      {/* Table */}
      <div className="card-styled overflow-hidden">
        <table className="table-modern">
          <thead>
            <tr>
              <th>Nome</th>
              <th>Cidade</th>
              <th className="text-right">Ações</th>
            </tr>
          </thead>
          <tbody>
            {equipes.length === 0 && (
              <tr><td colSpan={3} className="text-center py-8 text-muted-foreground">Nenhuma equipe cadastrada</td></tr>
            )}
            {equipes.map((eq) => (
              <tr key={eq.id}>
                <td className="font-medium">{eq.nome}</td>
                <td>{eq.cidade}</td>
                <td className="text-right">
                  <div className="flex gap-2 justify-end">
                    <button onClick={() => openMembers(eq)} className="btn-navy text-xs flex items-center gap-1 !px-3 !py-1.5">
                      <Eye className="w-3.5 h-3.5" /> Membros
                    </button>
                    <button onClick={() => handleEdit(eq)} className="p-2 rounded-lg hover:bg-primary/10 transition-colors text-primary">
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(eq.id)} className="p-2 rounded-lg hover:bg-destructive/10 transition-colors text-destructive">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Members Panel */}
      {viewingEquipe && (
        <div className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" /> Membros — {viewingEquipe.nome}
            </h3>
            <button onClick={() => setViewingEquipe(null)} className="p-2 rounded-lg hover:bg-muted transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          {!showMemberForm && (
            <button onClick={() => { setShowMemberForm(true); setEditingMemberId(null); setMembroNome(""); setMembroCpf(""); setMemberError(""); }}
              className="btn-gold flex items-center gap-2 mb-4 text-sm">
              <UserPlus className="w-4 h-4" /> Adicionar Membro
            </button>
          )}

          {showMemberForm && (
            <div className="card-styled p-5 mb-4 max-w-lg">
              <form onSubmit={handleMemberSubmit} className="space-y-3">
                <div>
                  <label className="block text-sm font-medium mb-1">Nome *</label>
                  <input className="form-input-styled" value={membroNome} onChange={(e) => setMembroNome(e.target.value)} placeholder="Nome do participante" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">CPF *</label>
                  <input className="form-input-styled" value={membroCpf} onChange={(e) => setMembroCpf(formatCPF(e.target.value))} placeholder="000.000.000-00" />
                </div>
                {memberError && <p className="text-destructive text-sm">{memberError}</p>}
                <div className="flex gap-3">
                  <button type="submit" className="btn-gold text-sm">{editingMemberId ? "Salvar" : "Adicionar"}</button>
                  <button type="button" onClick={() => setShowMemberForm(false)} className="btn-navy text-sm">Cancelar</button>
                </div>
              </form>
            </div>
          )}

          <div className="card-styled overflow-hidden">
            <table className="table-modern">
              <thead><tr><th>Nome</th><th>CPF</th><th className="text-right">Ações</th></tr></thead>
              <tbody>
                {membros.length === 0 && (
                  <tr><td colSpan={3} className="text-center py-6 text-muted-foreground">Nenhum membro cadastrado</td></tr>
                )}
                {membros.map((m) => (
                  <tr key={m.id}>
                    <td className="font-medium">{m.nome}</td>
                    <td>{formatCPF(m.cpf)}</td>
                    <td className="text-right">
                      <div className="flex gap-2 justify-end">
                        <button onClick={() => handleEditMember(m)} className="p-2 rounded-lg hover:bg-primary/10 transition-colors text-primary">
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDeleteMember(m.id)} className="p-2 rounded-lg hover:bg-destructive/10 transition-colors text-destructive">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
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
