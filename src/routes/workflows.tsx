import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import {
  Workflow,
  Sparkles,
  Clock,
  MessageSquare,
  CheckCircle2,
  XCircle,
  Plus,
  Play,
  RotateCcw,
  Smartphone,
  Send,
  ArrowRight,
  Zap,
  TrendingUp,
  Check,
  X,
  Truck,
  Bell,
  Info,
  ArrowLeft,
  Wand2,
  Sliders,
  ShoppingBag,
  MapPin,
  Tag,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Image,
  Video,
  Mic,
  Trash2,
  Paperclip,
  Pencil,
  Search,
  Filter,
  Layers,
  Link2,
  FileText,
  AlertCircle,
  Copy,
  Power,
  FileCode,
} from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { templates as mockTemplates, type Template } from "@/lib/mock-data";

export const Route = createFileRoute("/workflows")({
  head: () => ({
    meta: [
      { title: "Workflows — PedidoFlow" },
      {
        name: "description",
        content:
          "Centro de automatizaciones: Secuencia inicial de campañas, Rompe-vistos, Confirmaciones COD y Logística Shalom, Upsells y Notificaciones internas.",
      },
      { property: "og:title", content: "Workflows — PedidoFlow" },
    ],
  }),
  component: WorkflowsPage,
});

type WorkflowTab =
  | "secuencia_inicial"
  | "rompe_vistos"
  | "confirmacion_logistica"
  | "upsells"
  | "notificaciones";

interface TutorialContent {
  title: string;
  subtitle: string;
  badge: string;
  steps: { title: string; desc: string }[];
  tips: string[];
}

const tutorials: Record<WorkflowTab, TutorialContent> = {
  secuencia_inicial: {
    title: "Tutorial: Secuencia Inicial para Campañas de WhatsApp",
    subtitle: "Cómo automatizar la bienvenida y cierre con tráfico de anuncios Meta / TikTok Ads",
    badge: "Campañas CTWA",
    steps: [
      {
        title: "1. Conecta tu palabra clave del anuncio",
        desc: "Configura el texto que el cliente envía al dar clic en tu anuncio (ej. 'HOLA QUIERO LAS MEDIAS'). La secuencia se disparará inmediatamente.",
      },
      {
        title: "2. Estructura el mensaje de impacto",
        desc: "Envía un texto breve de saludo acompañado de una imagen o video corto demostrando el producto, para que el cliente no se enfríe.",
      },
      {
        title: "3. Ofrece botones de combos",
        desc: "Presenta opciones claras de compra (ej. Pack 3x S/79 vs Pack 6x S/129) con botones directos para que el cliente elija sin fricción.",
      },
    ],
    tips: [
      "No envíes un mensaje kilométrico; divide la respuesta en 2 mensajes cortos.",
      "Los videos de menos de 10 segundos tienen un 68% más de retención.",
      "Usa la variable [Nombre] para que el bot suene humano.",
    ],
  },
  rompe_vistos: {
    title: "Tutorial: Sistema de Rompe-Vistos",
    subtitle: "Estrategias para resucitar conversaciones frías y clientes que dejaron en visto",
    badge: "Recuperación",
    steps: [
      {
        title: "1. Define la ventana de inactividad",
        desc: "El primer recordatorio debe enviarse entre 30 min y 2 horas después de que el cliente dejó de responder.",
      },
      {
        title: "2. Escala la urgencia con cupones",
        desc: "En el segundo o tercer intento, incluye un cupón de descuento temporal (ej. 'DESC10' o 'Envío Gratis') para destrabar la decisión.",
      },
      {
        title: "3. Aplica cierre definitivo",
        desc: "Si tras 3 intentos en 24h no responde, el pedido pasa a 'No confirma' para no desgastar a tu equipo.",
      },
    ],
    tips: [
      "El tono del primer mensaje debe ser servicial; el último debe marcar urgencia por stock limitado.",
      "Ofrecer delivery gratis convierte el doble que un 10% de descuento en provincias.",
    ],
  },
  confirmacion_logistica: {
    title: "Tutorial: Confirmaciones COD & Logística de Envíos",
    subtitle: "Garantiza entregas efectivas y reduce devoluciones en pedidos contraentrega",
    badge: "COD + Shalom",
    steps: [
      {
        title: "1. Envío automático a 1 minuto",
        desc: "Si el cliente compró en Shopify y no escribió, PedidoFlow envía la plantilla de confirmación a los 60 segundos.",
      },
      {
        title: "2. Validación de dirección y DNI",
        desc: "El cliente confirma con un botón. Para envíos a provincia (Shalom), se solicita adelanto de S/ 20-30.",
      },
      {
        title: "3. Avisos automáticos de guía y recojo",
        desc: "Cuando la agencia recibe el paquete, se notifica el número de guía Shalom y el saldo a cancelar al recoger.",
      },
    ],
    tips: [
      "Incluir el recordatorio de 'Presentar DNI físico' en Shalom reduce en 40% los paquetes devueltos.",
      "Las plantillas de logística son tipo 'Utility' y pueden enviarse fuera de la ventana de 24 horas de Meta.",
    ],
  },
  upsells: {
    title: "Tutorial: Upsells y Ventas Cruzadas",
    subtitle: "Cómo aumentar tu ticket promedio sin gastar un sol más en publicidad",
    badge: "Aumentar Ticket",
    steps: [
      {
        title: "1. Elige el momento exacto",
        desc: "El momento de mayor dopamina es 1 minuto después de confirmar, o 3 minutos después de que Shalom marca 'Entregado'.",
      },
      {
        title: "2. Ofrece productos complementarios",
        desc: "Si compró zapatillas, ofrece medias o plantillas. Nunca ofrezcas un producto inconexo.",
      },
      {
        title: "3. Facilita la adición en un solo clic",
        desc: "El cliente solo debe responder 'SÍ' y el monto se agrega automáticamente a su pedido contraentrega.",
      },
    ],
    tips: [
      "Los combos de bajo costo (S/ 20 a S/ 40) tienen una tasa de aceptación superior al 22%.",
      "Adjuntar un PDF con tu catálogo de temporada genera compras recurrentes a 15 días.",
    ],
  },
  notificaciones: {
    title: "Tutorial: Alertas Internas al Equipo",
    subtitle: "Mantén a tu equipo de ventas y logística coordinado sin salir de WhatsApp/Telegram",
    badge: "Equipo Interno",
    steps: [
      {
        title: "1. Configura el remitente oficial",
        desc: "Selecciona el número de WhatsApp Business que enviará los avisos al equipo.",
      },
      {
        title: "2. Asigna destinatarios por rol",
        desc: "Configura alertas de pagos a Karina, confirmaciones a Luis, y resumen diario al Administrador.",
      },
      {
        title: "3. Mantén activa la ventana de 24h",
        desc: "Cada miembro del equipo debe responder al bot al menos una vez al día para no perder las alertas.",
      },
    ],
    tips: [
      "Telegram no tiene restricciones de ventana de 24h, por lo que es ideal como canal de respaldo.",
      "Activa alertas de 'Stock bajo' para no vender productos agotados en Shopify.",
    ],
  },
};

const cardsData = [
  {
    id: "secuencia_inicial" as WorkflowTab,
    title: "Secuencia Inicial",
    desc: "Mensajes automáticos de bienvenida y campañas de WhatsApp Ads",
    icon: Zap,
    badge: "Activo",
  },
  {
    id: "rompe_vistos" as WorkflowTab,
    title: "Rompe-Vistos",
    desc: "Reactivar conversaciones sin respuesta y clientes que dejaron en visto",
    icon: RotateCcw,
    badge: "Recuperación",
  },
  {
    id: "confirmacion_logistica" as WorkflowTab,
    title: "Confirmación y Logística",
    desc: "Validar pedidos COD, draft orders y avisos de guía Shalom con DNI",
    icon: Truck,
    badge: "COD + Shalom",
  },
  {
    id: "upsells" as WorkflowTab,
    title: "Upsells",
    desc: "Ventas adicionales automáticas post confirmación o post entrega",
    icon: TrendingUp,
    badge: "+14% Venta",
  },
  {
    id: "notificaciones" as WorkflowTab,
    title: "Notificaciones Automáticas",
    desc: "Alertas y avisos internos para el equipo por WhatsApp y Telegram",
    icon: Bell,
    badge: "Equipo",
  },
];

const channelStages: Record<"whatsapp" | "shopify" | "logistica", { value: string; label: string }[]> = {
  whatsapp: [
    { value: "wa_entrante", label: "Mensajes entrantes" },
    { value: "wa_interaccion", label: "Interacción" },
    { value: "wa_compromiso", label: "Compromiso de Pago" },
    { value: "wa_seguimiento", label: "Seguimiento" },
    { value: "confirmado", label: "Pedidos Realizados" },
  ],
  shopify: [
    { value: "sh_entrante", label: "Pedidos Entrantes" },
    { value: "sh_no_responden", label: "No responden (24h)" },
    { value: "sh_interaccion", label: "Interacción" },
    { value: "sh_seguimiento", label: "Seguimiento" },
    { value: "sh_compromiso", label: "Compromiso de Pago" },
    { value: "confirmado", label: "Pedidos Confirmados" },
    { value: "sh_descartado", label: "Descartado" },
  ],
  logistica: [
    { value: "por_despachar", label: "Por Despachar" },
    { value: "registrado", label: "Registrado" },
    { value: "en_transito", label: "En Tránsito" },
    { value: "pendiente_recojo", label: "Pendiente de Recojo" },
    { value: "incidencia", label: "Incidencia" },
    { value: "entregado", label: "Entregado" },
  ],
};

const getMaxDigits = (unit: "segundos" | "minutos" | "horas") => {
  if (unit === "segundos") return 5;
  if (unit === "minutos") return 4;
  return 2;
};

// Conversión a segundos para orden cronológico estricto
const getStepSeconds = (step: RompeVistoStepItem): number => {
  if (step.waitUnit === "segundos") return step.waitValue;
  if (step.waitUnit === "minutos") return step.waitValue * 60;
  return step.waitValue * 3600;
};

// Tiempo más temprano de despacho de un flujo para ordenarlo frente a otros flujos
const getFlowEarliestSeconds = (flow: SavedRompeVistoFlow): number => {
  if (!flow.steps || flow.steps.length === 0) return 0;
  return Math.min(...flow.steps.map(getStepSeconds));
};

interface RompeVistoStepItem {
  id: string;
  waitValue: number;
  waitUnit: "segundos" | "minutos" | "horas";
  condition: "visto" | "no_visto" | "cualquiera";
  coupon: string;
  copy: string;
  attachment: { type: "imagen" | "video" | "audio"; name: string } | null;
}

interface SavedRompeVistoFlow {
  id: string;
  product: string;
  shippingType: "contraentrega" | "agencia";
  sourceChannel: "whatsapp" | "shopify" | "logistica";
  monitoredStage: string;
  steps: RompeVistoStepItem[];
  active: boolean;
  createdAt: string;
  updatedAt: number;
}

// Estructura de un Upsell
interface UpsellItem {
  id: string;
  trigger: "post_confirmacion" | "post_entrega";
  offerType: "catalogo_pdf" | "productos_especificos";
  selectedProduct?: string;
  copy: string;
  attachment: { type: "imagen" | "video" | "audio" | "pdf"; name: string } | null;
  active: boolean;
  createdAt: string;
}

const extendedCatalogList = [
  "Pack Bóxers Microfibra Dry-Fit (x6)",
  "Faja Reductora Térmica WaistPro",
  "Mochila Antirrobo Impermeable USB",
  "Audífonos Inalámbricos Bluetooth Pro TWS",
  "Kit Afeitadora 5 en 1 Multifunción",
  "Lámpara Solar LED de Seguridad con Sensor",
  "Smartwatch Ultra Titanium Series 9",
  "Corrector de Postura Ortopédico Unisex",
  "Todos los productos del catálogo",
];

// Estructura para configuración de cada mensaje en Confirmaciones y Logística
interface FlowMessageConfig {
  mode: "nueva" | "existente";
  isLinked: boolean;
  newTemplateText: string;
  selectedTemplateId: string;
  updatedAt?: string;
}

