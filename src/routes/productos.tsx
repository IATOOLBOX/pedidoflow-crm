import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo, useRef } from "react";
import { AppShell } from "@/components/app-shell";
import {
  products as initialProducts,
  type Product,
  type ProductCategory,
  type ProductStatus,
  type ProductMedia,
  type SalesStyle,
  type ProductVariantType,
  type QuantityOffer,
  soles,
} from "@/lib/mock-data";
import {
  Package,
  Plus,
  Search,
  RefreshCw,
  Edit2,
  Trash2,
  CheckCircle2,
  X,
  TrendingUp,
  AlertTriangle,
  LayoutGrid,
  List,
  Filter,
  Download,
  Upload,
  Image as ImageIcon,
  Sparkles,
  Link as LinkIcon,
  Video,
  FileSpreadsheet,
  Check,
  Tag,
  SlidersHorizontal,
} from "lucide-react";

export const Route = createFileRoute("/productos")({
  head: () => ({
    meta: [
      { title: "Catálogo de Productos — PedidoFlow" },
      {
        name: "description",
        content: "Control de stock, base de conocimiento IA y catálogo sincronizado con Shopify.",
      },
    ],
  }),
  component: ProductosPage,
});

const CATEGORIES: ("Todas" | ProductCategory)[] = [
  "Todas",
  "Calzado",
  "Hogar y Cocina",
  "Tecnología",
  "Moda y Accesorios",
  "Belleza y Cuidado",
  "Deportes y Aire Libre",
];

const SALES_STYLES: SalesStyle[] = [
  "Venta directa",
  "Venta consultiva (preguntas y dolor)",
  "Upsell agresivo",
  "Cierre con oferta y descuento",
  "Soporte técnico y demostración",
];

const SAMPLE_MEDIAS = [
  "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=600&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=600&auto=format&fit=crop&q=80",
];

