import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  Filter,
  LayoutGrid,
  List,
  MessageCircle,
  RotateCcw,
  Search,
  ShoppingBag,
  Truck,
  X,
} from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { StatusBadge } from "@/components/status-badge";
import { OrderSummary, ShippingTag } from "@/components/order-summary";
import {
  STATUS_STYLES,
  initials,
  orders,
  soles,
  type OrderStatus,
  type WhatsappStatus,
  type ShopifyStatus,
  type DeliveryStatus,
  type Order,
} from "@/lib/mock-data";

export const Route = createFileRoute("/pedidos")({
  head: () => ({
    meta: [
      { title: "Pedidos — PedidoFlow" },
      {
        name: "description",
        content:
          "Tablero Kanban y tabla de pedidos contraentrega organizados por WhatsApp, Shopify y Logística.",
      },
      { property: "og:title", content: "Pedidos — PedidoFlow" },
      {
        property: "og:description",
        content: "Gestión de pedidos en tiempo real para WhatsApp, Shopify y Logística contraentrega.",
      },
    ],
  }),
  component: PedidosPage,
});

type StageOption = "whatsapp" | "shopify" | "logistica";

// 1. Estados según cada opción para el filtro dinámico
const whatsappStatusOptions: { value: OrderStatus; label: string }[] = [
  { value: "wa_entrante", label: "Mensajes entrantes" },
  { value: "wa_interaccion", label: "Interacción" },
  { value: "wa_compromiso", label: "Compromiso de Pago" },
  { value: "wa_seguimiento", label: "Seguimiento" },
  { value: "confirmado", label: "Pedidos Realizados" },
  { value: "wa_transferido", label: "Transferidos a Humanos" },
];

const shopifyStatusOptions: { value: OrderStatus; label: string }[] = [
  { value: "sh_entrante", label: "Pedidos Entrantes" },
  { value: "sh_no_responden", label: "No responden (24h)" },
  { value: "sh_interaccion", label: "Interacción" },
  { value: "sh_seguimiento", label: "Seguimiento" },
  { value: "sh_compromiso", label: "Compromiso de Pago" },
  { value: "confirmado", label: "Pedidos Confirmados" },
  { value: "sh_transferido", label: "Transferidos a Humano" },
  { value: "sh_descartado", label: "Descartado" },
];

const logisticaStatusOptions: { value: DeliveryStatus; label: string }[] = [
  { value: "por_despachar", label: "Por Despachar" },
  { value: "registrado", label: "Registrado" },
  { value: "en_transito", label: "En Tránsito" },
  { value: "pendiente_recojo", label: "Pendiente de Recojo" },
  { value: "incidencia", label: "Incidencia" },
  { value: "entregado", label: "Entregado" },
  { value: "cancelado", label: "Cancelado / Devuelto" },
];

// 2. Columnas del Kanban para cada una de las 3 opciones
const whatsappColumns: { statuses: WhatsappStatus[]; title: string }[] = [
  { statuses: ["wa_entrante"], title: "Mensajes entrantes" },
  { statuses: ["wa_interaccion"], title: "Interacción" },
  { statuses: ["wa_compromiso"], title: "Compromiso de Pago" },
  { statuses: ["wa_seguimiento"], title: "Seguimiento" },
  { statuses: ["confirmado"], title: "Pedidos Realizados" },
  { statuses: ["wa_transferido"], title: "Transferidos a Humanos" },
];

const shopifyColumns: { statuses: ShopifyStatus[]; title: string }[] = [
  { statuses: ["sh_entrante"], title: "Pedidos Entrantes" },
  { statuses: ["sh_no_responden"], title: "No responden (24h)" },
  { statuses: ["sh_interaccion"], title: "Interacción" },
  { statuses: ["sh_seguimiento"], title: "Seguimiento" },
  { statuses: ["sh_compromiso"], title: "Compromiso de Pago" },
  { statuses: ["confirmado"], title: "Pedidos Confirmados" },
  { statuses: ["sh_transferido"], title: "Transferidos a Humano" },
  { statuses: ["sh_descartado"], title: "Descartado" },
];

