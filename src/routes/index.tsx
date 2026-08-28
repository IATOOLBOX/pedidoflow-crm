import { useState, useMemo } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { DateRange } from "react-day-picker";
import { subDays } from "date-fns";
import {
  ArrowRight,
  ArrowUpRight,
  Calendar,
  CheckCircle2,
  Clock,
  Filter,
  MessageCircle,
  Package,
  ReceiptText,
  RotateCcw,
  ShoppingBag,
  TrendingUp,
  Truck,
  XCircle,
} from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { DateRangePicker } from "@/components/date-range-picker";
import { StatusDot } from "@/components/status-badge";
import {
  STATUS_STYLES,
  activity,
  orders,
  payments,
  soles,
  type OrderStatus,
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

const counts = (Object.keys(STATUS_STYLES) as OrderStatus[])
  .map((k) => ({
    key: k,
    label: STATUS_STYLES[k]?.label || k,
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

interface FunnelStep {
  label: string;
  value: number;
  isDrop?: boolean;
  highlight?: boolean;
}

function FunnelChart({ data }: { data: FunnelStep[] }) {
  const max = data[0]?.value || 1;

  return (
    <div className="w-full space-y-2 py-2">
      {data.map((d, i) => {
        const pct = Math.max(14, Math.round((d.value / max) * 100));
        const prev = data[i - 1]?.value ?? d.value;
        const conversionFromPrev = prev > 0 ? Math.round((d.value / prev) * 100) : 0;
        const dropCount = Math.max(0, prev - d.value);

        return (
          <div key={d.label} className="group">
            {/* Conector / Tasa de paso entre etapas */}
            {i > 0 && (
              <div className="flex items-center justify-center my-1">
                <div className="flex items-center gap-2 rounded-full border border-border/80 bg-surface px-2.5 py-0.5 text-[11px] font-medium text-muted-foreground shadow-xs group-hover:border-primary/40 transition">
                  {d.isDrop ? (
                    <span className="flex items-center gap-1 text-rose-500 font-semibold">
                      <XCircle className="h-3 w-3" /> Fuga / Descarte: {d.value} pedidos
                    </span>
                  ) : (
                    <>
                      <span className="font-semibold text-foreground">{conversionFromPrev}% pasan</span>
                      {dropCount > 0 && (
                        <span className="text-muted-foreground/80">(-{dropCount} clientes)</span>
                      )}
                    </>
                  )}
                </div>
              </div>
            )}

            {/* Barra de la etapa */}
            <div className="relative flex items-center rounded-xl border border-border/60 bg-surface-2 p-2.5 shadow-xs transition hover:border-primary/40 hover:bg-surface">
              {/* Barra de progreso de fondo */}
              <div
                className={`absolute inset-y-0 left-0 rounded-lg opacity-15 transition-all duration-700 ${
                  d.isDrop
                    ? "bg-rose-500"
                    : d.highlight
                    ? "bg-emerald-500"
                    : "bg-primary"
                }`}
                style={{ width: `${pct}%` }}
              />

              <div className="relative z-10 flex w-full items-center justify-between gap-3">
                <div className="flex items-center gap-2.5 min-w-0">
                  <span
                    className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-bold ${
                      d.isDrop
                        ? "bg-rose-100 text-rose-600 dark:bg-rose-950 dark:text-rose-400"
                        : d.highlight
                        ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400"
                        : "bg-accent text-accent-foreground"
                    }`}
                  >
                    {i + 1}
                  </span>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-foreground truncate">
                        {d.label}
                      </span>
                      {d.isDrop && (
                        <span className="rounded-md bg-rose-50 px-1.5 py-0.2 text-[10px] font-semibold text-rose-600 border border-rose-200/50">
                          Etapa de salida
                        </span>
                      )}
                      {d.highlight && (
                        <span className="rounded-md bg-emerald-50 px-1.5 py-0.2 text-[10px] font-semibold text-emerald-600 border border-emerald-200/50">
                          Éxito
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-sm font-bold tabular-nums text-foreground">
                    {d.value}
                  </span>
                  <span className="w-12 text-right text-xs font-medium text-muted-foreground tabular-nums">
                    {Math.round((d.value / max) * 100)}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function Dashboard() {
  const [channel, setChannel] = useState<"whatsapp" | "shopify" | "logistica">("whatsapp");
  const [date, setDate] = useState<DateRange | undefined>({
    from: subDays(new Date(), 7),
    to: new Date(),
  });
  const [productFilter, setProductFilter] = useState<string>("todos");
  const [shippingFilter, setShippingFilter] = useState<"todos" | "local" | "agencia">("todos");

  // Extraer lista de productos únicos de los pedidos
  const productOptions = useMemo(() => {
    const names = new Set<string>();
    orders.forEach((o) => o.items.forEach((item) => names.add(item.name)));
    return Array.from(names);
  }, []);

  // Filtrado reactivo de pedidos según los filtros superiores
  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      if (shippingFilter !== "todos" && o.shipping !== shippingFilter) return false;
      if (productFilter !== "todos" && !o.items.some((item) => item.name === productFilter)) return false;
      // Para el demo con mock data, el filtro de fechas asume que todos pasan,
      // ya que las fechas son strings como "21 ago, 08:12" sin año.
      return true;
    });
  }, [shippingFilter, productFilter, date]);

  const nuevos = orders.filter((o) => o.age.includes("min") || o.age.includes("h")).length;
  const pendingOrders = orders.filter((o) => o.status === "wa_entrante" || o.status === "sh_entrante").length;
  const confirmadosCount = orders.filter((o) => o.status === "confirmado").length;
  const tasa = Math.round((confirmadosCount / orders.length) * 100);

  // Construcción del embudo con estados exactos pedidos por el usuario
  const funnelData: FunnelStep[] = useMemo(() => {
    const mult = Math.max(filteredOrders.length, 1);

    if (channel === "whatsapp") {
      const base = Math.max(Math.round(mult * 2.5), 10);
      const interaccion = Math.max(Math.round(base * 0.76), 7);
      const compromiso = Math.max(Math.round(interaccion * 0.65), 5);
      const seguimiento = Math.max(Math.round(compromiso * 0.70), 3);
      const realizados = Math.max(Math.round(seguimiento * 0.66), 2);

      return [
        { label: "Mensajes Entrantes", value: base },
        { label: "Interacción", value: interaccion },
        { label: "Compromiso de Pago", value: compromiso },
        { label: "Seguimiento", value: seguimiento },
        { label: "Pedidos Realizados", value: realizados, highlight: true },
      ];
    } else if (channel === "shopify") {
      const base = Math.max(Math.round(mult * 3.0), 12);
      const interaccion = Math.max(Math.round(base * 0.75), 9);
      const seguimiento = Math.max(Math.round(interaccion * 0.68), 6);
      const compromiso = Math.max(Math.round(seguimiento * 0.62), 4);
      const descartado = Math.max(Math.round(compromiso * 0.25), 1);
      const confirmados = Math.max(compromiso - descartado, 1);

      return [
        { label: "Pedidos Entrantes", value: base },
        { label: "Interacción", value: interaccion },
        { label: "Seguimiento", value: seguimiento },
        { label: "Compromiso de Pago", value: compromiso },
        { label: "Descartado", value: descartado, isDrop: true },
        { label: "Pedidos Confirmados", value: confirmados, highlight: true },
      ];
    } else {
      const base = Math.max(Math.round(mult * 1.8), 8);
      const registrado = Math.max(Math.round(base * 0.88), 7);
      const transito = Math.max(Math.round(registrado * 0.80), 5);
      const recojo = Math.max(Math.round(transito * 0.40), 2);
      const entregado = Math.max(Math.round(transito * 0.75), 4);
      const incidencia = Math.max(Math.round(base * 0.12), 1);

      return [
        { label: "Por Despachar", value: base },
        { label: "Registrado", value: registrado },
        { label: "En Tránsito", value: transito },
        { label: "Pendiente de Recojo", value: recojo },
        { label: "Entregado", value: entregado, highlight: true },
        { label: "Incidencia / Cancelado", value: incidencia, isDrop: true },
      ];
    }
  }, [channel, filteredOrders]);

  const funnelTotalStart = funnelData[0]?.value || 1;
  const funnelTotalEnd = funnelData.find((d) => d.highlight)?.value || 1;
  const conversionRate = Math.round((funnelTotalEnd / funnelTotalStart) * 100);

  const resetFilters = () => {
    setDate(undefined);
    setProductFilter("todos");
    setShippingFilter("todos");
  };

  const hasActiveFilters = date !== undefined || productFilter !== "todos" || shippingFilter !== "todos";

  return (
    <AppShell title="Buenos días, Andrea 👋" subtitle="Este es el resumen de tu tienda hoy, 21 de agosto.">
      {/* 1. Métricas KPI principales */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <Metric label="Pedidos nuevos hoy" value={String(nuevos)} hint="Desde Shopify" icon={ShoppingBag} />
        <Metric
          label="Pendientes de confirmar"
          value={String(pendingOrders)}
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
          value={String(confirmadosCount)}
          hint="Listos para despachar"
          icon={CheckCircle2}
        />
        <Metric label="Tasa de confirmación" value={`${tasa}%`} hint="+6 pts vs. ayer" icon={TrendingUp} />
      </div>

      {/* Banner de acción rápida */}
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
          className="inline-flex items-center gap-1.5 rounded-lg bg-status-compromiso px-4 py-2 text-sm font-semibold text-surface hover:opacity-90 transition"
        >
          Verificar ahora
          <ArrowRight className="h-4 w-4" strokeWidth={2} />
        </Link>
      </div>

      {/* 2. SECCIÓN DESTACADA: EMBUDO CRM DE VENTAS CON FILTROS */}
      <section className="mt-6 card-surface p-6">
        {/* Cabecera del Embudo + Selector de Canal */}
        <div className="flex flex-col gap-4 border-b border-border/70 pb-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-soft text-primary shadow-xs">
              <Filter className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-foreground">Embudo CRM de Ventas</h2>
                <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-[11px] font-semibold text-primary">
                  Conversión: {conversionRate}%
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                Mide la efectividad paso a paso desde el primer contacto hasta el cierre de venta
              </p>
            </div>
          </div>

          {/* Selector de Canales (WhatsApp, Shopify, Logística) */}
          <div className="inline-flex rounded-xl border border-border bg-muted/60 p-1">
            <button
              onClick={() => setChannel("whatsapp")}
              className={`flex items-center gap-2 rounded-lg px-3.5 py-1.5 text-xs font-semibold transition cursor-pointer ${
                channel === "whatsapp"
                  ? "bg-surface text-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <MessageCircle className="h-3.5 w-3.5 text-emerald-500" />
              WhatsApp
            </button>
            <button
              onClick={() => setChannel("shopify")}
              className={`flex items-center gap-2 rounded-lg px-3.5 py-1.5 text-xs font-semibold transition cursor-pointer ${
                channel === "shopify"
                  ? "bg-surface text-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <ShoppingBag className="h-3.5 w-3.5 text-blue-500" />
              Shopify
            </button>
            <button
              onClick={() => setChannel("logistica")}
              className={`flex items-center gap-2 rounded-lg px-3.5 py-1.5 text-xs font-semibold transition cursor-pointer ${
                channel === "logistica"
                  ? "bg-surface text-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Truck className="h-3.5 w-3.5 text-purple-500" />
              Logística
            </button>
          </div>
        </div>

        {/* BARRA DE FILTROS: Fecha, Producto, Modalidad de Envío */}
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border/70 bg-surface-2 p-3">
          <div className="flex flex-wrap items-center gap-3">
            {/* Filtro de Fecha */}
            <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
              <Calendar className="h-3.5 w-3.5" />
              <DateRangePicker date={date} setDate={setDate} />
            </div>

            {/* Filtro de Producto */}
            <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
              <Package className="h-3.5 w-3.5" />
              <span>Producto:</span>
              <select
                value={productFilter}
                onChange={(e) => setProductFilter(e.target.value)}
                className="max-w-[200px] truncate rounded-lg border border-border bg-surface px-2.5 py-1 text-xs font-semibold text-foreground outline-none focus:border-primary cursor-pointer"
              >
                <option value="todos">Todos los productos</option>
                {productOptions.map((prod) => (
                  <option key={prod} value={prod}>
                    {prod}
                  </option>
                ))}
              </select>
            </div>

            {/* Filtro de Envío (Contraentrega vs Agencia) */}
            <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
              <Truck className="h-3.5 w-3.5" />
              <span>Tipo de Envío:</span>
              <select
                value={shippingFilter}
                onChange={(e) => setShippingFilter(e.target.value as typeof shippingFilter)}
                className="rounded-lg border border-border bg-surface px-2.5 py-1 text-xs font-semibold text-foreground outline-none focus:border-primary cursor-pointer"
              >
                <option value="todos">Todos los envíos</option>
                <option value="local">Local (Contraentrega)</option>
                <option value="agencia">Agencia (Shalom con adelanto)</option>
              </select>
            </div>
          </div>

          {/* Botón de Limpiar filtros */}
          {hasActiveFilters && (
            <button
              onClick={resetFilters}
              className="inline-flex items-center gap-1 text-xs font-semibold text-muted-foreground hover:text-foreground transition cursor-pointer"
            >
              <RotateCcw className="h-3 w-3" />
              Limpiar filtros
            </button>
          )}
        </div>

        {/* Gráfico del Embudo */}
        <div className="mt-5 max-w-2xl mx-auto">
          <FunnelChart data={funnelData} />
        </div>
      </section>

      {/* 3. SECCIÓN INFERIOR: 2 COLUMNAS (PEDIDOS POR ESTADO + ACTIVIDAD RECIENTE) */}
      <div className="mt-6 grid gap-4 lg:grid-cols-5">
        {/* Pedidos por Estado (lg:col-span-3) */}
        <section className="card-surface p-5 lg:col-span-3">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-semibold">Pedidos por estado</h2>
              <p className="text-xs text-muted-foreground">Distribución actual de prospectos y pedidos</p>
            </div>
            <Link to="/pedidos" className="text-xs font-semibold text-primary hover:underline">
              Ver tablero Kanban →
            </Link>
          </div>
          <div className="mt-5 space-y-3.5">
            {counts.map((c) => (
              <div key={c.key} className="flex items-center gap-3">
                <div className="flex w-44 items-center gap-2 text-sm">
                  <StatusDot status={c.key} />
                  <span className="truncate text-xs font-medium">{c.label}</span>
                </div>
                <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-muted">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${STATUS_STYLES[c.key]?.dot || "bg-muted"}`}
                    style={{ width: `${(c.value / maxCount) * 100}%` }}
                  />
                </div>
                <span className="w-8 text-right text-xs font-bold tabular-nums">{c.value}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Actividad Reciente (lg:col-span-2) */}
        <section className="card-surface p-5 lg:col-span-2">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold">Actividad reciente</h2>
            <Link
              to="/conversaciones"
              className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
            >
              Ir a chats
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <ul className="mt-4 space-y-3.5">
            {activity.map((a) => (
              <li key={a.id} className="flex gap-3">
                <span className="mt-1.5">
                  <StatusDot status={a.tone} />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-xs leading-relaxed text-foreground font-medium">{a.text}</p>
                  <p className="text-[10px] text-muted-foreground">{a.time}</p>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </AppShell>
  );
}
