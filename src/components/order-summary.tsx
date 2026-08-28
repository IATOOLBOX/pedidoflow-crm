import {
  Bike,
  Building2,
  Check,
  MapPin,
  MessageCircle,
  Phone,
  IdCard,
  RefreshCcw,
} from "lucide-react";
import { Link } from "@tanstack/react-router";
import { STATUS_STYLES, initials, soles, type Order } from "@/lib/mock-data";
import { StatusBadge } from "./status-badge";

export function ShippingTag({ type }: { type: Order["shipping"] }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-md bg-muted px-1.5 py-0.5 text-[11px] font-medium text-muted-foreground">
      {type === "local" ? (
        <Bike className="h-3.5 w-3.5" strokeWidth={1.75} />
      ) : (
        <Building2 className="h-3.5 w-3.5" strokeWidth={1.75} />
      )}
      {type === "local" ? "Local (contraentrega)" : "Agencia (Shalom)"}
    </span>
  );
}

export function OrderSummary({ order, compact = false }: { order: Order; compact?: boolean }) {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-2">
        <StatusBadge status={order.status} />
        <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-muted px-2.5 py-1 text-xs font-semibold text-muted-foreground">
          {STATUS_STYLES[order.delivery]?.label}
        </span>
        <ShippingTag type={order.shipping} />
      </div>

      <div className="rounded-xl border border-border bg-surface-2 p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
            {initials(order.customer)}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold">{order.customer}</p>
            <p className="text-xs text-muted-foreground">
              {order.number} · {order.createdAt}
            </p>
          </div>
          <p className="ml-auto text-lg font-bold">{soles(order.amount)}</p>
        </div>
        <dl className="mt-4 grid grid-cols-1 gap-2 text-sm sm:grid-cols-2">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Phone className="h-4 w-4" strokeWidth={1.75} />
            <span className="text-foreground">{order.phone}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <MapPin className="h-4 w-4" strokeWidth={1.75} />
            <span className="text-foreground">{order.city}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground sm:col-span-2">
            <MapPin className="h-4 w-4 opacity-0" />
            <span className="text-foreground">{order.address}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <IdCard className="h-4 w-4" strokeWidth={1.75} />
            <span className="text-foreground">{order.dni ?? "DNI no proporcionado"}</span>
          </div>
        </dl>
      </div>

      <div>
        <h4 className="mb-2 text-xs font-bold tracking-wide text-muted-foreground uppercase">
          Productos
        </h4>
        <ul className="divide-y divide-border rounded-xl border border-border">
          {order.items.map((it) => (
            <li key={it.name} className="flex items-center gap-3 px-3 py-2.5 text-sm">
              <span className="flex h-6 w-6 items-center justify-center rounded-md bg-muted text-[11px] font-bold">
                {it.qty}
              </span>
              <span className="min-w-0 flex-1 truncate">{it.name}</span>
              <span className="font-medium">{soles(it.price * it.qty)}</span>
            </li>
          ))}
          <li className="flex items-center justify-between px-3 py-2.5 text-sm">
            <span className="text-muted-foreground">Adelanto requerido</span>
            <span className="font-semibold text-primary">{soles(order.advance)}</span>
          </li>
        </ul>
      </div>

      <div>
        <h4 className="mb-3 text-xs font-bold tracking-wide text-muted-foreground uppercase">
          Línea de tiempo
        </h4>
        <ol className="relative space-y-3 border-l border-border pl-5">
          {order.timeline.map((step) => (
            <li key={step.label} className="relative">
              <span
                className={`absolute top-0.5 -left-[27px] flex h-4 w-4 items-center justify-center rounded-full border-2 ${
                  step.done
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-surface"
                }`}
              >
                {step.done ? <Check className="h-2.5 w-2.5" strokeWidth={3.5} /> : null}
              </span>
              <p
                className={`text-sm leading-4 ${step.done ? "font-medium" : "text-muted-foreground"}`}
              >
                {step.label}
              </p>
              {step.time ? (
                <p className="text-[11px] text-muted-foreground">{step.time}</p>
              ) : null}
            </li>
          ))}
        </ol>
      </div>

      {!compact ? (
        <div className="flex flex-wrap gap-2">
          <Link
            to="/conversaciones"
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
          >
            <MessageCircle className="h-4 w-4" strokeWidth={1.75} />
            Abrir conversación
          </Link>
          <button className="inline-flex items-center justify-center gap-2 rounded-lg border border-border px-4 py-2.5 text-sm font-semibold hover:bg-muted">
            <RefreshCcw className="h-4 w-4" strokeWidth={1.75} />
            Cambiar estado
          </button>
        </div>
      ) : null}
    </div>
  );
}
