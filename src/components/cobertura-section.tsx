import { useState, useMemo } from "react";
import {
  type DepartmentCoverage,
  type ShippingZoneType,
  type ShippingAgency,
  type ShippingPolicy,
  departmentsCoverage as initialCoverage,
  defaultShippingPolicy,
  soles,
} from "@/lib/mock-data";
import {
  Truck,
  MapPin,
  Search,
  CheckCircle2,
  X,
  Sliders,
  Sparkles,
  ShieldCheck,
  MessageSquare,
  Building2,
  Edit2,
  Plus,
  ChevronRight,
  ChevronDown,
  Clock,
  Calendar,
  AlertCircle,
  Check,
  Trash2,
  ToggleLeft,
  ToggleRight,
  Package,
  Save,
} from "lucide-react";

// ─────────────────────────────────────────────────────────────────────────────
// TIPOS LOCALES
// ─────────────────────────────────────────────────────────────────────────────
type DistrictEntry = { id: string; name: string; subzones?: string[] };
type DepartmentEntry = {
  id: string;
  name: string;
  districts: DistrictEntry[];
};

type CourierPricingType =
  | "cliente_paga_agencia"
  | "gratis_todos"
  | "gratis_desde_monto"
  | "monto_fijo";

type CourierConfig = {
  name: string;
  pricingType: CourierPricingType;
  fixedAmount: number;
  freeFromAmount: number;
  advanceAmount: number;
  advanceCurrency: "S/" | "USD";
  allowAgencyChange: boolean;
};

type DayKey = "Lu" | "Ma" | "Mi" | "Ju" | "Vi" | "Sa" | "Do";
const ALL_DAYS: DayKey[] = ["Lu", "Ma", "Mi", "Ju", "Vi", "Sa", "Do"];

type ZoneSchedule = {
  zoneId: string;
  zoneName: string;
  cutoffHour: string;
  deliveryFrom: string;
  deliveryTo: string;
  deliveryDays: DayKey[];
  transitDays: number;
  advance: number;
  shippingCost: number;
};

type Holiday = { id: string; name: string; date: string };

// ─────────────────────────────────────────────────────────────────────────────
// DATOS MOCK – Distritos Lima con sub-zonas detalladas
// ─────────────────────────────────────────────────────────────────────────────
const PERU_DEPARTMENTS: DepartmentEntry[] = [
  {
    id: "lima",
    name: "Lima",
    districts: [
      { id: "ancon", name: "Ancón" },
      { id: "ate", name: "Ate", subzones: ["Sector Salamana", "Micaela Bastidas", "Huaycan Zona J, S y Z", "Huaycan - Santa Rosa"] },
      { id: "ate-santaanita", name: "Ate - Santa Anita" },
      { id: "barranco", name: "Barranco" },
      { id: "bellavista", name: "Bellavista" },
      { id: "brena", name: "Breña" },
      { id: "callao", name: "Callao", subzones: ["Marquez", "Carmen de la Legua", "Callao"] },
      { id: "carabayllo", name: "Carabayllo", subzones: ["Valle Sagrado", "Sol Naciente", "Las Begonias", "Las Orquídeas", "La Flor"] },
      { id: "chaclacayo", name: "Chaclacayo" },
      { id: "chorrillos", name: "Chorrillos", subzones: ["Las Garzas", "Villa Panamericana"] },
      { id: "cieneguilla", name: "Cieneguilla" },
      { id: "comas", name: "Comas", subzones: ["El Álamo", "Año Nuevo", "La Pascana"] },
      { id: "elAgustino", name: "El Agustino" },
      { id: "independencia", name: "Independencia", subzones: ["Ermitaño", "Tahuantinsuyo"] },
      { id: "jesusdemaria", name: "Jesús de María" },
      { id: "laflorida", name: "La Florida" },
      { id: "lamolina", name: "La Molina" },
      { id: "lavictoria", name: "La Victoria" },
      { id: "lima-centro", name: "Lima Centro" },
      { id: "lince", name: "Lince" },
      { id: "lospinnicos", name: "Los Olivos", subzones: ["Pro", "Naranjal", "El Trebol"] },
      { id: "lurigancho", name: "Lurigancho - Chosica", subzones: ["Huachipa", "Jicamarca"] },
      { id: "lurin", name: "Lurín" },
      { id: "magdalena", name: "Magdalena del Mar" },
      { id: "miraflores", name: "Miraflores" },
      { id: "pachacamac", name: "Pachacámac", subzones: ["Portada de Manchay", "José Gálvez"] },
      { id: "pucusana", name: "Pucusana" },
      { id: "puente-piedra", name: "Puente Piedra", subzones: ["Chillón", "Laderas del Norte"] },
      { id: "punta-hermosa", name: "Punta Hermosa" },
      { id: "punta-negra", name: "Punta Negra" },
      { id: "rimac", name: "Rímac" },
      { id: "san-bartolo", name: "San Bartolo" },
      { id: "san-borja", name: "San Borja" },
      { id: "san-isidro", name: "San Isidro" },
      { id: "san-juan-lurigancho", name: "San Juan de Lurigancho", subzones: ["Campoy", "Zárate", "Canto Grande", "Bayovar"] },
      { id: "san-juan-miraflores", name: "San Juan de Miraflores", subzones: ["Pamplona Alta", "Ciudad de Dios"] },
      { id: "san-luis", name: "San Luis" },
      { id: "san-martin-porres", name: "San Martín de Porres", subzones: ["Chuquitanta", "Palao", "Fiori"] },
      { id: "san-miguel", name: "San Miguel" },
      { id: "santa-anita", name: "Santa Anita", subzones: ["Las Brisas", "La Capitana"] },
      { id: "santa-maria-del-mar", name: "Santa María del Mar" },
      { id: "santa-rosa", name: "Santa Rosa" },
      { id: "santiago-de-surco", name: "Santiago de Surco" },
      { id: "surquillo", name: "Surquillo" },
      { id: "villa-el-salvador", name: "Villa El Salvador" },
      { id: "villa-maria-triunfo", name: "Villa María del Triunfo", subzones: ["Nueva Esperanza", "Tablada de Lurín", "Inca Manco Capac"] },
    ],
  },
  {
    id: "callao",
    name: "Callao",
    districts: [
      { id: "callao-c", name: "Callao" },
      { id: "bellavista-c", name: "Bellavista" },
      { id: "carmen-legua", name: "Carmen de la Legua" },
      { id: "la-perla", name: "La Perla" },
      { id: "la-punta", name: "La Punta" },
      { id: "ventanilla", name: "Ventanilla", subzones: ["Mi Perú", "Pachacútec"] },
    ],
  },
  {
    id: "arequipa",
    name: "Arequipa",
    districts: [
      { id: "arequipa-centro", name: "Arequipa Centro" },
      { id: "cerro-colorado", name: "Cerro Colorado" },
      { id: "yanahuara", name: "Yanahuara" },
      { id: "jose-luis", name: "José Luis Bustamante" },
      { id: "mariano-melgar", name: "Mariano Melgar" },
    ],
  },
  {
    id: "trujillo",
    name: "La Libertad",
    districts: [
      { id: "trujillo-centro", name: "Trujillo Centro" },
      { id: "victor-larco", name: "Víctor Larco Herrera" },
      { id: "el-porvenir", name: "El Porvenir" },
      { id: "florencia-mora", name: "Florencia de Mora" },
      { id: "huanchaco", name: "Huanchaco" },
    ],
  },
  {
    id: "piura",
    name: "Piura",
    districts: [
      { id: "piura-centro", name: "Piura Centro" },
      { id: "castilla", name: "Castilla" },
      { id: "sullana", name: "Sullana" },
    ],
  },
  {
    id: "chiclayo",
    name: "Lambayeque",
    districts: [
      { id: "chiclayo-centro", name: "Chiclayo Centro" },
      { id: "leonardo-ortiz", name: "Leonardo Ortiz" },
      { id: "jose-l-ortiz", name: "José L. Ortiz" },
      { id: "la-victoria-chic", name: "La Victoria" },
    ],
  },
  {
    id: "huancayo",
    name: "Junín",
    districts: [
      { id: "huancayo-centro", name: "Huancayo Centro" },
      { id: "el-tambo", name: "El Tambo" },
      { id: "chilca", name: "Chilca" },
    ],
  },
  {
    id: "cusco",
    name: "Cusco",
    districts: [
      { id: "cusco-centro", name: "Cusco Centro" },
      { id: "wanchaq", name: "Wanchaq" },
      { id: "san-sebastian-c", name: "San Sebastián" },
    ],
  },
  {
    id: "ica",
    name: "Ica",
    districts: [
      { id: "ica-centro", name: "Ica Centro" },
      { id: "chincha", name: "Chincha Alta" },
      { id: "pisco", name: "Pisco" },
    ],
  },
  {
    id: "ancash",
    name: "Áncash",
    districts: [
      { id: "chimbote", name: "Chimbote" },
      { id: "nuevo-chimbote", name: "Nuevo Chimbote" },
      { id: "huaraz", name: "Huaraz" },
    ],
  },
];

