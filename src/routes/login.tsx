import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useAuthStore } from "@/store";
import { Logo } from "@/components/layout/Logo";
import { toast } from "sonner";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Entrar — Hospital São Rafael" }] }),
  component: Login,
});

function Login() {
  const login = useAuthStore(s => s.login);
  const navigate = useNavigate();
  const [email, setEmail] = useState("marina@saorafael.com.br");
  const [senha, setSenha] = useState("");

  function entrar(e: React.FormEvent) {
    e.preventDefault();
    if (login(email, senha)) {
      toast.success("Bem-vindo ao São Rafael");
      navigate({ to: "/" });
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6" style={{ background: "#FDFAF4" }}>
      <div className="w-full max-w-md bg-card rounded-lg p-8 modal-top" style={{ border: "1px solid #E8DFC8" }}>
        <div className="flex flex-col items-center mb-6">
          <Logo size={64} />
          <h1 className="font-serif text-2xl mt-4">Hospital São Rafael</h1>
          <p className="text-xs uppercase tracking-widest" style={{ color: "#B8962E" }}>CRM HOSPITALAR</p>
        </div>
        <form onSubmit={entrar} className="space-y-3">
          <input value={email} onChange={e => setEmail(e.target.value)} placeholder="E-mail" className="w-full border rounded-md px-3 py-2 text-sm" style={{ borderColor: "#E8DFC8" }} />
          <input value={senha} onChange={e => setSenha(e.target.value)} type="password" placeholder="Senha" className="w-full border rounded-md px-3 py-2 text-sm" style={{ borderColor: "#E8DFC8" }} />
          <button type="submit" className="w-full py-2 rounded-md text-white font-medium" style={{ background: "#B8962E" }}>Entrar</button>
        </form>
        <div className="text-xs text-muted-foreground text-center mt-4">
          Demo: marina@saorafael.com.br · paula@saorafael.com.br · ana.silva@saorafael.com.br
        </div>
      </div>
    </div>
  );
}
