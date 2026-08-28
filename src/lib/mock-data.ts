export type WhatsappStatus = "wa_entrante" | "wa_interaccion" | "wa_compromiso" | "wa_seguimiento" | "confirmado" | "wa_transferido";
export type ShopifyStatus = "sh_entrante" | "sh_no_responden" | "sh_interaccion" | "sh_seguimiento" | "sh_compromiso" | "confirmado" | "sh_transferido" | "sh_descartado";
export type OrderStatus = WhatsappStatus | ShopifyStatus;

export type DeliveryStatus =
  | "por_despachar"
  | "registrado"
  | "en_transito"
  | "pendiente_recojo"
  | "incidencia"
  | "entregado"
  | "cancelado";

export type ShippingType = "local" | "agencia";

export const STATUS_STYLES: Record<string, { label: string; dot: string; badge: string; column: string }> = {
  // WhatsApp
  wa_entrante: { label: "Mensajes entrantes", dot: "bg-status-pendiente", badge: "bg-status-pendiente-soft text-status-pendiente border-status-pendiente/25", column: "border-t-status-pendiente" },
  wa_interaccion: { label: "Interacción", dot: "bg-blue-500", badge: "bg-blue-50 text-blue-500 border-blue-500/25", column: "border-t-blue-500" },
  wa_seguimiento: { label: "Seguimiento", dot: "bg-purple-500", badge: "bg-purple-50 text-purple-500 border-purple-500/25", column: "border-t-purple-500" },
  wa_compromiso: { label: "Compromiso de Pago", dot: "bg-status-compromiso", badge: "bg-status-compromiso-soft text-status-compromiso border-status-compromiso/30", column: "border-t-status-compromiso" },
  wa_transferido: { label: "Transferidos a Humanos", dot: "bg-gray-500", badge: "bg-gray-50 text-gray-500 border-gray-500/25", column: "border-t-gray-500" },

  // Shopify
  sh_entrante: { label: "Pedidos Entrantes", dot: "bg-status-pendiente", badge: "bg-status-pendiente-soft text-status-pendiente border-status-pendiente/25", column: "border-t-status-pendiente" },
  sh_no_responden: { label: "No responden (24h)", dot: "bg-status-noconfirma", badge: "bg-status-noconfirma-soft text-status-noconfirma border-status-noconfirma/30", column: "border-t-status-noconfirma" },
  sh_interaccion: { label: "Interacción", dot: "bg-blue-500", badge: "bg-blue-50 text-blue-500 border-blue-500/25", column: "border-t-blue-500" },
  sh_seguimiento: { label: "Seguimiento", dot: "bg-purple-500", badge: "bg-purple-50 text-purple-500 border-purple-500/25", column: "border-t-purple-500" },
  sh_compromiso: { label: "Compromiso de Pago", dot: "bg-status-compromiso", badge: "bg-status-compromiso-soft text-status-compromiso border-status-compromiso/30", column: "border-t-status-compromiso" },
  sh_transferido: { label: "Transferidos a Humano", dot: "bg-gray-500", badge: "bg-gray-50 text-gray-500 border-gray-500/25", column: "border-t-gray-500" },
  sh_descartado: { label: "Descartado", dot: "bg-status-anulado", badge: "bg-status-anulado-soft text-status-anulado border-status-anulado/30", column: "border-t-status-anulado" },

  // Shared
  confirmado: { label: "Confirmado", dot: "bg-status-confirmado", badge: "bg-status-confirmado-soft text-status-confirmado border-status-confirmado/30", column: "border-t-status-confirmado" },
  
  // Logistica (for UI use)
  por_despachar: { label: "Por Despachar", dot: "bg-orange-500", badge: "bg-orange-50 text-orange-500 border-orange-500/25", column: "border-t-orange-500" },
  registrado: { label: "Registrado", dot: "bg-blue-400", badge: "bg-blue-50 text-blue-400 border-blue-400/25", column: "border-t-blue-400" },
  en_transito: { label: "En Tránsito", dot: "bg-purple-400", badge: "bg-purple-50 text-purple-400 border-purple-400/25", column: "border-t-purple-400" },
  pendiente_recojo: { label: "Pendiente de Recojo", dot: "bg-yellow-500", badge: "bg-yellow-50 text-yellow-500 border-yellow-500/25", column: "border-t-yellow-500" },
  incidencia: { label: "Incidencia", dot: "bg-red-400", badge: "bg-red-50 text-red-400 border-red-400/25", column: "border-t-red-400" },
  entregado: { label: "Entregado", dot: "bg-green-500", badge: "bg-green-50 text-green-500 border-green-500/25", column: "border-t-green-500" },
  cancelado: { label: "Cancelado/Devuelto", dot: "bg-red-600", badge: "bg-red-50 text-red-600 border-red-600/25", column: "border-t-red-600" },
};

export type TimelineStep = {
  label: string;
  time?: string | undefined;
  done: boolean;
};

export type Order = {
  id: string;
  number: string;
  customer: string;
  phone: string;
  city: string;
  address: string;
  dni?: string;
  amount: number;
  advance: number;
  shipping: ShippingType;
  status: OrderStatus;
  delivery: DeliveryStatus;
  source: "whatsapp" | "shopify";
  createdAt: string;
  age: string;
  items: { name: string; qty: number; price: number }[];
  timeline: TimelineStep[];
};

const t = (steps: [string, string | undefined, boolean][]): TimelineStep[] =>
  steps.map(([label, time, done]) => ({ label, time, done }));

const baseTimeline = (upTo: number, times: (string | undefined)[] = []) => {
  const labels = [
    "Pedido creado",
    "Bot contactó al cliente",
    "Cliente confirmó",
    "Adelanto solicitado",
    "Captura recibida",
    "Pago verificado",
    "Guía Shalom generada",
    "En ruta",
    "Entregado",
  ];
  return t(labels.map((l, i) => [l, times[i], i < upTo]));
};