const deliveryColumns: { statuses: DeliveryStatus[]; title: string }[] = [
  { statuses: ["por_despachar"], title: "Por Despachar" },
  { statuses: ["registrado"], title: "Registrado" },
  { statuses: ["en_transito"], title: "En Tránsito" },
  { statuses: ["pendiente_recojo"], title: "Pendiente de Recojo" },
  { statuses: ["incidencia"], title: "Incidencia" },
  { statuses: ["entregado"], title: "Entregado" },
  { statuses: ["cancelado"], title: "Cancelado / Devuelto" },
];

function OrderCard({
  order,
  isDelivery,
  onClick,
}: {
  order: Order;
  isDelivery: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="w-full rounded-xl border border-border bg-surface p-3 text-left transition hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-xs cursor-pointer"
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
        <span className="text-sm font-bold tabular-nums">{soles(order.amount)}</span>
      </div>
      <div className="mt-2.5 flex items-center justify-between gap-2">
        <ShippingTag type={order.shipping} />
        {isDelivery ? (
          <StatusBadge status={order.delivery} size="sm" />
        ) : (
          <span className="text-[11px] text-muted-foreground">{order.age}</span>
        )}
      </div>
    </button>
  );
}

function PedidosPage() {
  const [view, setView] = useState<"kanban" | "tabla">("kanban");
  const [stage, setStage] = useState<StageOption>("whatsapp");
  const [status, setStatus] = useState<string>("todos");
  const [shipping, setShipping] = useState<"todos" | "local" | "agencia">("todos");
  const [q, setQ] = useState("");
  const [selected, setSelected] = useState<Order | null>(null);

  // Al cambiar de opción (WhatsApp / Shopify / Logística), reiniciamos el filtro de estado a "todos"
  const handleStageChange = (newStage: StageOption) => {
    setStage(newStage);
    setStatus("todos");
  };

  const currentStatusOptions = useMemo(() => {
    if (stage === "whatsapp") return whatsappStatusOptions;
    if (stage === "shopify") return shopifyStatusOptions;
    return logisticaStatusOptions;
  }, [stage]);

  const filtered = useMemo(() => {
    return orders.filter((o) => {
      // 1. Filtrado por canal / etapa
      if (stage === "whatsapp") {
        if (o.source !== "whatsapp") return false;
        if (status !== "todos" && o.status !== status) return false;
      } else if (stage === "shopify") {
        if (o.source !== "shopify") return false;
        if (status !== "todos" && o.status !== status) return false;
      } else if (stage === "logistica") {
        const inLogistics =
          o.status === "confirmado" || o.delivery === "cancelado" || o.delivery === "incidencia";
        if (!inLogistics) return false;
        if (status !== "todos" && o.delivery !== status) return false;
      }

      // 2. Filtrado por tipo de envío
      if (shipping !== "todos" && o.shipping !== shipping) return false;

      // 3. Filtrado por búsqueda de texto
      if (q.trim() !== "") {
        const query = q.toLowerCase();
        const matches =
          o.customer.toLowerCase().includes(query) ||
          o.phone.includes(query) ||
          o.number.toLowerCase().includes(query);
        if (!matches) return false;
      }

      return true;
    });
  }, [stage, status, shipping, q]);

  const resetFilters = () => {
    setStatus("todos");
    setShipping("todos");
    setQ("");
  };

  const hasActiveFilters = status !== "todos" || shipping !== "todos" || q.trim() !== "";

  const activeColumns =
    stage === "whatsapp" ? whatsappColumns : stage === "shopify" ? shopifyColumns : deliveryColumns;

  const stageLabel =
    stage === "whatsapp" ? "WhatsApp" : stage === "shopify" ? "Shopify" : "Logística";

  return (
    <AppShell
      title="Pedidos"
      subtitle={`${filtered.length} pedidos encontrados en ${stageLabel}`}
    >
      {/* Barra de Control Principal: 3 Opciones + Vista + Filtros */}
      <div className="card-surface mb-5 space-y-3 p-3.5">
        {/* Fila superior: Selector de las 3 opciones + Toggle Kanban/Tabla */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          {/* Selector de las 3 opciones (WhatsApp, Shopify, Logística) */}
          <div className="inline-flex rounded-xl border border-border bg-muted/60 p-1">
            <button
              onClick={() => handleStageChange("whatsapp")}
              className={`flex items-center gap-2 rounded-lg px-3.5 py-1.5 text-xs font-semibold transition cursor-pointer ${
                stage === "whatsapp"
                  ? "bg-surface text-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <MessageCircle className="h-3.5 w-3.5 text-emerald-500" />
              WhatsApp
            </button>
            <button
              onClick={() => handleStageChange("shopify")}
              className={`flex items-center gap-2 rounded-lg px-3.5 py-1.5 text-xs font-semibold transition cursor-pointer ${
                stage === "shopify"
                  ? "bg-surface text-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <ShoppingBag className="h-3.5 w-3.5 text-blue-500" />
              Shopify
            </button>
            <button
              onClick={() => handleStageChange("logistica")}
              className={`flex items-center gap-2 rounded-lg px-3.5 py-1.5 text-xs font-semibold transition cursor-pointer ${
                stage === "logistica"
                  ? "bg-surface text-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Truck className="h-3.5 w-3.5 text-purple-500" />
              Logística
            </button>
          </div>

          {/* Toggle Kanban / Tabla */}
          <div className="inline-flex rounded-xl border border-border bg-muted/60 p-1">
            {(["kanban", "tabla"] as const).map((v) => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold capitalize transition cursor-pointer ${
                  view === v
                    ? "bg-surface text-foreground shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {v === "kanban" ? <LayoutGrid className="h-3.5 w-3.5" /> : <List className="h-3.5 w-3.5" />}
                {v}
              </button>
            ))}
          </div>
        </div>

        {/* Fila inferior: Buscador + Filtro dinámico de estados + Tipo de Envío */}
        <div className="flex flex-wrap items-center gap-2.5 pt-1">
          {/* Buscador */}
          <div className="relative min-w-[220px] flex-1">
            <Search className="pointer-events-none absolute top-1/2 left-3 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Buscar por cliente, teléfono o # pedido"
              className="h-9 w-full rounded-lg border border-border bg-surface pr-3 pl-8.5 text-xs font-medium outline-none focus:border-primary placeholder:text-muted-foreground/70"
            />
          </div>

          {/* Filtro Dinámico de Estados (segun la opción seleccionada) */}
          <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
            <Filter className="h-3.5 w-3.5 text-muted-foreground" />
            <span>Estado:</span>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="h-9 rounded-lg border border-border bg-surface px-2.5 text-xs font-semibold text-foreground outline-none focus:border-primary cursor-pointer"
            >
              <option value="todos">Todos los estados ({stageLabel})</option>
              {currentStatusOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Filtro por tipo de envío */}
          <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
            <Truck className="h-3.5 w-3.5 text-muted-foreground" />
            <span>Envío:</span>
            <select
              value={shipping}
              onChange={(e) => setShipping(e.target.value as "todos" | "local" | "agencia")}
              className="h-9 rounded-lg border border-border bg-surface px-2.5 text-xs font-semibold text-foreground outline-none focus:border-primary cursor-pointer"
            >
              <option value="todos">Todo tipo de envío</option>
              <option value="local">Local (contraentrega)</option>
              <option value="agencia">Agencia (Shalom)</option>
            </select>
          </div>

          {/* Botón de limpiar filtros activos */}
          {hasActiveFilters && (
            <button
              onClick={resetFilters}
              className="inline-flex items-center gap-1 text-xs font-semibold text-muted-foreground hover:text-foreground transition cursor-pointer ml-auto"
            >
              <RotateCcw className="h-3 w-3" />
              Limpiar filtros
            </button>
          )}
        </div>
      </div>

      {/* VISTA KANBAN */}
      {view === "kanban" ? (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {activeColumns.map((col) => {
            const isDelivery = stage === "logistica";
            const items = filtered.filter((o) => {
              if (isDelivery) {
                return (col.statuses as DeliveryStatus[]).includes(o.delivery);
              }
              return (col.statuses as OrderStatus[]).includes(o.status);
            });

            const head = col.statuses[0];
            const colorClass = (head && STATUS_STYLES[head]?.column) || "border-t-primary";

            return (
              <section
                key={col.title}
                className={`rounded-xl border border-t-4 border-border bg-surface-2 p-3 ${colorClass}`}
              >
                <header className="mb-3 flex items-center justify-between px-1">
                  <h2 className="text-xs font-bold text-foreground truncate">{col.title}</h2>
                  <span className="rounded-full bg-surface px-2 py-0.5 text-[11px] font-bold text-muted-foreground tabular-nums shadow-2xs">
                    {items.length}
                  </span>
                </header>
                <div className="space-y-2.5">
                  {items.map((o) => (
                    <OrderCard
                      key={o.id}
                      order={o}
                      isDelivery={isDelivery}
                      onClick={() => setSelected(o)}
                    />
                  ))}
                  {items.length === 0 ? (
                    <p className="rounded-lg border border-dashed border-border/80 py-6 text-center text-xs text-muted-foreground">
                      Sin pedidos
                    </p>
                  ) : null}
                </div>
              </section>
            );
          })}
        </div>
      ) : (
        /* VISTA TABLA */
        <div className="card-surface overflow-x-auto">
          <table className="w-full min-w-[900px] text-xs">
            <thead className="border-b border-border bg-surface-2 text-left font-semibold text-muted-foreground uppercase tracking-wider">
              <tr>
                <th className="px-4 py-3"># Pedido</th>
                <th className="px-4 py-3">Cliente</th>
                <th className="px-4 py-3">Ciudad</th>
                <th className="px-4 py-3">Tipo de Envío</th>
                <th className="px-4 py-3">
                  Estado {stage === "logistica" ? "Logística" : stage === "whatsapp" ? "WhatsApp" : "Shopify"}
                </th>
                <th className="px-4 py-3">Adelanto</th>
                <th className="px-4 py-3">Total</th>
                <th className="px-4 py-3">Fecha</th>
                <th className="px-4 py-3 text-right">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((o) => (
                <tr key={o.id} className="hover:bg-muted/40 transition-colors">
                  <td className="px-4 py-3 font-bold text-foreground">{o.number}</td>
                  <td className="px-4 py-3 font-medium text-foreground">{o.customer}</td>
                  <td className="px-4 py-3 text-muted-foreground">{o.city}</td>
                  <td className="px-4 py-3">
                    <ShippingTag type={o.shipping} />
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge
                      status={stage === "logistica" ? o.delivery : o.status}
                      size="sm"
                    />
                  </td>
                  <td className="px-4 py-3 font-semibold text-emerald-600 dark:text-emerald-400">
                    {soles(o.advance)}
                  </td>
                  <td className="px-4 py-3 font-bold tabular-nums text-foreground">
                    {soles(o.amount)}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{o.createdAt}</td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => setSelected(o)}
                      className="rounded-lg border border-border px-2.5 py-1 text-xs font-semibold text-foreground hover:bg-surface-2 transition cursor-pointer"
                    >
                      Ver
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-xs text-muted-foreground">
                    No se encontraron pedidos con los filtros seleccionados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Drawer Lateral para Detalle del Pedido */}
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
              <button
                onClick={() => setSelected(null)}
                className="rounded-lg p-2 hover:bg-muted cursor-pointer"
              >
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
