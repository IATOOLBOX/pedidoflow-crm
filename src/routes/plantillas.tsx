import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo, useRef } from "react";
import {
  CheckCircle2,
  Clock3,
  Plus,
  X,
  XCircle,
  Search,
  FileText,
  Smartphone,
  Copy,
  Trash2,
  ExternalLink,
  Truck,
  RotateCcw,
  Check,
  TrendingUp,
  DollarSign,
  Send,
  AlertTriangle,
  Eye,
  MousePointerClick,
  Layers,
  Image as ImageIcon,
  FileCode,
  ArrowRight,
  Edit,
  RefreshCw,
} from "lucide-react";
import { AppShell } from "@/components/app-shell";
import {
  templates as initialTemplates,
  type Template,
  type FunctionalCategory,
  type TemplateButton,
} from "@/lib/mock-data";

export const Route = createFileRoute("/plantillas")({
  head: () => ({
    meta: [
      { title: "Plantillas de WhatsApp — PedidoFlow" },
      {
        name: "description",
        content:
          "Gestiona plantillas de WhatsApp aprobadas por Meta para confirmar pedidos, pedir adelantos, rompe-vistos y enviar guías Shalom.",
      },
      { property: "og:title", content: "Plantillas de WhatsApp — PedidoFlow" },
      {
        property: "og:description",
        content: "Plantillas de utilidad, marketing y autenticación con su estado de aprobación en Meta.",
      },
    ],
  }),
  component: PlantillasPage,
});

const statusStyles: Record<
  Template["status"],
  { badgeCls: string; borderCls: string; icon: typeof CheckCircle2 }
> = {
  Aprobada: {
    badgeCls: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30",
    borderCls: "border-emerald-500/30",
    icon: CheckCircle2,
  },
  "En revisión": {
    badgeCls: "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30",
    borderCls: "border-amber-500/30",
    icon: Clock3,
  },
  Rechazada: {
    badgeCls: "bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/30",
    borderCls: "border-rose-500/30",
    icon: XCircle,
  },
};

const categoryTabs: { id: "todas" | FunctionalCategory; label: string; icon: any }[] = [
  { id: "todas", label: "Todas las plantillas", icon: Layers },
  { id: "confirmacion", label: "Confirmación COD", icon: CheckCircle2 },
  { id: "rompe_vistos", label: "Rompe-Vistos", icon: RotateCcw },
  { id: "logistica", label: "Logística Shalom", icon: Truck },
  { id: "finanzas", label: "Finanzas & Adelantos", icon: DollarSign },
  { id: "marketing", label: "Marketing & Upsells", icon: TrendingUp },
];

// EXACTAMENTE LAS 16 VARIABLES DE LA IMAGEN DE REFERENCIA
const AVAILABLE_VARIABLES = [
  { tag: "[Nombre]", label: "Nombre" },
  { tag: "[Teléfono]", label: "Teléfono" },
  { tag: "[DNI]", label: "DNI" },
  { tag: "[Email]", label: "Email" },
  { tag: "[Productos]", label: "Productos" },
  { tag: "[Valor]", label: "Valor" },
  { tag: "[Pedido]", label: "Pedido" },
  { tag: "[Cupón]", label: "Cupón" },
  { tag: "[Dirección]", label: "Dirección" },
  { tag: "[Distrito]", label: "Distrito" },
  { tag: "[Departamento]", label: "Departamento" },
  { tag: "[Provincia]", label: "Provincia" },
  { tag: "[Ciudad]", label: "Ciudad" },
  { tag: "[Referencia]", label: "Referencia" },
  { tag: "[Agencia]", label: "Agencia" },
  { tag: "[Guía]", label: "Guía" },
] as const;

function highlightVariables(text: string) {
  return text
    .split(/(\{\{[a-zA-Z0-9_-]+\}\}|\[[a-zA-ZáéíóúÁÉÍÓÚñÑ0-9\s_-]+\])/g)
    .map((part, i) =>
      (part.startsWith("{{") && part.endsWith("}}")) ||
      (part.startsWith("[") && part.endsWith("]")) ? (
        <span
          key={i}
          className="inline-block rounded-md bg-emerald-500/15 border border-emerald-500/30 px-1.5 py-0.2 font-mono text-[11px] font-bold text-emerald-600 dark:text-emerald-400"
        >
          {part}
        </span>
      ) : (
        <span key={i}>{part}</span>
      )
    );
}

// Reemplazo de variables simulado para la vista previa de WhatsApp
function fillPreviewVariables(text: string) {
  return text
    // Formato [Variable]
    .replace(/\[Nombre\]/gi, "Juan Pérez")
    .replace(/\[Teléfono\]/gi, "+51 987 654 321")
    .replace(/\[DNI\]/gi, "48201945")
    .replace(/\[Email\]/gi, "juan.perez@gmail.com")
    .replace(/\[Productos\]/gi, "Pack 3x Medias Bamboo")
    .replace(/\[Valor\]/gi, "S/ 149.00")
    .replace(/\[Pedido\]/gi, "#PF-8821")
    .replace(/\[Cupón\]/gi, "DESC15")
    .replace(/\[Dirección\]/gi, "Av. Larco 450")
    .replace(/\[Distrito\]/gi, "Miraflores")
    .replace(/\[Departamento\]/gi, "Lima")
    .replace(/\[Provincia\]/gi, "Lima")
    .replace(/\[Ciudad\]/gi, "Lima")
    .replace(/\[Referencia\]/gi, "Frente al parque Kennedy")
    .replace(/\[Agencia\]/gi, "Shalom")
    .replace(/\[Guía\]/gi, "SH-882194")
    // Formato {{variable}}
    .replace(/\{\{nombre_cliente\}\}/g, "Juan Pérez")
    .replace(/\{\{numero_pedido\}\}/g, "#PF-8821")
    .replace(/\{\{productos\}\}/g, "Pack 3x Medias Bamboo")
    .replace(/\{\{monto\}\}/g, "149.00")
    .replace(/\{\{monto_adelanto\}\}/g, "30.00")
    .replace(/\{\{monto_saldo\}\}/g, "119.00")
    .replace(/\{\{direccion\}\}/g, "Av. Larco 450")
    .replace(/\{\{distrito\}\}/g, "Miraflores")
    .replace(/\{\{ciudad\}\}/g, "Lima")
    .replace(/\{\{agencia\}\}/g, "Shalom")
    .replace(/\{\{codigo_guia\}\}/g, "SH-882194")
    .replace(/\{\{cupon\}\}/g, "DESC15")
    .replace(/\{\{codigo\}\}/g, "482019");
}

