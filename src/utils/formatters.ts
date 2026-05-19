import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";

export const formatBRL = (v: number) =>
  v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

export const formatDate = (iso: string) =>
  format(parseISO(iso), "dd/MM/yyyy", { locale: ptBR });

export const formatDateTime = (iso: string) =>
  format(parseISO(iso), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR });

export const maskCPF = (v: string) =>
  v.replace(/\D/g, "").slice(0, 11)
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2");

export const maskPhone = (v: string) =>
  v.replace(/\D/g, "").slice(0, 11)
    .replace(/^(\d{2})(\d)/, "($1) $2")
    .replace(/(\d{5})(\d)/, "$1-$2");

export const initials = (nome: string) =>
  nome.split(" ").filter(Boolean).slice(0, 2).map(n => n[0]?.toUpperCase()).join("");

export const tempoDesde = (iso: string) => {
  const diff = Date.now() - new Date(iso).getTime();
  const h = Math.floor(diff / 36e5);
  if (h < 1) return `${Math.floor(diff / 6e4)}min`;
  if (h < 24) return `${h}h`;
  return `${Math.floor(h / 24)}d`;
};
