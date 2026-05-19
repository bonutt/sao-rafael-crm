import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useMedicosStore } from "@/store";
import { initials } from "@/utils/formatters";
import { StatusBadge } from "@/components/ui-shared/StatusBadge";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/equipe")({
  head: () => ({ meta: [{ title: "Equipe Médica — Hospital São Rafael" }] }),
  component: Equipe,
});

const statusCor = (s: string) => s === "online" ? "green" : s === "ausente" ? "amber" : "gray";

function Bar({ label, value, color = "#B8962E" }: any) {
  return (
    <div>
      <div className="flex justify-between text-xs mb-1"><span className="text-muted-foreground">{label}</span><span className="font-medium">{value}%</span></div>
      <div className="h-2 rounded-full" style={{ background: "#F0EAD8" }}>
        <div className="h-full rounded-full" style={{ width: `${value}%`, background: color }} />
      </div>
    </div>
  );
}

function Equipe() {
  const { medicos, add, remove } = useMedicosStore();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ nome: "", crm: "", especialidade: "", email: "" });

  function salvar() {
    if (!form.nome || !form.crm || !form.especialidade || !form.email) {
      toast.error("Preencha todos os campos");
      return;
    }
    if (medicos.some(m => m.email === form.email)) { toast.error("E-mail já cadastrado"); return; }
    if (medicos.some(m => m.crm === form.crm)) { toast.error("CRM já cadastrado"); return; }
    add({
      id: `m${Date.now()}`,
      nome: form.nome, crm: form.crm, especialidade: form.especialidade, email: form.email,
      statusOnline: "offline", ocupacao: 0, consultasHoje: 0, nps: 80,
    });
    toast.success("Médico cadastrado");
    setOpen(false);
    setForm({ nome: "", crm: "", especialidade: "", email: "" });
  }

  function excluir(id: string, nome: string) {
    if (!confirm(`Remover ${nome} da equipe?`)) return;
    remove(id);
    toast.success("Médico removido");
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap justify-between items-center gap-3">
        <h2 className="font-serif text-2xl">Equipe Médica</h2>
        <button onClick={() => setOpen(true)} className="inline-flex items-center gap-2 px-4 py-2 rounded-md text-sm text-white" style={{ background: "#B8962E" }}>
          <Plus size={16} /> Novo médico
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {medicos.map(m => (
          <div key={m.id} className="bg-card rounded-lg p-5 border" style={{ borderColor: "#E8DFC8", borderTop: "3px solid #B8962E" }}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-14 h-14 rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0" style={{ background: "#B8962E" }}>{initials(m.nome)}</div>
              <div className="min-w-0 flex-1">
                <div className="font-medium truncate">{m.nome}</div>
                <div className="text-xs text-muted-foreground">{m.crm}</div>
                <div className="text-xs truncate">{m.especialidade}</div>
              </div>
              <StatusBadge color={statusCor(m.statusOnline) as any}>{m.statusOnline}</StatusBadge>
            </div>
            <div className="space-y-3">
              <Bar label="Ocupação" value={m.ocupacao} />
              <Bar label="Satisfação (NPS)" value={m.nps} color="#2D7A4F" />
              <Bar label="Ociosidade" value={100 - m.ocupacao} color="#B87820" />
              <div className="flex justify-between items-center pt-2">
                <div className="text-sm text-muted-foreground">Consultas hoje: <span className="font-medium text-foreground">{m.consultasHoje}</span></div>
                <button onClick={() => excluir(m.id, m.nome)} className="p-1.5 rounded hover:bg-destructive/10 text-destructive" title="Remover"><Trash2 size={14} /></button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-card rounded-lg p-5 border" style={{ borderColor: "#E8DFC8" }}>
        <h3 className="font-serif text-lg mb-4">Ranking de performance</h3>
        <div className="space-y-3">
          {[...medicos].sort((a, b) => b.nps - a.nps).map(m => (
            <div key={m.id} className="flex items-center gap-3">
              <div className="w-32 text-sm font-medium truncate">{m.nome}</div>
              <div className="flex-1 h-3 rounded-full" style={{ background: "#F0EAD8" }}>
                <div className="h-full rounded-full" style={{ width: `${m.nps}%`, background: "#B8962E" }} />
              </div>
              <div className="text-sm w-10 text-right">{m.nps}</div>
            </div>
          ))}
        </div>
      </div>

      {open && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={() => setOpen(false)}>
          <div className="bg-card modal-top rounded-lg w-full max-w-md p-6" onClick={e => e.stopPropagation()}>
            <h3 className="font-serif text-xl mb-4">Cadastrar Médico</h3>
            <div className="space-y-3">
              <input placeholder="Nome completo" value={form.nome} onChange={e => setForm({ ...form, nome: e.target.value })} className="w-full border rounded-md px-3 py-2 text-sm" style={{ borderColor: "#E8DFC8" }} />
              <input placeholder="CRM (ex: CRM-SP 123456)" value={form.crm} onChange={e => setForm({ ...form, crm: e.target.value })} className="w-full border rounded-md px-3 py-2 text-sm" style={{ borderColor: "#E8DFC8" }} />
              <select value={form.especialidade} onChange={e => setForm({ ...form, especialidade: e.target.value })} className="w-full border rounded-md px-3 py-2 text-sm bg-card" style={{ borderColor: "#E8DFC8" }}>
                <option value="">Selecione a especialidade</option>
                {["Dermatologista", "Cirurgião Plástico", "Esteticista", "Clínico Geral", "Cardiologista"].map(e => <option key={e}>{e}</option>)}
              </select>
              <input placeholder="E-mail" type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="w-full border rounded-md px-3 py-2 text-sm" style={{ borderColor: "#E8DFC8" }} />
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
