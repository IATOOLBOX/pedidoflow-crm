import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { AppShell } from "@/components/app-shell";
import { users, type User, type UserRole, type UserStatus } from "@/lib/mock-data";
import {
  ShieldCheck,
  Plus,
  Search,
  MoreVertical,
  Edit2,
  Trash2,
  UserCheck,
  UserX,
  X,
  CheckCircle2,
  Shield,
  Briefcase,
  Truck,
  Activity,
} from "lucide-react";

export const Route = createFileRoute("/equipo")({
  head: () => ({
    meta: [
      { title: "Equipo y Roles — PedidoFlow" },
      { name: "description", content: "Gestión de usuarios, permisos y accesos para el equipo de trabajo." },
    ],
  }),
  component: EquipoPage,
});

const ROLE_ICONS: Record<UserRole, any> = {
  Administrador: Shield,
  Ventas: Briefcase,
  Logística: Truck,
};

const ROLE_COLORS: Record<UserRole, string> = {
  Administrador: "text-indigo-500 bg-indigo-500/10 border-indigo-500/20",
  Ventas: "text-blue-500 bg-blue-500/10 border-blue-500/20",
  Logística: "text-orange-500 bg-orange-500/10 border-orange-500/20",
};

const PERMISSION_OPTIONS = [
  { id: "view_orders", label: "Ver pedidos", desc: "Puede visualizar la lista de pedidos en todas las vistas" },
  { id: "edit_orders", label: "Editar pedidos", desc: "Puede cambiar estados y datos de los pedidos" },
  { id: "send_messages", label: "Enviar mensajes", desc: "Puede enviar mensajes de WhatsApp a los clientes" },
  { id: "approve_payments", label: "Aprobar pagos", desc: "Puede verificar vouchers y confirmar pagos" },
  { id: "update_delivery_status", label: "Actualizar logística", desc: "Puede cambiar estados de envío (Shalom, Motorizado)" },
  { id: "generate_labels", label: "Generar guías", desc: "Puede generar guías de Shalom en lote" },
];

