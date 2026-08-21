import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { MapPin, Plus, Trash2 } from "lucide-react";
import { AppShell } from "@/components/app-shell";

export const Route = createFileRoute("/configuracion")({
  head: () => ({
    meta: [
      { title: "Configuración — PedidoFlow" },
      {
        name: "description",
        content:
          "Configura zonas locales vs. agencia, recordatorios de WhatsApp, monto de adelanto, equipo y plan de PedidoFlow.",
      },
      { property: "og:title", content: "Configuración — PedidoFlow" },
      {
        property: "og:description",
        content: "Reglas de contraentrega, seguimiento de mensajes, equipo y facturación.",
      },
    ],
  }),
  component: ConfiguracionPage,
});

const tabs = [
  "Datos de la tienda",
  "Reglas de contraentrega",
  "Seguimiento",
  "Adelanto",
  "Equipo",
  "Plan y facturación",
] as const;

const inputCls =
  "h-10 w-full rounded-lg border border-border bg-surface px-3 text-sm outline-none focus:border-primary";
const labelCls = "mb-1.5 block text-xs font-semibold";

function ConfiguracionPage() {
  const [tab, setTab] = useState<(typeof tabs)[number]>("Datos de la tienda");
  const [reminders, setReminders] = useState(3);
  const [gap, setGap] = useState(4);
  const [advance, setAdvance] = useState(25);

  return (
    <AppShell title="Configuración" subtitle="Ajusta cómo trabaja PedidoFlow con tu operación">
      <div className="flex flex-col gap-4 lg:flex-row">
        <nav className="card-surface flex shrink-0 gap-1 overflow-x-auto p-2 lg:w-60 lg:flex-col">
          {tabs.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`rounded-lg px-3 py-2.5 text-left text-sm font-medium whitespace-nowrap transition ${
                tab === t ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:bg-muted"
              }`}
            >
              {t}
            </button>
          ))}
        </nav>

        <section className="card-surface flex-1 p-6">
          {tab === "Datos de la tienda" ? (
            <div className="max-w-md space-y-4">
              <h2 className="text-base font-bold">Datos de la tienda</h2>
              <div>
                <label className={labelCls}>Nombre comercial</label>
                <input defaultValue="Tienda Andina" className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Logo</label>
                <div className="flex items-center gap-3">
                  <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary text-sm font-bold text-primary-foreground">
                    TA
                  </div>
                  <button className="rounded-lg border border-border px-3 py-2 text-sm font-semibold hover:bg-muted">
                    Subir imagen
                  </button>
                </div>
              </div>
              <div>
                <label className={labelCls}>Moneda</label>
                <select className={inputCls}>
                  <option>Soles (S/)</option>
                  <option>Dólares (US$)</option>
                </select>
              </div>
            </div>
          ) : null}

          {tab === "Reglas de contraentrega" ? (
            <div className="space-y-5">
              <div>
                <h2 className="text-base font-bold">Zonas de entrega</h2>
                <p className="text-sm text-muted-foreground">
                  Define qué ciudades se atienden con motorizado local y cuáles se envían por agencia.
                </p>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                {[
                  { title: "Local (contraentrega)", zones: ["Lima Centro", "Miraflores", "San Miguel", "Los Olivos", "Comas"] },
                  { title: "Agencia (Shalom)", zones: ["Arequipa", "Trujillo", "Cusco", "Piura", "Chiclayo"] },
                ].map((g) => (
                  <div key={g.title} className="rounded-xl border border-border p-4">
                    <p className="mb-3 text-sm font-semibold">{g.title}</p>
                    <ul className="space-y-2">
                      {g.zones.map((z) => (
                        <li
                          key={z}
                          className="flex items-center gap-2 rounded-lg bg-surface-2 px-3 py-2 text-sm"
                        >
                          <MapPin className="h-4 w-4 text-muted-foreground" strokeWidth={1.75} />
                          {z}
                          <button className="ml-auto text-muted-foreground hover:text-destructive">
                            <Trash2 className="h-4 w-4" strokeWidth={1.75} />
                          </button>
                        </li>
                      ))}
                    </ul>
                    <button className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline">
                      <Plus className="h-3.5 w-3.5" /> Agregar zona
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          {tab === "Seguimiento" ? (
            <div className="max-w-lg space-y-5">
              <div>
                <h2 className="text-base font-bold">Seguimiento de mensajes</h2>
                <p className="text-sm text-muted-foreground">
                  Recordatorios automáticos cuando el cliente no responde.
                </p>
              </div>
              <div>
                <label className={labelCls}>Cantidad de recordatorios</label>
                <div className="flex gap-2">
                  {[1, 2, 3].map((n) => (
                    <button
                      key={n}
                      onClick={() => setReminders(n)}
                      className={`h-10 flex-1 rounded-lg border text-sm font-semibold transition ${
                        reminders === n
                          ? "border-primary bg-primary-soft text-accent-foreground"
                          : "border-border hover:bg-muted"
                      }`}
                    >
                      {n}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className={labelCls}>Cada cuántas horas: {gap} h</label>
                <input
                  type="range"
                  min={1}
                  max={24}
                  value={gap}
                  onChange={(e) => setGap(Number(e.target.value))}
                  className="w-full accent-[var(--primary)]"
                />
              </div>
              <div className="rounded-xl bg-surface-2 p-4">
                <p className="mb-3 text-[11px] font-bold text-muted-foreground uppercase">
                  Vista previa de la secuencia
                </p>
                <ol className="space-y-2 text-sm">
                  <li className="flex gap-2">
                    <span className="font-semibold text-primary">0 h</span> Mensaje de confirmación
                    inicial
                  </li>
                  {Array.from({ length: reminders }).map((_, i) => (
                    <li key={i} className="flex gap-2">
                      <span className="font-semibold text-primary">{gap * (i + 1)} h</span>
                      Recordatorio {i + 1} de {reminders}
                    </li>
                  ))}
                  <li className="flex gap-2 text-muted-foreground">
                    <span className="font-semibold">{gap * (reminders + 1)} h</span>
                    Pedido marcado como “No confirma”
                  </li>
                </ol>
              </div>
            </div>
          ) : null}

          {tab === "Adelanto" ? (
            <div className="max-w-sm space-y-4">
              <h2 className="text-base font-bold">Monto de adelanto</h2>
              <p className="text-sm text-muted-foreground">
                Se solicita al cliente antes de despachar pedidos por agencia.
              </p>
              <div>
                <label className={labelCls}>Monto por defecto (S/)</label>
                <input
                  type="number"
                  value={advance}
                  onChange={(e) => setAdvance(Number(e.target.value))}
                  className={inputCls}
                />
              </div>
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" defaultChecked className="accent-[var(--primary)]" />
                Exigir adelanto solo en envíos por agencia
              </label>
            </div>
          ) : null}

          {tab === "Equipo" ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-bold">Equipo</h2>
                <button className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90">
                  <Plus className="h-4 w-4" /> Invitar usuario
                </button>
              </div>
              <ul className="divide-y divide-border rounded-xl border border-border">
                {[
                  ["Andrea Vega", "andrea@tiendaandina.pe", "Administradora"],
                  ["Luis Quiroz", "luis@tiendaandina.pe", "Agente de ventas"],
                  ["Karina Soto", "karina@tiendaandina.pe", "Verificación de pagos"],
                ].map(([n, e, r]) => (
                  <li key={e} className="flex items-center gap-3 px-4 py-3">
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-accent text-[11px] font-bold text-accent-foreground">
                      {n!.split(" ").map((w) => w[0]).join("")}
                    </span>
                    <div className="min-w-0">
                      <p className="text-sm font-medium">{n}</p>
                      <p className="text-xs text-muted-foreground">{e}</p>
                    </div>
                    <span className="ml-auto rounded-full bg-muted px-2.5 py-1 text-[11px] font-semibold">
                      {r}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          {tab === "Plan y facturación" ? (
            <div className="max-w-md space-y-4">
              <h2 className="text-base font-bold">Plan y facturación</h2>
              <div className="rounded-xl border border-primary/30 bg-primary-soft p-5">
                <p className="text-xs font-semibold text-accent-foreground">Plan actual</p>
                <p className="mt-1 text-2xl font-bold">Crece · S/ 149 / mes</p>
                <p className="mt-1 text-sm text-muted-foreground">Renueva el 5 de setiembre de 2026</p>
                <div className="mt-4">
                  <div className="flex justify-between text-xs font-medium">
                    <span>Conversaciones este mes</span>
                    <span>1,840 / 3,000</span>
                  </div>
                  <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-surface">
                    <div className="h-full w-[61%] rounded-full bg-primary" />
                  </div>
                </div>
              </div>
              <button className="w-full rounded-lg bg-primary py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90">
                Mejorar a plan Escala
              </button>
            </div>
          ) : null}
        </section>
      </div>
    </AppShell>
  );
}
