export type ConfirmStatus =
  | "pendiente"
  | "compromiso"
  | "confirmado"
  | "noconfirma"
  | "anulado";

export type DeliveryStatus =
  | "por_despachar"
  | "guia_generada"
  | "en_ruta"
  | "entregado"
  | "devuelto";

export type ShippingType = "local" | "agencia";

export const CONFIRM_STATUS: Record<
  ConfirmStatus,
  { label: string; dot: string; badge: string; column: string }
> = {
  pendiente: {
    label: "Pendiente",
    dot: "bg-status-pendiente",
    badge: "bg-status-pendiente-soft text-status-pendiente border-status-pendiente/25",
    column: "border-t-status-pendiente",
  },
  compromiso: {
    label: "Compromiso de pago",
    dot: "bg-status-compromiso",
    badge: "bg-status-compromiso-soft text-status-compromiso border-status-compromiso/30",
    column: "border-t-status-compromiso",
  },
  confirmado: {
    label: "Confirmado",
    dot: "bg-status-confirmado",
    badge: "bg-status-confirmado-soft text-status-confirmado border-status-confirmado/30",
    column: "border-t-status-confirmado",
  },
  noconfirma: {
    label: "No confirma",
    dot: "bg-status-noconfirma",
    badge: "bg-status-noconfirma-soft text-status-noconfirma border-status-noconfirma/30",
    column: "border-t-status-noconfirma",
  },
  anulado: {
    label: "Anulado",
    dot: "bg-status-anulado",
    badge: "bg-status-anulado-soft text-status-anulado border-status-anulado/30",
    column: "border-t-status-anulado",
  },
};

