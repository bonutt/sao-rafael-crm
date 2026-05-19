import { createFileRoute } from "@tanstack/react-router";
import { LineChart, Line, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid, PieChart, Pie, Cell, Legend } from "recharts";
import { TrendingUp, TrendingDown, Calendar, UserPlus, Target, Clock } from "lucide-react";
import { useAgendamentosStore, useMedicosStore } from "@/store";
import { StatusBadge, statusAgendamentoColor } from "@/components/ui-shared/StatusBadge";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard — Hospital São Rafael" },
      { name: "description", content: "Visão geral do CRM Hospitalar São Rafael" },
    ],
  }),
  component: Dashboard,
});

const consultaSerie = [
  { mes: "Jul", v: 142 }, { mes: "Ago", v: 168 }, { mes: "Set", v: 175 },
  { mes: "Out", v: 198 }, { mes: "Nov", v: 215 },
];

const procedimentos = [
  { name: "Botox", value: 35, color: "#B8962E" },
  { name: "Preenchimento", value: 28, color: "#8B6E1C" },
  { name: "Limpeza", value: 20, color: "#D4B14A" },
  { name: "Peeling", value: 12, color: "#2D7A4F" },
  { name: "Laser", value: 5, color: "#2558A8" },
];

function KPI({ icon: Icon, label, value, delta, positive = true }: any) {
  return (
    <div className="kpi-card p-5">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{label}</span>
        <Icon size={18} style={{ color: "#B8962E" }} />
      </div>
      <div className="text-3xl font-serif" style={{ color: "#3D3520" }}>{value}</div>
      <div className={`flex items-center gap-1 text-xs mt-2 ${positive ? "text-[#2D7A4F]" : "text-[#B83228]"}`}>
        {positive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
        {delta} vs mês anterior
      </div>
    </div>
  );
}

function Dashboard() {
  const ags = useAgendamentosStore((s) => s.agendamentos);
  const medicos = useMedicosStore((s) => s.medicos);
  const proximos = ags.slice(0, 6);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPI icon={Calendar} label="Consultas do mês" value="215" delta="+12%" />
        <KPI icon={UserPlus} label="Novos leads" value="87" delta="+31%" />
        <KPI icon={Target} label="Taxa de conversão" value="68%" delta="+4%" />
        <KPI icon={Clock} label="Tempo médio resposta" value="2.4h" delta="-18%" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-card rounded-lg p-5 border" style={{ borderColor: "#E8DFC8" }}>
          <h3 className="font-serif text-lg mb-4">Evolução de consultas</h3>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={consultaSerie}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E8DFC8" />
              <XAxis dataKey="mes" stroke="#6B6450" />
              <YAxis stroke="#6B6450" />
              <Tooltip contentStyle={{ background: "#FDFAF4", border: "1px solid #E8DFC8" }} />
              <Line type="monotone" dataKey="v" stroke="#B8962E" strokeWidth={3} dot={{ fill: "#B8962E", r: 5 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-card rounded-lg p-5 border" style={{ borderColor: "#E8DFC8" }}>
          <h3 className="font-serif text-lg mb-4">Procedimentos</h3>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie data={procedimentos} dataKey="value" innerRadius={50} outerRadius={80} paddingAngle={2}>
                {procedimentos.map((p) => <Cell key={p.name} fill={p.color} />)}
              </Pie>
              <Legend wrapperStyle={{ fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-card rounded-lg p-5 border" style={{ borderColor: "#E8DFC8" }}>
          <h3 className="font-serif text-lg mb-4">Próximos agendamentos do dia</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs uppercase text-muted-foreground border-b" style={{ borderColor: "#E8DFC8" }}>
                  <th className="py-2">Horário</th>
                  <th>Paciente</th>
                  <th>Procedimento</th>
                  <th>Médico</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {proximos.length === 0 && (
                  <tr><td colSpan={5} className="py-6 text-center text-muted-foreground">Nenhum agendamento hoje</td></tr>
                )}
                {proximos.map(a => (
                  <tr key={a.id} className="border-b last:border-0" style={{ borderColor: "#F0EAD8" }}>
                    <td className="py-3 font-medium">{a.horario}</td>
                    <td>{a.pacienteNome}</td>
                    <td>{a.procedimento}</td>
                    <td className="text-muted-foreground">{a.medicoNome}</td>
                    <td><StatusBadge color={statusAgendamentoColor(a.status)}>{a.status}</StatusBadge></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-card rounded-lg p-5 border" style={{ borderColor: "#E8DFC8" }}>
          <h3 className="font-serif text-lg mb-4">Performance da equipe</h3>
          <div className="space-y-4">
            {medicos.map(m => (
              <div key={m.id}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium">{m.nome}</span>
                  <span className="text-muted-foreground">{m.ocupacao}%</span>
                </div>
                <div className="h-2 rounded-full" style={{ background: "#F0EAD8" }}>
                  <div className="h-full rounded-full transition-all" style={{ width: `${m.ocupacao}%`, background: "#B8962E" }} />
                </div>
                <div className="text-xs text-muted-foreground mt-1">{m.especialidade}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
