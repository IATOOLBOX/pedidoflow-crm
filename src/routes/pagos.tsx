import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Check, Hash, Image as ImageIcon, Inbox, X } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { initials, payments, soles } from "@/lib/mock-data";

export const Route = createFileRoute("/pagos")({
  head: () => ({
    meta: [
      { title: "Pagos por verificar — PedidoFlow" },
      {
        name: "description",
        content:
          "Cola de verificación de adelantos: revisa capturas de Yape, Plin y transferencias, y aprueba o rechaza en un clic.",
      },
      { property: "og:title", content: "Pagos por verificar — PedidoFlow" },
      {
        property: "og:description",
        content: "Aprueba o rechaza adelantos contraentrega con la captura del cliente a la vista.",
      },
    ],
  }),
  component: PagosPage,
});

function PagosPage() {
  const [queue, setQueue] = useState(payments);
  const [leaving, setLeaving] = useState<Record<string, "ok" | "no">>({});
  const [done, setDone] = useState({ ok: 0, no: 0 });

  const resolve = (id: string, kind: "ok" | "no") => {
    setLeaving((p) => ({ ...p, [id]: kind }));
    setTimeout(() => {
      setQueue((q) => q.filter((p) => p.id !== id));
      setDone((d) => ({ ...d, [kind]: d[kind] + 1 }));
    }, 380);
  };

  return (
    <AppShell
      title="Pagos por verificar"
      subtitle="Adelantos contraentrega reportados por los clientes vía WhatsApp"
    >
      <div className="mb-4 grid gap-3 sm:grid-cols-3">
        <div className="card-surface p-4">
          <p className="text-2xl font-bold">{queue.length}</p>
          <p className="text-sm text-muted-foreground">En cola</p>
        </div>
        <div className="card-surface p-4">
          <p className="text-2xl font-bold text-status-confirmado">{done.ok}</p>
          <p className="text-sm text-muted-foreground">Aprobados en esta sesión</p>
        </div>
        <div className="card-surface p-4">
          <p className="text-2xl font-bold text-status-noconfirma">{done.no}</p>
          <p className="text-sm text-muted-foreground">Rechazados en esta sesión</p>
        </div>
      </div>

      <div className="space-y-3">
        {queue.map((p) => {
          const out = leaving[p.id];
          return (
            <article
              key={p.id}
              className={`card-surface flex flex-col gap-4 p-4 transition-all duration-300 sm:flex-row sm:items-center ${
                out === "ok"
                  ? "translate-x-8 border-status-confirmado opacity-0"
                  : out === "no"
                    ? "-translate-x-8 border-status-noconfirma opacity-0"
                    : ""
              }`}
            >
              <div className="flex h-24 w-20 shrink-0 flex-col items-center justify-center gap-1 rounded-lg border border-dashed border-border bg-surface-2 text-[10px] text-muted-foreground">
                <ImageIcon className="h-6 w-6" strokeWidth={1.5} />
                Captura
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2.5">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-accent text-[11px] font-bold text-accent-foreground">
                    {initials(p.customer)}
                  </span>
                  <div>
                    <p className="text-sm font-semibold">{p.customer}</p>
                    <p className="text-xs text-muted-foreground">
                      Pedido {p.orderNumber} · {p.city} · {p.sentAt}
                    </p>
                  </div>
                </div>
                <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
                  <span className="rounded-md bg-muted px-2 py-1 font-medium">{p.method}</span>
                  <span className="inline-flex items-center gap-1 rounded-md bg-muted px-2 py-1 text-muted-foreground">
                    <Hash className="h-3 w-3" />
                    {p.operation ?? "N° de operación no detectado"}
                  </span>
                </div>
              </div>

              <p className="text-xl font-bold sm:mr-4">{soles(p.amount)}</p>

              <div className="flex shrink-0 gap-2">
                <button
                  onClick={() => resolve(p.id, "ok")}
                  className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-status-confirmado px-5 py-2.5 text-sm font-bold text-surface hover:opacity-90"
                >
                  <Check className="h-4 w-4" strokeWidth={2.5} />
                  Aprobar
                </button>
                <button
                  onClick={() => resolve(p.id, "no")}
                  className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-status-noconfirma/40 bg-status-noconfirma-soft px-5 py-2.5 text-sm font-bold text-status-noconfirma hover:opacity-90"
                >
                  <X className="h-4 w-4" strokeWidth={2.5} />
                  Rechazar
                </button>
              </div>
            </article>
          );
        })}

        {queue.length === 0 ? (
          <div className="card-surface flex flex-col items-center gap-2 py-16 text-center">
            <Inbox className="h-10 w-10 text-muted-foreground" strokeWidth={1.25} />
            <p className="text-sm font-semibold">No quedan pagos por verificar</p>
            <p className="text-xs text-muted-foreground">
              Te avisaremos apenas llegue una nueva captura por WhatsApp.
            </p>
          </div>
        ) : null}
      </div>
    </AppShell>
  );
}
