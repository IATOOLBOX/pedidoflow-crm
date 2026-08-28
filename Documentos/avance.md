# Plan de Desarrollo Paso a Paso (Roadmap)

Este documento detalla el progreso y las tareas pendientes fase por fase para el desarrollo completo de PedidoFlow CRM.

## Fase 0: Completar el Prototipo Visual (Estado Actual)
Objetivo: Terminar de maquetar en Antigravity los módulos pendientes para tener el diseño completo de todas las pantallas antes de empezar el backend real.

### ✅ Completado recientemente:
- `[x]` Rediseño del Dashboard con 3 secciones (Embudo, Pedidos por Estado, Actividad Reciente).
- `[x]` Filtros dinámicos en Embudo (WhatsApp, Shopify, Global).
- `[x]` Estados exactos y columnas dinámicas en el Kanban de Pedidos (WhatsApp, Shopify, Logística).
- `[x]` Filtro de fechas (DateRangePicker) con opciones rápidas.
- `[x]` **Perfil de Cliente Enriquecido**: Vista CRM de clientes con métricas de LTV, tasa de confirmación, etiquetas (VIP, Problemático, etc.), filtros avanzados y panel lateral detallado.
- `[x]` **Suite de Workflows & Rompe-Vistos (`/workflows`)**:
  - Vista interactiva con 5 tarjetas y animación drop-bounce al entrar.
  - Barra de navegación dock superior con retorno a la suite.
  - Rompe-Vistos completo: selección de producto (con catálogo extendido), tipo de entrega (Contraentrega vs Shalom), modo manual o IAFlow.
  - Tiempos de inactividad flexibles con límites numéricos estrictos (segundos, minutos, horas) y botones multimedia (imagen, video, audio).
  - Listado activo agrupado por producto (colapsado por defecto), orden cronológico de envío (menor a mayor tiempo), edición en caliente de cada flujo, y filtros instantáneos por canal (WhatsApp, Shopify, Logística) y por etapas del pedido.

### 📝 Pendiente por construir visualmente:
- `[ ]` **Ampliación de Plantillas**: Pantalla enriquecida por categorías (Confirmación, Rompevistas, Logística, etc.) con variables dinámicas.
- `[ ]` **Equipo y Roles**: Pantalla de gestión de usuarios y permisos (Administrador, Ventas, Logística).
- `[ ]` **Catálogo de Productos**: Módulo visual para el control básico de stock.
- `[ ]` **Cobertura de Envíos**: Configuración visual de agencias por zona (Shalom vs Contraentrega).
- `[ ]` **Módulo de Reportes**: Pantalla visual de estadísticas y exportables.

---

## Fase 1: Base del Producto (Backend e Integraciones Core)
Objetivo: Conectar el prototipo a datos reales y establecer las bases de las integraciones.

- `[ ]` Definir y configurar el proveedor BSP de WhatsApp.
- `[ ]` Implementar integración oficial de Meta (WhatsApp Business API).
- `[ ]` Implementar Shopify API (webhooks y sincronización de pedidos).
- `[ ]` Base de datos multi-tenant (arquitectura para múltiples tiendas).
- `[ ]` Conectar el Inbox de WhatsApp (enviar y recibir mensajes reales).

---

## Fase 2: Conversión (El corazón del CRM)
Objetivo: Dar vida a la lógica de ventas, confirmaciones automáticas y flujos de pago.

- `[ ]` Lógica de confirmación automática de pedidos por WhatsApp.
- `[ ]` Motor de "Rompevistas": envío automático de seguimientos según configuración.
- `[ ]` Habilitar el uso real de Plantillas aprobadas de WhatsApp.
- `[ ]` Embudo CRM de ventas calculando métricas de conversión con datos reales.
- `[ ]` Flujo completo de pagos: Solicitud de adelanto -> Captura (cliente) -> Aprobación humana -> Pedido de datos (DNI/Dirección).

---

## Fase 3: Inteligencia y Escalamiento
Objetivo: Automatización avanzada, IA, logística e integraciones futuras.

- `[ ]` Agente Inteligente (IA): Capacidad del bot para resolver dudas y detectar intención.
- `[ ]` Integración logística real vía API (Shalom / Olva).
- `[ ]` Generación automática de guías logísticas.
- `[ ]` Panel analítico avanzado y exportación de reportes de rentabilidad.
- `[ ]` Automatizaciones (reglas personalizadas por tienda tipo Zapier interno).