function PlantillasPage() {
  const [templateList, setTemplateList] = useState<Template[]>(initialTemplates);
  const [selectedCategory, setSelectedCategory] = useState<"todas" | FunctionalCategory>("todas");
  const [selectedStatus, setSelectedStatus] = useState<"todos" | Template["status"]>("todos");
  const [searchQuery, setSearchQuery] = useState("");

  const [isSyncing, setIsSyncing] = useState(false);

  // Toast de retroalimentación
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleSyncTemplates = () => {
    setIsSyncing(true);
    showToast("Sincronizando estado con Meta API...");
    
    // Simular retraso de red y actualización aleatoria
    setTimeout(() => {
      setTemplateList((prev) =>
        prev.map((t) => {
          if (t.status === "En revisión") {
            const r = Math.random();
            if (r > 0.4) {
              return { ...t, status: "Aprobada" as const };
            } else if (r > 0.1) {
              return t; // Sigue en revisión
            } else {
              return {
                ...t,
                status: "Rechazada" as const,
                rejectionReason: "Incumplimiento de la política de comercio de Meta (promocional en categoría equivocada).",
              };
            }
          }
          return t;
        })
      );
      setIsSyncing(false);
      showToast("🔄 ¡Sincronización completada con éxito!");
    }, 1500);
  };

  // Simulador de WhatsApp
  const [simulatorOpen, setSimulatorOpen] = useState(false);
  const [simulatedTemplate, setSimulatedTemplate] = useState<Template | null>(null);

  // Modal Creador / Editor de Plantilla
  const [creatorOpen, setCreatorOpen] = useState(false);
  const [editingTemplateId, setEditingTemplateId] = useState<string | null>(null);
  const [creatorStep, setCreatorStep] = useState<1 | 2 | 3>(1);

  const [newTName, setNewTName] = useState("");
  const [newTMetaCategory, setNewTMetaCategory] = useState<"Utilidad" | "Marketing" | "Autenticación">("Utilidad");
  const [newTFunctionalCat, setNewTFunctionalCat] = useState<FunctionalCategory>("confirmacion");
  const [newTHeaderType, setNewTHeaderType] = useState<"none" | "text" | "image" | "video" | "document">("none");
  const [newTHeaderText, setNewTHeaderText] = useState("");
  const [newTBody, setNewTBody] = useState(
    "¡Hola [Nombre]! 👋 Recibimos tu pedido [Pedido] por un total de S/ [Valor] con pago contraentrega en [Dirección] ([Ciudad]). ¿Confirmas tu entrega?"
  );
  const [newTFooter, setNewTFooter] = useState("Tienda Andina · Delivery Seguro");
  const [newTButtons, setNewTButtons] = useState<TemplateButton[]>([
    { type: "QUICK_REPLY", text: "✅ Sí, confirmo" },
    { type: "QUICK_REPLY", text: "❌ Deseo cancelar" },
  ]);

  // Ref al textarea para inserción en la posición exacta del cursor
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Inserción y copiado de variable
  const handleInsertVariableTag = (tag: string) => {
    const textarea = textareaRef.current;
    if (!textarea) {
      setNewTBody((prev) => `${prev} ${tag}`);
    } else {
      const start = textarea.selectionStart ?? newTBody.length;
      const end = textarea.selectionEnd ?? newTBody.length;
      const text = newTBody;
      const nextText = text.substring(0, start) + `${tag}` + text.substring(end);
      setNewTBody(nextText);
      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(start + tag.length, start + tag.length);
      }, 10);
    }
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(tag).catch(() => {});
    }
    showToast(`Variable ${tag} copiada e insertada`);
  };

  // Agregar botón al formulario
  const handleAddButton = () => {
    if (newTButtons.length >= 3) {
      showToast("Meta permite un máximo de 3 botones de respuesta rápida");
      return;
    }
    setNewTButtons((prev) => [...prev, { type: "QUICK_REPLY", text: "Nuevo Botón" }]);
  };

  const handleRemoveButton = (idx: number) => {
    setNewTButtons((prev) => prev.filter((_, i) => i !== idx));
  };

  // Abrir modal de creación limpio
  const handleOpenCreateNew = () => {
    setEditingTemplateId(null);
    setNewTName("");
    setNewTMetaCategory("Utilidad");
    setNewTFunctionalCat(selectedCategory === "todas" ? "confirmacion" : selectedCategory);
    setNewTHeaderType("none");
    setNewTHeaderText("");
    setNewTBody("¡Hola [Nombre]! 👋 Recibimos tu pedido [Pedido] por S/ [Valor]. ¿Confirmas para enviártelo hoy?");
    setNewTFooter("Tienda Andina · Delivery Seguro");
    setNewTButtons([
      { type: "QUICK_REPLY", text: "✅ Sí, confirmo" },
      { type: "QUICK_REPLY", text: "❌ Deseo cancelar" },
    ]);
    setCreatorStep(1);
    setCreatorOpen(true);
  };

  // Abrir modal de edición para plantilla existente
  const handleOpenEditTemplate = (t: Template) => {
    setEditingTemplateId(t.id);
    setNewTName(t.name);
    setNewTMetaCategory(t.category);
    setNewTFunctionalCat(t.functionalCategory);
    setNewTHeaderType(t.headerType || "none");
    setNewTHeaderText(t.headerText || "");
    setNewTBody(t.body);
    setNewTFooter(t.footer || "");
    setNewTButtons(t.buttons ? [...t.buttons] : []);
    setCreatorStep(2); // Directo al paso 2 con el editor de mensaje y las 16 variables
    setCreatorOpen(true);
  };

  // Enviar a revisión en Meta o guardar edición
  const handleSaveAndSendToMeta = () => {
    if (!newTName.trim()) {
      showToast("Ingresa un nombre para la plantilla");
      return;
    }
    const cleanName = newTName.toLowerCase().replace(/[^a-z0-9_]/g, "_");

    if (editingTemplateId) {
      // Actualizar plantilla existente
      setTemplateList((prev) =>
        prev.map((t) =>
          t.id === editingTemplateId
            ? {
                ...t,
                name: cleanName,
                category: newTMetaCategory,
                functionalCategory: newTFunctionalCat,
                status: "En revisión",
                headerType: newTHeaderType === "none" ? undefined : newTHeaderType,
                headerText: newTHeaderType === "text" ? newTHeaderText : undefined,
                headerMediaName:
                  newTHeaderType === "image"
                    ? "imagen_producto.jpg"
                    : newTHeaderType === "document"
                    ? "catalogo.pdf"
                    : undefined,
                body: newTBody,
                footer: newTFooter || undefined,
                buttons: newTButtons.length > 0 ? newTButtons : undefined,
                updatedAt: "Editado y reenviado a Meta",
              }
            : t
        )
      );
      setCreatorOpen(false);
      setEditingTemplateId(null);
      showToast("🔄 ¡Plantilla actualizada y enviada a revisión de Meta!");
    } else {
      // Crear nueva
      const created: Template = {
        id: `t-${Date.now()}`,
        name: cleanName,
        category: newTMetaCategory,
        functionalCategory: newTFunctionalCat,
        status: "En revisión",
        headerType: newTHeaderType === "none" ? undefined : newTHeaderType,
        headerText: newTHeaderType === "text" ? newTHeaderText : undefined,
        headerMediaName:
          newTHeaderType === "image"
            ? "imagen_producto.jpg"
            : newTHeaderType === "document"
            ? "catalogo.pdf"
            : undefined,
        body: newTBody,
        footer: newTFooter || undefined,
        buttons: newTButtons.length > 0 ? newTButtons : undefined,
        sent: 0,
        readRate: 0,
        clickRate: 0,
        updatedAt: "Enviado a Meta ahora",
      };

      setTemplateList((prev) => [created, ...prev]);
      setCreatorOpen(false);
      setCreatorStep(1);
      setNewTName("");
      showToast("🚀 ¡Plantilla enviada a revisión de Meta! Respuesta estimada: 24 horas.");
    }
  };

  // Duplicar plantilla
  const handleDuplicateTemplate = (t: Template) => {
    const duplicated: Template = {
      ...t,
      id: `t-${Date.now()}`,
      name: `${t.name}_copia`,
      status: "En revisión",
      sent: 0,
      readRate: 0,
      clickRate: 0,
      updatedAt: "Duplicado recientemente",
    };
    setTemplateList((prev) => [duplicated, ...prev]);
    showToast(`Plantilla "${t.name}" duplicada exitosamente`);
  };

  // Eliminar plantilla
  const handleDeleteTemplate = (id: string) => {
    setTemplateList((prev) => prev.filter((t) => t.id !== id));
    showToast("Plantilla eliminada");
  };

  // Abrir simulador
  const handleOpenSimulator = (t: Template) => {
    setSimulatedTemplate(t);
    setSimulatorOpen(true);
  };

  // Filtrado reactivo
  const filteredTemplates = useMemo(() => {
    return templateList.filter((t) => {
      const matchCat = selectedCategory === "todas" || t.functionalCategory === selectedCategory;
      const matchStatus = selectedStatus === "todos" || t.status === selectedStatus;
      const matchQuery =
        searchQuery.trim() === "" ||
        t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.body.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (t.headerText && t.headerText.toLowerCase().includes(searchQuery.toLowerCase()));

      return matchCat && matchStatus && matchQuery;
    });
  }, [templateList, selectedCategory, selectedStatus, searchQuery]);

  // Conteos
  const totalTemplates = templateList.length;
  const countAprobadas = templateList.filter((t) => t.status === "Aprobada").length;
  const countRevision = templateList.filter((t) => t.status === "En revisión").length;
  const countRechazadas = templateList.filter((t) => t.status === "Rechazada").length;
  const totalSentMonth = templateList.reduce((acc, t) => acc + t.sent, 0);

  return (
    <AppShell
      title="Plantillas de WhatsApp"
      subtitle="Mensajes oficiales preaprobados por Meta Cloud API para iniciar conversaciones y despachos fuera de la ventana de 24 horas"
    >
      {/* TOAST DE CONFIRMACIÓN */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 rounded-2xl border border-emerald-500/30 bg-emerald-500/15 backdrop-blur-md px-4 py-2.5 text-xs font-bold text-emerald-500 shadow-xl flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="h-4 w-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      <div className="space-y-6">
        {/* BARRA DE MÉTRICAS KPI RESUMEN */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
          <div className="rounded-2xl border border-border bg-surface p-4 space-y-1 shadow-2xs">
            <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block">
              Plantillas Totales
            </span>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-black text-foreground">{totalTemplates}</span>
              <span className="text-xs font-semibold text-muted-foreground">Meta API</span>
            </div>
            <p className="text-[10px] text-muted-foreground">Registradas en tu cuenta de negocio</p>
          </div>

          <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-4 space-y-1 shadow-2xs">
            <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider block">
              🟢 Aprobadas Listas
            </span>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
                {countAprobadas}
              </span>
              <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                {Math.round((countAprobadas / (totalTemplates || 1)) * 100)}%
              </span>
            </div>
            <p className="text-[10px] text-muted-foreground">Listas para envíos masivos y bots</p>
          </div>

          <div className="rounded-2xl border border-amber-500/30 bg-amber-500/5 p-4 space-y-1 shadow-2xs">
            <span className="text-[11px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider block">
              🟡 En Revisión
            </span>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-black text-amber-600 dark:text-amber-400">
                {countRevision}
              </span>
              <span className="text-xs font-semibold text-muted-foreground">~24h</span>
            </div>
            <p className="text-[10px] text-muted-foreground">Pendientes de evaluación por Meta</p>
          </div>

          <div className="rounded-2xl border border-border bg-surface p-4 space-y-1 shadow-2xs">
            <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block">
              Envíos este mes
            </span>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-black text-foreground">
                {totalSentMonth.toLocaleString("es-PE")}
              </span>
              <span className="text-xs font-semibold text-emerald-500">95% apertura</span>
            </div>
            <p className="text-[10px] text-muted-foreground">Mensajes entregados a clientes</p>
          </div>
        </div>

        {/* CABECERA CON PESTAÑAS DE CATEGORÍAS FUNCIONALES */}
        <div className="rounded-2xl border border-border bg-surface-2 p-3 sm:p-4 space-y-3.5 shadow-xs">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
            {/* PESTAÑAS FUNCIONALES */}
            <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0">
              {categoryTabs.map((tab) => {
                const Icon = tab.icon;
                const isSelected = selectedCategory === tab.id;
                const countInTab =
                  tab.id === "todas"
                    ? totalTemplates
                    : templateList.filter((t) => t.functionalCategory === tab.id).length;

                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setSelectedCategory(tab.id)}
                    className={`inline-flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                      isSelected
                        ? "bg-emerald-600 text-white shadow-sm ring-2 ring-emerald-600/30"
                        : "border border-border bg-surface text-muted-foreground hover:bg-muted hover:text-foreground"
                    }`}
                  >
                    <Icon className="h-3.5 w-3.5" />
                    <span>{tab.label}</span>
                    <span
                      className={`rounded-full px-1.5 py-0.2 text-[10px] ${
                        isSelected ? "bg-white/20 text-white" : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {countInTab}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* ACCIONES */}
            <div className="flex items-center gap-2 self-start lg:self-auto shrink-0">
              <button
                type="button"
                onClick={handleSyncTemplates}
                disabled={isSyncing}
                className="inline-flex items-center gap-2 rounded-xl bg-surface border border-border px-4 py-2.5 text-xs font-bold text-foreground hover:bg-muted transition shadow-sm cursor-pointer disabled:opacity-50"
              >
                <RefreshCw className={`h-4 w-4 ${isSyncing ? "animate-spin text-emerald-500" : "text-muted-foreground"}`} />
                <span>Sincronizar</span>
              </button>

              <button
                type="button"
                onClick={handleOpenCreateNew}
                className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-extrabold text-white hover:bg-emerald-500 transition shadow-sm cursor-pointer"
              >
                <Plus className="h-4 w-4" />
                <span>Crear nueva</span>
              </button>
            </div>
          </div>

          {/* BARRA DE BÚSQUEDA Y FILTROS POR ESTADO DE META */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-border/50">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Buscar por nombre, texto o variable (ej. shalom, confirmación)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-9 rounded-xl border border-border bg-surface pl-9 pr-3 text-xs text-foreground outline-none focus:border-primary"
              />
            </div>

            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-[11px] font-bold text-muted-foreground mr-1">Estado Meta:</span>
              {[
                { id: "todos" as const, label: "Todos" },
                { id: "Aprobada" as const, label: `🟢 Aprobada (${countAprobadas})` },
                { id: "En revisión" as const, label: `🟡 En revisión (${countRevision})` },
                { id: "Rechazada" as const, label: `🔴 Rechazada (${countRechazadas})` },
              ].map((st) => (
                <button
                  key={st.id}
                  type="button"
                  onClick={() => setSelectedStatus(st.id)}
                  className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition cursor-pointer ${
                    selectedStatus === st.id
                      ? "bg-foreground text-background font-bold"
                      : "border border-border bg-surface text-muted-foreground hover:bg-muted"
                  }`}
                >
                  {st.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* LISTADO DE PLANTILLAS */}
        {filteredTemplates.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border p-12 text-center space-y-3">
            <FileText className="h-10 w-10 text-muted-foreground mx-auto" />
            <h3 className="text-sm font-bold text-foreground">
              No se encontraron plantillas con los filtros aplicados
            </h3>
            <p className="text-xs text-muted-foreground max-w-sm mx-auto">
              Prueba cambiando la categoría, el estado de Meta o borrando el término de búsqueda.
            </p>
            <button
              type="button"
              onClick={() => {
                setSelectedCategory("todas");
                setSelectedStatus("todos");
                setSearchQuery("");
              }}
              className="inline-flex items-center gap-1 text-xs font-bold text-emerald-500 hover:underline cursor-pointer"
            >
              Restablecer todos los filtros
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4.5">
            {filteredTemplates.map((t) => {
              const statusCfg = statusStyles[t.status];
              const StatusIcon = statusCfg.icon;

              return (
                <div
                  key={t.id}
                  className="rounded-2xl border border-border bg-surface-2 p-5 space-y-4 shadow-xs transition-all hover:border-emerald-500/40 hover:shadow-md flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    {/* CABECERA DE LA TARJETA */}
                    <div className="flex items-start justify-between gap-2 border-b border-border/50 pb-2.5">
                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-1.5">
                          <h3 className="font-mono text-xs font-bold text-foreground truncate max-w-[200px]" title={t.name}>
                            {t.name}
                          </h3>
                        </div>
                        <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground font-medium">
                          <span className="rounded bg-surface border border-border px-1.5 py-0.2 capitalize">
                            {t.functionalCategory.replace("_", " ")}
                          </span>
                          <span>·</span>
                          <span className="capitalize">{t.category}</span>
                        </div>
                      </div>

                      {/* BADGE DE ESTADO META */}
                      <span
                        className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[11px] font-bold shrink-0 ${statusCfg.badgeCls}`}
                      >
                        <StatusIcon className="h-3 w-3" />
                        {t.status}
                      </span>
                    </div>

                    {/* CABECERA MULTIMEDIA / TEXTO SI EXISTE */}
                    {t.headerType && (
                      <div className="rounded-xl border border-border/80 bg-surface p-2.5 text-xs flex items-center gap-2">
                        {t.headerType === "text" && (
                          <div className="flex items-center gap-1.5 font-bold text-foreground text-[11px]">
                            <FileText className="h-3.5 w-3.5 text-emerald-500" />
                            <span>Cabecera: {t.headerText}</span>
                          </div>
                        )}
                        {t.headerType === "image" && (
                          <div className="flex items-center gap-1.5 font-semibold text-emerald-600 dark:text-emerald-400 text-[11px]">
                            <ImageIcon className="h-3.5 w-3.5" />
                            <span>Imagen adjunta: {t.headerMediaName}</span>
                          </div>
                        )}
                        {t.headerType === "document" && (
                          <div className="flex items-center gap-1.5 font-semibold text-sky-500 text-[11px]">
                            <FileCode className="h-3.5 w-3.5" />
                            <span>Documento PDF: {t.headerMediaName}</span>
                          </div>
                        )}
                      </div>
                    )}

                    {/* CUERPO CON VARIABLES RESALTADAS */}
                    <div className="rounded-xl bg-surface p-3.5 text-xs leading-relaxed text-foreground border border-border/70 whitespace-pre-line min-h-[90px]">
                      {highlightVariables(t.body)}
                    </div>

                    {/* FOOTER SI EXISTE */}
                    {t.footer && (
                      <p className="text-[10px] text-muted-foreground italic px-1">
                        Pie de página: {t.footer}
                      </p>
                    )}

                    {/* BOTONES INTERACTIVOS */}
                    {t.buttons && t.buttons.length > 0 && (
                      <div className="space-y-1.5 pt-1">
                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
                          Botones interactivos ({t.buttons.length}):
                        </span>
                        <div className="flex flex-wrap items-center gap-1.5">
                          {t.buttons.map((btn, bIdx) => (
                            <span
                              key={bIdx}
                              className="inline-flex items-center gap-1 rounded-lg border border-border bg-surface px-2.5 py-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 shadow-2xs"
                            >
                              {btn.type === "URL" && <ExternalLink className="h-3 w-3" />}
                              {btn.type === "QUICK_REPLY" && <Check className="h-3 w-3" />}
                              <span>{btn.text}</span>
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* MOTIVO DE RECHAZO SI ESTÁ RECHAZADA */}
                    {t.status === "Rechazada" && t.rejectionReason && (
                      <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-xs space-y-1">
                        <span className="font-bold text-rose-500 flex items-center gap-1">
                          <AlertTriangle className="h-3.5 w-3.5" /> Motivo de rechazo de Meta:
                        </span>
                        <p className="text-[11px] text-muted-foreground leading-relaxed">
                          {t.rejectionReason}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* SECCIÓN INFERIOR: MÉTRICAS Y ACCIONES */}
                  <div className="pt-3 border-t border-border/50 space-y-2.5">
                    {/* MÉTRICAS */}
                    <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                      <span className="font-semibold flex items-center gap-1">
                        <Send className="h-3 w-3 text-emerald-500" />
                        {t.sent.toLocaleString("es-PE")} envíos
                      </span>
                      {t.readRate !== undefined && t.readRate > 0 && (
                        <span className="font-semibold flex items-center gap-1">
                          <Eye className="h-3 w-3 text-sky-400" />
                          {t.readRate}% apertura
                        </span>
                      )}
                      {t.clickRate !== undefined && t.clickRate > 0 && (
                        <span className="font-semibold flex items-center gap-1">
                          <MousePointerClick className="h-3 w-3 text-amber-400" />
                          {t.clickRate}% clics
                        </span>
                      )}
                    </div>

                    {/* BOTONES DE ACCIÓN */}
                    <div className="flex items-center justify-between pt-1">
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleOpenSimulator(t)}
                          className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-surface px-3 py-1.5 text-xs font-bold text-emerald-500 hover:bg-muted transition cursor-pointer"
                          title="Ver en simulador de WhatsApp de teléfono"
                        >
                          <Smartphone className="h-3.5 w-3.5" />
                          <span>Simular</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleOpenEditTemplate(t)}
                          className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-surface px-2.5 py-1.5 text-xs font-bold text-foreground hover:bg-muted transition cursor-pointer"
                          title="Editar contenido y variables"
                        >
                          <Edit className="h-3.5 w-3.5 text-sky-500" />
                          <span>Editar</span>
                        </button>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => handleDuplicateTemplate(t)}
                          className="rounded-lg p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted transition cursor-pointer"
                          title="Duplicar plantilla"
                        >
                          <Copy className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteTemplate(t.id)}
                          className="rounded-lg p-1.5 text-muted-foreground hover:text-rose-500 hover:bg-rose-500/10 transition cursor-pointer"
                          title="Eliminar plantilla"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* MODAL CREADOR / EDITOR DE PLANTILLA PASO A PASO                          */}
      {/* ========================================================================= */}
      {creatorOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="relative w-full max-w-2xl rounded-3xl border border-border bg-surface p-6 shadow-2xl space-y-5 max-h-[92vh] overflow-y-auto">
            {/* CABECERA MODAL */}
            <div className="flex items-start justify-between border-b border-border pb-3">
              <div>
                <span className="rounded-md bg-emerald-500/15 text-emerald-500 px-2 py-0.5 text-[10px] font-bold">
                  {editingTemplateId ? "Editor de Plantilla Meta" : "Asistente Meta API"}
                </span>
                <h3 className="text-lg font-extrabold text-foreground mt-1">
                  {editingTemplateId ? `Editar: ${newTName}` : "Crear Nueva Plantilla de WhatsApp"}
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Mensajes oficiales aprobados para escribir fuera de la ventana de 24h.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setCreatorOpen(false)}
                className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* STEPPER PASOS DENTRO DEL MODAL */}
            <div className="grid grid-cols-3 gap-2 border-b border-border pb-3 text-xs">
              <button
                type="button"
                onClick={() => setCreatorStep(1)}
                className={`flex items-center gap-2 p-2 rounded-xl text-left transition cursor-pointer ${
                  creatorStep === 1
                    ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-bold border border-emerald-500/30"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-white text-[10px]">
                  1
                </span>
                <span>Datos Básicos</span>
              </button>

              <button
                type="button"
                onClick={() => setCreatorStep(2)}
                className={`flex items-center gap-2 p-2 rounded-xl text-left transition cursor-pointer ${
                  creatorStep === 2
                    ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-bold border border-emerald-500/30"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-white text-[10px]">
                  2
                </span>
                <span>Contenido & Variables</span>
              </button>

              <button
                type="button"
                onClick={() => setCreatorStep(3)}
                className={`flex items-center gap-2 p-2 rounded-xl text-left transition cursor-pointer ${
                  creatorStep === 3
                    ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-bold border border-emerald-500/30"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-white text-[10px]">
                  3
                </span>
                <span>Botones & Vista Previa</span>
              </button>
            </div>

            {/* PASO 1: DATOS BÁSICOS */}
            {creatorStep === 1 && (
              <div className="space-y-4 animate-in fade-in">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-foreground uppercase tracking-wider">
                    Nombre oficial de la plantilla:
                  </label>
                  <input
                    type="text"
                    placeholder="ej. confirmacion_despacho_v2 (solo minúsculas y guiones bajos)"
                    value={newTName}
                    onChange={(e) => setNewTName(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, "_"))}
                    className="w-full h-10 rounded-xl border border-border bg-surface-2 px-3 text-xs font-mono font-bold text-foreground outline-none focus:border-primary"
                  />
                  <p className="text-[11px] text-muted-foreground">
                    Meta exige nombres únicos en minúsculas sin espacios ni caracteres especiales.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-foreground">
                      Categoría de Meta:
                    </label>
                    <select
                      value={newTMetaCategory}
                      onChange={(e) => setNewTMetaCategory(e.target.value as any)}
                      className="w-full h-10 rounded-xl border border-border bg-surface-2 px-3 text-xs font-bold text-foreground outline-none focus:border-primary"
                    >
                      <option value="Utilidad">Utilidad (Confirmaciones, Despachos, Cobranzas)</option>
                      <option value="Marketing">Marketing (Promociones, Rompe-Vistos, Upsells)</option>
                      <option value="Autenticación">Autenticación (Códigos OTP de seguridad)</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-foreground">
                      Uso en PedidoFlow:
                    </label>
                    <select
                      value={newTFunctionalCat}
                      onChange={(e) => setNewTFunctionalCat(e.target.value as any)}
                      className="w-full h-10 rounded-xl border border-border bg-surface-2 px-3 text-xs font-bold text-foreground outline-none focus:border-primary"
                    >
                      <option value="confirmacion">Confirmación de Pedidos COD</option>
                      <option value="rompe_vistos">Rompe-Vistos & Recuperación</option>
                      <option value="logistica">Logística Shalom & Despachos</option>
                      <option value="finanzas">Finanzas & Adelantos de Flete</option>
                      <option value="marketing">Marketing & Catálogo Upsell</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5 pt-2 border-t border-border/50">
                  <label className="block text-xs font-bold text-foreground">
                    Tipo de Cabecera (Opcional):
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {[
                      { id: "none" as const, label: "Ninguna", icon: X },
                      { id: "text" as const, label: "Texto Titular", icon: FileText },
                      { id: "image" as const, label: "Imagen", icon: ImageIcon },
                      { id: "document" as const, label: "PDF / Doc", icon: FileCode },
                    ].map((hdr) => {
                      const isSel = newTHeaderType === hdr.id;
                      const Icon = hdr.icon;
                      return (
                        <button
                          key={hdr.id}
                          type="button"
                          onClick={() => setNewTHeaderType(hdr.id)}
                          className={`flex items-center justify-center gap-1.5 p-2.5 rounded-xl border text-xs font-bold transition cursor-pointer ${
                            isSel
                              ? "border-emerald-500 bg-emerald-500/15 text-emerald-500"
                              : "border-border bg-surface-2 text-muted-foreground hover:bg-muted"
                          }`}
                        >
                          <Icon className="h-3.5 w-3.5" />
                          <span>{hdr.label}</span>
                        </button>
                      );
                    })}
                  </div>

                  {newTHeaderType === "text" && (
                    <input
                      type="text"
                      placeholder="Escribe el texto de cabecera en negrita (máx 60 caracteres)..."
                      value={newTHeaderText}
                      onChange={(e) => setNewTHeaderText(e.target.value)}
                      className="w-full h-9 rounded-xl border border-border bg-surface-2 px-3 text-xs font-bold text-foreground outline-none focus:border-primary mt-2"
                    />
                  )}
                </div>

                <div className="pt-3 flex justify-end">
                  <button
                    type="button"
                    onClick={() => {
                      if (!newTName.trim()) {
                        showToast("Ingresa un nombre para continuar");
                        return;
                      }
                      setCreatorStep(2);
                    }}
                    className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-emerald-500 transition shadow-sm cursor-pointer"
                  >
                    <span>Siguiente: Contenido del Mensaje</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}

            {/* =================================================================== */}
            {/* PASO 2: CONTENIDO DEL MENSAJE Y LAS 16 VARIABLES DE LA IMAGEN       */}
            {/* =================================================================== */}
            {creatorStep === 2 && (
              <div className="space-y-4 animate-in fade-in">
                {/* CABECERA CON TITULO Y CONTADOR DE CARACTERES (COMO EN LA IMAGEN) */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-bold text-foreground">
                      Contenido del Mensaje
                    </label>
                    <span
                      className={`text-xs font-mono font-semibold ${
                        newTBody.length > 1024
                          ? "text-rose-500 font-bold"
                          : "text-muted-foreground"
                      }`}
                    >
                      {newTBody.length} / 1024 caracteres
                    </span>
                  </div>

                  {/* TEXTAREA CON PLACEHOLDER EXACTO */}
                  <textarea
                    ref={textareaRef}
                    rows={6}
                    maxLength={1024}
                    placeholder="Escribe el contenido de tu mensaje aquí..."
                    value={newTBody}
                    onChange={(e) => setNewTBody(e.target.value)}
                    className="w-full rounded-2xl border border-border bg-surface-2 p-3.5 text-xs text-foreground outline-none focus:border-primary font-mono leading-relaxed resize-y placeholder:text-muted-foreground/60 shadow-inner"
                  />
                </div>

                {/* VARIABLES DISPONIBLES: 16 (EXACTAMENTE COMO EN LA IMAGEN) */}
                <div className="space-y-2.5 pt-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-foreground">
                      Variables disponibles:
                    </span>
                    <span className="inline-flex items-center justify-center rounded-full bg-sky-500/15 border border-sky-500/30 text-sky-400 px-2.5 py-0.5 text-xs font-black shadow-2xs">
                      {AVAILABLE_VARIABLES.length}
                    </span>
                  </div>

                  {/* LOS 16 BOTONES CON ICONO COPY */}
                  <div className="flex flex-wrap items-center gap-2">
                    {AVAILABLE_VARIABLES.map((v) => (
                      <button
                        key={v.tag}
                        type="button"
                        onClick={() => handleInsertVariableTag(v.tag)}
                        className="group inline-flex items-center gap-1.5 rounded-xl border border-border bg-surface-2 px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-muted hover:border-sky-500/60 hover:text-sky-400 transition active:scale-95 shadow-2xs cursor-pointer"
                        title={`Insertar y copiar ${v.tag}`}
                      >
                        <span className="font-mono">{v.tag}</span>
                        <Copy className="h-3 w-3 text-muted-foreground group-hover:text-sky-400 transition" />
                      </button>
                    ))}
                  </div>
                  <p className="text-[11px] text-muted-foreground italic">
                    💡 Haz clic en cualquier variable para insertarla directamente en el texto o copiarla.
                  </p>
                </div>

                {/* PIE DE PÁGINA */}
                <div className="space-y-1.5 pt-2 border-t border-border/50">
                  <label className="block text-xs font-bold text-foreground">
                    Pie de página (Opcional):
                  </label>
                  <input
                    type="text"
                    placeholder="Ej. Tienda Andina · WhatsApp Oficial"
                    value={newTFooter}
                    onChange={(e) => setNewTFooter(e.target.value)}
                    className="w-full h-9 rounded-xl border border-border bg-surface-2 px-3 text-xs text-foreground outline-none focus:border-primary"
                  />
                </div>

                <div className="pt-3 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setCreatorStep(1)}
                    className="rounded-xl border border-border px-4 py-2 text-xs font-semibold hover:bg-muted cursor-pointer"
                  >
                    Atrás
                  </button>

                  <button
                    type="button"
                    onClick={() => setCreatorStep(3)}
                    className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-emerald-500 transition shadow-sm cursor-pointer"
                  >
                    <span>Siguiente: Botones & Vista Previa</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}

            {/* PASO 3: BOTONES & VISTA PREVIA FINAL */}
            {creatorStep === 3 && (
              <div className="space-y-4 animate-in fade-in">
                {/* CONFIGURACIÓN DE BOTONES */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-foreground uppercase tracking-wider">
                      Botones Interactivos (Máximo 3):
                    </label>
                    {newTButtons.length < 3 && (
                      <button
                        type="button"
                        onClick={handleAddButton}
                        className="inline-flex items-center gap-1 text-xs font-bold text-emerald-500 hover:underline cursor-pointer"
                      >
                        <Plus className="h-3.5 w-3.5" /> Agregar botón
                      </button>
                    )}
                  </div>

                  <div className="space-y-2">
                    {newTButtons.map((btn, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <select
                          value={btn.type}
                          onChange={(e) => {
                            const val = e.target.value as any;
                            setNewTButtons((prev) =>
                              prev.map((b, i) => (i === idx ? { ...b, type: val } : b))
                            );
                          }}
                          className="h-9 rounded-xl border border-border bg-surface-2 px-2.5 text-xs font-bold text-foreground outline-none"
                        >
                          <option value="QUICK_REPLY">Respuesta Rápida</option>
                          <option value="URL">Enlace Web (URL)</option>
                        </select>

                        <input
                          type="text"
                          value={btn.text}
                          onChange={(e) => {
                            const val = e.target.value;
                            setNewTButtons((prev) =>
                              prev.map((b, i) => (i === idx ? { ...b, text: val } : b))
                            );
                          }}
                          placeholder="Texto del botón (máx 25 caracteres)"
                          className="flex-1 h-9 rounded-xl border border-border bg-surface-2 px-3 text-xs font-bold text-foreground outline-none focus:border-primary"
                        />

                        <button
                          type="button"
                          onClick={() => handleRemoveButton(idx)}
                          className="p-1.5 text-muted-foreground hover:text-rose-500 cursor-pointer"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* VISTA PREVIA RÁPIDA DENTRO DEL MODAL */}
                <div className="space-y-1.5 pt-2 border-t border-border/50">
                  <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block">
                    Vista previa de WhatsApp con datos de prueba:
                  </span>

                  <div className="max-w-md mx-auto rounded-2xl bg-[#0b141a] p-4 text-white space-y-2 text-xs shadow-md">
                    <div className="bg-[#202c33] rounded-2xl p-3.5 space-y-2 border border-[#2a3942]">
                      {newTHeaderType === "text" && newTHeaderText && (
                        <p className="font-extrabold text-[13px] text-white leading-tight">
                          {newTHeaderText}
                        </p>
                      )}
                      {newTHeaderType === "image" && (
                        <div className="h-32 rounded-xl bg-neutral-800 flex items-center justify-center text-xs text-muted-foreground">
                          📷 [Imagen de cabecera]
                        </div>
                      )}
                      {newTHeaderType === "document" && (
                        <div className="p-2 rounded-xl bg-neutral-800 flex items-center gap-2 text-xs text-sky-400 font-mono">
                          📄 [Documento PDF adjunto]
                        </div>
                      )}

                      <p className="text-[12px] leading-relaxed whitespace-pre-line text-[#e9edef]">
                        {fillPreviewVariables(newTBody)}
                      </p>

                      {newTFooter && (
                        <p className="text-[10px] text-[#8696a0] pt-1 border-t border-[#2a3942]">
                          {newTFooter}
                        </p>
                      )}
                    </div>

                    {/* BOTONES INTERACTIVOS EN LA VISTA PREVIA */}
                    {newTButtons.map((btn, idx) => (
                      <div
                        key={idx}
                        className="w-full text-center py-2 rounded-xl bg-[#202c33] text-sky-400 font-bold text-xs border border-[#2a3942]"
                      >
                        {btn.text}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-3 flex items-center justify-between border-t border-border">
                  <button
                    type="button"
                    onClick={() => setCreatorStep(2)}
                    className="rounded-xl border border-border px-4 py-2 text-xs font-semibold hover:bg-muted cursor-pointer"
                  >
                    Atrás
                  </button>

                  <button
                    type="button"
                    onClick={handleSaveAndSendToMeta}
                    className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-2.5 text-xs font-extrabold text-white hover:bg-emerald-500 transition shadow-md cursor-pointer"
                  >
                    <Send className="h-4 w-4" />
                    <span>
                      {editingTemplateId ? "Guardar y Reenviar a Meta" : "Enviar a Aprobación de Meta"}
                    </span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL SIMULADOR EN VIVO DE WHATSAPP (MOCKUP TELÉFONO)                     */}
      {/* ========================================================================= */}
      {simulatorOpen && simulatedTemplate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="relative w-full max-w-sm rounded-[36px] border-4 border-neutral-800 bg-neutral-950 p-3 shadow-2xl">
            <button
              onClick={() => setSimulatorOpen(false)}
              className="absolute -top-3 -right-3 z-10 rounded-full bg-surface border border-border p-1.5 text-foreground shadow-lg hover:bg-muted cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="rounded-[28px] bg-[#0b141a] text-white overflow-hidden flex flex-col h-[560px]">
              {/* TOP BAR DE WHATSAPP */}
              <div className="bg-[#202c33] px-3.5 py-3 flex items-center gap-2.5 border-b border-[#2a3942]">
                <div className="h-8 w-8 rounded-full bg-emerald-600 flex items-center justify-center text-xs font-bold text-white">
                  TA
                </div>
                <div>
                  <div className="flex items-center gap-1">
                    <span className="text-xs font-bold text-white">Tienda Andina Oficial</span>
                    <span className="text-[10px] text-emerald-400">✓</span>
                  </div>
                  <span className="text-[10px] text-emerald-400">Cuenta de empresa oficial</span>
                </div>
              </div>

              {/* CONTENIDO DEL CHAT */}
              <div className="flex-1 p-3.5 overflow-y-auto space-y-3 text-xs bg-[radial-gradient(#1f2c34_1px,transparent_1px)] [background-size:16px_16px]">
                <div className="flex justify-center">
                  <span className="rounded-md bg-[#182229] px-2.5 py-0.5 text-[9px] text-[#8696a0]">
                    🔒 Mensaje verificado de Meta Cloud API
                  </span>
                </div>

                <div className="space-y-2">
                  <div className="rounded-2xl rounded-tl-xs bg-[#202c33] p-3 text-white shadow-md space-y-2 border border-[#2a3942] max-w-[90%]">
                    {/* CABECERA */}
                    {simulatedTemplate.headerType === "text" && (
                      <p className="font-extrabold text-[12px] text-white">
                        {simulatedTemplate.headerText}
                      </p>
                    )}
                    {simulatedTemplate.headerType === "image" && (
                      <div className="h-32 rounded-xl bg-neutral-800 flex items-center justify-center text-xs text-muted-foreground border border-neutral-700">
                        📷 {simulatedTemplate.headerMediaName}
                      </div>
                    )}
                    {simulatedTemplate.headerType === "document" && (
                      <div className="p-2.5 rounded-xl bg-neutral-800 flex items-center gap-2 text-xs text-sky-400 font-mono border border-neutral-700">
                        📄 {simulatedTemplate.headerMediaName}
                      </div>
                    )}

                    {/* CUERPO DEL MENSAJE REEMPLAZADO CON VARIABLES REALISTAS */}
                    <p className="text-[11px] leading-relaxed whitespace-pre-line text-[#e9edef]">
                      {fillPreviewVariables(simulatedTemplate.body)}
                    </p>

                    {/* FOOTER */}
                    {simulatedTemplate.footer && (
                      <p className="text-[10px] text-[#8696a0] pt-1 border-t border-[#2a3942]">
                        {simulatedTemplate.footer}
                      </p>
                    )}

                    <div className="flex items-center justify-end gap-1 text-[9px] text-[#8696a0] pt-0.5">
                      <span>14:30</span>
                      <span className="text-sky-400 font-bold">✓✓</span>
                    </div>
                  </div>

                  {/* BOTONES INTERACTIVOS CLICABLES */}
                  {simulatedTemplate.buttons &&
                    simulatedTemplate.buttons.map((btn, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() =>
                          showToast(`Clic en botón simulado: "${btn.text}"`)
                        }
                        className="w-[90%] text-center py-2.5 rounded-xl bg-[#202c33] text-sky-400 font-bold text-xs border border-[#2a3942] hover:bg-[#2a3942] transition shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        {btn.type === "URL" && <ExternalLink className="h-3 w-3" />}
                        {btn.type === "QUICK_REPLY" && <Check className="h-3 w-3" />}
                        <span>{btn.text}</span>
                      </button>
                    ))}
                </div>
              </div>

              {/* FOOTER DEL TELÉFONO */}
              <div className="bg-[#202c33] px-3 py-2.5 flex items-center gap-2 border-t border-[#2a3942]">
                <div className="flex-1 rounded-xl bg-[#2a3942] px-3 py-1.5 text-[11px] text-[#8696a0]">
                  Escribe un mensaje...
                </div>
                <div className="h-7 w-7 rounded-full bg-emerald-500 flex items-center justify-center text-white">
                  <Send className="h-3.5 w-3.5" />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </AppShell>
  );
}
