import { useState, useMemo, useEffect } from "react";
import { BarChart3, Medal } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import {
  getRankingGeral, getEsportes, getEquipes, getParticipantes, getParticipacoes, getResultados, setResultado,
  type Esporte,
} from "@/lib/store";

export default function RelatoriosPage() {
  const [selectedEsporteId, setSelectedEsporteId] = useState<number | null>(null);
  const [ranking, setRanking] = useState<{ equipeId: number; nome: string; totalPontos: number }[]>([]);
  const [esportes, setEsportes] = useState<Esporte[]>([]);
  const [equipes, setEquipes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [, setTick] = useState(0);
  const forceRefresh = () => setTick((t) => t + 1);

  // Carrega dados ao montar
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const [rankingData, esportesData, equipesData] = await Promise.all([
        getRankingGeral(),
        getEsportes(),
        getEquipes(),
      ]);
      setRanking(rankingData);
      setEsportes(esportesData);
      setEquipes(equipesData);
      setLoading(false);
    };
    loadData();
  }, []);

  const selectedEsporte = esportes.find((e) => e.id === selectedEsporteId) || null;

  const esporteData = useMemo(() => {
    if (!selectedEsporte) return [];
    // esporteData precisa ser calculado async, mas como useMemo não suporta async,
    // isso será feito em um useEffect separado
    return [];
  }, [selectedEsporte, equipes]);

  const [esporteDataState, setEsporteDataState] = useState<any[]>([]);

  useEffect(() => {
    if (!selectedEsporte) {
      setEsporteDataState([]);
      return;
    }

    const loadEsporteData = async () => {
      const parts = await getParticipacoes(selectedEsporte.id);
      const allParts = await getParticipantes();
      const results = await getResultados();
      const byEquipe = new Map<number, { equipeNome: string; participantes: string[]; pontos: number; resultadoId?: number }>();

      for (const p of parts) {
        const pName = allParts.find((x) => x.id === p.participanteId)?.nome || "—";
        const eqName = equipes.find((x) => x.id === p.equipeId)?.nome || "—";
        if (!byEquipe.has(p.equipeId)) {
          const res = results.find((r) => r.equipeId === p.equipeId && r.esporteId === selectedEsporte.id);
          byEquipe.set(p.equipeId, { equipeNome: eqName, participantes: [], pontos: res?.pontos || 0, resultadoId: res?.id });
        }
        byEquipe.get(p.equipeId)!.participantes.push(pName);
      }
      setEsporteDataState(Array.from(byEquipe.entries()).map(([eqId, d]) => ({ equipeId: eqId, ...d })));
    };
    loadEsporteData();
  }, [selectedEsporte, equipes]);

  const [editingPontos, setEditingPontos] = useState<Map<number, string>>(new Map());

  const handlePontosChange = (equipeId: number, value: string) => {
    setEditingPontos((prev) => new Map(prev).set(equipeId, value));
  };

  const handlePontosSave = async (equipeId: number) => {
    const val = editingPontos.get(equipeId);
    if (val === undefined || !selectedEsporte) return;
    await setResultado(equipeId, selectedEsporte.id, parseInt(val) || 0);
    setEditingPontos((prev) => { const n = new Map(prev); n.delete(equipeId); return n; });
    forceRefresh();
    // Recarrega ranking
    const newRanking = await getRankingGeral();
    setRanking(newRanking);
  };

  const getMedalColor = (pos: number) => {
    if (pos === 0) return "text-yellow-500";
    if (pos === 1) return "text-gray-400";
    if (pos === 2) return "text-amber-700";
    return "text-muted-foreground";
  };

  return (
    <div>
      <PageHeader icon={BarChart3} title="Relatórios" subtitle="Ranking geral e relatórios por esporte" />

      {loading && <p className="text-center text-muted-foreground py-8">Carregando...</p>}

      {!loading && (
        <>
          {/* Ranking Geral */}
          <div className="mb-10">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Medal className="w-5 h-5 text-primary" /> Ranking Geral
            </h3>
            <div className="card-styled overflow-hidden">
              <table className="table-modern">
                <thead><tr><th className="w-16">Pos.</th><th>Equipe</th><th className="text-right">Pontos</th></tr></thead>
                <tbody>
                  {ranking.length === 0 && (
                    <tr><td colSpan={3} className="text-center py-8 text-muted-foreground">Nenhum resultado registrado</td></tr>
                  )}
                  {ranking.map((r, i) => (
                    <tr key={r.equipeId}>
                      <td>
                        <span className={`font-bold text-lg ${getMedalColor(i)}`}>
                          {i < 3 ? "🏅" : ""} {i + 1}º
                        </span>
                      </td>
                      <td className="font-semibold">{r.nome}</td>
                      <td className="text-right font-bold text-lg">{r.totalPontos}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Relatório por Esporte */}
          <div>
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-primary" /> Relatório por Esporte
            </h3>

            <div className="mb-4 max-w-sm">
              <select className="form-input-styled" value={selectedEsporteId || ""} onChange={(e) => { setSelectedEsporteId(Number(e.target.value) || null); setEditingPontos(new Map()); }}>
                <option value="">— Selecione um esporte —</option>
                {esportes.map((e) => <option key={e.id} value={e.id}>{e.nome} ({e.modalidade})</option>)}
              </select>
            </div>

            {selectedEsporte && (
              <div>
                <div className="card-styled p-5 mb-4">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                    <div><span className="text-muted-foreground">Nome:</span> <strong>{selectedEsporte.nome}</strong></div>
                    <div><span className="text-muted-foreground">Modalidade:</span> <strong>{selectedEsporte.modalidade}</strong></div>
                    <div><span className="text-muted-foreground">Data:</span> <strong>{selectedEsporte.data}</strong></div>
                    <div><span className="text-muted-foreground">Horário:</span> <strong>{selectedEsporte.horario}</strong></div>
                  </div>
                </div>

                <div className="card-styled overflow-hidden">
                  <table className="table-modern">
                    <thead><tr><th>Equipe</th><th>Participantes</th><th className="text-right">Pontuação</th></tr></thead>
                    <tbody>
                      {esporteDataState.length === 0 && (
                        <tr><td colSpan={3} className="text-center py-6 text-muted-foreground">Nenhum participante neste esporte</td></tr>
                      )}
                      {esporteDataState.map((d) => (
                        <tr key={d.equipeId}>
                          <td className="font-semibold">{d.equipeNome}</td>
                          <td className="text-sm">{d.participantes.join(", ")}</td>
                          <td className="text-right">
                            <div className="flex items-center gap-2 justify-end">
                              <input type="number" min="0"
                                className="w-20 px-2 py-1 rounded border border-border text-right text-sm bg-card focus:outline-none focus:ring-1 focus:ring-primary"
                                value={editingPontos.has(d.equipeId) ? editingPontos.get(d.equipeId) : d.pontos}
                                onChange={(e) => handlePontosChange(d.equipeId, e.target.value)}
                                onBlur={() => handlePontosSave(d.equipeId)}
                                onKeyDown={(e) => { if (e.key === "Enter") handlePontosSave(d.equipeId); }}
                              />
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
        </>
      )}
    </div>
  );
}
