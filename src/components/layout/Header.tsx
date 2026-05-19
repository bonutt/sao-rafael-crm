import { Bell, Search, Plus, Menu } from "lucide-react";
import { Link, useRouterState } from "@tanstack/react-router";
import { useNotificacoesStore, useUIStore } from "@/store";

const titles: Record<string, string> = {
  "/": "Dashboard",
  "/leads": "Leads",
  "/pacientes": "Pacientes",
  "/agendamentos": "Agendamentos",
  "/historico": "Histórico do Paciente",
  "/financeiro": "Financeiro",
  "/equipe": "Equipe Médica",
  "/relatorios": "Relatórios",
  "/ia": "IA Assistente",
  "/notificacoes": "Notificações",
  "/configuracoes": "Configurações",
};

export function Header() {
  const path = useRouterState({ select: (s) => s.location.pathname });
  const title = titles[path] ?? Object.entries(titles).find(([p]) => p !== "/" && path.startsWith(p))?.[1] ?? "Hospital São Rafael";
  const naoLidas = useNotificacoesStore((s) => s.notificacoes.filter(n => !n.lida).length);
  const toggle = useUIStore((s) => s.toggleSidebar);

  return (
    <header
      className="bg-card flex items-center gap-2 md:gap-4 px-3 md:px-6 h-16 sticky top-0 z-30"
      style={{ borderBottom: "1px solid #E8DFC8" }}
    >
      <button onClick={toggle} className="lg:hidden p-2 rounded hover:bg-muted" aria-label="Abrir menu">
        <Menu size={20} style={{ color: "#3D3520" }} />
      </button>
      <h1 className="font-serif text-base md:text-xl m-0 truncate" style={{ color: "#3D3520" }}>{title}</h1>
      <div className="flex-1 max-w-md ml-2 md:ml-6 relative hidden md:block">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <input
          placeholder="Buscar pacientes, agendamentos..."
          className="w-full pl-9 pr-3 py-2 rounded-md text-sm outline-none focus:ring-2 focus:ring-primary/30"
          style={{ background: "#FDFAF4", border: "1px solid #E8DFC8" }}
        />
      </div>
      <div className="flex-1 md:hidden" />
      <Link to="/notificacoes" className="relative p-2 rounded hover:bg-muted transition-colors">
        <Bell size={20} style={{ color: "#3D3520" }} />
        {naoLidas > 0 && (
          <span
            className="absolute top-1 right-1 w-2 h-2 rounded-full"
            style={{ background: "#B8962E" }}
          />
        )}
      </Link>
      <Link
        to="/pacientes"
        className="inline-flex items-center gap-2 px-3 md:px-4 py-2 rounded-md text-sm font-medium text-white transition-colors"
        style={{ background: "#B8962E" }}
      >
        <Plus size={16} /> <span className="hidden sm:inline">Novo paciente</span>
      </Link>
    </header>
  );
}