const DEFAULT_COURIERS: CourierConfig[] = [
  {
    name: "Shalom",
    pricingType: "cliente_paga_agencia",
    fixedAmount: 0,
    freeFromAmount: 150,
    advanceAmount: 25,
    advanceCurrency: "S/",
    allowAgencyChange: false,
  },
  {
    name: "Olva",
    pricingType: "cliente_paga_agencia",
    fixedAmount: 0,
    freeFromAmount: 200,
    advanceAmount: 30,
    advanceCurrency: "S/",
    allowAgencyChange: false,
  },
];

const DEFAULT_SCHEDULES: ZoneSchedule[] = [
  {
    zoneId: "all",
    zoneName: "Todas las zonas",
    cutoffHour: "14:00",
    deliveryFrom: "09:00",
    deliveryTo: "18:00",
    deliveryDays: ["Lu", "Ma", "Mi", "Ju", "Vi", "Sa"],
    transitDays: 1,
    advance: 0,
    shippingCost: 0,
  },
  {
    zoneId: "lima",
    zoneName: "Lima Metropolitana",
    cutoffHour: "14:00",
    deliveryFrom: "09:00",
    deliveryTo: "18:00",
    deliveryDays: ["Lu", "Ma", "Mi", "Ju", "Vi", "Sa"],
    transitDays: 1,
    advance: 0,
    shippingCost: 10,
  },
  {
    zoneId: "callao",
    zoneName: "Callao",
    cutoffHour: "13:00",
    deliveryFrom: "09:00",
    deliveryTo: "17:00",
    deliveryDays: ["Lu", "Ma", "Mi", "Ju", "Vi"],
    transitDays: 1,
    advance: 0,
    shippingCost: 12,
  },
];

const SECTION_TABS = [
  { id: "zonas", label: "1. Zonas de Cobertura", icon: MapPin },
  { id: "couriers", label: "2. Agencias Courier", icon: Truck },
  { id: "precios", label: "3. Precios de Envío", icon: Package },
  { id: "horarios", label: "4. Horarios de Corte", icon: Clock },
] as const;
type SectionTab = (typeof SECTION_TABS)[number]["id"];

