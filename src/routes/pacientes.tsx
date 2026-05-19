import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { usePacientesStore } from "@/store";
import { StatusBadge } from "@/components/ui-shared/StatusBadge";
import { initials, maskCPF, maskPhone, formatDate } from "@/utils/formatters";
import { Plus, Search, FileClock, Edit2, Download, Trash2 } from "lucide-react";
import { toast } from "sonner";
import type { Paciente } from "@/types";

export const Route = createFileRoute("/pacientes")({
  head: () => ({ meta: [{ title: "Pacientes — Hospital São Rafael" }] }),
  component: PacientesPage,
});

const avatarColors = ["#B8962E", "#2D7A4F", "#2558A8", "#B87820", "#8B6E1C"];
const emptyForm = { nome: "", cpf: "", email: "", telefone: "", dataNascimento: "", planoSaude: "Particular", alergias: "", historicoClinico: "", status: "ativo" as Paciente["status"] };

function PacientesPage() {
  const { pacientes, add, update, remove } = usePacientesStore();
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);

  const filtrados = useMemo(() => {
    const t = q.toLowerCase();
    return pacientes.filter(p => p.nome.toLowerCase().includes(t) || p.cpf.includes(t));
  }, [pacientes, q]);

  function exportar() {
    const header = "Nome,CPF,Email,Telefone,Plano,Status\n";
    const csv = header + pacientes.map(p => `${p.nome},${p.cpf},${p.email},${p.telefone},${p.planoSaude},${p.status}`).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "pacientes.csv"; a.click();
    toast.success("Exportação iniciada");
  }

  function abrirNovo() {
    setEditId(null);
    setForm(emptyForm);
    setOpen(true);
  }

  function abrirEdit(p: Paciente) {
    setEditId(p.id);
    setForm({
      nome: p.nome, cpf: p.cpf, email: p.email, telefone: p.telefone,
      dataNascimento: p.dataNascimento, planoSaude: p.planoSaude,
      alergias: p.alergias, historicoClinico: p.historicoClinico, status: p.status,
    });
    setOpen(true);
  }

  function salvar() {
    if (!form.nome || !form.cpf || !form.email || !form.telefone) { toast.error("Preencha campos obrigatórios"); return; }
    const dup = pacientes.find(p => p.id !== editId && (p.cpf === form.cpf || p.email === form.email || p.telefone === form.telefone));
    if (dup) { toast.error("CPF, e-mail ou telefone já cadastrado"); return; }
    if (editId) {
      update(editId, form);
      toast.success("Paciente atualizado");
    } else {
      add({ id: `p${Date.now()}`, ...form, createdAt: new Date().toISOString() });
      toast.success("Paciente cadastrado");
    }
    setOpen(false);
    setEditId(null);
    setForm(emptyForm);
  }

  function excluir(p: Paciente) {
    if (!confirm(`Excluir ${p.nome}?`)) return;
    remove(p.id);
    toast.success("Paciente excluído");
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input value={q} onChange={e => setQ(e.target.value)} placeholder="Buscar por nome ou CPF" className="w-full pl-9 pr-3 py-2 rounded-md text-sm border" style={{ borderColor: "#E8DFC8", background: "#FDFAF4" }} />
        </div>
        <div className="ml-auto flex gap-2">
          <button onClick={exportar} className="inline-flex items-center gap-2 px-3 py-2 rounded-md text-sm border" style={{ borderColor: "#E8DFC8" }}>
            <Download size={14} /> <span className="hidden sm:inline">Exportar</span>
          </button>
          <button onClick={abrirNovo} className="inline-flex items-center gap-2 px-4 py-2 rounded-md text-sm text-white" style={{ background: "#B8962E" }}>
            <Plus size={16} /> <span className="hidden sm:inline">Novo paciente</span>
          </button>
        </div>
      </div>

      {/* Mobile cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:hidden">
        {filtrados.map((p, i) => (
          <div key={p.id} className="bg-card rounded-lg p-4 border" style={{ borderColor: "#E8DFC8" }}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full flex items-center justify-center text-white text-xs font-semibold" style={{ background: avatarColors[i % avatarColors.length] }}>
                {initials(p.nome)}
              </div>
              <div className="min-w-0 flex-1">
                <div className="font-medium truncate">{p.nome}</div>
                <div className="text-xs text-muted-foreground truncate">{p.email}</div>
              </div>
              <StatusBadge color={p.status === "ativo" ? "green" : "gray"}>{p.status}</StatusBadge>
            </div>
            <div className="text-xs text-muted-foreground mt-2 space-y-0.5">
              <div>{p.telefone} · {p.planoSaude}</div>
              <div>CPF: {p.cpf}</div>
            </div>
            <div className="flex gap-2 mt-3">
              <Link to="/historico" className="flex-1 text-center text-xs py-1.5 rounded border" style={{ borderColor: "#E8DFC8" }}>Histórico</Link>
              <button onClick={() => abrirEdit(p)} className="flex-1 text-xs py-1.5 rounded border" style={{ borderColor: "#E8DFC8" }}>Editar</button>
              <button onClick={() => excluir(p)} className="px-2 text-xs py-1.5 rounded text-destructive border border-destructive/30"><Trash2 size={12} /></button>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop table */}
      <div className="hidden md:block bg-card rounded-lg border overflow-x-auto" style={{ borderColor: "#E8DFC8" }}>
        <table className="w-full text-sm">
          <thead style={{ background: "#FDFAF4" }}>
            <tr className="text-left text-xs uppercase text-muted-foreground">
              <th className="px-4 py-3">Paciente</th>
              <th className="px-4 py-3">CPF</th>
              <th className="px-4 py-3">Telefone</th>
              <th className="px-4 py-3">Plano</th>
              <th className="px-4 py-3">Cadastro</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Ações</th>
            </tr>
          </thead>
          <tbody>
            {filtrados.map((p, i) => (
              <tr key={p.id} className="border-t" style={{ borderColor: "#F0EAD8" }}>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-semibold" style={{ background: avatarColors[i % avatarColors.length] }}>
                      {initials(p.nome)}
                    </div>
                    <div>
                      <div className="font-medium">{p.nome}</div>
                      <div className="text-xs text-muted-foreground">{p.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">{p.cpf}</td>
                <td className="px-4 py-3">{p.telefone}</td>
                <td className="px-4 py-3">{p.planoSaude}</td>
                <td className="px-4 py-3 text-muted-foreground">{formatDate(p.createdAt)}</td>
                <td className="px-4 py-3"><StatusBadge color={p.status === "ativo" ? "green" : "gray"}>{p.status}</StatusBadge></td>
                <td className="px-4 py-3">
                  <div className="flex gap-1">
                    <Link to="/historico" className="p-1.5 rounded hover:bg-muted" title="Histórico"><FileClock size={14} /></Link>
                    <button onClick={() => abrirEdit(p)} className="p-1.5 rounded hover:bg-muted" title="Editar"><Edit2 size={14} /></button>
                    <button onClick={() => excluir(p)} className="p-1.5 rounded hover:bg-destructive/10 text-destructive" title="Excluir"><Trash2 size={14} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {open && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 overflow-y-auto" onClick={() => setOpen(false)}>
          <div className="bg-card modal-top rounded-lg w-full max-w-2xl p-6 my-8" onClick={e => e.stopPropagation()}>
            <h3 className="font-serif text-xl mb-4">{editId ? "Editar Paciente" : "Novo Paciente"}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input className="border rounded-md px-3 py-2 text-sm sm:col-span-2" placeholder="Nome completo *" value={form.nome} onChange={e => setForm({ ...form, nome: e.target.value })} style={{ borderColor: "#E8DFC8" }} />
              <input className="border rounded-md px-3 py-2 text-sm" placeholder="CPF *" value={form.cpf} onChange={e => setForm({ ...form, cpf: maskCPF(e.target.value) })} style={{ borderColor: "#E8DFC8" }} />
              <input className="border rounded-md px-3 py-2 text-sm" placeholder="Telefone *" value={form.telefone} onChange={e => setForm({ ...form, telefone: maskPhone(e.target.value) })} style={{ borderColor: "#E8DFC8" }} />
              <input className="border rounded-md px-3 py-2 text-sm sm:col-span-2" placeholder="E-mail *" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} style={{ borderColor: "#E8DFC8" }} />
              <input type="date" className="border rounded-md px-3 py-2 text-sm" value={form.dataNascimento} onChange={e => setForm({ ...form, dataNascimento: e.target.value })} style={{ borderColor: "#E8DFC8" }} />
              <select className="border rounded-md px-3 py-2 text-sm bg-card" value={form.planoSaude} onChange={e => setForm({ ...form, planoSaude: e.target.value })} style={{ borderColor: "#E8DFC8" }}>
                {["Particular", "Unimed", "Bradesco Saúde", "SulAmérica", "Amil", "Hapvida"].map(p => <option key={p}>{p}</option>)}
              </select>
              <select className="border rounded-md px-3 py-2 text-sm bg-card sm:col-span-2" value={form.status} onChange={e => setForm({ ...form, status: e.target.value as Paciente["status"] })} style={{ borderColor: "#E8DFC8" }}>
                <option value="ativo">Ativo</option>
                <option value="inativo">Inativo</option>
              </select>
              <textarea className="border rounded-md px-3 py-2 text-sm sm:col-span-2" placeholder="Alergias" value={form.alergias} onChange={e => setForm({ ...form, alergias: e.target.value })} style={{ borderColor: "#E8DFC8" }} />
              <textarea className="border rounded-md px-3 py-2 text-sm sm:col-span-2" placeholder="Histórico clínico" value={form.historicoClinico} onChange={e => setForm({ ...form, historicoClinico: e.target.value })} style={{ borderColor: "#E8DFC8" }} />
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
