import { Link, useRouterState } from "@tanstack/react-router";
import { type ReactNode, useState, useEffect } from "react";
import {
  LayoutDashboard,
  ShoppingBag,
  MessagesSquare,
  ReceiptText,
  Users,
  FileText,
  Plug,
  Settings,
  Search,
  Bell,
  ChevronDown,
  Store,
  Truck,
  Workflow,
  Sun,
  CloudMoon,
  Moon,
} from "lucide-react";
import { payments } from "@/lib/mock-data";

export type ThemeMode = "normal" | "dim" | "dark";

const nav = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/pedidos", label: "Pedidos", icon: ShoppingBag },
  { to: "/confirmados", label: "Confirmados", icon: Truck },
  { to: "/conversaciones", label: "Conversaciones", icon: MessagesSquare },
  { to: "/pagos", label: "Pagos por verificar", icon: ReceiptText, badge: payments.length },
  { to: "/clientes", label: "Clientes", icon: Users },
  { to: "/workflows", label: "Workflows", icon: Workflow },
  { to: "/plantillas", label: "Plantillas de WhatsApp", icon: FileText },
  { to: "/integraciones", label: "Integraciones", icon: Plug },
  { to: "/configuracion", label: "Configuración", icon: Settings },
] as const;

export function AppShell({
  title,
  subtitle,
  children,
  contentClassName = "",
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
  contentClassName?: string;
}) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  const [currentTheme, setCurrentTheme] = useState<ThemeMode>(() => {
    if (typeof window !== "undefined") {
      return (localStorage.getItem("pedidoflow_theme") as ThemeMode) || "normal";
    }
    return "normal";
  });

  const changeTheme = (newTheme: ThemeMode) => {
    setCurrentTheme(newTheme);
    if (typeof window !== "undefined") {
      localStorage.setItem("pedidoflow_theme", newTheme);
      const root = document.documentElement;
      root.classList.remove("dark", "dim");
      if (newTheme === "dim") {
        root.classList.add("dark", "dim");
      } else if (newTheme === "dark") {
        root.classList.add("dark");
      }
    }
  };

  useEffect(() => {
    const saved = (localStorage.getItem("pedidoflow_theme") as ThemeMode) || "normal";
    changeTheme(saved);
  }, []);

  return (
    <div className="flex min-h-screen bg-background">
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col bg-sidebar text-sidebar-foreground lg:flex">
        <div className="flex items-center gap-2.5 px-5 py-5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-sidebar-primary text-sidebar-primary-foreground">
            <ShoppingBag className="h-5 w-5" strokeWidth={2} />
          </div>
          <div className="leading-tight">
            <p className="text-[15px] font-bold text-sidebar-accent-foreground">PedidoFlow</p>
            <p className="text-[11px] text-sidebar-foreground/60">CRM contraentrega</p>
          </div>
        </div>

        <nav className="flex-1 space-y-1 px-3 py-2">
          {nav.map((item) => {
            const active = item.to === "/" ? pathname === "/" : pathname.startsWith(item.to);
            const Icon = item.icon;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${
                  active
                    ? "bg-sidebar-accent font-semibold text-sidebar-accent-foreground"
                    : "text-sidebar-foreground/80 hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
                }`}
              >
                <Icon className="h-[18px] w-[18px] shrink-0" strokeWidth={1.75} />
                <span className="flex-1 truncate">{item.label}</span>
                {"badge" in item && item.badge ? (
                  <span className="rounded-full bg-status-compromiso px-1.5 py-0.5 text-[10px] font-bold text-sidebar">
                    {item.badge}
                  </span>
                ) : null}
              </Link>
            );
          })}
        </nav>

        <div className="m-3 rounded-xl bg-sidebar-accent/60 p-3">
          <p className="text-xs font-semibold text-sidebar-accent-foreground">Plan Crece</p>
          <p className="mt-0.5 text-[11px] text-sidebar-foreground/70">
            1,840 / 3,000 conversaciones
          </p>
          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-sidebar-border">
            <div className="h-full w-[61%] rounded-full bg-sidebar-primary" />
          </div>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-20 flex h-16 items-center gap-4 border-b border-border bg-surface/90 px-4 backdrop-blur lg:px-6">
          <button className="flex items-center gap-2 rounded-lg border border-border px-3 py-1.5 text-sm font-medium hover:bg-muted">
            <Store className="h-4 w-4 text-primary" strokeWidth={1.75} />
            Tienda Andina
            <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
          </button>

          <div className="relative hidden max-w-sm flex-1 md:block">
            <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              placeholder="Buscar pedido, cliente o teléfono…"
              className="h-9 w-full rounded-lg border border-border bg-muted/60 pr-3 pl-9 text-sm outline-none focus:border-primary focus:bg-surface"
            />
          </div>

          <div className="ml-auto flex items-center gap-2.5">
            {/* SELECTOR DE TEMA: NORMAL, MEDIO OSCURO, OSCURO */}
            <div className="flex items-center rounded-xl bg-muted/70 p-1 border border-border">
              <button
                type="button"
                onClick={() => changeTheme("normal")}
                className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs transition ${
                  currentTheme === "normal"
                    ? "bg-surface text-foreground shadow-xs font-bold"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                title="Tema Normal (Claro)"
              >
                <Sun className="h-3.5 w-3.5 text-amber-500" />
                <span className="hidden sm:inline">Normal</span>
              </button>
              <button
                type="button"
                onClick={() => changeTheme("dim")}
                className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs transition ${
                  currentTheme === "dim"
                    ? "bg-surface text-foreground shadow-xs font-bold"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                title="Tema Medio Oscuro (Pizarra / Twilight)"
              >
                <CloudMoon className="h-3.5 w-3.5 text-sky-400" />
                <span className="hidden sm:inline">Medio</span>
              </button>
              <button
                type="button"
                onClick={() => changeTheme("dark")}
                className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs transition ${
                  currentTheme === "dark"
                    ? "bg-surface text-foreground shadow-xs font-bold"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                title="Tema Oscuro (Deep Dark)"
              >
                <Moon className="h-3.5 w-3.5 text-indigo-400" />
                <span className="hidden sm:inline">Oscuro</span>
              </button>
            </div>

            <button className="relative rounded-lg p-2 hover:bg-muted" title="Notificaciones">
              <Bell className="h-[18px] w-[18px] text-muted-foreground" strokeWidth={1.75} />
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-status-noconfirma" />
            </button>
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                AV
              </div>
              <div className="hidden leading-tight sm:block">
                <p className="text-[13px] font-semibold">Andrea Vega</p>
                <p className="text-[11px] text-muted-foreground">Administradora</p>
              </div>
            </div>
          </div>
        </header>

        <main className={`flex-1 px-4 py-6 lg:px-8 ${contentClassName}`}>
          <div className="mb-6">
            <h1 className="text-2xl font-bold">{title}</h1>
            {subtitle ? <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p> : null}
          </div>
          {children}
        </main>
      </div>
    </div>
  );
}
