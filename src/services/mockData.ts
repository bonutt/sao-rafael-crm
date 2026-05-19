import type { Paciente, Lead, Agendamento, Medico, Colaborador, Transacao, Notificacao } from "@/types";

const nomes = [
  "Mariana Souza Lima", "João Pedro Almeida", "Beatriz Carvalho", "Rafael Mendes Costa",
  "Camila Oliveira", "Lucas Henrique Santos", "Fernanda Ribeiro", "Gustavo Pereira",
  "Patrícia Nogueira", "Thiago Barbosa", "Larissa Cardoso", "Eduardo Martins",
  "Juliana Ferreira", "Bruno Azevedo", "Aline Cavalcanti", "Roberto Tavares",
  "Isabela Rocha", "Felipe Moreira", "Carla Vieira", "Marcelo Andrade",
  "Tatiane Lopes", "Renato Cunha", "Vanessa Dias", "Henrique Ramos",
];

const procedimentos = ["Botox", "Preenchimento", "Limpeza de pele", "Peeling", "Laser", "Consulta avaliação", "Rinoplastia"];
const planos = ["Particular", "Unimed", "Bradesco Saúde", "SulAmérica", "Amil", "Hapvida"];
const canais: Lead["canal"][] = ["instagram", "facebook", "google", "tiktok", "whatsapp", "indicacao"];
const statusLead: Lead["status"][] = ["novo", "qualificando", "proposta", "convertido", "perdido"];

// Deterministic seeded RNG to avoid SSR/CSR hydration mismatches
let _seed = 1234567;
const srand = () => {
  _seed = (_seed * 1664525 + 1013904223) >>> 0;
  return _seed / 0xffffffff;
};
const rand = <T,>(arr: T[]) => arr[Math.floor(srand() * arr.length)];
const randInt = (min: number, max: number) => Math.floor(srand() * (max - min + 1)) + min;
const pad = (n: number) => n.toString().padStart(2, "0");

// Fixed reference date for deterministic createdAt (avoids Date.now() at module load)
const REF = new Date("2026-05-08T12:00:00.000Z").getTime();

export const medicos: Medico[] = [
  { id: "m1", nome: "Dra. Ana Paula Silva", crm: "CRM-SP 123456", especialidade: "Dermatologista", email: "ana.silva@saorafael.com.br", statusOnline: "online", ocupacao: 85, consultasHoje: 8, nps: 92 },
  { id: "m2", nome: "Dr. Carlos Eduardo", crm: "CRM-SP 789012", especialidade: "Cirurgião Plástico", email: "carlos.eduardo@saorafael.com.br", statusOnline: "ausente", ocupacao: 72, consultasHoje: 5, nps: 88 },
  { id: "m3", nome: "Dra. Júlia Martins", crm: "COREN-SP 45678", especialidade: "Esteticista", email: "julia.martins@saorafael.com.br", statusOnline: "online", ocupacao: 68, consultasHoje: 6, nps: 90 },
];

export const colaboradores: Colaborador[] = [
  { id: "u1", nome: "Marina Costa", cargo: "Administradora", email: "marina@saorafael.com.br", permissao: "admin" },
  { id: "u2", nome: "Paula Souza", cargo: "Atendente", email: "paula@saorafael.com.br", permissao: "atendente" },
  { id: "u3", nome: "Dra. Ana Paula Silva", cargo: "Médica", email: "ana.silva@saorafael.com.br", permissao: "medico" },
];

const cpfs = new Set<string>();
const genCPF = () => {
  let cpf;
  do {
    cpf = `${randInt(100, 999)}.${randInt(100, 999)}.${randInt(100, 999)}-${pad(randInt(0, 99))}`;
  } while (cpfs.has(cpf));
  cpfs.add(cpf);
  return cpf;
};

const genPhone = () => `(11) 9${randInt(1000, 9999)}-${randInt(1000, 9999)}`;

