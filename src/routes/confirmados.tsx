import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Calendar, LayoutGrid, List, Search, X, Printer, FileDown, Plus } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { StatusBadge } from "@/components/status-badge";
import { OrderSummary, ShippingTag } from "@/components/order-summary";
import {
  STATUS_STYLES,
  initials,
  orders,
  soles,
  type DeliveryStatus,
  type Order,
} from "@/lib/mock-data";

export const Route = createFileRoute("/confirmados")({
  head: () => ({
    meta: [{ title: "Confirmados y Logística — PedidoFlow" }],
  }),
  component: ConfirmadosPage,
});

const deliveryColumns: DeliveryStatus[][] = [
  ["por_despachar"],
  ["registrado"],
  ["en_transito"],
  ["pendiente_recojo"],
  ["incidencia"],
  ["entregado"],
  ["cancelado"],
];
const deliveryTitles = [
  "Por Despachar",
  "Registrado",
  "En Tránsito",
  "Pendiente de Recojo",
  "Incidencia",
  "Entregado",
  "Cancelado/Devuelto",
];

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

function ConfirmadosPage() {
  const [view, setView] = useState<"kanban" | "tabla">("kanban");
  const [shipping, setShipping] = useState<"todos" | "local" | "agencia">("todos");
  const [range, setRange] = useState("7");
  const [q, setQ] = useState("");
  const [selected, setSelected] = useState<Order | null>(null);

  const filtered = useMemo(
    () =>
      orders.filter(
        (o) =>
          o.status === "confirmado" &&
          (shipping === "todos" || o.shipping === shipping) &&
          (q.trim() === "" ||
            o.customer.toLowerCase().includes(q.toLowerCase()) ||
            o.phone.includes(q) ||
            o.number.includes(q)),
      ),
    [shipping, q],
  );

  const selectClass =
    "h-9 rounded-lg border border-border bg-surface px-3 text-sm outline-none focus:border-primary";

  return (
    <AppShell title="Confirmados" subtitle={`${filtered.length} pedidos confirmados listos para logística`}>
      <div className="card-surface mb-4 flex flex-col gap-3 p-3">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border pb-3">
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-bold text-primary-foreground transition hover:opacity-90">
              <Plus className="h-4 w-4" />
              Pedido Manual
            </button>
            <button className="flex items-center gap-2 rounded-lg border border-border bg-surface px-4 py-2 text-sm font-semibold transition hover:bg-muted">
              <Printer className="h-4 w-4" />
              Imprimir Rótulos
            </button>
            <button className="flex items-center gap-2 rounded-lg border border-border bg-surface px-4 py-2 text-sm font-semibold transition hover:bg-muted">
              <FileDown className="h-4 w-4" />
              Exportar
            </button>
          </div>
          
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
        </div>

        <div className="flex flex-wrap items-center gap-2">
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
      </div>

      {view === "kanban" ? (
        <div className="grid gap-3 xl:grid-cols-4">
          {deliveryColumns.map((group, i) => {
            const items = filtered.filter((o) => (group as DeliveryStatus[]).includes(o.delivery));
            const head = group[0] as DeliveryStatus;
            const colorClass = STATUS_STYLES[head]?.column || "";
            const title = deliveryTitles[i] || "";

            return (
              <section
                key={title}
                className={`rounded-xl border border-t-4 border-border bg-surface-2 p-3 ${colorClass}`}
              >
                <header className="mb-3 flex items-center justify-between px-1">
                  <h2 className="text-sm font-semibold">{title}</h2>
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
                  <td className="px-4 py-3 font-semibold">
                    <div className="flex items-center gap-2">
                      <input type="checkbox" className="rounded border-border text-primary" />
                      {o.number}
                    </div>
                  </td>
                  <td className="px-4 py-3">{o.customer}</td>
                  <td className="px-4 py-3 text-muted-foreground">{o.city}</td>
                  <td className="px-4 py-3">
                    <ShippingTag type={o.shipping} />
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={o.status} size="sm" />
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{STATUS_STYLES[o.delivery]?.label}</td>
                  <td className="px-4 py-3 font-semibold">{soles(o.amount)}</td>
                  <td className="px-4 py-3 text-muted-foreground">{o.createdAt}</td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => setSelected(o)}
                      className="rounded-lg border border-border px-3 py-1.5 text-xs font-semibold hover:bg-muted"
                    >
                      Gestionar
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
