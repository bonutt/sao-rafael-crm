import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard, Users, UserPlus, Calendar, FileClock, DollarSign,
  Stethoscope, BarChart3, Sparkles, Bell, Settings, LogOut, X,
} from "lucide-react";
import { Logo } from "./Logo";
import { useAuthStore, useUIStore } from "@/store";
import { initials } from "@/utils/formatters";

const sections = [
  {
    label: "Principal",
    items: [
      { to: "/", label: "Dashboard", icon: LayoutDashboard },
      { to: "/leads", label: "Leads", icon: UserPlus, badge: "12" },
      { to: "/pacientes", label: "Pacientes", icon: Users },
      { to: "/agendamentos", label: "Agendamentos", icon: Calendar },
    ],
  },
  {
    label: "Clínico",
    items: [
      { to: "/historico", label: "Histórico", icon: FileClock },
      { to: "/equipe", label: "Equipe Médica", icon: Stethoscope },
    ],
  },
  {
    label: "Gestão",
    items: [
      { to: "/financeiro", label: "Financeiro", icon: DollarSign },
      { to: "/relatorios", label: "Relatórios", icon: BarChart3 },
    ],
  },
  {
    label: "Sistema",
    items: [
      { to: "/ia", label: "IA Assistente", icon: Sparkles },
      { to: "/notificacoes", label: "Notificações", icon: Bell, badge: "5" },
      { to: "/configuracoes", label: "Configurações", icon: Settings },
    ],
  },
];

export function Sidebar() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const { sidebarOpen, setSidebar } = useUIStore();

  return (
    <aside
      className={`flex h-screen w-64 flex-col fixed lg:sticky top-0 left-0 z-50 transition-transform duration-300 lg:translate-x-0 ${
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      }`}
      style={{ background: "#2C2416", color: "#F5EDD6" }}
    >
      <div className="p-5 flex items-center gap-3" style={{ borderBottom: "1px solid rgba(184,150,46,0.2)" }}>
        <Logo size={44} />
        <div className="leading-tight flex-1">
          <div className="font-serif text-lg" style={{ color: "#D4B14A" }}>São Rafael</div>
          <div className="text-[10px] tracking-widest" style={{ color: "rgba(212,177,74,0.6)" }}>CRM HOSPITALAR</div>
        </div>
        <button onClick={() => setSidebar(false)} className="lg:hidden p-1 rounded text-[#D4B14A]" aria-label="Fechar menu">
          <X size={20} />
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-5">
        {sections.map((sec) => (
          <div key={sec.label}>
            <div
              className="px-3 mb-2 text-[10px] font-semibold uppercase tracking-widest"
              style={{ color: "rgba(212,177,74,0.45)" }}
            >
              {sec.label}
            </div>
            <ul className="space-y-1">
              {sec.items.map((item) => {
                const active = pathname === item.to || (item.to !== "/" && pathname.startsWith(item.to));
                const Icon = item.icon;
                return (
                  <li key={item.to}>
                    <Link
                      to={item.to}
                      onClick={() => setSidebar(false)}
                      className="flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-all relative"
                      style={{
                        background: active ? "rgba(184,150,46,0.2)" : "transparent",
                        color: active ? "#D4B14A" : "rgba(255,255,255,0.6)",
                        borderLeft: active ? "3px solid #B8962E" : "3px solid transparent",
                        fontWeight: active ? 600 : 400,
                      }}
                    >
                      <Icon size={18} />
                      <span className="flex-1">{item.label}</span>
                      {"badge" in item && item.badge && (
                        <span
                          className="text-[10px] px-1.5 py-0.5 rounded font-semibold"
                          style={{ background: "#B8962E", color: "#2C2416" }}
                        >
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {user && (
        <div className="p-4 flex items-center gap-3" style={{ borderTop: "1px solid rgba(184,150,46,0.2)" }}>
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center font-semibold"
            style={{ background: "#B8962E", color: "#2C2416" }}
          >
            {initials(user.nome)}
          </div>
          <div className="flex-1 leading-tight min-w-0">
            <div className="text-sm font-medium truncate" style={{ color: "#D4B14A" }}>{user.nome}</div>
            <div className="text-[11px]" style={{ color: "rgba(212,177,74,0.6)" }}>{user.cargo}</div>
          </div>
          <button
            onClick={logout}
            className="p-2 rounded hover:bg-white/10 transition-colors"
            style={{ color: "rgba(212,177,74,0.7)" }}
            title="Sair"
          >
            <LogOut size={16} />
          </button>
        </div>
      )}
    </aside>
  );
}
