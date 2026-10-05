// Textos en inglés. Este archivo define el tipo `Dictionary`: `es.ts` debe
// tener exactamente las mismas claves. Sin `as const` (ver docs/02).
// Datos del negocio con marcadores: {phone} (línea del idioma de la página),
// {phoneEn}, {phoneEs}, {email}, {year}. Se rellenan con fill() desde site.ts.
// `// TODO <código>`: depende del cuestionario (docs/07); ver site.claims.

const en = {
  meta: {
    title: "Custom Carpentry & Cabinets in Austin, TX | DHC Woodcraft",
    description:
      "Custom cabinets, kitchen remodels, wood ceilings & beams, trim, doors, decks and framing in Austin, TX. Free estimates. Call {phone}.", // TODO D1
  },

  anchors: {
    services: "services",
    about: "about",
    process: "process",
    work: "work",
    reviews: "reviews",
    areas: "areas",
    faq: "faq",
    estimate: "estimate",
  },

  a11y: {
    skipLink: "Skip to content",
    mainNav: "Main",
    footerNav: "Footer",
    menuOpen: "Open menu",
    menuClose: "Close menu",
    languageSwitch: "Ver esta página en español",
    callEn: "Call DHC in English at {phoneEn}",
    callEs: "Call DHC in Spanish at {phoneEs}",
    whatsapp: "Message us on WhatsApp", // TODO B2
    marqueePause: "Pause animation",
    logoHome: "home",
    carousel: "carousel",
    slide: "slide",
    slideOf: "{n} of {total}",
    prev: "Previous",
    next: "Next",
    pause: "Pause carousel",
    resume: "Resume carousel",
    goTo: "Go to slide {n}",
    flip: "See the after: {title}",
    serviceChips: "Jump to a service",
    cityList: "Cities we serve",
    breadcrumb: "Breadcrumb",
  },

  sample: {
    photo: "Project photo",
    review: "Sample review",
    illustration: "Sample illustration",
  },

  demoBanner: "Preview — some business details, reviews and photos are placeholders.",
  demoBannerLabel: "Preview notice",

  nav: {
    home: "Home",
    services: "Services",
    about: "Why DHC",
    process: "Process",
    work: "Our Work",
    faq: "FAQ",
    cta: "Free Estimate", // TODO D1
    language: "Español",
  },

  hero: {
    eyebrow: "Custom Build • Install • Remodel",
    titleStart: "Custom carpentry & woodwork in Austin, TX —",
    titleAccent: "built to last.",
    lead: "Cabinets, kitchen remodels, wood ceilings and beams, trim, doors, decks and framing — built and installed by a local crew that treats your home like our own.",
    ctaEstimate: "Get a free estimate", // TODO D1
    ctaCall: "Call {phone}",
    trust: {
      freeEstimates: "Free on-site estimates", // TODO D1
      bilingual: "Se habla español",
      insured: "Fully insured", // TODO E1
    },
    card: {
      lineEn: "English line",
      lineEs: "Spanish line",
      cta: "Request my free estimate", // TODO D1
    },
  },

  marquee: [
    "Cabinets",
    "Kitchen Remodels",
    "Wood Ceilings & Beams",
    "Trim & Molding",
    "Doors",
    "Decks & Patios",
    "Framing",
    "General Carpentry",
  ],

  services: {
    eyebrow: "What we build",
    title: "Woodwork for every corner of your home",
    lead: "From custom cabinets to structural framing, we build, install and remodel — one team, one schedule, one point of contact.",
    learnMore: "Learn more →",
    footerCta: "Not sure where to start? Call us.",
    items: {
      cabinets: {
        short: "Cabinets",
        title: "Custom Cabinets & Built-ins",
        text: "Kitchen, bath and closet cabinets, vanities and built-ins made to measure and installed with precision.",
        points: ["Made to measure", "Shaker, flat & inset", "Refacing & installs"],
      },
      kitchens: {
        short: "Kitchens",
        title: "Kitchen Remodeling",
        text: "Layout changes, islands, pantries and cabinetry coordinated from demo to final trim.",
        points: ["Islands & pantries", "Layout redesign", "Full coordination"],
      },
      ceilings: {
        short: "Ceilings & Beams",
        title: "Beams & Wood Ceilings",
        text: "Tongue-and-groove ceilings, decorative and structural beams that add warmth and character to any room.",
        points: ["T&G ceilings", "Decorative beams", "Indoor & outdoor"],
      },
      trim: {
        short: "Trim",
        title: "Trim & Molding",
        text: "Crown molding, baseboards, wainscoting, casings and accent walls with clean, tight joints.",
        points: ["Crown & baseboards", "Wainscoting", "Accent walls"],
      },
      doors: {
        short: "Doors",
        title: "Doors",
        text: "Interior and exterior door installation, pre-hung and slab, barn doors and hardware.",
        points: ["Interior & exterior", "Barn doors", "Hardware & adjustments"],
      },
      decks: {
        short: "Decks",
        title: "Decks & Patios",
        text: "Cedar, treated and composite decks, patio covers and pergolas built for the Texas sun.",
        points: ["Composite & cedar", "Patio covers", "Pergolas"],
      },
      framing: {
        short: "Framing",
        title: "Framing",
        text: "Framing for additions, garage conversions, walls and remodels: square, plumb and ready for inspection.",
        points: ["Additions", "Walls & openings", "Garage conversions"],
      },
      general: {
        short: "General Carpentry",
        title: "General Carpentry",
        text: "Repairs, custom pieces and the projects that don't fit a box. If it's wood, ask us.",
        points: ["Repairs", "Custom pieces", "Small jobs welcome"], // TODO C9
      },
    },
  },

  about: {
    eyebrow: "Why DHC",
    title: "Real craftsmanship. Straight answers.",
    blocks: [
      {
        title: "We build it, we install it, we stand behind it", // TODO D7
        lead: "The same people who quote your project are the ones who do the work.", // TODO D3
        points: [
          {
            title: "Clear, written quotes",
            text: "Itemized scope and pricing before we start.",
          }, // TODO D2
          {
            title: "Clean, respectful job sites",
            text: "Dust control and daily clean-up.",
          }, // TODO D4
        ],
      },
      {
        title: "In-house craftsmanship. English & Spanish.", // TODO C5
        lead: "",
        points: [
          {
            title: "Built and installed in-house",
            text: "We custom build, install and remodel with our own crew.",
          }, // TODO C5
          {
            title: "English & Spanish",
            text: "Talk to us in the language you prefer.",
          },
        ],
      },
    ],
    stats: {
      years: "Years of experience",
      projects: "Projects completed",
      rating: "Google rating",
      warranty: "Year warranty",
    },
  },

  process: {
    eyebrow: "How it works",
    title: "From first call to final walkthrough",
    intro: "Scroll slowly: behind these panels, your kitchen comes together step by step.",
    stepIndicator: "Step {n} of 4",
    planLabel: "PLAN · KITCHEN",
    steps: [
      {
        title: "Free estimate", // TODO D1
        text: "We visit, listen and take precise measurements.",
        caption: "Plan & measurements",
      },
      {
        title: "Design & quote", // TODO C6, D2
        text: "A clear plan and an itemized quote, before we cut the first board.",
        caption: "Module layout",
      },
      {
        title: "Build & install",
        text: "Built to measure and installed on schedule: cabinets, countertop and uppers.",
        caption: "Cabinets, countertop & uppers",
      },
      {
        title: "Final walkthrough",
        text: "Doors, hardware, wood and light. We review every detail together.",
        caption: "Doors, wood & light",
      },
    ],
  },

  work: {
    eyebrow: "Recent work",
    title: "Before & after",
    lead: "Hover over or tap each image to see the transformation.",
    before: "Before",
    after: "After",
    items: [
      { title: "Full kitchen", description: "Cabinets, countertop and wood ceiling" },
      { title: "Cabinets & uppers", description: "Walnut shaker" },
      { title: "Ceiling & lighting", description: "Tongue-and-groove and beams" },
      { title: "Uppers & hood", description: "Made-to-measure units" },
      { title: "Countertop & base cabinets", description: "Drawers and new countertop" },
    ],
  },

  reviews: {
    eyebrow: "Reviews",
    title: "What homeowners say",
    sampleNotice: "Sample reviews — to be replaced with real Google reviews.",
    sampleName: "Sample client",
    sampleArea: "Austin area",
    readOnGoogle: "Read our reviews on Google", // TODO G1
    items: [
      {
        project: "Custom cabinets",
        quote: "They built and installed our kitchen cabinets exactly as planned. Clean work and great communication.",
      },
      {
        project: "Wood ceiling",
        quote: "Our new tongue-and-groove ceiling completely changed the living room. On time and on budget.",
      },
      {
        project: "Deck",
        quote: "Quick estimate, fair price, and the deck looks amazing. I could talk to them in Spanish.",
      },
      {
        project: "Trim",
        quote: "The crown molding and wainscoting came out perfect. Clean joints and very careful with our home.",
      },
      {
        project: "Doors",
        quote: "They installed all our interior doors in one day and adjusted the ones we already had.",
      },
    ],
  },

  areas: {
    eyebrow: "Service area",
    title: "Serving Austin & Central Texas",
    lead: "Based in Austin and working across Central Texas. Don't see your city? Call us — we'll tell you right away if we can help.",
    legendServed: "We serve",
    legendAsk: "Ask us",
    legendBase: "Base: Austin",
    ctaEstimate: "Get a free estimate", // TODO D1
    ctaCall: "Call {phone}",
    mapLabel: "Map of Travis, Williamson and Hays counties showing the areas DHC serves",
    scale: "10 miles",
  },

  faq: {
    eyebrow: "FAQ",
    title: "Questions we hear a lot",
    // Una respuesta vacía ("") significa "sin confirmar": no se publica.
    items: [
      {
        id: "estimates",
        question: "Do you offer free estimates?",
        answer: "Yes — we visit your home, measure and send a written quote.", // TODO D1, D2
      },
      {
        id: "spanish",
        question: "Do you speak Spanish?",
        answer: "Yes. Call {phoneEs} for Spanish or {phoneEn} for English.",
      },
      {
        id: "fabrication",
        question: "Do you build custom cabinets or only install?",
        answer: "Both — we custom build, install and remodel.", // TODO C5
      },
      {
        id: "areas",
        question: "What areas do you serve?",
        answer: "Austin and nearby cities — see the list above. If you're not sure, give us a call.", // TODO F1
      },
      {
        id: "timeline",
        question: "How long does a project take?",
        answer: "It depends on the scope; you'll get a timeline with your quote.",
      },
      {
        id: "insured",
        question: "Are you insured?",
        answer: "", // TODO E1
      },
      {
        id: "warranty",
        question: "Do you offer a warranty?",
        answer: "", // TODO D7
      },
    ],
  },

  estimate: {
    eyebrow: "Free estimate", // TODO D1
    title: "Let's build something you'll love",
    lead: "Tell us about your project and we'll get back to you within one business day.", // TODO B6
    form: {
      name: "Full name",
      phone: "Phone",
      email: "Email",
      projectType: "Project type",
      projectTypePlaceholder: "Select one",
      projectTypeOther: "Other",
      city: "City or ZIP code",
      message: "Tell us about your project",
      messagePlaceholder:
        "What would you like to build, install or remodel? Measurements and timing help.",
      optional: "(optional)",
      submit: "Request my free estimate", // TODO D1
      sending: "Sending…",
      success: "Thanks! We'll contact you shortly.",
      error: "Something went wrong. Please call us at {phone}.",
      consent:
        "By sending this form, you agree that DHC may contact you by phone, text message or email about your project. We never share your information.", // TODO J4
      consentNoText:
        "By sending this form, you agree that DHC may contact you by phone or email about your project. We never share your information.",
    },
    validation: {
      required: "Please fill out this field.",
      selectRequired: "Please choose a project type.",
      email: "Please enter a valid email, like name@example.com.",
      phone: "Please enter a 10-digit phone number.",
    },
    contact: {
      callTitle: "Prefer to talk?",
      lineEn: "English line",
      lineEs: "Spanish line",
      email: "Email", // TODO B3
      hours: "Hours", // TODO B5
      whatsapp: "WhatsApp", // TODO B2
    },
  },

  footer: {
    tagline: "Custom carpentry & woodwork in Austin, TX.",
    colServices: "Services",
    colCompany: "Company",
    colContact: "Contact",
    copyright: "© {year} DHC Woodcraft & Installation. All rights reserved.",
  },

  mobileBar: {
    call: "Call",
    estimate: "Free estimate", // TODO D1
  },

  servicePage: {
    eyebrow: "Austin, TX · Free estimates", // TODO D1
    includesTitle: "What's included",
    materialsTitle: "Materials & styles",
    processTitle: "How we work",
    galleryTitle: "Recent projects",
    faqTitle: "Questions about this service",
    relatedTitle: "Related services",
    relatedLink: "See service",
  },

  notFound: {
    title: "We couldn't find that page",
    text: "The link may be broken or the page may have moved.",
    home: "Back to home",
    call: "Call {phone}",
  },

  root: {
    title: "Choose your language",
    link: "English",
  },

  og: {
    tagline: "Custom carpentry in Austin, TX",
    alt: "DHC Woodcraft & Installation — custom carpentry in Austin, TX",
  },
};

export type Dictionary = typeof en;

export default en;
