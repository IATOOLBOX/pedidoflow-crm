import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { EquipoSection } from "@/components/equipo-section";

export const Route = createFileRoute("/equipo")({
  head: () => ({
    meta: [
      { title: "Equipo y Roles — Configuración | PedidoFlow" },
      { name: "description", content: "Gestión avanzada de usuarios, módulos del CRM, temporización y permisos." },
    ],
  }),
  component: EquipoPage,
});

function EquipoPage() {
  return (
    <AppShell
      title="Equipo y Roles"
      subtitle="Define el rol, las funciones exactas, los módulos del CRM a los que tendrá acceso cada miembro y el tiempo de vigencia de su pase"
    >
      <EquipoSection />
    </AppShell>
  );
}
