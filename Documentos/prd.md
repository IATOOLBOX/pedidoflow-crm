# PedidoFlow CRM — PRD (Product Requirements Document)

*Última actualización: agosto 2026*
*Estado del proyecto: prototipo visual inicial (sin backend), construido en Lovable/Antigravity*

---

## 0. Cómo usar este documento

Este PRD está escrito para que **cualquier persona o agente de IA (Claude, Antigravity, etc.) pueda retomar el proyecto en cualquier momento sin perder contexto**, aunque haya pasado tiempo desde la última vez que se tocó. Contiene: el problema de negocio, la lógica exacta de los flujos, el estado actual del prototipo, lo que falta, y el orden recomendado de desarrollo. Si estás retomando este proyecto, lee las secciones 1 a 4 antes de tocar código.

---

## 1. Contexto de negocio (resumen)

Ver el **Documento Maestro** (`PedidoFlow-Documento-Maestro.md`) para el problema, la propuesta de valor y el modelo de negocio completos. Resumen ejecutivo:

- **Problema**: en el ecommerce contraentrega de Perú, la venta no se cierra en el checkout de Shopify, se cierra en la conversación de WhatsApp después. Los vendedores pierden pedidos porque no dan abasto atendiendo manualmente, y no hay seguimiento automático de los pedidos que quedan sin confirmar.
- **Solución**: un CRM que conecta Shopify + WhatsApp Business API oficial (Meta) + agencia de envíos (Shalom), con un agente de IA que confirma pedidos, cobra adelantos, verifica pagos y hace seguimiento hasta la entrega.
- **Usuario objetivo**: dueños de tiendas Shopify en Perú (y su equipo) que venden contraentrega.
- **Modelo de negocio**: SaaS multi-tenant por suscripción mensual (básico/pro/enterprise).
- **Referencia de mercado**: existe un competidor ya operando en Perú, **"Flujos Inteligentes"**, que sirve como benchmark de lo que un MVP competitivo debe cubrir.

---

## 2. Lógica de negocio central (reglas que el sistema debe respetar)

Esta sección documenta las reglas de negocio ya definidas, para que no se reinterpreten distinto en cada retoma del proyecto.

### 2.1 Tipos de pedido según destino

El sistema determina automáticamente el tipo de pedido **según la ciudad/región del cliente**:

- **Local / contraentrega directa** (ej. Lima): un repartidor entrega y cobra el monto completo en persona. El pedido **solo necesita confirmación**, no pago adelantado.
- **Envío por agencia** (ej. provincias, vía Shalom): no hay quién cobre en persona al despachar, por lo que se requiere un **adelanto** (S/20-30, configurable por tienda) antes de generar la guía de envío, además de los datos completos del cliente (DNI, dirección).

### 2.2 Flujo de contacto inicial

- Si el cliente **ya escribió primero** por WhatsApp → el agente de IA retoma esa conversación y trata de cerrar/confirmar el pedido.
- Si el cliente **no ha escrito** → el CRM debe iniciar el contacto de forma proactiva (mensaje de plantilla, ya que probablemente está fuera de la ventana de 24h de Meta).

### 2.3 Seguimiento de clientes que no responden ("rompevistas")

Si el cliente no confirma, el sistema activa una secuencia automática de recordatorios:

- **Configurable por el vendedor**: cantidad de mensajes (1, 2 o 3) y el intervalo de tiempo entre cada uno (lo define cada tienda en su configuración).
- Ejemplo de tono: primer recordatorio suave ("todavía tenemos reservado tu pedido"), último recordatorio con urgencia ("último aviso, estamos cerrando pedidos de hoy").
- Si se agotan los intentos sin respuesta, el pedido pasa a estado **"No confirma"**.

### 2.4 Estados del pedido — dos etapas separadas

**Etapa 1 — Estado de confirmación** (gestiona si la venta se cierra o no):

`Pendiente` → `Compromiso de pago` → `Confirmado`
`Pendiente` → `No confirma` (tras agotar seguimientos)
`Pendiente` / `Compromiso de pago` → `Anulado` (cancelación explícita)

> Nota de implementación: el diagnóstico de comparación con Flujos Inteligentes sugiere enriquecer esta etapa con estados intermedios: `Nuevo pedido`, `Pendiente de confirmar`, `En conversación`, `Pendiente de pago`, `Pago verificado` — ver sección 4.2.

**Etapa 2 — Estado de entrega** (solo aplica una vez que el pedido está `Confirmado`):

