import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Send, Sparkles, Calendar, Clock, Bell, Users } from "lucide-react";

export const Route = createFileRoute("/ia")({
  head: () => ({ meta: [{ title: "IA Assistente — Hospital São Rafael" }] }),
  component: IA,
});

const respostas: Record<string, string> = {
  horarios: "Hoje há 7 horários disponíveis: 09:00, 10:30, 11:00 (Dra. Ana), 14:30, 15:00, 16:30 (Dr. Carlos), 17:00 (Dra. Júlia).",
  retornos: "Existem 12 retornos pendentes nos próximos 7 dias. 4 são prioridade alta (pós-operatório).",
  metricas: "Hoje: 19 consultas agendadas, 14 atendidas, 2 faltas, 3 ainda pendentes. Receita do dia: R$ 4.280.",
  leads: "8 leads sem resposta há mais de 24h: Mariana (Instagram), João Pedro (WhatsApp) e mais 6.",
  lembrete: "Lembretes enviados via WhatsApp para 23 pacientes com consulta amanhã.",
};

const acoes = [
  { k: "horarios", label: "Horários disponíveis", icon: Calendar },
  { k: "retornos", label: "Retornos pendentes", icon: Clock },
  { k: "metricas", label: "Métricas do dia", icon: Sparkles },
  { k: "leads", label: "Leads sem resposta", icon: Users },
  { k: "lembrete", label: "Gerar lembretes", icon: Bell },
];

function IA() {
  const [msgs, setMsgs] = useState<{ role: "user" | "bot"; text: string }[]>([
    { role: "bot", text: "Olá! Sou a assistente São Rafael. Como posso ajudar hoje?" },
  ]);
  const [input, setInput] = useState("");

  function send(text: string, key?: string) {
    if (!text.trim()) return;
    const reply = key && respostas[key] ? respostas[key] : "Posso ajudar com agenda, leads, métricas e lembretes. Use as ações ao lado.";
    setMsgs(m => [...m, { role: "user", text }, { role: "bot", text: reply }]);
    setInput("");
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-5 h-[calc(100vh-7rem)]">
      <div className="lg:col-span-3 bg-card rounded-lg border flex flex-col" style={{ borderColor: "#E8DFC8" }}>
        <div className="p-4 border-b flex items-center gap-2" style={{ borderColor: "#E8DFC8" }}>
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-xs" style={{ background: "#B8962E" }}>SR</div>
          <div className="font-serif">Assistente São Rafael</div>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {msgs.map((m, i) => (
            <div key={i} className={`flex gap-2 ${m.role === "user" ? "justify-end" : ""}`}>
              {m.role === "bot" && (
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-xs flex-shrink-0" style={{ background: "#B8962E" }}>SR</div>
              )}
              <div className="max-w-[70%] px-4 py-2 rounded-lg text-sm" style={{
                background: m.role === "user" ? "#B8962E" : "#F5EDD6",
                color: m.role === "user" ? "white" : "#3D3520",
              }}>{m.text}</div>
            </div>
          ))}
        </div>
        <div className="p-4 border-t flex gap-2" style={{ borderColor: "#E8DFC8" }}>
          <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && send(input)}
            placeholder="Pergunte algo..." className="flex-1 border rounded-md px-3 py-2 text-sm" style={{ borderColor: "#E8DFC8" }} />
          <button onClick={() => send(input)} className="px-4 py-2 rounded-md text-white" style={{ background: "#B8962E" }}><Send size={16} /></button>
        </div>
      </div>
      <div className="bg-card rounded-lg border p-4 space-y-2" style={{ borderColor: "#E8DFC8" }}>
        <div className="text-xs uppercase tracking-wider text-muted-foreground mb-2">Ações rápidas</div>
        {acoes.map(a => {
          const Icon = a.icon;
          return (
            <button key={a.k} onClick={() => send(a.label, a.k)} className="w-full flex items-center gap-2 text-sm px-3 py-2 rounded-md text-left hover:bg-muted">
              <Icon size={14} style={{ color: "#B8962E" }} />{a.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