export const DELIVERY_STATUS: Record<DeliveryStatus, string> = {
  por_despachar: "Por despachar",
  guia_generada: "Guía generada",
  en_ruta: "En ruta",
  entregado: "Entregado",
  devuelto: "Devuelto",
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
  status: ConfirmStatus;
  delivery: DeliveryStatus;
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
    delivery: "en_ruta",
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
    status: "compromiso",
    delivery: "por_despachar",
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
    status: "pendiente",
    delivery: "por_despachar",
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
    delivery: "guia_generada",
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
    status: "noconfirma",
    delivery: "por_despachar",
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
    status: "compromiso",
    delivery: "por_despachar",
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
    status: "pendiente",
    delivery: "por_despachar",
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
    status: "anulado",
    delivery: "por_despachar",
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
    status: "pendiente",
    delivery: "por_despachar",
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
    status: "compromiso",
    delivery: "por_despachar",
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
    status: "noconfirma",
    delivery: "por_despachar",
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
    delivery: "en_ruta",
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
    status: "pendiente",
    delivery: "por_despachar",
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
    status: "compromiso",
    delivery: "por_despachar",
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
    status: "anulado",
    delivery: "devuelto",
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
    delivery: "guia_generada",
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
    status: "noconfirma",
    delivery: "por_despachar",
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
    status: "pendiente",
    delivery: "por_despachar",
    createdAt: "21 ago, 10:11",
    age: "hace 2 min",
    items: [{ name: "Batidora de pie 800W", qty: 1, price: 229 }],
    timeline: baseTimeline(1, ["10:11"]),
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
  status: ConfirmStatus;
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
    status: "compromiso",
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
    status: "pendiente",
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
    status: "noconfirma",
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
    status: "compromiso",
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

export type Customer = {
  id: string;
  name: string;
  phone: string;
  city: string;
  total: number;
  confirmed: number;
  lastPurchase: string;
  recurrent: boolean;
};

export const customers: Customer[] = [
  { id: "u1", name: "Juan Pérez Quispe", phone: "+51 987 654 321", city: "Lima", total: 6, confirmed: 5, lastPurchase: "21 ago 2026", recurrent: true },
  { id: "u2", name: "María López Ccahuana", phone: "+51 954 220 118", city: "Arequipa", total: 3, confirmed: 2, lastPurchase: "21 ago 2026", recurrent: true },
  { id: "u3", name: "Carlos Ramos Vílchez", phone: "+51 921 774 902", city: "Trujillo", total: 1, confirmed: 0, lastPurchase: "21 ago 2026", recurrent: false },
  { id: "u4", name: "Rosa Huamán Ttito", phone: "+51 933 001 244", city: "Cusco", total: 4, confirmed: 4, lastPurchase: "21 ago 2026", recurrent: true },
  { id: "u5", name: "Luis Fernández Saldaña", phone: "+51 900 512 366", city: "Piura", total: 2, confirmed: 1, lastPurchase: "20 ago 2026", recurrent: false },
  { id: "u6", name: "Ana Torres Meza", phone: "+51 946 883 771", city: "Lima", total: 8, confirmed: 8, lastPurchase: "20 ago 2026", recurrent: true },
  { id: "u7", name: "Pedro Ccopa Mamani", phone: "+51 917 445 002", city: "Arequipa", total: 2, confirmed: 1, lastPurchase: "21 ago 2026", recurrent: false },
  { id: "u8", name: "Diego Salazar Príncipe", phone: "+51 995 003 227", city: "Lima", total: 5, confirmed: 4, lastPurchase: "21 ago 2026", recurrent: true },
  { id: "u9", name: "Katherine Flores Ayala", phone: "+51 964 220 981", city: "Piura", total: 1, confirmed: 0, lastPurchase: "21 ago 2026", recurrent: false },
  { id: "u10", name: "Elena Quispe Roque", phone: "+51 918 664 330", city: "Arequipa", total: 3, confirmed: 3, lastPurchase: "20 ago 2026", recurrent: true },
  { id: "u11", name: "Jorge Medina Ruiz", phone: "+51 931 887 002", city: "Lima", total: 2, confirmed: 0, lastPurchase: "20 ago 2026", recurrent: false },
  { id: "u12", name: "Nataly Cáceres Bravo", phone: "+51 915 220 664", city: "Arequipa", total: 1, confirmed: 0, lastPurchase: "21 ago 2026", recurrent: false },
];

export type Template = {
  id: string;
  name: string;
  category: "Marketing" | "Utilidad" | "Autenticación";
  status: "Aprobada" | "En revisión" | "Rechazada";
  body: string;
  sent: number;
};

export const templates: Template[] = [
  {
    id: "t1",
    name: "confirmacion_pedido_v3",
    category: "Utilidad",
    status: "Aprobada",
    body: "Hola {{nombre_cliente}} 👋 Recibimos tu pedido {{numero_pedido}} por {{monto}}. ¿Confirmas la compra contraentrega?",
    sent: 1284,
  },
  {
    id: "t2",
    name: "recordatorio_confirmacion",
    category: "Utilidad",
    status: "Aprobada",
    body: "{{nombre_cliente}}, tu pedido {{numero_pedido}} sigue pendiente de confirmar. Responde SÍ para separarlo hoy.",
    sent: 902,
  },
  {
    id: "t3",
    name: "solicitud_adelanto_agencia",
    category: "Utilidad",
    status: "Aprobada",
    body: "Para enviarte por agencia necesitamos un adelanto de {{monto_adelanto}}. Yapea al 987 111 222 y envíanos la captura 🙌",
    sent: 618,
  },
  {
    id: "t4",
    name: "guia_shalom_generada",
    category: "Utilidad",
    status: "En revisión",
    body: "¡Listo {{nombre_cliente}}! Tu guía Shalom es {{codigo_guia}}. Puedes recogerla en la agencia de {{ciudad}}.",
    sent: 0,
  },
  {
    id: "t5",
    name: "promo_fin_de_semana",
    category: "Marketing",
    status: "Rechazada",
    body: "{{nombre_cliente}}, 30% de descuento solo este finde en toda la tienda 🔥 Responde PROMO.",
    sent: 0,
  },
  {
    id: "t6",
    name: "codigo_verificacion",
    category: "Autenticación",
    status: "Aprobada",
    body: "Tu código de verificación es {{codigo}}. No lo compartas con nadie.",
    sent: 210,
  },
];

export const activity = [
  { id: "a1", text: "Juan Pérez confirmó su pedido #1234", time: "hace 8 min", tone: "confirmado" as ConfirmStatus },
  { id: "a2", text: "Nueva captura de pago de María López", time: "hace 14 min", tone: "compromiso" as ConfirmStatus },
  { id: "a3", text: "Pedido #1230 en ruta con Shalom", time: "hace 32 min", tone: "confirmado" as ConfirmStatus },
  { id: "a4", text: "Luis Fernández no respondió al 3er recordatorio", time: "hace 1 h", tone: "noconfirma" as ConfirmStatus },
  { id: "a5", text: "Pedido #1242 anulado por el vendedor", time: "hace 2 h", tone: "anulado" as ConfirmStatus },
  { id: "a6", text: "Rosa Huamán envió su DNI para la agencia", time: "hace 3 h", tone: "pendiente" as ConfirmStatus },
];