export const orders: Order[] = [
  {
    id: "o1",
    number: "#1234",
    customer: "Juan Pérez Quispe",
    phone: "+51 987 654 321",
    city: "Lima",
    address: "Av. Arequipa 2150, Lince",
    dni: "45872103",
    amount: 189,
    advance: 25,
    shipping: "local",
    status: "confirmado",
    delivery: "en_transito",
    source: "shopify",
    createdAt: "21 ago, 08:12",
    age: "hace 2 h",
    items: [
      { name: "Zapatillas Urban Pro talla 42", qty: 1, price: 149 },
      { name: "Medias deportivas (pack x3)", qty: 1, price: 40 },
    ],
    timeline: baseTimeline(8, [
      "08:12",
      "08:13",
      "08:41",
      "08:42",
      "09:05",
      "09:20",
      "09:35",
      "10:10",
    ]),
  },
  {
    id: "o2",
    number: "#1235",
    customer: "María López Ccahuana",
    phone: "+51 954 220 118",
    city: "Arequipa",
    address: "Calle Mercaderes 410, Cercado",
    amount: 249,
    advance: 25,
    shipping: "agencia",
    status: "wa_compromiso",
    delivery: "por_despachar",
    source: "whatsapp",
    createdAt: "21 ago, 09:02",
    age: "hace 1 h",
    items: [{ name: "Set de ollas antiadherentes 6 pz", qty: 1, price: 249 }],
    timeline: baseTimeline(5, ["09:02", "09:03", "09:25", "09:26", "09:58"]),
  },
  {
    id: "o3",
    number: "#1236",
    customer: "Carlos Ramos Vílchez",
    phone: "+51 921 774 902",
    city: "Trujillo",
    address: "Av. España 1120",
    amount: 129,
    advance: 25,
    shipping: "agencia",
    status: "sh_entrante",
    delivery: "por_despachar",
    source: "shopify",
    createdAt: "21 ago, 09:48",
    age: "hace 25 min",
    items: [{ name: "Reloj inteligente FitBand 5", qty: 1, price: 129 }],
    timeline: baseTimeline(2, ["09:48", "09:49"]),
  },
  {
    id: "o4",
    number: "#1237",
    customer: "Rosa Huamán Ttito",
    phone: "+51 933 001 244",
    city: "Cusco",
    address: "Av. La Cultura 780, Wanchaq",
    dni: "70112998",
    amount: 319,
    advance: 40,
    shipping: "agencia",
    status: "confirmado",
    delivery: "pendiente_recojo",
    source: "whatsapp",
    createdAt: "21 ago, 07:30",
    age: "hace 3 h",
    items: [
      { name: "Freidora de aire 5.5L", qty: 1, price: 279 },
      { name: "Molde silicona", qty: 2, price: 20 },
    ],
    timeline: baseTimeline(7, ["07:30", "07:31", "07:44", "07:45", "08:02", "08:15", "08:40"]),
  },
  {
    id: "o5",
    number: "#1238",
    customer: "Luis Fernández Saldaña",
    phone: "+51 900 512 366",
    city: "Piura",
    address: "Urb. Miraflores Mz. C Lt. 8, Castilla",
    amount: 99,
    advance: 25,
    shipping: "agencia",
    status: "sh_no_responden",
    delivery: "por_despachar",
    source: "shopify",
    createdAt: "20 ago, 16:20",
    age: "hace 18 h",
    items: [{ name: "Audífonos inalámbricos BassPod", qty: 1, price: 99 }],
    timeline: baseTimeline(2, ["16:20", "16:21"]),
  },
  {
    id: "o6",
    number: "#1239",
    customer: "Ana Torres Meza",
    phone: "+51 946 883 771",
    city: "Lima",
    address: "Jr. Los Cipreses 344, San Miguel",
    dni: "44120876",
    amount: 159,
    advance: 25,
    shipping: "local",
    status: "confirmado",
    delivery: "entregado",
    source: "whatsapp",
    createdAt: "20 ago, 11:05",
    age: "hace 23 h",
    items: [{ name: "Plancha de cabello Ionic", qty: 1, price: 159 }],
    timeline: baseTimeline(9, [
      "11:05",
      "11:06",
      "11:20",
      "11:21",
      "11:44",
      "11:55",
      "12:10",
      "14:30",
      "18:05",
    ]),
  },
  {
    id: "o7",
    number: "#1240",
    customer: "Pedro Ccopa Mamani",
    phone: "+51 917 445 002",
    city: "Arequipa",
    address: "Av. Ejército 1502, Yanahuara",
    amount: 210,
    advance: 30,
    shipping: "agencia",
    status: "sh_compromiso",
    delivery: "por_despachar",
    source: "shopify",
    createdAt: "21 ago, 08:55",
    age: "hace 1 h",
    items: [{ name: "Mochila antirrobo Nomad", qty: 2, price: 105 }],
    timeline: baseTimeline(4, ["08:55", "08:56", "09:12", "09:13"]),
  },
  {
    id: "o8",
    number: "#1241",
    customer: "Gabriela Ríos Panduro",
    phone: "+51 986 112 540",
    city: "Lima",
    address: "Av. Universitaria 4500, Los Olivos",
    amount: 75,
    advance: 20,
    shipping: "local",
    status: "wa_entrante",
    delivery: "por_despachar",
    source: "whatsapp",
    createdAt: "21 ago, 10:02",
    age: "hace 11 min",
    items: [{ name: "Organizador de cocina 3 niveles", qty: 1, price: 75 }],
    timeline: baseTimeline(1, ["10:02"]),
  },
  {
    id: "o9",
    number: "#1242",
    customer: "Miguel Ángel Chávez",
    phone: "+51 973 330 118",
    city: "Trujillo",
    address: "Calle Bolívar 233, Centro",
    amount: 289,
    advance: 40,
    shipping: "agencia",
    status: "sh_descartado",
    delivery: "por_despachar",
    source: "shopify",
    createdAt: "19 ago, 15:40",
    age: "hace 2 días",
    items: [{ name: "Bicicleta plegable Urbana", qty: 1, price: 289 }],
    timeline: baseTimeline(3, ["15:40", "15:41", "16:10"]),
  },
  {
    id: "o10",
    number: "#1243",
    customer: "Sofía Vargas Núñez",
    phone: "+51 902 774 316",
    city: "Cusco",
    address: "Calle Saphi 120",
    amount: 139,
    advance: 25,
    shipping: "agencia",
    status: "wa_interaccion",
    delivery: "por_despachar",
    source: "whatsapp",
    createdAt: "21 ago, 09:58",
    age: "hace 15 min",
    items: [{ name: "Termo inteligente 750ml", qty: 1, price: 139 }],
    timeline: baseTimeline(2, ["09:58", "09:59"]),
  },
  {
    id: "o11",
    number: "#1244",
    customer: "Diego Salazar Príncipe",
    phone: "+51 995 003 227",
    city: "Lima",
    address: "Av. Benavides 1802, Miraflores",
    dni: "46330217",
    amount: 420,
    advance: 50,
    shipping: "local",
    status: "confirmado",
    delivery: "por_despachar",
    source: "shopify",
    createdAt: "21 ago, 07:58",
    age: "hace 2 h",
    items: [
      { name: "Silla ergonómica ProDesk", qty: 1, price: 380 },
      { name: "Alfombrilla XL", qty: 1, price: 40 },
    ],
    timeline: baseTimeline(6, ["07:58", "07:59", "08:15", "08:16", "08:40", "08:52"]),
  },
  {
    id: "o12",
    number: "#1245",
    customer: "Katherine Flores Ayala",
    phone: "+51 964 220 981",
    city: "Piura",
    address: "Av. Grau 655",
    amount: 89,
    advance: 20,
    shipping: "agencia",
    status: "wa_compromiso",
    delivery: "por_despachar",
    source: "whatsapp",
    createdAt: "21 ago, 08:20",
    age: "hace 2 h",
    items: [{ name: "Kit de brochas de maquillaje", qty: 1, price: 89 }],
    timeline: baseTimeline(4, ["08:20", "08:21", "08:39", "08:40"]),
  },
  {
    id: "o13",
    number: "#1246",
    customer: "Jorge Medina Ruiz",
    phone: "+51 931 887 002",
    city: "Lima",
    address: "Jr. Puno 410, Cercado",
    amount: 199,
    advance: 25,
    shipping: "local",
    status: "sh_interaccion",
    delivery: "por_despachar",
    source: "shopify",
    createdAt: "20 ago, 12:15",
    age: "hace 22 h",
    items: [{ name: "Aspiradora inalámbrica 2 en 1", qty: 1, price: 199 }],
    timeline: baseTimeline(2, ["12:15", "12:16"]),
  },
  {
    id: "o14",
    number: "#1247",
    customer: "Elena Quispe Roque",
    phone: "+51 918 664 330",
    city: "Arequipa",
    address: "Calle Jerusalén 890",
    dni: "72004518",
    amount: 269,
    advance: 40,
    shipping: "agencia",
    status: "confirmado",
    delivery: "en_transito",
    source: "whatsapp",
    createdAt: "20 ago, 09:10",
    age: "hace 1 día",
    items: [{ name: "Cafetera espresso compacta", qty: 1, price: 269 }],
    timeline: baseTimeline(8, [
      "09:10",
      "09:11",
      "09:30",
      "09:31",
      "09:55",
      "10:12",
      "10:40",
      "13:20",
    ]),
  },
  {
    id: "o15",
    number: "#1248",
    customer: "Renzo Alvarado Pinto",
    phone: "+51 977 112 889",
    city: "Trujillo",
    address: "Av. Larco 1240",
    amount: 145,
    advance: 25,
    shipping: "agencia",
    status: "sh_seguimiento",
    delivery: "por_despachar",
    source: "shopify",
    createdAt: "21 ago, 10:08",
    age: "hace 5 min",
    items: [{ name: "Parlante Bluetooth Boom 20W", qty: 1, price: 145 }],
    timeline: baseTimeline(1, ["10:08"]),
  },
  {
    id: "o16",
    number: "#1249",
    customer: "Milagros Espinoza Tapia",
    phone: "+51 940 553 100",
    city: "Lima",
    address: "Av. Túpac Amaru 2200, Comas",
    amount: 119,
    advance: 25,
    shipping: "local",
    status: "wa_compromiso",
    delivery: "por_despachar",
    source: "whatsapp",
    createdAt: "21 ago, 09:33",
    age: "hace 40 min",
    items: [{ name: "Set sábanas king 400 hilos", qty: 1, price: 119 }],
    timeline: baseTimeline(4, ["09:33", "09:34", "09:50", "09:51"]),
  },
  {
    id: "o17",
    number: "#1250",
    customer: "Fernando Cárdenas Loayza",
    phone: "+51 908 771 226",
    city: "Cusco",
    address: "Av. Tullumayo 560",
    amount: 355,
    advance: 50,
    shipping: "agencia",
    status: "sh_descartado",
    delivery: "cancelado",
    source: "shopify",
    createdAt: "18 ago, 14:00",
    age: "hace 3 días",
    items: [{ name: "Horno eléctrico 45L", qty: 1, price: 355 }],
    timeline: baseTimeline(3, ["14:00", "14:02", "15:10"]),
  },
  {
    id: "o18",
    number: "#1251",
    customer: "Patricia Ninahuanca Soto",
    phone: "+51 962 004 771",
    city: "Piura",
    address: "Calle Libertad 320",
    dni: "43876220",
    amount: 179,
    advance: 25,
    shipping: "agencia",
    status: "confirmado",
    delivery: "registrado",
    source: "whatsapp",
    createdAt: "21 ago, 08:44",
    age: "hace 1 h",
    items: [{ name: "Ventilador torre silencioso", qty: 1, price: 179 }],
    timeline: baseTimeline(7, ["08:44", "08:45", "09:00", "09:01", "09:18", "09:30", "09:52"]),
  },
  {
    id: "o19",
    number: "#1252",
    customer: "Álvaro Pinedo Reátegui",
    phone: "+51 986 330 447",
    city: "Lima",
    address: "Av. La Marina 3100, San Miguel",
    amount: 65,
    advance: 20,
    shipping: "local",
    status: "sh_transferido",
    delivery: "por_despachar",
    source: "shopify",
    createdAt: "20 ago, 18:50",
    age: "hace 15 h",
    items: [{ name: "Lámpara LED de escritorio", qty: 1, price: 65 }],
    timeline: baseTimeline(2, ["18:50", "18:51"]),
  },
  {
    id: "o20",
    number: "#1253",
    customer: "Nataly Cáceres Bravo",
    phone: "+51 915 220 664",
    city: "Arequipa",
    address: "Av. Dolores 455, José Luis Bustamante",
    amount: 229,
    advance: 30,
    shipping: "agencia",
    status: "wa_seguimiento",
    delivery: "por_despachar",
    source: "whatsapp",
    createdAt: "21 ago, 10:11",
    age: "hace 2 min",
    items: [{ name: "Batidora de pie 800W", qty: 1, price: 229 }],
    timeline: baseTimeline(1, ["10:11"]),
  },
  {
    id: "o21",
    number: "#1254",
    customer: "Julio César Morales",
    phone: "+51 944 112 300",
    city: "Huancayo",
    address: "Av. Ferrocarril 880",
    dni: "41908723",
    amount: 195,
    advance: 30,
    shipping: "agencia",
    status: "confirmado",
    delivery: "incidencia",
    source: "shopify",
    createdAt: "20 ago, 14:10",
    age: "hace 1 día",
    items: [{ name: "Taladro percutor 650W", qty: 1, price: 195 }],
    timeline: baseTimeline(6, ["14:10", "14:12", "14:40", "14:41", "15:10", "15:25"]),
  },
];

