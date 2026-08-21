import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { CheckCircle2, Clock3, Plus, X, XCircle } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { templates, type Template } from "@/lib/mock-data";

export const Route = createFileRoute("/plantillas")({
  head: () => ({
    meta: [
      { title: "Plantillas de WhatsApp — PedidoFlow" },
      {
        name: "description",
        content:
          "Gestiona plantillas de WhatsApp aprobadas por Meta para confirmar pedidos, pedir adelantos y enviar guías Shalom.",
      },
      { property: "og:title", content: "Plantillas de WhatsApp — PedidoFlow" },
      {
        property: "og:description",
        content: "Plantillas de utilidad, marketing y autenticación con su estado de aprobación en Meta.",
      },
    ],
  }),
  component: PlantillasPage,
});

const statusStyles: Record<Template["status"], { cls: string; icon: typeof Clock3 }> = {
  Aprobada: {
    cls: "bg-status-confirmado-soft text-status-confirmado border-status-confirmado/30",
    icon: CheckCircle2,
  },
  "En revisión": {
    cls: "bg-status-compromiso-soft text-status-compromiso border-status-compromiso/30",
    icon: Clock3,
  },
  Rechazada: {
    cls: "bg-status-noconfirma-soft text-status-noconfirma border-status-noconfirma/30",
    icon: XCircle,
  },
};

function highlight(body: string) {
  return body.split(/(\{\{[a-z_]+\}\})/g).map((part, i) =>
    part.startsWith("{{") ? (
      <span key={i} className="rounded bg-primary-soft px-1 font-mono text-[12px] text-accent-foreground">
        {part}
      </span>
    ) : (
      <span key={i}>{part}</span>
    ),
  );
}

function PlantillasPage() {
  const [open, setOpen] = useState(false);
  const [body, setBody] = useState(
    "Hola {{nombre_cliente}}, tu pedido {{numero_pedido}} está listo para confirmar.",
  );

  return (
    <AppShell
      title="Plantillas de WhatsApp"
      subtitle="Mensajes aprobados por Meta para escribir fuera de la ventana de 24 horas"
    >
      <div className="mb-4 flex justify-end">
        <button
          onClick={() => setOpen(true)}
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90"
        >
          <Plus className="h-4 w-4" strokeWidth={2} />
          Crear nueva plantilla
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {templates.map((t) => {
          const s = statusStyles[t.status];
          const Icon = s.icon;
          return (
            <article key={t.id} className="card-surface flex flex-col p-5">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h2 className="font-mono text-sm font-semibold">{t.name}</h2>
                  <p className="mt-0.5 text-[11px] text-muted-foreground">{t.category}</p>
                </div>
                <span
                  className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-semibold ${s.cls}`}
                >
                  <Icon className="h-3 w-3" strokeWidth={2} />
                  {t.status}
                </span>
              </div>
              <p className="mt-4 flex-1 rounded-xl bg-surface-2 p-3 text-sm leading-5">
                {highlight(t.body)}
              </p>
              <p className="mt-3 text-[11px] text-muted-foreground">
                {t.sent.toLocaleString("es-PE")} envíos este mes
              </p>
            </article>
          );
        })}
      </div>

      {open ? (
        <div className="fixed inset-0 z-40 flex items-center justify-center p-4">
          <button aria-label="Cerrar" onClick={() => setOpen(false)} className="absolute inset-0 bg-foreground/30" />
          <div className="card-surface relative w-full max-w-lg p-6">
            <div className="mb-5 flex items-start justify-between">
              <div>
                <h2 className="text-lg font-bold">Nueva plantilla</h2>
                <p className="text-xs text-muted-foreground">
                  Meta revisa las plantillas en un plazo aproximado de 24 horas.
                </p>
              </div>
              <button onClick={() => setOpen(false)} className="rounded-lg p-2 hover:bg-muted">
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="mb-1.5 block text-xs font-semibold">Nombre</label>
                <input
                  defaultValue="confirmacion_pedido_v4"
                  className="h-10 w-full rounded-lg border border-border bg-surface px-3 font-mono text-sm outline-none focus:border-primary"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold">Categoría</label>
                <select className="h-10 w-full rounded-lg border border-border bg-surface px-3 text-sm outline-none focus:border-primary">
                  <option>Utilidad</option>
                  <option>Marketing</option>
                  <option>Autenticación</option>
                </select>
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold">Mensaje</label>
                <textarea
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  rows={4}
                  className="w-full resize-none rounded-lg border border-border bg-surface p-3 text-sm outline-none focus:border-primary"
                />
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {["{{nombre_cliente}}", "{{numero_pedido}}", "{{monto}}", "{{ciudad}}"].map((v) => (
                    <button
                      key={v}
                      onClick={() => setBody((b) => `${b} ${v}`)}
                      className="rounded-md bg-muted px-2 py-1 font-mono text-[11px] hover:bg-accent"
                    >
                      {v}
                    </button>
                  ))}
                </div>
              </div>
              <div className="rounded-xl bg-surface-2 p-3">
                <p className="mb-1 text-[11px] font-bold text-muted-foreground uppercase">Vista previa</p>
                <p className="text-sm leading-5">{highlight(body)}</p>
              </div>
            </div>

            <div className="mt-6 flex gap-2">
              <button
                onClick={() => setOpen(false)}
                className="flex-1 rounded-lg bg-primary py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90"
              >
                Enviar a revisión
              </button>
              <button
                onClick={() => setOpen(false)}
                className="rounded-lg border border-border px-4 py-2.5 text-sm font-semibold hover:bg-muted"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </AppShell>
  );
}
