export type StatusPaciente = "ativo" | "inativo";
export type CanalLead = "instagram" | "facebook" | "google" | "tiktok" | "whatsapp" | "indicacao";
export type StatusLead = "novo" | "qualificando" | "proposta" | "convertido" | "perdido";
export type StatusAgendamento = "agendado" | "atendido" | "falta" | "reagendado" | "cancelado";
export type StatusOnline = "online" | "ausente" | "offline";
export type Permissao = "admin" | "atendente" | "medico";

export interface Paciente {
  id: string;
  nome: string;
  cpf: string;
  email: string;
  telefone: string;
  dataNascimento: string;
  planoSaude: string;
  alergias: string;
  historicoClinico: string;
  status: StatusPaciente;
  createdAt: string;
}

export interface Lead {
  id: string;
  nome: string;
  telefone: string;
  canal: CanalLead;
  interesse: string;
  status: StatusLead;
  atendenteId: string;
  atendenteNome: string;
  createdAt: string;
}

export interface Agendamento {
  id: string;
  pacienteId: string;
  pacienteNome: string;
  medicoId: string;
  medicoNome: string;
  procedimento: string;
  data: string; // ISO
  horario: string; // HH:mm
  status: StatusAgendamento;
  observacoes?: string;
}

export interface Medico {
  id: string;
  nome: string;
  crm: string;
  especialidade: string;
  email: string;
  statusOnline: StatusOnline;
  ocupacao: number;
  consultasHoje: number;
  nps: number;
}

export interface Colaborador {
  id: string;
  nome: string;
  cargo: string;
  email: string;
  permissao: Permissao;
}

export interface Transacao {
  id: string;
  pacienteNome: string;
  procedimento: string;
  valor: number;
  metodo: "pix" | "cartao" | "dinheiro" | "boleto";
  data: string;
  status: "pago" | "pendente" | "cancelado";
}

export interface Notificacao {
  id: string;
  tipo: "confirmacao" | "lembrete" | "retorno" | "mensagem" | "consulta_proxima" | "pagamento";
  titulo: string;
  descricao: string;
  data: string;
  lida: boolean;
}
