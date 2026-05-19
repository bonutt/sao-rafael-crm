import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useLeadsStore, usePacientesStore } from "@/store";
import { StatusBadge, statusLeadColor } from "@/components/ui-shared/StatusBadge";
import { tempoDesde, maskPhone } from "@/utils/formatters";
import { Instagram, Facebook, MessageCircle, AlertTriangle, Plus } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/leads")({
  head: () => ({ meta: [{ title: "Leads — Hospital São Rafael" }] }),
  component: LeadsPage,
});

const canalStyle: Record<string, { bg: string; label: string; icon?: any }> = {
  instagram: { bg: "linear-gradient(135deg,#F58529,#DD2A7B,#8134AF)", label: "Instagram", icon: Instagram },
  facebook: { bg: "#1877F2", label: "Facebook", icon: Facebook },
  google: { bg: "#DB4437", label: "Google" },
  tiktok: { bg: "#000000", label: "TikTok" },
  whatsapp: { bg: "#25D366", label: "WhatsApp", icon: MessageCircle },
  indicacao: { bg: "#8B6E1C", label: "Indicação" },
};

function CanalBadge({ canal }: { canal: string }) {
  const s = canalStyle[canal];
  const Icon = s?.icon;
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs text-white font-medium" style={{ background: s.bg }}>
      {Icon && <Icon size={12} />}{s.label}
    </span>
  );
}