function EquipoPage() {
  const [userList, setUserList] = useState<User[]>(users);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRoleFilter, setSelectedRoleFilter] = useState<UserRole | "Todos">("Todos");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  // Form State
  const [fName, setFName] = useState("");
  const [fEmail, setFEmail] = useState("");
  const [fRole, setFRole] = useState<UserRole>("Ventas");
  const [fStatus, setFStatus] = useState<UserStatus>("Activo");
  const [fPermissions, setFPermissions] = useState<string[]>([]);

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
        u.email.toLowerCase().includes(searchQuery.toLowerCase());
      return matchRole && matchSearch;
    });
  }, [userList, searchQuery, selectedRoleFilter]);

  const activeCount = userList.filter((u) => u.status === "Activo").length;
  const adminCount = userList.filter((u) => u.role === "Administrador").length;
  const salesCount = userList.filter((u) => u.role === "Ventas").length;
  const logiCount = userList.filter((u) => u.role === "Logística").length;

  const handleOpenCreate = () => {
    setEditingUser(null);
    setFName("");
    setFEmail("");
    setFRole("Ventas");
    setFStatus("Activo");
    setFPermissions(["view_orders", "edit_orders", "send_messages"]);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (user: User) => {
    setEditingUser(user);
    setFName(user.name);
    setFEmail(user.email);
    setFRole(user.role);
    setFStatus(user.status);
    setFPermissions(user.permissions);
    setIsModalOpen(true);
  };

  const handleTogglePermission = (permId: string) => {
    if (fPermissions.includes("all")) {
      if (fRole === "Administrador") return; // Admins always have 'all'
      setFPermissions([permId]);
      return;
    }

    setFPermissions((prev) =>
      prev.includes(permId) ? prev.filter((p) => p !== permId) : [...prev, permId]
    );
  };

  const handleSaveUser = () => {
    if (!fName.trim() || !fEmail.trim()) {
      showToast("Nombre y correo son obligatorios");
      return;
    }

    // Auto-assign "all" to Admin
    const finalPermissions = fRole === "Administrador" ? ["all"] : fPermissions;

    if (editingUser) {
      setUserList((prev) =>
        prev.map((u) =>
          u.id === editingUser.id
            ? { ...u, name: fName, email: fEmail, role: fRole, status: fStatus, permissions: finalPermissions }
            : u
        )
      );
      showToast("Usuario actualizado correctamente");
    } else {
      const newUser: User = {
        id: `usr_${Date.now()}`,
        name: fName,
        email: fEmail,
        role: fRole,
        status: fStatus,
        lastActive: "Nunca",
        avatar: fName.substring(0, 2).toUpperCase(),
        permissions: finalPermissions,
      };
      setUserList((prev) => [...prev, newUser]);
      showToast("Usuario invitado correctamente");
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    setUserList((prev) => prev.filter((u) => u.id !== id));
    showToast("Usuario eliminado");
  };

  const handleRoleChange = (role: UserRole) => {
    setFRole(role);
    if (role === "Administrador") {
      setFPermissions(["all"]);
    } else if (role === "Ventas") {
      setFPermissions(["view_orders", "edit_orders", "send_messages", "approve_payments"]);
    } else if (role === "Logística") {
      setFPermissions(["view_orders", "update_delivery_status", "generate_labels"]);
    }
  };

  return (
    <AppShell title="Equipo y Roles" subtitle="Administra los accesos y permisos de tu equipo de trabajo">
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 rounded-2xl border border-emerald-500/30 bg-emerald-500/15 backdrop-blur-md px-4 py-2.5 text-xs font-bold text-emerald-500 shadow-xl flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="h-4 w-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      <div className="space-y-6">
        {/* KPI CARDS */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
          <div className="rounded-2xl border border-border bg-surface p-4 shadow-2xs space-y-1">
            <span className="text-[11px] font-bold text-muted-foreground uppercase block">Usuarios Activos</span>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-black text-foreground">{activeCount}</span>
              <Activity className="h-4 w-4 text-emerald-500" />
            </div>
            <p className="text-[10px] text-muted-foreground">En el espacio de trabajo</p>
          </div>
          <div className="rounded-2xl border border-border bg-surface p-4 shadow-2xs space-y-1">
            <span className="text-[11px] font-bold text-muted-foreground uppercase block">Administradores</span>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-black text-indigo-500">{adminCount}</span>
              <Shield className="h-4 w-4 text-indigo-500" />
            </div>
            <p className="text-[10px] text-muted-foreground">Acceso total al sistema</p>
          </div>
          <div className="rounded-2xl border border-border bg-surface p-4 shadow-2xs space-y-1">
            <span className="text-[11px] font-bold text-muted-foreground uppercase block">Ventas</span>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-black text-blue-500">{salesCount}</span>
              <Briefcase className="h-4 w-4 text-blue-500" />
            </div>
            <p className="text-[10px] text-muted-foreground">Atención y seguimiento</p>
          </div>
          <div className="rounded-2xl border border-border bg-surface p-4 shadow-2xs space-y-1">
            <span className="text-[11px] font-bold text-muted-foreground uppercase block">Logística</span>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-black text-orange-500">{logiCount}</span>
              <Truck className="h-4 w-4 text-orange-500" />
            </div>
            <p className="text-[10px] text-muted-foreground">Despachos e inventario</p>
          </div>
        </div>

        {/* CONTROLES (BÚSQUEDA Y FILTROS) */}
        <div className="rounded-2xl border border-border bg-surface-2 p-3 sm:p-4 flex flex-col sm:flex-row gap-3 justify-between items-center shadow-xs">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Buscar por nombre o correo..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-9 rounded-xl border border-border bg-surface pl-9 pr-3 text-xs text-foreground outline-none focus:border-primary"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
            {["Todos", "Administrador", "Ventas", "Logística"].map((role) => (
              <button
                key={role}
                onClick={() => setSelectedRoleFilter(role as any)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                  selectedRoleFilter === role
                    ? "bg-foreground text-background"
                    : "border border-border bg-surface text-muted-foreground hover:bg-muted"
                }`}
              >
                {role}
              </button>
            ))}
            <button
              onClick={handleOpenCreate}
              className="ml-auto sm:ml-2 inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-extrabold text-white hover:bg-emerald-500 transition shadow-sm cursor-pointer whitespace-nowrap"
            >
              <Plus className="h-4 w-4" />
              <span>Invitar Miembro</span>
            </button>
          </div>
        </div>

        {/* LISTADO DE USUARIOS (TABLA) */}
        <div className="rounded-2xl border border-border bg-surface shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-foreground">
              <thead className="border-b border-border bg-muted/30 text-xs font-bold text-muted-foreground">
                <tr>
                  <th className="px-5 py-4">Usuario</th>
                  <th className="px-5 py-4">Rol de Sistema</th>
                  <th className="px-5 py-4">Estado</th>
                  <th className="px-5 py-4">Última Actividad</th>
                  <th className="px-5 py-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-5 py-10 text-center text-muted-foreground text-xs">
                      No se encontraron usuarios.
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => {
                    const RoleIcon = ROLE_ICONS[user.role];
                    const roleColor = ROLE_COLORS[user.role];

                    return (
                      <tr key={user.id} className="hover:bg-muted/20 transition-colors">
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary border border-primary/20">
                              {user.avatar}
                            </div>
                            <div>
                              <p className="font-bold text-[13px]">{user.name}</p>
                              <p className="text-[11px] text-muted-foreground">{user.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-3.5">
                          <span className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-[11px] font-bold ${roleColor}`}>
                            <RoleIcon className="h-3.5 w-3.5" />
                            {user.role}
                          </span>
                        </td>
                        <td className="px-5 py-3.5">
                          {user.status === "Activo" ? (
                            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[11px] font-bold text-emerald-500">
                              <UserCheck className="h-3 w-3" /> Activo
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 rounded-full bg-rose-500/10 px-2 py-0.5 text-[11px] font-bold text-rose-500">
                              <UserX className="h-3 w-3" /> Inactivo
                            </span>
                          )}
                        </td>
                        <td className="px-5 py-3.5 text-[11px] text-muted-foreground font-medium">
                          {user.lastActive}
                        </td>
                        <td className="px-5 py-3.5 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => handleOpenEdit(user)}
                              className="rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-sky-500 transition cursor-pointer"
                              title="Editar usuario"
                            >
                              <Edit2 className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(user.id)}
                              className="rounded-lg p-2 text-muted-foreground hover:bg-rose-500/10 hover:text-rose-500 transition cursor-pointer"
                              title="Eliminar usuario"
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
      </div>

      {/* MODAL CREAR / EDITAR */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="relative w-full max-w-lg rounded-3xl border border-border bg-surface shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between border-b border-border p-5 bg-muted/20">
              <div>
                <h3 className="text-lg font-extrabold text-foreground">
                  {editingUser ? "Editar Usuario" : "Invitar Nuevo Miembro"}
                </h3>
                <p className="text-xs text-muted-foreground">Configura sus accesos y permisos en PedidoFlow</p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="rounded-lg p-2 text-muted-foreground hover:bg-muted transition cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-5 overflow-y-auto space-y-5">
              {/* DATOS BÁSICOS */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Datos Básicos</h4>
                <div className="grid grid-cols-1 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold">Nombre Completo</label>
                    <input
                      type="text"
                      value={fName}
                      onChange={(e) => setFName(e.target.value)}
                      placeholder="Ej. Luis Castillo"
                      className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold">Correo Electrónico</label>
                    <input
                      type="email"
                      value={fEmail}
                      onChange={(e) => setFEmail(e.target.value)}
                      placeholder="luis@tuempresa.com"
                      className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
                    />
                  </div>
                </div>
              </div>

              {/* ROL Y ESTADO */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold">Rol en el Sistema</label>
                  <select
                    value={fRole}
                    onChange={(e) => handleRoleChange(e.target.value as UserRole)}
                    className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary cursor-pointer"
                  >
                    <option value="Administrador">Administrador</option>
                    <option value="Ventas">Ventas</option>
                    <option value="Logística">Logística</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold">Estado de la cuenta</label>
                  <select
                    value={fStatus}
                    onChange={(e) => setFStatus(e.target.value as UserStatus)}
                    className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary cursor-pointer"
                  >
                    <option value="Activo">Activo (Permitir acceso)</option>
                    <option value="Inactivo">Inactivo (Bloquear acceso)</option>
                  </select>
                </div>
              </div>

              {/* PERMISOS */}
              <div className="space-y-3 pt-2 border-t border-border/50">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Permisos Detallados</h4>
                  {fRole === "Administrador" && (
                    <span className="text-[10px] font-bold text-indigo-500 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">Acceso Total</span>
                  )}
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {PERMISSION_OPTIONS.map((perm) => {
                    const isChecked = fPermissions.includes("all") || fPermissions.includes(perm.id);
                    const isDisabled = fRole === "Administrador";

                    return (
                      <label
                        key={perm.id}
                        className={`flex items-start gap-2.5 rounded-xl border p-3 cursor-pointer transition ${
                          isChecked
                            ? "border-emerald-500/40 bg-emerald-500/5"
                            : "border-border bg-background hover:bg-muted/50"
                        } ${isDisabled ? "opacity-75 cursor-not-allowed" : ""}`}
                      >
                        <div className="pt-0.5">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            disabled={isDisabled}
                            onChange={() => handleTogglePermission(perm.id)}
                            className="h-4 w-4 rounded border-border text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                          />
                        </div>
                        <div className="space-y-0.5 flex-1">
                          <p className={`text-xs font-bold ${isChecked ? "text-emerald-700 dark:text-emerald-400" : "text-foreground"}`}>
                            {perm.label}
                          </p>
                          <p className="text-[10px] text-muted-foreground leading-snug">
                            {perm.desc}
                          </p>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="border-t border-border p-4 bg-muted/10 flex justify-end gap-2">
              <button
                onClick={() => setIsModalOpen(false)}
                className="rounded-xl px-4 py-2 text-xs font-bold text-muted-foreground hover:bg-muted transition cursor-pointer"
              >
                Cancelar
              </button>
              <button
                onClick={handleSaveUser}
                className="rounded-xl bg-primary px-5 py-2 text-xs font-bold text-primary-foreground hover:bg-primary/90 transition shadow-sm cursor-pointer"
              >
                {editingUser ? "Guardar Cambios" : "Enviar Invitación"}
              </button>
            </div>
          </div>
        </div>
      )}
    </AppShell>
  );
}