export const initials = (name: string) =>
  name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

export const soles = (n: number) =>
  `S/ ${n.toLocaleString("es-PE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

export type Payment = {
  id: string;
  orderNumber: string;
  customer: string;
  city: string;
  amount: number;
  method: "Yape" | "Plin" | "Transferencia BCP" | "Interbank";
  operation: string | null;
  sentAt: string;
};

export const payments: Payment[] = [
  {
    id: "p1",
    orderNumber: "#1235",
    customer: "María López Ccahuana",
    city: "Arequipa",
    amount: 25,
    method: "Yape",
    operation: "00218847",
    sentAt: "Hoy, 09:58",
  },
  {
    id: "p2",
    orderNumber: "#1240",
    customer: "Pedro Ccopa Mamani",
    city: "Arequipa",
    amount: 30,
    method: "Plin",
    operation: "77120043",
    sentAt: "Hoy, 09:20",
  },
  {
    id: "p3",
    orderNumber: "#1245",
    customer: "Katherine Flores Ayala",
    city: "Piura",
    amount: 20,
    method: "Yape",
    operation: null,
    sentAt: "Hoy, 08:52",
  },
  {
    id: "p4",
    orderNumber: "#1249",
    customer: "Milagros Espinoza Tapia",
    city: "Lima",
    amount: 25,
    method: "Transferencia BCP",
    operation: "9930012455",
    sentAt: "Hoy, 09:51",
  },
  {
    id: "p5",
    orderNumber: "#1253",
    customer: "Nataly Cáceres Bravo",
    city: "Arequipa",
    amount: 30,
    method: "Interbank",
    operation: "44120987",
    sentAt: "Hoy, 10:14",
  },
];

export type ChatMessage = {
  id: string;
  from: "cliente" | "ia" | "vendedor";
  text?: string;
  image?: boolean;
  time: string;
};

export type Conversation = {
  id: string;
  orderId: string;
  customer: string;
  phone: string;
  last: string;
  time: string;
  unread: number;
  handledBy: "ia" | "humano";
  status: OrderStatus;
  messages: ChatMessage[];
};

export const conversations: Conversation[] = [
  {
    id: "c1",
    orderId: "o2",
    customer: "María López Ccahuana",
    phone: "+51 954 220 118",
    last: "Ya te envié la captura del Yape 🙏",
    time: "09:58",
    unread: 2,
    handledBy: "humano",
    status: "wa_compromiso",
    messages: [
      {
        id: "m1",
        from: "ia",
        text: "¡Hola María! 👋 Soy el asistente de Tienda Andina. Confirmo tu pedido #1235: Set de ollas antiadherentes 6 pz por S/ 249.00 con envío a Arequipa. ¿Es correcto?",
        time: "09:03",
      },
      { id: "m2", from: "cliente", text: "Sí, correcto", time: "09:24" },
      {
        id: "m3",
        from: "ia",
        text: "Perfecto 🙌 Como tu envío es por agencia Shalom, necesitamos un adelanto de S/ 25.00 por Yape al 987 111 222 a nombre de Tienda Andina S.A.C. Cuando lo hagas, envíame la captura por aquí.",
        time: "09:25",
      },
      { id: "m4", from: "cliente", image: true, time: "09:57" },
      { id: "m5", from: "cliente", text: "Ya te envié la captura del Yape 🙏", time: "09:58" },
    ],
  },
  {
    id: "c2",
    orderId: "o3",
    customer: "Carlos Ramos Vílchez",
    phone: "+51 921 774 902",
    last: "Hola, ¿en cuánto llega a Trujillo?",
    time: "09:52",
    unread: 1,
    handledBy: "ia",
    status: "wa_entrante",
    messages: [
      {
        id: "m1",
        from: "ia",
        text: "Hola Carlos 👋 Recibimos tu pedido #1236: Reloj inteligente FitBand 5 por S/ 129.00. ¿Confirmas la compra?",
        time: "09:49",
      },
      { id: "m2", from: "cliente", text: "Hola, ¿en cuánto llega a Trujillo?", time: "09:52" },
    ],
  },
  {
    id: "c3",
    orderId: "o1",
    customer: "Juan Pérez Quispe",
    phone: "+51 987 654 321",
    last: "Gracias, quedo atento al motorizado",
    time: "10:12",
    unread: 0,
    handledBy: "ia",
    status: "confirmado",
    messages: [
      {
        id: "m1",
        from: "ia",
        text: "¡Hola Juan! Tu pedido #1234 está confirmado para entrega contraentrega en Lince, hoy entre 2 y 6 pm.",
        time: "09:20",
      },
      { id: "m2", from: "cliente", text: "Perfecto", time: "09:22" },
      {
        id: "m3",
        from: "vendedor",
        text: "Hola Juan, soy Andrea de Tienda Andina. Tu pedido ya salió con el motorizado 🛵",
        time: "10:10",
      },
      { id: "m4", from: "cliente", text: "Gracias, quedo atento al motorizado", time: "10:12" },
    ],
  },
  {
    id: "c4",
    orderId: "o5",
    customer: "Luis Fernández Saldaña",
    phone: "+51 900 512 366",
    last: "Recordatorio 3 de 3 enviado",
    time: "Ayer",
    unread: 0,
    handledBy: "ia",
    status: "confirmado",
    messages: [
      {
        id: "m1",
        from: "ia",
        text: "Hola Luis 👋 Tienes un pedido pendiente de confirmar (#1238) por S/ 99.00. ¿Deseas continuar?",
        time: "16:21",
      },
      {
        id: "m2",
        from: "ia",
        text: "Te escribo de nuevo para confirmar tu pedido #1238. Si no recibimos respuesta hoy, lo anularemos.",
        time: "20:00",
      },
    ],
  },
  {
    id: "c5",
    orderId: "o7",
    customer: "Pedro Ccopa Mamani",
    phone: "+51 917 445 002",
    last: "Mañana te deposito, jefe",
    time: "09:20",
    unread: 1,
    handledBy: "humano",
    status: "wa_compromiso",
    messages: [
      {
        id: "m1",
        from: "ia",
        text: "Hola Pedro, para despachar tu pedido #1240 necesitamos el adelanto de S/ 30.00.",
        time: "09:13",
      },
      { id: "m2", from: "cliente", text: "Mañana te deposito, jefe", time: "09:20" },
    ],
  },
  {
    id: "c6",
    orderId: "o4",
    customer: "Rosa Huamán Ttito",
    phone: "+51 933 001 244",
    last: "Guía Shalom generada: SHL-88214",
    time: "08:40",
    unread: 0,
    handledBy: "ia",
    status: "confirmado",
    messages: [
      {
        id: "m1",
        from: "ia",
        text: "Rosa, tu pago fue verificado ✅ Ya generamos tu guía Shalom SHL-88214 para recojo en la agencia de Wanchaq.",
        time: "08:40",
      },
    ],
  },
];

export type CustomerTag = "VIP" | "Recurrente" | "Nuevo" | "Problemático" | "Confiable";

export type Customer = {
  id: string;
  name: string;
  phone: string;
  dni?: string;
  address?: string;
  city: string;
  total: number;
  confirmed: number;
  cancelled?: number;
  lastPurchase: string;
  recurrent: boolean;
  ltv: number;
  confirmationRate: number;
  tags: CustomerTag[];
  notes?: string;
};

export const customers: Customer[] = [
  {
    id: "u1",
    name: "Juan Pérez Quispe",
    phone: "+51 987 654 321",
    dni: "45892134",
    address: "Av. Brasil 1420, Dpto 402, Jesús María",
    city: "Lima",
    total: 6,
    confirmed: 5,
    cancelled: 1,
    lastPurchase: "21 ago 2026",
    recurrent: true,
    ltv: 1280,
    confirmationRate: 83,
    tags: ["VIP", "Recurrente"],
    notes: "Cliente habitual, pide entrega por las tardes. Paga puntual.",
  },
  {
    id: "u2",
    name: "María López Ccahuana",
    phone: "+51 954 220 118",
    dni: "72190843",
    address: "Calle Mercaderes 315",
    city: "Arequipa",
    total: 3,
    confirmed: 2,
    cancelled: 0,
    lastPurchase: "21 ago 2026",
    recurrent: true,
    ltv: 580,
    confirmationRate: 67,
    tags: ["Recurrente", "Confiable"],
    notes: "Prefiere envíos por agencia Shalom.",
  },
  {
    id: "u3",
    name: "Carlos Ramos Vílchez",
    phone: "+51 921 774 902",
    dni: "41982301",
    address: "Jr. Pizarro 420",
    city: "Trujillo",
    total: 1,
    confirmed: 0,
    cancelled: 1,
    lastPurchase: "21 ago 2026",
    recurrent: false,
    ltv: 0,
    confirmationRate: 0,
    tags: ["Problemático"],
    notes: "Dejó en visto en 2 ocasiones, canceló sin avisar.",
  },
  {
    id: "u4",
    name: "Rosa Huamán Ttito",
    phone: "+51 933 001 244",
    dni: "29871234",
    address: "Av. El Sol 890",
    city: "Cusco",
    total: 4,
    confirmed: 4,
    cancelled: 0,
    lastPurchase: "21 ago 2026",
    recurrent: true,
    ltv: 940,
    confirmationRate: 100,
    tags: ["VIP", "Confiable"],
    notes: "Siempre deposita adelanto inmediatamente por Yape.",
  },
  {
    id: "u5",
    name: "Luis Fernández Saldaña",
    phone: "+51 900 512 366",
    dni: "48102934",
    address: "Urb. Santa Isabel Mz B Lt 4",
    city: "Piura",
    total: 2,
    confirmed: 1,
    cancelled: 1,
    lastPurchase: "20 ago 2026",
    recurrent: false,
    ltv: 199,
    confirmationRate: 50,
    tags: ["Nuevo"],
  },
  {
    id: "u6",
    name: "Ana Torres Meza",
    phone: "+51 946 883 771",
    dni: "10982341",
    address: "Calle Los Pinos 230",
    city: "Lima",
    total: 8,
    confirmed: 8,
    cancelled: 0,
    lastPurchase: "20 ago 2026",
    recurrent: true,
    ltv: 2450,
    confirmationRate: 100,
    tags: ["VIP", "Recurrente"],
    notes: "Compradora mayorista ocasional. Excelente trato.",
  },
  {
    id: "u7",
    name: "Pedro Ccopa Mamani",
    phone: "+51 917 445 002",
    dni: "70981245",
    address: "Av. Dolores 104",
    city: "Arequipa",
    total: 2,
    confirmed: 1,
    cancelled: 1,
    lastPurchase: "21 ago 2026",
    recurrent: false,
    ltv: 230,
    confirmationRate: 50,
    tags: ["Recurrente"],
  },
  {
    id: "u8",
    name: "Diego Salazar Príncipe",
    phone: "+51 995 003 227",
    dni: "43890123",
    address: "Jr. Lampa 840",
    city: "Lima",
    total: 5,
    confirmed: 4,
    cancelled: 1,
    lastPurchase: "21 ago 2026",
    recurrent: true,
    ltv: 1120,
    confirmationRate: 80,
    tags: ["VIP", "Recurrente"],
  },
  {
    id: "u9",
    name: "Katherine Flores Ayala",
    phone: "+51 964 220 981",
    dni: "75891230",
    address: "Av. Grau 450",
    city: "Piura",
    total: 1,
    confirmed: 0,
    cancelled: 0,
    lastPurchase: "21 ago 2026",
    recurrent: false,
    ltv: 0,
    confirmationRate: 0,
    tags: ["Nuevo"],
  },
  {
    id: "u10",
    name: "Elena Quispe Roque",
    phone: "+51 918 664 330",
    dni: "44901289",
    address: "Calle San Francisco 210",
    city: "Arequipa",
    total: 3,
    confirmed: 3,
    cancelled: 0,
    lastPurchase: "20 ago 2026",
    recurrent: true,
    ltv: 760,
    confirmationRate: 100,
    tags: ["Confiable", "Recurrente"],
  },
  {
    id: "u11",
    name: "Jorge Medina Ruiz",
    phone: "+51 931 887 002",
    dni: "09812378",
    address: "Av. Perú 2410",
    city: "Lima",
    total: 2,
    confirmed: 0,
    cancelled: 2,
    lastPurchase: "20 ago 2026",
    recurrent: false,
    ltv: 0,
    confirmationRate: 0,
    tags: ["Problemático"],
    notes: "No contestó al repartidor en destino dos veces consecutivas.",
  },
  {
    id: "u12",
    name: "Nataly Cáceres Bravo",
    phone: "+51 915 220 664",
    dni: "71290341",
    address: "Urb. Challapampa A-12",
    city: "Arequipa",
    total: 1,
    confirmed: 0,
    cancelled: 0,
    lastPurchase: "21 ago 2026",
    recurrent: false,
    ltv: 0,
    confirmationRate: 0,
    tags: ["Nuevo"],
  },
];

export type TemplateButton = {
  type: "QUICK_REPLY" | "URL" | "PHONE_NUMBER";
  text: string;
  url?: string;
  phone?: string;
};

export type FunctionalCategory =
  | "confirmacion"
  | "rompe_vistos"
  | "logistica"
  | "marketing"
  | "finanzas";

export type Template = {
  id: string;
  name: string;
  category: "Marketing" | "Utilidad" | "Autenticación";
  functionalCategory: FunctionalCategory;
  status: "Aprobada" | "En revisión" | "Rechazada";
  headerType?: "text" | "image" | "video" | "document" | undefined;
  headerText?: string | undefined;
  headerMediaName?: string | undefined;
  body: string;
  footer?: string | undefined;
  buttons?: TemplateButton[] | undefined;
  sent: number;
  readRate?: number | undefined;
  clickRate?: number | undefined;
  rejectionReason?: string | undefined;
  updatedAt?: string | undefined;
};

export const templates: Template[] = [
  // 1. CONFIRMACIÓN
  {
    id: "t1",
    name: "confirmacion_pedido_v3",
    category: "Utilidad",
    functionalCategory: "confirmacion",
    status: "Aprobada",
    headerType: "text",
    headerText: "Tienda Andina — Confirmación de Compra",
    body: "¡Hola {{nombre_cliente}}! 👋 Recibimos tu pedido #{{numero_pedido}} de {{productos}} por un total de S/ {{monto}} con pago contraentrega en {{direccion}} ({{ciudad}}). ¿Confirmas los datos para programar tu entrega?",
    footer: "PedidoFlow · Delivery Seguro",
    buttons: [
      { type: "QUICK_REPLY", text: "✅ Sí, confirmo mi pedido" },
      { type: "QUICK_REPLY", text: "❌ Deseo modificar datos" },
    ],
    sent: 1482,
    readRate: 94,
    clickRate: 81,
    updatedAt: "Hace 2 días",
  },
  {
    id: "t2",
    name: "pedido_preliminar_carrito",
    category: "Utilidad",
    functionalCategory: "confirmacion",
    status: "Aprobada",
    body: "Hola {{nombre_cliente}} 👋 Vimos que dejaste un pedido preliminar de {{productos}} por S/ {{monto}}. ¿Deseas que te lo separemos con pago contraentrega antes de agotar existencias?",
    footer: "Responde este mensaje para atenderte",
    buttons: [
      { type: "QUICK_REPLY", text: "📦 Confirmar mi compra" },
      { type: "QUICK_REPLY", text: "💬 Hablar con un asesor" },
    ],
    sent: 904,
    readRate: 91,
    clickRate: 74,
    updatedAt: "Hace 5 días",
  },
  {
    id: "t7",
    name: "verificacion_cobertura_referencia",
    category: "Utilidad",
    functionalCategory: "confirmacion",
    status: "Aprobada",
    body: "{{nombre_cliente}}, para asegurar la llegada exacta de nuestro repartidor a {{distrito}}, ¿podrías brindarnos una referencia cercana o cruce de calles de tu dirección?",
    footer: "Tienda Andina Logística",
    buttons: [
      { type: "QUICK_REPLY", text: "📍 Enviar referencia" },
      { type: "QUICK_REPLY", text: "Cambiar fecha de entrega" },
    ],
    sent: 430,
    readRate: 92,
    clickRate: 69,
    updatedAt: "Hace 1 semana",
  },

  // 2. ROMPE-VISTOS & RECUPERACIÓN
  {
    id: "t8",
    name: "rompe_visto_cupon_descuento",
    category: "Marketing",
    functionalCategory: "rompe_vistos",
    status: "Aprobada",
    headerType: "image",
    headerMediaName: "promo_medias_bamboo.jpg",
    body: "¡Hola {{nombre_cliente}}! 🔥 Vimos que te quedaste a un paso de separar tu pedido de {{productos}}. Para que no te quedes sin stock, hoy te activamos el cupón exclusivo [{{cupon}}] con delivery gratis.",
    footer: "Válido por 12 horas",
    buttons: [
      { type: "QUICK_REPLY", text: "🎁 Aprovechar cupón ahora" },
      { type: "QUICK_REPLY", text: "No por el momento" },
    ],
    sent: 780,
    readRate: 88,
    clickRate: 63,
    updatedAt: "Hace 3 días",
  },
  {
    id: "t9",
    name: "rompe_visto_stock_critico",
    category: "Marketing",
    functionalCategory: "rompe_vistos",
    status: "Aprobada",
    body: "⚠️ {{nombre_cliente}}, solo nos quedan las últimas 2 unidades de {{productos}} para despacho hoy. ¿Deseas que mantengamos tu paquete reservado o liberamos el stock a otro cliente?",
    buttons: [
      { type: "QUICK_REPLY", text: "⚡ Mantener mi paquete" },
      { type: "QUICK_REPLY", text: "Liberar pedido" },
    ],
    sent: 512,
    readRate: 89,
    clickRate: 58,
    updatedAt: "Hace 4 días",
  },
  {
    id: "t10",
    name: "rompe_visto_renegociacion_fecha",
    category: "Utilidad",
    functionalCategory: "rompe_vistos",
    status: "En revisión",
    body: "Hola {{nombre_cliente}}, entendemos que hoy puedes estar ocupado. ¿Te gustaría coordinar la entrega de {{productos}} para este fin de semana o cuando estés disponible en casa?",
    footer: "Horarios flexibles de entrega",
    buttons: [
      { type: "QUICK_REPLY", text: "🗓️ Programar para el sábado" },
      { type: "QUICK_REPLY", text: "Elegir otra fecha" },
    ],
    sent: 0,
    readRate: 0,
    clickRate: 0,
    updatedAt: "Enviado hace 3 horas",
  },

  // 3. LOGÍSTICA & DESPACHO
  {
    id: "t4",
    name: "guia_shalom_generada",
    category: "Utilidad",
    functionalCategory: "logistica",
    status: "Aprobada",
    headerType: "text",
    headerText: "🚚 ¡Tu pedido ya fue despachado por Shalom!",
    body: "¡Buenas noticias {{nombre_cliente}}! 📦 Tu pedido de {{productos}} ya se encuentra en camino por agencia {{agencia}}.\n\n🔢 Número de Guía: {{codigo_guia}}\n🏢 Destino: Agencia {{ciudad}}\n💰 Saldo a cancelar al recoger: S/ {{monto}}\n\nPuedes consultar el estado de tu guía en cualquier momento.",
    footer: "Conserva tu número de guía",
    buttons: [
      { type: "URL", text: "🔎 Rastrear en Shalom", url: "https://shalom.pe/rastreo" },
      { type: "QUICK_REPLY", text: "💬 Consulta sobre el envío" },
    ],
    sent: 1120,
    readRate: 98,
    clickRate: 87,
    updatedAt: "Aprobada recientemente",
  },
  {
    id: "t11",
    name: "aviso_llegada_agencia_dni",
    category: "Utilidad",
    functionalCategory: "logistica",
    status: "Aprobada",
    headerType: "text",
    headerText: "🏢 Tu paquete está listo para recojo",
    body: "¡Hola {{nombre_cliente}}! 📦 Tu paquete llegó a la agencia {{agencia}} de {{ciudad}} y ya está disponible en ventanilla.\n\n🔢 Guía: {{codigo_guia}}\n⚠️ IMPORTANTE: Recuerda presentar tu DNI FÍSICO en ventanilla para retirar tu paquete.\n\nHorario de atención: Lun a Sáb de 8:00 AM a 6:00 PM.",
    footer: "Evita el retorno de tu paquete",
    buttons: [
      { type: "QUICK_REPLY", text: "✅ Recojo hoy mismo" },
      { type: "QUICK_REPLY", text: "Iré mañana por la mañana" },
    ],
    sent: 890,
    readRate: 97,
    clickRate: 84,
    updatedAt: "Hace 1 día",
  },
  {
    id: "t12",
    name: "repartidor_contraentrega_en_ruta",
    category: "Utilidad",
    functionalCategory: "logistica",
    status: "Aprobada",
    body: "🛵 ¡Hola {{nombre_cliente}}! Nuestro repartidor está en ruta hacia tu dirección {{direccion}}. Llegará en el transcurso de las próximas horas. Ten a la mano el monto exacto de S/ {{monto}} en efectivo o Yape.",
    buttons: [
      { type: "QUICK_REPLY", text: "👍 Estaré atento en casa" },
      { type: "QUICK_REPLY", text: "Dejar con recepción/familiar" },
    ],
    sent: 670,
    readRate: 96,
    clickRate: 79,
    updatedAt: "Hace 4 días",
  },
  {
    id: "t13",
    name: "incidencia_retraso_recojo_shalom",
    category: "Utilidad",
    functionalCategory: "logistica",
    status: "En revisión",
    body: "⚠️ Aviso urgente {{nombre_cliente}}: Tu paquete con guía {{codigo_guia}} lleva 48h en la agencia {{agencia}} sin ser retirado. Las agencias retornan paquetes al 4to día. ¿Podrás acercarte hoy a recogerlo?",
    buttons: [
      { type: "QUICK_REPLY", text: "🏃 Voy en camino a recoger" },
      { type: "QUICK_REPLY", text: "Enviar a un apoderado con carta" },
    ],
    sent: 0,
    readRate: 0,
    clickRate: 0,
    updatedAt: "Enviado hace 6 horas",
  },

  // 4. FINANZAS & COBRANZA
  {
    id: "t3",
    name: "solicitud_adelanto_agencia",
    category: "Utilidad",
    functionalCategory: "finanzas",
    status: "Aprobada",
    headerType: "text",
    headerText: "Garantía de Despacho a Provincia",
    body: "Hola {{nombre_cliente}} 🙌 Para despacharte por agencia {{agencia}} requerimos un adelanto de flete de S/ {{monto_adelanto}}. El saldo de S/ {{monto_saldo}} lo cancelas al retirar tu paquete en la agencia.\n\nPuedes yapear al 987 111 222 a nombre de Tienda Andina y adjuntar la captura aquí.",
    footer: "Pago seguro y verificado",
    buttons: [
      { type: "QUICK_REPLY", text: "📲 Ya envié la captura" },
      { type: "QUICK_REPLY", text: "Solicitar número de cuenta BCP" },
    ],
    sent: 618,
    readRate: 93,
    clickRate: 71,
    updatedAt: "Hace 2 semanas",
  },
  {
    id: "t14",
    name: "pago_adelanto_confirmado_recibo",
    category: "Utilidad",
    functionalCategory: "finanzas",
    status: "Aprobada",
    body: "¡Pago confirmado {{nombre_cliente}}! 🎉 Recibimos tu adelanto de S/ {{monto_adelanto}} con éxito. Tu pedido #{{numero_pedido}} ha pasado al área de empaque prioritario.",
    footer: "Gracias por tu confianza",
    buttons: [
      { type: "QUICK_REPLY", text: "📦 Ver estado de empaque" },
    ],
    sent: 580,
    readRate: 99,
    clickRate: 65,
    updatedAt: "Hace 1 semana",
  },

  // 5. MARKETING & UPSELLS
  {
    id: "t15",
    name: "upsell_catalogo_temporada_pdf",
    category: "Marketing",
    functionalCategory: "marketing",
    status: "Aprobada",
    headerType: "document",
    headerMediaName: "Catalogo_Temporada_2026.pdf",
    body: "¡Hola {{nombre_cliente}}! 🌟 Te compartimos en exclusiva nuestro Catálogo Completo de Temporada en PDF con promociones especiales de hasta 30% OFF en productos seleccionados.",
    footer: "Válido para compras este mes",
    buttons: [
      { type: "QUICK_REPLY", text: "📄 Abrir Catálogo PDF" },
      { type: "QUICK_REPLY", text: "Quiero consultar una oferta" },
    ],
    sent: 430,
    readRate: 85,
    clickRate: 52,
    updatedAt: "Hace 3 días",
  },
  {
    id: "t16",
    name: "agradecimiento_entrega_recompra",
    category: "Marketing",
    functionalCategory: "marketing",
    status: "Aprobada",
    body: "¡Esperamos que disfrutes tu compra {{nombre_cliente}}! 🎉 Como cliente preferente, tienes S/ 20.00 de descuento en tu próximo pedido usando el cupón [GRACIAS20]. ¿Te gustaría ver las novedades de la semana?",
    buttons: [
      { type: "QUICK_REPLY", text: "🎁 Ver novedades con cupón" },
      { type: "QUICK_REPLY", text: "Calificar el servicio" },
    ],
    sent: 340,
    readRate: 89,
    clickRate: 48,
    updatedAt: "Hace 5 días",
  },
  {
    id: "t5",
    name: "promo_fin_de_semana_urgencia",
    category: "Marketing",
    functionalCategory: "marketing",
    status: "Rechazada",
    body: "{{nombre_cliente}}, 30% de descuento solo este finde en toda la tienda 🔥 ¡Compra ya antes de que se agote todo! Responde PROMO.",
    rejectionReason: "Meta rechazó la plantilla debido a políticas de formato: El texto contiene caracteres que inducen urgencia engañosa y falta de especificación del producto o servicio ofrecido.",
    sent: 0,
    readRate: 0,
    clickRate: 0,
    updatedAt: "Rechazada por Meta",
  },
  {
    id: "t6",
    name: "codigo_verificacion_seguridad",
    category: "Autenticación",
    functionalCategory: "confirmacion",
    status: "Aprobada",
    body: "Tu código de verificación de Tienda Andina es {{codigo}}. No compartas este código con nadie por seguridad.",
    footer: "Seguridad de Cuenta",
    sent: 210,
    readRate: 98,
    clickRate: 0,
    updatedAt: "Hace 1 mes",
  },
];

export const activity = [
  { id: "a1", text: "Juan Pérez confirmó su pedido #1234", time: "hace 8 min", tone: "confirmado" as OrderStatus },
  { id: "a2", text: "Nueva captura de pago de María López", time: "hace 14 min", tone: "wa_compromiso" as OrderStatus },
  { id: "a3", text: "Pedido #1230 en ruta con Shalom", time: "hace 32 min", tone: "confirmado" as OrderStatus },
  { id: "a4", text: "Luis Fernández no respondió al 3er recordatorio", time: "hace 1 h", tone: "sh_no_responden" as OrderStatus },
  { id: "a5", text: "Pedido #1242 anulado por el vendedor", time: "hace 2 h", tone: "sh_descartado" as OrderStatus },
  { id: "a6", text: "Rosa Huamán envió su DNI para la agencia", time: "hace 3 h", tone: "wa_entrante" as OrderStatus },
];

export type UserRole = "Administrador" | "Ventas" | "Logística" | "Soporte / Asesor";
export type UserStatus = "Activo" | "Inactivo";
export type AccessType = "Indefinido" | "Temporal";

export type CRMModule =
  | "dashboard"
  | "pedidos"
  | "confirmados"
  | "conversaciones"
  | "pagos"
  | "clientes"
  | "workflows"
  | "plantillas"
  | "integraciones"
  | "configuracion"
  | "equipo";

export type User = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  lastActive: string;
  avatar: string;
  permissions: string[];
  functions?: string | undefined;
  accessModules?: CRMModule[] | undefined;
  accessType?: AccessType | undefined;
  temporaryDuration?: string | undefined;
  expiresAt?: string | undefined;
};

export const users: User[] = [
  {
    id: "usr1",
    name: "Andrea Vega",
    email: "andrea@tiendaandina.pe",
    role: "Administrador",
    status: "Activo",
    lastActive: "En línea",
    avatar: "AV",
    permissions: ["all"],
    functions: "Supervisión general, configuración de bots e integraciones de pago",
    accessModules: ["dashboard", "pedidos", "confirmados", "conversaciones", "pagos", "clientes", "workflows", "plantillas", "integraciones", "configuracion", "equipo"],
    accessType: "Indefinido",
  },
  {
    id: "usr2",
    name: "Luis Castillo",
    email: "luis.ventas@tiendaandina.pe",
    role: "Ventas",
    status: "Activo",
    lastActive: "Hace 15 min",
    avatar: "LC",
    permissions: ["view_orders", "edit_orders", "send_messages", "approve_payments"],
    functions: "Confirmar pedidos COD por WhatsApp y validar vouchers Yape/Plin",
    accessModules: ["dashboard", "pedidos", "confirmados", "conversaciones", "pagos", "clientes"],
    accessType: "Indefinido",
  },
  {
    id: "usr3",
    name: "Carmen Rojas",
    email: "carmen.logistica@tiendaandina.pe",
    role: "Logística",
    status: "Activo",
    lastActive: "Hace 2 horas",
    avatar: "CR",
    permissions: ["view_orders", "update_delivery_status", "generate_labels"],
    functions: "Despacho de pedidos, emisión de guías Shalom y coordinación con olva/motorizados",
    accessModules: ["pedidos", "confirmados"],
    accessType: "Temporal",
    temporaryDuration: "30 días",
    expiresAt: "27 de Septiembre, 2026",
  },
  {
    id: "usr4",
    name: "Diego Sánchez",
    email: "diego.ventas@tiendaandina.pe",
    role: "Ventas",
    status: "Inactivo",
    lastActive: "Hace 3 días",
    avatar: "DS",
    permissions: ["view_orders", "edit_orders", "send_messages"],
    functions: "Apoyo temporal en campañas de Rompe-Vistos de fin de semana",
    accessModules: ["conversaciones", "plantillas"],
    accessType: "Temporal",
    temporaryDuration: "7 días (Expirado)",
    expiresAt: "25 de Agosto, 2026",
  },
];
