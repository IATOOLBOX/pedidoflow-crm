# Documentación del Módulo de Automatizaciones — CRM de Ventas

> **Propósito de este documento:** Contexto completo del módulo "Automatizaciones" de mi CRM de ventas (integrado con WhatsApp Business, Shopify y agencias de envío). Lo uso como referencia para que una IA entienda cómo funciona el sistema actual y pueda ayudarme a **mejorarlo, optimizarlo o rediseñarlo**.

---

## 🧭 Visión general

El módulo de **Automatizaciones** configura los flujos automáticos de ventas de principio a fin: desde que un contacto nuevo escribe, pasando por confirmación de pedido, logística de envío, ventas cruzadas, hasta las alertas internas del equipo.

Está compuesto por **8 pestañas**:

| # | Pestaña | Rol en el embudo |
|---|---|---|
| 1 | Secuencia Inicial | Bienvenida a contactos nuevos |
| 2 | Rompe-Vistos | Reactivación de conversaciones frías |
| 3 | Confirmaciones | Confirmación de datos del pedido |
| 4 | Logística | Seguimiento del envío |
| 5 | Upsells | Venta cruzada post-venta |
| 6 | Comentarios RRSS | *(sin documentar aún)* |
| 7 | Aprobación Pagos | *(sin documentar aún — actualmente con pendientes)* |
| 8 | Notificaciones Automáticas | Alertas internas al equipo |

---

## 1. Secuencia Inicial

**Qué hace:** Automatiza el primer contacto con un lead nuevo, dando la bienvenida y guiándolo hacia la compra de un producto/combo específico.

**Cómo funciona:**
- Se crean "secuencias" de mensajes, cada una **vinculada a un producto o combo**.
- Requiere que el producto ya exista previamente en la sección de Productos del sistema.
- El asistente de creación (modal de 3 pasos) pide:
  1. **Información básica**: nombre de la secuencia + producto/combo asociado.
  2. *(pasos 2 y 3 aún no explorados — probablemente configuración de mensajes y tiempos de envío)*.

**Estado actual:** Sin secuencias creadas todavía (estado vacío).

---

## 2. Rompe-Vistos

**Qué hace:** Reactiva a clientes que dejaron de responder, para recuperar la venta. Tip del sistema: *"Ofrece descuentos"*.

**Lógica de disparo (por cada regla/tarjeta):**
- **Enviar si permanece**: tiempo de inactividad antes de disparar (ej. 30 min, 2h, 6h).
- **Activador**: condición de disparo (ej. "Permanencia en etapa").
- **Enviar aunque el AI esté desactivado**: toggle para forzar el envío incluso con IA apagada.
- **Para mensajes de**: origen del mensaje (ej. "Confirmaciones").
- **Etapa a monitorear**: en qué parte del embudo se vigila (ej. "En Interacción").
- **Tipo de cobertura**: alcance de contactos (ej. "Todos").
- **Etiqueta**: filtro por etiqueta de contacto.
- **Producto**: a qué producto aplica la regla.
- **Cupón**: cupón de descuento opcional adjunto al mensaje.

**Contenido del mensaje:**
- Tipo: "Mensaje libre" o "Plantilla".
- Variables dinámicas (`[Nombre]`, etc.).
- Soporta imagen/video/audio adjuntos.
- Copy típico usa: urgencia, prueba social, beneficio del producto.

**Filtros de vista:** Todos / Mensajería / Confirmaciones / Envíos.

**Métricas por regla:** Impresiones → Reactivaciones → Conversiones.

**Ejemplo real de reglas activas:** MEDIAS EU 1-5, BAMBOO 1 (una regla por producto/variante).

---

## 3. Confirmaciones

**Qué hace:** Confirma con el cliente los datos del pedido (dirección, productos, monto) antes de despachar. Crítico para negocios con **pago contraentrega (COD)** vía **Shopify**.

### Bloque A — Mensaje de Confirmación (pedidos normales)
- Se envía automáticamente **1 minuto después** del pedido, **solo si el cliente NO escribió primero**.
- Si el cliente escribe primero, la IA continúa la conversación normalmente según horarios configurados.
- Plantilla editable con variables: `[Nombre del lead]`, `[Productos Pedido]`, `[Valor Pedido]`, `[Dirección]`, `[Distrito]`, `[Departamento]`.
- Soporta hasta 3 botones interactivos.
- Vista previa en vivo de ambos escenarios (no escribe / sí escribe primero).

### Bloque B — Mensaje para Pedidos Preliminares (draft orders)
- Se dispara cuando llega un **draft order** de Shopify (pedido no finalizado por el cliente, creado manualmente).
- Plantilla independiente con las mismas variables.
- Toggle propio de Activado/Desactivado.

---

## 4. Logística

**Qué hace:** Notifica al cliente el estado de su envío por agencia de transporte.

