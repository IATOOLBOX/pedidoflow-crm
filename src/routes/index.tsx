import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  Clock,
  ReceiptText,
  ShoppingBag,
  TrendingUp,
} from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { StatusDot } from "@/components/status-badge";
import {
  CONFIRM_STATUS,
  activity,
  orders,
  payments,
  soles,
  type ConfirmStatus,
} from "@/lib/mock-data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard — PedidoFlow CRM contraentrega" },
      {
        name: "description",
        content:
          "Panel diario de PedidoFlow: pedidos nuevos, confirmaciones por WhatsApp y pagos por verificar para tiendas Shopify en Perú.",
      },
      { property: "og:title", content: "Dashboard — PedidoFlow CRM contraentrega" },
      {
        property: "og:description",
        content: "Controla pedidos contraentrega, confirmaciones por WhatsApp y adelantos en un solo panel.",
      },
    ],
  }),
  component: Dashboard,
});

const counts = (Object.keys(CONFIRM_STATUS) as ConfirmStatus[]).map((k) => ({
  key: k,
  label: CONFIRM_STATUS[k].label,
  value: orders.filter((o) => o.status === k).length,
}));
const maxCount = Math.max(...counts.map((c) => c.value));

function Metric({
  label,
  value,
  hint,
  icon: Icon,
  alert = false,
}: {
  label: string;
  value: string;
  hint: string;
  icon: typeof Clock;
  alert?: boolean;
}) {
  return (
    <div className="card-surface p-5">
      <div className="flex items-start justify-between">
        <div
          className={`flex h-9 w-9 items-center justify-center rounded-lg ${
            alert ? "bg-status-compromiso-soft text-status-compromiso" : "bg-accent text-accent-foreground"
          }`}
        >
          <Icon className="h-[18px] w-[18px]" strokeWidth={1.75} />
        </div>
        {alert ? (
          <span className="rounded-full bg-status-compromiso px-2 py-0.5 text-[10px] font-bold text-surface">
            Requiere acción
          </span>
        ) : null}
      </div>
      <p className="mt-4 text-3xl font-bold tracking-tight">{value}</p>
      <p className="text-sm font-medium">{label}</p>
      <p className="mt-1 text-xs text-muted-foreground">{hint}</p>
    </div>
  );
}

function Dashboard() {
  const nuevos = orders.filter((o) => o.age.includes("min") || o.age.includes("h")).length;
  const pendientes = orders.filter((o) => o.status === "pendiente").length;
  const confirmados = orders.filter((o) => o.status === "confirmado").length;
  const tasa = Math.round((confirmados / orders.length) * 100);

  return (
    <AppShell title="Buenos días, Andrea 👋" subtitle="Este es el resumen de tu tienda hoy, 21 de agosto.">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <Metric label="Pedidos nuevos hoy" value={String(nuevos)} hint="Desde Shopify" icon={ShoppingBag} />
        <Metric
          label="Pendientes de confirmar"
          value={String(pendientes)}
          hint="El bot ya los contactó"
          icon={Clock}
        />
        <Metric
          label="Pagos por verificar"
          value={String(payments.length)}
          hint="Capturas de Yape / Plin"
          icon={ReceiptText}
          alert
        />
        <Metric
          label="Confirmados hoy"
          value={String(confirmados)}
          hint="Listos para despachar"
          icon={CheckCircle2}
        />
        <Metric label="Tasa de confirmación" value={`${tasa}%`} hint="+6 pts vs. ayer" icon={TrendingUp} />
      </div>

      <div className="mt-4 flex flex-col gap-4 rounded-xl border border-status-compromiso/30 bg-status-compromiso-soft p-4 sm:flex-row sm:items-center">
        <ReceiptText className="h-6 w-6 text-status-compromiso" strokeWidth={1.75} />
        <div className="flex-1">
          <p className="text-sm font-semibold text-foreground">
            {payments.length} pagos esperando verificación
          </p>
          <p className="text-xs text-muted-foreground">
            Suman {soles(payments.reduce((a, p) => a + p.amount, 0))} en adelantos sin aprobar.
          </p>
        </div>
        <Link
          to="/pagos"
          className="inline-flex items-center gap-1.5 rounded-lg bg-status-compromiso px-4 py-2 text-sm font-semibold text-surface hover:opacity-90"
        >
          Verificar ahora
          <ArrowRight className="h-4 w-4" strokeWidth={2} />
        </Link>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-5">
        <section className="card-surface p-5 lg:col-span-3">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold">Pedidos por estado</h2>
            <Link to="/pedidos" className="text-xs font-semibold text-primary hover:underline">
              Ver tablero
            </Link>
          </div>
          <div className="mt-6 space-y-4">
            {counts.map((c) => (
              <div key={c.key} className="flex items-center gap-3">
                <div className="flex w-44 items-center gap-2 text-sm">
                  <StatusDot status={c.key} />
                  <span className="truncate">{c.label}</span>
                </div>
                <div className="h-3 flex-1 overflow-hidden rounded-full bg-muted">
                  <div
                    className={`h-full rounded-full ${CONFIRM_STATUS[c.key].dot}`}
                    style={{ width: `${(c.value / maxCount) * 100}%` }}
                  />
                </div>
                <span className="w-6 text-right text-sm font-semibold tabular-nums">{c.value}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="card-surface p-5 lg:col-span-2">
          <h2 className="text-base font-semibold">Actividad reciente</h2>
          <ul className="mt-4 space-y-4">
            {activity.map((a) => (
              <li key={a.id} className="flex gap-3">
                <span className="mt-1.5">
                  <StatusDot status={a.tone} />
                </span>
                <div className="min-w-0">
                  <p className="text-sm leading-5">{a.text}</p>
                  <p className="text-[11px] text-muted-foreground">{a.time}</p>
                </div>
              </li>
            ))}
          </ul>
          <Link
            to="/conversaciones"
            className="mt-5 inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
          >
            Ir al inbox de WhatsApp
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </section>
      </div>
    </AppShell>
  );
}