`Preparando pedido` → `Registrado en agencia` → `En tránsito / En ruta` → `Entregado`
También puede pasar a `Cancelado` o `Reprogramado` en cualquier punto de esta etapa.

**Regla importante**: cuando un pedido llega a `No confirma` o `Anulado`, **no se modifica el pedido en Shopify** — se queda anulado solo dentro de PedidoFlow, para que el vendedor decida después si lo reactiva (ej. con una campaña de remarketing).

### 2.5 Flujo de pago y cierre para envío por agencia

```
Pedido confirmado (requiere adelanto)
  → Agente solicita adelanto (S/20-30, Yape/Plin/transferencia — ambos métodos son igual de comunes)
  → Cliente envía captura de pago
  → Agente extrae monto/operación de la imagen (visión IA)
  → Aparece en la bandeja "Pagos por verificar" del admin
  → Admin aprueba o rechaza
  → Si aprueba: el CRM pide DNI y datos completos (dirección, referencia)
  → Se genera el envío/guía con la agencia (Shalom)
  → Se envía al cliente una foto del paquete/guía como comprobante
  → Comienza el seguimiento logístico
```

**Importante — aprobación humana**: la verificación de pagos debe requerir aprobación humana explícita del administrador, al menos en esta etapa del producto. No se debe auto-aprobar pagos solo con la lectura de IA, por riesgo de fraude.

### 2.6 Integración con Shalom (pendiente de validar)

El plan original era que cada tienda inicie sesión con sus propias credenciales de Shalom dentro del CRM para trackear pedidos. **Se identificó que Shalom sí parece tener alguna API disponible** — esto debe confirmarse y priorizarse frente a la alternativa (guardar credenciales encriptadas y automatizar vía scraping), que tiene mayores riesgos de seguridad y mantenimiento.

### 2.7 WhatsApp Business API — modelo de conexión

- Se descartó ser BSP (Business Solution Provider) directo ante Meta; **se trabajará sobre un BSP existente** (ej. Twilio, 360dialog, Gupshup, Wati) para acelerar el lanzamiento.
- Cada tienda conecta su propio número mediante el flujo oficial de **Embedded Signup de Meta**: el número queda registrado ante Meta bajo la cuenta del BSP, evitando riesgo de bloqueo, y habilitando el uso de plantillas dentro de las políticas de Meta.

---

## 3. Estado actual del prototipo

**Plataforma de construcción**: Lovable / Antigravity (prototipo de interfaz, sin backend real, con datos de ejemplo).

**Diagnóstico**: comparado contra el competidor de referencia (Flujos Inteligentes), PedidoFlow cubre aproximadamente el **60% de la estructura visual y operativa** necesaria para un MVP competitivo. La diferencia central es que **PedidoFlow hoy administra pedidos**, mientras que un CRM completo **administra todo el ciclo comercial**: desde que llega el cliente hasta que compra, confirma y recibe.

### 3.1 Lo que el prototipo ya tiene (nivel interfaz)

| Módulo | Estado |
|---|---|
| Gestión de pedidos (kanban con estados: Pendiente, Compromiso de pago, Confirmado, Anulado) | ✅ Construido |
| Bandeja de conversaciones de WhatsApp | ✅ Construido |
| Gestión de clientes | ✅ Construido |
| Plantillas de WhatsApp | ✅ Construido (base) |
| Verificación de pagos | ✅ Construido |
| Integración inicial con Shopify (conexión + importación visual) | ✅ Construido (solo interfaz, no funcional) |

### 3.2 Lo que falta (sin backend todavía, y funcionalidades de interfaz pendientes)

Nada de esto tiene backend real conectado todavía. A nivel de interfaz/prototipo, lo que falta o debe ampliarse:

- Ampliar los estados del pedido con el flujo logístico completo (ver sección 4.2).
- Automatizaciones visuales de WhatsApp (secuencia de mensajes automáticos al llegar un pedido).
- Sistema de "rompevistas" (recuperación de clientes sin respuesta) — no existe aún ni en la interfaz.
- Embudo comercial tipo pipeline (más allá del kanban de pedidos) que muestre tasas de conversión entre etapas.
- Perfil de cliente enriquecido (pedidos totales, confirmados, rechazados, última compra, valor del cliente).
- Ampliar plantillas de WhatsApp por categoría (confirmación, recordatorio, rompevistas, logística, entrega).
- Dashboard con métricas comerciales (ventas, tasa de conversión, mensajes enviados/respondidos, clientes recuperados).
- Gestión de usuarios y permisos por rol (administrador, vendedor, confirmador, logística).
- Catálogo de productos con stock básico.
- Configuración de cobertura de envíos por zona (departamento/ciudad/distrito) y agencias asociadas.
- Módulo de reportes exportables (ventas, pedidos, clientes, confirmaciones, entregas).

