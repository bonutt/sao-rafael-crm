import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { usePacientesStore, useAgendamentosStore } from "@/store";
import { StatusBadge, statusAgendamentoColor } from "@/components/ui-shared/StatusBadge";
import { formatDateTime, initials } from "@/utils/formatters";
import { Plus, Eye, Edit2 } from "lucide-react";

export const Route = createFileRoute("/historico")({
  head: () => ({ meta: [{ title: "Histórico — Hospital São Rafael" }] }),
  component: HistoricoPage,
});

function HistoricoPage() {
  const pacientes = usePacientesStore(s => s.pacientes);
  const agendamentos = useAgendamentosStore(s => s.agendamentos);
  const [pid, setPid] = useState(pacientes[0]?.id ?? "");
  const paciente = pacientes.find(p => p.id === pid);
  const historico = agendamentos.filter(a => a.pacienteId === pid).sort((a, b) => b.data.localeCompare(a.data));

  return (
    <div className="space-y-5">
      <select value={pid} onChange={e => setPid(e.target.value)} className="border rounded-md px-3 py-2 text-sm bg-card" style={{ borderColor: "#E8DFC8" }}>
        {pacientes.map(p => <option key={p.id} value={p.id}>{p.nome}</option>)}
      </select>

      {paciente && (
        <div className="bg-card rounded-lg p-6 border" style={{ borderColor: "#E8DFC8" }}>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full flex items-center justify-center text-white text-xl font-semibold" style={{ background: "#B8962E" }}>
              {initials(paciente.nome)}
            </div>
            <div>
              <h2 className="font-serif text-xl">{paciente.nome}</h2>
              <div className="text-sm text-muted-foreground">{paciente.cpf} · {paciente.email} · {paciente.telefone}</div>
              <div className="text-xs text-muted-foreground mt-1">Plano: {paciente.planoSaude}</div>
            </div>
            <button className="ml-auto inline-flex items-center gap-2 px-4 py-2 rounded-md text-sm text-white" style={{ background: "#B8962E" }}>
              <Plus size={14} /> Novo registro
            </button>
          </div>
        </div>
      )}

      <div className="bg-card rounded-lg p-6 border" style={{ borderColor: "#E8DFC8" }}>
        <h3 className="font-serif text-lg mb-4">Linha do tempo</h3>
        {historico.length === 0 && <div className="text-sm text-muted-foreground">Nenhum atendimento registrado.</div>}
        <div className="relative space-y-5 pl-6">
          <div className="absolute left-2 top-2 bottom-2 w-px" style={{ background: "#E8DFC8" }} />
          {historico.map(h => (
            <div key={h.id} className="relative">
              <div className="absolute -left-[18px] top-2 w-3 h-3 rounded-full" style={{ background: "#B8962E", border: "2px solid #FDFAF4" }} />
              <div className="bg-background rounded-md p-4 border" style={{ borderColor: "#F0EAD8" }}>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium">{h.procedimento}</span>
                  <StatusBadge color={statusAgendamentoColor(h.status)}>{h.status}</StatusBadge>
                </div>
                <div className="text-xs text-muted-foreground">{formatDateTime(h.data)} · {h.medicoNome}</div>
                {h.observacoes && <div className="text-sm mt-2 text-muted-foreground">{h.observacoes}</div>}
                <div className="flex gap-2 mt-2">
                  <button className="text-xs inline-flex items-center gap-1 text-muted-foreground hover:text-foreground"><Eye size={12} /> Detalhes</button>
                  <button className="text-xs inline-flex items-center gap-1 text-muted-foreground hover:text-foreground"><Edit2 size={12} /> Editar</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
