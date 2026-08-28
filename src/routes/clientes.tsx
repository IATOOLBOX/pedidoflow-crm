import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import {
  Search,
  X,
  MessageCircle,
  Crown,
  Repeat,
  ShieldCheck,
  AlertTriangle,
  Sparkles,
  TrendingUp,
  Users,
  ShoppingBag,
  DollarSign,
  MapPin,
  Phone,
  CreditCard,
  Calendar,
  ChevronRight,
  Filter,
  CheckCircle2,
  XCircle,
  Clock,
  ArrowUpDown,
  Copy,
  Check,
} from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { StatusBadge } from "@/components/status-badge";
import {
  customers,
  initials,
  orders,
  soles,
  type Customer,
  type CustomerTag,
} from "@/lib/mock-data";

export const Route = createFileRoute("/clientes")({
  head: () => ({
    meta: [
      { title: "Clientes CRM — PedidoFlow" },
      {
        name: "description",
        content:
          "Perfil de clientes enriquecido: historial de compras, valor de vida (LTV), tasa de confirmación y seguimiento.",
      },
      { property: "og:title", content: "Clientes CRM — PedidoFlow" },
      {
        property: "og:description",
        content: "Conoce a tus compradores recurrentes y su historial de pedidos y conversaciones.",
      },
    ],
  }),
  component: ClientesPage,
});

function TagBadge({ tag }: { tag: CustomerTag | string }) {
  switch (tag) {
    case "VIP":
      return (
        <span className="inline-flex items-center gap-1 rounded-full border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 text-[11px] font-semibold text-amber-500 dark:text-amber-400">
          <Crown className="h-3 w-3" strokeWidth={2.2} />
          VIP
        </span>
      );
    case "Recurrente":
      return (
        <span className="inline-flex items-center gap-1 rounded-full border border-sky-500/30 bg-sky-500/10 px-2 py-0.5 text-[11px] font-semibold text-sky-500 dark:text-sky-400">
          <Repeat className="h-3 w-3" strokeWidth={2.2} />
          Recurrente
        </span>
      );
    case "Confiable":
      return (
        <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[11px] font-semibold text-emerald-500 dark:text-emerald-400">
          <ShieldCheck className="h-3 w-3" strokeWidth={2.2} />
          Confiable
        </span>
      );
    case "Problemático":
      return (
        <span className="inline-flex items-center gap-1 rounded-full border border-rose-500/30 bg-rose-500/10 px-2 py-0.5 text-[11px] font-semibold text-rose-500 dark:text-rose-400">
          <AlertTriangle className="h-3 w-3" strokeWidth={2.2} />
          Problemático
        </span>
      );
    case "Nuevo":
      return (
        <span className="inline-flex items-center gap-1 rounded-full border border-purple-500/30 bg-purple-500/10 px-2 py-0.5 text-[11px] font-semibold text-purple-500 dark:text-purple-400">
          <Sparkles className="h-3 w-3" strokeWidth={2.2} />
          Nuevo
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center rounded-full border border-border bg-muted px-2 py-0.5 text-[11px] font-semibold text-muted-foreground">
          {tag}
        </span>
      );
  }
}

function ConfirmationRateBadge({ rate }: { rate: number }) {
  let colorClass = "text-emerald-500 bg-emerald-500/10 border-emerald-500/20";
  let barColor = "bg-emerald-500";
  if (rate < 50) {
    colorClass = "text-rose-500 bg-rose-500/10 border-rose-500/20";
    barColor = "bg-rose-500";
  } else if (rate < 80) {
    colorClass = "text-amber-500 bg-amber-500/10 border-amber-500/20";
    barColor = "bg-amber-500";
  }

  return (
    <div className="flex items-center gap-2">
      <div className="h-1.5 w-14 rounded-full bg-muted overflow-hidden">
        <div className={`h-full ${barColor} rounded-full`} style={{ width: `${rate}%` }} />
      </div>
      <span className={`inline-flex items-center rounded-md border px-1.5 py-0.5 text-[11px] font-bold ${colorClass}`}>
        {rate}%
      </span>
    </div>
  );
}