---

## 4. Especificación funcional por módulo

Para cada módulo: **qué hace**, **qué existe hoy en el prototipo**, **qué falta para el MVP**.

### 4.1 Gestión de clientes
- **Qué hace**: permite buscar clientes por nombre, teléfono, DNI o código de pedido; ver su historial completo de pedidos (realizados, confirmados, cancelados) y última compra; etiquetarlos (recurrente, nuevo, problemático, VIP).
- **Qué existe**: pantalla base de clientes en el prototipo.
- **Qué falta**: buscador multi-campo, sistema de etiquetas, perfil de cliente con métricas (pedidos totales, confirmados, rechazados, valor del cliente en soles), conexión real a base de datos.

### 4.2 Gestión de pedidos
- **Qué hace**: registra pedidos (manual o importado de Shopify), los asocia a cliente y producto, y los mueve por un flujo de estados de confirmación y de entrega (ver sección 2.4).
- **Qué existe**: kanban con 4 estados de confirmación (Pendiente, Compromiso de pago, Confirmado, Anulado).
- **Qué falta**:
  - Agregar el flujo logístico completo como una segunda etapa: `Preparando pedido → Registrado en agencia → En tránsito → Entregado → Rechazado → Reprogramado`.
  - Vista de tabla además del kanban, con filtros (por estado, tipo de envío, fecha, búsqueda).
  - Panel de detalle de pedido con línea de tiempo completa del proceso.
  - Conexión real a la base de datos de pedidos (hoy es data de ejemplo).

### 4.3 Integración con Shopify
- **Qué hace**: sincroniza pedidos, clientes y productos entre Shopify y PedidoFlow; actualiza estados en ambos sentidos.
- **Qué existe**: pantalla de conexión de tienda (visual, no funcional).
- **Qué falta** (prioridad MVP alta):
  - Webhook real de Shopify (`orders/create`) que dispare la creación automática del cliente y el pedido en PedidoFlow.
  - Sincronización automática de: nombre, teléfono, dirección, ciudad, producto, variante, precio, método de pago, fecha del pedido.
  - Actualización bidireccional de estado (ej. cuando el cliente confirma por WhatsApp, Shopify pasa de `Unfulfilled` a `Confirmed`/equivalente).

### 4.4 Integración con WhatsApp Business API (Meta)
- **Qué hace**: conecta el número de WhatsApp de cada tienda de forma oficial (Embedded Signup vía BSP), permite enviar/recibir mensajes y plantillas dentro de las políticas de Meta.
- **Qué existe**: pantalla de conexión (visual, no funcional).
- **Qué falta** (prioridad máxima):
  - Integración real con el BSP elegido.
  - Flujo de Embedded Signup funcional.
  - Envío/recepción de mensajes reales, incluyendo manejo de la ventana de 24h (mensaje libre vs. plantilla).

### 4.5 Bandeja de conversaciones (Inbox WhatsApp)
- **Qué hace**: muestra la lista de conversaciones con el pedido asociado, estado del cliente, producto y última interacción; permite responder, asignar conversaciones a vendedores y marcarlas como atendidas.
- **Qué existe**: inbox visual con vista de dos columnas (estilo WhatsApp Web), con panel de resumen del pedido.
- **Qué falta**: conexión real a mensajería, asignación de conversaciones a vendedores, marcado de atendida/pendiente, toggle real de "IA activa / pausada".

### 4.6 Confirmación automática de pedidos (agente IA)
- **Qué hace**: cuando llega un pedido, envía automáticamente un mensaje de confirmación por WhatsApp; si el cliente confirma, cambia el estado del pedido automáticamente.
- **Qué existe**: no implementado (solo maquetado conceptualmente en el inbox).
- **Qué falta**: lógica del agente (reglas + IA), disparo automático al crear pedido, registro de la respuesta del cliente, cambio de estado automático.
- **Alcance IA para el MVP** (no requiere IA compleja al inicio): confirmar pedidos, resolver dudas simples, solicitar dirección/referencias, detectar intención de compra.

