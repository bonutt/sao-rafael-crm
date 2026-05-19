import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useAgendamentosStore, usePacientesStore, useMedicosStore } from "@/store";
import { StatusBadge, statusAgendamentoColor } from "@/components/ui-shared/StatusBadge";
import { Plus, ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/agendamentos")({
  head: () => ({ meta: [{ title: "Agendamentos — Hospital São Rafael" }] }),
  component: AgendamentosPage,
});

const procedimentos = ["Botox", "Preenchimento", "Limpeza de pele", "Peeling", "Laser", "Consulta avaliação", "Rinoplastia"];
const slots = Array.from({ length: 20 }, (_, i) => {
  const total = 8 * 60 + i * 30;
  return `${String(Math.floor(total / 60)).padStart(2, "0")}:${String(total % 60).padStart(2, "0")}`;
});

function AgendamentosPage() {
  const { agendamentos, add, update } = useAgendamentosStore();
  const pacientes = usePacientesStore(s => s.pacientes);
  const medicos = useMedicosStore(s => s.medicos);
  const today = new Date();
  const [view, setView] = useState({ y: today.getFullYear(), m: today.getMonth() });
  const [selected, setSelected] = useState(today.toISOString().slice(0, 10));
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ pacienteId: "", medicoId: "m1", procedimento: "Botox", data: today.toISOString().slice(0, 10), horario: "" });

  const dias = useMemo(() => {
    const last = new Date(view.y, view.m + 1, 0).getDate();
    const start = new Date(view.y, view.m, 1).getDay();
    return { last, start };
  }, [view]);

  const porDia = useMemo(() => {
    const map: Record<number, number> = {};
    agendamentos.forEach(a => {
      const d = new Date(a.data);
      if (d.getMonth() === view.m && d.getFullYear() === view.y) {
        map[d.getDate()] = (map[d.getDate()] || 0) + 1;
      }
    });
    return map;
  }, [agendamentos, view]);

  const doDia = useMemo(() => {
    return agendamentos
      .filter(a => a.data.slice(0, 10) === selected)
      .sort((a, b) => a.horario.localeCompare(b.horario));
  }, [agendamentos, selected]);

  const horariosOcupados = useMemo(() =>
    new Set(agendamentos.filter(a => a.data.slice(0, 10) === form.data && a.medicoId === form.medicoId).map(a => a.horario)),
    [agendamentos, form.data, form.medicoId]);

  function salvar() {
    if (!form.pacienteId || !form.horario) { toast.error("Selecione paciente e horário"); return; }
    const pac = pacientes.find(p => p.id === form.pacienteId)!;
    const med = medicos.find(m => m.id === form.medicoId)!;
    add({
      id: `a${Date.now()}`, pacienteId: pac.id, pacienteNome: pac.nome,
      medicoId: med.id, medicoNome: med.nome, procedimento: form.procedimento,
      data: new Date(form.data).toISOString(), horario: form.horario, status: "agendado",
    });
    toast.success("Agendamento criado");
    setOpen(false);
  }

  const meses = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="font-serif text-2xl">Agenda</h2>
        <button onClick={() => setOpen(true)} className="inline-flex items-center gap-2 px-4 py-2 rounded-md text-sm text-white" style={{ background: "#B8962E" }}>
          <Plus size={16} /> Novo agendamento
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card rounded-lg p-5 border" style={{ borderColor: "#E8DFC8" }}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-serif text-lg">{meses[view.m]} {view.y}</h3>
            <div className="flex gap-1">
              <button onClick={() => setView(v => v.m === 0 ? { y: v.y - 1, m: 11 } : { ...v, m: v.m - 1 })} className="p-1.5 rounded hover:bg-muted"><ChevronLeft size={16} /></button>
              <button onClick={() => setView(v => v.m === 11 ? { y: v.y + 1, m: 0 } : { ...v, m: v.m + 1 })} className="p-1.5 rounded hover:bg-muted"><ChevronRight size={16} /></button>
            </div>
          </div>
          <div className="grid grid-cols-7 gap-1 text-xs text-center text-muted-foreground mb-2">
            {["D", "S", "T", "Q", "Q", "S", "S"].map((d, i) => <div key={i}>{d}</div>)}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {Array.from({ length: dias.start }).map((_, i) => <div key={`e${i}`} />)}
            {Array.from({ length: dias.last }, (_, i) => i + 1).map(d => {
              const dateStr = `${view.y}-${String(view.m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
              const isSel = selected === dateStr;
              const count = porDia[d];
              return (
                <button key={d} onClick={() => setSelected(dateStr)}
                  className="aspect-square rounded-md text-sm flex flex-col items-center justify-center transition-colors"
                  style={{
                    background: isSel ? "#B8962E" : "transparent",
                    color: isSel ? "white" : undefined,
                    border: "1px solid #F0EAD8",
                  }}>
                  <span>{d}</span>
                  {count && <span className="w-1 h-1 rounded-full mt-0.5" style={{ background: isSel ? "white" : "#B8962E" }} />}
                </button>
              );
            })}
          </div>
        </div>

        <div className="bg-card rounded-lg p-5 border" style={{ borderColor: "#E8DFC8" }}>
          <h3 className="font-serif text-lg mb-4">Consultas do dia</h3>
          <div className="space-y-2 max-h-[400px] overflow-y-auto">
            {doDia.length === 0 && <div className="text-sm text-muted-foreground py-8 text-center">Sem agendamentos para este dia.</div>}
            {doDia.map(a => (
              <div key={a.id} className="flex items-center gap-3 p-3 rounded-md border" style={{ borderColor: "#F0EAD8" }}>
                <div className="text-sm font-semibold w-14 flex-shrink-0" style={{ color: "#B8962E" }}>{a.horario}</div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">{a.pacienteNome}</div>
                  <div className="text-xs text-muted-foreground truncate">{a.procedimento} · {a.medicoNome}</div>
                </div>
                <select
                  value={a.status}
                  onChange={(e) => { update(a.id, { status: e.target.value as any }); toast.success("Status atualizado"); }}
                  className="text-xs border rounded px-2 py-1 bg-card"
                  style={{ borderColor: "#E8DFC8" }}
                >
                  {(["agendado","atendido","falta","reagendado","cancelado"] as const).map(s => <option key={s} value={s}>{s}</option>)}
                </select>
                <StatusBadge color={statusAgendamentoColor(a.status)}>{a.status}</StatusBadge>
              </div>
            ))}
          </div>
        </div>
      </div>

      {open && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={() => setOpen(false)}>
          <div className="bg-card modal-top rounded-lg w-full max-w-lg p-6" onClick={e => e.stopPropagation()}>
            <h3 className="font-serif text-xl mb-4">Novo Agendamento</h3>
            <div className="space-y-3">
              <select value={form.pacienteId} onChange={e => setForm({ ...form, pacienteId: e.target.value })} className="w-full border rounded-md px-3 py-2 text-sm bg-card" style={{ borderColor: "#E8DFC8" }}>
                <option value="">Selecione o paciente</option>
                {pacientes.map(p => <option key={p.id} value={p.id}>{p.nome}</option>)}
              </select>
              <div className="grid grid-cols-2 gap-3">
                <select value={form.medicoId} onChange={e => setForm({ ...form, medicoId: e.target.value })} className="border rounded-md px-3 py-2 text-sm bg-card" style={{ borderColor: "#E8DFC8" }}>
                  {medicos.map(m => <option key={m.id} value={m.id}>{m.nome}</option>)}
                </select>
                <select value={form.procedimento} onChange={e => setForm({ ...form, procedimento: e.target.value })} className="border rounded-md px-3 py-2 text-sm bg-card" style={{ borderColor: "#E8DFC8" }}>
                  {procedimentos.map(p => <option key={p}>{p}</option>)}
                </select>
              </div>
              <input type="date" value={form.data} onChange={e => setForm({ ...form, data: e.target.value, horario: "" })} className="w-full border rounded-md px-3 py-2 text-sm" style={{ borderColor: "#E8DFC8" }} />
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Horário disponível</label>
                <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
                  {slots.map(s => {
                    const ocupado = horariosOcupados.has(s);
                    const sel = form.horario === s;
                    return (
                      <button key={s} type="button" disabled={ocupado} onClick={() => setForm({ ...form, horario: s })}
                        className="text-xs py-1.5 rounded border transition-colors"
                        style={{
                          background: sel ? "#B8962E" : ocupado ? "#EDE9DF" : "white",
                          color: sel ? "white" : ocupado ? "#9E9785" : "#3D3520",
                          borderColor: "#E8DFC8",
                          cursor: ocupado ? "not-allowed" : "pointer",
                        }}>{s}</button>
                    );
                  })}
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-5">
              <button onClick={() => setOpen(false)} className="px-4 py-2 text-sm rounded-md border" style={{ borderColor: "#E8DFC8" }}>Cancelar</button>
              <button onClick={salvar} className="px-4 py-2 text-sm rounded-md text-white" style={{ background: "#B8962E" }}>Salvar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
