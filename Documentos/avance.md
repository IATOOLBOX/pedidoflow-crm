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
  - Confirmación y Logística completa: opciones "Crear Nueva" y "Ya tengo mi plantilla" para 4 tipos de mensajes (Confirmación regular, Pedidos preliminares, Pedido enviado por agencia, Pedido llegó), inserción de variables en un clic, simulación y eliminación.
  - Módulo de Upsells interactivo: botón "CREAR UPSELL" primero, triggers post-confirmación o post-entrega, oferta de catálogo completo (PDF) o productos específicos, copy con variables dinámicas, adjuntos (imagen, video, voz, PDF) y switches individuales de Prendido/Apagado.
  - Botón interactivo de Prendido y Apagado en cada flujo guardado de Rompe-Vistos (conmutación en caliente).
  - Selector global de 3 Temas en `AppShell` (☀️ Normal, 🌓 Medio Oscuro / Dim, 🌙 Oscuro / Deep Dark) con persistencia en localStorage.
  - Suite de Notificaciones Automáticas del Equipo: Switch principal "Notificar Recordatorios" (Activar/Desactivar), Centro de Detección de Respuestas Críticas de Clientes (IA Support Dispatch para "Pagaré a las 6 pm", "Ya no deseo", "Qué pasó con mi pedido no me avisan", vouchers Yape y peticiones de asesor), Feed en vivo de alertas enviadas al soporte que se actualiza en tiempo real con botón de simulación, Stepper de 4 pasos (Remitente, Destinatarios, Abrir chat 24h con enlace directo de 1 clic, Guardar y Probar individualmente en WhatsApp).
- `[x]` **Centro de Plantillas de WhatsApp Oficiales (`/plantillas`)**:
  - Filtros por 5 categorías funcionales de ecommerce COD (Confirmación, Rompe-Vistos, Logística Shalom, Finanzas & Adelantos, Marketing & Upsells).
  - Filtros por estado oficial de Meta (Aprobadas, En revisión, Rechazadas con motivo de rechazo explícito).
  - Tarjetas de plantilla con cabeceras multimedia (Texto, Imagen, Documento PDF), variables dinámicas resaltadas y botones interactivos (Quick Reply y URL).
  - Métricas reales de rendimiento: total de envíos mensuales, tasa de apertura (94-98%) y tasa de clics en botones (60-87%).
  - Modal creador paso a paso de 3 etapas con validaciones de Meta y botones dinámicos.
  - Simulador interactivo en tiempo real de smartphone WhatsApp.
  - Acciones rápidas: simulación, duplicación instantánea y eliminación.
- `[x]` **Equipo y Roles (`/equipo`)**:
  - Pantalla visual para administración de usuarios (Administrador, Ventas, Logística).
  - Listado de usuarios con estado (Activo/Inactivo), fecha de última conexión e indicador de rol.
  - Tarjetas de KPIs (Usuarios Activos, Admin, Ventas, Logística).
  - Modal para Crear e Invitar nuevos miembros y asignar permisos específicos en base al rol de cada usuario.

- `[x]` **Catálogo de Productos (`/productos`)**:
  - Panel visual de control de inventario y stock para ecommerce contraentrega.
  - KPIs de catálogo: Total de productos, Stock saludable, Stock bajo/crítico, Agotados y Valoración del inventario en S/.
  - Vista dual: Tabla empresarial compacta con ajuste de stock en 1-clic (+ / -) y Vista de cuadrícula de tarjetas.
  - Filtros multivariables: Búsqueda por nombre y SKU, filtro por estado de stock y filtro por categorías.
  - Modal de creación y edición con SKU, precio de venta, costo, stock y umbral mínimo de alerta.
  - Sincronización simulada en tiempo real con Shopify con feedback y timestamp.

### 📝 Pendiente por construir visualmente:
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