**Detalle técnico clave:** Son **plantillas tipo "utility"** de WhatsApp — se envían **fuera de la ventana de 24 horas** y deben pasar por **aprobación de Meta** antes de usarse en todos los números conectados.

**Hitos configurados (tarjetas numeradas):**

1. **Pedido Enviado por Agencia** — se dispara al despachar el pedido.
   Variables: `[Nombre]`, `[Productos]`, `[Agencia]`, `[NumeroGuia]`, `[SaldoPendiente]`.
2. **Pedido Llegó a la Agencia** — se dispara cuando el paquete llega al punto de recojo (incluye recordatorio de presentar DNI).
   Variables: `[Nombre]`, `[Productos]`, `[Agencia]`, `[DireccionAgencia]`, `[NumeroGuia]`, `[SaldoPendiente]`.

Cada tarjeta permite: crear plantilla nueva o usar una existente, vista previa en vivo, y botón "Crear Plantilla en WhatsApp" (envía a aprobación de Meta).

*(Posiblemente existan más hitos como "Entregado" o "No recogido" más abajo en la página — pendiente de confirmar.)*

---

## 5. Upsells (Venta Cruzada)

**Qué hace:** Ofrece productos adicionales automáticamente después de que el cliente confirma o recibe su pedido.

**Lógica de disparo:** 1 minuto después de la confirmación, o 3 minutos después de la entrega (configurable).

**Configuración por regla:**
- **Se dispara cuando:** Post-confirmación / Post-entrega.
- **Ofrecer:** Todo el catálogo (PDF adjunto) / Productos específicos (solo se envía si el pedido incluye ese producto).
- **Mensaje de WhatsApp:** texto personalizable + variable `[Nombre]` + adjuntos (foto, video, doc).
- **Estado:** Activo/Inactivo por regla, con múltiples reglas en paralelo (ej. "Upsell 1", "Upsell 2").

---

## 6. Comentarios RRSS
- Responder comentarios en redes sociales (Facebook Ads, Instagram, TikTok Ads) y enviar un mensaje privado o link hacia el WhatsApp de ventas para cerrar el pedido.

---

## 7. Notificaciones Automáticas

**Qué hace:** Envía **alertas internas al equipo** (no a clientes) por WhatsApp y/o Telegram sobre eventos importantes del negocio.

**Asistente de 4 pasos:**

1. **Remitente:** elijo cuál número de WhatsApp Business conectado enviará las notificaciones.
2. **Destinatarios:** agrego personas (canal WhatsApp/Telegram/ambos + número), cada una con notificaciones activables individualmente (ej. "8/8 activas" → 8 tipos de eventos configurables). Se pueden agregar múltiples destinatarios.
3. **Abrir chat (requisito técnico de WhatsApp):** cada destinatario debe escribirle primero al número remitente (WhatsApp no permite que un negocio inicie conversación sin opt-in). Además:
   - Hay que reactivar el chat **cada 24 horas** o se pierden las notificaciones.
   - El sistema manda un recordatorio a las 23h de inactividad.
4. **Guardar y probar:** guarda la configuración y permite enviar mensajes de prueba (a todos o a un destinatario específico).

---

## 🔗 Cómo se conectan las piezas (flujo completo del cliente)

```
Contacto nuevo
   → Secuencia Inicial (bienvenida)
      → Cliente hace pedido
         → Confirmaciones (valida dirección/datos, incl. draft orders)
            → [si no responde] Rompe-Vistos (reactivación con descuento)
         → Aprobación Pagos (validación del pago) [sin documentar]
         → Upsells post-confirmación (venta cruzada, +1 min)
         → Logística (enviado → llegó a agencia → ...)
         → Upsells post-entrega (venta cruzada, +3 min)
      → Comentarios RRSS (interacción social) [sin documentar]

En paralelo, todo el equipo:
   → Notificaciones Automáticas (alertas internas por WhatsApp/Telegram)
```

---

## 🎯 Objetivo de esta documentación

Quiero usar esta información para **mejorar mi CRM y sus automatizaciones**. Algunas líneas de mejora que me interesa explorar (a completar/priorizar):

- [ ] Optimizar tiempos y condiciones de disparo de Rompe-Vistos para subir la tasa de reactivación/conversión.
- [ ] Mejorar copywriting de las plantillas (confirmación, logística, upsell, rompe-vistos).
- [ ] Revisar y documentar las pestañas pendientes: **Comentarios RRSS** y **Aprobación Pagos** (esta última con backlog alto de pendientes, posible cuello de botella).
- [ ] Evaluar si faltan hitos de Logística (ej. "Entregado", "No recogido/devuelto").
- [ ] Diseñar nuevas reglas de Upsell condicionadas por producto.
- [ ] Reducir fricción del requisito de "ventana de 24h" en Notificaciones (posible automatización del re-opt-in).
- [ ] Analizar métricas (impresiones, reactivaciones, conversiones) para detectar qué secuencias no están rindiendo.
