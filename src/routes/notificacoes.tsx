import { createFileRoute } from "@tanstack/react-router";
import { useNotificacoesStore } from "@/store";
import { CheckCircle, Bell, Clock, MessageCircle, DollarSign, Calendar } from "lucide-react";
import { tempoDesde } from "@/utils/formatters";
import { toast } from "sonner";

export const Route = createFileRoute("/notificacoes")({
  head: () => ({ meta: [{ title: "Notificações — Hospital São Rafael" }] }),
  component: NotPage,
});

const meta: Record<string, { color: string; icon: any }> = {
  confirmacao: { color: "#2D7A4F", icon: CheckCircle },
  lembrete: { color: "#B87820", icon: Clock },
  retorno: { color: "#2558A8", icon: Bell },
  mensagem: { color: "#8B6E1C", icon: MessageCircle },
  consulta_proxima: { color: "#B8962E", icon: Calendar },
  pagamento: { color: "#2D7A4F", icon: DollarSign },
};

function NotPage() {
  const { notificacoes, marcarLida, marcarTodas } = useNotificacoesStore();

  return (
    <div className="space-y-4 max-w-3xl">
      <div className="flex justify-between items-center">
        <h2 className="font-serif text-2xl">Notificações</h2>
        <button onClick={() => { marcarTodas(); toast.success("Todas marcadas como lidas"); }} className="text-sm px-3 py-2 rounded-md border" style={{ borderColor: "#E8DFC8" }}>
          Marcar todas como lidas
        </button>
      </div>

      <div className="space-y-2">
        {notificacoes.map(n => {
          const m = meta[n.tipo];
          const Icon = m.icon;
          return (
            <div key={n.id} className="bg-card rounded-md p-4 border flex items-start gap-3" style={{
              borderColor: "#E8DFC8",
              borderLeft: !n.lida ? "4px solid #B8962E" : "4px solid transparent",
            }}>
              <div className="w-9 h-9 rounded-md flex items-center justify-center flex-shrink-0" style={{ background: `${m.color}20`, color: m.color }}>
                <Icon size={16} />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{n.titulo}</span>
                  {!n.lida && <span className="text-[10px] px-1.5 py-0.5 rounded font-semibold" style={{ background: "#B8962E", color: "white" }}>NOVA</span>}
                </div>
                <div className="text-sm text-muted-foreground mt-0.5">{n.descricao}</div>
                <div className="text-xs text-muted-foreground mt-1">há {tempoDesde(n.data)}</div>
              </div>
              <div className="flex flex-col gap-1">
                {!n.lida && (
                  <button onClick={() => marcarLida(n.id)} className="text-xs px-2 py-1 rounded border" style={{ borderColor: "#E8DFC8" }}>Marcar lida</button>
                )}
                <button className="text-xs px-2 py-1 rounded text-white" style={{ background: "#B8962E" }}>
                  {n.tipo === "mensagem" ? "Responder" : "Agendar"}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