export const pacientes: Paciente[] = nomes.map((nome, i) => ({
  id: `p${i + 1}`,
  nome,
  cpf: genCPF(),
  email: `${nome.split(" ")[0].toLowerCase()}.${nome.split(" ").slice(-1)[0].toLowerCase()}@email.com`,
  telefone: genPhone(),
  dataNascimento: `19${randInt(60, 99)}-${pad(randInt(1, 12))}-${pad(randInt(1, 28))}`,
  planoSaude: rand(planos),
  alergias: i % 4 === 0 ? "Dipirona" : "Nenhuma",
  historicoClinico: i % 3 === 0 ? "Hipertensão controlada" : "Sem comorbidades",
  status: i % 7 === 0 ? "inativo" : "ativo",
  createdAt: new Date(REF - randInt(1, 365) * 86400000).toISOString(),
}));

const REF_DATE = new Date(REF);
const yyyy = REF_DATE.getUTCFullYear();
const mm = REF_DATE.getUTCMonth();

export const agendamentos: Agendamento[] = Array.from({ length: 55 }).map((_, i) => {
  const day = randInt(1, 28);
  const data = new Date(Date.UTC(yyyy, mm, day, 12));
  const med = rand(medicos);
  const pac = rand(pacientes);
  const statuses: Agendamento["status"][] = ["agendado", "atendido", "falta", "reagendado", "cancelado", "agendado", "agendado"];
  return {
    id: `a${i + 1}`,
    pacienteId: pac.id,
    pacienteNome: pac.nome,
    medicoId: med.id,
    medicoNome: med.nome,
    procedimento: rand(procedimentos),
    data: data.toISOString(),
    horario: `${pad(randInt(8, 17))}:${rand(["00", "30"])}`,
    status: rand(statuses),
    observacoes: i % 5 === 0 ? "Primeira consulta" : undefined,
  };
});

export const leads: Lead[] = Array.from({ length: 18 }).map((_, i) => ({
  id: `l${i + 1}`,
  nome: nomes[i % nomes.length],
  telefone: genPhone(),
  canal: rand(canais),
  interesse: rand(procedimentos),
  status: rand(statusLead),
  atendenteId: "u2",
  atendenteNome: "Paula Souza",
  createdAt: new Date(REF - randInt(0, 72) * 3600000).toISOString(),
}));

export const transacoes: Transacao[] = Array.from({ length: 25 }).map((_, i) => ({
  id: `t${i + 1}`,
  pacienteNome: rand(pacientes).nome,
  procedimento: rand(procedimentos),
  valor: randInt(150, 1500),
  metodo: rand(["pix", "cartao", "dinheiro", "boleto"]) as Transacao["metodo"],
  data: new Date(Date.UTC(yyyy, mm, randInt(1, 28), 12)).toISOString(),
  status: rand(["pago", "pago", "pago", "pendente", "cancelado"]) as Transacao["status"],
}));

export const notificacoes: Notificacao[] = [
  { id: "n1", tipo: "confirmacao", titulo: "Consulta confirmada", descricao: "Mariana Souza confirmou consulta para amanhã às 14:00", data: new Date(REF).toISOString(), lida: false },
  { id: "n2", tipo: "lembrete", titulo: "Lembrete pré-operatório", descricao: "João Pedro tem rinoplastia em 3 dias — enviar orientações", data: new Date(REF).toISOString(), lida: false },
  { id: "n3", tipo: "retorno", titulo: "Retorno pendente", descricao: "Beatriz Carvalho deve retornar para avaliação pós-laser", data: new Date(REF - 3600000).toISOString(), lida: false },
  { id: "n4", tipo: "mensagem", titulo: "Nova mensagem", descricao: "Camila Oliveira enviou uma dúvida pelo WhatsApp", data: new Date(REF - 7200000).toISOString(), lida: true },
  { id: "n5", tipo: "consulta_proxima", titulo: "Consulta em 30 minutos", descricao: "Lucas Henrique — Botox com Dra. Ana Paula", data: new Date(REF - 10800000).toISOString(), lida: false },
  { id: "n6", tipo: "pagamento", titulo: "Pagamento confirmado", descricao: "Fernanda Ribeiro — R$ 850,00 via PIX", data: new Date(REF - 86400000).toISOString(), lida: true },
];
