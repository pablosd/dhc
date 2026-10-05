// Textos en español. Tipado como `Dictionary`: si falta o sobra una clave
// respecto a en.ts, el build falla. Mismas reglas de marcadores y TODO.
import type { Dictionary } from "./en";

const es: Dictionary = {
  meta: {
    title: "Carpintería y Gabinetes a Medida, Austin TX | DHC Woodcraft",
    description:
      "Gabinetes a medida, cocinas, techos y vigas de madera, molduras, puertas, decks y framing en Austin, TX. Estimados gratis. Llama al {phone}.", // TODO D1
  },

  anchors: {
    services: "servicios",
    about: "nosotros",
    process: "proceso",
    work: "proyectos",
    reviews: "resenas",
    areas: "zonas",
    faq: "preguntas",
    estimate: "estimado",
  },

  a11y: {
    skipLink: "Saltar al contenido",
    mainNav: "Principal",
    footerNav: "Pie de página",
    menuOpen: "Abrir menú",
    menuClose: "Cerrar menú",
    languageSwitch: "View this page in English",
    callEn: "Llamar a DHC en inglés al {phoneEn}",
    callEs: "Llamar a DHC en español al {phoneEs}",
    whatsapp: "Escríbenos por WhatsApp", // TODO B2
    marqueePause: "Pausar animación",
    logoHome: "inicio",
    carousel: "carrusel",
    slide: "diapositiva",
    slideOf: "{n} de {total}",
    prev: "Anterior",
    next: "Siguiente",
    pause: "Pausar carrusel",
    resume: "Reanudar carrusel",
    goTo: "Ir a la {n}",
    flip: "Ver el después: {title}",
    serviceChips: "Ir a un servicio",
    cityList: "Ciudades que atendemos",
    breadcrumb: "Ruta de navegación",
  },

  sample: {
    photo: "Foto del proyecto",
    review: "Reseña de ejemplo",
    illustration: "Ilustración de ejemplo",
  },

  demoBanner: "Vista previa — algunos datos, reseñas y fotos son de ejemplo.",
  demoBannerLabel: "Aviso de vista previa",

  nav: {
    home: "Inicio",
    services: "Servicios",
    about: "Nosotros",
    process: "Proceso",
    work: "Proyectos",
    faq: "Preguntas",
    cta: "Estimado gratis", // TODO D1
    language: "English",
  },

  hero: {
    eyebrow: "Fabricación a medida • Instalación • Remodelación",
    titleStart: "Carpintería y trabajos en madera a medida en Austin, TX —",
    titleAccent: "hechos para durar.",
    lead: "Gabinetes, remodelación de cocinas, techos y vigas de madera, molduras, puertas, decks y framing — fabricado e instalado por un equipo local que cuida tu casa como si fuera la nuestra.",
    ctaEstimate: "Pide tu estimado gratis", // TODO D1
    ctaCall: "Llama al {phone}",
    trust: {
      freeEstimates: "Estimados gratis a domicilio", // TODO D1
      bilingual: "Atendemos en inglés y español",
      insured: "Con seguro", // TODO E1
    },
    card: {
      lineEn: "Línea en inglés",
      lineEs: "Línea en español",
      cta: "Quiero mi estimado gratis", // TODO D1
    },
  },

  marquee: [
    "Gabinetes",
    "Remodelación de cocinas",
    "Techos y vigas de madera",
    "Molduras",
    "Puertas",
    "Decks y terrazas",
    "Framing",
    "Carpintería general",
  ],

  services: {
    eyebrow: "Lo que hacemos",
    title: "Trabajos en madera para cada rincón de tu casa",
    lead: "Desde gabinetes a medida hasta la estructura de tu casa: fabricamos, instalamos y remodelamos. Un solo equipo, un solo calendario y una sola persona de contacto.",
    learnMore: "Ver más →",
    footerCta: "¿No sabes por dónde empezar? Llámanos.",
    items: {
      cabinets: {
        short: "Gabinetes",
        title: "Gabinetes a medida y empotrados",
        text: "Gabinetes de cocina, baño y clóset, muebles de baño y empotrados hechos a la medida e instalados con precisión.",
        points: ["Hechos a la medida", "Estilo shaker, liso o inset", "Renovación e instalación"],
      },
      kitchens: {
        short: "Cocinas",
        title: "Remodelación de cocinas",
        text: "Cambios de distribución, islas, despensas y gabinetes, coordinado desde la demolición hasta el último acabado.",
        points: ["Islas y despensas", "Nueva distribución", "Coordinación completa"],
      },
      ceilings: {
        short: "Techos y vigas",
        title: "Vigas y techos de madera",
        text: "Techos machihembrados y vigas decorativas o estructurales que dan calidez y carácter a cualquier espacio.",
        points: ["Techos machihembrados", "Vigas decorativas", "Interior y exterior"],
      },
      trim: {
        short: "Molduras",
        title: "Molduras y acabados",
        text: "Molduras de techo, zócalos, wainscoting, marcos y muros decorativos con uniones limpias y precisas.",
        points: ["Molduras y zócalos", "Wainscoting", "Muros decorativos"],
      },
      doors: {
        short: "Puertas",
        title: "Puertas",
        text: "Instalación de puertas interiores y exteriores, premontadas o solo hoja, puertas de granero y herrajes.",
        points: ["Interiores y exteriores", "Puertas de granero", "Herrajes y ajustes"],
      },
      decks: {
        short: "Decks",
        title: "Decks y terrazas",
        text: "Decks de cedro, madera tratada o compuestos, techos de patio y pérgolas hechos para el sol de Texas.",
        points: ["Compuesto y cedro", "Techos de patio", "Pérgolas"],
      },
      framing: {
        short: "Framing",
        title: "Framing (estructura)",
        text: "Estructura para ampliaciones, conversiones de garaje, muros y remodelaciones: a escuadra, a plomo y lista para inspección.",
        points: ["Ampliaciones", "Muros y vanos", "Conversión de garajes"],
      },
      general: {
        short: "Carpintería general",
        title: "Carpintería general",
        text: "Reparaciones, piezas a medida y todos esos proyectos que no encajan en una categoría. Si es de madera, pregúntanos.",
        points: ["Reparaciones", "Piezas a medida", "Trabajos pequeños bienvenidos"], // TODO C9
      },
    },
  },

  about: {
    eyebrow: "Por qué DHC",
    title: "Oficio de verdad. Respuestas claras.",
    blocks: [
      {
        title: "Lo fabricamos, lo instalamos y respondemos por ello", // TODO D7
        lead: "Las mismas personas que cotizan tu proyecto son las que hacen el trabajo.", // TODO D3
        points: [
          {
            title: "Cotizaciones claras por escrito",
            text: "Alcance y precio detallados antes de empezar.",
          }, // TODO D2
          {
            title: "Obra limpia y respetuosa",
            text: "Control de polvo y limpieza diaria.",
          }, // TODO D4
        ],
      },
      {
        title: "Fabricación propia. Inglés y español.", // TODO C5
        lead: "",
        points: [
          {
            title: "Fabricación e instalación propias",
            text: "Fabricamos, instalamos y remodelamos con nuestro propio equipo.",
          }, // TODO C5
          {
            title: "Inglés y español",
            text: "Habla con nosotros en el idioma que prefieras.",
          },
        ],
      },
    ],
    stats: {
      years: "Años de experiencia",
      projects: "Proyectos terminados",
      rating: "Calificación en Google",
      warranty: "Años de garantía",
    },
  },

  process: {
    eyebrow: "Cómo trabajamos",
    title: "De la primera llamada a la entrega final",
    intro: "Baja despacio: detrás de estos paneles, tu cocina se construye paso a paso.",
    stepIndicator: "Paso {n} de 4",
    planLabel: "PLANO · COCINA",
    steps: [
      {
        title: "Estimado gratis", // TODO D1
        text: "Te visitamos, escuchamos lo que quieres y tomamos medidas precisas.",
        caption: "Plano y medidas",
      },
      {
        title: "Diseño y cotización", // TODO C6, D2
        text: "Un plan claro y una cotización detallada, antes de cortar la primera tabla.",
        caption: "Diseño de módulos",
      },
      {
        title: "Fabricación e instalación",
        text: "Hecho a la medida e instalado a tiempo: gabinetes, cubierta y alacenas.",
        caption: "Gabinetes, cubierta y alacenas",
      },
      {
        title: "Revisión final",
        text: "Puertas, herrajes, madera y luz. Revisamos cada detalle contigo.",
        caption: "Puertas, madera y luz",
      },
    ],
  },

  work: {
    eyebrow: "Trabajos recientes",
    title: "Antes y después",
    lead: "Pasa el mouse o toca cada imagen para ver la transformación.",
    before: "Antes",
    after: "Después",
    items: [
      { title: "Cocina completa", description: "Gabinetes, cubierta y techo de madera" },
      { title: "Gabinetes y alacenas", description: "Shaker en nogal" },
      { title: "Techo y luz", description: "Machihembrado y vigas" },
      { title: "Alacenas y campana", description: "Módulos a medida" },
      { title: "Cubierta y bases", description: "Cajones y cubierta nueva" },
    ],
  },

  reviews: {
    eyebrow: "Reseñas",
    title: "Lo que dicen nuestros clientes",
    sampleNotice: "Reseñas de ejemplo — se reemplazarán por reseñas reales de Google.",
    sampleName: "Cliente de ejemplo",
    sampleArea: "Zona de Austin",
    readOnGoogle: "Lee nuestras reseñas en Google", // TODO G1
    items: [
      {
        project: "Gabinetes a medida",
        quote: "Fabricaron e instalaron los gabinetes de nuestra cocina tal como lo planeamos. Trabajo limpio y muy buena comunicación.",
      },
      {
        project: "Techo de madera",
        quote: "El nuevo techo machihembrado cambió por completo la sala. A tiempo y dentro del presupuesto.",
      },
      {
        project: "Deck",
        quote: "Estimado rápido, precio justo y el deck quedó increíble. Pude hablar con ellos en español.",
      },
      {
        project: "Molduras",
        quote: "Las molduras y el wainscoting quedaron perfectos. Uniones limpias y muy cuidadosos con la casa.",
      },
      {
        project: "Puertas",
        quote: "Instalaron todas las puertas interiores en un día y ajustaron las que ya teníamos.",
      },
    ],
  },

  areas: {
    eyebrow: "Zona de servicio",
    title: "Atendemos Austin y Texas central",
    lead: "Estamos en Austin y trabajamos en todo Texas central. ¿No ves tu ciudad? Llámanos y te decimos enseguida si podemos ayudarte.",
    legendServed: "Atendemos",
    legendAsk: "Consúltanos",
    legendBase: "Base: Austin",
    ctaEstimate: "Pide tu estimado gratis", // TODO D1
    ctaCall: "Llama al {phone}",
    mapLabel: "Mapa de los condados de Travis, Williamson y Hays con las zonas que atiende DHC",
    scale: "10 millas",
  },

  faq: {
    eyebrow: "Preguntas frecuentes",
    title: "Lo que más nos preguntan",
    items: [
      {
        id: "estimates",
        question: "¿Los estimados son gratis?",
        answer: "Sí. Te visitamos, tomamos medidas y te enviamos una cotización por escrito.", // TODO D1, D2
      },
      {
        id: "spanish",
        question: "¿Hablan español?",
        answer: "Sí. Llama al {phoneEs} para español o al {phoneEn} para inglés.",
      },
      {
        id: "fabrication",
        question: "¿Fabrican gabinetes o solo los instalan?",
        answer: "Las dos cosas: fabricamos a medida, instalamos y remodelamos.", // TODO C5
      },
      {
        id: "areas",
        question: "¿En qué zonas trabajan?",
        answer: "Austin y ciudades cercanas (mira la lista de arriba). Si tienes dudas, llámanos.", // TODO F1
      },
      {
        id: "timeline",
        question: "¿Cuánto tarda un proyecto?",
        answer: "Depende del alcance; recibes un calendario junto con tu cotización.",
      },
      {
        id: "insured",
        question: "¿Tienen seguro?",
        answer: "", // TODO E1
      },
      {
        id: "warranty",
        question: "¿Ofrecen garantía?",
        answer: "", // TODO D7
      },
    ],
  },

  estimate: {
    eyebrow: "Estimado gratis", // TODO D1
    title: "Construyamos algo que te encante",
    lead: "Cuéntanos sobre tu proyecto y te respondemos en menos de un día hábil. Hablamos español.", // TODO B6
    form: {
      name: "Nombre completo",
      phone: "Teléfono",
      email: "Correo",
      projectType: "Tipo de proyecto",
      projectTypePlaceholder: "Elige una opción",
      projectTypeOther: "Otro",
      city: "Ciudad o código postal",
      message: "Cuéntanos sobre tu proyecto",
      messagePlaceholder:
        "¿Qué te gustaría fabricar, instalar o remodelar? Si tienes medidas o fechas, mejor.",
      optional: "(opcional)",
      submit: "Quiero mi estimado gratis", // TODO D1
      sending: "Enviando…",
      success: "¡Gracias! Te contactaremos pronto.",
      error: "Algo salió mal. Llámanos al {phone}.",
      consent:
        "Al enviar este formulario aceptas que DHC te contacte por teléfono, mensaje de texto o correo sobre tu proyecto. Nunca compartimos tu información.", // TODO J4
      consentNoText:
        "Al enviar este formulario aceptas que DHC te contacte por teléfono o correo sobre tu proyecto. Nunca compartimos tu información.",
    },
    validation: {
      required: "Completa este campo.",
      selectRequired: "Elige un tipo de proyecto.",
      email: "Escribe un correo válido, como nombre@ejemplo.com.",
      phone: "Escribe un teléfono de 10 dígitos.",
    },
    contact: {
      callTitle: "¿Prefieres hablar?",
      lineEn: "Línea en inglés",
      lineEs: "Línea en español",
      email: "Correo", // TODO B3
      hours: "Horario", // TODO B5
      whatsapp: "WhatsApp", // TODO B2
    },
  },

  footer: {
    tagline: "Carpintería y trabajos en madera a medida en Austin, TX.",
    colServices: "Servicios",
    colCompany: "Empresa",
    colContact: "Contacto",
    copyright: "© {year} DHC Woodcraft & Installation. Todos los derechos reservados.",
  },

  mobileBar: {
    call: "Llamar",
    estimate: "Estimado gratis", // TODO D1
  },

  servicePage: {
    eyebrow: "Austin, TX · Estimados gratis", // TODO D1
    includesTitle: "Qué incluye",
    materialsTitle: "Materiales y estilos",
    processTitle: "Cómo trabajamos",
    galleryTitle: "Proyectos recientes",
    faqTitle: "Preguntas sobre este servicio",
    relatedTitle: "Servicios relacionados",
    relatedLink: "Ver servicio",
  },

  notFound: {
    title: "No encontramos esa página",
    text: "Puede que el enlace esté roto o que la página haya cambiado de lugar.",
    home: "Volver al inicio",
    call: "Llama al {phone}",
  },

  root: {
    title: "Elige tu idioma",
    link: "Español",
  },

  og: {
    tagline: "Carpintería a medida en Austin, TX",
    alt: "DHC Woodcraft & Installation — carpintería a medida en Austin, TX",
  },
};

export default es;
