import { useState, useMemo } from "react";
import {
  users as initialUsers,
  type User,
  type UserRole,
  type UserStatus,
  type CRMModule,
  type AccessType,
} from "@/lib/mock-data";
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  X,
  CheckCircle2,
  Shield,
  Briefcase,
  Truck,
  Activity,
  Clock,
  Check,
  Sparkles,
  ShieldCheck,
  MessagesSquare,
  LayoutDashboard,
  ShoppingBag,
  ReceiptText,
  Users as UsersIcon,
  Workflow,
  FileText,
  Plug,
  Settings,
  Package,
} from "lucide-react";

const ROLE_ICONS: Record<UserRole, any> = {
  Administrador: Shield,
  Ventas: Briefcase,
  Logística: Truck,
  "Soporte / Asesor": MessagesSquare,
};

const ROLE_COLORS: Record<UserRole, string> = {
  Administrador: "text-indigo-500 bg-indigo-500/10 border-indigo-500/20",
  Ventas: "text-blue-500 bg-blue-500/10 border-blue-500/20",
  Logística: "text-orange-500 bg-orange-500/10 border-orange-500/20",
  "Soporte / Asesor": "text-purple-500 bg-purple-500/10 border-purple-500/20",
};

const CRM_MODULES_LIST: { id: CRMModule; label: string; icon: any; color: string }[] = [
  { id: "dashboard", label: "Dashboard principal", icon: LayoutDashboard, color: "text-indigo-500" },
  { id: "pedidos", label: "Gestión de Pedidos", icon: ShoppingBag, color: "text-blue-500" },
  { id: "confirmados", label: "Pedidos Confirmados", icon: Truck, color: "text-emerald-500" },
  { id: "productos", label: "Catálogo de Productos", icon: Package, color: "text-violet-500" },
  { id: "conversaciones", label: "Inbox Conversaciones", icon: MessagesSquare, color: "text-purple-500" },
  { id: "pagos", label: "Pagos por verificar", icon: ReceiptText, color: "text-amber-500" },
  { id: "clientes", label: "Directorio Clientes", icon: UsersIcon, color: "text-teal-500" },
  { id: "workflows", label: "Workflows & Bots", icon: Workflow, color: "text-pink-500" },
  { id: "plantillas", label: "Plantillas WhatsApp", icon: FileText, color: "text-sky-500" },
  { id: "integraciones", label: "Integraciones API", icon: Plug, color: "text-orange-500" },
  { id: "configuracion", label: "Configuración Tienda", icon: Settings, color: "text-gray-400" },
  { id: "equipo", label: "Equipo y Permisos", icon: ShieldCheck, color: "text-rose-500" },
];

const FUNCTION_PRESETS = [
  "Confirmación de pedidos COD por WhatsApp",
  "Verificación de pagos Yape / Plin",
  "Despachos y generación de guías Shalom",
  "Atención de incidencias y soporte al cliente",
  "Gestión de campañas de Rompe-Vistos",
];