// ─────────────────────────────────────────────────────────────────────────────
// COMPONENTE PRINCIPAL
// ─────────────────────────────────────────────────────────────────────────────
export function CoberturaSection() {
  const [activeSection, setActiveSection] = useState<SectionTab>("zonas");

  // ── ESTADO SECCIÓN 1: Zonas ──────────────────────────────────────────────
  const [selectedDistricts, setSelectedDistricts] = useState<Set<string>>(() => {
    const s = new Set<string>();
    const lima = PERU_DEPARTMENTS.find((d) => d.id === "lima");
    if (lima) lima.districts.forEach((d) => s.add(d.id));
    const callao = PERU_DEPARTMENTS.find((d) => d.id === "callao");
    if (callao) callao.districts.forEach((d) => s.add(d.id));
    return s;
  });
  const [expandedDepts, setExpandedDepts] = useState<Set<string>>(new Set(["lima"]));
  const [zoneSearch, setZoneSearch] = useState("");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // ── ESTADO SECCIÓN 2: Couriers ───────────────────────────────────────────
  const [couriers, setCouriers] = useState<CourierConfig[]>(DEFAULT_COURIERS);
  const [newCourierInput, setNewCourierInput] = useState("");
  const [globalAllowAgencyChange, setGlobalAllowAgencyChange] = useState(false);

  // ── ESTADO SECCIÓN 3: Precios ────────────────────────────────────────────
  const [activeCourierTab, setActiveCourierTab] = useState(0);

  // ── ESTADO SECCIÓN 4: Horarios ────────────────────────────────────────────
  const [scheduleMode, setScheduleMode] = useState<"motorizado" | "agencia">("motorizado");
  const [schedules, setSchedules] = useState<ZoneSchedule[]>(DEFAULT_SCHEDULES);
  const [holidays, setHolidays] = useState<Holiday[]>([]);
  const [newHolidayName, setNewHolidayName] = useState("");
  const [newHolidayDate, setNewHolidayDate] = useState("");
  const [showAddHoliday, setShowAddHoliday] = useState(false);

  // ── HELPERS ──────────────────────────────────────────────────────────────
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Calcular zonas seleccionadas por dept
  const selectedCountByDept = useMemo(() => {
    const map: Record<string, number> = {};
    PERU_DEPARTMENTS.forEach((dept) => {
      map[dept.id] = dept.districts.filter((d) => selectedDistricts.has(d.id)).length;
    });
    return map;
  }, [selectedDistricts]);

  const totalSelected = selectedDistricts.size;
  const totalDepts = PERU_DEPARTMENTS.filter((d) => (selectedCountByDept[d.id] ?? 0) > 0).length;

  const filteredDepts = useMemo(() => {
    if (!zoneSearch) return PERU_DEPARTMENTS;
    const q = zoneSearch.toLowerCase();
    return PERU_DEPARTMENTS.filter(
      (d) =>
        d.name.toLowerCase().includes(q) ||
        d.districts.some((di) => di.name.toLowerCase().includes(q))
    );
  }, [zoneSearch]);

  const toggleDeptAll = (deptId: string) => {
    const dept = PERU_DEPARTMENTS.find((d) => d.id === deptId);
    if (!dept) return;
    const allSelected = dept.districts.every((d) => selectedDistricts.has(d.id));
    setSelectedDistricts((prev) => {
      const next = new Set(prev);
      dept.districts.forEach((d) => {
        allSelected ? next.delete(d.id) : next.add(d.id);
      });
      return next;
    });
  };

  const toggleDistrict = (districtId: string) => {
    setSelectedDistricts((prev) => {
      const next = new Set(prev);
      next.has(districtId) ? next.delete(districtId) : next.add(districtId);
      return next;
    });
  };

  const selectAll = () => {
    const s = new Set<string>();
    PERU_DEPARTMENTS.forEach((dept) => dept.districts.forEach((d) => s.add(d.id)));
    setSelectedDistricts(s);
  };

  const deselectAll = () => setSelectedDistricts(new Set());

  const addCourier = () => {
    const name = newCourierInput.trim();
    if (!name || couriers.some((c) => c.name.toLowerCase() === name.toLowerCase())) {
      showToast("Nombre de courier inválido o ya existe");
      return;
    }
    setCouriers((prev) => [
      ...prev,
      {
        name,
        pricingType: "cliente_paga_agencia",
        fixedAmount: 0,
        freeFromAmount: 150,
        advanceAmount: 20,
        advanceCurrency: "S/",
        allowAgencyChange: false,
      },
    ]);
    setNewCourierInput("");
    showToast(`Courier "${name}" añadido`);
  };

  const removeCourier = (name: string) => {
    setCouriers((prev) => prev.filter((c) => c.name !== name));
    if (activeCourierTab >= couriers.length - 1) setActiveCourierTab(0);
    showToast(`Courier "${name}" eliminado`);
  };

  const updateCourier = (name: string, patch: Partial<CourierConfig>) => {
    setCouriers((prev) => prev.map((c) => (c.name === name ? { ...c, ...patch } : c)));
  };

  const toggleScheduleDay = (zoneId: string, day: DayKey) => {
    setSchedules((prev) =>
      prev.map((s) => {
        if (s.zoneId !== zoneId) return s;
        const has = s.deliveryDays.includes(day);
        return {
          ...s,
          deliveryDays: has ? s.deliveryDays.filter((d) => d !== day) : [...s.deliveryDays, day],
        };
      })
    );
  };

  const updateSchedule = (zoneId: string, patch: Partial<ZoneSchedule>) => {
    setSchedules((prev) => prev.map((s) => (s.zoneId === zoneId ? { ...s, ...patch } : s)));
  };

  const applyToAll = () => {
    const global = schedules.find((s) => s.zoneId === "all");
    if (!global) return;
    setSchedules((prev) =>
      prev.map((s) =>
        s.zoneId === "all"
          ? s
          : {
              ...s,
              cutoffHour: global.cutoffHour,
              deliveryFrom: global.deliveryFrom,
              deliveryTo: global.deliveryTo,
              deliveryDays: [...global.deliveryDays],
              transitDays: global.transitDays,
            }
      )
    );
    showToast("Horarios aplicados a todas las zonas");
  };

  const addHoliday = () => {
    if (!newHolidayName.trim() || !newHolidayDate) {
      showToast("Completa el nombre y fecha del feriado");
      return;
    }
    setHolidays((prev) => [
      ...prev,
      { id: `hol_${Date.now()}`, name: newHolidayName.trim(), date: newHolidayDate },
    ]);
    setNewHolidayName("");
    setNewHolidayDate("");
    setShowAddHoliday(false);
    showToast("Feriado registrado");
  };

  const handleSaveAll = () => {
    showToast("✓ Toda la configuración de cobertura guardada");
  };

  // ─────────────────────────────────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────────────────────────────────
  const activeCourier = couriers[activeCourierTab] ?? couriers[0];

  return (
    <div className="space-y-5 animate-in fade-in">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 rounded-xl border border-border bg-surface px-4 py-2.5 text-xs font-semibold text-foreground shadow-lg flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
          {toastMessage}
        </div>
      )}

      {/* HEADER */}
      <div className="border-b border-border pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-bold text-foreground">Configuración de Cobertura de Envíos</h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Configura zonas, agencias courier, precios de envío y horarios de corte para tu operación
          </p>
        </div>
        <button
          type="button"
          onClick={handleSaveAll}
          className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 px-4 py-2 text-xs font-bold text-white transition shadow-sm cursor-pointer"
        >
          <Save className="h-3.5 w-3.5" />
          Guardar toda la configuración
        </button>
      </div>

      {/* TABS DE SECCIÓN */}
      <div className="flex items-center gap-1 overflow-x-auto rounded-xl border border-border bg-muted/30 p-1">
        {SECTION_TABS.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveSection(tab.id)}
              className={`flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium whitespace-nowrap transition cursor-pointer flex-1 justify-center ${
                activeSection === tab.id
                  ? "bg-surface text-foreground font-semibold shadow-sm border border-border"
                  : "text-muted-foreground hover:text-foreground hover:bg-surface/60"
              }`}
            >
              <Icon className="h-3.5 w-3.5 shrink-0" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ════════════════════════════════════════════════════════════════════ */}
      {/* SECCIÓN 1: ZONAS DE COBERTURA                                      */}
      {/* ════════════════════════════════════════════════════════════════════ */}
      {activeSection === "zonas" && (
        <div className="space-y-4 animate-in fade-in">
          <div className="rounded-xl border border-border bg-surface p-4 space-y-4">
            <div className="flex items-center gap-2">
              <Truck className="h-4 w-4 text-primary" />
              <span className="text-sm font-bold text-foreground">
                Selecciona los departamentos y distritos donde{" "}
                <span className="text-emerald-600 dark:text-emerald-400">entregues con motorizado</span>
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Panel Izquierdo: Acordeón de Departamentos */}
              <div className="space-y-3">
                {/* Buscador */}
                <div className="relative">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <input
                    type="text"
                    value={zoneSearch}
                    onChange={(e) => setZoneSearch(e.target.value)}
                    placeholder="Buscar departamento o distrito..."
                    className="w-full h-9 rounded-lg border border-border bg-background pl-9 pr-3 text-xs outline-none focus:border-primary"
                  />
                </div>

                {/* Contador + Botones globales */}
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground font-medium">
                    <span className="text-foreground font-bold">{totalSelected}</span> zonas seleccionadas
                    {" · "}
                    <span className="text-foreground font-bold">{totalDepts}</span> departamento(s)
                  </span>
                  <div className="flex gap-1.5">
                    <button
                      type="button"
                      onClick={selectAll}
                      className="rounded-lg border border-border bg-surface px-2.5 py-1 text-xs font-semibold hover:bg-muted transition cursor-pointer"
                    >
                      Seleccionar todo
                    </button>
                    <button
                      type="button"
                      onClick={deselectAll}
                      className="rounded-lg border border-border bg-surface px-2.5 py-1 text-xs font-semibold hover:bg-muted transition cursor-pointer"
                    >
                      Deseleccionar todo
                    </button>
                  </div>
                </div>

                {/* Acordeón de Departamentos */}
                <div className="space-y-1 max-h-[440px] overflow-y-auto pr-1">
                  {filteredDepts.map((dept) => {
                    const count = selectedCountByDept[dept.id] ?? 0;
                    const total = dept.districts.length;
                    const allSelected = count === total && total > 0;
                    const partialSelected = count > 0 && count < total;
                    const isExpanded = expandedDepts.has(dept.id);

                    return (
                      <div key={dept.id} className="rounded-lg border border-border overflow-hidden">
                        {/* Cabecera del Departamento */}
                        <div className="flex items-center gap-2 px-3 py-2.5 bg-surface hover:bg-muted/50 transition">
                          {/* Toggle check */}
                          <button
                            type="button"
                            onClick={() => toggleDeptAll(dept.id)}
                            className={`h-5 w-5 rounded-full border-2 flex items-center justify-center shrink-0 transition cursor-pointer ${
                              allSelected
                                ? "bg-emerald-600 border-emerald-600"
                                : partialSelected
                                ? "bg-emerald-600/30 border-emerald-600"
                                : "border-border bg-background"
                            }`}
                          >
                            {(allSelected || partialSelected) && (
                              <Check className="h-3 w-3 text-white" strokeWidth={3} />
                            )}
                          </button>

                          {/* Expand button */}
                          <button
                            type="button"
                            onClick={() =>
                              setExpandedDepts((prev) => {
                                const next = new Set(prev);
                                next.has(dept.id) ? next.delete(dept.id) : next.add(dept.id);
                                return next;
                              })
                            }
                            className="flex items-center gap-2 flex-1 text-left cursor-pointer"
                          >
                            {isExpanded ? (
                              <ChevronDown className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                            ) : (
                              <ChevronRight className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                            )}
                            <MapPin className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                            <span className="text-xs font-semibold text-foreground">{dept.name}</span>
                            <span className="text-[11px] text-muted-foreground ml-1">
                              ({count}/{total} zonas)
                            </span>
                          </button>
                        </div>

                        {/* Distritos Expandibles */}
                        {isExpanded && (
                          <div className="border-t border-border bg-background/60 divide-y divide-border/40">
                            {dept.districts
                              .filter(
                                (d) =>
                                  !zoneSearch ||
                                  d.name.toLowerCase().includes(zoneSearch.toLowerCase())
                              )
                              .map((district) => {
                                const isSelected = selectedDistricts.has(district.id);
                                return (
                                  <div key={district.id}>
                                    <button
                                      type="button"
                                      onClick={() => toggleDistrict(district.id)}
                                      className="w-full flex items-center gap-2.5 px-5 py-2 hover:bg-muted/40 transition cursor-pointer text-left"
                                    >
                                      <div
                                        className={`h-4 w-4 rounded-full border-2 flex items-center justify-center shrink-0 transition ${
                                          isSelected
                                            ? "bg-emerald-600 border-emerald-600"
                                            : "border-border bg-background"
                                        }`}
                                      >
                                        {isSelected && (
                                          <Check className="h-2.5 w-2.5 text-white" strokeWidth={3} />
                                        )}
                                      </div>
                                      <span
                                        className={`text-xs ${
                                          isSelected ? "font-semibold text-foreground" : "text-muted-foreground"
                                        }`}
                                      >
                                        {district.name}
                                      </span>
                                      {district.subzones && (
                                        <span className="text-[10px] text-muted-foreground ml-auto">
                                          ({district.subzones.length}/{district.subzones.length})
                                        </span>
                                      )}
                                    </button>

                                    {/* Sub-zonas */}
                                    {isSelected && district.subzones && (
                                      <div className="pl-12 pb-1 space-y-0.5">
                                        {district.subzones.map((sz) => (
                                          <div
                                            key={sz}
                                            className="flex items-center gap-2 py-1 text-[11px] text-muted-foreground"
                                          >
                                            <Check className="h-3 w-3 text-emerald-600 dark:text-emerald-400 shrink-0" />
                                            {sz}
                                          </div>
                                        ))}
                                      </div>
                                    )}
                                  </div>
                                );
                              })}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Contador inferior */}
                <div className="rounded-lg bg-surface-2/60 border border-border px-3 py-2 text-xs text-muted-foreground font-medium">
                  {totalSelected} zonas en {totalDepts} departamento(s) seleccionado(s)
                </div>
              </div>

              {/* Panel Derecho: Mapa de cobertura de Lima */}
              <div className="space-y-2">
                <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                  Vista de Cobertura — Lima Metropolitana
                </p>
                <div className="rounded-xl overflow-hidden border border-border bg-muted/30 relative" style={{ height: 480 }}>
                  <iframe
                    title="Cobertura Lima PedidoFlow"
                    src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d242000!2d-76.9!3d-12.04!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1ses!2spe!4v1698000000000!5m2!1ses!2spe"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="opacity-90"
                  />
                  {/* Overlay badge */}
                  <div className="absolute top-3 left-3 rounded-lg border border-border bg-surface/95 px-2.5 py-1.5 text-[11px] font-semibold text-foreground shadow flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                    PedidoFlow — Cobertura Local Perú
                  </div>
                  <div className="absolute bottom-3 left-3 rounded-lg border border-border bg-surface/95 px-2.5 py-1.5 text-[11px] text-muted-foreground shadow">
                    <span className="font-bold text-foreground">{totalSelected}</span> zonas activas
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════════════════════════════ */}
      {/* SECCIÓN 2: AGENCIAS COURIER                                        */}
      {/* ════════════════════════════════════════════════════════════════════ */}
      {activeSection === "couriers" && (
        <div className="space-y-4 animate-in fade-in">
          <div className="rounded-xl border border-border bg-surface p-5 space-y-5">
            {/* Header */}
            <div className="flex items-center gap-2">
              <Truck className="h-4 w-4 text-primary" />
              <div>
                <h3 className="text-sm font-bold text-foreground">Escribe las couriers con las que trabajas</h3>
                <p className="text-[11px] text-muted-foreground">
                  Esto nos servirá para brindarte tu tasa de entrega real por courier
                </p>
              </div>
            </div>

            {/* Chips de couriers */}
            <div className="flex flex-wrap gap-2 items-center">
              {couriers.map((c) => (
                <span
                  key={c.name}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-surface-2 px-3 py-1.5 text-xs font-semibold text-foreground"
                >
                  {c.name}
                  <button
                    type="button"
                    onClick={() => removeCourier(c.name)}
                    className="text-muted-foreground hover:text-rose-500 cursor-pointer transition"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>

            {/* Input para añadir courier */}
            <div className="flex gap-2 items-center max-w-xs">
              <input
                type="text"
                value={newCourierInput}
                onChange={(e) => setNewCourierInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") addCourier(); }}
                placeholder="Nombre del courier"
                className="flex-1 h-9 rounded-lg border border-border bg-background px-3 text-xs outline-none focus:border-primary"
              />
              <button
                type="button"
                onClick={addCourier}
                className="inline-flex items-center gap-1 rounded-lg border border-border bg-surface-2 px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-muted transition cursor-pointer"
              >
                <Plus className="h-3.5 w-3.5" />
                Agregar
              </button>
            </div>

            {/* Toggle: Permitir cambio de agencia */}
            <div className="rounded-xl border border-border bg-surface-2/60 p-4 space-y-2">
              <div className="flex items-start gap-3">
                <button
                  type="button"
                  onClick={() => setGlobalAllowAgencyChange(!globalAllowAgencyChange)}
                  className="mt-0.5 shrink-0 cursor-pointer"
                >
                  {globalAllowAgencyChange ? (
                    <ToggleRight className="h-6 w-10 text-emerald-600 dark:text-emerald-400" />
                  ) : (
                    <ToggleLeft className="h-6 w-10 text-muted-foreground" />
                  )}
                </button>
                <div>
                  <p className="text-xs font-bold text-foreground">Permitir cambio de agencia de envío</p>
                  <p className="text-[11px] text-muted-foreground mt-1 leading-relaxed">
                    <strong>NOTA:</strong> Nuestro sistema asigna la agencia de Shalom por defecto cuando un cliente NO entra
                    en la cobertura contraentrega y tiene una agencia Shalom cerca a su ubicación, incluso si el cliente desea
                    que se le envíe por Olva u otra agencia.{" "}
                    <span className="text-primary">
                      Activa esta casilla si deseas que tu IA acepte que un cliente pueda cambiar de agencia de envío
                      (Shalom, Olva, Marvisur, etc.) según su voluntad.
                    </span>
                  </p>
                </div>
              </div>
            </div>

            {/* Lista de couriers configurados */}
            {couriers.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                  Couriers registrados
                </h4>
                {couriers.map((c, i) => (
                  <div
                    key={c.name}
                    className="flex items-center justify-between rounded-lg border border-border bg-background px-3 py-2.5"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="h-7 w-7 rounded-md bg-primary/10 text-primary flex items-center justify-center font-bold text-[10px]">
                        {c.name.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-foreground">{c.name}</p>
                        <p className="text-[10px] text-muted-foreground">
                          Adelanto: {c.advanceCurrency} {c.advanceAmount}
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => { setActiveCourierTab(i); setActiveSection("precios"); }}
                      className="text-[11px] text-primary hover:underline font-semibold cursor-pointer"
                    >
                      Configurar precios →
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════════════════════════════ */}
      {/* SECCIÓN 3: PRECIOS DE ENVÍO POR COURIER                            */}
      {/* ════════════════════════════════════════════════════════════════════ */}
      {activeSection === "precios" && (
        <div className="space-y-4 animate-in fade-in">
          <div className="rounded-xl border border-border bg-surface p-5 space-y-5">
            <div className="flex items-center gap-2">
              <Package className="h-4 w-4 text-primary" />
              <div>
                <h3 className="text-sm font-bold text-foreground">Precios de Envío</h3>
                <p className="text-[11px] text-muted-foreground">Configura las opciones de envío para Lima y Provincias</p>
              </div>
            </div>

            {/* Tabs de Couriers */}
            {couriers.length > 0 ? (
              <>
                <div className="flex rounded-lg border border-border overflow-hidden">
                  {couriers.map((c, i) => (
                    <button
                      key={c.name}
                      type="button"
                      onClick={() => setActiveCourierTab(i)}
                      className={`flex-1 py-2 text-xs font-semibold transition cursor-pointer ${
                        activeCourierTab === i
                          ? "bg-foreground text-background"
                          : "bg-surface text-muted-foreground hover:bg-muted"
                      }`}
                    >
                      {c.name}
                    </button>
                  ))}
                </div>

                {activeCourier && (
                  <div className="space-y-5">
                    {/* Opciones de Precio */}
                    <div className="space-y-2">
                      {(
                        [
                          { value: "cliente_paga_agencia", label: "Envío lo paga el cliente al recibir y se calcula según la agencia" },
                          { value: "gratis_todos", label: `Envío Gratis todos los envíos por ${activeCourier.name}` },
                          { value: "gratis_desde_monto", label: "Envío gratis desde un monto mínimo" },
                          { value: "monto_fijo", label: "Cobro un monto fijo de envío" },
                        ] as { value: CourierPricingType; label: string }[]
                      ).map((opt) => (
                        <label
                          key={opt.value}
                          className="flex items-center gap-3 rounded-lg border border-border px-3 py-2.5 cursor-pointer hover:bg-muted/40 transition"
                        >
                          <div
                            className={`h-4 w-4 rounded-full border-2 flex items-center justify-center shrink-0 ${
                              activeCourier.pricingType === opt.value
                                ? "bg-emerald-600 border-emerald-600"
                                : "border-border bg-background"
                            }`}
                            onClick={() => updateCourier(activeCourier.name, { pricingType: opt.value })}
                          >
                            {activeCourier.pricingType === opt.value && (
                              <div className="h-1.5 w-1.5 rounded-full bg-white" />
                            )}
                          </div>
                          <span className="text-xs text-foreground">{opt.label}</span>
                          {opt.value === "gratis_desde_monto" && activeCourier.pricingType === "gratis_desde_monto" && (
                            <div className="flex items-center gap-1 ml-auto">
                              <span className="text-[11px] text-muted-foreground">Desde S/</span>
                              <input
                                type="number"
                                min={0}
                                value={activeCourier.freeFromAmount}
                                onChange={(e) => updateCourier(activeCourier.name, { freeFromAmount: Number(e.target.value) })}
                                className="w-16 h-7 rounded border border-border bg-background px-2 text-xs font-bold outline-none focus:border-primary text-right"
                              />
                            </div>
                          )}
                          {opt.value === "monto_fijo" && activeCourier.pricingType === "monto_fijo" && (
                            <div className="flex items-center gap-1 ml-auto">
                              <span className="text-[11px] text-muted-foreground">S/</span>
                              <input
                                type="number"
                                min={0}
                                value={activeCourier.fixedAmount}
                                onChange={(e) => updateCourier(activeCourier.name, { fixedAmount: Number(e.target.value) })}
                                className="w-16 h-7 rounded border border-border bg-background px-2 text-xs font-bold outline-none focus:border-primary text-right"
                              />
                            </div>
                          )}
                        </label>
                      ))}
                    </div>

                    {/* Sección de Adelanto */}
                    <div className="border-t border-border pt-4 flex items-center gap-4 flex-wrap">
                      <div className="flex items-center gap-2 text-sm font-bold text-primary">
                        <ShieldCheck className="h-4 w-4" />
                        ¿Cuánto cobras de adelanto para envíos por {activeCourier.name}?
                      </div>

                      <div className="flex items-center gap-2 ml-auto">
                        <input
                          type="number"
                          min={0}
                          value={activeCourier.advanceAmount}
                          onChange={(e) => updateCourier(activeCourier.name, { advanceAmount: Number(e.target.value) })}
                          className="w-20 h-9 rounded-lg border border-border bg-background px-3 text-sm font-bold outline-none focus:border-primary text-right"
                        />
                        <select
                          value={activeCourier.advanceCurrency}
                          onChange={(e) => updateCourier(activeCourier.name, { advanceCurrency: e.target.value as "S/" | "USD" })}
                          className="h-9 rounded-lg border border-border bg-background px-2 text-xs outline-none focus:border-primary cursor-pointer"
                        >
                          <option>S/</option>
                          <option>USD</option>
                        </select>
                      </div>

                      {/* Truck visual */}
                      <div className="flex h-10 w-16 items-center justify-center rounded-xl bg-rose-600/10 border border-rose-500/20 text-2xl">
                        🚚
                      </div>
                    </div>

                    {/* Adelanto condicional toggle */}
                    <label className="flex items-center gap-2.5 cursor-pointer pt-1">
                      <div
                        className={`h-4 w-4 rounded-full border-2 flex items-center justify-center shrink-0 cursor-pointer ${
                          false ? "bg-emerald-600 border-emerald-600" : "border-border bg-background"
                        }`}
                      >
                      </div>
                      <span className="text-xs text-muted-foreground">
                        Adelanto condicional (solo si el pedido supera cierto monto)
                      </span>
                    </label>

                    {/* Info box */}
                    <div className="rounded-xl border border-primary/20 bg-primary/5 p-3.5 flex items-start gap-2.5 text-[11px] text-muted-foreground leading-relaxed">
                      <AlertCircle className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                      <div>
                        <span className="font-semibold text-foreground">¿Por qué cobrar adelanto de flete?</span>
                        <br />
                        El adelanto de envío cubre el costo de la guía de remisión de {activeCourier.name} y reduce los rechazos. El cliente
                        paga el saldo restante de su producto al recoger el paquete en la agencia. Recomendado:{" "}
                        <span className="font-bold text-foreground">S/ 20 – S/ 30</span> para provincias.
                      </div>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="py-10 text-center text-xs text-muted-foreground">
                No tienes couriers configurados. Ve a la sección "Agencias Courier" y agrega las couriers con las que trabajas.
              </div>
            )}
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════════════════════════════ */}
      {/* SECCIÓN 4: HORARIOS DE CORTE Y DESPACHO                            */}
      {/* ════════════════════════════════════════════════════════════════════ */}
      {activeSection === "horarios" && (
        <div className="space-y-4 animate-in fade-in">
          <div className="rounded-xl border border-border bg-surface p-5 space-y-5">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-primary" />
              <div>
                <h3 className="text-sm font-bold text-foreground">Horarios de Corte y Despacho</h3>
                <p className="text-[11px] text-muted-foreground">Configura los horarios y días de corte para tus envíos</p>
              </div>
            </div>

            {/* Toggle Motorizado / Agencia */}
            <div className="flex rounded-lg border border-border overflow-hidden max-w-xs">
              <button
                type="button"
                onClick={() => setScheduleMode("motorizado")}
                className={`flex-1 py-2 text-xs font-semibold transition cursor-pointer ${
                  scheduleMode === "motorizado" ? "bg-foreground text-background" : "bg-surface text-muted-foreground hover:bg-muted"
                }`}
              >
                Con Motorizado
              </button>
              <button
                type="button"
                onClick={() => setScheduleMode("agencia")}
                className={`flex-1 py-2 text-xs font-semibold transition cursor-pointer ${
                  scheduleMode === "agencia" ? "bg-foreground text-background" : "bg-surface text-muted-foreground hover:bg-muted"
                }`}
              >
                Por Agencia
              </button>
            </div>

            {/* Descripción */}
            <div>
              <h4 className="text-xs font-bold text-foreground">
                Horarios de Corte y Tiempos de entrega por zona
              </h4>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                Configura la hora de corte y el tiempo de entrega para cada zona de cobertura
              </p>
            </div>

            {/* Tabla de Horarios */}
            <div className="overflow-x-auto rounded-xl border border-border">
              <table className="w-full text-xs text-foreground min-w-[700px]">
                <thead className="bg-muted/40 border-b border-border text-[11px] text-muted-foreground uppercase tracking-wider">
                  <tr>
                    <th className="px-3 py-2.5 text-left font-semibold">Zona</th>
                    <th className="px-3 py-2.5 text-center font-semibold">Hora de corte</th>
                    <th className="px-3 py-2.5 text-center font-semibold">Horario de entrega</th>
                    <th className="px-3 py-2.5 text-center font-semibold">T. entrega</th>
                    <th className="px-3 py-2.5 text-center font-semibold">Días despacho</th>
                    <th className="px-3 py-2.5 text-center font-semibold">Adelanto</th>
                    <th className="px-3 py-2.5 text-center font-semibold">Precio envío (S/)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {schedules.map((sch) => {
                    const isGlobal = sch.zoneId === "all";
                    const cutoff = sch.cutoffHour;
                    // Calcular ejemplo de mensaje para la primera zona no-global
                    const nextDelivery = sch.deliveryDays[0] ?? "Lu";
                    const exampleDay = nextDelivery === "Lu" ? "Lunes" : nextDelivery === "Ma" ? "Martes" : nextDelivery === "Mi" ? "Miércoles" : "Jueves";

                    return (
                      <tr key={sch.zoneId} className={`${isGlobal ? "bg-emerald-500/5" : "hover:bg-muted/20"} transition-colors`}>
                        {/* Zona */}
                        <td className="px-3 py-3">
                          <div className="flex items-center gap-2">
                            {isGlobal ? (
                              <div className="h-5 w-5 rounded-full bg-emerald-600 flex items-center justify-center">
                                <Check className="h-3 w-3 text-white" strokeWidth={3} />
                              </div>
                            ) : (
                              <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
                            )}
                            <div>
                              <p className={`font-semibold ${isGlobal ? "text-emerald-600 dark:text-emerald-400" : "text-foreground"}`}>
                                {sch.zoneName}
                              </p>
                              {isGlobal && (
                                <p className="text-[10px] text-muted-foreground">
                                  ({totalSelected} zonas)
                                  {" · "}
                                  <button type="button" onClick={applyToAll} className="text-primary hover:underline cursor-pointer font-semibold">
                                    Aplicar a todas
                                  </button>
                                </p>
                              )}
                            </div>
                          </div>
                        </td>

                        {/* Hora de corte */}
                        <td className="px-3 py-3 text-center">
                          <input
                            type="time"
                            value={sch.cutoffHour}
                            onChange={(e) => updateSchedule(sch.zoneId, { cutoffHour: e.target.value })}
                            className="h-8 w-24 rounded-lg border border-border bg-background px-2 text-xs text-center outline-none focus:border-primary"
                          />
                        </td>

                        {/* Horario de entrega */}
                        <td className="px-3 py-3 text-center">
                          <div className="flex items-center gap-1 justify-center">
                            <span className="text-[10px] text-muted-foreground">desde</span>
                            <input
                              type="time"
                              value={sch.deliveryFrom}
                              onChange={(e) => updateSchedule(sch.zoneId, { deliveryFrom: e.target.value })}
                              className="h-8 w-22 rounded-lg border border-border bg-background px-2 text-xs text-center outline-none focus:border-primary"
                            />
                            <span className="text-[10px] text-muted-foreground">hasta</span>
                            <input
                              type="time"
                              value={sch.deliveryTo}
                              onChange={(e) => updateSchedule(sch.zoneId, { deliveryTo: e.target.value })}
                              className="h-8 w-22 rounded-lg border border-border bg-background px-2 text-xs text-center outline-none focus:border-primary"
                            />
                          </div>
                        </td>

                        {/* Tiempo de entrega (días) */}
                        <td className="px-3 py-3 text-center">
                          <input
                            type="number"
                            min={1}
                            max={14}
                            value={sch.transitDays}
                            onChange={(e) => updateSchedule(sch.zoneId, { transitDays: Number(e.target.value) })}
                            className="h-8 w-14 rounded-lg border border-border bg-background px-2 text-xs text-center font-bold outline-none focus:border-primary"
                          />
                        </td>

                        {/* Días de despacho */}
                        <td className="px-3 py-3 text-center">
                          <div className="flex gap-0.5 justify-center">
                            {ALL_DAYS.map((day) => {
                              const active = sch.deliveryDays.includes(day);
                              return (
                                <button
                                  key={day}
                                  type="button"
                                  onClick={() => toggleScheduleDay(sch.zoneId, day)}
                                  className={`h-6 w-6 rounded text-[10px] font-bold transition cursor-pointer ${
                                    active
                                      ? "bg-emerald-600 text-white"
                                      : "bg-surface-2 text-muted-foreground hover:bg-muted"
                                  }`}
                                >
                                  {day.slice(0, 2)}
                                </button>
                              );
                            })}
                          </div>
                        </td>

                        {/* Adelanto */}
                        <td className="px-3 py-3 text-center">
                          <div className="flex items-center gap-1 justify-center">
                            <input
                              type="number"
                              min={0}
                              value={sch.advance}
                              onChange={(e) => updateSchedule(sch.zoneId, { advance: Number(e.target.value) })}
                              className="h-8 w-16 rounded-lg border border-border bg-background px-2 text-xs text-right font-bold outline-none focus:border-primary"
                            />
                            <span className="text-[10px] text-muted-foreground">S/</span>
                          </div>
                        </td>

                        {/* Precio envío */}
                        <td className="px-3 py-3 text-center">
                          <input
                            type="number"
                            min={0}
                            value={sch.shippingCost}
                            onChange={(e) => updateSchedule(sch.zoneId, { shippingCost: Number(e.target.value) })}
                            className="h-8 w-16 rounded-lg border border-border bg-background px-2 text-xs text-right font-bold outline-none focus:border-primary"
                          />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Info de ejemplo */}
            {schedules[1] && (
              <div className="rounded-lg border border-primary/20 bg-primary/5 px-3.5 py-2.5 text-[11px] text-muted-foreground flex items-center gap-2">
                <AlertCircle className="h-3.5 w-3.5 text-primary shrink-0" />
                Los pedidos realizados el {
                  schedules[1]?.deliveryDays[0] === "Lu" ? "Lunes" :
                  schedules[1]?.deliveryDays[0] === "Ma" ? "Martes" :
                  schedules[1]?.deliveryDays[0] === "Mi" ? "Miércoles" : "Jueves"
                } antes de las {schedules[1]?.cutoffHour} se entregarán el mismo día.
              </div>
            )}

            {/* FERIADOS */}
            <div className="border-t border-border pt-4 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-foreground flex items-center gap-2">
                    <Calendar className="h-3.5 w-3.5 text-primary" />
                    Días feriados sin repartos ni despachos
                  </h4>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    Ej. Navidad, Año Nuevo, Fiestas Patrias, vacaciones
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowAddHoliday(!showAddHoliday)}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-surface px-3 py-1.5 text-xs font-semibold hover:bg-muted transition cursor-pointer"
                >
                  <Plus className="h-3.5 w-3.5" />
                  Agregar feriado
                </button>
              </div>

              {showAddHoliday && (
                <div className="rounded-lg border border-border bg-surface-2/60 p-3 flex items-center gap-2 flex-wrap animate-in fade-in">
                  <input
                    type="text"
                    value={newHolidayName}
                    onChange={(e) => setNewHolidayName(e.target.value)}
                    placeholder="Nombre del feriado (ej. Navidad)"
                    className="flex-1 h-8.5 rounded-lg border border-border bg-background px-3 text-xs outline-none focus:border-primary min-w-48"
                  />
                  <input
                    type="date"
                    value={newHolidayDate}
                    onChange={(e) => setNewHolidayDate(e.target.value)}
                    className="h-8.5 rounded-lg border border-border bg-background px-3 text-xs outline-none focus:border-primary cursor-pointer"
                  />
                  <button
                    type="button"
                    onClick={addHoliday}
                    className="rounded-lg bg-primary px-3 py-1.5 text-xs font-bold text-primary-foreground hover:bg-primary/90 transition cursor-pointer"
                  >
                    Guardar
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddHoliday(false)}
                    className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground hover:bg-muted transition cursor-pointer"
                  >
                    Cancelar
                  </button>
                </div>
              )}

              {holidays.length === 0 ? (
                <p className="text-[11px] text-muted-foreground italic">No hay feriados configurados</p>
              ) : (
                <div className="space-y-1.5">
                  {holidays.map((h) => (
                    <div
                      key={h.id}
                      className="flex items-center justify-between rounded-lg border border-border bg-background px-3 py-2"
                    >
                      <div className="flex items-center gap-2.5">
                        <Calendar className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                        <span className="text-xs font-semibold text-foreground">{h.name}</span>
                        <span className="text-[11px] text-muted-foreground">{h.date}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setHolidays((prev) => prev.filter((x) => x.id !== h.id))}
                        className="text-muted-foreground hover:text-rose-500 transition cursor-pointer"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* CTA inferior */}
      <div className="flex justify-end pt-2">
        <button
          type="button"
          onClick={handleSaveAll}
          className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 px-5 py-2.5 text-xs font-bold text-white transition shadow-sm cursor-pointer"
        >
          <Save className="h-3.5 w-3.5" />
          Guardar toda la configuración
        </button>
      </div>
    </div>
  );
}
