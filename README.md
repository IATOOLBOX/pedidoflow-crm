# PedidoFlow CRM

PROMPT

Quiero que construyas el prototipo visual de un CRM SaaS llamado "PedidoFlow" (puedes proponer un nombre mejor si se te ocurre uno), diseñado para vendedores de ecommerce en Perú que venden por Shopify y atienden pedidos contraentrega por WhatsApp. Es un prototipo de interfaz con datos de ejemplo (mock data), no necesita lógica de backend real ni integraciones funcionales — solo debe verse y sentirse como un producto real, con navegación completa entre pantallas.

Estilo visual

SaaS moderno, limpio, profesional, confiable — pensado para dueños de tiendas pequeñas y medianas, no necesariamente muy técnicos.

Paleta principal: un color de marca (sugiero un verde o azul confiable, tipo fintech), con grises neutros para el fondo y superficies.

Tipografía clara y legible, tamaños generosos.

Usa un sidebar de navegación fijo a la izquierda y un layout de dashboard tipo SaaS (header superior con nombre de tienda activa y usuario).

Diseño responsive, pero prioriza la vista de escritorio (es una herramienta de trabajo diario).

Usa iconos outline simples y consistentes en toda la app.

Estructura de navegación (sidebar)

Dashboard (inicio)

Pedidos

Conversaciones (inbox de WhatsApp)

Pagos por verificar

Clientes

Plantillas de WhatsApp

Integraciones (Shopify, WhatsApp/Meta, Shalom)

Configuración

Pantalla 1 — Dashboard

Vista general del día para el vendedor:

Tarjetas de métricas arriba: pedidos nuevos hoy, pedidos pendientes de confirmar, pagos por verificar (con badge de alerta si hay pendientes), pedidos confirmados hoy, tasa de confirmación (%).

Un gráfico simple de pedidos por estado (barra o dona) con estos estados y colores:

Pendiente (gris)

Compromiso de pago (ámbar)

Confirmado (verde)

No confirma (rojo)

Anulado (rojo oscuro)

Una lista de "actividad reciente" tipo feed: "Juan Pérez confirmó su pedido #1234", "Nueva captura de pago de María López", "Pedido #1230 en ruta con Shalom".

Un banner o widget de "pagos esperando verificación" con acceso directo.

Pantalla 2 — Pedidos (vista principal, tipo tablero)

Esta es la pantalla más importante. Debe tener dos vistas intercambiables (toggle arriba):

Vista Kanban (por defecto): columnas por estado de confirmación — Pendiente → Compromiso de pago → Confirmado → No confirma / Anulado

Cada tarjeta de pedido muestra: nombre del cliente, número de pedido, monto, ciudad, un ícono que indica si es "Local (contraentrega)" o "Agencia (Shalom)", tiempo desde que llegó el pedido, y avatar/inicial del cliente.

Vista Tabla: lista con columnas — # pedido, cliente, ciudad, tipo de envío, estado de confirmación, estado de entrega, monto, fecha, acciones.

Incluye filtros arriba: por estado, por tipo de envío (local/agencia), por rango de fecha, buscador por nombre/teléfono.

Al hacer clic en un pedido, abre un panel lateral (drawer) con el detalle del pedido:

Datos del cliente (nombre, teléfono, ciudad, dirección, DNI si ya lo dio)

Productos del pedido

Línea de tiempo del pedido (timeline vertical): "Pedido creado → Bot contactó al cliente → Cliente confirmó → Adelanto solicitado → Captura recibida → Pago verificado → Guía Shalom generada → En ruta → Entregado"

Estado de confirmación y estado de entrega como badges de color en la parte superior

Botón para abrir la conversación de WhatsApp de ese cliente

Botón para cambiar el estado manualmente

Pantalla 3 — Conversaciones (inbox estilo WhatsApp Business)

Layout de dos columnas, como WhatsApp Web:

Columna izquierda: lista de chats, cada uno con nombre, último mensaje, hora, y un badge de color según el estado del pedido asociado (mismo código de colores que en Pedidos). Incluye un filtro para ver "atendidos por IA" vs "requiere atención humana" vs "todos".

