import { createFileRoute } from "@tanstack/react-router";
import { colaboradores } from "@/services/mockData";
import { StatusBadge } from "@/components/ui-shared/StatusBadge";
import { Instagram, Facebook, MessageCircle, Search, Sparkles } from "lucide-react";

export const Route = createFileRoute("/configuracoes")({
  head: () => ({ meta: [{ title: "Configurações — Hospital São Rafael" }] }),
  component: Config,
});

const integracoes = [
  { nome: "WhatsApp Business", status: "Conectado", color: "#25D366", icon: MessageCircle, ativa: true },
  { nome: "Instagram", status: "Conectado", color: "linear-gradient(135deg,#F58529,#DD2A7B,#8134AF)", icon: Instagram, ativa: true },
  { nome: "Facebook", status: "Desconectado", color: "#1877F2", icon: Facebook, ativa: false },
  { nome: "Google Ads", status: "Conectado", color: "#DB4437", icon: Search, ativa: true },
  { nome: "IA São Rafael", status: "Ativa", color: "#B8962E", icon: Sparkles, ativa: true },
];

function Config() {
  return (
    <div className="space-y-6 max-w-4xl">
      <div className="bg-card rounded-lg p-6 border" style={{ borderColor: "#E8DFC8" }}>
        <h3 className="font-serif text-lg mb-4">Dados do hospital</h3>
        <div className="grid grid-cols-2 gap-3">
          <input defaultValue="Hospital São Rafael" className="border rounded-md px-3 py-2 text-sm col-span-2" style={{ borderColor: "#E8DFC8" }} />
          <input defaultValue="12.345.678/0001-99" placeholder="CNPJ" className="border rounded-md px-3 py-2 text-sm" style={{ borderColor: "#E8DFC8" }} />
          <input defaultValue="(11) 3000-1234" placeholder="Telefone" className="border rounded-md px-3 py-2 text-sm" style={{ borderColor: "#E8DFC8" }} />
          <input defaultValue="Av. Paulista, 1500 — São Paulo, SP" placeholder="Endereço" className="border rounded-md px-3 py-2 text-sm col-span-2" style={{ borderColor: "#E8DFC8" }} />
        </div>
      </div>

      <div className="bg-card rounded-lg p-6 border" style={{ borderColor: "#E8DFC8" }}>
        <h3 className="font-serif text-lg mb-4">Integrações</h3>
        <div className="space-y-2">
          {integracoes.map(i => {
            const Icon = i.icon;
            return (
              <div key={i.nome} className="flex items-center gap-3 p-3 rounded-md border" style={{ borderColor: "#F0EAD8" }}>
                <div className="w-9 h-9 rounded-md text-white flex items-center justify-center" style={{ background: i.color }}><Icon size={16} /></div>
                <div className="flex-1 font-medium">{i.nome}</div>
                <StatusBadge color={i.ativa ? "green" : "gray"}>{i.status}</StatusBadge>
                <button className="text-xs px-3 py-1.5 rounded-md text-white" style={{ background: "#B8962E" }}>{i.ativa ? "Configurar" : "Conectar"}</button>
              </div>
            );
          })}
        </div>
      </div>

      <div className="bg-card rounded-lg p-6 border" style={{ borderColor: "#E8DFC8" }}>
        <h3 className="font-serif text-lg mb-4">Usuários e permissões</h3>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs uppercase text-muted-foreground border-b" style={{ borderColor: "#E8DFC8" }}>
              <th className="py-2">Nome</th><th>Cargo</th><th>E-mail</th><th>Permissão</th>
            </tr>
          </thead>
          <tbody>
            {colaboradores.map(c => (
              <tr key={c.id} className="border-b" style={{ borderColor: "#F0EAD8" }}>
                <td className="py-3 font-medium">{c.nome}</td>
                <td>{c.cargo}</td>
                <td className="text-muted-foreground">{c.email}</td>
                <td><StatusBadge color={c.permissao === "admin" ? "gold" : c.permissao === "medico" ? "blue" : "green"}>{c.permissao}</StatusBadge></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