export function EquipoSection() {
  const [userList, setUserList] = useState<User[]>(initialUsers);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRoleFilter, setSelectedRoleFilter] = useState<UserRole | "Todos">("Todos");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  // Form State
  const [fName, setFName] = useState("");
  const [fEmail, setFEmail] = useState("");
  const [fRole, setFRole] = useState<UserRole>("Ventas");
  const [fFunctions, setFFunctions] = useState("");
  const [fStatus, setFStatus] = useState<UserStatus>("Activo");
  const [fAccessModules, setFAccessModules] = useState<CRMModule[]>([]);
  const [fAccessType, setFAccessType] = useState<AccessType>("Indefinido");
  const [fTempPreset, setFTempPreset] = useState<string>("7 días");
  const [fCustomExpiryDate, setFCustomExpiryDate] = useState<string>("");

  // Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const filteredUsers = useMemo(() => {
    return userList.filter((u) => {
      const matchRole = selectedRoleFilter === "Todos" || u.role === selectedRoleFilter;
      const matchSearch =
        searchQuery === "" ||
        u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (u.functions && u.functions.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchRole && matchSearch;
    });
  }, [userList, searchQuery, selectedRoleFilter]);

  const activeCount = userList.filter((u) => u.status === "Activo").length;
  const tempCount = userList.filter((u) => u.accessType === "Temporal").length;
  const adminCount = userList.filter((u) => u.role === "Administrador").length;
  const salesCount = userList.filter((u) => u.role === "Ventas" || u.role === "Soporte / Asesor").length;

  const handleOpenCreate = () => {
    setEditingUser(null);
    setFName("");
    setFEmail("");
    setFRole("Ventas");
    setFFunctions("Confirmación de pedidos COD por WhatsApp y atención al cliente");
    setFStatus("Activo");
    setFAccessModules(["dashboard", "pedidos", "confirmados", "conversaciones", "pagos", "clientes"]);
    setFAccessType("Indefinido");
    setFTempPreset("7 días");
    setFCustomExpiryDate("");
    setIsModalOpen(true);
  };

  const handleOpenEdit = (user: User) => {
    setEditingUser(user);
    setFName(user.name);
    setFEmail(user.email);
    setFRole(user.role);
    setFFunctions(user.functions || "");
    setFStatus(user.status);
    setFAccessModules(
      user.accessModules && user.accessModules.length > 0
        ? user.accessModules
        : ["dashboard", "pedidos", "conversaciones"]
    );
    setFAccessType(user.accessType || "Indefinido");
    setFTempPreset(user.temporaryDuration || "30 días");
    setFCustomExpiryDate("");
    setIsModalOpen(true);
  };

  const handleToggleModule = (modId: CRMModule) => {
    if (fRole === "Administrador") return;
    setFAccessModules((prev) =>
      prev.includes(modId) ? prev.filter((m) => m !== modId) : [...prev, modId]
    );
  };

  const handleSelectAllModules = (select: boolean) => {
    if (select) {
      setFAccessModules(CRM_MODULES_LIST.map((m) => m.id));
    } else {
      setFAccessModules([]);
    }
  };

  const handleRoleChange = (newRole: UserRole) => {
    setFRole(newRole);
    if (newRole === "Administrador") {
      setFAccessModules(CRM_MODULES_LIST.map((m) => m.id));
    } else if (newRole === "Ventas") {
      setFAccessModules(["dashboard", "pedidos", "confirmados", "conversaciones", "pagos", "clientes"]);
    } else if (newRole === "Logística") {
      setFAccessModules(["pedidos", "confirmados"]);
    } else if (newRole === "Soporte / Asesor") {
      setFAccessModules(["conversaciones", "plantillas", "clientes"]);
    }
  };

  const handleSaveUser = () => {
    if (!fName.trim() || !fEmail.trim()) {
      showToast("⚠️ Por favor ingresa el nombre y correo del usuario");
      return;
    }

    let calcDuration: string | undefined = fAccessType === "Temporal" ? fTempPreset : undefined;
    let calcExpiryDate: string | undefined = undefined;

    if (fAccessType === "Temporal") {
      if (fTempPreset === "24 horas") calcExpiryDate = "Mañana a las 23:59";
      else if (fTempPreset === "7 días") calcExpiryDate = "En 7 días (Próximo Sábado)";
      else if (fTempPreset === "15 días") calcExpiryDate = "En 15 días";
      else if (fTempPreset === "30 días") calcExpiryDate = "En 30 días (Fin de mes)";
      else if (fTempPreset === "Personalizado" && fCustomExpiryDate) {
        calcExpiryDate = `Hasta el ${fCustomExpiryDate}`;
        calcDuration = `Hasta ${fCustomExpiryDate}`;
      } else {
        calcExpiryDate = "En 7 días";
      }
    }

    const finalModules =
      fRole === "Administrador" ? CRM_MODULES_LIST.map((m) => m.id) : fAccessModules;

    if (editingUser) {
      setUserList((prev) =>
        prev.map((u) =>
          u.id === editingUser.id
            ? {
                ...u,
                name: fName,
                email: fEmail,
                role: fRole,
                status: fStatus,
                functions: fFunctions,
                accessModules: finalModules,
                accessType: fAccessType,
                temporaryDuration: calcDuration,
                expiresAt: calcExpiryDate,
              }
            : u
        )
      );
      showToast("✨ Usuario y permisos actualizados correctamente");
    } else {
      const newUser: User = {
        id: `usr_${Date.now()}`,
        name: fName,
        email: fEmail,
        role: fRole,
        status: fStatus,
        lastActive: "Invitación enviada",
        avatar: fName.substring(0, 2).toUpperCase(),
        permissions: fRole === "Administrador" ? ["all"] : ["view_orders"],
        functions: fFunctions || "Atención general de pedidos",
        accessModules: finalModules,
        accessType: fAccessType,
        temporaryDuration: calcDuration,
        expiresAt: calcExpiryDate,
      };
      setUserList((prev) => [newUser, ...prev]);
      showToast("🚀 ¡Invitación enviada exitosamente por correo y WhatsApp!");
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    setUserList((prev) => prev.filter((u) => u.id !== id));
    showToast("Usuario eliminado del equipo");
  };

  return (
    <div className="space-y-6">
      {/* TOAST DE NOTIFICACIÓN */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 rounded-2xl border border-emerald-500/30 bg-emerald-500/15 backdrop-blur-md px-4 py-2.5 text-xs font-bold text-emerald-500 shadow-xl flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="h-4 w-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* KPI CARDS RESUMEN */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="rounded-2xl border border-border bg-surface p-4 shadow-2xs space-y-1">
          <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block">
            Usuarios Activos
          </span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black text-foreground">{activeCount}</span>
            <Activity className="h-4 w-4 text-emerald-500" />
          </div>
          <p className="text-[10px] text-muted-foreground">En el equipo de trabajo</p>
        </div>

        <div className="rounded-2xl border border-amber-500/30 bg-amber-500/5 p-4 shadow-2xs space-y-1">
          <span className="text-[11px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider block">
            ⏳ Accesos Temporales
          </span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black text-amber-600 dark:text-amber-400">{tempCount}</span>
            <Clock className="h-4 w-4 text-amber-500" />
          </div>
          <p className="text-[10px] text-muted-foreground">Vigencia con caducidad</p>
        </div>

        <div className="rounded-2xl border border-indigo-500/30 bg-indigo-500/5 p-4 shadow-2xs space-y-1">
          <span className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider block">
            🛡️ Administradores
          </span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black text-indigo-600 dark:text-indigo-400">{adminCount}</span>
            <Shield className="h-4 w-4 text-indigo-500" />
          </div>
          <p className="text-[10px] text-muted-foreground">Acceso total al CRM</p>
        </div>

        <div className="rounded-2xl border border-border bg-surface p-4 shadow-2xs space-y-1">
          <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block">
            Ventas & Soporte
          </span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black text-foreground">{salesCount}</span>
            <Briefcase className="h-4 w-4 text-blue-500" />
          </div>
          <p className="text-[10px] text-muted-foreground">Atención y seguimiento</p>
        </div>
      </div>

      {/* CONTROLES: BÚSQUEDA Y BOTÓN DE INVITACIÓN */}
      <div className="rounded-2xl border border-border bg-surface-2 p-3 sm:p-4 flex flex-col sm:flex-row gap-3 justify-between items-center shadow-xs">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Buscar por nombre, correo o función asignada..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-9 rounded-xl border border-border bg-surface pl-9 pr-3 text-xs text-foreground outline-none focus:border-primary"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          {["Todos", "Administrador", "Ventas", "Logística", "Soporte / Asesor"].map((role) => (
            <button
              key={role}
              onClick={() => setSelectedRoleFilter(role as any)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                selectedRoleFilter === role
                  ? "bg-foreground text-background font-bold shadow-xs"
                  : "border border-border bg-surface text-muted-foreground hover:bg-muted"
              }`}
            >
              {role}
            </button>
          ))}
          <button
            type="button"
            onClick={handleOpenCreate}
            className="ml-auto sm:ml-2 inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-extrabold text-white hover:bg-emerald-500 transition shadow-md cursor-pointer whitespace-nowrap"
          >
            <Plus className="h-4 w-4" />
            <span>Invitar Usuario</span>
          </button>
        </div>
      </div>

      {/* LISTADO PRINCIPAL DE USUARIOS */}
      <div className="rounded-2xl border border-border bg-surface shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-foreground">
            <thead className="border-b border-border bg-muted/30 text-xs font-bold text-muted-foreground">
              <tr>
                <th className="px-5 py-4">Usuario & Correo</th>
                <th className="px-5 py-4">Rol & Funciones Asignadas</th>
                <th className="px-5 py-4">Módulos del CRM Permitidos</th>
                <th className="px-5 py-4">Vigencia del Acceso</th>
                <th className="px-5 py-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-5 py-10 text-center text-muted-foreground text-xs">
                    No se encontraron miembros en el equipo con los filtros especificados.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => {
                  const RoleIcon = ROLE_ICONS[user.role] || Shield;
                  const roleColor = ROLE_COLORS[user.role] || ROLE_COLORS.Ventas;
                  const modulesCount = user.accessModules?.length || 0;
                  const isAllModules = modulesCount >= CRM_MODULES_LIST.length;

                  return (
                    <tr key={user.id} className="hover:bg-muted/20 transition-colors">
                      {/* USUARIO Y CORREO */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-black text-primary border border-primary/20 shadow-2xs">
                            {user.avatar}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="font-extrabold text-[13px] text-foreground">{user.name}</p>
                              {user.status === "Activo" ? (
                                <span className="h-2 w-2 rounded-full bg-emerald-500" title="Cuenta Activa" />
                              ) : (
                                <span className="h-2 w-2 rounded-full bg-rose-500" title="Cuenta Inactiva" />
                              )}
                            </div>
                            <p className="text-[11px] text-muted-foreground">{user.email}</p>
                            <p className="text-[10px] text-muted-foreground/70 italic mt-0.5">
                              Conexión: {user.lastActive}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* ROL Y FUNCIONES ESPECÍFICAS */}
                      <td className="px-5 py-4 max-w-xs">
                        <div className="space-y-1.5">
                          <span
                            className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-0.5 text-[11px] font-bold ${roleColor}`}
                          >
                            <RoleIcon className="h-3.5 w-3.5" />
                            {user.role}
                          </span>
                          {user.functions ? (
                            <p className="text-[11px] text-muted-foreground leading-snug line-clamp-2">
                              💬 {user.functions}
                            </p>
                          ) : (
                            <p className="text-[11px] text-muted-foreground/60 italic">Sin funciones detalladas</p>
                          )}
                        </div>
                      </td>

                      {/* MÓDULOS DEL CRM ACCESIBLES */}
                      <td className="px-5 py-4">
                        <div className="space-y-1">
                          {isAllModules ? (
                            <span className="inline-flex items-center gap-1 rounded-md bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                              <Sparkles className="h-3 w-3" /> Acceso Total (11 Módulos)
                            </span>
                          ) : user.accessModules && user.accessModules.length > 0 ? (
                            <div className="flex flex-wrap gap-1 max-w-xs">
                              {user.accessModules.slice(0, 3).map((mId) => {
                                const modInfo = CRM_MODULES_LIST.find((m) => m.id === mId);
                                return (
                                  <span
                                    key={mId}
                                    className="rounded border border-border bg-surface px-1.5 py-0.5 text-[10px] font-semibold text-foreground"
                                  >
                                    {modInfo?.label || mId}
                                  </span>
                                );
                              })}
                              {user.accessModules.length > 3 && (
                                <span className="rounded bg-muted px-1.5 py-0.5 text-[10px] font-bold text-muted-foreground">
                                  +{user.accessModules.length - 3} más
                                </span>
                              )}
                            </div>
                          ) : (
                            <span className="text-[11px] text-muted-foreground italic">Ningún módulo asignado</span>
                          )}
                        </div>
                      </td>

                      {/* TIPO DE ACCESO Y EXPIRACIÓN */}
                      <td className="px-5 py-4">
                        {user.accessType === "Temporal" ? (
                          <div className="space-y-0.5">
                            <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/15 border border-amber-500/30 px-2.5 py-0.5 text-[11px] font-bold text-amber-600 dark:text-amber-400">
                              <Clock className="h-3 w-3" /> Temporal ({user.temporaryDuration || "Vigente"})
                            </span>
                            {user.expiresAt && (
                              <p className="text-[10px] text-muted-foreground font-semibold px-1">
                                Vence: {user.expiresAt}
                              </p>
                            )}
                          </div>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                            ♾️ Indefinido
                          </span>
                        )}
                      </td>

                      {/* ACCIONES DE EDICIÓN Y ELIMINACIÓN */}
                      <td className="px-5 py-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            type="button"
                            onClick={() => handleOpenEdit(user)}
                            className="rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-sky-500 transition cursor-pointer"
                            title="Editar rol, módulos y caducidad"
                          >
                            <Edit2 className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(user.id)}
                            className="rounded-lg p-2 text-muted-foreground hover:bg-rose-500/10 hover:text-rose-500 transition cursor-pointer"
                            title="Eliminar del equipo"
                          >
                            <Trash2 className="h-4 w-4" />
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

      {/* MODAL DETALLADO Y COMPLETO PARA INVITAR Y CONFIGURAR USUARIOS */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="relative w-full max-w-2xl rounded-3xl border border-border bg-surface shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
            {/* CABECERA DEL MODAL */}
            <div className="flex items-center justify-between border-b border-border p-5 bg-surface-2">
              <div>
                <span className="rounded-md bg-emerald-500/15 text-emerald-500 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider">
                  Configurador de Miembro
                </span>
                <h3 className="text-lg font-extrabold text-foreground mt-0.5">
                  {editingUser ? `Editar Usuario: ${editingUser.name}` : "Invitar Nuevo Miembro al Equipo"}
                </h3>
                <p className="text-xs text-muted-foreground">
                  Asigna funciones específicas, limita las pestañas visibles del CRM y define el tiempo de vigencia del pase.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="rounded-lg p-2 text-muted-foreground hover:bg-muted transition cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* CUERPO DEL FORMULARIO CON SCROLL */}
            <div className="p-6 overflow-y-auto space-y-6">
              {/* SECCIÓN 1: NOMBRE Y CORREO */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-white text-[10px] font-bold">
                    1
                  </span>
                  <h4 className="text-xs font-bold text-foreground uppercase tracking-wider">
                    Datos del Colaborador
                  </h4>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-foreground">Nombre Completo *</label>
                    <input
                      type="text"
                      value={fName}
                      onChange={(e) => setFName(e.target.value)}
                      placeholder="Ej. Juan Manuel Pérez"
                      className="w-full h-9 rounded-xl border border-border bg-background px-3 text-xs outline-none focus:border-primary"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-foreground">Correo Electrónico *</label>
                    <input
                      type="email"
                      value={fEmail}
                      onChange={(e) => setFEmail(e.target.value)}
                      placeholder="juan@tiendaandina.pe"
                      className="w-full h-9 rounded-xl border border-border bg-background px-3 text-xs outline-none focus:border-primary"
                    />
                  </div>
                </div>
              </div>

              {/* SECCIÓN 2: ROL Y QUÉ FUNCIONES HARÁ */}
              <div className="space-y-3 pt-3 border-t border-border/60">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-white text-[10px] font-bold">
                      2
                    </span>
                    <h4 className="text-xs font-bold text-foreground uppercase tracking-wider">
                      Rol & Funciones que Desempeñará
                    </h4>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {(["Administrador", "Ventas", "Logística", "Soporte / Asesor"] as UserRole[]).map((r) => {
                    const RIcon = ROLE_ICONS[r];
                    const isSelected = fRole === r;

                    return (
                      <button
                        key={r}
                        type="button"
                        onClick={() => handleRoleChange(r)}
                        className={`flex flex-col p-3 rounded-2xl border text-left transition cursor-pointer ${
                          isSelected
                            ? "border-emerald-500 bg-emerald-500/10 shadow-xs"
                            : "border-border bg-background hover:bg-muted/50"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <RIcon className={`h-4 w-4 ${isSelected ? "text-emerald-500" : "text-muted-foreground"}`} />
                          {isSelected && <Check className="h-3.5 w-3.5 text-emerald-500" />}
                        </div>
                        <span className="text-xs font-extrabold text-foreground mt-2">{r}</span>
                      </button>
                    );
                  })}
                </div>

                {/* CAMPO TEXTAREA QUÉ FUNCIONES HARÁ */}
                <div className="space-y-2 pt-1">
                  <label className="text-xs font-bold text-foreground flex items-center justify-between">
                    <span>¿Qué funciones específicas realizará en su jornada?</span>
                    <span className="text-[10px] font-semibold text-muted-foreground">
                      Visibilidad interna para el equipo
                    </span>
                  </label>

                  <textarea
                    rows={2}
                    value={fFunctions}
                    onChange={(e) => setFFunctions(e.target.value)}
                    placeholder="Ej. Confirmará pedidos contraentrega por WhatsApp, registrará vouchers de Yape y gestionará las guías con la agencia Shalom..."
                    className="w-full rounded-xl border border-border bg-background p-3 text-xs leading-relaxed outline-none focus:border-primary"
                  />

                  {/* CHIPS DE PRESETS RÁPIDOS DE FUNCIONES */}
                  <div className="flex flex-wrap items-center gap-1.5 pt-1">
                    <span className="text-[10px] font-bold text-muted-foreground">Sugerencias rápidas:</span>
                    {FUNCTION_PRESETS.map((preset) => (
                      <button
                        key={preset}
                        type="button"
                        onClick={() => setFFunctions((prev) => (prev ? `${prev}. ${preset}` : preset))}
                        className="rounded-lg border border-border bg-surface px-2 py-0.5 text-[10px] font-semibold text-muted-foreground hover:bg-muted hover:text-foreground transition cursor-pointer"
                      >
                        + {preset}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* SECCIÓN 3: A QUÉ PARTE DEL CRM TENDRÁ ACCESO */}
              <div className="space-y-3 pt-3 border-t border-border/60">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-white text-[10px] font-bold">
                      3
                    </span>
                    <h4 className="text-xs font-bold text-foreground uppercase tracking-wider">
                      A qué Partes del CRM tendrá Acceso
                    </h4>
                  </div>

                  {fRole !== "Administrador" && (
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleSelectAllModules(true)}
                        className="text-[11px] font-bold text-emerald-500 hover:underline cursor-pointer"
                      >
                        Marcar todos
                      </button>
                      <span className="text-muted-foreground">·</span>
                      <button
                        type="button"
                        onClick={() => handleSelectAllModules(false)}
                        className="text-[11px] font-bold text-muted-foreground hover:underline cursor-pointer"
                      >
                        Desmarcar
                      </button>
                    </div>
                  )}
                </div>

                {fRole === "Administrador" ? (
                  <div className="rounded-2xl border border-indigo-500/30 bg-indigo-500/10 p-3.5 text-xs text-indigo-600 dark:text-indigo-300 flex items-center gap-2 font-semibold">
                    <ShieldCheck className="h-5 w-5 shrink-0" />
                    <span>
                      Como <strong>Administrador</strong>, este usuario tiene acceso total automático a todas las 11 partes y configuraciones del CRM.
                    </span>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {CRM_MODULES_LIST.map((mod) => {
                      const MIcon = mod.icon;
                      const isChecked = fAccessModules.includes(mod.id);

                      return (
                        <label
                          key={mod.id}
                          className={`flex items-center gap-2.5 p-2.5 rounded-xl border text-xs cursor-pointer transition ${
                            isChecked
                              ? "border-emerald-500/40 bg-emerald-500/10 font-bold text-foreground"
                              : "border-border bg-background text-muted-foreground hover:bg-muted/50"
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => handleToggleModule(mod.id)}
                            className="h-4 w-4 rounded border-border text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                          />
                          <MIcon className={`h-4 w-4 shrink-0 ${mod.color}`} />
                          <span className="truncate">{mod.label}</span>
                        </label>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* SECCIÓN 4: ACCESO TEMPORAL O INDEFINIDO & DURACIÓN */}
              <div className="space-y-3 pt-3 border-t border-border/60">
                <div className="flex items-center gap-2">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-white text-[10px] font-bold">
                    4
                  </span>
                  <h4 className="text-xs font-bold text-foreground uppercase tracking-wider">
                    Vigencia del Acceso (Temporal vs Indefinido)
                  </h4>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setFAccessType("Indefinido")}
                    className={`flex items-center gap-2.5 p-3 rounded-2xl border text-left transition cursor-pointer ${
                      fAccessType === "Indefinido"
                        ? "border-emerald-500 bg-emerald-500/10 text-foreground font-bold shadow-xs"
                        : "border-border bg-background text-muted-foreground hover:bg-muted/50"
                    }`}
                  >
                    <span className="text-lg">♾️</span>
                    <div>
                      <p className="text-xs font-extrabold">Acceso Indefinido</p>
                      <p className="text-[10px] text-muted-foreground">Permanente hasta revocación manual</p>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFAccessType("Temporal")}
                    className={`flex items-center gap-2.5 p-3 rounded-2xl border text-left transition cursor-pointer ${
                      fAccessType === "Temporal"
                        ? "border-amber-500 bg-amber-500/10 text-foreground font-bold shadow-xs"
                        : "border-border bg-background text-muted-foreground hover:bg-muted/50"
                    }`}
                  >
                    <span className="text-lg">⏳</span>
                    <div>
                      <p className="text-xs font-extrabold">Acceso Temporal</p>
                      <p className="text-[10px] text-muted-foreground">Expiración y bloqueo automático</p>
                    </div>
                  </button>
                </div>

                {fAccessType === "Temporal" && (
                  <div className="rounded-2xl border border-amber-500/30 bg-amber-500/5 p-4 space-y-3 animate-in fade-in">
                    <label className="text-xs font-bold text-amber-700 dark:text-amber-400 block">
                      ¿Cuánto tiempo durará el acceso de este usuario?
                    </label>

                    <div className="flex flex-wrap items-center gap-2">
                      {["24 horas", "7 días", "15 días", "30 días", "Personalizado"].map((dur) => (
                        <button
                          key={dur}
                          type="button"
                          onClick={() => setFTempPreset(dur)}
                          className={`rounded-xl px-3 py-1.5 text-xs font-bold transition cursor-pointer ${
                            fTempPreset === dur
                              ? "bg-amber-500 text-white shadow-sm"
                              : "border border-amber-500/30 bg-surface text-foreground hover:bg-amber-500/20"
                          }`}
                        >
                          {dur}
                        </button>
                      ))}
                    </div>

                    {fTempPreset === "Personalizado" && (
                      <div className="pt-2 space-y-1">
                        <label className="text-xs font-semibold text-foreground block">
                          Selecciona la Fecha Exacta de Expiración:
                        </label>
                        <input
                          type="date"
                          value={fCustomExpiryDate}
                          onChange={(e) => setFCustomExpiryDate(e.target.value)}
                          className="h-9 rounded-xl border border-border bg-background px-3 text-xs outline-none focus:border-amber-500 text-foreground"
                        />
                      </div>
                    )}

                    <div className="rounded-xl bg-amber-500/15 p-2.5 text-[11px] text-amber-700 dark:text-amber-300 font-medium flex items-center gap-2">
                      <Clock className="h-4 w-4 shrink-0 text-amber-500" />
                      <span>
                        Al llegar a la fecha límite, la sesión del usuario se cerrará automáticamente y perderá el ingreso al CRM hasta que sea renovado.
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* PIE DEL MODAL */}
            <div className="border-t border-border p-4 bg-surface-2 flex items-center justify-between">
              <div className="text-[11px] text-muted-foreground font-medium hidden sm:block">
                Se enviará una invitación a <strong>{fEmail || "correo especificado"}</strong>
              </div>

              <div className="flex items-center gap-2.5 ml-auto">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-xl px-4 py-2.5 text-xs font-bold text-muted-foreground hover:bg-muted transition cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleSaveUser}
                  className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-xs font-extrabold text-white hover:bg-emerald-500 transition shadow-md cursor-pointer"
                >
                  <Plus className="h-4 w-4" />
                  <span>{editingUser ? "Guardar Cambios" : "Guardar e Invitar"}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