export function WorkflowsPage() {
  const [selectedTab, setSelectedTab] = useState<WorkflowTab | null>(null);
  const [activeTutorial, setActiveTutorial] = useState<WorkflowTab | null>(null);
  const [simulatorOpen, setSimulatorOpen] = useState(false);
  const [simulatorMessage, setSimulatorMessage] = useState<string>(
    "Hola Juan 👋 Recibimos tu pedido #PF-8821 por S/ 149.00 contraentrega. ¿Confirmas tu compra para enviártelo mañana?"
  );

  // Rompe-Vistos
  const [savedRompeVistos, setSavedRompeVistos] = useState<SavedRompeVistoFlow[]>([]);
  const [isCreatingNewFlow, setIsCreatingNewFlow] = useState<boolean>(true);
  const [expandedProducts, setExpandedProducts] = useState<Record<string, boolean>>({});
  const [editingFlowId, setEditingFlowId] = useState<string | null>(null);
  const [filterChannel, setFilterChannel] = useState<"todos" | "whatsapp" | "shopify" | "logistica">("todos");
  const [filterShipping, setFilterShipping] = useState<"todos" | "contraentrega" | "agencia">("todos");
  const [filterStage, setFilterStage] = useState<string>("todos");
  const [openPaso1, setOpenPaso1] = useState<boolean>(true);
  const [openPaso2, setOpenPaso2] = useState<boolean>(true);
  const [openPaso3, setOpenPaso3] = useState<boolean>(true);
  const [openOrigen, setOpenOrigen] = useState<boolean>(true);
  const [showExtendedCatalog, setShowExtendedCatalog] = useState(false);
  const [productSearch, setProductSearch] = useState("");
  const [rvProduct, setRvProduct] = useState("Medias Bamboo (Pack 3x / 6x)");
  const [rvShippingType, setRvShippingType] = useState<"contraentrega" | "agencia">("contraentrega");
  const [rvCreationMode, setRvCreationMode] = useState<"manual" | "ia" | null>(null);
  const [rvGeneratingIa, setRvGeneratingIa] = useState(false);
  const [rvSourceChannel, setRvSourceChannel] = useState<"whatsapp" | "shopify" | "logistica">("whatsapp");
  const [rvMonitoredStage, setRvMonitoredStage] = useState<string>("wa_interaccion");
  const [currentRvSteps, setCurrentRvSteps] = useState<RompeVistoStepItem[]>([
    {
      id: "step-1",
      waitValue: 2,
      waitUnit: "horas",
      condition: "visto",
      coupon: "ENVIO-GRATIS",
      copy: "Hola [Nombre], vimos que te quedaste interesado en tu pedido pero no pudiste confirmar. ¡Solo por hoy tenemos cupón de [Cupón]! ¿Te lo separamos antes de que se agote el stock? 🔥",
      attachment: null,
    },
  ]);

  // ===========================================================================
  // ESTADOS CONFIRMACIÓN Y LOGÍSTICA
  // ===========================================================================
  const [confLogSubTab, setConfLogSubTab] = useState<"confirmaciones" | "logistica">("confirmaciones");

  // 1. Confirmaciones: Mensaje Regular
  const [confMsgRegular, setConfMsgRegular] = useState<FlowMessageConfig>({
    mode: "nueva",
    isLinked: true,
    newTemplateText: `¡Hola [Nombre]! 
🚚 Tu pedido ya está en camino: 
📦 Productos: [Productos] 
🏢 Agencia: [Agencia] 
🔢 Número de guía: [Guía] 

Puedes hacer seguimiento de tu pedido con el número de guía. ¡Gracias por tu compra!`,
    selectedTemplateId: "t1",
    updatedAt: "Guardado recientemente",
  });

  // 2. Confirmaciones: Mensaje Preliminar
  const [confMsgPreliminar, setConfMsgPreliminar] = useState<FlowMessageConfig>({
    mode: "nueva",
    isLinked: false,
    newTemplateText: `Hola [Nombre] 👋 Notamos que dejaste un pedido preliminar de [Productos] en nuestra tienda por S/ [Monto]. 
¿Deseas confirmar la entrega contraentrega para reservarte el stock hoy mismo? 📦 Responde SÍ para despachártelo hoy.`,
    selectedTemplateId: "t2",
  });

  // 3. Logística: Enviado por Agencia
  const [logMsgEnviado, setLogMsgEnviado] = useState<FlowMessageConfig>({
    mode: "nueva",
    isLinked: true,
    newTemplateText: `¡Buenas noticias [Nombre]! 🚚 Tu pedido de [Productos] ya fue entregado a la agencia [Agencia].
🔢 Número de Guía: [Guía]
💰 Saldo a cancelar al recoger: S/ [Monto]
Puedes hacer el seguimiento en la web de [Agencia] con tu número de guía.`,
    selectedTemplateId: "t4",
    updatedAt: "Guardado recientemente",
  });

  // 4. Logística: Llegó a Agencia
  const [logMsgLlego, setLogMsgLlego] = useState<FlowMessageConfig>({
    mode: "nueva",
    isLinked: false,
    newTemplateText: `¡Hola [Nombre]! 📦 Tu paquete ya llegó y está listo para ser retirado en la agencia [Agencia] de [Ciudad].
🔢 Guía: [Guía]
⚠️ Recuerda presentar tu DNI físico en ventanilla para retirar tu paquete. ¡Gracias por tu confianza!`,
    selectedTemplateId: "t3",
  });

  // ===========================================================================
  // ESTADOS UPSELLS (VENTA CRUZADA)
  // ===========================================================================
  const [upsells, setUpsells] = useState<UpsellItem[]>([
    {
      id: "upsell-1",
      trigger: "post_confirmacion",
      offerType: "productos_especificos",
      selectedProduct: "Pack 3x Medias Bamboo (40% OFF)",
      copy: "¡Excelente [Nombre]! Ya guardamos tu pedido. 🎉 Por confirmar ahora, puedes añadir un Pack de 3 pares de Medias Bamboo con 40% OFF por solo S/ 29 adicionales. ¿Deseas agregarlo a tu paquete?",
      attachment: { type: "imagen", name: "combo_medias_promo.jpg" },
      active: true,
      createdAt: "Activo",
    },
    {
      id: "upsell-2",
      trigger: "post_entrega",
      offerType: "catalogo_pdf",
      selectedProduct: "Catálogo Colección 2026",
      copy: "¡Hola [Nombre]! Esperamos que disfrutes tu compra 🚚🙌 Te compartimos nuestro Catálogo Completo en PDF con descuentos exclusivos de hasta 30% en tu próxima compra.",
      attachment: { type: "pdf", name: "catalogo_completo_pedidoflow.pdf" },
      active: true,
      createdAt: "Activo",
    },
  ]);

  const [isCreatingUpsell, setIsCreatingUpsell] = useState<boolean>(false);
  const [editingUpsellId, setEditingUpsellId] = useState<string | null>(null);

  // Formulario de Upsell
  const [upTrigger, setUpTrigger] = useState<"post_confirmacion" | "post_entrega">("post_confirmacion");
  const [upOfferType, setUpOfferType] = useState<"catalogo_pdf" | "productos_especificos">("productos_especificos");
  const [upProduct, setUpProduct] = useState("Pack Bóxers Microfibra Dry-Fit (x6)");
  const [upCopy, setUpCopy] = useState(
    "¡Excelente [Nombre]! Ya guardamos tu pedido. 🎉 Por confirmar ahora, puedes añadir un Pack de 3 pares de Medias Bamboo con 40% OFF por solo S/ 29 adicionales. ¿Deseas agregarlo a tu paquete?"
  );
  const [upAttachment, setUpAttachment] = useState<{
    type: "imagen" | "video" | "audio" | "pdf";
    name: string;
  } | null>({ type: "imagen", name: "foto_combo_upsell.jpg" });
  const [upActive, setUpActive] = useState<boolean>(true);

  // Guardar o Actualizar Upsell
  const handleSaveUpsell = () => {
    if (editingUpsellId) {
      setUpsells((prev) =>
        prev.map((u) =>
          u.id === editingUpsellId
            ? {
                ...u,
                trigger: upTrigger,
                offerType: upOfferType,
                selectedProduct: upOfferType === "productos_especificos" ? upProduct : "Catálogo Completo PDF",
                copy: upCopy,
                attachment: upAttachment,
                active: upActive,
              }
            : u
        )
      );
      setEditingUpsellId(null);
      showToast("¡Upsell actualizado exitosamente!");
    } else {
      const newUp: UpsellItem = {
        id: `upsell-${Date.now()}`,
        trigger: upTrigger,
        offerType: upOfferType,
        selectedProduct: upOfferType === "productos_especificos" ? upProduct : "Catálogo Completo PDF",
        copy: upCopy,
        attachment: upAttachment,
        active: upActive,
        createdAt: "Ahora",
      };
      setUpsells((prev) => [newUp, ...prev]);
      showToast("¡Nuevo Upsell creado y guardado!");
    }
    setIsCreatingUpsell(false);
  };

  // Prender o Apagar Upsell individual
  const handleToggleUpsellActive = (upsellId: string) => {
    setUpsells((prev) =>
      prev.map((u) => (u.id === upsellId ? { ...u, active: !u.active } : u))
    );
    showToast("Estado del Upsell actualizado");
  };

  // Cargar Upsell para edición
  const handleEditUpsell = (item: UpsellItem) => {
    setEditingUpsellId(item.id);
    setUpTrigger(item.trigger);
    setUpOfferType(item.offerType);
    setUpProduct(item.selectedProduct || "Pack Bóxers Microfibra Dry-Fit (x6)");
    setUpCopy(item.copy);
    setUpAttachment(item.attachment);
    setUpActive(item.active);
    setIsCreatingUpsell(true);
  };

  // Eliminar Upsell
  const handleDeleteUpsell = (upsellId: string) => {
    setUpsells((prev) => prev.filter((u) => u.id !== upsellId));
    showToast("Upsell eliminado");
  };

  // Prender o Apagar Flujo en Rompe-Vistos
  const handleToggleFlowActive = (flowId: string) => {
    setSavedRompeVistos((prev) =>
      prev.map((f) => (f.id === flowId ? { ...f, active: !f.active } : f))
    );
    showToast("Estado del flujo de rompevistos actualizado");
  };

  // Notificación tipo toast
  const [statusToast, setStatusToast] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setStatusToast(msg);
    setTimeout(() => setStatusToast(null), 3000);
  };

  // Estado Secuencia Inicial
  const [initialKeyword, setInitialKeyword] = useState("PROMO MEDIAS");
  const [initialResponseText, setInitialResponseText] = useState(
    "¡Hola! 👋 Qué bueno que nos escribes desde nuestro anuncio. Te comparto las promociones exclusivas en medias de bambú disponibles hoy con envío contraentrega:"
  );

  // Estado Notificaciones
  const [testSent, setTestSent] = useState(false);

  const openSim = (msg: string) => {
    setSimulatorMessage(msg);
    setSimulatorOpen(true);
  };

  const insertVariableIntoText = (
    currentText: string,
    variableName: string,
    setter: (val: string) => void
  ) => {
    const formatted = `[${variableName}]`;
    setter(currentText ? `${currentText} ${formatted}` : formatted);
  };

  // Manejador de cambio de número de tiempo con límite estricto de cifras
  const handleStepWaitValueChange = (
    stepId: string,
    rawStr: string,
    unit: "segundos" | "minutos" | "horas"
  ) => {
    const maxD = getMaxDigits(unit);
    const cleaned = rawStr.replace(/[^0-9]/g, "").slice(0, maxD);
    const num = cleaned ? parseInt(cleaned, 10) : 1;
    setCurrentRvSteps((prev) =>
      prev.map((s) => (s.id === stepId ? { ...s, waitValue: num } : s))
    );
  };

  // Manejador de cambio de unidad de tiempo
  const handleStepWaitUnitChange = (
    stepId: string,
    newUnit: "segundos" | "minutos" | "horas"
  ) => {
    const maxD = getMaxDigits(newUnit);
    setCurrentRvSteps((prev) =>
      prev.map((s) => {
        if (s.id !== stepId) return s;
        const strVal = s.waitValue.toString();
        const clamped = parseInt(strVal.slice(0, maxD), 10) || 1;
        return { ...s, waitUnit: newUnit, waitValue: clamped };
      })
    );
  };

  // Toggle de multimedia adjunta en Rompe-Vistos
  const handleToggleAttachment = (
    stepId: string,
    type: "imagen" | "video" | "audio"
  ) => {
    const sampleFiles = {
      imagen: "foto_producto_promo.jpg",
      video: "video_demostracion.mp4",
      audio: "audio_asesor_voz.ogg",
    };

    setCurrentRvSteps((prev) =>
      prev.map((s) => {
        if (s.id !== stepId) return s;
        if (s.attachment?.type === type) {
          return { ...s, attachment: null };
        }
        return { ...s, attachment: { type, name: sampleFiles[type] } };
      })
    );
  };

  // Toggle de multimedia adjunta en Upsells
  const handleToggleUpsellAttachment = (type: "imagen" | "video" | "audio" | "pdf") => {
    const sampleFiles = {
      imagen: "foto_combo_upsell.jpg",
      video: "video_upsell_oferta.mp4",
      audio: "nota_voz_oferta.ogg",
      pdf: "catalogo_pedidoflow_2026.pdf",
    };

    if (upAttachment?.type === type) {
      setUpAttachment(null);
    } else {
      setUpAttachment({ type, name: sampleFiles[type] });
    }
  };

  // Agregar otro flujo / paso de recordatorio
  const handleAddAnotherStep = () => {
    const nextNum = currentRvSteps.length + 1;
    const newStep: RompeVistoStepItem = {
      id: `step-${Date.now()}`,
      waitValue: nextNum === 2 ? 6 : 24,
      waitUnit: "horas",
      condition: "cualquiera",
      coupon: nextNum === 2 ? "DESC15" : "ENVIO-GRATIS",
      copy: `Hola [Nombre], este es nuestro recordatorio #${nextNum}. Aún tenemos reservado tu pedido de ${rvProduct}. ¿Confirmamos para enviártelo hoy mismo?`,
      attachment: null,
    };
    setCurrentRvSteps((prev) => [...prev, newStep]);
  };

  // Eliminar un paso de recordatorio
  const handleRemoveStep = (stepId: string) => {
    if (currentRvSteps.length <= 1) return;
    setCurrentRvSteps((prev) => prev.filter((s) => s.id !== stepId));
  };

  // Editar flujo existente
  const handleEditFlow = (flow: SavedRompeVistoFlow) => {
    setEditingFlowId(flow.id);
    setRvProduct(flow.product);
    setRvShippingType(flow.shippingType);
    setRvSourceChannel(flow.sourceChannel);
    setRvMonitoredStage(flow.monitoredStage);
    setCurrentRvSteps([...flow.steps]);
    setIsCreatingNewFlow(true);
    setOpenPaso1(true);
    setOpenPaso2(true);
    setOpenPaso3(true);
    setOpenOrigen(true);
  };

  // Guardar y Activar Flujo (Nuevo o Actualizado)
  const handleSaveAndActivate = () => {
    const sortedSteps = [...currentRvSteps].sort(
      (a, b) => getStepSeconds(a) - getStepSeconds(b)
    );

    const now = Date.now();

    if (editingFlowId) {
      setSavedRompeVistos((prev) =>
        prev.map((f) =>
          f.id === editingFlowId
            ? {
                ...f,
                product: rvProduct,
                shippingType: rvShippingType,
                sourceChannel: rvSourceChannel,
                monitoredStage: rvMonitoredStage,
                steps: sortedSteps,
                updatedAt: now,
              }
            : f
        )
      );
      setEditingFlowId(null);
    } else {
      const newFlow: SavedRompeVistoFlow = {
        id: `flow-${now}`,
        product: rvProduct,
        shippingType: rvShippingType,
        sourceChannel: rvSourceChannel,
        monitoredStage: rvMonitoredStage,
        steps: sortedSteps,
        active: true,
        createdAt: "Ahora",
        updatedAt: now,
      };
      setSavedRompeVistos((prev) => [newFlow, ...prev]);
    }

    setIsCreatingNewFlow(false);
    setExpandedProducts({});
  };

  const handleGenerateIaFlow = () => {
    setRvGeneratingIa(true);
    setTimeout(() => {
      setRvGeneratingIa(false);
      const isCod = rvShippingType === "contraentrega";
      setCurrentRvSteps([
        {
          id: "step-ia-1",
          waitValue: 1,
          waitUnit: "horas",
          condition: "visto",
          coupon: isCod ? "PAGACONTRAENTREGA" : "ADELANTO-SHALOM",
          copy: isCod
            ? `Hola [Nombre] 👋 Vimos que te interesó ${rvProduct} pero no pudiste confirmar. ¡Tu repartidor tiene ruta disponible hoy para pago contraentrega con cupón [Cupón]! ¿Te lo separamos?`
            : `Hola [Nombre] 👋 Tu paquete de ${rvProduct} está listo en almacén. Para despacharte por Shalom hoy mismo te bonificamos el cupón [Cupón] en tu saldo. ¿Te compartimos los datos de Yape/Plin? 🚚`,
          attachment: { type: "imagen", name: "foto_producto_promo.jpg" },
        },
        {
          id: "step-ia-2",
          waitValue: 4,
          waitUnit: "horas",
          condition: "cualquiera",
          coupon: "SUPERPROMO",
          copy: `[Nombre], solo nos quedan 2 unidades disponibles de ${rvProduct} para el despacho de hoy. Si confirmas en la próxima hora te incluimos delivery prioritario.`,
          attachment: null,
        },
      ]);
    }, 1200);
  };

  // Etapas disponibles dinámicamente según el canal seleccionado
  const availableStages = useMemo(() => {
    if (filterChannel === "whatsapp") return channelStages.whatsapp;
    if (filterChannel === "shopify") return channelStages.shopify;
    if (filterChannel === "logistica") return channelStages.logistica;
    const all = [
      ...channelStages.whatsapp,
      ...channelStages.shopify.filter((s) => !channelStages.whatsapp.some((w) => w.value === s.value)),
      ...channelStages.logistica.filter(
        (s) =>
          !channelStages.whatsapp.some((w) => w.value === s.value) &&
          !channelStages.shopify.some((sh) => sh.value === s.value)
      ),
    ];
    return all;
  }, [filterChannel]);

  // Filtrado de flujos por Canal, Tipo de Entrega y Etapa
  const filteredFlows = useMemo(() => {
    return savedRompeVistos.filter((flow) => {
      const matchChannel = filterChannel === "todos" || flow.sourceChannel === filterChannel;
      const matchShipping = filterShipping === "todos" || flow.shippingType === filterShipping;
      const matchStage = filterStage === "todos" || flow.monitoredStage === filterStage;
      return matchChannel && matchShipping && matchStage;
    });
  }, [savedRompeVistos, filterChannel, filterShipping, filterStage]);

  // Agrupación de flujos filtrados por Producto
  const flowsByProduct = useMemo(() => {
    return filteredFlows.reduce<Record<string, SavedRompeVistoFlow[]>>((acc, flow) => {
      const list = acc[flow.product] ?? [];
      list.push(flow);
      acc[flow.product] = list;
      return acc;
    }, {});
  }, [filteredFlows]);

  // ORDENAR PRODUCTOS: El producto que se editó / creó al último SIEMPRE primero
  const sortedProductEntries = useMemo(() => {
    const productTimestamp: Record<string, number> = {};
    savedRompeVistos.forEach((f) => {
      productTimestamp[f.product] = Math.max(productTimestamp[f.product] ?? 0, f.updatedAt ?? 0);
    });

    return Object.entries(flowsByProduct).sort(([prodA], [prodB]) => {
      const timeA = productTimestamp[prodA] ?? 0;
      const timeB = productTimestamp[prodB] ?? 0;
      return timeB - timeA;
    });
  }, [flowsByProduct, savedRompeVistos]);

  const toggleProductExpand = (prod: string) => {
    setExpandedProducts((prev) => ({ ...prev, [prod]: !prev[prod] }));
  };

  // Conteos de los botones de filtro
  const countWhatsApp = savedRompeVistos.filter((f) => f.sourceChannel === "whatsapp").length;
  const countShopify = savedRompeVistos.filter((f) => f.sourceChannel === "shopify").length;
  const countLogistica = savedRompeVistos.filter((f) => f.sourceChannel === "logistica").length;
  const countContraentrega = savedRompeVistos.filter((f) => f.shippingType === "contraentrega").length;
  const countShalom = savedRompeVistos.filter((f) => f.shippingType === "agencia").length;

  return (
    <AppShell
      title="Workflows"
      subtitle={
        selectedTab === null
          ? "Automatizaciones inteligentes de venta, confirmación y logística"
          : "Configurando automatización seleccionada"
      }
    >
      {/* TOAST FLOTANTE DE ACCIÓN */}
      {statusToast && (
        <div className="fixed top-20 right-6 z-50 rounded-2xl border border-emerald-500/30 bg-emerald-500/15 backdrop-blur-md px-4 py-2.5 text-xs font-bold text-emerald-500 shadow-xl flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="h-4 w-4" />
          <span>{statusToast}</span>
        </div>
      )}

      {/* VISTA 1: INICIAL - SOLO LAS 5 TARJETAS PRINCIPALES CON EFECTO REBOTE DESDE ARRIBA */}
      {selectedTab === null ? (
        <div className="py-6 sm:py-10">
          <div className="text-center max-w-xl mx-auto mb-8">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-500 mb-2">
              <Sparkles className="h-3.5 w-3.5" />
              Suite de Automatizaciones
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
              Selecciona una automatización
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Haz clic en cualquiera de las 5 opciones para abrir su panel de configuración interactivo.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 max-w-7xl mx-auto">
            {cardsData.map((card, idx) => {
              const Icon = card.icon;
              return (
                <div
                  key={card.id}
                  onClick={() => setSelectedTab(card.id)}
                  style={{ animationDelay: `${idx * 80}ms` }}
                  className="animate-drop-bounce group relative cursor-pointer rounded-2xl border border-border bg-card/80 p-5 transition-all duration-300 hover:border-emerald-500 hover:bg-card hover:shadow-[0_10px_30px_rgba(16,185,129,0.18)] hover:-translate-y-1.5 flex flex-col justify-between"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/15 text-emerald-500 group-hover:scale-110 group-hover:bg-emerald-500 group-hover:text-white transition-all duration-300">
                      <Icon className="h-6 w-6" />
                    </div>
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-bold text-emerald-500 border border-emerald-500/20">
                      {card.badge}
                    </span>
                  </div>

                  <div className="my-5">
                    <h3 className="text-base font-bold text-foreground group-hover:text-emerald-500 transition">
                      {card.title}
                    </h3>
                    <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">
                      {card.desc}
                    </p>
                  </div>

                  <div className="space-y-2 pt-2 border-t border-border/50">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveTutorial(card.id);
                      }}
                      className="inline-flex items-center justify-center gap-1.5 w-full rounded-xl bg-emerald-500/15 py-2 text-xs font-bold text-emerald-500 hover:bg-emerald-500 hover:text-white transition"
                    >
                      <Play className="h-3 w-3 fill-current" />
                      Ver Tutorial
                    </button>

                    <div className="text-center">
                      <span className="text-[11px] font-semibold text-muted-foreground group-hover:text-foreground inline-flex items-center gap-1 transition">
                        Configurar flujo <ChevronRight className="h-3 w-3" />
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* VISTA 2: DOCK SUPERIOR Y PANEL DESPLEGADO */
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-3 duration-300">
          {/* BARRA SUPERIOR DOCK */}
          <div className="card-surface p-2.5 rounded-2xl border border-border flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-xs">
            <button
              onClick={() => setSelectedTab(null)}
              className="inline-flex items-center gap-2 rounded-xl px-3 py-1.5 text-xs font-bold text-muted-foreground hover:bg-muted hover:text-foreground transition self-start md:self-auto"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Ver todas las 5 automatizaciones</span>
            </button>

            {/* Pills de navegación */}
            <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto">
              {cardsData.map((c) => {
                const Icon = c.icon;
                const isActive = selectedTab === c.id;
                return (
                  <button
                    key={c.id}
                    onClick={() => setSelectedTab(c.id)}
                    className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold whitespace-nowrap transition-all ${
                      isActive
                        ? "bg-emerald-500 text-white shadow-sm ring-2 ring-emerald-500/30"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    }`}
                  >
                    <Icon className="h-3.5 w-3.5" />
                    <span>{c.title}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* CONTENIDO INTERACTIVO INFERIOR */}
          <div className="card-surface rounded-2xl border border-border p-6 shadow-sm">
            {/* ========================================================================= */}
            {/* 1. ROMPE-VISTOS                                                          */}
            {/* ========================================================================= */}
            {selectedTab === "rompe_vistos" && (
              <div className="space-y-6">
                {/* Cabecera del Módulo */}
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-border pb-4">
                  <div>
                    <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                      <RotateCcw className="h-5 w-5 text-emerald-500" />
                      Rompe-Vistos (Reactivación de Clientes)
                    </h2>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Recupera clientes que dejaron en visto o dejaron de responder en WhatsApp.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setActiveTutorial("rompe_vistos")}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-500/15 px-3 py-1.5 text-xs font-bold text-emerald-500 hover:bg-emerald-500 hover:text-white transition self-start sm:self-auto"
                  >
                    <Play className="h-3 w-3 fill-current" />
                    Ver Tutorial
                  </button>
                </div>

                {/* SI YA TIENE FLUJOS GUARDADOS Y NO ESTÁ CREANDO/EDITANDO OTRO */}
                {savedRompeVistos.length > 0 && !isCreatingNewFlow ? (
                  <div className="space-y-5 animate-in fade-in">
                    {/* BANNER PRINCIPAL */}
                    <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-3.5">
                        <div className="h-11 w-11 rounded-2xl bg-emerald-500 text-white flex items-center justify-center font-bold shadow-md">
                          <CheckCircle2 className="h-6 w-6" />
                        </div>
                        <div>
                          <h3 className="text-base font-bold text-foreground flex items-center gap-2">
                            <span>
                              Tienes {savedRompeVistos.length}{" "}
                              {savedRompeVistos.length === 1 ? "flujo de rompevistos configurado" : "flujos de rompevistos configurados"}
                            </span>
                            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/20 text-emerald-500 px-2 py-0.5 text-[10px] font-bold">
                              {savedRompeVistos.filter((f) => f.active).length} Prendidos
                            </span>
                          </h3>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            Filtrados por canal y ordenados cronológicamente por tiempo de envío.
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          setEditingFlowId(null);
                          setIsCreatingNewFlow(true);
                        }}
                        className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-emerald-500 transition shadow-sm self-start sm:self-auto"
                      >
                        <Plus className="h-4 w-4" />
                        Crear nuevo flujo
                      </button>
                    </div>

                    {/* BARRA DE FILTROS */}
                    <div className="rounded-2xl border border-border bg-surface-2 p-4 space-y-3.5 shadow-xs">
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
                        {/* 1. BOTONES DE CANAL */}
                        <div className="space-y-1">
                          <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block">
                            Canal de Captación:
                          </span>
                          <div className="flex flex-wrap items-center gap-1.5">
                            {[
                              { id: "todos" as const, label: "🌐 Todos", count: savedRompeVistos.length },
                              { id: "whatsapp" as const, label: "💬 WhatsApp", count: countWhatsApp },
                              { id: "shopify" as const, label: "🛍️ Shopify", count: countShopify },
                              { id: "logistica" as const, label: "🚚 Logística", count: countLogistica },
                            ].map((ch) => {
                              const isActive = filterChannel === ch.id;
                              return (
                                <button
                                  key={ch.id}
                                  type="button"
                                  onClick={() => {
                                    setFilterChannel(ch.id);
                                    setFilterStage("todos");
                                  }}
                                  className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold transition ${
                                    isActive
                                      ? "bg-emerald-600 text-white shadow-sm ring-1 ring-emerald-600/30"
                                      : "border border-border bg-surface text-muted-foreground hover:text-foreground hover:bg-muted"
                                  }`}
                                >
                                  <span>{ch.label}</span>
                                  <span
                                    className={`rounded-full px-1.5 py-0.2 text-[10px] ${
                                      isActive ? "bg-white/20 text-white" : "bg-muted text-muted-foreground"
                                    }`}
                                  >
                                    {ch.count}
                                  </span>
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        {/* 2. SEPARACIÓN POR CONTRAENTREGA Y SHALOM */}
                        <div className="space-y-1">
                          <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block">
                            Tipo de Entrega:
                          </span>
                          <div className="flex flex-wrap items-center gap-1.5">
                            {[
                              { id: "todos" as const, label: "Todos", count: savedRompeVistos.length },
                              { id: "contraentrega" as const, label: "🛵 Contraentrega", count: countContraentrega },
                              { id: "agencia" as const, label: "🚚 Shalom (Agencia)", count: countShalom },
                            ].map((sh) => {
                              const isActive = filterShipping === sh.id;
                              return (
                                <button
                                  key={sh.id}
                                  type="button"
                                  onClick={() => setFilterShipping(sh.id)}
                                  className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold transition ${
                                    isActive
                                      ? "bg-primary text-primary-foreground shadow-sm"
                                      : "border border-border bg-surface text-muted-foreground hover:text-foreground hover:bg-muted"
                                  }`}
                                >
                                  <span>{sh.label}</span>
                                  <span
                                    className={`rounded-full px-1.5 py-0.2 text-[10px] ${
                                      isActive ? "bg-white/20 text-white" : "bg-muted text-muted-foreground"
                                    }`}
                                  >
                                    {sh.count}
                                  </span>
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      </div>

                      {/* 3. FILTRO POR ETAPA */}
                      <div className="space-y-1 pt-2.5 border-t border-border/50">
                        <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block">
                          Filtrar por Etapa del Pedido:
                        </span>
                        <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto pb-0.5">
                          <button
                            type="button"
                            onClick={() => setFilterStage("todos")}
                            className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-semibold transition ${
                              filterStage === "todos"
                                ? "bg-foreground text-background font-bold"
                                : "border border-border bg-surface text-muted-foreground hover:bg-muted"
                            }`}
                          >
                            Todas las etapas
                          </button>
                          {availableStages.map((st) => {
                            const isActive = filterStage === st.value;
                            const countInStage = savedRompeVistos.filter((f) => {
                              const matchCh = filterChannel === "todos" || f.sourceChannel === filterChannel;
                              const matchSh = filterShipping === "todos" || f.shippingType === filterShipping;
                              return matchCh && matchSh && f.monitoredStage === st.value;
                            }).length;

                            return (
                              <button
                                key={st.value}
                                type="button"
                                onClick={() => setFilterStage(st.value)}
                                className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold transition ${
                                  isActive
                                    ? "bg-emerald-500 text-white font-bold shadow-xs"
                                    : "border border-border bg-surface text-muted-foreground hover:bg-muted"
                                }`}
                              >
                                <span>{st.label}</span>
                                {countInStage > 0 && (
                                  <span
                                    className={`rounded-full px-1.5 py-0.2 text-[9px] ${
                                      isActive ? "bg-white/20 text-white" : "bg-muted text-muted-foreground"
                                    }`}
                                  >
                                    {countInStage}
                                  </span>
                                )}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    {/* LISTADO DE PRODUCTOS */}
                    {sortedProductEntries.length === 0 ? (
                      <div className="rounded-2xl border border-dashed border-border p-8 text-center space-y-2">
                        <Filter className="h-8 w-8 text-muted-foreground mx-auto" />
                        <p className="text-xs font-semibold text-muted-foreground">
                          No hay flujos de rompevistos para los filtros seleccionados.
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {sortedProductEntries.map(([prodName, flows]) => {
                          const isExpanded = !!expandedProducts[prodName];
                          const totalSteps = flows.reduce((sum, f) => sum + f.steps.length, 0);

                          const codFlows = flows
                            .filter((f) => f.shippingType === "contraentrega")
                            .sort((a, b) => getFlowEarliestSeconds(a) - getFlowEarliestSeconds(b));

                          const shalomFlows = flows
                            .filter((f) => f.shippingType === "agencia")
                            .sort((a, b) => getFlowEarliestSeconds(a) - getFlowEarliestSeconds(b));

                          return (
                            <div
                              key={prodName}
                              className="rounded-2xl border border-border bg-surface-2 overflow-hidden shadow-xs transition hover:border-emerald-500/40"
                            >
                              {/* Cabecera del Producto (Tarjeta compacta) */}
                              <div
                                onClick={() => toggleProductExpand(prodName)}
                                className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer hover:bg-muted/30 transition select-none"
                              >
                                <div className="flex items-center gap-3">
                                  <div className="h-10 w-10 rounded-xl bg-emerald-500/15 text-emerald-500 flex items-center justify-center font-bold shrink-0">
                                    <ShoppingBag className="h-5 w-5" />
                                  </div>
                                  <div>
                                    <div className="flex flex-wrap items-center gap-2">
                                      <h4 className="text-sm font-bold text-foreground">{prodName}</h4>
                                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 px-2.5 py-0.5 text-xs font-bold">
                                        {flows.length} {flows.length === 1 ? "flujo" : "flujos"} ({flows.filter((f) => f.active).length} prendidos)
                                      </span>
                                    </div>
                                    <p className="text-[11px] text-muted-foreground mt-0.5">
                                      {totalSteps} {totalSteps === 1 ? "mensaje programado en total" : "mensajes programados en total"} · Ordenados por tiempo de envío
                                    </p>
                                  </div>
                                </div>

                                <div className="flex items-center gap-2 self-end sm:self-auto">
                                  <button
                                    type="button"
                                    className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-surface px-3 py-1.5 text-xs font-bold text-foreground hover:bg-muted transition"
                                  >
                                    <span>{isExpanded ? "Ocultar flujos" : "Ver flujos"}</span>
                                    {isExpanded ? (
                                      <ChevronUp className="h-3.5 w-3.5" />
                                    ) : (
                                      <ChevronDown className="h-3.5 w-3.5" />
                                    )}
                                  </button>
                                </div>
                              </div>

                              {/* Despliegue ordenado de los flujos de este producto */}
                              {isExpanded && (
                                <div className="p-4 sm:p-5 pt-0 border-t border-border/50 bg-surface/50 space-y-4 animate-in fade-in duration-200">
                                  {/* SECCIÓN 1: CONTRAENTREGA LOCAL */}
                                  {codFlows.length > 0 && (
                                    <div className="space-y-2 pt-3">
                                      <div className="flex items-center gap-2">
                                        <span className="inline-flex items-center gap-1 rounded-md bg-emerald-500/15 text-emerald-500 px-2 py-0.5 text-[11px] font-bold">
                                          🛵 Contraentrega Local ({codFlows.length} {codFlows.length === 1 ? "flujo" : "flujos"})
                                        </span>
                                        <span className="text-[10px] text-muted-foreground">
                                          Repartidor directo / cobro en destino al entregar
                                        </span>
                                      </div>

                                      <div className="space-y-2.5">
                                        {codFlows.map((flow, fIdx) => (
                                          <div
                                            key={flow.id}
                                            className="rounded-xl border border-emerald-500/30 bg-surface p-4 space-y-3 shadow-xs"
                                          >
                                            <div className="flex items-center justify-between border-b border-border/50 pb-2">
                                              <div className="flex flex-wrap items-center gap-2">
                                                <span className="text-xs font-bold text-foreground">
                                                  Flujo #{fIdx + 1}
                                                </span>
                                                <span className="rounded bg-emerald-500/10 text-emerald-500 px-2 py-0.5 text-[10px] font-semibold capitalize">
                                                  Canal: {flow.sourceChannel} ({flow.monitoredStage})
                                                </span>
                                                <span className="text-[10px] text-muted-foreground">
                                                  {flow.steps.length} {flow.steps.length === 1 ? "mensaje" : "mensajes"}
                                                </span>

                                                {/* BOTÓN PRENDIDO / APAGADO EN ROMPE-VISTOS */}
                                                <button
                                                  type="button"
                                                  onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleToggleFlowActive(flow.id);
                                                  }}
                                                  className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-bold transition border ${
                                                    flow.active
                                                      ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30"
                                                      : "bg-muted text-muted-foreground border-border"
                                                  }`}
                                                  title={flow.active ? "Flujo prendido (activo). Clic para apagar" : "Flujo apagado (pausado). Clic para prender"}
                                                >
                                                  <span className={`h-2 w-2 rounded-full ${flow.active ? "bg-emerald-500 animate-pulse" : "bg-muted-foreground/40"}`} />
                                                  <span>{flow.active ? "Prendido" : "Apagado"}</span>
                                                </button>
                                              </div>

                                              <div className="flex items-center gap-2">
                                                <button
                                                  onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleEditFlow(flow);
                                                  }}
                                                  className="inline-flex items-center gap-1 rounded-lg border border-border bg-surface px-2.5 py-1 text-xs font-bold text-amber-500 hover:bg-amber-500/10 transition"
                                                  title="Editar configuración y mensajes de este flujo"
                                                >
                                                  <Pencil className="h-3 w-3" />
                                                  Editar
                                                </button>
                                                <button
                                                  onClick={(e) => {
                                                    e.stopPropagation();
                                                    openSim(flow.steps[0]?.copy || "");
                                                  }}
                                                  className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-500 hover:underline"
                                                >
                                                  <Smartphone className="h-3.5 w-3.5" /> Simular
                                                </button>
                                                <button
                                                  onClick={(e) => {
                                                    e.stopPropagation();
                                                    setSavedRompeVistos((prev) => prev.filter((f) => f.id !== flow.id));
                                                  }}
                                                  className="text-muted-foreground hover:text-rose-500 p-1 transition"
                                                  title="Eliminar flujo"
                                                >
                                                  <Trash2 className="h-3.5 w-3.5" />
                                                </button>
                                              </div>
                                            </div>

                                            {/* Mensajes ordenados cronológicamente */}
                                            <div className="space-y-2">
                                              {[...flow.steps]
                                                .sort((a, b) => getStepSeconds(a) - getStepSeconds(b))
                                                .map((st, sIdx) => (
                                                  <div
                                                    key={st.id}
                                                    className="rounded-lg border border-border/70 bg-surface-2 p-2.5 text-xs space-y-1"
                                                  >
                                                    <div className="flex items-center justify-between font-semibold text-muted-foreground text-[11px]">
                                                      <span className="text-emerald-500 font-bold flex items-center gap-1.5">
                                                        <Clock className="h-3.5 w-3.5" />
                                                        Disparo #{sIdx + 1}: A los {st.waitValue} {st.waitUnit} de inactividad
                                                      </span>
                                                      {st.coupon && (
                                                        <span className="rounded bg-emerald-500/10 text-emerald-500 px-1.5 py-0.5 font-mono text-[10px] font-bold">
                                                          Cupón: {st.coupon}
                                                        </span>
                                                      )}
                                                    </div>
                                                    <p className="text-foreground text-[11px] leading-relaxed">{st.copy}</p>
                                                    {st.attachment && (
                                                      <span className="text-[10px] text-emerald-500 font-medium block">
                                                        📎 Adjunto: {st.attachment.name}
                                                      </span>
                                                    )}
                                                  </div>
                                                ))}
                                            </div>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  )}

                                  {/* SECCIÓN 2: ENVÍO POR AGENCIA SHALOM (PROVINCIAS) */}
                                  {shalomFlows.length > 0 && (
                                    <div className="space-y-2 pt-2">
                                      <div className="flex items-center gap-2">
                                        <span className="inline-flex items-center gap-1 rounded-md bg-sky-500/15 text-sky-500 px-2 py-0.5 text-[11px] font-bold">
                                          🚚 Agencia Shalom Provincias ({shalomFlows.length} {shalomFlows.length === 1 ? "flujo" : "flujos"})
                                        </span>
                                        <span className="text-[10px] text-muted-foreground">
                                          Envíos con solicitud de adelanto de S/ 20-30 y retiro con DNI
                                        </span>
                                      </div>

                                      <div className="space-y-2.5">
                                        {shalomFlows.map((flow, fIdx) => (
                                          <div
                                            key={flow.id}
                                            className="rounded-xl border border-sky-500/30 bg-surface p-4 space-y-3 shadow-xs"
                                          >
                                            <div className="flex items-center justify-between border-b border-border/50 pb-2">
                                              <div className="flex flex-wrap items-center gap-2">
                                                <span className="text-xs font-bold text-foreground">
                                                  Flujo #{fIdx + 1}
                                                </span>
                                                <span className="rounded bg-sky-500/10 text-sky-500 px-2 py-0.5 text-[10px] font-semibold capitalize">
                                                  Canal: {flow.sourceChannel} ({flow.monitoredStage})
                                                </span>
                                                <span className="text-[10px] text-muted-foreground">
                                                  {flow.steps.length} {flow.steps.length === 1 ? "mensaje" : "mensajes"}
                                                </span>

                                                {/* BOTÓN PRENDIDO / APAGADO */}
                                                <button
                                                  type="button"
                                                  onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleToggleFlowActive(flow.id);
                                                  }}
                                                  className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-bold transition border ${
                                                    flow.active
                                                      ? "bg-sky-500/15 text-sky-600 dark:text-sky-400 border-sky-500/30"
                                                      : "bg-muted text-muted-foreground border-border"
                                                  }`}
                                                  title={flow.active ? "Flujo prendido (activo). Clic para apagar" : "Flujo apagado (pausado). Clic para prender"}
                                                >
                                                  <span className={`h-2 w-2 rounded-full ${flow.active ? "bg-sky-500 animate-pulse" : "bg-muted-foreground/40"}`} />
                                                  <span>{flow.active ? "Prendido" : "Apagado"}</span>
                                                </button>
                                              </div>

                                              <div className="flex items-center gap-2">
                                                <button
                                                  onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleEditFlow(flow);
                                                  }}
                                                  className="inline-flex items-center gap-1 rounded-lg border border-border bg-surface px-2.5 py-1 text-xs font-bold text-amber-500 hover:bg-amber-500/10 transition"
                                                  title="Editar configuración y mensajes de este flujo"
                                                >
                                                  <Pencil className="h-3 w-3" />
                                                  Editar
                                                </button>
                                                <button
                                                  onClick={(e) => {
                                                    e.stopPropagation();
                                                    openSim(flow.steps[0]?.copy || "");
                                                  }}
                                                  className="inline-flex items-center gap-1 text-[11px] font-bold text-sky-500 hover:underline"
                                                >
                                                  <Smartphone className="h-3.5 w-3.5" /> Simular
                                                </button>
                                                <button
                                                  onClick={(e) => {
                                                    e.stopPropagation();
                                                    setSavedRompeVistos((prev) => prev.filter((f) => f.id !== flow.id));
                                                  }}
                                                  className="text-muted-foreground hover:text-rose-500 p-1 transition"
                                                  title="Eliminar flujo"
                                                >
                                                  <Trash2 className="h-3.5 w-3.5" />
                                                </button>
                                              </div>
                                            </div>

                                            {/* Mensajes ordenados cronológicamente */}
                                            <div className="space-y-2">
                                              {[...flow.steps]
                                                .sort((a, b) => getStepSeconds(a) - getStepSeconds(b))
                                                .map((st, sIdx) => (
                                                  <div
                                                    key={st.id}
                                                    className="rounded-lg border border-border/70 bg-surface-2 p-2.5 text-xs space-y-1"
                                                  >
                                                    <div className="flex items-center justify-between font-semibold text-muted-foreground text-[11px]">
                                                      <span className="text-sky-500 font-bold flex items-center gap-1.5">
                                                        <Clock className="h-3.5 w-3.5" />
                                                        Disparo #{sIdx + 1}: A los {st.waitValue} {st.waitUnit} de inactividad
                                                      </span>
                                                      {st.coupon && (
                                                        <span className="rounded bg-sky-500/10 text-sky-500 px-1.5 py-0.5 font-mono text-[10px] font-bold">
                                                          Cupón: {st.coupon}
                                                        </span>
                                                      )}
                                                    </div>
                                                    <p className="text-foreground text-[11px] leading-relaxed">{st.copy}</p>
                                                    {st.attachment && (
                                                      <span className="text-[10px] text-sky-500 font-medium block">
                                                        📎 Adjunto: {st.attachment.name}
                                                      </span>
                                                    )}
                                                  </div>
                                                ))}
                                            </div>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  )}

                                  <div className="pt-2 flex justify-end">
                                    <button
                                      onClick={() => {
                                        setEditingFlowId(null);
                                        setRvProduct(prodName);
                                        setIsCreatingNewFlow(true);
                                      }}
                                      className="inline-flex items-center gap-1 text-xs font-bold text-emerald-500 hover:underline"
                                    >
                                      <Plus className="h-3.5 w-3.5" /> Agregar otro flujo a este producto
                                    </button>
                                  </div>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                ) : (
                  /* MODO CREADOR / EDITOR DE FLUJO DE ROMPE-VISTOS */
                  <div className="space-y-4 animate-in fade-in">
                    {/* BANNER SI ESTÁ EN MODO EDICIÓN */}
                    {editingFlowId && (
                      <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-in fade-in">
                        <div className="flex items-center gap-2.5">
                          <div className="h-8 w-8 rounded-lg bg-amber-500 text-white flex items-center justify-center font-bold">
                            <Pencil className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="text-xs font-bold text-foreground">
                              Modificando flujo de rompevistos para: {rvProduct}
                            </p>
                            <p className="text-[11px] text-muted-foreground">
                              Puedes alterar los tiempos, textos, adjuntos o agregar más recordatorios.
                            </p>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            setEditingFlowId(null);
                            setIsCreatingNewFlow(false);
                          }}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-surface px-3 py-1.5 text-xs font-bold text-muted-foreground hover:text-foreground self-start sm:self-auto"
                        >
                          <X className="h-3.5 w-3.5" />
                          Cancelar edición
                        </button>
                      </div>
                    )}

                    {!editingFlowId && savedRompeVistos.length > 0 && (
                      <button
                        onClick={() => setIsCreatingNewFlow(false)}
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-muted-foreground hover:text-foreground mb-2"
                      >
                        <ArrowLeft className="h-3.5 w-3.5" />
                        Volver a mis flujos activos ({savedRompeVistos.length})
                      </button>
                    )}

                    {savedRompeVistos.length === 0 && (
                      <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-6 text-center space-y-2 mb-2">
                        <div className="h-12 w-12 rounded-2xl bg-emerald-500/15 text-emerald-500 flex items-center justify-center mx-auto mb-1">
                          <RotateCcw className="h-6 w-6" />
                        </div>
                        <h3 className="text-lg font-bold text-foreground">
                          Aún no tienes ningún flujo de rompevistos
                        </h3>
                        <p className="text-xs font-medium text-emerald-500 uppercase tracking-wider">
                          Empecemos a crear uno
                        </p>
                      </div>
                    )}

                    {/* PASO 1: SELECCIONAR PRODUCTO */}
                    <div className="rounded-2xl border border-border bg-surface-2 overflow-hidden shadow-xs">
                      <div
                        onClick={() => setOpenPaso1(!openPaso1)}
                        className="p-4 flex items-center justify-between cursor-pointer hover:bg-muted/30 transition select-none"
                      >
                        <div className="flex items-center gap-2">
                          <ShoppingBag className="h-4 w-4 text-emerald-500" />
                          <span className="text-xs font-bold text-foreground uppercase tracking-wider">
                            Paso 1: Seleccionar Producto
                          </span>
                          {!openPaso1 && (
                            <span className="rounded-md bg-emerald-500/10 text-emerald-500 px-2 py-0.5 text-xs font-bold ml-2">
                              {rvProduct}
                            </span>
                          )}
                        </div>
                        <div className="text-muted-foreground">
                          {openPaso1 ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                        </div>
                      </div>

                      {openPaso1 && (
                        <div className="p-4 pt-0 border-t border-border/50 space-y-3 animate-in fade-in">
                          <p className="text-xs text-muted-foreground mt-2">
                            Elige a qué producto o combo de tu catálogo aplicará esta regla de recuperación:
                          </p>

                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 pt-1">
                            {[
                              "Medias Bamboo (Pack 3x / 6x)",
                              "Zapatillas Running Ultralight",
                              "Reloj Inteligente FitPro",
                            ].map((p) => (
                              <button
                                key={p}
                                type="button"
                                onClick={() => {
                                  setRvProduct(p);
                                  setShowExtendedCatalog(false);
                                  setOpenPaso1(false);
                                }}
                                className={`rounded-xl border p-3 text-left text-xs font-semibold transition ${
                                  rvProduct === p
                                    ? "border-emerald-500 bg-emerald-500/10 text-emerald-500 ring-1 ring-emerald-500/30"
                                    : "border-border bg-surface text-foreground hover:bg-muted"
                                }`}
                              >
                                <span className="block">{p}</span>
                              </button>
                            ))}

                            <button
                              type="button"
                              onClick={() => setShowExtendedCatalog(!showExtendedCatalog)}
                              className={`rounded-xl border p-3 text-left text-xs font-bold transition flex items-center justify-between ${
                                showExtendedCatalog
                                  ? "border-primary bg-primary/10 text-primary ring-1 ring-primary/30"
                                  : "border-dashed border-border bg-surface text-foreground hover:border-primary hover:text-primary"
                              }`}
                            >
                              <span className="flex items-center gap-1.5">
                                <Search className="h-3.5 w-3.5" />
                                Elegir otro producto...
                              </span>
                              {showExtendedCatalog ? (
                                <ChevronUp className="h-3.5 w-3.5" />
                              ) : (
                                <ChevronDown className="h-3.5 w-3.5" />
                              )}
                            </button>
                          </div>

                          {showExtendedCatalog && (
                            <div className="rounded-xl border border-border bg-surface p-3.5 space-y-2.5 animate-in fade-in">
                              <div className="flex items-center justify-between">
                                <span className="text-xs font-bold text-foreground">
                                  Catálogo de Productos Disponibles:
                                </span>
                                <span className="text-[10px] text-muted-foreground">
                                  Haz clic en el producto deseado
                                </span>
                              </div>

                              <div className="relative">
                                <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
                                <input
                                  type="text"
                                  placeholder="Buscar en el catálogo..."
                                  value={productSearch}
                                  onChange={(e) => setProductSearch(e.target.value)}
                                  className="w-full h-8.5 rounded-lg border border-border bg-surface-2 pl-8.5 pr-3 text-xs text-foreground outline-none focus:border-primary"
                                />
                              </div>

                              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 max-h-48 overflow-y-auto pr-1">
                                {extendedCatalogList
                                  .filter((item) =>
                                    item.toLowerCase().includes(productSearch.toLowerCase())
                                  )
                                  .map((item, idx, arr) => {
                                    const isLast = idx === arr.length - 1;
                                    const isSelected = rvProduct === item;
                                    return (
                                      <button
                                        key={item}
                                        type="button"
                                        onClick={() => {
                                          setRvProduct(item);
                                          setShowExtendedCatalog(false);
                                          setOpenPaso1(false);
                                        }}
                                        className={`rounded-lg border p-2.5 text-left text-xs font-semibold transition ${
                                          isSelected
                                            ? "border-emerald-500 bg-emerald-500/15 text-emerald-500 font-bold ring-1 ring-emerald-500/30"
                                            : isLast
                                            ? "border-emerald-500/40 bg-emerald-500/5 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/10 font-bold col-span-full"
                                            : "border-border bg-surface-2 text-foreground hover:bg-muted"
                                        }`}
                                      >
                                        {isLast ? `🌟 ${item}` : item}
                                      </button>
                                    );
                                  })}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* PASO 2: SELECCIONAR CONTRAENTREGA O AGENCIA */}
                    <div className="rounded-2xl border border-border bg-surface-2 overflow-hidden shadow-xs">
                      <div
                        onClick={() => setOpenPaso2(!openPaso2)}
                        className="p-4 flex items-center justify-between cursor-pointer hover:bg-muted/30 transition select-none"
                      >
                        <div className="flex items-center gap-2">
                          <Truck className="h-4 w-4 text-emerald-500" />
                          <span className="text-xs font-bold text-foreground uppercase tracking-wider">
                            Paso 2: Tipo de Entrega (Contraentrega o Agencia)
                          </span>
                          {!openPaso2 && (
                            <span className="rounded-md bg-emerald-500/10 text-emerald-500 px-2 py-0.5 text-xs font-bold ml-2">
                              {rvShippingType === "contraentrega" ? "🛵 Local Contraentrega" : "🚚 Envío por Agencia (Shalom)"}
                            </span>
                          )}
                        </div>
                        <div className="text-muted-foreground">
                          {openPaso2 ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                        </div>
                      </div>

                      {openPaso2 && (
                        <div className="p-4 pt-0 border-t border-border/50 space-y-2 animate-in fade-in">
                          <p className="text-xs text-muted-foreground mt-2">
                            Define la logística para adaptar el mensaje de recuperación:
                          </p>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-xl pt-1">
                            <button
                              type="button"
                              onClick={() => {
                                setRvShippingType("contraentrega");
                                setOpenPaso2(false);
                              }}
                              className={`flex items-center gap-3 rounded-xl border p-3.5 text-left transition ${
                                rvShippingType === "contraentrega"
                                  ? "border-emerald-500 bg-emerald-500/10 text-emerald-500 ring-1 ring-emerald-500/30"
                                  : "border-border bg-surface text-foreground hover:bg-muted"
                              }`}
                            >
                              <div className="h-9 w-9 rounded-xl bg-emerald-500/15 text-emerald-500 flex items-center justify-center font-bold">
                                🛵
                              </div>
                              <div>
                                <p className="text-xs font-bold">Local Contraentrega</p>
                                <p className="text-[11px] text-muted-foreground">
                                  Repartidor con cobro al entregar
                                </p>
                              </div>
                            </button>

                            <button
                              type="button"
                              onClick={() => {
                                setRvShippingType("agencia");
                                setOpenPaso2(false);
                              }}
                              className={`flex items-center gap-3 rounded-xl border p-3.5 text-left transition ${
                                rvShippingType === "agencia"
                                  ? "border-emerald-500 bg-emerald-500/10 text-emerald-500 ring-1 ring-emerald-500/30"
                                  : "border-border bg-surface text-foreground hover:bg-muted"
                              }`}
                            >
                              <div className="h-9 w-9 rounded-xl bg-emerald-500/15 text-emerald-500 flex items-center justify-center font-bold">
                                🚚
                              </div>
                              <div>
                                <p className="text-xs font-bold">Envío por Agencia (Shalom)</p>
                                <p className="text-[11px] text-muted-foreground">
                                  Provincias con adelanto S/ 20-30
                                </p>
                              </div>
                            </button>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* PASO 3: MÉTODO DE CREACIÓN */}
                    <div className="rounded-2xl border border-border bg-surface-2 overflow-hidden shadow-xs">
                      <div
                        onClick={() => setOpenPaso3(!openPaso3)}
                        className="p-4 flex items-center justify-between cursor-pointer hover:bg-muted/30 transition select-none"
                      >
                        <div className="flex items-center gap-2">
                          <Sliders className="h-4 w-4 text-emerald-500" />
                          <span className="text-xs font-bold text-foreground uppercase tracking-wider">
                            Paso 3: Método de Creación del Flujo
                          </span>
                          {!openPaso3 && rvCreationMode && (
                            <span className="rounded-md bg-emerald-500/10 text-emerald-500 px-2 py-0.5 text-xs font-bold ml-2">
                              {rvCreationMode === "manual" ? "✍️ Opción Manual" : "✨ Generar con IAFlow"}
                            </span>
                          )}
                        </div>
                        <div className="text-muted-foreground">
                          {openPaso3 ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                        </div>
                      </div>

                      {openPaso3 && (
                        <div className="p-4 pt-0 border-t border-border/50 space-y-3 animate-in fade-in">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-xl pt-2">
                            <button
                              type="button"
                              onClick={() => setRvCreationMode("manual")}
                              className={`flex items-center gap-3 rounded-xl border p-3.5 text-left transition ${
                                rvCreationMode === "manual"
                                  ? "border-primary bg-primary/10 text-primary ring-1 ring-primary/30"
                                  : "border-border bg-surface text-foreground hover:bg-muted"
                              }`}
                            >
                              <div className="h-9 w-9 rounded-xl bg-primary/15 text-primary flex items-center justify-center">
                                <Sliders className="h-4 w-4" />
                              </div>
                              <div>
                                <p className="text-xs font-bold">Opción Manual</p>
                                <p className="text-[11px] text-muted-foreground">
                                  Tú configuras tiempos, cupón y redactas
                                </p>
                              </div>
                            </button>

                            <button
                              type="button"
                              onClick={() => {
                                setRvCreationMode("ia");
                                handleGenerateIaFlow();
                              }}
                              className={`flex items-center gap-3 rounded-xl border p-3.5 text-left transition relative overflow-hidden ${
                                rvCreationMode === "ia"
                                  ? "border-emerald-500 bg-emerald-500/15 text-emerald-500 ring-2 ring-emerald-500/40"
                                  : "border-emerald-500/40 bg-emerald-500/5 text-foreground hover:bg-emerald-500/10"
                              }`}
                            >
                              <div className="h-9 w-9 rounded-xl bg-emerald-500 text-white flex items-center justify-center shadow-sm">
                                <Wand2 className="h-4 w-4" />
                              </div>
                              <div>
                                <p className="text-xs font-bold text-emerald-500 flex items-center gap-1">
                                  Generar con IAFlow ✨
                                </p>
                                <p className="text-[11px] text-muted-foreground">
                                  IA redacta la secuencia optimizada
                                </p>
                              </div>
                            </button>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* LOADER IA */}
                    {rvGeneratingIa && (
                      <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-center space-y-2 animate-in fade-in">
                        <Wand2 className="h-6 w-6 text-emerald-500 animate-spin mx-auto" />
                        <p className="text-xs font-bold text-emerald-500">
                          IAFlow está redactando la secuencia persuasiva para {rvProduct} ({rvShippingType})...
                        </p>
                      </div>
                    )}

                    {/* MENSAJES MANUAL/IA */}
                    {(rvCreationMode === "manual" || (rvCreationMode === "ia" && !rvGeneratingIa)) && (
                      <div className="space-y-4 animate-in fade-in">
                        {/* ORIGEN DE CAPTACIÓN */}
                        <div className="rounded-2xl border border-border bg-surface-2 overflow-hidden shadow-xs">
                          <div
                            onClick={() => setOpenOrigen(!openOrigen)}
                            className="p-4 flex items-center justify-between cursor-pointer hover:bg-muted/30 transition select-none"
                          >
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-foreground uppercase tracking-wider">
                                Origen de Captación del Lead
                              </span>
                              {!openOrigen && (
                                <span className="rounded-md bg-emerald-500/10 text-emerald-500 px-2 py-0.5 text-xs font-bold ml-2 capitalize">
                                  {rvSourceChannel} · {rvMonitoredStage}
                                </span>
                              )}
                            </div>
                            <div className="text-muted-foreground">
                              {openOrigen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                            </div>
                          </div>

                          {openOrigen && (
                            <div className="p-4 pt-0 border-t border-border/50 space-y-3 animate-in fade-in">
                              <p className="text-[11px] text-muted-foreground mt-2">
                                Selecciona desde qué canal se capturará el lead:
                              </p>

                              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                                {[
                                  { id: "whatsapp" as const, label: "💬 WhatsApp", desc: "Chats directos y anuncios CTWA" },
                                  { id: "shopify" as const, label: "🛍️ Shopify", desc: "Pedidos entrantes de tu tienda web" },
                                  { id: "logistica" as const, label: "🚚 Logística", desc: "Guías en camino y agencias" },
                                ].map((ch) => {
                                  const isChSelected = rvSourceChannel === ch.id;
                                  return (
                                    <button
                                      key={ch.id}
                                      type="button"
                                      onClick={() => {
                                        setRvSourceChannel(ch.id);
                                        const firstStage = channelStages[ch.id][0]?.value;
                                        if (firstStage) setRvMonitoredStage(firstStage);
                                      }}
                                      className={`rounded-xl border p-3 text-left transition ${
                                        isChSelected
                                          ? "border-emerald-500 bg-emerald-500/10 text-emerald-500 ring-1 ring-emerald-500/30"
                                          : "border-border bg-surface text-foreground hover:bg-muted"
                                      }`}
                                    >
                                      <span className="block font-bold text-xs">{ch.label}</span>
                                      <span className="block text-[10px] text-muted-foreground mt-0.5">{ch.desc}</span>
                                    </button>
                                  );
                                })}
                              </div>

                              <div className="pt-2 border-t border-border/50">
                                <label className="block text-xs font-semibold text-muted-foreground mb-1.5">
                                  Etapa a monitorear:
                                </label>
                                <select
                                  value={rvMonitoredStage}
                                  onChange={(e) => setRvMonitoredStage(e.target.value)}
                                  className="w-full h-10 rounded-lg border border-border bg-surface px-3 text-xs font-bold text-foreground outline-none focus:border-primary"
                                >
                                  {channelStages[rvSourceChannel].map((stage) => (
                                    <option key={stage.value} value={stage.value}>
                                      {stage.label}
                                    </option>
                                  ))}
                                </select>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* RECORRIDO DE PASOS */}
                        <div className="space-y-4">
                          {currentRvSteps.map((step, idx) => (
                            <div
                              key={step.id}
                              className="rounded-2xl border border-border bg-surface p-4 space-y-3.5 shadow-xs"
                            >
                              <div className="flex items-center justify-between border-b border-border/50 pb-2.5">
                                <span className="text-xs font-bold text-foreground flex items-center gap-2">
                                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-white text-[10px]">
                                    {idx + 1}
                                  </span>
                                  Mensaje de Recuperación #{idx + 1}
                                </span>

                                <div className="flex items-center gap-2">
                                  <button
                                    type="button"
                                    onClick={() => openSim(step.copy)}
                                    className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-500 hover:underline"
                                  >
                                    <Smartphone className="h-3 w-3" /> Simular
                                  </button>
                                  {currentRvSteps.length > 1 && (
                                    <button
                                      type="button"
                                      onClick={() => handleRemoveStep(step.id)}
                                      className="text-muted-foreground hover:text-rose-500 p-1"
                                      title="Eliminar este mensaje"
                                    >
                                      <Trash2 className="h-3.5 w-3.5" />
                                    </button>
                                  )}
                                </div>
                              </div>

                              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                                <div className="rounded-xl border border-border bg-surface-2 p-2.5 space-y-1">
                                  <label className="block font-bold text-foreground">Enviar si permanece:</label>
                                  <div className="flex items-center gap-1.5">
                                    <input
                                      type="text"
                                      inputMode="numeric"
                                      value={step.waitValue}
                                      onChange={(e) =>
                                        handleStepWaitValueChange(step.id, e.target.value, step.waitUnit)
                                      }
                                      className="h-9 w-20 rounded-lg border border-border bg-surface text-center text-sm font-bold text-foreground outline-none focus:border-primary"
                                    />
                                    <select
                                      value={step.waitUnit}
                                      onChange={(e) =>
                                        handleStepWaitUnitChange(
                                          step.id,
                                          e.target.value as "segundos" | "minutos" | "horas"
                                        )
                                      }
                                      className="h-9 flex-1 rounded-lg border border-border bg-surface px-2 text-xs font-bold text-foreground outline-none focus:border-primary"
                                    >
                                      <option value="segundos">Segundos</option>
                                      <option value="minutos">Minutos</option>
                                      <option value="horas">Horas</option>
                                    </select>
                                  </div>
                                </div>

                                <div className="rounded-xl border border-border bg-surface-2 p-2.5 space-y-1">
                                  <label className="block font-bold text-foreground">Condición:</label>
                                  <select
                                    value={step.condition}
                                    onChange={(e) => {
                                      const val = e.target.value as any;
                                      setCurrentRvSteps((prev) =>
                                        prev.map((s) => (s.id === step.id ? { ...s, condition: val } : s))
                                      );
                                    }}
                                    className="w-full h-9 rounded-lg border border-border bg-surface px-2 text-xs font-semibold outline-none focus:border-primary"
                                  >
                                    <option value="visto">👀 Leyó mensaje (Doble check azul)</option>
                                    <option value="no_visto">⏳ No abrió el chat</option>
                                    <option value="cualquiera">Cualquiera sin responder</option>
                                  </select>
                                </div>

                                <div className="rounded-xl border border-border bg-surface-2 p-2.5 space-y-1">
                                  <label className="block font-bold text-foreground">Cupón opcional:</label>
                                  <input
                                    value={step.coupon}
                                    onChange={(e) => {
                                      const val = e.target.value;
                                      setCurrentRvSteps((prev) =>
                                        prev.map((s) => (s.id === step.id ? { ...s, coupon: val } : s))
                                      );
                                    }}
                                    className="w-full h-9 rounded-lg border border-border bg-surface px-2 text-xs font-bold text-emerald-500 outline-none focus:border-primary uppercase"
                                  />
                                </div>
                              </div>

                              <div>
                                <label className="block font-semibold text-muted-foreground text-xs mb-1">
                                  Mensaje de WhatsApp:
                                </label>
                                <textarea
                                  rows={3}
                                  value={step.copy}
                                  onChange={(e) => {
                                    const val = e.target.value;
                                    setCurrentRvSteps((prev) =>
                                      prev.map((s) => (s.id === step.id ? { ...s, copy: val } : s))
                                    );
                                  }}
                                  className="w-full rounded-xl border border-border bg-surface-2 p-3 text-xs text-foreground outline-none focus:border-primary leading-relaxed"
                                />
                              </div>

                              <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-border/50 text-xs">
                                <div className="flex items-center gap-1.5">
                                  <span className="text-muted-foreground font-semibold mr-1">
                                    Adjuntar multimedia:
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() => handleToggleAttachment(step.id, "imagen")}
                                    className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-semibold border transition ${
                                      step.attachment?.type === "imagen"
                                        ? "border-emerald-500 bg-emerald-500/15 text-emerald-500"
                                        : "border-border bg-surface-2 text-muted-foreground hover:bg-muted"
                                    }`}
                                  >
                                    <Image className="h-3.5 w-3.5" />
                                    Imagen
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleToggleAttachment(step.id, "video")}
                                    className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-semibold border transition ${
                                      step.attachment?.type === "video"
                                        ? "border-emerald-500 bg-emerald-500/15 text-emerald-500"
                                        : "border-border bg-surface-2 text-muted-foreground hover:bg-muted"
                                    }`}
                                  >
                                    <Video className="h-3.5 w-3.5" />
                                    Video
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleToggleAttachment(step.id, "audio")}
                                    className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-semibold border transition ${
                                      step.attachment?.type === "audio"
                                        ? "border-emerald-500 bg-emerald-500/15 text-emerald-500"
                                        : "border-border bg-surface-2 text-muted-foreground hover:bg-muted"
                                    }`}
                                  >
                                    <Mic className="h-3.5 w-3.5" />
                                    Audio
                                  </button>
                                </div>

                                {step.attachment && (
                                  <div className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 text-[11px] font-medium text-emerald-500">
                                    <span>📎 {step.attachment.name}</span>
                                    <button
                                      type="button"
                                      onClick={() => handleToggleAttachment(step.id, step.attachment!.type)}
                                      className="hover:text-rose-500"
                                    >
                                      <X className="h-3 w-3" />
                                    </button>
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>

                        <div className="pt-2 space-y-3">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <button
                              type="button"
                              onClick={handleAddAnotherStep}
                              className="inline-flex items-center justify-center gap-2 rounded-xl border border-dashed border-emerald-500/40 bg-emerald-500/5 px-4 py-2.5 text-xs font-bold text-emerald-500 hover:bg-emerald-500/10 transition shadow-xs"
                            >
                              <Plus className="h-4 w-4" />
                              Agregar otro flujo / recordatorio (#{currentRvSteps.length + 1})
                            </button>

                            <span className="text-xs text-muted-foreground">
                              {currentRvSteps.length} {currentRvSteps.length === 1 ? "mensaje configurado" : "mensajes en secuencia"}
                            </span>
                          </div>

                          <div className="pt-3 border-t border-border flex justify-end">
                            <button
                              type="button"
                              onClick={handleSaveAndActivate}
                              className="w-full sm:w-auto rounded-xl bg-emerald-600 px-6 py-3 text-xs font-bold text-white hover:bg-emerald-500 transition shadow-md flex items-center justify-center gap-2"
                            >
                              <Check className="h-4 w-4" />
                              {editingFlowId
                                ? "Actualizar Flujo de Rompevistos"
                                : `Guardar y Activar Flujo (${currentRvSteps.length} ${
                                    currentRvSteps.length === 1 ? "paso" : "pasos"
                                  })`}
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* ========================================================================= */}
            {/* 2. SECUENCIA INICIAL (CAMPANAS WHATSAPP ADS)                             */}
            {/* ========================================================================= */}
            {selectedTab === "secuencia_inicial" && (
              <div className="space-y-6">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-border pb-4">
                  <div>
                    <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                      <Zap className="h-5 w-5 text-emerald-500" />
                      Secuencia Inicial (Campañas de WhatsApp Ads)
                    </h2>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Cuando un cliente envía una palabra clave desde tu anuncio, responde automáticamente con texto, video/imagen y combos.
                    </p>
                  </div>

                  <button
                    onClick={() => openSim(initialResponseText)}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-3.5 py-2 text-xs font-bold text-white shadow-sm hover:bg-emerald-500 transition"
                  >
                    <Smartphone className="h-4 w-4" />
                    Simular en WhatsApp
                  </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="space-y-4 lg:col-span-2">
                    <div className="rounded-xl border border-border bg-surface-2 p-4 space-y-2">
                      <label className="block text-xs font-bold text-foreground uppercase tracking-wider">
                        Palabra Clave de Campaña (Trigger)
                      </label>
                      <input
                        value={initialKeyword}
                        onChange={(e) => setInitialKeyword(e.target.value)}
                        className="h-10 w-full rounded-lg border border-border bg-surface px-3 text-sm font-semibold text-foreground outline-none focus:border-primary uppercase"
                      />
                    </div>

                    <div className="rounded-xl border border-border bg-surface-2 p-4 space-y-2">
                      <label className="block text-xs font-bold text-foreground uppercase tracking-wider">
                        Mensaje de Respuesta
                      </label>
                      <textarea
                        rows={3}
                        value={initialResponseText}
                        onChange={(e) => setInitialResponseText(e.target.value)}
                        className="w-full rounded-lg border border-border bg-surface p-3 text-xs text-foreground outline-none focus:border-primary leading-relaxed"
                      />
                    </div>
                  </div>

                  <div className="rounded-2xl border border-border bg-surface-2 p-4 flex flex-col items-center justify-center">
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">
                      Vista Rápida
                    </p>
                    <div className="w-full max-w-[280px] rounded-2xl bg-[#0b141a] p-3 text-white text-xs space-y-2">
                      <div className="bg-[#005c4b] p-2 rounded-xl text-[11px] ml-auto max-w-[85%]">
                        {initialKeyword}
                      </div>
                      <div className="bg-[#202c33] p-2.5 rounded-xl text-[11px] mr-auto max-w-[90%]">
                        {initialResponseText}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ========================================================================= */}
            {/* 3. CONFIRMACIÓN Y LOGÍSTICA                                              */}
            {/* ========================================================================= */}
            {selectedTab === "confirmacion_logistica" && (
              <div className="space-y-6 animate-in fade-in">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-border pb-4">
                  <div>
                    <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                      <Truck className="h-5 w-5 text-emerald-500" />
                      Confirmación y Logística
                    </h2>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Configura plantillas oficiales para validar compras COD y notificar envíos y recojo en agencias Shalom.
                    </p>
                  </div>

                  <div className="flex items-center rounded-xl bg-surface-2 p-1 border border-border self-start sm:self-auto">
                    <button
                      onClick={() => setConfLogSubTab("confirmaciones")}
                      className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-bold transition ${
                        confLogSubTab === "confirmaciones"
                          ? "bg-primary text-primary-foreground shadow-sm"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      1. Confirmaciones
                    </button>
                    <button
                      onClick={() => setConfLogSubTab("logistica")}
                      className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-bold transition ${
                        confLogSubTab === "logistica"
                          ? "bg-primary text-primary-foreground shadow-sm"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      <Truck className="h-3.5 w-3.5" />
                      2. Logística
                    </button>
                  </div>
                </div>

                <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-4 flex items-start gap-3 text-xs">
                  <Sparkles className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <p className="font-bold text-foreground">
                      💡 Recomendación de WhatsApp Business API (Categoría Utilidad):
                    </p>
                    <p className="text-muted-foreground leading-relaxed">
                      Estos mensajes clasifican como plantillas de <strong>Utilidad</strong>. Puedes enviarlos automáticamente fuera de la ventana de 24 horas. Recuerda usar las variables dinámicas entre corchetes para que los datos del cliente se rellenen de forma exacta.
                    </p>
                  </div>
                </div>

                {confLogSubTab === "confirmaciones" && (
                  <div className="space-y-6">
                    {/* MENSAJE 1.1 */}
                    <div className="rounded-2xl border border-border bg-surface-2 p-5 space-y-4 shadow-xs">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border/60 pb-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-emerald-500/15 text-emerald-500 text-xs font-bold">
                              1.1
                            </span>
                            <h3 className="text-sm font-bold text-foreground">
                              Mensaje de Confirmación (Pedidos Regulares)
                            </h3>
                            {confMsgRegular.isLinked ? (
                              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 text-emerald-500 border border-emerald-500/20 px-2 py-0.5 text-[10px] font-bold">
                                🟢 Plantilla Activa
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 rounded-full bg-muted text-muted-foreground px-2 py-0.5 text-[10px] font-medium">
                                ⚪ Sin Configurar
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">
                            Se envía automáticamente a los clientes para reconfirmar su compra contraentrega o con pago anticipado.
                          </p>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => openSim(confMsgRegular.newTemplateText)}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-surface px-3 py-1.5 text-xs font-bold text-emerald-500 hover:bg-muted transition"
                          >
                            <Smartphone className="h-3.5 w-3.5" />
                            Simular
                          </button>

                          {confMsgRegular.isLinked && (
                            <button
                              type="button"
                              onClick={() => {
                                setConfMsgRegular((prev) => ({ ...prev, isLinked: false }));
                                showToast("Plantilla de confirmación desvinculada");
                              }}
                              className="inline-flex items-center gap-1 rounded-lg border border-border bg-surface p-1.5 text-xs text-muted-foreground hover:text-rose-500 hover:bg-rose-500/10 transition"
                              title="Eliminar / Desvincular plantilla"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setConfMsgRegular((prev) => ({ ...prev, mode: "nueva" }))}
                          className={`inline-flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-bold transition ${
                            confMsgRegular.mode === "nueva"
                              ? "bg-emerald-600 text-white shadow-xs"
                              : "border border-border bg-surface text-muted-foreground hover:text-foreground"
                          }`}
                        >
                          <Plus className="h-3.5 w-3.5" />
                          Crear Nueva Plantilla
                        </button>
                        <button
                          type="button"
                          onClick={() => setConfMsgRegular((prev) => ({ ...prev, mode: "existente" }))}
                          className={`inline-flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-bold transition ${
                            confMsgRegular.mode === "existente"
                              ? "bg-emerald-600 text-white shadow-xs"
                              : "border border-border bg-surface text-muted-foreground hover:text-foreground"
                          }`}
                        >
                          <FileText className="h-3.5 w-3.5" />
                          Ya tengo mi plantilla
                        </button>
                      </div>

                      {confMsgRegular.mode === "nueva" ? (
                        <div className="rounded-xl border border-border bg-surface p-4 space-y-3">
                          <label className="block text-xs font-bold text-foreground uppercase tracking-wider">
                            Plantilla Predeterminada de Confirmación:
                          </label>

                          <textarea
                            rows={6}
                            value={confMsgRegular.newTemplateText}
                            onChange={(e) =>
                              setConfMsgRegular((prev) => ({ ...prev, newTemplateText: e.target.value }))
                            }
                            className="w-full rounded-xl border border-border bg-surface-2 p-3 text-xs text-foreground outline-none focus:border-primary font-mono leading-relaxed"
                          />

                          <div className="space-y-1.5">
                            <span className="text-[11px] font-semibold text-muted-foreground block">
                              Insertar variables disponibles:
                            </span>
                            <div className="flex flex-wrap items-center gap-1.5">
                              {["Nombre", "Productos", "Agencia", "Guía", "Monto", "DNI", "Dirección"].map(
                                (v) => (
                                  <button
                                    key={v}
                                    type="button"
                                    onClick={() =>
                                      insertVariableIntoText(
                                        confMsgRegular.newTemplateText,
                                        v,
                                        (val) => setConfMsgRegular((prev) => ({ ...prev, newTemplateText: val }))
                                      )
                                    }
                                    className="rounded-lg border border-border bg-surface-2 px-2.5 py-1 text-[11px] font-semibold text-foreground hover:border-emerald-500 hover:text-emerald-500 transition"
                                  >
                                    + [{v}]
                                  </button>
                                )
                              )}
                            </div>
                          </div>

                          <div className="pt-2 flex justify-end">
                            <button
                              type="button"
                              onClick={() => {
                                setConfMsgRegular((prev) => ({
                                  ...prev,
                                  isLinked: true,
                                  updatedAt: "Guardado ahora",
                                }));
                                showToast("¡Plantilla de confirmación guardada y activada en WhatsApp!");
                              }}
                              className="rounded-xl bg-emerald-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-emerald-500 transition shadow-sm inline-flex items-center gap-2"
                            >
                              <Send className="h-3.5 w-3.5" />
                              Guardar y Enviar a WhatsApp
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="rounded-xl border border-border bg-surface p-4 space-y-3">
                          <label className="block text-xs font-bold text-foreground uppercase tracking-wider">
                            Seleccionar Plantilla Registrada de Meta:
                          </label>

                          <select
                            value={confMsgRegular.selectedTemplateId}
                            onChange={(e) =>
                              setConfMsgRegular((prev) => ({ ...prev, selectedTemplateId: e.target.value }))
                            }
                            className="w-full h-10 rounded-lg border border-border bg-surface-2 px-3 text-xs font-bold text-foreground outline-none focus:border-primary"
                          >
                            {mockTemplates
                              .filter((t) => t.category === "Utilidad" || t.status === "Aprobada")
                              .map((t) => (
                                <option key={t.id} value={t.id}>
                                  {t.name} — {t.status} (Enviados: {t.sent})
                                </option>
                              ))}
                          </select>

                          {(() => {
                            const found = mockTemplates.find(
                              (t) => t.id === confMsgRegular.selectedTemplateId
                            );
                            if (!found) return null;
                            return (
                              <div className="rounded-xl border border-border/80 bg-surface-2 p-3 text-xs space-y-1.5">
                                <div className="flex items-center justify-between">
                                  <span className="font-bold text-foreground font-mono">{found.name}</span>
                                  <span className="rounded bg-emerald-500/10 text-emerald-500 px-2 py-0.5 text-[10px] font-bold">
                                    {found.status} ✅
                                  </span>
                                </div>
                                <p className="text-muted-foreground text-[11px] leading-relaxed">
                                  {found.body}
                                </p>
                              </div>
                            );
                          })()}

                          <div className="pt-2 flex justify-end">
                            <button
                              type="button"
                              onClick={() => {
                                setConfMsgRegular((prev) => ({
                                  ...prev,
                                  isLinked: true,
                                  updatedAt: "Vinculada ahora",
                                }));
                                showToast("¡Plantilla existente vinculada exitosamente!");
                              }}
                              className="rounded-xl bg-primary px-5 py-2.5 text-xs font-bold text-primary-foreground hover:opacity-90 transition shadow-sm inline-flex items-center gap-2"
                            >
                              <Link2 className="h-3.5 w-3.5" />
                              Vincular Plantilla Existente
                            </button>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* MENSAJE 1.2 */}
                    <div className="rounded-2xl border border-border bg-surface-2 p-5 space-y-4 shadow-xs">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border/60 pb-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-emerald-500/15 text-emerald-500 text-xs font-bold">
                              1.2
                            </span>
                            <h3 className="text-sm font-bold text-foreground">
                              Mensaje para Pedidos Preliminares (Carritos y Draft Orders)
                            </h3>
                            {confMsgPreliminar.isLinked ? (
                              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 text-emerald-500 border border-emerald-500/20 px-2 py-0.5 text-[10px] font-bold">
                                🟢 Plantilla Activa
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 rounded-full bg-muted text-muted-foreground px-2 py-0.5 text-[10px] font-medium">
                                ⚪ Sin Configurar
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">
                            Se envía automáticamente a prospectos que iniciaron el checkout o un pedido borrador pero no llegaron a completarlo.
                          </p>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => openSim(confMsgPreliminar.newTemplateText)}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-surface px-3 py-1.5 text-xs font-bold text-emerald-500 hover:bg-muted transition"
                          >
                            <Smartphone className="h-3.5 w-3.5" />
                            Simular
                          </button>

                          {confMsgPreliminar.isLinked && (
                            <button
                              type="button"
                              onClick={() => {
                                setConfMsgPreliminar((prev) => ({ ...prev, isLinked: false }));
                                showToast("Plantilla para preliminares desvinculada");
                              }}
                              className="inline-flex items-center gap-1 rounded-lg border border-border bg-surface p-1.5 text-xs text-muted-foreground hover:text-rose-500 hover:bg-rose-500/10 transition"
                              title="Eliminar / Desvincular plantilla"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setConfMsgPreliminar((prev) => ({ ...prev, mode: "nueva" }))}
                          className={`inline-flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-bold transition ${
                            confMsgPreliminar.mode === "nueva"
                              ? "bg-emerald-600 text-white shadow-xs"
                              : "border border-border bg-surface text-muted-foreground hover:text-foreground"
                          }`}
                        >
                          <Plus className="h-3.5 w-3.5" />
                          Crear Nueva Plantilla
                        </button>
                        <button
                          type="button"
                          onClick={() => setConfMsgPreliminar((prev) => ({ ...prev, mode: "existente" }))}
                          className={`inline-flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-bold transition ${
                            confMsgPreliminar.mode === "existente"
                              ? "bg-emerald-600 text-white shadow-xs"
                              : "border border-border bg-surface text-muted-foreground hover:text-foreground"
                          }`}
                        >
                          <FileText className="h-3.5 w-3.5" />
                          Ya tengo mi plantilla
                        </button>
                      </div>

                      {confMsgPreliminar.mode === "nueva" ? (
                        <div className="rounded-xl border border-border bg-surface p-4 space-y-3">
                          <label className="block text-xs font-bold text-foreground uppercase tracking-wider">
                            Plantilla Predeterminada para Pedidos Preliminares:
                          </label>

                          <textarea
                            rows={5}
                            value={confMsgPreliminar.newTemplateText}
                            onChange={(e) =>
                              setConfMsgPreliminar((prev) => ({ ...prev, newTemplateText: e.target.value }))
                            }
                            className="w-full rounded-xl border border-border bg-surface-2 p-3 text-xs text-foreground outline-none focus:border-primary font-mono leading-relaxed"
                          />

                          <div className="space-y-1.5">
                            <span className="text-[11px] font-semibold text-muted-foreground block">
                              Insertar variables disponibles:
                            </span>
                            <div className="flex flex-wrap items-center gap-1.5">
                              {["Nombre", "Productos", "Monto", "Cupón", "Dirección"].map((v) => (
                                <button
                                  key={v}
                                  type="button"
                                  onClick={() =>
                                    insertVariableIntoText(
                                      confMsgPreliminar.newTemplateText,
                                      v,
                                      (val) => setConfMsgPreliminar((prev) => ({ ...prev, newTemplateText: val }))
                                    )
                                  }
                                  className="rounded-lg border border-border bg-surface-2 px-2.5 py-1 text-[11px] font-semibold text-foreground hover:border-emerald-500 hover:text-emerald-500 transition"
                                >
                                  + [{v}]
                                </button>
                              ))}
                            </div>
                          </div>

                          <div className="pt-2 flex justify-end">
                            <button
                              type="button"
                              onClick={() => {
                                setConfMsgPreliminar((prev) => ({
                                  ...prev,
                                  isLinked: true,
                                  updatedAt: "Guardado ahora",
                                }));
                                showToast("¡Plantilla preliminar guardada y activada en WhatsApp!");
                              }}
                              className="rounded-xl bg-emerald-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-emerald-500 transition shadow-sm inline-flex items-center gap-2"
                            >
                              <Send className="h-3.5 w-3.5" />
                              Guardar y Enviar a WhatsApp
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="rounded-xl border border-border bg-surface p-4 space-y-3">
                          <label className="block text-xs font-bold text-foreground uppercase tracking-wider">
                            Seleccionar Plantilla Registrada de Meta:
                          </label>

                          <select
                            value={confMsgPreliminar.selectedTemplateId}
                            onChange={(e) =>
                              setConfMsgPreliminar((prev) => ({ ...prev, selectedTemplateId: e.target.value }))
                            }
                            className="w-full h-10 rounded-lg border border-border bg-surface-2 px-3 text-xs font-bold text-foreground outline-none focus:border-primary"
                          >
                            {mockTemplates.map((t) => (
                              <option key={t.id} value={t.id}>
                                {t.name} — {t.status}
                              </option>
                            ))}
                          </select>

                          {(() => {
                            const found = mockTemplates.find(
                              (t) => t.id === confMsgPreliminar.selectedTemplateId
                            );
                            if (!found) return null;
                            return (
                              <div className="rounded-xl border border-border/80 bg-surface-2 p-3 text-xs space-y-1.5">
                                <div className="flex items-center justify-between">
                                  <span className="font-bold text-foreground font-mono">{found.name}</span>
                                  <span className="rounded bg-emerald-500/10 text-emerald-500 px-2 py-0.5 text-[10px] font-bold">
                                    {found.status} ✅
                                  </span>
                                </div>
                                <p className="text-muted-foreground text-[11px] leading-relaxed">
                                  {found.body}
                                </p>
                              </div>
                            );
                          })()}

                          <div className="pt-2 flex justify-end">
                            <button
                              type="button"
                              onClick={() => {
                                setConfMsgPreliminar((prev) => ({
                                  ...prev,
                                  isLinked: true,
                                  updatedAt: "Vinculada ahora",
                                }));
                                showToast("¡Plantilla preliminar vinculada exitosamente!");
                              }}
                              className="rounded-xl bg-primary px-5 py-2.5 text-xs font-bold text-primary-foreground hover:opacity-90 transition shadow-sm inline-flex items-center gap-2"
                            >
                              <Link2 className="h-3.5 w-3.5" />
                              Vincular Plantilla Existente
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {confLogSubTab === "logistica" && (
                  <div className="space-y-6">
                    {/* MENSAJE 2.1 */}
                    <div className="rounded-2xl border border-border bg-surface-2 p-5 space-y-4 shadow-xs">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border/60 pb-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-sky-500/15 text-sky-500 text-xs font-bold">
                              2.1
                            </span>
                            <h3 className="text-sm font-bold text-foreground">
                              Pedido Enviado por Agencia (Despacho y Guía)
                            </h3>
                            {logMsgEnviado.isLinked ? (
                              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 text-emerald-500 border border-emerald-500/20 px-2 py-0.5 text-[10px] font-bold">
                                🟢 Plantilla Activa
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 rounded-full bg-muted text-muted-foreground px-2 py-0.5 text-[10px] font-medium">
                                ⚪ Sin Configurar
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">
                            Aviso automático con el número de guía Shalom/Olva y el saldo pendiente para que el cliente haga seguimiento.
                          </p>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => openSim(logMsgEnviado.newTemplateText)}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-surface px-3 py-1.5 text-xs font-bold text-sky-500 hover:bg-muted transition"
                          >
                            <Smartphone className="h-3.5 w-3.5" />
                            Simular
                          </button>

                          {logMsgEnviado.isLinked && (
                            <button
                              type="button"
                              onClick={() => {
                                setLogMsgEnviado((prev) => ({ ...prev, isLinked: false }));
                                showToast("Plantilla de despacho desvinculada");
                              }}
                              className="inline-flex items-center gap-1 rounded-lg border border-border bg-surface p-1.5 text-xs text-muted-foreground hover:text-rose-500 hover:bg-rose-500/10 transition"
                              title="Eliminar / Desvincular plantilla"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setLogMsgEnviado((prev) => ({ ...prev, mode: "nueva" }))}
                          className={`inline-flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-bold transition ${
                            logMsgEnviado.mode === "nueva"
                              ? "bg-sky-600 text-white shadow-xs"
                              : "border border-border bg-surface text-muted-foreground hover:text-foreground"
                          }`}
                        >
                          <Plus className="h-3.5 w-3.5" />
                          Crear Nueva Plantilla
                        </button>
                        <button
                          type="button"
                          onClick={() => setLogMsgEnviado((prev) => ({ ...prev, mode: "existente" }))}
                          className={`inline-flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-bold transition ${
                            logMsgEnviado.mode === "existente"
                              ? "bg-sky-600 text-white shadow-xs"
                              : "border border-border bg-surface text-muted-foreground hover:text-foreground"
                          }`}
                        >
                          <FileText className="h-3.5 w-3.5" />
                          Ya tengo mi plantilla
                        </button>
                      </div>

                      {logMsgEnviado.mode === "nueva" ? (
                        <div className="rounded-xl border border-border bg-surface p-4 space-y-3">
                          <label className="block text-xs font-bold text-foreground uppercase tracking-wider">
                            Plantilla Predeterminada de Pedido Enviado por Agencia:
                          </label>

                          <textarea
                            rows={5}
                            value={logMsgEnviado.newTemplateText}
                            onChange={(e) =>
                              setLogMsgEnviado((prev) => ({ ...prev, newTemplateText: e.target.value }))
                            }
                            className="w-full rounded-xl border border-border bg-surface-2 p-3 text-xs text-foreground outline-none focus:border-primary font-mono leading-relaxed"
                          />

                          <div className="space-y-1.5">
                            <span className="text-[11px] font-semibold text-muted-foreground block">
                              Insertar variables disponibles:
                            </span>
                            <div className="flex flex-wrap items-center gap-1.5">
                              {["Nombre", "Productos", "Agencia", "Guía", "Monto", "Ciudad"].map((v) => (
                                <button
                                  key={v}
                                  type="button"
                                  onClick={() =>
                                    insertVariableIntoText(
                                      logMsgEnviado.newTemplateText,
                                      v,
                                      (val) => setLogMsgEnviado((prev) => ({ ...prev, newTemplateText: val }))
                                    )
                                  }
                                  className="rounded-lg border border-border bg-surface-2 px-2.5 py-1 text-[11px] font-semibold text-foreground hover:border-sky-500 hover:text-sky-500 transition"
                                >
                                  + [{v}]
                                </button>
                              ))}
                            </div>
                          </div>

                          <div className="pt-2 flex justify-end">
                            <button
                              type="button"
                              onClick={() => {
                                setLogMsgEnviado((prev) => ({
                                  ...prev,
                                  isLinked: true,
                                  updatedAt: "Guardado ahora",
                                }));
                                showToast("¡Plantilla de despacho guardada y activada en WhatsApp!");
                              }}
                              className="rounded-xl bg-sky-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-sky-500 transition shadow-sm inline-flex items-center gap-2"
                            >
                              <Send className="h-3.5 w-3.5" />
                              Guardar y Enviar a WhatsApp
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="rounded-xl border border-border bg-surface p-4 space-y-3">
                          <label className="block text-xs font-bold text-foreground uppercase tracking-wider">
                            Seleccionar Plantilla Registrada de Meta:
                          </label>

                          <select
                            value={logMsgEnviado.selectedTemplateId}
                            onChange={(e) =>
                              setLogMsgEnviado((prev) => ({ ...prev, selectedTemplateId: e.target.value }))
                            }
                            className="w-full h-10 rounded-lg border border-border bg-surface-2 px-3 text-xs font-bold text-foreground outline-none focus:border-primary"
                          >
                            {mockTemplates.map((t) => (
                              <option key={t.id} value={t.id}>
                                {t.name} — {t.status}
                              </option>
                            ))}
                          </select>

                          {(() => {
                            const found = mockTemplates.find((t) => t.id === logMsgEnviado.selectedTemplateId);
                            if (!found) return null;
                            return (
                              <div className="rounded-xl border border-border/80 bg-surface-2 p-3 text-xs space-y-1.5">
                                <div className="flex items-center justify-between">
                                  <span className="font-bold text-foreground font-mono">{found.name}</span>
                                  <span className="rounded bg-emerald-500/10 text-emerald-500 px-2 py-0.5 text-[10px] font-bold">
                                    {found.status} ✅
                                  </span>
                                </div>
                                <p className="text-muted-foreground text-[11px] leading-relaxed">{found.body}</p>
                              </div>
                            );
                          })()}

                          <div className="pt-2 flex justify-end">
                            <button
                              type="button"
                              onClick={() => {
                                setLogMsgEnviado((prev) => ({
                                  ...prev,
                                  isLinked: true,
                                  updatedAt: "Vinculada ahora",
                                }));
                                showToast("¡Plantilla de despacho vinculada exitosamente!");
                              }}
                              className="rounded-xl bg-primary px-5 py-2.5 text-xs font-bold text-primary-foreground hover:opacity-90 transition shadow-sm inline-flex items-center gap-2"
                            >
                              <Link2 className="h-3.5 w-3.5" />
                              Vincular Plantilla Existente
                            </button>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* MENSAJE 2.2 */}
                    <div className="rounded-2xl border border-border bg-surface-2 p-5 space-y-4 shadow-xs">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border/60 pb-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-sky-500/15 text-sky-500 text-xs font-bold">
                              2.2
                            </span>
                            <h3 className="text-sm font-bold text-foreground">
                              El Pedido Llegó (Aviso de Retiro con DNI Físico)
                            </h3>
                            {logMsgLlego.isLinked ? (
                              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 text-emerald-500 border border-emerald-500/20 px-2 py-0.5 text-[10px] font-bold">
                                🟢 Plantilla Activa
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 rounded-full bg-muted text-muted-foreground px-2 py-0.5 text-[10px] font-medium">
                                ⚪ Sin Configurar
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">
                            Notificación crítica cuando Shalom o la agencia reporta el paquete listo en ventanilla para evitar devoluciones.
                          </p>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => openSim(logMsgLlego.newTemplateText)}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-surface px-3 py-1.5 text-xs font-bold text-sky-500 hover:bg-muted transition"
                          >
                            <Smartphone className="h-3.5 w-3.5" />
                            Simular
                          </button>

                          {logMsgLlego.isLinked && (
                            <button
                              type="button"
                              onClick={() => {
                                setLogMsgLlego((prev) => ({ ...prev, isLinked: false }));
                                showToast("Plantilla de aviso de llegada desvinculada");
                              }}
                              className="inline-flex items-center gap-1 rounded-lg border border-border bg-surface p-1.5 text-xs text-muted-foreground hover:text-rose-500 hover:bg-rose-500/10 transition"
                              title="Eliminar / Desvincular plantilla"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setLogMsgLlego((prev) => ({ ...prev, mode: "nueva" }))}
                          className={`inline-flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-bold transition ${
                            logMsgLlego.mode === "nueva"
                              ? "bg-sky-600 text-white shadow-xs"
                              : "border border-border bg-surface text-muted-foreground hover:text-foreground"
                          }`}
                        >
                          <Plus className="h-3.5 w-3.5" />
                          Crear Nueva Plantilla
                        </button>
                        <button
                          type="button"
                          onClick={() => setLogMsgLlego((prev) => ({ ...prev, mode: "existente" }))}
                          className={`inline-flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-bold transition ${
                            logMsgLlego.mode === "existente"
                              ? "bg-sky-600 text-white shadow-xs"
                              : "border border-border bg-surface text-muted-foreground hover:text-foreground"
                          }`}
                        >
                          <FileText className="h-3.5 w-3.5" />
                          Ya tengo mi plantilla
                        </button>
                      </div>

                      {logMsgLlego.mode === "nueva" ? (
                        <div className="rounded-xl border border-border bg-surface p-4 space-y-3">
                          <label className="block text-xs font-bold text-foreground uppercase tracking-wider">
                            Plantilla Predeterminada de Aviso de Llegada a Agencia:
                          </label>

                          <textarea
                            rows={5}
                            value={logMsgLlego.newTemplateText}
                            onChange={(e) =>
                              setLogMsgLlego((prev) => ({ ...prev, newTemplateText: e.target.value }))
                            }
                            className="w-full rounded-xl border border-border bg-surface-2 p-3 text-xs text-foreground outline-none focus:border-primary font-mono leading-relaxed"
                          />

                          <div className="space-y-1.5">
                            <span className="text-[11px] font-semibold text-muted-foreground block">
                              Insertar variables disponibles:
                            </span>
                            <div className="flex flex-wrap items-center gap-1.5">
                              {["Nombre", "Agencia", "Ciudad", "Guía", "DNI", "Productos"].map((v) => (
                                <button
                                  key={v}
                                  type="button"
                                  onClick={() =>
                                    insertVariableIntoText(
                                      logMsgLlego.newTemplateText,
                                      v,
                                      (val) => setLogMsgLlego((prev) => ({ ...prev, newTemplateText: val }))
                                    )
                                  }
                                  className="rounded-lg border border-border bg-surface-2 px-2.5 py-1 text-[11px] font-semibold text-foreground hover:border-sky-500 hover:text-sky-500 transition"
                                >
                                  + [{v}]
                                </button>
                              ))}
                            </div>
                          </div>

                          <div className="pt-2 flex justify-end">
                            <button
                              type="button"
                              onClick={() => {
                                setLogMsgLlego((prev) => ({
                                  ...prev,
                                  isLinked: true,
                                  updatedAt: "Guardado ahora",
                                }));
                                showToast("¡Plantilla de llegada guardada y activada en WhatsApp!");
                              }}
                              className="rounded-xl bg-sky-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-sky-500 transition shadow-sm inline-flex items-center gap-2"
                            >
                              <Send className="h-3.5 w-3.5" />
                              Guardar y Enviar a WhatsApp
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="rounded-xl border border-border bg-surface p-4 space-y-3">
                          <label className="block text-xs font-bold text-foreground uppercase tracking-wider">
                            Seleccionar Plantilla Registrada de Meta:
                          </label>

                          <select
                            value={logMsgLlego.selectedTemplateId}
                            onChange={(e) =>
                              setLogMsgLlego((prev) => ({ ...prev, selectedTemplateId: e.target.value }))
                            }
                            className="w-full h-10 rounded-lg border border-border bg-surface-2 px-3 text-xs font-bold text-foreground outline-none focus:border-primary"
                          >
                            {mockTemplates.map((t) => (
                              <option key={t.id} value={t.id}>
                                {t.name} — {t.status}
                              </option>
                            ))}
                          </select>

                          {(() => {
                            const found = mockTemplates.find((t) => t.id === logMsgLlego.selectedTemplateId);
                            if (!found) return null;
                            return (
                              <div className="rounded-xl border border-border/80 bg-surface-2 p-3 text-xs space-y-1.5">
                                <div className="flex items-center justify-between">
                                  <span className="font-bold text-foreground font-mono">{found.name}</span>
                                  <span className="rounded bg-emerald-500/10 text-emerald-500 px-2 py-0.5 text-[10px] font-bold">
                                    {found.status} ✅
                                  </span>
                                </div>
                                <p className="text-muted-foreground text-[11px] leading-relaxed">{found.body}</p>
                              </div>
                            );
                          })()}

                          <div className="pt-2 flex justify-end">
                            <button
                              type="button"
                              onClick={() => {
                                setLogMsgLlego((prev) => ({
                                  ...prev,
                                  isLinked: true,
                                  updatedAt: "Vinculada ahora",
                                }));
                                showToast("¡Plantilla de llegada vinculada exitosamente!");
                              }}
                              className="rounded-xl bg-primary px-5 py-2.5 text-xs font-bold text-primary-foreground hover:opacity-90 transition shadow-sm inline-flex items-center gap-2"
                            >
                              <Link2 className="h-3.5 w-3.5" />
                              Vincular Plantilla Existente
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ========================================================================= */}
            {/* 4. UPSELLS (VENTA CRUZADA) - CON BOTÓN CREAR UPSELL PRIMERO               */}
            {/* ========================================================================= */}
            {selectedTab === "upsells" && (
              <div className="space-y-6 animate-in fade-in">
                {/* CABECERA CON BOTÓN "CREAR UPSELL" PRIMERO Y DESTACADO */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-4">
                  <div>
                    <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-emerald-500" />
                      Upsells (Venta Cruzada y Aumento de Ticket)
                    </h2>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Ofrece promociones en los momentos de mayor interés del cliente (post-confirmación o post-entrega).
                    </p>
                  </div>

                  <div className="flex items-center gap-2 self-start sm:self-auto">
                    {/* BOTÓN CREAR UPSELL DESTACADO */}
                    <button
                      type="button"
                      onClick={() => {
                        setEditingUpsellId(null);
                        setIsCreatingUpsell(true);
                      }}
                      className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-emerald-500 transition shadow-sm"
                    >
                      <Plus className="h-4 w-4" />
                      CREAR UPSELL
                    </button>

                    <button
                      type="button"
                      onClick={() => setActiveTutorial("upsells")}
                      className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-500/15 px-3 py-2 text-xs font-bold text-emerald-500 hover:bg-emerald-500 hover:text-white transition"
                    >
                      <Play className="h-3 w-3 fill-current" />
                      Ver Tutorial
                    </button>
                  </div>
                </div>

                {/* FORMULARIO CREADOR / EDITOR DE UPSELL */}
                {isCreatingUpsell ? (
                  <div className="rounded-2xl border-2 border-emerald-500/40 bg-surface p-5 sm:p-6 space-y-5 shadow-md animate-in fade-in">
                    <div className="flex items-center justify-between border-b border-border pb-3">
                      <div className="flex items-center gap-2.5">
                        <div className="h-9 w-9 rounded-xl bg-emerald-500 text-white flex items-center justify-center font-bold">
                          <TrendingUp className="h-5 w-5" />
                        </div>
                        <div>
                          <h3 className="text-sm font-bold text-foreground">
                            {editingUpsellId ? "Modificar Configuración de Upsell" : "Configurar Nuevo Upsell Automático"}
                          </h3>
                          <p className="text-[11px] text-muted-foreground">
                            Define el momento de disparo, la oferta, el mensaje y si estará prendido o apagado.
                          </p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          setIsCreatingUpsell(false);
                          setEditingUpsellId(null);
                        }}
                        className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>

                    {/* 1. SE DISPARA CUANDO */}
                    <div className="space-y-2">
                      <label className="block text-xs font-bold text-foreground uppercase tracking-wider">
                        1. Se dispara cuando:
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <button
                          type="button"
                          onClick={() => setUpTrigger("post_confirmacion")}
                          className={`flex items-start gap-3 rounded-xl border p-3.5 text-left transition ${
                            upTrigger === "post_confirmacion"
                              ? "border-emerald-500 bg-emerald-500/10 text-emerald-500 ring-1 ring-emerald-500/30"
                              : "border-border bg-surface-2 text-foreground hover:bg-muted"
                          }`}
                        >
                          <Zap className="h-5 w-5 shrink-0 mt-0.5" />
                          <div>
                            <p className="text-xs font-bold">Post-confirmación</p>
                            <p className="text-[11px] text-muted-foreground mt-0.5 leading-relaxed">
                              Se envía 1 minuto después de que el cliente confirmó su pedido contraentrega (se añade al mismo paquete).
                            </p>
                          </div>
                        </button>

                        <button
                          type="button"
                          onClick={() => setUpTrigger("post_entrega")}
                          className={`flex items-start gap-3 rounded-xl border p-3.5 text-left transition ${
                            upTrigger === "post_entrega"
                              ? "border-emerald-500 bg-emerald-500/10 text-emerald-500 ring-1 ring-emerald-500/30"
                              : "border-border bg-surface-2 text-foreground hover:bg-muted"
                          }`}
                        >
                          <Truck className="h-5 w-5 shrink-0 mt-0.5" />
                          <div>
                            <p className="text-xs font-bold">Post-entrega</p>
                            <p className="text-[11px] text-muted-foreground mt-0.5 leading-relaxed">
                              Se envía 3 minutos después de que la agencia o repartidor marca "Entregado" para incentivar una segunda compra.
                            </p>
                          </div>
                        </button>
                      </div>
                    </div>

                    {/* 2. OFRECER */}
                    <div className="space-y-2">
                      <label className="block text-xs font-bold text-foreground uppercase tracking-wider">
                        2. Ofrecer:
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <button
                          type="button"
                          onClick={() => setUpOfferType("catalogo_pdf")}
                          className={`flex items-start gap-3 rounded-xl border p-3.5 text-left transition ${
                            upOfferType === "catalogo_pdf"
                              ? "border-emerald-500 bg-emerald-500/10 text-emerald-500 ring-1 ring-emerald-500/30"
                              : "border-border bg-surface-2 text-foreground hover:bg-muted"
                          }`}
                        >
                          <FileText className="h-5 w-5 shrink-0 mt-0.5" />
                          <div>
                            <p className="text-xs font-bold">Todo el catálogo (PDF)</p>
                            <p className="text-[11px] text-muted-foreground mt-0.5 leading-relaxed">
                              Envía un archivo PDF interactivo con todos los productos y promociones del mes.
                            </p>
                          </div>
                        </button>

                        <button
                          type="button"
                          onClick={() => setUpOfferType("productos_especificos")}
                          className={`flex items-start gap-3 rounded-xl border p-3.5 text-left transition ${
                            upOfferType === "productos_especificos"
                              ? "border-emerald-500 bg-emerald-500/10 text-emerald-500 ring-1 ring-emerald-500/30"
                              : "border-border bg-surface-2 text-foreground hover:bg-muted"
                          }`}
                        >
                          <ShoppingBag className="h-5 w-5 shrink-0 mt-0.5" />
                          <div>
                            <p className="text-xs font-bold">Productos específicos</p>
                            <p className="text-[11px] text-muted-foreground mt-0.5 leading-relaxed">
                              Selecciona un producto complementario de tu inventario a precio con descuento especial.
                            </p>
                          </div>
                        </button>
                      </div>

                      {/* Selector si es producto específico */}
                      {upOfferType === "productos_especificos" && (
                        <div className="pt-2">
                          <label className="block text-[11px] font-bold text-muted-foreground mb-1">
                            Seleccionar producto para la oferta especial:
                          </label>
                          <select
                            value={upProduct}
                            onChange={(e) => setUpProduct(e.target.value)}
                            className="w-full h-10 rounded-xl border border-border bg-surface-2 px-3 text-xs font-bold text-foreground outline-none focus:border-primary"
                          >
                            {extendedCatalogList.map((p) => (
                              <option key={p} value={p}>
                                {p}
                              </option>
                            ))}
                          </select>
                        </div>
                      )}
                    </div>

                    {/* 3. VENTANA PARA ESCRIBIR EL MENSAJE */}
                    <div className="space-y-2">
                      <label className="block text-xs font-bold text-foreground uppercase tracking-wider">
                        3. Mensaje de WhatsApp (Copy de Venta):
                      </label>
                      <textarea
                        rows={4}
                        value={upCopy}
                        onChange={(e) => setUpCopy(e.target.value)}
                        placeholder="Escribe el mensaje persuasivo del Upsell..."
                        className="w-full rounded-xl border border-border bg-surface-2 p-3 text-xs text-foreground outline-none focus:border-primary leading-relaxed"
                      />

                      {/* Chips de variables */}
                      <div className="flex flex-wrap items-center gap-1.5 pt-1">
                        <span className="text-[11px] font-semibold text-muted-foreground mr-1">
                          Variables:
                        </span>
                        {["Nombre", "Producto", "Monto", "Cupón", "Enlace"].map((v) => (
                          <button
                            key={v}
                            type="button"
                            onClick={() =>
                              insertVariableIntoText(upCopy, v, (val) => setUpCopy(val))
                            }
                            className="rounded-lg border border-border bg-surface-2 px-2 py-0.5 text-[11px] font-semibold text-foreground hover:border-emerald-500 hover:text-emerald-500 transition"
                          >
                            + [{v}]
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* 4. ABAJO AGREGAR IMAGEN, VIDEO O VOZ */}
                    <div className="space-y-2 pt-2 border-t border-border">
                      <label className="block text-xs font-bold text-foreground uppercase tracking-wider">
                        4. Adjuntar Contenido Multimedia:
                      </label>
                      <div className="flex flex-wrap items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleToggleUpsellAttachment("imagen")}
                          className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-semibold transition ${
                            upAttachment?.type === "imagen"
                              ? "border-emerald-500 bg-emerald-500/15 text-emerald-500"
                              : "border-border bg-surface-2 text-muted-foreground hover:bg-muted"
                          }`}
                        >
                          <Image className="h-4 w-4" />
                          Imagen
                        </button>
                        <button
                          type="button"
                          onClick={() => handleToggleUpsellAttachment("video")}
                          className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-semibold transition ${
                            upAttachment?.type === "video"
                              ? "border-emerald-500 bg-emerald-500/15 text-emerald-500"
                              : "border-border bg-surface-2 text-muted-foreground hover:bg-muted"
                          }`}
                        >
                          <Video className="h-4 w-4" />
                          Video
                        </button>
                        <button
                          type="button"
                          onClick={() => handleToggleUpsellAttachment("audio")}
                          className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-semibold transition ${
                            upAttachment?.type === "audio"
                              ? "border-emerald-500 bg-emerald-500/15 text-emerald-500"
                              : "border-border bg-surface-2 text-muted-foreground hover:bg-muted"
                          }`}
                        >
                          <Mic className="h-4 w-4" />
                          Voz / Audio
                        </button>
                        <button
                          type="button"
                          onClick={() => handleToggleUpsellAttachment("pdf")}
                          className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-semibold transition ${
                            upAttachment?.type === "pdf"
                              ? "border-emerald-500 bg-emerald-500/15 text-emerald-500"
                              : "border-border bg-surface-2 text-muted-foreground hover:bg-muted"
                          }`}
                        >
                          <FileText className="h-4 w-4" />
                          Catálogo PDF
                        </button>
                      </div>

                      {upAttachment && (
                        <div className="inline-flex items-center gap-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 text-xs font-medium text-emerald-500 mt-2">
                          <span>📎 Archivo adjunto: {upAttachment.name}</span>
                          <button
                            type="button"
                            onClick={() => setUpAttachment(null)}
                            className="hover:text-rose-500"
                            title="Quitar archivo"
                          >
                            <X className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      )}
                    </div>

                    {/* 5. BOTÓN DE APAGADO Y PRENDIDO (SWITCH INTERACTIVO) */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-border">
                      <div className="space-y-0.5">
                        <label className="text-xs font-bold text-foreground block">
                          Estado del Upsell:
                        </label>
                        <p className="text-[11px] text-muted-foreground">
                          Define si este upsell empezará a enviarse de inmediato o quedará en pausa.
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => setUpActive(!upActive)}
                        className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-bold transition shadow-xs border ${
                          upActive
                            ? "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border-emerald-500/40 ring-2 ring-emerald-500/20"
                            : "bg-muted text-muted-foreground border-border"
                        }`}
                      >
                        <span className={`h-2.5 w-2.5 rounded-full ${upActive ? "bg-emerald-500 animate-pulse" : "bg-muted-foreground/40"}`} />
                        <span>{upActive ? "🟢 Prendido (Activo)" : "⚪ Apagado (Pausado)"}</span>
                      </button>
                    </div>

                    {/* ACCIONES DEL FORMULARIO */}
                    <div className="pt-4 border-t border-border flex flex-wrap items-center justify-end gap-2.5">
                      <button
                        type="button"
                        onClick={() => openSim(upCopy)}
                        className="rounded-xl border border-border bg-surface px-4 py-2.5 text-xs font-bold text-emerald-500 hover:bg-muted transition inline-flex items-center gap-1.5"
                      >
                        <Smartphone className="h-4 w-4" />
                        Simular en WhatsApp
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setIsCreatingUpsell(false);
                          setEditingUpsellId(null);
                        }}
                        className="rounded-xl border border-border bg-surface px-4 py-2.5 text-xs font-bold text-muted-foreground hover:bg-muted"
                      >
                        Cancelar
                      </button>

                      <button
                        type="button"
                        onClick={handleSaveUpsell}
                        className="rounded-xl bg-emerald-600 px-6 py-2.5 text-xs font-bold text-white hover:bg-emerald-500 transition shadow-md inline-flex items-center gap-2"
                      >
                        <Check className="h-4 w-4" />
                        {editingUpsellId ? "Actualizar Upsell" : "Guardar y Activar Upsell"}
                      </button>
                    </div>
                  </div>
                ) : null}

                {/* LISTADO DE UPSELLS CREADOS */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                      Upsells Configurados ({upsells.length})
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {upsells.filter((u) => u.active).length} activos de {upsells.length}
                    </span>
                  </div>

                  {upsells.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-border p-8 text-center space-y-2">
                      <TrendingUp className="h-8 w-8 text-muted-foreground mx-auto" />
                      <p className="text-xs font-semibold text-muted-foreground">
                        Aún no tienes ningún Upsell configurado. Haz clic en "CREAR UPSELL" para empezar.
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {upsells.map((up) => (
                        <div
                          key={up.id}
                          className="rounded-2xl border border-border bg-surface-2 p-5 space-y-3.5 shadow-xs transition hover:border-emerald-500/40 flex flex-col justify-between"
                        >
                          <div className="space-y-3">
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex flex-wrap items-center gap-1.5">
                                <span className="inline-flex items-center gap-1 rounded-md bg-emerald-500/15 text-emerald-500 px-2 py-0.5 text-[11px] font-bold">
                                  {up.trigger === "post_confirmacion" ? "⚡ Post-confirmación" : "📦 Post-entrega"}
                                </span>
                                <span className="inline-flex items-center gap-1 rounded-md bg-surface text-muted-foreground border border-border px-2 py-0.5 text-[10px] font-semibold">
                                  {up.offerType === "catalogo_pdf" ? "📄 Todo el catálogo (PDF)" : `🎯 ${up.selectedProduct}`}
                                </span>
                              </div>

                              {/* BOTÓN PRENDIDO / APAGADO EN LA TARJETA */}
                              <button
                                type="button"
                                onClick={() => handleToggleUpsellActive(up.id)}
                                className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold transition border ${
                                  up.active
                                    ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30"
                                    : "bg-muted text-muted-foreground border-border"
                                }`}
                                title={up.active ? "Upsell prendido (activo). Clic para apagar" : "Upsell apagado (pausado). Clic para prender"}
                              >
                                <span className={`h-2 w-2 rounded-full ${up.active ? "bg-emerald-500 animate-pulse" : "bg-muted-foreground/40"}`} />
                                <span>{up.active ? "Prendido" : "Apagado"}</span>
                              </button>
                            </div>

                            <p className="text-xs text-foreground leading-relaxed bg-surface p-3 rounded-xl border border-border/70">
                              {up.copy}
                            </p>

                            {up.attachment && (
                              <div className="flex items-center gap-1.5 text-[11px] text-emerald-500 font-medium">
                                <span>📎 Adjunto: {up.attachment.name} ({up.attachment.type.toUpperCase()})</span>
                              </div>
                            )}
                          </div>

                          <div className="flex items-center justify-between pt-2 border-t border-border/50">
                            <span className="text-[10px] text-muted-foreground">
                              {up.createdAt}
                            </span>

                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => openSim(up.copy)}
                                className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-500 hover:underline"
                              >
                                <Smartphone className="h-3.5 w-3.5" /> Simular
                              </button>
                              <button
                                type="button"
                                onClick={() => handleEditUpsell(up)}
                                className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-500 hover:underline"
                              >
                                <Pencil className="h-3.5 w-3.5" /> Editar
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteUpsell(up.id)}
                                className="text-muted-foreground hover:text-rose-500 p-1 transition"
                                title="Eliminar Upsell"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ========================================================================= */}
            {/* 5. NOTIFICACIONES                                                        */}
            {/* ========================================================================= */}
            {selectedTab === "notificaciones" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-border pb-4">
                  <div>
                    <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                      <Bell className="h-5 w-5 text-emerald-500" />
                      Notificaciones Automáticas
                    </h2>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Alertas y avisos internos para el equipo por WhatsApp y Telegram.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setTestSent(true);
                      setTimeout(() => setTestSent(false), 2500);
                    }}
                    className="rounded-xl bg-emerald-600 px-3.5 py-1.5 text-xs font-bold text-white hover:bg-emerald-500 transition"
                  >
                    {testSent ? "¡Enviado!" : "Enviar Alerta de Prueba"}
                  </button>
                </div>

                <div className="rounded-2xl border border-border bg-surface-2 p-5 space-y-2 text-xs">
                  <p className="font-bold text-foreground">Canal de Alertas del Equipo:</p>
                  <p className="text-muted-foreground">WhatsApp Business API Oficial (+51 987 654 321) · 3 miembros conectados</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* MODAL TUTORIAL EXPLICATIVO */}
      {activeTutorial && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="relative w-full max-w-lg rounded-3xl border border-border bg-surface p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between border-b border-border pb-3">
              <div>
                <span className="rounded-md bg-emerald-500/15 text-emerald-500 px-2 py-0.5 text-[10px] font-bold">
                  {tutorials[activeTutorial].badge}
                </span>
                <h3 className="text-lg font-bold text-foreground mt-1">
                  {tutorials[activeTutorial].title}
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {tutorials[activeTutorial].subtitle}
                </p>
              </div>
              <button
                onClick={() => setActiveTutorial(null)}
                className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <h4 className="font-bold text-foreground uppercase tracking-wider text-[11px]">
                Cómo funciona paso a paso:
              </h4>
              {tutorials[activeTutorial].steps.map((s, idx) => (
                <div key={idx} className="rounded-xl border border-border bg-surface-2 p-3 space-y-1">
                  <p className="font-bold text-foreground">{s.title}</p>
                  <p className="text-muted-foreground leading-relaxed">{s.desc}</p>
                </div>
              ))}
            </div>

            <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 space-y-2 text-xs">
              <p className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                <Sparkles className="h-4 w-4" />
                Consejos de oro para Perú:
              </p>
              <ul className="space-y-1 text-muted-foreground list-disc list-inside">
                {tutorials[activeTutorial].tips.map((t, idx) => (
                  <li key={idx}>{t}</li>
                ))}
              </ul>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setActiveTutorial(null)}
                className="rounded-xl bg-primary px-4 py-2 text-xs font-bold text-primary-foreground hover:opacity-90"
              >
                Entendido, cerrar tutorial
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL SIMULADOR EN VIVO DE WHATSAPP */}
      {simulatorOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="relative w-full max-w-sm rounded-[36px] border-4 border-neutral-800 bg-neutral-950 p-3 shadow-2xl">
            <button
              onClick={() => setSimulatorOpen(false)}
              className="absolute -top-3 -right-3 z-10 rounded-full bg-surface border border-border p-1.5 text-foreground shadow-lg hover:bg-muted"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="rounded-[28px] bg-[#0b141a] text-white overflow-hidden flex flex-col h-[520px]">
              <div className="bg-[#202c33] px-3 py-2.5 flex items-center gap-2 border-b border-[#2a3942]">
                <div className="h-8 w-8 rounded-full bg-emerald-600 flex items-center justify-center text-xs font-bold text-white">
                  TA
                </div>
                <div>
                  <div className="flex items-center gap-1">
                    <span className="text-xs font-bold">Tienda Andina</span>
                    <span className="text-[10px] text-emerald-400">✓</span>
                  </div>
                  <span className="text-[10px] text-emerald-400">en línea</span>
                </div>
              </div>

              <div className="flex-1 p-3 overflow-y-auto space-y-3 text-xs bg-[radial-gradient(#1f2c34_1px,transparent_1px)] [background-size:16px_16px]">
                <div className="flex justify-center">
                  <span className="rounded-md bg-[#182229] px-2 py-0.5 text-[9px] text-[#8696a0]">
                    🔒 Mensaje protegido
                  </span>
                </div>

                <div className="flex flex-col items-end">
                  <div className="max-w-[88%] rounded-2xl rounded-tr-xs bg-[#005c4b] p-3 text-white shadow-xs leading-relaxed text-[11px] whitespace-pre-line">
                    <p>{simulatorMessage}</p>
                    <div className="mt-1 flex items-center justify-end gap-1 text-[9px] text-white/70">
                      <span>12:30</span>
                      <span className="text-sky-400 font-bold">✓✓</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-[#202c33] px-3 py-2 flex items-center gap-2 border-t border-[#2a3942]">
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