### 4.7 Rompevistas (recuperación de clientes sin respuesta)
- **Qué hace**: detecta clientes que no responden o no confirman, y envía una secuencia de recordatorios automáticos configurable.
- **Qué existe**: no implementado.
- **Qué falta**: motor de reglas para detectar estados (`no respondió`, `vio mensaje`, `abandonó conversación`, `no confirmó`, `promesa de pago pendiente`), configuración de cantidad de mensajes e intervalo por tienda, plantillas específicas para cada mensaje de la secuencia.

### 4.8 Plantillas de WhatsApp
- **Qué hace**: permite crear y gestionar mensajes preaprobados por Meta, usados fuera de la ventana de 24h.
- **Qué existe**: pantalla de plantillas (galería visual básica).
- **Qué falta**: ampliar categorías (confirmación, recordatorio, rompevistas, logística, entrega, promociones), formulario de creación con variables (`{{nombre_cliente}}`, `{{numero_pedido}}`), estado de aprobación real sincronizado con Meta.

### 4.9 Gestión de pagos
- **Qué hace**: recibe capturas de pago enviadas por el cliente, las muestra en una bandeja de verificación, y permite aprobar/rechazar y registrar el adelanto asociado al pedido.
- **Qué existe**: pantalla de verificación de pagos (visual).
- **Qué falta**: recepción real de imágenes desde WhatsApp, lectura automática del monto/operación (IA de visión) como apoyo (no como aprobación automática), conexión del estado aprobado/rechazado con el estado del pedido.

### 4.10 Embudo CRM de ventas (pipeline comercial)
- **Qué hace**: visualiza a los clientes por etapa comercial (`Nuevo contacto → Mensaje enviado → Interacción → Compromiso de compra → Pedido confirmado → Venta realizada`) y permite medir tasas de conversión reales entre etapas.
- **Qué existe**: no implementado — hoy solo existe el kanban de estados de pedido, que no es lo mismo que un embudo de conversión.
- **Qué falta**: todo el módulo, incluyendo el cálculo de tasas de conversión (ej. "100 pedidos ingresaron, 80 respondieron, 60 confirmaron, 50 recibieron → 50% de conversión real").

### 4.11 Automatizaciones
- **Qué hace**: permite crear reglas automáticas (enviar mensaje al entrar un pedido, recordar clientes, cambiar estados, notificar vendedores).
- **Qué existe**: no implementado como módulo configurable; algunas automatizaciones están implícitas en otros módulos (confirmación, rompevistas).
- **Qué falta**: interfaz de reglas configurables, no solo comportamientos fijos en el código.

### 4.12 Gestión logística
- **Qué hace**: registra la agencia de envío, el número de guía y el estado del envío, y notifica al cliente.
- **Qué existe**: no implementado (solo mencionado como integración futura).
- **Qué falta para MVP**: registro manual de agencia + número de guía + estado (mínimo viable, sin integración API todavía). Integración real con Shalom queda para después de validar su API (ver sección 2.6). Después: Olva, Urbano, Marvisur.

### 4.13 Gestión de productos
- **Qué hace**: catálogo de productos con precios, imágenes y stock básico, asociado a pedidos.
- **Qué existe**: no implementado como módulo propio (los productos aparecen dentro del detalle de pedido).
- **Qué falta**: CRUD de productos, sincronización con catálogo de Shopify, control de stock básico.

### 4.14 Dashboard de métricas
- **Qué hace**: panel de control con pedidos del día, ventas, clientes nuevos, tasa de confirmación, conversión de WhatsApp, productos más vendidos.
- **Qué existe**: dashboard visual básico (pedidos nuevos, confirmados).
- **Qué falta**: métricas de ventas (pedidos recibidos/confirmados/rechazados, tasa de conversión, ventas generadas en soles) y métricas de WhatsApp (mensajes enviados, respuestas, clientes recuperados por rompevistas).

### 4.15 Usuarios y permisos
- **Qué hace**: gestión de equipo con roles (administrador, vendedor, confirmador, logística) y permisos diferenciados (ver pedidos, responder chats, cambiar estados, ver pagos).
- **Qué existe**: no implementado.
- **Qué falta**: todo el módulo — es requisito para el modelo de negocio multi-tenant, ya que el dueño de la tienda trabaja con su equipo.

### 4.16 Cobertura de envíos
- **Qué hace**: define qué departamentos/ciudades/distritos se consideran zona local vs. zona de agencia, y qué agencia aplica a cada zona.
- **Qué existe**: no implementado (hoy la regla "Lima = local, provincia = agencia" está definida a nivel de negocio pero no configurable en interfaz).
- **Qué falta**: pantalla de configuración de zonas, editable por el vendedor.

