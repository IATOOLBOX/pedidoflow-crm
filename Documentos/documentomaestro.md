# PedidoFlow CRM — Documento Maestro

*Última actualización: agosto 2026*

---

## 1. Problema

En Perú, gran parte del ecommerce (especialmente tiendas pequeñas y medianas en Shopify) vende bajo la modalidad **contraentrega**: el cliente paga total o parcialmente al recibir el producto, en lugar de pagar online al momento de la compra.

Este modelo genera un cuello de botella crítico: **la venta no se cierra en el checkout, se cierra en la conversación de WhatsApp que viene después.**

Ahí es donde se pierde el negocio:

- Cuando un vendedor lanza una campaña de anuncios o una promoción por WhatsApp, **le llegan más mensajes de los que puede atender manualmente**, y se le escapan pedidos que nunca se confirman.
- Cuando un cliente compra en Shopify pero nadie hace seguimiento activo para confirmar el pedido (recordarle, pedirle el adelanto, resolver sus dudas), **la venta se cae silenciosamente** — el pedido queda como "no confirmado" y se pierde sin que el vendedor ni siquiera se entere a tiempo.
- Cuando el cliente sí paga el adelanto y envía la captura de pago por chat, alguien tiene que **verificarlo manualmente** y coordinar el envío — un proceso lento, propenso a errores, y que no escala cuando el volumen de pedidos crece.
- El seguimiento del envío (agencia de transporte, guía, estado de entrega) generalmente vive en otra pestaña, desconectado de la conversación con el cliente.

El resultado: **ventas perdidas que ya estaban "casi cerradas"**, tiempo del vendedor consumido en tareas repetitivas de bajo valor, y ningún dato consolidado para saber cuántos pedidos se pierden y en qué punto del proceso.

---

## 2. Solución

**PedidoFlow** es un CRM conversacional diseñado específicamente para ecommerce contraentrega en Perú. Conecta la tienda (Shopify), la conversación (WhatsApp Business oficial vía Meta) y la logística (agencias de envío como Shalom) en un solo lugar, con un agente de inteligencia artificial que atiende, confirma y hace seguimiento de cada pedido automáticamente — para que ningún pedido se pierda por falta de atención a tiempo.

Cuando entra un pedido nuevo desde Shopify, PedidoFlow:

1. Lo recibe automáticamente y lo muestra en un embudo visual de confirmación.
2. Contacta al cliente por WhatsApp para confirmar la compra (si el cliente ya escribió, retoma la conversación; si no, inicia el contacto).
3. Si es un envío a provincia por agencia, solicita el adelanto y los datos necesarios (DNI, dirección); si es entrega local, solo pide confirmación.
4. Si el cliente no responde, activa una secuencia automática de recordatorios (configurable por el vendedor).
5. Cuando el cliente envía la captura de pago, la deja lista para que el administrador la verifique con un clic.
6. Una vez confirmado el envío, hace seguimiento del pedido hasta la entrega.

Todo esto queda visible en tiempo real en un panel de control, con métricas de cuántos pedidos se confirman, cuántos se pierden, y en qué etapa del proceso.

---

## 3. Propuesta de valor

| Para el vendedor de ecommerce en Perú... | PedidoFlow le da... |
|---|---|
| No puede atender todos los mensajes cuando lanza una campaña | Un agente de IA que responde y confirma pedidos automáticamente, 24/7 |
| Pierde ventas de Shopify porque nadie hace seguimiento | Confirmación automática por WhatsApp apenas entra el pedido, con recordatorios si el cliente no responde |
| Verifica pagos manualmente revisando capturas una por una | Una bandeja de verificación de pagos con aprobación en un clic |
| No tiene visibilidad de cuántos pedidos se pierden y por qué | Un dashboard con embudo de conversión y métricas de confirmación |
| Usa WhatsApp personal y arriesga que le bloqueen el número | Integración oficial con Meta (WhatsApp Business API), con plantillas aprobadas y sin riesgo de baneo |
| No tiene forma fácil de trackear pedidos por agencia | Seguimiento logístico integrado, sin salir del CRM |

**En una frase:** PedidoFlow convierte cada pedido de Shopify en una conversación de WhatsApp que se confirma sola, para que el vendedor no pierda ventas por falta de tiempo.

---

## 4. Funcionalidades principales

- **Gestión de pedidos**: pipeline visual (kanban) con los estados del pedido, desde que llega hasta que se entrega.
- **Inbox de WhatsApp**: bandeja de conversaciones con el pedido y los datos del cliente siempre a la vista, con opción de que el vendedor tome el control cuando lo necesite.
- **Confirmación automática por IA**: el agente contacta al cliente, confirma la compra, resuelve dudas simples y solicita los datos que falten.
- **Seguimiento de clientes que no responden ("rompevistas")**: secuencias automáticas de recordatorio, configurables en cantidad y tiempo de espera.
- **Verificación de pagos**: recepción de capturas de pago, revisión y aprobación/rechazo desde el CRM.
- **Plantillas de WhatsApp**: mensajes preaprobados por Meta para confirmación, recordatorio, logística y entrega.
- **Integración con Shopify**: sincronización automática y bidireccional de pedidos, clientes y productos.
- **Integración con WhatsApp Business API (Meta)**: números oficiales, sin riesgo de bloqueo, con plantillas dentro de las políticas de Meta.
- **Seguimiento logístico**: registro de agencia, número de guía y estado del envío hasta la entrega.
- **Gestión de clientes**: historial de compras, etiquetas (recurrente, VIP, nuevo, problemático) y valor total del cliente.
- **Embudo comercial (pipeline CRM)**: visualización de cuántos pedidos entran, cuántos responden, cuántos confirman y cuántos se entregan — con tasas de conversión reales.
- **Dashboard de métricas**: pedidos y ventas del día, tasa de confirmación, mensajes enviados y respondidos, productos más vendidos.
- **Usuarios y permisos**: roles diferenciados (administrador, vendedor, confirmador, logística) para trabajar en equipo.

---

## 5. Usuario objetivo

**Usuario principal:** dueños de tiendas ecommerce en Perú que venden bajo modalidad contraentrega, junto con su equipo de trabajo (vendedores o personas de soporte que atienden pedidos día a día).

- Tiendas Shopify de tamaño pequeño a mediano, que generalmente empiezan siendo gestionadas por una sola persona (el dueño) y luego incorporan personal para atender WhatsApp y confirmar pedidos.
- Venden por campañas de redes sociales (Meta Ads principalmente) y reciben picos de mensajes que superan su capacidad de respuesta manual.
- Ya conocen el dolor de "vender pero no cerrar": generan tráfico y pedidos, pero pierden un porcentaje importante en el proceso de confirmación y cobro del adelanto.

---

## 6. Modelo de negocio

PedidoFlow es un **SaaS con suscripción mensual por planes** (básico / pro / enterprise), donde cada plan varía según:

- Volumen de conversaciones o mensajes de WhatsApp incluidos.
- Número de usuarios/vendedores del equipo.
- Nivel de automatización disponible (reglas de seguimiento, IA, reportes avanzados).
- Número de tiendas/integraciones conectadas.

El objetivo inicial es validar el producto con un MVP funcional (sin necesidad de replicar el 100% de las funciones de competidores ya establecidos como *Flujos Inteligentes*), priorizando las funciones que tienen mayor impacto directo en recuperar ventas perdidas: conexión con Shopify, WhatsApp Business API oficial, confirmación automática y seguimiento de clientes sin respuesta.