function ClientesPage() {
  const [q, setQ] = useState("");
  const [tagFilter, setTagFilter] = useState<string>("todos");
  const [cityFilter, setCityFilter] = useState<string>("todas");
  const [sortBy, setSortBy] = useState<"ltv" | "rate" | "total" | "recent">("ltv");
  const [sel, setSel] = useState<Customer | null>(null);
  const [copiedPhone, setCopiedPhone] = useState<string | null>(null);

  const handleCopyPhone = (phone: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(phone);
    setCopiedPhone(phone);
    setTimeout(() => setCopiedPhone(null), 2000);
  };

  // Unique cities from data
  const cities = useMemo(() => {
    return Array.from(new Set(customers.map((c) => c.city)));
  }, []);

  // Filtered and sorted list
  const list = useMemo(() => {
    return customers
      .filter((c) => {
        const matchesQuery =
          c.name.toLowerCase().includes(q.toLowerCase()) ||
          c.phone.includes(q) ||
          (c.dni && c.dni.includes(q)) ||
          c.city.toLowerCase().includes(q.toLowerCase());

        const matchesTag =
          tagFilter === "todos" || (c.tags && c.tags.includes(tagFilter as CustomerTag));

        const matchesCity = cityFilter === "todas" || c.city === cityFilter;

        return matchesQuery && matchesTag && matchesCity;
      })
      .sort((a, b) => {
        if (sortBy === "ltv") return b.ltv - a.ltv;
        if (sortBy === "rate") return b.confirmationRate - a.confirmationRate;
        if (sortBy === "total") return b.total - a.total;
        return 0;
      });
  }, [q, tagFilter, cityFilter, sortBy]);

  // Global KPIs
  const totalLTV = useMemo(() => customers.reduce((sum, c) => sum + c.ltv, 0), []);
  const vipCount = useMemo(() => customers.filter((c) => c.tags.includes("VIP")).length, []);
  const avgConfirmationRate = useMemo(() => {
    const sum = customers.reduce((acc, c) => acc + c.confirmationRate, 0);
    return Math.round(sum / (customers.length || 1));
  }, []);

  const history = useMemo(() => {
    if (!sel) return [];
    return orders.filter((o) => o.customer === sel.name || o.phone === sel.phone);
  }, [sel]);

  return (
    <AppShell
      title="Gestión de Clientes"
      subtitle={`${customers.length} clientes en cartera · Historial, LTV y segmentación comercial`}
    >
      {/* 4 Métricas Clave Superiores */}
      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
        <div className="card-surface p-4 rounded-xl border border-border shadow-sm flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Users className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs font-medium text-muted-foreground">Total Clientes</p>
            <p className="text-xl font-bold">{customers.length}</p>
          </div>
        </div>

        <div className="card-surface p-4 rounded-xl border border-border shadow-sm flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-500/10 text-amber-500">
            <Crown className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs font-medium text-muted-foreground">Clientes VIP</p>
            <p className="text-xl font-bold">{vipCount}</p>
          </div>
        </div>

        <div className="card-surface p-4 rounded-xl border border-border shadow-sm flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-500">
            <DollarSign className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs font-medium text-muted-foreground">LTV Acumulado</p>
            <p className="text-xl font-bold">{soles(totalLTV)}</p>
          </div>
        </div>

        <div className="card-surface p-4 rounded-xl border border-border shadow-sm flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sky-500/10 text-sky-500">
            <TrendingUp className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs font-medium text-muted-foreground">Confirmación Prom.</p>
            <p className="text-xl font-bold">{avgConfirmationRate}%</p>
          </div>
        </div>
      </div>

      {/* Barra de Búsqueda y Filtros Reactivos */}
      <div className="card-surface mb-4 p-4 rounded-xl border border-border flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Buscar por cliente, teléfono, DNI o ciudad..."
            className="h-10 w-full rounded-lg border border-border bg-surface pr-3 pl-9 text-sm outline-none focus:border-primary transition"
          />
          {q && (
            <button
              onClick={() => setQ("")}
              className="absolute top-1/2 right-2.5 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Filtro por Etiqueta */}
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Filter className="h-3.5 w-3.5" />
            <span>Tag:</span>
            <select
              value={tagFilter}
              onChange={(e) => setTagFilter(e.target.value)}
              className="h-9 rounded-lg border border-border bg-surface px-2.5 text-xs font-medium text-foreground outline-none focus:border-primary"
            >
              <option value="todos">Todos los tags</option>
              <option value="VIP">⭐ VIP</option>
              <option value="Recurrente">🔄 Recurrente</option>
              <option value="Confiable">🛡️ Confiable</option>
              <option value="Nuevo">✨ Nuevo</option>
              <option value="Problemático">⚠️ Problemático</option>
            </select>
          </div>

          {/* Filtro por Ciudad */}
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <MapPin className="h-3.5 w-3.5" />
            <span>Ciudad:</span>
            <select
              value={cityFilter}
              onChange={(e) => setCityFilter(e.target.value)}
              className="h-9 rounded-lg border border-border bg-surface px-2.5 text-xs font-medium text-foreground outline-none focus:border-primary"
            >
              <option value="todas">Todas</option>
              {cities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </div>

          {/* Ordenar por */}
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <ArrowUpDown className="h-3.5 w-3.5" />
            <span>Ordenar:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="h-9 rounded-lg border border-border bg-surface px-2.5 text-xs font-medium text-foreground outline-none focus:border-primary"
            >
              <option value="ltv">Mayor LTV (Soles)</option>
              <option value="rate">Mayor Confirmación (%)</option>
              <option value="total">Más Pedidos</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tabla Enriquecida de Clientes */}
      <div className="card-surface rounded-xl border border-border overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[920px] text-sm">
            <thead className="border-b border-border bg-surface-2 text-left text-xs font-semibold text-muted-foreground uppercase">
              <tr>
                <th className="px-4 py-3.5">Cliente</th>
                <th className="px-4 py-3.5">Contacto / Ciudad</th>
                <th className="px-4 py-3.5">Etiquetas</th>
                <th className="px-4 py-3.5 text-center">Pedidos</th>
                <th className="px-4 py-3.5">Tasa Confirmación</th>
                <th className="px-4 py-3.5 text-right">LTV (Soles)</th>
                <th className="px-4 py-3.5">Última Compra</th>
                <th className="px-4 py-3.5 text-center">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {list.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-muted-foreground">
                    No se encontraron clientes con los filtros aplicados.
                  </td>
                </tr>
              ) : (
                list.map((c) => {
                  const isSelected = sel?.id === c.id;
                  return (
                    <tr
                      key={c.id}
                      onClick={() => setSel(c)}
                      className={`cursor-pointer transition-colors hover:bg-muted/50 ${
                        isSelected ? "bg-primary/5 font-medium" : ""
                      }`}
                    >
                      {/* Cliente + DNI */}
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-3">
                          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-tr from-primary to-primary/70 text-xs font-bold text-primary-foreground shadow-sm">
                            {initials(c.name)}
                          </span>
                          <div>
                            <p className="font-semibold text-foreground leading-tight">{c.name}</p>
                            {c.dni ? (
                              <p className="text-[11px] text-muted-foreground flex items-center gap-1 mt-0.5">
                                <CreditCard className="h-3 w-3" />
                                DNI: {c.dni}
                              </p>
                            ) : (
                              <p className="text-[11px] text-muted-foreground mt-0.5">ID: {c.id}</p>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Contacto + Ciudad */}
                      <td className="px-4 py-3.5">
                        <div className="flex flex-col">
                          <div className="flex items-center gap-1.5 text-xs text-foreground">
                            <span>{c.phone}</span>
                            <button
                              type="button"
                              onClick={(e) => handleCopyPhone(c.phone, e)}
                              className="text-muted-foreground hover:text-foreground p-0.5 rounded"
                              title="Copiar teléfono"
                            >
                              {copiedPhone === c.phone ? (
                                <Check className="h-3 w-3 text-emerald-500" />
                              ) : (
                                <Copy className="h-3 w-3" />
                              )}
                            </button>
                          </div>
                          <span className="text-[11px] text-muted-foreground flex items-center gap-1 mt-0.5">
                            <MapPin className="h-3 w-3" />
                            {c.city}
                          </span>
                        </div>
                      </td>

                      {/* Etiquetas */}
                      <td className="px-4 py-3.5">
                        <div className="flex flex-wrap gap-1 max-w-[170px]">
                          {c.tags && c.tags.length > 0 ? (
                            c.tags.map((tag) => <TagBadge key={tag} tag={tag} />)
                          ) : (
                            <span className="text-xs text-muted-foreground">—</span>
                          )}
                        </div>
                      </td>

                      {/* Pedidos */}
                      <td className="px-4 py-3.5 text-center">
                        <div className="inline-flex flex-col items-center">
                          <span className="font-bold text-foreground">
                            {c.confirmed} <span className="text-xs font-normal text-muted-foreground">de {c.total}</span>
                          </span>
                          <span className="text-[10px] text-muted-foreground">confirmados</span>
                        </div>
                      </td>

                      {/* Tasa Confirmación */}
                      <td className="px-4 py-3.5">
                        <ConfirmationRateBadge rate={c.confirmationRate} />
                      </td>

                      {/* LTV */}
                      <td className="px-4 py-3.5 text-right font-bold text-foreground">
                        <span className="text-primary">{soles(c.ltv)}</span>
                      </td>

                      {/* Última Compra */}
                      <td className="px-4 py-3.5 text-xs text-muted-foreground whitespace-nowrap">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {c.lastPurchase}
                        </div>
                      </td>

                      {/* Acción */}
                      <td className="px-4 py-3.5 text-center">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSel(c);
                          }}
                          className="inline-flex items-center gap-1 rounded-lg border border-border bg-surface px-2.5 py-1 text-xs font-medium text-foreground hover:bg-muted hover:border-primary/50 transition"
                        >
                          Ver ficha
                          <ChevronRight className="h-3 w-3" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Slide-over Drawer: Perfil Completo del Cliente */}
      {sel ? (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Backdrop */}
          <div
            onClick={() => setSel(null)}
            className="flex-1 bg-black/40 backdrop-blur-xs transition-opacity duration-300"
          />

          {/* Drawer Content */}
          <aside className="animate-in slide-in-from-right w-full max-w-lg overflow-y-auto border-l border-border bg-surface p-6 shadow-2xl duration-200">
            {/* Header */}
            <div className="mb-6 flex items-start justify-between border-b border-border pb-4">
              <div className="flex items-center gap-3">
                <span className="flex h-13 w-13 items-center justify-center rounded-2xl bg-gradient-to-tr from-primary to-primary/80 text-lg font-bold text-primary-foreground shadow-md">
                  {initials(sel.name)}
                </span>
                <div>
                  <h2 className="text-xl font-bold leading-tight text-foreground">{sel.name}</h2>
                  <p className="text-xs text-muted-foreground flex items-center gap-2 mt-1">
                    <span>{sel.phone}</span>
                    <span>·</span>
                    <span className="flex items-center gap-0.5">
                      <MapPin className="h-3 w-3" />
                      {sel.city}
                    </span>
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSel(null)}
                className="rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Tags del Cliente */}
            <div className="mb-5 flex flex-wrap items-center gap-1.5">
              <span className="text-xs font-semibold text-muted-foreground mr-1">Etiquetas:</span>
              {sel.tags && sel.tags.length > 0 ? (
                sel.tags.map((tag) => <TagBadge key={tag} tag={tag} />)
              ) : (
                <span className="text-xs text-muted-foreground">Sin etiquetas</span>
              )}
            </div>

            {/* KPIs de Valor (LTV, Pedidos, Tasa) */}
            <div className="mb-6 grid grid-cols-3 gap-2.5">
              <div className="rounded-xl border border-border bg-surface-2 p-3 text-center">
                <p className="text-xs text-muted-foreground mb-1">LTV Total</p>
                <p className="text-lg font-extrabold text-primary">{soles(sel.ltv)}</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">Facturado</p>
              </div>

              <div className="rounded-xl border border-border bg-surface-2 p-3 text-center">
                <p className="text-xs text-muted-foreground mb-1">Pedidos</p>
                <p className="text-lg font-extrabold text-foreground">
                  {sel.confirmed} <span className="text-xs font-normal text-muted-foreground">/ {sel.total}</span>
                </p>
                <p className="text-[10px] text-emerald-500 font-medium mt-0.5">Confirmados</p>
              </div>

              <div className="rounded-xl border border-border bg-surface-2 p-3 text-center">
                <p className="text-xs text-muted-foreground mb-1">Tasa Cierre</p>
                <p className="text-lg font-extrabold text-foreground">{sel.confirmationRate}%</p>
                <div className="w-full bg-muted h-1 rounded-full mt-1.5 overflow-hidden">
                  <div
                    className={`h-full ${
                      sel.confirmationRate >= 80
                        ? "bg-emerald-500"
                        : sel.confirmationRate >= 50
                        ? "bg-amber-500"
                        : "bg-rose-500"
                    }`}
                    style={{ width: `${sel.confirmationRate}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Acciones Rápidas */}
            <div className="mb-6 grid grid-cols-2 gap-2">
              <a
                href={`https://wa.me/${sel.phone.replace(/[^0-9]/g, "")}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-emerald-500 transition"
              >
                <MessageCircle className="h-4 w-4" />
                WhatsApp Directo
              </a>

              <Link
                to="/conversaciones"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-surface px-4 py-2.5 text-xs font-semibold text-foreground hover:bg-muted transition"
              >
                <MessageCircle className="h-4 w-4 text-primary" />
                Ver en Inbox CRM
              </Link>
            </div>

            {/* Datos de Entrega y DNI */}
            <div className="mb-6 rounded-xl border border-border bg-surface-2 p-4 space-y-2.5">
              <h3 className="text-xs font-bold tracking-wide text-muted-foreground uppercase flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5" />
                Datos de Entrega Habitual
              </h3>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-muted-foreground">DNI / Documento:</span>
                  <p className="font-semibold text-foreground mt-0.5">{sel.dni || "No registrado"}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Ciudad / Zona:</span>
                  <p className="font-semibold text-foreground mt-0.5">{sel.city}</p>
                </div>
              </div>
              <div className="text-xs pt-1 border-t border-border/50">
                <span className="text-muted-foreground">Dirección habitual:</span>
                <p className="font-medium text-foreground mt-0.5">{sel.address || "Dirección según pedido"}</p>
              </div>
            </div>

            {/* Notas Internas de CRM */}
            {sel.notes && (
              <div className="mb-6 rounded-xl border border-amber-500/20 bg-amber-500/5 p-3.5">
                <p className="text-xs font-bold text-amber-600 dark:text-amber-400 mb-1 flex items-center gap-1.5">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  Nota Interna del Cliente
                </p>
                <p className="text-xs text-foreground/90 leading-relaxed">{sel.notes}</p>
              </div>
            )}

            {/* Historial de Pedidos */}
            <div>
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-xs font-bold tracking-wide text-muted-foreground uppercase flex items-center gap-1.5">
                  <ShoppingBag className="h-3.5 w-3.5" />
                  Historial de Pedidos ({history.length})
                </h3>
              </div>

              <div className="space-y-2.5">
                {history.length > 0 ? (
                  history.map((o) => (
                    <div
                      key={o.id}
                      className="rounded-xl border border-border bg-surface p-3.5 transition hover:border-primary/40 hover:shadow-xs"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-bold text-foreground">{o.number}</span>
                        <StatusBadge status={o.status} size="sm" />
                      </div>

                      {/* Productos del pedido */}
                      <div className="text-xs text-muted-foreground mb-2 line-clamp-1">
                        {o.items.map((it) => `${it.qty}x ${it.name}`).join(", ")}
                      </div>

                      <div className="flex items-center justify-between text-xs pt-2 border-t border-border/50">
                        <span className="text-muted-foreground flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {o.createdAt}
                        </span>
                        <span className="font-bold text-foreground">{soles(o.amount)}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="rounded-xl border border-dashed border-border p-6 text-center text-xs text-muted-foreground">
                    No hay pedidos registrados con este nombre exacto en el historial actual.
                  </div>
                )}
              </div>
            </div>
          </aside>
        </div>
      ) : null}
    </AppShell>
  );
}
