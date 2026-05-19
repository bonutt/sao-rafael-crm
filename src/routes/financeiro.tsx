import { createFileRoute } from "@tanstack/react-router";
import { transacoes } from "@/services/mockData";
import { formatBRL, formatDate } from "@/utils/formatters";
import { StatusBadge } from "@/components/ui-shared/StatusBadge";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Download, TrendingUp, TrendingDown } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/financeiro")({
  head: () => ({ meta: [{ title: "Financeiro — Hospital São Rafael" }] }),
  component: Financeiro,
});

const receita = [
  { m: "Jul", v: 32000 }, { m: "Ago", v: 38500 }, { m: "Set", v: 41200 },
  { m: "Out", v: 44800 }, { m: "Nov", v: 48200 },
];

function KPI({ label, value, delta, positive = true }: any) {
  return (
    <div className="kpi-card p-5">
      <div className="text-xs uppercase text-muted-foreground tracking-wider">{label}</div>
      <div className="text-2xl font-serif mt-1">{value}</div>
      {delta && (
        <div className={`flex items-center gap-1 text-xs mt-1 ${positive ? "text-[#2D7A4F]" : "text-[#B83228]"}`}>
          {positive ? <TrendingUp size={12} /> : <TrendingDown size={12} />} {delta}
        </div>
      )}
    </div>
  );
}

function Financeiro() {
  function exportar() {
    const csv = "Paciente,Procedimento,Valor,Método,Data,Status\n" +
      transacoes.map(t => `${t.pacienteNome},${t.procedimento},${t.valor},${t.metodo},${t.data},${t.status}`).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = "transacoes.csv"; a.click();
    toast.success("CSV exportado");
  }
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPI label="Receita do mês" value="R$ 48.200" delta="+18%" />
        <KPI label="Ticket médio" value="R$ 224" delta="+5%" />
        <KPI label="A receber" value="R$ 12.800" delta="14 pendentes" positive={false} />
        <KPI label="Cancelamentos" value="R$ 3.100" delta="8.5%" positive={false} />
      </div>

      <div className="bg-card rounded-lg p-5 border" style={{ borderColor: "#E8DFC8" }}>
        <h3 className="font-serif text-lg mb-4">Receita mensal</h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={receita}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E8DFC8" />
            <XAxis dataKey="m" stroke="#6B6450" />
            <YAxis stroke="#6B6450" />
            <Tooltip formatter={(v: number) => formatBRL(v)} contentStyle={{ background: "#FDFAF4", border: "1px solid #E8DFC8" }} />
            <Bar dataKey="v" fill="#B8962E" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-card rounded-lg border overflow-hidden" style={{ borderColor: "#E8DFC8" }}>
        <div className="flex items-center justify-between p-4">
          <h3 className="font-serif text-lg">Transações</h3>
          <button onClick={exportar} className="inline-flex items-center gap-2 text-sm px-3 py-2 rounded-md border" style={{ borderColor: "#E8DFC8" }}><Download size={14} /> CSV</button>
        </div>
        <table className="w-full text-sm">
          <thead style={{ background: "#FDFAF4" }}>
            <tr className="text-left text-xs uppercase text-muted-foreground">
              <th className="px-4 py-3">Paciente</th>
              <th className="px-4 py-3">Procedimento</th>
              <th className="px-4 py-3">Valor</th>
              <th className="px-4 py-3">Método</th>
              <th className="px-4 py-3">Data</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {transacoes.map(t => (
              <tr key={t.id} className="border-t" style={{ borderColor: "#F0EAD8" }}>
                <td className="px-4 py-3 font-medium">{t.pacienteNome}</td>
                <td className="px-4 py-3">{t.procedimento}</td>
                <td className="px-4 py-3" style={{ color: t.status === "pago" ? "#2D7A4F" : t.status === "pendente" ? "#B87820" : "#B83228" }}>{formatBRL(t.valor)}</td>
                <td className="px-4 py-3 capitalize">{t.metodo}</td>
                <td className="px-4 py-3 text-muted-foreground">{formatDate(t.data)}</td>
                <td className="px-4 py-3"><StatusBadge color={t.status === "pago" ? "green" : t.status === "pendente" ? "amber" : "red"}>{t.status}</StatusBadge></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
