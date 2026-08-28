import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  Bot,
  ChevronRight,
  Image as ImageIcon,
  PanelRightClose,
  PanelRightOpen,
  Paperclip,
  Search,
  Send,
  ShieldCheck,
} from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { StatusDot } from "@/components/status-badge";
import { OrderSummary } from "@/components/order-summary";
import { STATUS_STYLES, conversations, initials, orders, soles } from "@/lib/mock-data";

export const Route = createFileRoute("/conversaciones")({
  head: () => ({
    meta: [
      { title: "Conversaciones — PedidoFlow" },
      {
        name: "description",
        content:
          "Inbox de WhatsApp con agente IA: confirma pedidos, revisa capturas de pago y toma el control del chat cuando lo necesites.",
      },
      { property: "og:title", content: "Conversaciones — PedidoFlow" },
      {
        property: "og:description",
        content: "Inbox unificado de WhatsApp con agente IA y traspaso a atención humana.",
      },
    ],
  }),
  component: Conversaciones,
});

function Conversaciones() {
  const [activeId, setActiveId] = useState(conversations[0]!.id);
  const [filter, setFilter] = useState<"todos" | "ia" | "humano">("todos");
  const [aiOn, setAiOn] = useState(false);
  const [panel, setPanel] = useState(true);
  const [draft, setDraft] = useState("");

  const list = conversations.filter((c) => filter === "todos" || c.handledBy === filter);
  const active = conversations.find((c) => c.id === activeId)!;
  const order = orders.find((o) => o.id === active.orderId)!;

  return (
    <AppShell
      title="Conversaciones"
      subtitle="Inbox de WhatsApp Business atendido por tu agente IA"
      contentClassName="pb-4"
    >
      <div className="card-surface flex h-[calc(100vh-13rem)] min-h-[560px] overflow-hidden">
        {/* Lista de chats */}
        <div className="flex w-full max-w-xs flex-col border-r border-border md:w-80">
          <div className="border-b border-border p-3">
            <div className="relative">
              <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                placeholder="Buscar chat"
                className="h-9 w-full rounded-lg border border-border bg-muted/60 pr-3 pl-9 text-sm outline-none focus:border-primary focus:bg-surface"
              />
            </div>
            <div className="mt-2 flex gap-1 rounded-lg bg-muted p-1 text-xs">
              {(
                [
                  ["todos", "Todos"],
                  ["ia", "Atendidos por IA"],
                  ["humano", "Requiere humano"],
                ] as const
              ).map(([k, label]) => (
                <button
                  key={k}
                  onClick={() => setFilter(k)}
                  className={`flex-1 rounded-md px-2 py-1.5 font-medium transition ${
                    filter === k ? "bg-surface shadow-sm" : "text-muted-foreground"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1 divide-y divide-border overflow-y-auto">
            {list.map((c) => (
              <button
                key={c.id}
                onClick={() => setActiveId(c.id)}
                className={`flex w-full gap-3 p-3 text-left transition ${
                  c.id === activeId ? "bg-accent/60" : "hover:bg-muted/60"
                }`}
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary-soft text-xs font-bold text-accent-foreground">
                  {initials(c.customer)}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="truncate text-[13px] font-semibold">{c.customer}</p>
                    <span className="ml-auto text-[11px] text-muted-foreground">{c.time}</span>
                  </div>
                  <p className="truncate text-xs text-muted-foreground">{c.last}</p>
                  <div className="mt-1.5 flex items-center gap-1.5">
                    <StatusDot status={c.status} />
                    <span className="text-[10px] font-medium text-muted-foreground">
                      {STATUS_STYLES[c.status]?.label || c.status}
                    </span>
                    {c.handledBy === "ia" ? (
                      <span className="ml-auto inline-flex items-center gap-1 rounded-md bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground">
                        <Bot className="h-3 w-3" /> IA
                      </span>
                    ) : (
                      <span className="ml-auto rounded-md bg-status-compromiso-soft px-1.5 py-0.5 text-[10px] font-semibold text-status-compromiso">
                        Humano
                      </span>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Conversación */}
        <div className="flex min-w-0 flex-1 flex-col">
          <header className="flex items-center gap-3 border-b border-border px-4 py-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
              {initials(active.customer)}
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">{active.customer}</p>
              <p className="text-[11px] text-muted-foreground">
                {active.phone} · Pedido {order.number}
              </p>
            </div>
            <div className="ml-auto flex items-center gap-2">
              <button
                onClick={() => setAiOn((v) => !v)}
                className={`flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
                  aiOn
                    ? "border-primary/30 bg-primary-soft text-accent-foreground"
                    : "border-border bg-muted text-muted-foreground"
                }`}
              >
                <span
                  className={`h-2 w-2 rounded-full ${aiOn ? "bg-primary" : "bg-status-pendiente"}`}
                />
                {aiOn ? "IA activa" : "IA pausada"}
              </button>
              <button
                onClick={() => setPanel((v) => !v)}
                className="hidden rounded-lg p-2 hover:bg-muted lg:block"
              >
                {panel ? (
                  <PanelRightClose className="h-4 w-4 text-muted-foreground" strokeWidth={1.75} />
                ) : (
                  <PanelRightOpen className="h-4 w-4 text-muted-foreground" strokeWidth={1.75} />
                )}
              </button>
            </div>
          </header>

          <div className="flex-1 space-y-3 overflow-y-auto bg-surface-2 p-4">
            {active.messages.map((m) => {
              const mine = m.from !== "cliente";
              return (
                <div key={m.id} className={`flex ${mine ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[78%] rounded-2xl px-3.5 py-2.5 text-sm shadow-sm ${
                      m.from === "cliente"
                        ? "rounded-bl-sm bg-surface"
                        : m.from === "ia"
                          ? "rounded-br-sm bg-primary-soft text-accent-foreground"
                          : "rounded-br-sm bg-primary text-primary-foreground"
                    }`}
                  >
                    {m.from !== "cliente" ? (
                      <p className="mb-1 flex items-center gap-1 text-[10px] font-bold tracking-wide uppercase opacity-70">
                        {m.from === "ia" ? <Bot className="h-3 w-3" /> : null}
                        {m.from === "ia" ? "Agente IA" : "Andrea (vendedora)"}
                      </p>
                    ) : null}
                    {m.image ? (
                      <div className="flex items-center gap-3">
                        <div className="flex h-24 w-20 flex-col items-center justify-center gap-1 rounded-lg border border-border bg-surface-2 text-[10px] text-muted-foreground">
                          <ImageIcon className="h-5 w-5" strokeWidth={1.5} />
                          Captura Yape
                        </div>
                        <button className="inline-flex items-center gap-1.5 rounded-lg bg-status-confirmado px-3 py-2 text-xs font-semibold text-surface hover:opacity-90">
                          <ShieldCheck className="h-4 w-4" strokeWidth={1.75} />
                          Verificar pago
                        </button>
                      </div>
                    ) : (
                      <p className="leading-5 whitespace-pre-line">{m.text}</p>
                    )}
                    <p className="mt-1 text-right text-[10px] opacity-60">{m.time}</p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="border-t border-border p-3">
            {!aiOn ? (
              <p className="mb-2 text-[11px] font-medium text-status-compromiso">
                Tomaste el control de esta conversación. La IA no responderá hasta que la actives.
              </p>
            ) : null}
            <div className="flex items-center gap-2 rounded-xl border border-border bg-surface px-3 py-2">
              <Paperclip className="h-4 w-4 shrink-0 text-muted-foreground" strokeWidth={1.75} />
              <input
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                placeholder="Escribe un mensaje…"
                className="h-8 flex-1 bg-transparent text-sm outline-none"
              />
              <button
                onClick={() => setDraft("")}
                className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground hover:opacity-90"
              >
                <Send className="h-4 w-4" strokeWidth={1.75} />
              </button>
            </div>
          </div>
        </div>

        {/* Panel de pedido */}
        {panel ? (
          <aside className="hidden w-80 shrink-0 overflow-y-auto border-l border-border p-4 lg:block">
            <div className="mb-4 flex items-center justify-between">
              <p className="text-xs font-bold tracking-wide text-muted-foreground uppercase">
                Pedido asociado
              </p>
              <span className="text-sm font-bold">{soles(order.amount)}</span>
            </div>
            <OrderSummary order={order} compact />
            <button className="mt-5 flex w-full items-center justify-center gap-1.5 rounded-lg border border-border py-2.5 text-sm font-semibold hover:bg-muted">
              Ver pedido completo
              <ChevronRight className="h-4 w-4" />
            </button>
          </aside>
        ) : null}
      </div>
    </AppShell>
  );
}
