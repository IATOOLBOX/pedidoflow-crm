import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Calendar, LayoutGrid, List, Search, X } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { StatusBadge } from "@/components/status-badge";
import { OrderSummary, ShippingTag } from "@/components/order-summary";
import {
  CONFIRM_STATUS,
  DELIVERY_STATUS,
  initials,
  orders,
  soles,
  type ConfirmStatus,
  type Order,
} from "@/lib/mock-data";

export const Route = createFileRoute("/pedidos")({
  head: () => ({
    meta: [
      { title: "Pedidos — PedidoFlow" },
      {
        name: "description",
        content:
          "Tablero Kanban y tabla de pedidos contraentrega por estado de confirmación, ciudad y tipo de envío.",
      },
      { property: "og:title", content: "Pedidos — PedidoFlow" },
      {
        property: "og:description",
        content: "Kanban de confirmación, filtros y detalle completo de cada pedido contraentrega.",
      },
    ],
  }),
  component: PedidosPage,
});

const columns: ConfirmStatus[][] = [["pendiente"], ["compromiso"], ["confirmado"], ["noconfirma", "anulado"]];
const columnTitles = ["Pendiente", "Compromiso de pago", "Confirmado", "No confirma / Anulado"];

function OrderCard({ order, onClick }: { order: Order; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="w-full rounded-xl border border-border bg-surface p-3 text-left transition hover:-translate-y-0.5 hover:shadow-[var(--shadow-card)]"
    >
      <div className="flex items-center gap-2.5">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent text-[11px] font-bold text-accent-foreground">
          {initials(order.customer)}
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-[13px] font-semibold">{order.customer}</p>
          <p className="text-[11px] text-muted-foreground">
            {order.number} · {order.city}
          </p>
        </div>
        <span className="text-sm font-bold">{soles(order.amount)}</span>
      </div>
      <div className="mt-2.5 flex items-center justify-between gap-2">
        <ShippingTag type={order.shipping} />
        <span className="text-[11px] text-muted-foreground">{order.age}</span>
      </div>
    </button>
  );
}

