// Cuestionario para el dueño (versión web de docs/07-cuestionario-dueno.md).
// Herramienta interna en español: no forma parte del sitio público ni de los
// diccionarios. Si cambias una pregunta aquí, cámbiala también en docs/07.

export type Question =
  | { id: string; star?: boolean; text: string; help?: string; kind: "text" | "textarea"; placeholder?: string }
  | { id: string; star?: boolean; text: string; help?: string; kind: "single" | "multi"; options: string[]; other?: boolean; extra?: string }
  | { id: string; star?: boolean; text: string; help?: string; kind: "matrix"; rows: string[]; cols: string[] }
  | { id: string; star?: boolean; text: string; help?: string; kind: "fields"; fields: { id: string; label: string; multiline?: boolean }[] };

export type Section = { id: string; title: string; intro?: string; questions: Question[] };

export const questionnaire: Section[] = [
  {
    id: "A",
    title: "La empresa",
    questions: [
      { id: "A1", star: true, kind: "text", text: "¿Qué significa \"DHC\"?", help: "Iniciales de nombres, apellidos, otra cosa…" },
      {
        id: "A2", star: true, kind: "fields", text: "Nombre legal registrado de la empresa y tipo de empresa",
        fields: [
          { id: "nombre", label: "Nombre legal exacto (p. ej. \"DHC Woodcraft & Installation LLC\")" },
          { id: "tipo", label: "Tipo: LLC, sole proprietor (persona física), corporation, otro" },
        ],
      },
      {
        id: "A3", kind: "fields", text: "¿Desde qué año trabajas en carpintería? ¿En qué año empezó DHC?",
        fields: [
          { id: "carpinteria", label: "Carpintería desde (año)" },
          { id: "dhc", label: "DHC desde (año)" },
        ],
      },
      {
        id: "A4", kind: "single", text: "¿Cómo se llama el dueño (o dueños)? ¿Quieres aparecer en la web?",
        options: ["Sí, con nombre y foto", "Solo con nombre", "Prefiero no aparecer"], extra: "Nombre(s)",
      },
      { id: "A5", kind: "textarea", text: "¿Cuántas personas forman el equipo? ¿Son empleados propios, subcontratistas o una mezcla?" },
      { id: "A6", kind: "textarea", text: "Cuéntanos la historia de DHC en 3–5 frases", help: "¿Cómo empezó? ¿De dónde eres? ¿Qué es lo que más te gusta de este oficio?" },
      { id: "A7", kind: "textarea", text: "¿Qué idiomas habla el equipo? ¿Quién atiende a los clientes en inglés y quién en español?" },
    ],
  },
  {
    id: "B",
    title: "Contacto y horario",
    questions: [
      {
        id: "B1", star: true, kind: "fields", text: "Confirma los teléfonos",
        fields: [
          { id: "en", label: "(737) 267-9565 · inglés: ¿es correcto? ¿quién contesta? ¿recibe mensajes de texto (SMS)?" },
          { id: "es", label: "(737) 400-1540 · español: ¿es correcto? ¿quién contesta? ¿recibe mensajes de texto (SMS)?" },
        ],
      },
      {
        id: "B2", star: true, kind: "single", text: "¿Usan WhatsApp con clientes? ¿Quieres un botón de WhatsApp en la web?",
        options: ["Sí, y quiero el botón en la web", "Sí, pero sin botón en la web", "No usamos WhatsApp"], extra: "Número de WhatsApp",
      },
      { id: "B3", star: true, kind: "text", text: "¿Qué correo electrónico quieres mostrar en la web?" },
      {
        id: "B4", star: true, kind: "single", text: "¿Tienen un local, taller u oficina donde reciban clientes?",
        help: "La dirección o zona tiene que coincidir exactamente con la de tu perfil de Google.",
        options: ["Sí, y se puede publicar la dirección", "Sí, pero prefiero no publicarla", "No, trabajamos solo en casa del cliente"], extra: "Dirección (si se puede publicar)",
      },
      {
        id: "B5", star: true, kind: "fields", text: "¿Cuál es tu horario de atención?",
        fields: [
          { id: "lv", label: "Lunes a viernes" },
          { id: "sab", label: "Sábado" },
          { id: "dom", label: "Domingo" },
          { id: "urg", label: "¿Atiendes urgencias fuera de horario?" },
        ],
      },
      {
        id: "B6", star: true, kind: "single", text: "Cuando alguien deja un mensaje o llena el formulario, ¿en cuánto tiempo le respondes normalmente?",
        options: ["El mismo día", "En 1 día hábil", "En 2–3 días hábiles"],
      },
      {
        id: "B7", kind: "text", text: "¿Cómo prefieres que te contacten primero los clientes nuevos?",
        help: "Ordena del 1 al 4: llamada, mensaje de texto, WhatsApp, formulario de la web.",
      },
    ],
  },
  {
    id: "C",
    title: "Servicios",
    questions: [
      {
        id: "C1", star: true, kind: "matrix", text: "Marca los servicios que ofreces y cuánto trabajo representa cada uno",
        cols: ["Mucho", "Algo", "Poco", "No lo hacemos"],
        rows: [
          "Remodelación de cocinas",
          "Gabinetes a medida y empotrados (cocina, baño, clóset)",
          "Vigas y techos de madera (interior)",
          "Molduras y acabados (crown molding, zócalos, wainscoting)",
          "Instalación de puertas",
          "Decks, techos de patio y pérgolas",
          "Framing (estructura de muros, ampliaciones)",
          "Carpintería general y reparaciones",
        ],
      },
      {
        id: "C2", star: true, kind: "single", text: "Cuando hablamos de \"techos\", ¿a qué te refieres?",
        options: [
          "Techos de madera y vigas (interior: cielos rasos, machihembrado, vigas decorativas)",
          "Techados / roofing (exterior: tejas, impermeabilización)",
          "Las dos cosas",
        ],
      },
      {
        id: "C3", kind: "multi", text: "¿Haces otros trabajos que no están en la lista?", other: true,
        options: [
          "Clósets a medida", "Escaleras y barandales", "Pisos de madera", "Cercas (fences)", "Siding / revestimiento exterior",
          "Paredes con paneles de madera", "Muebles a medida", "Repisas flotantes / libreros", "Mantel de chimenea",
          "Reparación de madera podrida (wood rot)", "Ventanas", "Gabinetes de garaje",
        ],
      },
      { id: "C4", kind: "textarea", text: "¿Hay trabajos que NO haces o por los que no quieres recibir llamadas?" },
      {
        id: "C5", star: true, kind: "single", text: "¿Fabricas tú mismo los gabinetes y las piezas, o los compras hechos y los instalas?",
        options: ["Fabricamos en nuestro propio taller", "Depende del proyecto: a veces fabricamos y a veces compramos", "Solo instalamos"],
      },
      { id: "C6", kind: "textarea", text: "¿Ayudas al cliente con el diseño?", help: "Dibujos, medidas, renders, elección de materiales." },
      { id: "C7", kind: "textarea", text: "En remodelaciones completas, ¿trabajas con plomeros, electricistas, pintores, etc.? ¿Coordinas tú todo el proyecto?" },
      {
        id: "C8", kind: "single", text: "¿Te encargas de los permisos municipales cuando hacen falta?",
        help: "Por ejemplo para framing, ampliaciones o decks.", options: ["Sí", "No, los gestiona el cliente", "Depende"],
      },
      { id: "C9", kind: "textarea", text: "¿Hay un tamaño mínimo de trabajo? ¿Aceptas trabajos pequeños, como instalar una sola puerta o hacer una reparación?" },
      { id: "C10", kind: "textarea", text: "¿Con qué estilos y materiales trabajas más?", help: "Gabinetes shaker o inset, cedro, madera tratada, compuesto tipo Trex, maderas duras…" },
      { id: "C11", kind: "textarea", text: "¿Qué tipo de proyecto te gustaría conseguir más?", help: "El más rentable o el que más disfrutas." },
    ],
  },
  {
    id: "D",
    title: "Cómo trabajas",
    questions: [
      {
        id: "D1", star: true, kind: "single", text: "¿El estimado es gratis?",
        options: ["Sí, siempre, y es en casa del cliente", "Sí, pero solo dentro de una zona", "Se cobra en algunos casos"], extra: "Zona o casos en que se cobra",
      },
      { id: "D2", star: true, kind: "textarea", text: "¿Entregas la cotización por escrito y detallada (materiales, mano de obra, alcance)? ¿Cuántos días después de la visita?" },
      { id: "D3", star: true, kind: "single", text: "¿Las mismas personas que hacen la cotización son las que hacen el trabajo?", options: ["Sí", "No", "A veces"] },
      { id: "D4", star: true, kind: "textarea", text: "Durante la obra, ¿hacen limpieza diaria, controlan el polvo o protegen pisos y muebles?" },
      { id: "D5", kind: "textarea", text: "¿Cuánto suele durar un proyecto típico?", help: "2–3 ejemplos: \"gabinetes de cocina: X semanas\", \"deck: X días\"…" },
      {
        id: "D6", kind: "fields", text: "¿Cómo cobras? (solo lo publicamos si quieres)",
        fields: [
          { id: "anticipo", label: "Anticipo (%)" },
          { id: "formas", label: "Formas de pago (efectivo, cheque, tarjeta, Zelle, otro)" },
          { id: "fin", label: "¿Ofreces financiamiento?" },
          { id: "publicar", label: "¿Quieres que esto aparezca en la web?" },
        ],
      },
      { id: "D7", star: true, kind: "textarea", text: "¿Das garantía? ¿De cuánto tiempo y qué cubre?" },
      { id: "D8", kind: "text", text: "Durante la obra, ¿quién es la persona de contacto del cliente?" },
    ],
  },
  {
    id: "E",
    title: "Credenciales y confianza",
    intro:
      "En Texas no existe una licencia estatal para carpintería ni para contratistas generales (solo para plomería, electricidad y aire acondicionado). Por eso no vamos a escribir \"licensed\" a menos que tengas un registro o licencia real que lo respalde.",
    questions: [
      {
        id: "E1", star: true, kind: "multi", text: "¿Tienes seguro?",
        options: ["Seguro de responsabilidad civil (general liability)", "Workers' compensation (seguro para los trabajadores)", "No tengo seguro por ahora"],
        extra: "¿Estás registrado como contratista en alguna ciudad o tienes alguna licencia? ¿Cuál?",
      },
      { id: "E2", kind: "textarea", text: "¿Tienes certificaciones, membresías o premios?", help: "BBB, NARI, Home Builders Association, cursos de fabricantes…" },
      { id: "E3", kind: "text", text: "Aproximadamente, ¿cuántos proyectos has terminado?", help: "Solo si tienes una cifra razonable; si no, déjalo en blanco." },
      { id: "E4", kind: "textarea", text: "¿Algún proyecto o cliente del que estés especialmente orgulloso?", help: "Solo lo mencionamos con permiso." },
    ],
  },
  {
    id: "F",
    title: "Clientes y zonas",
    questions: [
      {
        id: "F1", star: true, kind: "multi", text: "¿En qué ciudades o zonas trabajas?", other: true,
        options: [
          "Austin", "Round Rock", "Cedar Park", "Georgetown", "Pflugerville", "Leander", "Lakeway", "Bee Cave",
          "West Lake Hills", "Dripping Springs", "Buda", "Kyle", "Manor", "Hutto", "San Marcos",
        ],
        extra: "¿Hasta qué distancia máxima viajas por un trabajo? (millas)",
      },
      {
        id: "F2", kind: "multi", text: "¿Qué tipo de clientes tienes?", other: true,
        options: ["Dueños de casa", "Constructoras (builders)", "Contratistas generales", "Negocios / comercios", "Administradores de propiedades"],
      },
      {
        id: "F3", kind: "single", text: "¿Cuál es el presupuesto típico de tus proyectos?",
        help: "No se publica; nos sirve para describir a Google el rango de precios.",
        options: ["Menos de $2,000", "$2,000–$10,000", "$10,000–$30,000", "Más de $30,000"],
      },
      { id: "F4", kind: "text", text: "Aproximadamente, ¿qué parte de tus clientes habla español?" },
    ],
  },
  {
    id: "G",
    title: "Presencia en internet y reseñas",
    questions: [
      {
        id: "G1", star: true, kind: "single", text: "¿Tienes perfil de Google Business (la ficha que aparece en Google Maps)?",
        options: ["Sí", "No", "No sé"], extra: "Enlace, cuenta de Google con que se administra, número de reseñas y calificación",
      },
      {
        id: "G2", kind: "fields", text: "¿En qué otras páginas o redes está DHC? Pega los enlaces",
        fields: [
          { id: "facebook", label: "Facebook" },
          { id: "instagram", label: "Instagram" },
          { id: "yelp", label: "Yelp" },
          { id: "nextdoor", label: "Nextdoor" },
          { id: "houzz", label: "Houzz" },
          { id: "angi", label: "Angi / HomeAdvisor" },
          { id: "thumbtack", label: "Thumbtack" },
          { id: "bbb", label: "BBB" },
          { id: "otros", label: "TikTok / YouTube / otros" },
        ],
      },
      {
        id: "G3", kind: "textarea", text: "¿Tienes reseñas o mensajes de clientes contentos que podamos publicar?",
        help: "Necesitamos el permiso del cliente y, si es posible, su nombre (o iniciales), la ciudad y el tipo de proyecto.",
      },
      { id: "G4", kind: "text", text: "¿DHC ha tenido página web antes? ¿En qué dirección?" },
    ],
  },
  {
    id: "H",
    title: "Fotos y logo",
    intro: "Las fotos y el logo no se pueden adjuntar aquí: mándalos a Pablo por WhatsApp o en una carpeta de Google Drive.",
    questions: [
      {
        id: "H1", star: true, kind: "textarea", text: "Fotos de trabajos terminados: ¿cuántas crees que puedes conseguir y cómo nos las mandas?",
        help: "Lo ideal: al menos 12 fotos horizontales, con buena luz, sin desorden ni personas; antes y después si las tienes. Por cada foto: servicio, ciudad y materiales. Con permiso del cliente (nunca mostramos la dirección).",
      },
      { id: "H2", kind: "textarea", text: "¿Tienes fotos del equipo trabajando y del dueño?", help: "Solo si en A4 dijiste que quieres aparecer." },
      {
        id: "H3", star: true, kind: "single", text: "¿Tienes los archivos originales del logo?",
        options: ["Sí, en formato AI / SVG / PDF / EPS (vector)", "Solo en PNG o JPG", "Solo la imagen de la tarjeta"],
        extra: "¿Quién lo diseñó? Si no hay vector, ¿aceptas que lo redibujemos en una versión simplificada basada en el de la tarjeta?",
      },
      { id: "H4", kind: "text", text: "¿Tienes algún video corto de trabajos o del proceso? (opcional)" },
    ],
  },
  {
    id: "I",
    title: "Dominio, correo y cuentas",
    questions: [
      {
        id: "I1", star: true, kind: "single", text: "Dirección web (dominio)",
        help: "Recomendación: que el dominio esté a nombre de la empresa, para que DHC siempre tenga el control.",
        options: ["Ya tenemos dominio", "No tenemos"], extra: "Dominio que tienen (y a nombre de quién) o el que les gustaría",
      },
      { id: "I2", star: true, kind: "text", text: "¿A qué correo deben llegar los pedidos de estimado que se hagan desde la web? ¿Debe llegarle copia a alguien más?" },
      {
        id: "I3", kind: "single", text: "¿Tienes una cuenta de Google de la empresa?",
        help: "Se usa para Google Business y para ver cómo aparece la web en Google.", options: ["Sí", "No"], extra: "Cuenta",
      },
    ],
  },
  {
    id: "J",
    title: "Mensaje y forma de responder",
    questions: [
      { id: "J1", kind: "textarea", text: "¿Por qué te eligen los clientes en lugar de otros carpinteros?" },
      { id: "J2", kind: "textarea", text: "¿Qué quejas escuchas de otros contratistas que tú haces diferente?" },
      { id: "J3", kind: "textarea", text: "¿Hay algo que NO quieras que digamos en la web?", help: "Por ejemplo: precios, la palabra \"barato\", algún servicio…" },
      {
        id: "J4", star: true, kind: "multi", text: "Cuando alguien llena el formulario, ¿cómo le respondes?",
        help: "Si respondes por mensaje de texto, el formulario tiene que avisar al cliente de que puede recibir mensajes.",
        options: ["Llamada", "Mensaje de texto", "Correo", "WhatsApp"],
      },
    ],
  },
  {
    id: "K",
    title: "Futuro (opcional)",
    questions: [
      {
        id: "K1", kind: "textarea", text: "¿Te gustaría que los clientes puedan reservar la visita del estimado en un calendario en línea? ¿Qué días y horarios dedicas a hacer estimados?",
      },
      {
        id: "K2", kind: "textarea", text: "¿Cuáles son las 5 preguntas que más te hacen por teléfono?",
        help: "Nos sirven para las preguntas frecuentes de la web y para un futuro asistente automático.",
      },
    ],
  },
];
