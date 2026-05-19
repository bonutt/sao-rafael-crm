import { createFileRoute } from "@tanstack/react-router";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Download } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/relatorios")({
  head: () => ({ meta: [{ title: "Relatórios — Hospital São Rafael" }] }),
  component: Relatorios,
});

const data = [
  { m: "Jan", v: 87 }, { m: "Fev", v: 95 }, { m: "Mar", v: 110 },
  { m: "Abr", v: 120 }, { m: "Mai", v: 142 }, { m: "Jun", v: 138 },
  { m: "Jul", v: 142 }, { m: "Ago", v: 168 }, { m: "Set", v: 175 },
  { m: "Out", v: 198 }, { m: "Nov", v: 215 },
];

function KPI({ label, value, delta }: any) {
  return (
    <div className="kpi-card p-5">
      <div className="text-xs uppercase text-muted-foreground tracking-wider">{label}</div>
      <div className="text-2xl font-serif mt-1">{value}</div>
      <div className="text-xs text-[#2D7A4F] mt-1">{delta}</div>
    </div>
  );
}

function Relatorios() {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-3 items-center justify-between">
        <div className="flex gap-3">
          <select className="border rounded-md px-3 py-2 text-sm bg-card" style={{ borderColor: "#E8DFC8" }}>
            <option>Últimos 12 meses</option><option>Últimos 6 meses</option><option>Este mês</option>
          </select>
          <select className="border rounded-md px-3 py-2 text-sm bg-card" style={{ borderColor: "#E8DFC8" }}>
            <option>Todos os médicos</option><option>Dra. Ana Paula Silva</option><option>Dr. Carlos Eduardo</option><option>Dra. Júlia Martins</option>
          </select>
        </div>
        <button onClick={() => toast.success("PDF gerado")} className="inline-flex items-center gap-2 px-4 py-2 rounded-md text-sm text-white" style={{ background: "#B8962E" }}>
          <Download size={14} /> Exportar PDF
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPI label="Total de consultas" value="1.284" delta="+22% YoY" />
        <KPI label="Conversão de leads" value="68%" delta="+8%" />
        <KPI label="Receita total" value="R$ 287k" delta="+31%" />
        <KPI label="NPS" value="87" delta="Excelente" />
      </div>

      <div className="bg-card rounded-lg p-5 border" style={{ borderColor: "#E8DFC8" }}>
        <h3 className="font-serif text-lg mb-4">Desempenho mensal de consultas</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E8DFC8" />
            <XAxis dataKey="m" stroke="#6B6450" />
            <YAxis stroke="#6B6450" />
            <Tooltip contentStyle={{ background: "#FDFAF4", border: "1px solid #E8DFC8" }} />
            <Bar dataKey="v" fill="#B8962E" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