function PedidosPage() {
  const [view, setView] = useState<"kanban" | "tabla">("kanban");
  const [status, setStatus] = useState<"todos" | ConfirmStatus>("todos");
  const [shipping, setShipping] = useState<"todos" | "local" | "agencia">("todos");
  const [range, setRange] = useState("7");
  const [q, setQ] = useState("");
  const [selected, setSelected] = useState<Order | null>(null);

  const filtered = useMemo(
    () =>
      orders.filter(
        (o) =>
          (status === "todos" || o.status === status) &&
          (shipping === "todos" || o.shipping === shipping) &&
          (q.trim() === "" ||
            o.customer.toLowerCase().includes(q.toLowerCase()) ||
            o.phone.includes(q) ||
            o.number.includes(q)),
      ),
    [status, shipping, q],
  );

  const selectClass =
    "h-9 rounded-lg border border-border bg-surface px-3 text-sm outline-none focus:border-primary";

  return (
    <AppShell title="Pedidos" subtitle={`${filtered.length} pedidos coinciden con tus filtros`}>
      <div className="card-surface mb-4 flex flex-wrap items-center gap-2 p-3">
        <div className="flex rounded-lg bg-muted p-1">
          {(["kanban", "tabla"] as const).map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium capitalize transition ${
                view === v ? "bg-surface text-foreground shadow-sm" : "text-muted-foreground"
              }`}
            >
              {v === "kanban" ? <LayoutGrid className="h-4 w-4" /> : <List className="h-4 w-4" />}
              {v}
            </button>
          ))}
        </div>

        <div className="relative min-w-[200px] flex-1">
          <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Buscar por nombre, teléfono o # pedido"
            className="h-9 w-full rounded-lg border border-border bg-surface pr-3 pl-9 text-sm outline-none focus:border-primary"
          />
        </div>

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value as ConfirmStatus | "todos")}
          className={selectClass}
        >
          <option value="todos">Todos los estados</option>
          {(Object.keys(CONFIRM_STATUS) as ConfirmStatus[]).map((k) => (
            <option key={k} value={k}>
              {CONFIRM_STATUS[k].label}
            </option>
          ))}
        </select>

        <select
          value={shipping}
          onChange={(e) => setShipping(e.target.value as "todos" | "local" | "agencia")}
          className={selectClass}
        >
          <option value="todos">Todo tipo de envío</option>
          <option value="local">Local (contraentrega)</option>
          <option value="agencia">Agencia (Shalom)</option>
        </select>

        <div className="flex items-center gap-1.5 rounded-lg border border-border bg-surface px-3">
          <Calendar className="h-4 w-4 text-muted-foreground" strokeWidth={1.75} />
          <select
            value={range}
            onChange={(e) => setRange(e.target.value)}
            className="h-9 bg-transparent text-sm outline-none"
          >
            <option value="1">Hoy</option>
            <option value="7">Últimos 7 días</option>
            <option value="30">Últimos 30 días</option>
          </select>
        </div>
      </div>

      {view === "kanban" ? (
        <div className="grid gap-3 xl:grid-cols-4">
          {columns.map((group, i) => {
            const items = filtered.filter((o) => group.includes(o.status));
            const head = group[0] as ConfirmStatus;
            return (
              <section
                key={columnTitles[i]}
                className={`rounded-xl border border-t-4 border-border bg-surface-2 p-3 ${CONFIRM_STATUS[head].column}`}
              >
                <header className="mb-3 flex items-center justify-between px-1">
                  <h2 className="text-sm font-semibold">{columnTitles[i]}</h2>
                  <span className="rounded-full bg-surface px-2 py-0.5 text-[11px] font-bold text-muted-foreground">
                    {items.length}
                  </span>
                </header>
                <div className="space-y-2.5">
                  {items.map((o) => (
                    <OrderCard key={o.id} order={o} onClick={() => setSelected(o)} />
                  ))}
                  {items.length === 0 ? (
                    <p className="rounded-lg border border-dashed border-border py-6 text-center text-xs text-muted-foreground">
                      Sin pedidos
                    </p>
                  ) : null}
                </div>
              </section>
            );
          })}
        </div>
      ) : (
        <div className="card-surface overflow-x-auto">
          <table className="w-full min-w-[900px] text-sm">
            <thead className="border-b border-border bg-surface-2 text-left text-xs text-muted-foreground uppercase">
              <tr>
                {["# Pedido", "Cliente", "Ciudad", "Envío", "Confirmación", "Entrega", "Monto", "Fecha", ""].map(
                  (h) => (
                    <th key={h} className="px-4 py-3 font-semibold">
                      {h}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((o) => (
                <tr key={o.id} className="hover:bg-muted/50">
                  <td className="px-4 py-3 font-semibold">{o.number}</td>
                  <td className="px-4 py-3">{o.customer}</td>
                  <td className="px-4 py-3 text-muted-foreground">{o.city}</td>
                  <td className="px-4 py-3">
                    <ShippingTag type={o.shipping} />
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={o.status} size="sm" />
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{DELIVERY_STATUS[o.delivery]}</td>
                  <td className="px-4 py-3 font-semibold">{soles(o.amount)}</td>
                  <td className="px-4 py-3 text-muted-foreground">{o.createdAt}</td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => setSelected(o)}
                      className="rounded-lg border border-border px-3 py-1.5 text-xs font-semibold hover:bg-muted"
                    >
                      Ver
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {selected ? (
        <div className="fixed inset-0 z-40 flex justify-end">
          <button
            aria-label="Cerrar"
            onClick={() => setSelected(null)}
            className="flex-1 bg-foreground/25 backdrop-blur-[1px]"
          />
          <aside className="animate-in slide-in-from-right w-full max-w-md overflow-y-auto border-l border-border bg-surface p-6 shadow-[var(--shadow-pop)] duration-200 sm:max-w-lg">
            <div className="mb-5 flex items-start justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Detalle del pedido</p>
                <h2 className="text-xl font-bold">{selected.number}</h2>
              </div>
              <button onClick={() => setSelected(null)} className="rounded-lg p-2 hover:bg-muted">
                <X className="h-4 w-4" />
              </button>
            </div>
            <OrderSummary order={selected} />
          </aside>
        </div>
      ) : null}
    </AppShell>
  );
}
