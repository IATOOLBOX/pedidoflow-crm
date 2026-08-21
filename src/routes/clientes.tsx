import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { MessageCircle, Search, Star, X } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { StatusBadge } from "@/components/status-badge";
import { customers, initials, orders, soles, type Customer } from "@/lib/mock-data";

export const Route = createFileRoute("/clientes")({
  head: () => ({
    meta: [
      { title: "Clientes — PedidoFlow" },
      {
        name: "description",
        content:
          "Historial de clientes contraentrega: pedidos totales, confirmados, última compra y clientes recurrentes.",
      },
      { property: "og:title", content: "Clientes — PedidoFlow" },
      {
        property: "og:description",
        content: "Conoce a tus compradores recurrentes y su historial de pedidos y conversaciones.",
      },
    ],
  }),
  component: ClientesPage,
});

function ClientesPage() {
  const [q, setQ] = useState("");
  const [sel, setSel] = useState<Customer | null>(null);
  const list = customers.filter(
    (c) => c.name.toLowerCase().includes(q.toLowerCase()) || c.phone.includes(q),
  );
  const history = sel ? orders.filter((o) => o.customer === sel.name) : [];

  return (
    <AppShell title="Clientes" subtitle={`${customers.length} clientes registrados en tu tienda`}>
      <div className="card-surface mb-4 p-3">
        <div className="relative max-w-sm">
          <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Buscar cliente o teléfono"
            className="h-9 w-full rounded-lg border border-border bg-surface pr-3 pl-9 text-sm outline-none focus:border-primary"
          />
        </div>
      </div>

      <div className="card-surface overflow-x-auto">
        <table className="w-full min-w-[820px] text-sm">
          <thead className="border-b border-border bg-surface-2 text-left text-xs text-muted-foreground uppercase">
            <tr>
              {["Cliente", "Teléfono", "Ciudad", "Pedidos", "Confirmados", "Última compra", "Tag"].map(
                (h) => (
                  <th key={h} className="px-4 py-3 font-semibold">
                    {h}
                  </th>
                ),
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {list.map((c) => (
              <tr
                key={c.id}
                onClick={() => setSel(c)}
                className="cursor-pointer hover:bg-muted/50"
              >
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2.5">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-accent text-[11px] font-bold text-accent-foreground">
                      {initials(c.name)}
                    </span>
                    <span className="font-medium">{c.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-muted-foreground">{c.phone}</td>
                <td className="px-4 py-3 text-muted-foreground">{c.city}</td>
                <td className="px-4 py-3 font-semibold">{c.total}</td>
                <td className="px-4 py-3 font-semibold text-status-confirmado">{c.confirmed}</td>
                <td className="px-4 py-3 text-muted-foreground">{c.lastPurchase}</td>
                <td className="px-4 py-3">
                  {c.recurrent ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-primary-soft px-2 py-0.5 text-[11px] font-semibold text-accent-foreground">
                      <Star className="h-3 w-3" strokeWidth={2} />
                      Recurrente
                    </span>
                  ) : (
                    <span className="text-xs text-muted-foreground">—</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {sel ? (
        <div className="fixed inset-0 z-40 flex justify-end">
          <button
            aria-label="Cerrar"
            onClick={() => setSel(null)}
            className="flex-1 bg-foreground/25"
          />
          <aside className="animate-in slide-in-from-right w-full max-w-md overflow-y-auto border-l border-border bg-surface p-6 shadow-[var(--shadow-pop)] duration-200">
            <div className="mb-5 flex items-start justify-between">
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                  {initials(sel.name)}
                </span>
                <div>
                  <h2 className="text-lg font-bold">{sel.name}</h2>
                  <p className="text-xs text-muted-foreground">
                    {sel.phone} · {sel.city}
                  </p>
                </div>
              </div>
              <button onClick={() => setSel(null)} className="rounded-lg p-2 hover:bg-muted">
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center">
              {[
                ["Pedidos", sel.total],
                ["Confirmados", sel.confirmed],
                ["Última", sel.lastPurchase.slice(0, 6)],
              ].map(([l, v]) => (
                <div key={String(l)} className="rounded-xl border border-border bg-surface-2 p-3">
                  <p className="text-lg font-bold">{v}</p>
                  <p className="text-[11px] text-muted-foreground">{l}</p>
                </div>
              ))}
            </div>

            <h3 className="mt-6 mb-2 text-xs font-bold tracking-wide text-muted-foreground uppercase">
              Historial de pedidos
            </h3>
            <ul className="space-y-2">
              {history.length ? (
                history.map((o) => (
                  <li
                    key={o.id}
                    className="flex items-center gap-3 rounded-xl border border-border p-3"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold">{o.number}</p>
                      <p className="text-[11px] text-muted-foreground">{o.createdAt}</p>
                    </div>
                    <StatusBadge status={o.status} size="sm" />
                    <span className="text-sm font-semibold">{soles(o.amount)}</span>
                  </li>
                ))
              ) : (
                <li className="rounded-xl border border-dashed border-border p-4 text-center text-xs text-muted-foreground">
                  Sin pedidos en el rango actual
                </li>
              )}
            </ul>

            <button className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90">
              <MessageCircle className="h-4 w-4" strokeWidth={1.75} />
              Ver conversaciones
            </button>
          </aside>
        </div>
      ) : null}
    </AppShell>
  );
}