function LeadsPage() {
  const { leads, add, update } = useLeadsStore();
  const addPaciente = usePacientesStore((s) => s.add);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ nome: "", telefone: "", canal: "instagram", interesse: "" });

  const funil = useMemo(() => ({
    novo: leads.filter(l => l.status === "novo").length,
    qualificando: leads.filter(l => l.status === "qualificando").length,
    proposta: leads.filter(l => l.status === "proposta").length,
    convertido: leads.filter(l => l.status === "convertido").length,
  }), [leads]);

  const totalFunil = Math.max(funil.novo + funil.qualificando + funil.proposta + funil.convertido, 1);

  function criarLead() {
    if (!form.nome || !form.telefone) { toast.error("Preencha nome e telefone"); return; }
    const dup = leads.some(l => l.telefone === form.telefone);
    if (dup) { toast.error("Telefone já cadastrado"); return; }
    add({
      id: `l${Date.now()}`,
      nome: form.nome, telefone: form.telefone,
      canal: form.canal as any, interesse: form.interesse,
      status: "novo", atendenteId: "u2", atendenteNome: "Paula Souza",
      createdAt: new Date().toISOString(),
    });
    toast.success("Lead criado com sucesso");
    setOpen(false); setForm({ nome: "", telefone: "", canal: "instagram", interesse: "" });
  }

  function converter(id: string) {
    const lead = leads.find(l => l.id === id);
    if (!lead) return;
    addPaciente({
      id: `p${Date.now()}`, nome: lead.nome, cpf: "", email: "",
      telefone: lead.telefone, dataNascimento: "", planoSaude: "Particular",
      alergias: "", historicoClinico: "", status: "ativo", createdAt: new Date().toISOString(),
    });
    update(id, { status: "convertido" });
    toast.success(`${lead.nome} convertido em paciente`);
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="font-serif text-2xl">Funil de Leads</h2>
        <button onClick={() => setOpen(true)} className="inline-flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium text-white" style={{ background: "#B8962E" }}>
          <Plus size={16} /> Novo lead
        </button>
      </div>

      {/* Funil */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {([
          ["Novo", funil.novo, "#2558A8"],
          ["Qualificando", funil.qualificando, "#B87820"],
          ["Proposta", funil.proposta, "#B8962E"],
          ["Convertido", funil.convertido, "#2D7A4F"],
        ] as const).map(([label, val, color]) => (
          <div key={label} className="bg-card rounded-lg p-4 border" style={{ borderColor: "#E8DFC8", borderTop: `3px solid ${color}` }}>
            <div className="text-xs uppercase text-muted-foreground tracking-wider">{label}</div>
            <div className="text-2xl font-serif mt-1">{val}</div>
            <div className="h-1.5 rounded mt-2" style={{ background: "#F0EAD8" }}>
              <div className="h-full rounded" style={{ width: `${(val/totalFunil)*100}%`, background: color }} />
            </div>
          </div>
        ))}
      </div>

      {/* Tabela */}
      <div className="bg-card rounded-lg border overflow-hidden" style={{ borderColor: "#E8DFC8" }}>
        <table className="w-full text-sm">
          <thead style={{ background: "#FDFAF4" }}>
            <tr className="text-left text-xs uppercase text-muted-foreground">
              <th className="px-4 py-3">Nome</th>
              <th className="px-4 py-3">Telefone</th>
              <th className="px-4 py-3">Canal</th>
              <th className="px-4 py-3">Interesse</th>
              <th className="px-4 py-3">Atendente</th>
              <th className="px-4 py-3">Tempo</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Ações</th>
            </tr>
          </thead>
          <tbody>
            {leads.map(l => {
              const horas = (Date.now() - new Date(l.createdAt).getTime()) / 3.6e6;
              const semContato = horas > 24 && l.status === "novo";
              return (
                <tr key={l.id} className="border-t" style={{ borderColor: "#F0EAD8" }}>
                  <td className="px-4 py-3 font-medium flex items-center gap-2">
                    {semContato && <AlertTriangle size={14} className="text-[#B83228]" />}
                    {l.nome}
                  </td>
                  <td className="px-4 py-3">{l.telefone}</td>
                  <td className="px-4 py-3"><CanalBadge canal={l.canal} /></td>
                  <td className="px-4 py-3">{l.interesse}</td>
                  <td className="px-4 py-3 text-muted-foreground">{l.atendenteNome}</td>
                  <td className="px-4 py-3 text-muted-foreground">{tempoDesde(l.createdAt)}</td>
                  <td className="px-4 py-3"><StatusBadge color={statusLeadColor(l.status)}>{l.status}</StatusBadge></td>
                  <td className="px-4 py-3">
                    {(l.status === "proposta" || l.status === "qualificando") && (
                      <button onClick={() => converter(l.id)} className="text-xs px-2 py-1 rounded text-white" style={{ background: "#2D7A4F" }}>
                        Converter
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {open && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4" onClick={() => setOpen(false)}>
          <div className="bg-card rounded-lg modal-top w-full max-w-md p-6" onClick={(e) => e.stopPropagation()}>
            <h3 className="font-serif text-xl mb-4">Novo Lead</h3>
            <div className="space-y-3">
              <input placeholder="Nome" value={form.nome} onChange={e => setForm({ ...form, nome: e.target.value })} className="w-full border rounded-md px-3 py-2 text-sm" style={{ borderColor: "#E8DFC8" }} />
              <input placeholder="Telefone" value={form.telefone} onChange={e => setForm({ ...form, telefone: maskPhone(e.target.value) })} className="w-full border rounded-md px-3 py-2 text-sm" style={{ borderColor: "#E8DFC8" }} />
              <select value={form.canal} onChange={e => setForm({ ...form, canal: e.target.value })} className="w-full border rounded-md px-3 py-2 text-sm bg-card" style={{ borderColor: "#E8DFC8" }}>
                {Object.keys(canalStyle).map(k => <option key={k} value={k}>{canalStyle[k].label}</option>)}
              </select>
              <input placeholder="Interesse (ex: Botox)" value={form.interesse} onChange={e => setForm({ ...form, interesse: e.target.value })} className="w-full border rounded-md px-3 py-2 text-sm" style={{ borderColor: "#E8DFC8" }} />
            </div>
            <div className="flex justify-end gap-2 mt-5">
              <button onClick={() => setOpen(false)} className="px-4 py-2 text-sm rounded-md border" style={{ borderColor: "#E8DFC8" }}>Cancelar</button>
              <button onClick={criarLead} className="px-4 py-2 text-sm rounded-md text-white" style={{ background: "#B8962E" }}>Salvar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
