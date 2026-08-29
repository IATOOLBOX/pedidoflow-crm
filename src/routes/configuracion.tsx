import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { MapPin, Plus, Trash2, Workflow, ArrowRight } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { EquipoSection } from "@/components/equipo-section";
import { CoberturaSection } from "@/components/cobertura-section";

export const Route = createFileRoute("/configuracion")({
  head: () => ({
    meta: [
      { title: "Configuración — PedidoFlow" },
      {
        name: "description",
        content:
          "Configura cobertura de envíos (Shalom vs Local), recordatorios de WhatsApp, monto de adelanto, equipo y plan de PedidoFlow.",
      },
      { property: "og:title", content: "Configuración — PedidoFlow" },
      {
        property: "og:description",
        content: "Reglas de contraentrega, cobertura de envíos, equipo y facturación.",
      },
    ],
  }),
  component: ConfiguracionPage,
});

const tabs = [
  "Datos de la tienda",
  "Cobertura de envíos",
  "Seguimiento",
  "Adelanto",
  "Equipo y roles",
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
              className={`rounded-lg px-3 py-2.5 text-left text-sm font-medium whitespace-nowrap transition cursor-pointer ${
                tab === t ? "bg-accent text-accent-foreground font-semibold" : "text-muted-foreground hover:bg-muted"
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
                  <button className="rounded-lg border border-border px-3 py-2 text-sm font-semibold hover:bg-muted cursor-pointer">
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

          {tab === "Cobertura de envíos" ? (
            <CoberturaSection />
          ) : null}

          {tab === "Seguimiento" ? (
            <div className="max-w-lg space-y-5">
              <div className="rounded-xl border border-primary/30 bg-primary/10 p-4">
                <div className="flex items-center gap-2 text-primary font-bold text-sm mb-1">
                  <Workflow className="h-4 w-4" />
                  Nuevo: Constructor Visual de Workflows
                </div>
                <p className="text-xs text-muted-foreground mb-3 leading-relaxed">
                  Ahora puedes configurar secuencias avanzadas de Rompevistas, condiciones por visto y simular la experiencia del cliente en WhatsApp directamente desde la nueva vista de Workflows.
                </p>
                <Link
                  to="/workflows"
                  className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-bold text-primary-foreground hover:opacity-90 transition"
                >
                  Abrir Workflows
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>

              <div>
                <h2 className="text-base font-bold">Seguimiento de mensajes (Básico)</h2>
                <p className="text-sm text-muted-foreground">
                  Reglas rápidas para recordatorios automáticos cuando el cliente no responde.
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

          {tab === "Equipo y roles" ? (
            <div className="space-y-4">
              <div className="border-b border-border pb-3">
                <h2 className="text-base font-extrabold text-foreground">Gestión de Equipo, Roles y Accesos</h2>
                <p className="text-xs text-muted-foreground">
                  Administra quiénes tienen acceso al CRM, define las funciones de tu personal y limita los módulos del sistema por usuario.
                </p>
              </div>
              <EquipoSection />
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
