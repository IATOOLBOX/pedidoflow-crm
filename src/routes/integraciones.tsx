import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { BadgeCheck, MessageCircle, ShoppingCart, Truck } from "lucide-react";
import { AppShell } from "@/components/app-shell";

export const Route = createFileRoute("/integraciones")({
  head: () => ({
    meta: [
      { title: "Integraciones — PedidoFlow" },
      {
        name: "description",
        content:
          "Conecta tu tienda Shopify, tu número de WhatsApp Business de Meta y tu cuenta de agencia Shalom a PedidoFlow.",
      },
      { property: "og:title", content: "Integraciones — PedidoFlow" },
      {
        property: "og:description",
        content: "Shopify, WhatsApp Business (Meta) y Shalom conectados en un solo lugar.",
      },
    ],
  }),
  component: IntegracionesPage,
});

function ConnectionState({ connected }: { connected: boolean }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface-2 px-2.5 py-1 text-[11px] font-semibold">
      <span
        className={`h-2 w-2 rounded-full ${connected ? "bg-status-confirmado" : "bg-status-pendiente"}`}
      />
      {connected ? "Conectado" : "No conectado"}
    </span>
  );
}

function IntegracionesPage() {
  const [shopify, setShopify] = useState(true);
  const [wa, setWa] = useState(true);
  const [shalom, setShalom] = useState(false);

  const inputCls =
    "h-10 w-full rounded-lg border border-border bg-surface px-3 text-sm outline-none focus:border-primary";
  const btnPrimary =
    "w-full rounded-lg bg-primary py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90";
  const btnGhost =
    "w-full rounded-lg border border-border py-2.5 text-sm font-semibold hover:bg-muted";

  return (
    <AppShell
      title="Integraciones"
      subtitle="Conecta las herramientas que mueven tus pedidos contraentrega"
    >
      <div className="grid gap-4 lg:grid-cols-3">
        <article className="card-surface flex flex-col p-6">
          <div className="flex items-start justify-between">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-status-confirmado-soft text-status-confirmado">
              <ShoppingCart className="h-6 w-6" strokeWidth={1.75} />
            </div>
            <ConnectionState connected={shopify} />
          </div>
          <h2 className="mt-4 text-base font-bold">Shopify</h2>
          <p className="mt-1 flex-1 text-sm text-muted-foreground">
            Importa automáticamente cada pedido nuevo de tu tienda y sincroniza su estado.
          </p>
          <label className="mt-4 mb-1.5 block text-xs font-semibold">URL de la tienda</label>
          <input defaultValue="tienda-andina.myshopify.com" className={inputCls} />
          <button
            onClick={() => setShopify((v) => !v)}
            className={`mt-4 ${shopify ? btnGhost : btnPrimary}`}
          >
            {shopify ? "Desconectar tienda" : "Conectar tienda"}
          </button>
        </article>

        <article className="card-surface flex flex-col p-6">
          <div className="flex items-start justify-between">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-soft text-accent-foreground">
              <MessageCircle className="h-6 w-6" strokeWidth={1.75} />
            </div>
            <ConnectionState connected={wa} />
          </div>
          <h2 className="mt-4 text-base font-bold">WhatsApp Business (Meta)</h2>
          <p className="mt-1 flex-1 text-sm text-muted-foreground">
            Conecta tu número mediante Embedded Signup para que el agente IA responda por ti.
          </p>
          {wa ? (
            <div className="mt-4 rounded-xl bg-surface-2 p-3">
              <p className="text-sm font-semibold">+51 987 111 222</p>
              <p className="mt-1 inline-flex items-center gap-1 text-[11px] text-status-confirmado">
                <BadgeCheck className="h-3.5 w-3.5" strokeWidth={2} />
                Nombre verificado por Meta · Calidad alta
              </p>
            </div>
          ) : (
            <div className="mt-4 rounded-xl border border-dashed border-border p-3 text-xs text-muted-foreground">
              Necesitas una cuenta de WhatsApp Business API y un número no registrado en la app
              personal.
            </div>
          )}
          <button onClick={() => setWa((v) => !v)} className={`mt-4 ${wa ? btnGhost : btnPrimary}`}>
            {wa ? "Administrar número" : "Conectar número de WhatsApp"}
          </button>
        </article>

        <article className="card-surface flex flex-col p-6">
          <div className="flex items-start justify-between">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-status-compromiso-soft text-status-compromiso">
              <Truck className="h-6 w-6" strokeWidth={1.75} />
            </div>
            <ConnectionState connected={shalom} />
          </div>
          <h2 className="mt-4 text-base font-bold">Shalom</h2>
          <p className="mt-1 flex-1 text-sm text-muted-foreground">
            Genera guías de envío por agencia y sigue la entrega desde PedidoFlow.
          </p>
          <div className="mt-4 space-y-2">
            <input placeholder="Usuario de agencia" className={inputCls} />
            <input placeholder="Contraseña" type="password" className={inputCls} />
            <input placeholder="RUC del remitente" className={inputCls} />
          </div>
          <button
            onClick={() => setShalom((v) => !v)}
            className={`mt-4 ${shalom ? btnGhost : btnPrimary}`}
          >
            {shalom ? "Desconectar cuenta" : "Conectar cuenta Shalom"}
          </button>
        </article>
      </div>
    </AppShell>
  );
}
