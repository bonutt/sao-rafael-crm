import { create } from "zustand";
import type { Paciente, Lead, Agendamento, Notificacao, Permissao, Medico } from "@/types";
import { pacientes as initPac, leads as initLeads, agendamentos as initAg, notificacoes as initNot, medicos as initMed } from "@/services/mockData";

interface AuthUser {
  id: string;
  nome: string;
  cargo: string;
  email: string;
  permissao: Permissao;
}

interface AuthStore {
  user: AuthUser | null;
  login: (email: string, senha: string) => boolean;
  logout: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: { id: "u1", nome: "Marina Costa", cargo: "Administradora", email: "marina@saorafael.com.br", permissao: "admin" },
  login: (email) => {
    const map: Record<string, AuthUser> = {
      "marina@saorafael.com.br": { id: "u1", nome: "Marina Costa", cargo: "Administradora", email, permissao: "admin" },
      "paula@saorafael.com.br": { id: "u2", nome: "Paula Souza", cargo: "Atendente", email, permissao: "atendente" },
      "ana.silva@saorafael.com.br": { id: "u3", nome: "Dra. Ana Paula Silva", cargo: "Médica", email, permissao: "medico" },
    };
    const u = map[email] ?? map["marina@saorafael.com.br"];
    set({ user: u });
    return true;
  },
  logout: () => set({ user: null }),
}));

interface PacientesStore {
  pacientes: Paciente[];
  add: (p: Paciente) => void;
  update: (id: string, p: Partial<Paciente>) => void;
  remove: (id: string) => void;
}
export const usePacientesStore = create<PacientesStore>((set) => ({
  pacientes: initPac,
  add: (p) => set((s) => ({ pacientes: [p, ...s.pacientes] })),
  update: (id, p) => set((s) => ({ pacientes: s.pacientes.map(x => x.id === id ? { ...x, ...p } : x) })),
  remove: (id) => set((s) => ({ pacientes: s.pacientes.filter(x => x.id !== id) })),
}));

interface LeadsStore {
  leads: Lead[];
  add: (l: Lead) => void;
  update: (id: string, l: Partial<Lead>) => void;
  remove: (id: string) => void;
}
export const useLeadsStore = create<LeadsStore>((set) => ({
  leads: initLeads,
  add: (l) => set((s) => ({ leads: [l, ...s.leads] })),
  update: (id, l) => set((s) => ({ leads: s.leads.map(x => x.id === id ? { ...x, ...l } : x) })),
  remove: (id) => set((s) => ({ leads: s.leads.filter(x => x.id !== id) })),
}));

interface AgendamentosStore {
  agendamentos: Agendamento[];
  add: (a: Agendamento) => void;
  update: (id: string, a: Partial<Agendamento>) => void;
  remove: (id: string) => void;
}
export const useAgendamentosStore = create<AgendamentosStore>((set) => ({
  agendamentos: initAg,
  add: (a) => set((s) => ({ agendamentos: [a, ...s.agendamentos] })),
  update: (id, a) => set((s) => ({ agendamentos: s.agendamentos.map(x => x.id === id ? { ...x, ...a } : x) })),
  remove: (id) => set((s) => ({ agendamentos: s.agendamentos.filter(x => x.id !== id) })),
}));

interface MedicosStore {
  medicos: Medico[];
  add: (m: Medico) => void;
  update: (id: string, m: Partial<Medico>) => void;
  remove: (id: string) => void;
}
export const useMedicosStore = create<MedicosStore>((set) => ({
  medicos: initMed,
  add: (m) => set((s) => ({ medicos: [m, ...s.medicos] })),
  update: (id, m) => set((s) => ({ medicos: s.medicos.map(x => x.id === id ? { ...x, ...m } : x) })),
  remove: (id) => set((s) => ({ medicos: s.medicos.filter(x => x.id !== id) })),
}));

interface NotificacoesStore {
  notificacoes: Notificacao[];
  add: (n: Notificacao) => void;
  marcarLida: (id: string) => void;
  marcarTodas: () => void;
  remove: (id: string) => void;
}
export const useNotificacoesStore = create<NotificacoesStore>((set) => ({
  notificacoes: initNot,
  add: (n) => set((s) => ({ notificacoes: [n, ...s.notificacoes] })),
  marcarLida: (id) => set((s) => ({ notificacoes: s.notificacoes.map(n => n.id === id ? { ...n, lida: true } : n) })),
  marcarTodas: () => set((s) => ({ notificacoes: s.notificacoes.map(n => ({ ...n, lida: true })) })),
  remove: (id) => set((s) => ({ notificacoes: s.notificacoes.filter(n => n.id !== id) })),
}));

// Mobile sidebar UI store
interface UIStore {
  sidebarOpen: boolean;
  setSidebar: (v: boolean) => void;
  toggleSidebar: () => void;
}
export const useUIStore = create<UIStore>((set) => ({
  sidebarOpen: false,
  setSidebar: (v) => set({ sidebarOpen: v }),
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
}));