Columna derecha: la conversación seleccionada, con burbujas de chat diferenciando mensajes del cliente, del agente IA (marcados sutilmente como "IA"), y del vendedor humano si intervino.

Dentro de la conversación, si el cliente envió una imagen (captura de pago), mostrarla como miniatura clickeable con un botón "Verificar pago" al lado.

Un panel derecho colapsable con el resumen del pedido asociado a esa conversación (mismo resumen que el drawer de pedidos).

Caja de texto abajo para que el vendedor pueda escribir manualmente y "tomar el control" de la conversación (con un toggle "IA activa / Pausada").

Pantalla 4 — Pagos por verificar

Una cola de verificación, tipo lista de tarjetas o tabla:

Cada fila: cliente, monto reportado, captura de pago (miniatura), fecha/hora de envío, número de operación si el agente lo detectó automáticamente.

Dos botones grandes y claros por fila: "Aprobar" (verde) y "Rechazar" (rojo).

Al aprobar, debe simular una transición visual (ej. la tarjeta se mueve o desaparece con una animación breve) para dar sensación de flujo en tiempo real.

Pantalla 5 — Clientes

Tabla simple con historial de clientes: nombre, teléfono, ciudad, número de pedidos totales, número de pedidos confirmados, última compra, tag de "cliente recurrente" si aplica. Clic en un cliente abre su historial completo de pedidos y conversaciones.

Pantalla 6 — Plantillas de WhatsApp

Vista tipo galería de tarjetas mostrando plantillas de mensajes (las que se envían fuera de la ventana de 24h), con su estado de aprobación de Meta simulado (Aprobada / En revisión / Rechazada, con badges de color). Botón "Crear nueva plantilla" que abre un formulario simple con categoría (marketing, utilidad, autenticación) y editor de texto con variables tipo {{nombre_cliente}}, {{numero_pedido}}.

Pantalla 7 — Integraciones

Tres tarjetas grandes, una por integración, cada una con logo, estado de conexión (Conectado / No conectado, con punto verde o gris), y botón de acción:

Shopify: botón "Conectar tienda", campo para URL de la tienda.

WhatsApp Business (Meta): botón "Conectar número de WhatsApp" simulando el flujo de Embedded Signup, mostrando el número conectado y su estado de verificación ante Meta.

Shalom: formulario para ingresar credenciales de la cuenta de agencia.

Pantalla 8 — Configuración

Secciones dentro de un panel de tabs o acordeón:

Datos de la tienda: nombre, logo, moneda.

Reglas de contraentrega: qué ciudades/regiones se consideran "local" vs "agencia" (una lista editable o mapa de zonas).

Seguimiento de mensajes: cuántos recordatorios enviar (1, 2 o 3) y cada cuánto tiempo (selector de horas), con una vista previa de cómo se vería la secuencia.

Monto de adelanto: campo para configurar el monto por defecto del adelanto contraentrega (ej. S/25).

Equipo: lista de usuarios/administradores con roles.

Plan y facturación: tarjeta mostrando el plan actual del SaaS y uso (número de conversaciones este mes, límite del plan).

Datos de ejemplo (mock data)

Genera al menos 15-20 pedidos de ejemplo con nombres, ciudades y montos realistas para Perú (usa ciudades como Lima, Arequipa, Trujillo, Cusco, Piura), distribuidos en los distintos estados para que las pantallas se vean pobladas y realistas. Usa montos en soles (S/).

Notas finales

Todo el flujo debe sentirse cohesivo: el código de colores de los estados de pedido debe ser el mismo en Dashboard, Pedidos y Conversaciones.

Prioriza claridad y velocidad de lectura — el usuario final es un vendedor que revisa esto muchas veces al día, no un equipo técnico.

No implementes lógica real de backend, autenticación real, ni llamadas a APIs externas — todo con datos simulados y estado local.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/e85c7566-8195-4701-b276-d63f414f4633).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