### 4.17 Integraciones externas (roadmap)
- **MVP**: Shopify, WhatsApp Business API (Meta).
- **Futuro**: WooCommerce, Tiendanube, Shalom (API), Olva, Urbano, Meta Ads, Google Ads.

### 4.18 Reportes
- **Qué hace**: analítica exportable de ventas, pedidos, clientes, confirmaciones y entregas (Excel).
- **Qué existe**: no implementado.
- **Qué falta**: todo el módulo — no es prioridad de MVP, pero sí de una v1.1.

---

## 5. Roadmap de desarrollo

### Fase 0 — Completar el prototipo visual (estado actual)
Terminar de maquetar en Lovable/Antigravity los módulos pendientes de la sección 3.2, para tener el diseño completo de todas las pantallas antes de empezar el backend.

### Fase 1 — Base del producto (backend + integraciones core)
- Definir y contratar el BSP de WhatsApp.
- Implementar Shopify API (webhooks + sincronización).
- Implementar WhatsApp Business API (Embedded Signup + envío/recepción de mensajes).
- Inbox de WhatsApp funcional (conectado a datos reales).
- Sincronización automática de pedidos Shopify → PedidoFlow.
- Modelo de datos multi-tenant (tiendas, usuarios, pedidos, clientes).

### Fase 2 — Conversión (el corazón del producto)
- Confirmación automática de pedidos por WhatsApp.
- Sistema de rompevistas (recuperación de clientes sin respuesta), configurable por tienda.
- Plantillas de WhatsApp completas por categoría.
- Embudo CRM de ventas con métricas de conversión reales.
- Flujo completo de pago: solicitud de adelanto → captura → verificación humana → cierre de datos (DNI/dirección).

### Fase 3 — Inteligencia y escalamiento
- Agente IA de confirmación con capacidad de resolver dudas y detectar intención de compra.
- Score/valor de cliente automático.
- Automatizaciones configurables (reglas personalizadas por tienda).
- Gestión logística con integración real (Shalom API si se confirma disponible; si no, registro manual de guía/estado).
- Usuarios y permisos por rol.
- Dashboard completo de métricas comerciales y de WhatsApp.
- Reportes exportables.

### Las 12 funciones críticas para el primer MVP comercial (lanzamiento)
1. Conectar Shopify.
2. Conectar WhatsApp Business API.
3. Buscar clientes.
4. Gestionar pedidos (con flujo de confirmación + entrega).
5. Inbox de WhatsApp.
6. Confirmación automática.
7. Rompevistas.
8. Plantillas de WhatsApp.
9. Embudo CRM.
10. Dashboard básico.
11. IA básica de confirmación.
12. Usuarios y permisos.

---

## 6. Decisiones pendientes / riesgos abiertos

Estos son los puntos que **todavía no están cerrados** y que cualquier persona/IA retomando el proyecto debe resolver o validar antes de avanzar en esa parte:

1. **BSP de WhatsApp**: falta elegir el proveedor concreto (Twilio, 360dialog, Gupshup, Wati u otro) según costo por conversación y facilidad de integración.
2. **API de Shalom**: se identificó que "al parecer sí tiene API" — falta confirmar documentación, autenticación y endpoints disponibles antes de comprometerse con esa arquitectura. Alternativa de respaldo: registro manual de guía/estado en el MVP inicial.
3. **Lectura automática de capturas de pago**: decidir si se usa un modelo de visión para extraer monto/operación automáticamente (como ayuda visual al admin) o si se deja 100% manual en el MVP inicial. En cualquier caso, la aprobación final debe ser humana.
4. **Modelo de precios definitivo**: los planes (básico/pro/enterprise) están definidos como concepto pero faltan los límites concretos de cada uno (mensajes incluidos, usuarios, tiendas).
5. **Zonas de cobertura**: la regla "Lima = local, provincia = agencia" es el punto de partida, pero debe ser configurable por tienda (algunas tiendas pueden operar distinto, ej. entregas locales en Arequipa también).

---

## 7. Referencias

- `PedidoFlow-Documento-Maestro.md` — versión comercial de este mismo proyecto (problema, solución, propuesta de valor, usuario, modelo de negocio).
- Prompt de diseño usado para el prototipo en Lovable/Antigravity (pantallas: Dashboard, Pedidos, Conversaciones, Pagos por verificar, Clientes, Plantillas, Integraciones, Configuración).
- Diagnóstico comparativo contra el CRM de referencia del mercado peruano "Flujos Inteligentes" (documento fuente de la sección 3 y 4 de este PRD).