export function ProductosPage() {
  const [productList, setProductList] = useState<Product[]>(initialProducts);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<"Todas" | ProductCategory>("Todas");
  const [stockFilter, setStockFilter] = useState<"all" | "healthy" | "low" | "out">("all");
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState("Hace 4 minutos");

  // Modal Principal: Crear / Editar Producto
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Modal Secundario: Importar Catálogo
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);

  // Form State del Producto (Conforme a la imagen de referencia)
  const [fName, setFName] = useState("");
  const [fSku, setFSku] = useState("");
  const [fCategory, setFCategory] = useState<ProductCategory>("Hogar y Cocina");
  const [fPrice, setFPrice] = useState<number>(85);
  const [fCostPrice, setFCostPrice] = useState<number>(35);
  const [fStock, setFStock] = useState<number>(20);
  const [fMinAlert, setFMinAlert] = useState<number>(5);
  const [fStatus, setFStatus] = useState<ProductStatus>("Activo");
  const [fSalesStyle, setFSalesStyle] = useState<SalesStyle>("Venta directa");
  const [fSupplier, setFSupplier] = useState("");
  const [fAiKnowledgeBase, setFAiKnowledgeBase] = useState("");
  const [fProductUrl, setFProductUrl] = useState("");
  const [fAllowBackorder, setFAllowBackorder] = useState(true);
  const [fMedia, setFMedia] = useState<ProductMedia[]>([]);

  // Variaciones State (Imagen de referencia)
  const [fHasVariants, setFHasVariants] = useState<boolean>(true);
  const [fVariantTypes, setFVariantTypes] = useState<ProductVariantType[]>([
    { id: "vt_color", name: "Color", options: [] },
  ]);
  const [newVariantInput, setNewVariantInput] = useState<Record<string, string>>({});
  const [showVariantTypesMenu, setShowVariantTypesMenu] = useState(false);

  // Ofertas por Cantidad State (Imagen de referencia)
  const [fQuantityOffers, setFQuantityOffers] = useState<QuantityOffer[]>([]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Toast State
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // KPIs
  const totalProducts = productList.length;
  const healthyStockCount = productList.filter((p) => p.stock >= p.minStockAlert && p.stock > 0).length;
  const lowStockCount = productList.filter((p) => p.stock > 0 && p.stock < p.minStockAlert).length;
  const outOfStockCount = productList.filter((p) => p.stock === 0).length;
  const totalInventoryValue = productList.reduce((acc, p) => acc + p.stock * p.price, 0);

  // Filtered Products
  const filteredProducts = useMemo(() => {
    return productList.filter((p) => {
      const matchCat = selectedCategory === "Todas" || p.category === selectedCategory;
      const matchSearch =
        searchQuery === "" ||
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.supplier && p.supplier.toLowerCase().includes(searchQuery.toLowerCase()));

      let matchStock = true;
      if (stockFilter === "healthy") matchStock = p.stock >= p.minStockAlert && p.stock > 0;
      if (stockFilter === "low") matchStock = p.stock > 0 && p.stock < p.minStockAlert;
      if (stockFilter === "out") matchStock = p.stock === 0;

      return matchCat && matchSearch && matchStock;
    });
  }, [productList, selectedCategory, searchQuery, stockFilter]);

  // Quick Stock Adjustment (+ / -)
  const handleAdjustStock = (id: string, delta: number) => {
    setProductList((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          const nextStock = Math.max(0, p.stock + delta);
          const nextStatus: ProductStatus = nextStock === 0 ? "Agotado" : p.status === "Agotado" ? "Activo" : p.status;
          return { ...p, stock: nextStock, status: nextStatus, updatedAt: "Ahora" };
        }
        return p;
      })
    );
    showToast(`Stock actualizado`);
  };

  // Toggle Active / Pausado
  const handleToggleStatus = (id: string) => {
    setProductList((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          if (p.stock === 0 && !p.allowBackorder) {
            showToast("No se puede activar: Sin stock y venta en espera desactivada");
            return p;
          }
          const nextStatus: ProductStatus = p.status === "Activo" ? "Pausado" : "Activo";
          return { ...p, status: nextStatus, updatedAt: "Ahora" };
        }
        return p;
      })
    );
  };

  // Sincronizar con Shopify Simulation
  const handleSyncShopify = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      setLastSyncTime("Hace unos segundos");
      showToast("Catálogo sincronizado exitosamente con Shopify");
    }, 1200);
  };

  // Exportar Catálogo a CSV (Compatible con Excel)
  const handleExportCSV = () => {
    const headers = [
      "ID",
      "Nombre",
      "SKU",
      "Categoria",
      "Precio_Venta_Soles",
      "Precio_Costo_Soles",
      "Stock_Disponible",
      "Alerta_Stock_Minimo",
      "Estado",
      "Estilo_Venta_IA",
      "Proveedor_Almacen",
      "Link_Web",
      "Permite_Venta_Sin_Stock",
      "Ventas_Totales",
    ];

    const rows = productList.map((p) => [
      `"${p.id}"`,
      `"${p.name.replace(/"/g, '""')}"`,
      `"${p.sku}"`,
      `"${p.category}"`,
      p.price,
      p.costPrice,
      p.stock,
      p.minStockAlert,
      `"${p.status}"`,
      `"${p.salesStyle || "Venta directa"}"`,
      `"${(p.supplier || "").replace(/"/g, '""')}"`,
      `"${p.productUrl || ""}"`,
      p.allowBackorder ? "SI" : "NO",
      p.salesCount,
    ]);

    const csvContent = "\uFEFF" + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `catalogo_pedidoflow_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast("Catálogo exportado exitosamente a CSV");
  };

  // Abrir Modal de Creación
  const handleOpenCreate = () => {
    setEditingProduct(null);
    setFName("");
    setFSku(`PROD-${Math.floor(100 + Math.random() * 900)}`);
    setFCategory("Hogar y Cocina");
    setFPrice(85);
    setFCostPrice(35);
    setFStock(15);
    setFMinAlert(5);
    setFStatus("Activo");
    setFSalesStyle("Venta directa");
    setFSupplier("Aliclik, Mayorista Lima");
    setFProductUrl("https://tutienda.com/producto");
    setFAllowBackorder(true);
    setFAiKnowledgeBase(
      "¡Dile adiós a los problemas con este producto estrella! 🔥\n\nBeneficios principales:\n- Alta calidad garantizada con materiales de larga duración.\n- Envío seguro con pago contraentrega en Lima y agencias Shalom a todo el Perú.\n\nPreguntas Frecuentes:\n- ¿Cuánto demora el delivery? De 24 a 48 horas según tu distrito o ciudad.\n- ¿Cómo pago? Puedes pagar en efectivo al recibir o por Yape/Plin."
    );
    setFMedia([
      {
        id: "m-new-1",
        url: SAMPLE_MEDIAS[0] ?? "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80",
        aiContext: "Foto frontal principal del producto con sello de garantía. Enviar en la presentación inicial al cliente.",
        isMain: true,
        type: "image",
      },
      {
        id: "m-new-2",
        url: SAMPLE_MEDIAS[1] ?? "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=600&auto=format&fit=crop&q=80",
        aiContext: "Foto con comparativa de antes y después o detalle de uso. Enviar cuando el cliente dude sobre la efectividad.",
        isMain: false,
        type: "image",
      },
    ]);
    setFHasVariants(true);
    setFVariantTypes([{ id: "vt_color", name: "Color", options: [] }]);
    setNewVariantInput({});
    setFQuantityOffers([]);
    setIsModalOpen(true);
  };

  // Abrir Modal de Edición
  const handleOpenEdit = (prod: Product) => {
    setEditingProduct(prod);
    setFName(prod.name);
    setFSku(prod.sku);
    setFCategory(prod.category);
    setFPrice(prod.price);
    setFCostPrice(prod.costPrice);
    setFStock(prod.stock);
    setFMinAlert(prod.minStockAlert);
    setFStatus(prod.status);
    setFSalesStyle(prod.salesStyle || "Venta directa");
    setFSupplier(prod.supplier || "");
    setFProductUrl(prod.productUrl || `https://tutienda.com/products/${prod.sku.toLowerCase()}`);
    setFAllowBackorder(prod.allowBackorder ?? true);
    setFAiKnowledgeBase(
      prod.aiKnowledgeBase ||
        `¡${prod.name}! 🔥\n\nInformación clave para responder al cliente:\n- Stock disponible para despacho inmediato.\n- Pago contraentrega asegurado.\n- Garantía de tienda de 30 días.`
    );
    setFMedia(
      prod.media && prod.media.length > 0
        ? prod.media
        : [
            {
              id: "m-ed-1",
              url: SAMPLE_MEDIAS[0] ?? "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80",
              aiContext: "Foto principal de catálogo. Enviar al confirmar el interés de compra.",
              isMain: true,
              type: "image",
            },
          ]
    );
    setFHasVariants(prod.hasVariants ?? (prod.variantTypes && prod.variantTypes.length > 0 ? true : false));
    setFVariantTypes(
      prod.variantTypes && prod.variantTypes.length > 0
        ? prod.variantTypes
        : [{ id: "vt_color", name: "Color", options: [] }]
    );
    setNewVariantInput({});
    setFQuantityOffers(prod.quantityOffers ?? []);
    setIsModalOpen(true);
  };

  // Manejo de Opciones de Variación (Color, Talla, etc.)
  const handleAddOptionToVariant = (vTypeId: string) => {
    const val = (newVariantInput[vTypeId] || "").trim();
    if (!val) return;
    setFVariantTypes((prev) =>
      prev.map((vt) =>
        vt.id === vTypeId && !vt.options.includes(val)
          ? { ...vt, options: [...vt.options, val] }
          : vt
      )
    );
    setNewVariantInput((prev) => ({ ...prev, [vTypeId]: "" }));
  };

  const handleRemoveOptionFromVariant = (vTypeId: string, optionVal: string) => {
    setFVariantTypes((prev) =>
      prev.map((vt) =>
        vt.id === vTypeId ? { ...vt, options: vt.options.filter((o) => o !== optionVal) } : vt
      )
    );
  };

  const handleRemoveVariantType = (vTypeId: string) => {
    setFVariantTypes((prev) => prev.filter((vt) => vt.id !== vTypeId));
    showToast("Tipo de variación eliminado");
  };

  const handleAddVariantType = (name: string) => {
    if (fVariantTypes.some((vt) => vt.name.toLowerCase() === name.toLowerCase())) {
      showToast(`La variación "${name}" ya está agregada`);
      return;
    }
    setFVariantTypes((prev) => [...prev, { id: `vt_${Date.now()}`, name, options: [] }]);
    setShowVariantTypesMenu(false);
    showToast(`Variación "${name}" añadida`);
  };

  // Manejo de Ofertas por Cantidad
  const handleAddQuantityOffer = () => {
    const lastOffer = fQuantityOffers[fQuantityOffers.length - 1];
    const nextQty = lastOffer ? lastOffer.quantity + 1 : 2;
    const basePrice = Number(fPrice) || 85;
    const discountedTotal = Math.round(basePrice * nextQty * 0.85);
    const savings = basePrice * nextQty - discountedTotal;

    const newOffer: QuantityOffer = {
      id: `off_${Date.now()}`,
      quantity: nextQty,
      price: discountedTotal,
      label: nextQty === 2 ? "Lleva 2 con descuento" : nextQty === 3 ? "Pack Familiar" : "Precio Mayorista",
      savings,
    };
    setFQuantityOffers([...fQuantityOffers, newOffer]);
    showToast(`Oferta por ${nextQty} unidades añadida`);
  };

  const handleRemoveQuantityOffer = (id: string) => {
    setFQuantityOffers((prev) => prev.filter((o) => o.id !== id));
  };

  const handleUpdateOfferPrice = (id: string, newPrice: number) => {
    setFQuantityOffers((prev) =>
      prev.map((o) => {
        if (o.id === id) {
          const basePrice = Number(fPrice) || 85;
          const origTotal = basePrice * o.quantity;
          const savings = Math.max(0, origTotal - newPrice);
          return { ...o, price: newPrice, savings };
        }
        return o;
      })
    );
  };

  // Agregar Imagen a la Galería
  const handleAddMedia = () => {
    if (fMedia.length >= 10) {
      showToast("Límite máximo de 10 fotos/videos alcanzado");
      return;
    }
    const nextUrl = SAMPLE_MEDIAS[fMedia.length % SAMPLE_MEDIAS.length] ?? "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80";
    const newMediaItem: ProductMedia = {
      id: `med_${Date.now()}`,
      url: nextUrl,
      aiContext: "Explícale a tu IA qué contiene la foto/video y cuándo debe usarla",
      isMain: fMedia.length === 0,
      type: "image",
    };
    setFMedia([...fMedia, newMediaItem]);
    showToast("Imagen añadida a la galería");
  };

  // Eliminar Imagen de la Galería
  const handleRemoveMedia = (id: string) => {
    const updated = fMedia.filter((m) => m.id !== id);
    if (updated.length > 0 && !updated.some((m) => m.isMain)) {
      if (updated[0]) {
        updated[0].isMain = true;
      }
    }
    setFMedia(updated);
  };

  // Actualizar Explicación IA de una Foto
  const handleUpdateMediaAiContext = (id: string, text: string) => {
    setFMedia((prev) => prev.map((m) => (m.id === id ? { ...m, aiContext: text } : m)));
  };

  // Generar Argumentos con IA para la Base de Conocimiento
  const handleGenerateAiCopy = () => {
    const productName = fName.trim() || "Producto de Catálogo";
    setFAiKnowledgeBase(
      `¡Descubre el poder de ${productName}! 🔥\n\n` +
        `🎯 Dolor del cliente que resuelve:\n` +
        `- Elimina la frustración de productos de baja calidad que no duran.\n` +
        `- Fácil de usar desde el primer día sin configuraciones complejas.\n\n` +
        `⭐ Argumentos de venta y cierre para tu IA:\n` +
        `- Precio promocional por tiempo limitado con delivery contraentrega.\n` +
        `- Envío prioritario con Shalom en provincia (recibe en 24-48h hábiles).\n` +
        `- Garantía de satisfacción total y cambio inmediato ante cualquier incidencia.`
    );
    showToast("✨ Base de conocimiento optimizada con IA");
  };

  // Guardar Producto
  const handleSaveProduct = () => {
    if (!fName.trim()) {
      showToast("El nombre del producto es obligatorio");
      return;
    }
    if (!fSku.trim()) {
      showToast("El SKU del producto es obligatorio");
      return;
    }

    const effectiveStock = Math.max(0, Number(fStock) || 0);
    let effectiveStatus: ProductStatus = fStatus;
    if (effectiveStock === 0 && !fAllowBackorder) {
      effectiveStatus = "Agotado";
    }

    if (editingProduct) {
      setProductList((prev) =>
        prev.map((p) =>
          p.id === editingProduct.id
            ? {
                ...p,
                name: fName.trim(),
                sku: fSku.trim().toUpperCase(),
                category: fCategory,
                price: Number(fPrice) || 0,
                costPrice: Number(fCostPrice) || 0,
                stock: effectiveStock,
                minStockAlert: Math.max(1, Number(fMinAlert) || 5),
                status: effectiveStatus,
                salesStyle: fSalesStyle,
                supplier: fSupplier.trim() || undefined,
                aiKnowledgeBase: fAiKnowledgeBase.trim() || undefined,
                productUrl: fProductUrl.trim() || undefined,
                allowBackorder: fAllowBackorder,
                media: fMedia,
                hasVariants: fHasVariants,
                variantTypes: fHasVariants ? fVariantTypes : undefined,
                quantityOffers: fQuantityOffers.length > 0 ? fQuantityOffers : undefined,
                updatedAt: "Ahora",
              }
            : p
        )
      );
      showToast("Producto actualizado correctamente");
    } else {
      const newProduct: Product = {
        id: `prod-${Date.now()}`,
        name: fName.trim(),
        sku: fSku.trim().toUpperCase(),
        category: fCategory,
        price: Number(fPrice) || 0,
        costPrice: Number(fCostPrice) || 0,
        stock: effectiveStock,
        minStockAlert: Math.max(1, Number(fMinAlert) || 5),
        status: effectiveStatus,
        salesCount: 0,
        shopifySynced: true,
        updatedAt: "Ahora",
        salesStyle: fSalesStyle,
        supplier: fSupplier.trim() || undefined,
        aiKnowledgeBase: fAiKnowledgeBase.trim() || undefined,
        productUrl: fProductUrl.trim() || undefined,
        allowBackorder: fAllowBackorder,
        media: fMedia,
        hasVariants: fHasVariants,
        variantTypes: fHasVariants ? fVariantTypes : undefined,
        quantityOffers: fQuantityOffers.length > 0 ? fQuantityOffers : undefined,
        tags: ["Nuevo"],
      };
      setProductList((prev) => [newProduct, ...prev]);
      showToast("Nuevo producto añadido al catálogo");
    }
    setIsModalOpen(false);
  };

  // Eliminar Producto
  const handleDeleteProduct = (id: string) => {
    setProductList((prev) => prev.filter((p) => p.id !== id));
    showToast("Producto eliminado del catálogo");
  };

  // Simular Carga de CSV
  const handleSimulateCsvImport = () => {
    const sampleBatch: Product[] = [
      {
        id: `prod-imp-${Date.now()}-1`,
        name: "Lámpara Solar de Exterior con Sensor de Movimiento 100 LED",
        sku: "LAM-SOL-100",
        category: "Hogar y Cocina",
        price: 69,
        costPrice: 22,
        stock: 50,
        minStockAlert: 10,
        status: "Activo",
        salesCount: 0,
        shopifySynced: true,
        updatedAt: "Ahora",
        supplier: "Mayorista Importaciones S.A.C.",
        salesStyle: "Venta directa",
        allowBackorder: true,
        aiKnowledgeBase: "Lámpara solar resistente a lluvia IP65. Sensor de 5 metros.",
        tags: ["Importado"],
      },
      {
        id: `prod-imp-${Date.now()}-2`,
        name: "Masajeador Cervical Eléctrico con Calor Infrarrojo",
        sku: "MAS-CER-INF",
        category: "Belleza y Cuidado",
        price: 119,
        costPrice: 45,
        stock: 35,
        minStockAlert: 8,
        status: "Activo",
        salesCount: 0,
        shopifySynced: true,
        updatedAt: "Ahora",
        supplier: "Almacén Central Lima",
        salesStyle: "Venta consultiva (preguntas y dolor)",
        allowBackorder: true,
        aiKnowledgeBase: "Alivia contracturas y dolor de cuello en 15 minutos.",
        tags: ["Importado", "Top Salud"],
      },
    ];

    setProductList((prev) => [...sampleBatch, ...prev]);
    setIsImportModalOpen(false);
    showToast("2 productos importados exitosamente");
  };

  return (
    <AppShell
      title="Catálogo de Productos"
      subtitle="Control de inventario, base de conocimiento para tu IA y sincronización de stock"
    >
      {/* TOAST FLOTANTE */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 rounded-xl border border-border bg-surface px-4 py-2.5 text-xs font-medium text-foreground shadow-lg flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      <div className="space-y-6">
        {/* BARRA SUPERIOR DE ACCIONES */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-4">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className="inline-block h-2 w-2 rounded-full bg-emerald-500" />
            <span>Sincronización activa con Shopify</span>
            <span>·</span>
            <span>{lastSyncTime}</span>
          </div>

          {/* BOTONES DE IMPORTAR, EXPORTAR Y NUEVO PRODUCTO */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleSyncShopify}
              disabled={isSyncing}
              className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-surface px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted transition cursor-pointer disabled:opacity-50"
              title="Sincronizar existencias y precios con Shopify"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${isSyncing ? "animate-spin text-primary" : "text-muted-foreground"}`} />
              <span className="hidden sm:inline">{isSyncing ? "Sincronizando..." : "Sincronizar"}</span>
            </button>

            {/* BOTÓN IMPORTAR */}
            <button
              type="button"
              onClick={() => setIsImportModalOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-surface px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted transition cursor-pointer"
              title="Importar catálogo masivo vía CSV o Excel"
            >
              <Upload className="h-3.5 w-3.5 text-muted-foreground" />
              <span>Importar</span>
            </button>

            {/* BOTÓN EXPORTAR */}
            <button
              type="button"
              onClick={handleExportCSV}
              className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-surface px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted transition cursor-pointer"
              title="Descargar catálogo completo en formato CSV / Excel"
            >
              <Download className="h-3.5 w-3.5 text-muted-foreground" />
              <span>Exportar</span>
            </button>

            {/* BOTÓN NUEVO PRODUCTO */}
            <button
              type="button"
              onClick={handleOpenCreate}
              className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3.5 py-1.5 text-xs font-medium text-primary-foreground hover:bg-primary/90 transition shadow-xs cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              <span>Nuevo Producto</span>
            </button>
          </div>
        </div>

        {/* METRICAS KPI DE INVENTARIO */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          <div className="rounded-xl border border-border bg-surface p-4 space-y-1">
            <span className="text-[11px] font-medium text-muted-foreground block">Total Catálogo</span>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-bold tracking-tight text-foreground">{totalProducts}</span>
              <Package className="h-4 w-4 text-muted-foreground" />
            </div>
            <p className="text-[11px] text-muted-foreground">Productos registrados</p>
          </div>

          <div className="rounded-xl border border-border bg-surface p-4 space-y-1">
            <span className="text-[11px] font-medium text-muted-foreground block">Stock Saludable</span>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-bold tracking-tight text-emerald-600 dark:text-emerald-400">
                {healthyStockCount}
              </span>
              <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">OK</span>
            </div>
            <p className="text-[11px] text-muted-foreground">Disponibilidad completa</p>
          </div>

          <div className="rounded-xl border border-border bg-surface p-4 space-y-1">
            <span className="text-[11px] font-medium text-muted-foreground block">Stock Bajo</span>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-bold tracking-tight text-amber-600 dark:text-amber-400">
                {lowStockCount}
              </span>
              <AlertTriangle className="h-4 w-4 text-amber-500" />
            </div>
            <p className="text-[11px] text-muted-foreground">Menos de stock mínimo</p>
          </div>

          <div className="rounded-xl border border-border bg-surface p-4 space-y-1">
            <span className="text-[11px] font-medium text-muted-foreground block">Agotados</span>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-bold tracking-tight text-rose-600 dark:text-rose-400">
                {outOfStockCount}
              </span>
              <span className="text-xs text-rose-600 dark:text-rose-400 font-medium">0 uds</span>
            </div>
            <p className="text-[11px] text-muted-foreground">Requieren reabastecimiento</p>
          </div>

          <div className="rounded-xl border border-border bg-surface p-4 space-y-1 col-span-2 sm:col-span-1">
            <span className="text-[11px] font-medium text-muted-foreground block">Valor en Inventario</span>
            <div className="flex items-baseline justify-between">
              <span className="text-xl font-bold tracking-tight text-foreground">
                {soles(totalInventoryValue)}
              </span>
              <TrendingUp className="h-4 w-4 text-primary" />
            </div>
            <p className="text-[11px] text-muted-foreground">Valor comercial actual</p>
          </div>
        </div>

        {/* FILTROS Y CONTROLES */}
        <div className="rounded-xl border border-border bg-surface p-3 space-y-3">
          <div className="flex flex-col sm:flex-row gap-2.5 items-center justify-between">
            {/* Buscador */}
            <div className="relative w-full sm:max-w-xs">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Buscar por nombre, SKU o proveedor..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-9 rounded-lg border border-border bg-background pl-9 pr-3 text-xs text-foreground outline-none focus:border-primary"
              />
            </div>

            {/* Filtros de Nivel de Stock */}
            <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
              <button
                type="button"
                onClick={() => setStockFilter("all")}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition cursor-pointer ${
                  stockFilter === "all"
                    ? "bg-muted text-foreground font-semibold"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Todos ({totalProducts})
              </button>
              <button
                type="button"
                onClick={() => setStockFilter("healthy")}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition cursor-pointer ${
                  stockFilter === "healthy"
                    ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Saludable ({healthyStockCount})
              </button>
              <button
                type="button"
                onClick={() => setStockFilter("low")}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition cursor-pointer ${
                  stockFilter === "low"
                    ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 font-semibold"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Bajo ({lowStockCount})
              </button>
              <button
                type="button"
                onClick={() => setStockFilter("out")}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition cursor-pointer ${
                  stockFilter === "out"
                    ? "bg-rose-500/10 text-rose-600 dark:text-rose-400 font-semibold"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Agotado ({outOfStockCount})
              </button>

              {/* Alternador de vista */}
              <div className="ml-auto pl-2 border-l border-border flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setViewMode("table")}
                  className={`p-1.5 rounded-md transition cursor-pointer ${
                    viewMode === "table" ? "bg-muted text-foreground" : "text-muted-foreground hover:text-foreground"
                  }`}
                  title="Vista Tabla"
                >
                  <List className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode("grid")}
                  className={`p-1.5 rounded-md transition cursor-pointer ${
                    viewMode === "grid" ? "bg-muted text-foreground" : "text-muted-foreground hover:text-foreground"
                  }`}
                  title="Vista Cuadrícula"
                >
                  <LayoutGrid className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Selector de Categorías */}
          <div className="flex items-center gap-1.5 overflow-x-auto pt-1 border-t border-border/50 text-xs">
            <span className="text-[11px] text-muted-foreground font-medium mr-1 flex items-center gap-1">
              <Filter className="h-3 w-3" /> Categoría:
            </span>
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-2 py-1 rounded-md text-[11px] whitespace-nowrap transition cursor-pointer ${
                  selectedCategory === cat
                    ? "bg-foreground text-background font-semibold"
                    : "bg-surface-2 text-muted-foreground hover:text-foreground"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* ========================================================================= */}
        {/* VISTA 1: TABLA EMPRESARIAL                                                */}
        {/* ========================================================================= */}
        {viewMode === "table" && (
          <div className="rounded-xl border border-border bg-surface overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-foreground">
                <thead className="border-b border-border bg-muted/40 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                  <tr>
                    <th className="px-4 py-3">Producto / SKU</th>
                    <th className="px-4 py-3">Categoría & Proveedor</th>
                    <th className="px-4 py-3">Precio Base</th>
                    <th className="px-4 py-3">Estilo IA</th>
                    <th className="px-4 py-3">Stock Disponible</th>
                    <th className="px-4 py-3">Estado</th>
                    <th className="px-4 py-3 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredProducts.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-4 py-12 text-center text-muted-foreground text-xs">
                        No se encontraron productos con los filtros seleccionados.
                      </td>
                    </tr>
                  ) : (
                    filteredProducts.map((prod) => {
                      const isLowStock = prod.stock > 0 && prod.stock < prod.minStockAlert;
                      const isOutOfStock = prod.stock === 0;
                      const mainPhoto = prod.media?.find((m) => m.isMain) || prod.media?.[0];

                      return (
                        <tr key={prod.id} className="hover:bg-muted/25 transition-colors">
                          {/* Producto y SKU */}
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-3">
                              <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-surface-2 border border-border overflow-hidden text-muted-foreground">
                                {mainPhoto ? (
                                  <img src={mainPhoto.url} alt={prod.name} className="h-full w-full object-cover" />
                                ) : (
                                  <Package className="h-4 w-4 text-foreground/80" />
                                )}
                              </div>
                              <div className="min-w-0">
                                <p className="font-semibold text-foreground text-xs truncate max-w-xs">{prod.name}</p>
                                <div className="flex items-center gap-2 mt-0.5">
                                  <span className="font-mono text-[10px] text-muted-foreground">{prod.sku}</span>
                                  {prod.allowBackorder && (
                                    <span className="rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-1 py-0.2 text-[9px] font-medium">
                                      Venta sin stock
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </td>

                          {/* Categoría y Proveedor */}
                          <td className="px-4 py-3">
                            <div className="space-y-0.5">
                              <span className="inline-block rounded border border-border bg-surface-2 px-1.5 py-0.2 text-[10px] font-medium text-muted-foreground">
                                {prod.category}
                              </span>
                              {prod.supplier && (
                                <p className="text-[10px] text-muted-foreground truncate max-w-[140px]">
                                  {prod.supplier}
                                </p>
                              )}
                            </div>
                          </td>

                          {/* Precio Base */}
                          <td className="px-4 py-3 font-semibold text-foreground">{soles(prod.price)}</td>

                          {/* Estilo IA */}
                          <td className="px-4 py-3">
                            <span className="inline-flex items-center gap-1 rounded bg-muted px-2 py-0.5 text-[10px] font-medium text-foreground">
                              <Sparkles className="h-3 w-3 text-primary" />
                              {prod.salesStyle || "Venta directa"}
                            </span>
                          </td>

                          {/* Stock con Control Rápido */}
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => handleAdjustStock(prod.id, -1)}
                                disabled={prod.stock === 0}
                                className="h-6 w-6 rounded border border-border bg-surface flex items-center justify-center text-xs font-semibold text-muted-foreground hover:bg-muted hover:text-foreground transition cursor-pointer disabled:opacity-30"
                                title="Reducir 1 unidad"
                              >
                                -
                              </button>

                              <div className="min-w-[55px] text-center">
                                <span
                                  className={`inline-block px-2 py-0.5 rounded text-xs font-bold ${
                                    isOutOfStock
                                      ? "bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20"
                                      : isLowStock
                                      ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20"
                                      : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                                  }`}
                                >
                                  {prod.stock} uds
                                </span>
                              </div>

                              <button
                                type="button"
                                onClick={() => handleAdjustStock(prod.id, 1)}
                                className="h-6 w-6 rounded border border-border bg-surface flex items-center justify-center text-xs font-semibold text-muted-foreground hover:bg-muted hover:text-foreground transition cursor-pointer"
                                title="Añadir 1 unidad"
                              >
                                +
                              </button>
                            </div>
                          </td>

                          {/* Estado */}
                          <td className="px-4 py-3">
                            <button
                              type="button"
                              onClick={() => handleToggleStatus(prod.id)}
                              className={`inline-flex items-center gap-1.5 rounded-md px-2 py-0.5 text-[11px] font-medium transition cursor-pointer ${
                                prod.status === "Activo"
                                  ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                                  : prod.status === "Pausado"
                                  ? "bg-muted text-muted-foreground"
                                  : "bg-rose-500/10 text-rose-600 dark:text-rose-400"
                              }`}
                            >
                              <span
                                className={`h-1.5 w-1.5 rounded-full ${
                                  prod.status === "Activo"
                                    ? "bg-emerald-500"
                                    : prod.status === "Pausado"
                                    ? "bg-muted-foreground"
                                    : "bg-rose-500"
                                }`}
                              />
                              {prod.status}
                            </button>
                          </td>

                          {/* Acciones */}
                          <td className="px-4 py-3 text-right">
                            <div className="flex items-center justify-end gap-1">
                              <button
                                type="button"
                                onClick={() => handleOpenEdit(prod)}
                                className="p-1.5 rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition cursor-pointer"
                                title="Editar producto"
                              >
                                <Edit2 className="h-3.5 w-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteProduct(prod.id)}
                                className="p-1.5 rounded-md text-muted-foreground hover:bg-rose-500/10 hover:text-rose-600 transition cursor-pointer"
                                title="Eliminar producto"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* VISTA 2: CUADRÍCULA DE TARJETAS                                           */}
        {/* ========================================================================= */}
        {viewMode === "grid" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {filteredProducts.length === 0 ? (
              <div className="col-span-full rounded-xl border border-border bg-surface p-12 text-center text-muted-foreground text-xs">
                No se encontraron productos con los filtros seleccionados.
              </div>
            ) : (
              filteredProducts.map((prod) => {
                const isLowStock = prod.stock > 0 && prod.stock < prod.minStockAlert;
                const isOutOfStock = prod.stock === 0;
                const mainPhoto = prod.media?.find((m) => m.isMain) || prod.media?.[0];

                return (
                  <div
                    key={prod.id}
                    className="rounded-xl border border-border bg-surface p-3.5 flex flex-col justify-between space-y-3 hover:border-border/80 transition"
                  >
                    <div>
                      {/* Imagen y badges */}
                      <div className="relative aspect-video w-full rounded-lg bg-surface-2 overflow-hidden border border-border mb-2.5">
                        {mainPhoto ? (
                          <img src={mainPhoto.url} alt={prod.name} className="h-full w-full object-cover" />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                            <Package className="h-8 w-8 opacity-40" />
                          </div>
                        )}
                        <span className="absolute top-2 left-2 rounded bg-black/60 backdrop-blur-xs text-white px-1.5 py-0.2 text-[9px] font-medium">
                          {prod.category}
                        </span>
                        <span
                          className={`absolute top-2 right-2 rounded px-1.5 py-0.2 text-[9px] font-medium ${
                            prod.status === "Activo"
                              ? "bg-emerald-500 text-white"
                              : prod.status === "Pausado"
                              ? "bg-gray-600 text-white"
                              : "bg-rose-500 text-white"
                          }`}
                        >
                          {prod.status}
                        </span>
                      </div>

                      <div>
                        <h4 className="font-semibold text-xs text-foreground line-clamp-2">{prod.name}</h4>
                        <p className="font-mono text-[10px] text-muted-foreground mt-0.5">{prod.sku}</p>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-border/60 space-y-2.5">
                      <div className="flex items-baseline justify-between">
                        <div>
                          <p className="text-[10px] text-muted-foreground">Precio Base</p>
                          <p className="text-sm font-bold text-foreground">{soles(prod.price)}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-[10px] text-muted-foreground">Stock</p>
                          <span
                            className={`inline-block text-xs font-bold ${
                              isOutOfStock
                                ? "text-rose-600 dark:text-rose-400"
                                : isLowStock
                                ? "text-amber-600 dark:text-amber-400"
                                : "text-emerald-600 dark:text-emerald-400"
                            }`}
                          >
                            {prod.stock} uds
                          </span>
                        </div>
                      </div>

                      {/* Botones rápidos */}
                      <div className="flex items-center justify-between pt-1">
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => handleAdjustStock(prod.id, -1)}
                            disabled={prod.stock === 0}
                            className="h-6 w-6 rounded border border-border bg-background flex items-center justify-center text-xs text-muted-foreground hover:bg-muted transition cursor-pointer disabled:opacity-30"
                          >
                            -
                          </button>
                          <button
                            type="button"
                            onClick={() => handleAdjustStock(prod.id, 1)}
                            className="h-6 w-6 rounded border border-border bg-background flex items-center justify-center text-xs text-muted-foreground hover:bg-muted transition cursor-pointer"
                          >
                            +
                          </button>
                        </div>

                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => handleOpenEdit(prod)}
                            className="p-1 rounded text-muted-foreground hover:bg-muted hover:text-foreground transition cursor-pointer"
                            title="Editar"
                          >
                            <Edit2 className="h-3.5 w-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteProduct(prod.id)}
                            className="p-1 rounded text-muted-foreground hover:bg-rose-500/10 hover:text-rose-600 transition cursor-pointer"
                            title="Eliminar"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* MODAL INTEGRAL: EDITAR / AGREGAR PRODUCTO (IDÉNTICO A LA REFERENCIA)       */}
      {/* ========================================================================= */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="relative w-full max-w-2xl rounded-2xl border border-border bg-surface shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
            {/* Header del Modal */}
            <div className="flex items-center justify-between border-b border-border px-5 py-4 bg-muted/20">
              <h3 className="text-base font-bold text-foreground">
                {editingProduct ? "Editar Producto" : "Agregar Producto"}
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted transition cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Contenido con Scroll */}
            <div className="p-5 overflow-y-auto space-y-5 text-xs">
              {/* 1. SECCIÓN: FOTOS Y VIDEOS CON PROMPTS PARA IA */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-foreground text-xs">Fotos y Videos</label>
                  <span className="text-[11px] text-muted-foreground font-mono">{fMedia.length}/10</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {fMedia.map((m, index) => (
                    <div
                      key={m.id}
                      className="group relative rounded-xl border border-border bg-surface-2 p-2 space-y-2 flex flex-col justify-between"
                    >
                      {/* Imagen con badges */}
                      <div className="relative aspect-square w-full rounded-lg overflow-hidden border border-border bg-muted">
                        <img src={m.url} alt={`Media ${index + 1}`} className="h-full w-full object-cover" />

                        {index === 0 ? (
                          <span className="absolute top-1.5 left-1.5 rounded bg-emerald-600 text-white px-1.5 py-0.5 text-[9px] font-bold shadow-xs">
                            Principal
                          </span>
                        ) : null}

                        <button
                          type="button"
                          onClick={() => handleRemoveMedia(m.id)}
                          className="absolute top-1.5 right-1.5 h-5 w-5 rounded-full bg-black/70 text-white flex items-center justify-center hover:bg-rose-600 transition cursor-pointer"
                          title="Eliminar imagen"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>

                      {/* Explicación contextual para la IA */}
                      <textarea
                        rows={2}
                        value={m.aiContext}
                        onChange={(e) => handleUpdateMediaAiContext(m.id, e.target.value)}
                        placeholder="Explícale a tu IA qué contiene la foto/video y cuándo debe usarla"
                        className="w-full rounded-lg border border-border bg-background p-2 text-[10px] text-muted-foreground placeholder:text-muted-foreground/60 outline-none focus:border-primary leading-tight resize-none"
                      />
                    </div>
                  ))}

                  {/* Tarjeta para Agregar Foto/Video */}
                  {fMedia.length < 10 && (
                    <button
                      type="button"
                      onClick={handleAddMedia}
                      className="rounded-xl border border-dashed border-border hover:border-primary/60 bg-surface-2/50 hover:bg-muted/40 p-4 flex flex-col items-center justify-center gap-2 text-center transition cursor-pointer min-h-[180px]"
                    >
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <ImageIcon className="h-5 w-5" />
                        <Video className="h-4 w-4" />
                      </div>
                      <span className="text-xs font-semibold text-foreground">Agregar</span>
                      <span className="text-[10px] text-muted-foreground">JPG, PNG • MP4</span>
                    </button>
                  )}
                </div>

                <p className="text-[11px] text-muted-foreground">
                  Arrastra para reordenar. La primera imagen será la principal. Imágenes: JPG, PNG • Videos: MP4
                </p>
              </div>

              {/* 2. SECCIÓN: NOMBRE * */}
              <div className="space-y-1">
                <label className="font-bold text-foreground text-xs">Nombre *</label>
                <input
                  type="text"
                  value={fName}
                  onChange={(e) => setFName(e.target.value)}
                  placeholder="Ej: H-Warts – Elimina Verrugas y Callos que Te Causan Dolor"
                  className="w-full h-9 rounded-lg border border-border bg-background px-3 text-xs outline-none focus:border-primary"
                />
              </div>

              {/* 3. SECCIÓN: ESTILO DE VENTA (I.A) * & PRECIO BASE * */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-foreground text-xs">Estilo de Venta (I.A) *</label>
                  <p className="text-[11px] text-muted-foreground">
                    Esto define la forma en que tu IA va a vender este producto
                  </p>
                  <select
                    value={fSalesStyle}
                    onChange={(e) => setFSalesStyle(e.target.value as SalesStyle)}
                    className="w-full h-9 rounded-lg border border-border bg-background px-3 text-xs outline-none focus:border-primary cursor-pointer mt-1"
                  >
                    {SALES_STYLES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-foreground text-xs">Precio Base *</label>
                  <p className="text-[11px] text-muted-foreground">Precio en soles con el que cerrará la IA</p>
                  <input
                    type="number"
                    min={1}
                    value={fPrice}
                    onChange={(e) => setFPrice(Number(e.target.value))}
                    placeholder="85"
                    className="w-full h-9 rounded-lg border border-border bg-background px-3 text-xs outline-none focus:border-primary mt-1 font-semibold"
                  />
                </div>
              </div>

              {/* 4. SECCIÓN: SKU & PROVEEDOR / ALMACÉN */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-foreground text-xs">SKU</label>
                  <input
                    type="text"
                    value={fSku}
                    onChange={(e) => setFSku(e.target.value)}
                    placeholder="Ej: PROD-001"
                    className="w-full h-9 rounded-lg border border-border bg-background px-3 text-xs font-mono outline-none focus:border-primary uppercase"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-foreground text-xs">Proveedor / Almacén</label>
                  <input
                    type="text"
                    value={fSupplier}
                    onChange={(e) => setFSupplier(e.target.value)}
                    placeholder="Ej: Aliclik, Mayorista X"
                    className="w-full h-9 rounded-lg border border-border bg-background px-3 text-xs outline-none focus:border-primary"
                  />
                </div>
              </div>

              {/* 5. SECCIÓN: INFORMACIÓN DETALLADA / BASE DE CONOCIMIENTO IA */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="font-bold text-foreground text-xs block">
                      Información Detallada, Compacta y Resumida del Producto
                    </label>
                    <span className="text-[11px] text-muted-foreground">
                      (Esto es una fuente de conocimiento para tu I.A)
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={handleGenerateAiCopy}
                    className="inline-flex items-center gap-1 rounded border border-border bg-surface-2 px-2 py-1 text-[10px] font-medium text-foreground hover:bg-muted transition cursor-pointer"
                  >
                    <Sparkles className="h-3 w-3 text-primary" />
                    <span>Redactar con IA</span>
                  </button>
                </div>

                <textarea
                  rows={4}
                  value={fAiKnowledgeBase}
                  onChange={(e) => setFAiKnowledgeBase(e.target.value)}
                  placeholder="¡Dile adiós a las verrugas y callos dolorosos con H-Warts! 🔥 Explica aquí dolor del cliente, cómo funciona, garantía y respuestas a objeciones..."
                  className="w-full rounded-lg border border-border bg-background p-3 text-xs leading-relaxed outline-none focus:border-primary"
                />
              </div>

              {/* 6. SECCIÓN: LINK DE PRODUCTO WEB */}
              <div className="space-y-1">
                <label className="font-bold text-foreground text-xs">Link de producto web</label>
                <div className="relative">
                  <LinkIcon className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <input
                    type="text"
                    value={fProductUrl}
                    onChange={(e) => setFProductUrl(e.target.value)}
                    placeholder="https://tutienda.com/producto"
                    className="w-full h-9 rounded-lg border border-border bg-background pl-9 pr-3 text-xs outline-none focus:border-primary"
                  />
                </div>
              </div>

              {/* 7. SECCIÓN: CONTROL DE VENTA SIN STOCK Y STOCK DISPONIBLE */}
              <div className="rounded-xl border border-border bg-surface-2/70 p-3.5 space-y-2">
                <div className="flex items-center justify-between gap-4">
                  {/* Switch toggle */}
                  <label className="flex items-center gap-3 cursor-pointer">
                    <button
                      type="button"
                      onClick={() => setFAllowBackorder(!fAllowBackorder)}
                      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                        fAllowBackorder ? "bg-emerald-600" : "bg-muted-foreground/40"
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                          fAllowBackorder ? "translate-x-5" : "translate-x-0"
                        }`}
                      />
                    </button>
                    <span className="font-bold text-xs text-foreground">
                      Seguir vendiendo incluso cuando no hay stock
                    </span>
                  </label>

                  {/* Stock calculado disponible */}
                  <div className="text-right">
                    <span className="text-[10px] text-muted-foreground block font-medium">Stock Calculado</span>
                    <div className="mt-0.5 rounded border border-border bg-background px-3 py-1 text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">
                      {fStock}
                    </div>
                  </div>
                </div>

                <p className="text-[10px] text-muted-foreground leading-snug">
                  * El stock se gestiona y calcula automáticamente desde el ERP (Almacén) y afecta directamente a la IA de mensajería. + (I.A de confirmaciones no se verá afectada por el stock)
                </p>
              </div>

              {/* 8. SECCIÓN: ESTE PRODUCTO TIENE VARIACIONES (Exacto a la imagen) */}
              <div className="pt-3 border-t border-border/70 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <button
                      type="button"
                      onClick={() => setFHasVariants(!fHasVariants)}
                      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                        fHasVariants ? "bg-emerald-600" : "bg-muted-foreground/40"
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                          fHasVariants ? "translate-x-5" : "translate-x-0"
                        }`}
                      />
                    </button>
                    <span className="font-bold text-xs text-foreground">
                      Este producto tiene variaciones
                    </span>
                  </label>

                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setShowVariantTypesMenu(!showVariantTypesMenu)}
                      className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition cursor-pointer font-medium"
                    >
                      <SlidersHorizontal className="h-3.5 w-3.5" />
                      <span>Tipos de Variaciones</span>
                    </button>

                    {/* Menú para añadir tipo de variación */}
                    {showVariantTypesMenu && (
                      <div className="absolute right-0 top-full mt-1.5 w-44 rounded-xl border border-border bg-surface p-1.5 shadow-xl z-20 space-y-0.5 animate-in fade-in">
                        <p className="px-2 py-1 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                          Añadir variación
                        </p>
                        {["Color", "Talla", "Material", "Capacidad"].map((t) => (
                          <button
                            key={t}
                            type="button"
                            onClick={() => handleAddVariantType(t)}
                            className="w-full text-left px-2 py-1.5 text-xs rounded-lg hover:bg-muted text-foreground transition cursor-pointer flex items-center justify-between"
                          >
                            <span>{t}</span>
                            <Plus className="h-3 w-3 text-muted-foreground" />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {fHasVariants && (
                  <div className="space-y-3 pt-1 animate-in fade-in">
                    {fVariantTypes.map((vType) => (
                      <div
                        key={vType.id}
                        className="rounded-xl border border-border bg-surface-2/90 p-3.5 space-y-2.5"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-xs text-foreground">{vType.name}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveVariantType(vType.id)}
                            className="p-1 text-muted-foreground hover:text-rose-500 rounded transition cursor-pointer"
                            title="Eliminar variación"
                          >
                            <X className="h-3.5 w-3.5" />
                          </button>
                        </div>

                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            value={newVariantInput[vType.id] || ""}
                            onChange={(e) =>
                              setNewVariantInput((prev) => ({ ...prev, [vType.id]: e.target.value }))
                            }
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                e.preventDefault();
                                handleAddOptionToVariant(vType.id);
                              }
                            }}
                            placeholder={`Agregar ${vType.name.toLowerCase()} (ej: Rojo, Azul)`}
                            className="flex-1 h-9 rounded-lg border border-border bg-background px-3 text-xs outline-none focus:border-primary"
                          />
                          <button
                            type="button"
                            onClick={() => handleAddOptionToVariant(vType.id)}
                            className="h-9 w-9 rounded-lg border border-border bg-background flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition cursor-pointer"
                            title="Añadir opción"
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>

                        {/* Opciones añadidas como badges */}
                        {vType.options.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 pt-1">
                            {vType.options.map((opt) => (
                              <span
                                key={opt}
                                className="inline-flex items-center gap-1.5 rounded-md border border-border bg-background px-2.5 py-1 text-xs font-medium text-foreground"
                              >
                                <span>{opt}</span>
                                <button
                                  type="button"
                                  onClick={() => handleRemoveOptionFromVariant(vType.id, opt)}
                                  className="text-muted-foreground hover:text-rose-500 cursor-pointer"
                                >
                                  <X className="h-3 w-3" />
                                </button>
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}

                    <p className="text-[11px] text-muted-foreground">
                      Todos los tipos de variaciones están en uso
                    </p>
                  </div>
                )}
              </div>

              {/* 9. SECCIÓN: OFERTAS POR CANTIDAD (Exacto a la imagen) */}
              <div className="rounded-xl border border-dashed border-border bg-surface-2/40 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Tag className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                    <span className="font-bold text-xs text-foreground">Ofertas por Cantidad</span>
                  </div>

                  <button
                    type="button"
                    onClick={handleAddQuantityOffer}
                    className="inline-flex items-center gap-1 rounded-lg border border-border bg-surface px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-muted transition cursor-pointer"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    <span>Agregar</span>
                  </button>
                </div>

                <p className="text-[11px] text-muted-foreground">
                  Configura precios especiales cuando el cliente compra múltiples unidades
                </p>

                {fQuantityOffers.length === 0 ? (
                  <div className="py-5 text-center text-xs text-muted-foreground">
                    Sin ofertas por cantidad. Agrega una para ofrecer descuentos por volumen.
                  </div>
                ) : (
                  <div className="space-y-2 pt-1 animate-in fade-in">
                    {fQuantityOffers.map((offer) => (
                      <div
                        key={offer.id}
                        className="rounded-lg border border-border bg-background p-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-xs">
                            {offer.quantity}x
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-xs text-foreground">
                                Lleva {offer.quantity} unidades por {soles(offer.price)}
                              </span>
                              {offer.label && (
                                <span className="rounded bg-primary/10 text-primary px-1.5 py-0.2 text-[9px] font-bold">
                                  {offer.label}
                                </span>
                              )}
                            </div>
                            {offer.savings ? (
                              <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">
                                Ahorro del cliente: {soles(offer.savings)}
                              </p>
                            ) : null}
                          </div>
                        </div>

                        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                          <div className="flex items-center gap-1">
                            <span className="text-[11px] text-muted-foreground">S/</span>
                            <input
                              type="number"
                              min={1}
                              value={offer.price}
                              onChange={(e) => handleUpdateOfferPrice(offer.id, Number(e.target.value))}
                              className="w-20 h-7 rounded border border-border bg-surface px-2 text-xs font-semibold outline-none focus:border-primary text-right"
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemoveQuantityOffer(offer.id)}
                            className="p-1 text-muted-foreground hover:text-rose-500 rounded transition cursor-pointer"
                            title="Eliminar oferta"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Footer del Modal (Exacto al diseño: Cancelar oscuro + Botón Verde menta Crear Producto) */}
            <div className="border-t border-border p-4 bg-muted/10 flex justify-end gap-3 items-center">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="rounded-lg border border-border bg-surface px-4 py-2 text-xs font-semibold text-foreground hover:bg-muted transition cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleSaveProduct}
                className="rounded-lg bg-[#10b981] hover:bg-[#059669] px-5 py-2 text-xs font-bold text-slate-950 transition shadow-sm cursor-pointer"
              >
                {editingProduct ? "Guardar Cambios" : "Crear Producto"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL SECUNDARIO: IMPORTAR CATÁLOGO CSV / EXCEL                           */}
      {/* ========================================================================= */}
      {isImportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="relative w-full max-w-md rounded-2xl border border-border bg-surface shadow-xl p-5 space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2">
                <FileSpreadsheet className="h-5 w-5 text-primary" />
                <h3 className="text-sm font-bold text-foreground">Importar Catálogo de Productos</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsImportModalOpen(false)}
                className="rounded-lg p-1 text-muted-foreground hover:bg-muted transition cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <p className="text-muted-foreground">
              Puedes cargar un archivo CSV o Excel exportado desde Shopify, WooCommerce o tu ERP para sincronizar productos en lote.
            </p>

            {/* Zona de Drop */}
            <div className="rounded-xl border border-dashed border-border bg-surface-2/60 p-6 text-center space-y-2">
              <Upload className="mx-auto h-8 w-8 text-muted-foreground" />
              <div>
                <p className="font-semibold text-foreground">Haz clic para seleccionar o arrastra tu archivo</p>
                <p className="text-[11px] text-muted-foreground">Archivos soportados: .CSV, .XLSX (hasta 10MB)</p>
              </div>
            </div>

            <div className="rounded-lg border border-border bg-muted/20 p-2.5 space-y-1">
              <p className="font-medium text-foreground text-[11px]">Columnas reconocidas automáticamente:</p>
              <p className="text-[10px] text-muted-foreground">
                Nombre, SKU, Categoría, Precio, Costo, Stock, Proveedor, Link_Web
              </p>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-border">
              <button
                type="button"
                onClick={handleSimulateCsvImport}
                className="rounded-lg border border-border bg-surface px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted transition cursor-pointer"
              >
                Cargar lote de prueba (2 ítems)
              </button>

              <button
                type="button"
                onClick={() => setIsImportModalOpen(false)}
                className="rounded-lg px-3 py-1.5 text-xs font-medium text-muted-foreground hover:bg-muted transition cursor-pointer"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </AppShell>
  );
}
