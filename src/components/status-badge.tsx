import { STATUS_STYLES, type OrderStatus } from "@/lib/mock-data";

export function StatusBadge({
  status,
  size = "md",
}: {
  status: OrderStatus;
  size?: "sm" | "md";
}) {
  const s = STATUS_STYLES[status] || { label: status, badge: "bg-muted text-muted-foreground border-transparent", dot: "bg-muted", column: "" };
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border font-semibold whitespace-nowrap ${s.badge} ${
        size === "sm" ? "px-2 py-0.5 text-[11px]" : "px-2.5 py-1 text-xs"
      }`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} />
      {s.label}
    </span>
  );
}

export function StatusDot({ status }: { status: OrderStatus }) {
  const s = STATUS_STYLES[status];
  return <span className={`h-2 w-2 shrink-0 rounded-full ${s ? s.dot : "bg-muted"}`} />;
}
