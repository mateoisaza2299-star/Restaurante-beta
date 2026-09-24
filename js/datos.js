/**
 * ============================================================
 *  CASA LUMBRE — ÚNICO LUGAR PARA EDITAR
 * ============================================================
 *  Mateo: cambia aquí el nombre, la historia, la carta,
 *  los precios, el teléfono, WhatsApp, la dirección,
 *  los horarios, el mapa y las redes.
 *
 *  No hace falta tocar index.html ni los estilos.
 *  Guarda este archivo, recarga la página y listo.
 *
 *  PRECIOS
 *  Escríbelos como número entero, en pesos, sin puntos
 *  ni signo de peso. Ejemplo: 46000 se muestra $46.000.
 *
 *  FOTOS
 *  Rutas relativas a index.html, dentro de assets/fotos/.
 *  Si un plato no lleva foto, deja imagen: "" y alt: "".
 *
 *  PARA AGREGAR UN PLATO
 *  Copia un bloque dentro de la categoría y cambia los campos:
 *
 *    {
 *      nombre: "Nuevo plato",
 *      descripcion: "Una línea corta.",
 *      precio: 35000,
 *      imagen: "assets/fotos/mi-plato.jpg",
 *      alt: "Descripción de la foto"
 *    },
 * ============================================================
 */
const RESTAURANTE = {
  /* ---------- Identidad ---------- */
  nombre: "Casa Lumbre",
  ciudad: "Medellín",
  tagline: "Fuego lento y producto de temporada.",
  titular: "Una casa, una brasa, pocos platos.",
  historia: [
    "Casa Lumbre ocupa una casa de 1948 en El Poblado. La cocina trabaja con brasa y horno, y con pocos proveedores: huertas del Oriente antioqueño, pescado del Pacífico y quesos de Boyacá.",
    "La carta es corta a propósito. Cambia con la semana, pero el gesto se mantiene: fuego lento y un plato que se entiende a la primera.",
  ],
  notaCarta: "Precios en pesos colombianos. La carta sigue al mercado de la semana.",

  /* ---------- Imágenes de la portada y de la historia ---------- */
  hero: {
    imagen: "assets/fotos/hero-brasa.jpg",
    alt: "Pulpo a la brasa con puré de papa criolla y pimentón ahumado",
  },
  retrato: {
    imagen: "assets/fotos/chef.jpg",
    alt: "Mariana Vélez emplatando en la cocina de Casa Lumbre",
    pie: "Mariana Vélez, cocinera",
  },

  /* ---------- Contacto, horarios y mapa ---------- */
  /* Teléfono visible. El enlace tel: se arma solo. */
  telefono: "+57 604 322 4810",
  /* WhatsApp con indicativo de país, sin espacios obligatorios. */
  whatsapp: "+57 310 321 8845",
  mensajeWhatsapp: "Hola, quiero reservar una mesa en Casa Lumbre.",
  textoReserva: "Escríbenos por WhatsApp y confirmamos la mesa.",
  correo: "hola@casalumbre.co",
  /* Cada línea de la dirección se muestra en su propio renglón. */
  direccion: ["Carrera 37 #8A-15", "El Poblado, Medellín"],
  /* Texto que Google Maps usa para centrar el mapa. */
  mapa: "Carrera 37 #8A-15, El Poblado, Medellín, Colombia",
  horarios: [
    { dia: "Martes a jueves", horas: "12:00–15:00 · 18:30–22:30" },
    { dia: "Viernes y sábado", horas: "12:00–15:30 · 18:30–23:30" },
    { dia: "Domingo", horas: "12:00–16:00" },
    { dia: "Lunes", horas: "Cerrado" },
  ],
  /* Sustituye estas URLs por las redes reales del restaurante. */
  redes: [
    { nombre: "Instagram", url: "https://instagram.com/casalumbre.medellin" },
    { nombre: "Facebook", url: "https://facebook.com/casalumbre.medellin" },
  ],

  /* ---------- Carta: categorías, platos y precios ---------- */
  carta: [
    {
      id: "entradas",
      nombre: "Entradas",
      nota: "Para abrir la mesa.",
      platos: [
        {
          nombre: "Tartar de atún del Pacífico",
          descripcion: "Atún, aguacate, ají dulce y chips de plátano verde.",
          precio: 46000,
          imagen: "assets/fotos/plato-tartar.jpg",
          alt: "Tartar de atún con aguacate y chips de plátano",
        },
        {
          nombre: "Burrata con tomate de árbol",
          descripcion: "Burrata, tomate de árbol asado, albahaca y aceite de hierbas.",
          precio: 42000,
          imagen: "assets/fotos/plato-burrata.jpg",
          alt: "Burrata abierta con tomate de árbol asado y albahaca",
        },
        {
          nombre: "Croquetas de yuca",
          descripcion: "Yuca y queso costeño, con alioli de cilantro.",
          precio: 28000,
          imagen: "",
          alt: "",
        },
        {
          nombre: "Ceviche de camarón",
          descripcion: "Camarón, leche de tigre y maíz tostado.",
          precio: 44000,
          imagen: "",
          alt: "",
        },
      ],
    },
    {
      id: "fuertes",
      nombre: "Platos fuertes",
      nota: "Del fuego, al centro de la mesa.",
      platos: [
        {
          nombre: "Pulpo a la brasa",
          descripcion: "Tentáculo marcado al fuego, puré de papa criolla y pimentón ahumado.",
          precio: 82000,
          imagen: "assets/fotos/plato-pulpo.jpg",
          alt: "Pulpo a la brasa sobre puré de papa criolla",
        },
        {
          nombre: "Costilla corta glaseada",
          descripcion: "Costilla lacada con panela, yuca confitada y jus.",
          precio: 89000,
          imagen: "assets/fotos/plato-costilla.jpg",
          alt: "Costilla corta glaseada con yuca confitada",
        },
        {
          nombre: "Pescado del día",
          descripcion: "Filete a la plancha, arroz de coco y ají suave.",
          precio: 76000,
          imagen: "assets/fotos/plato-pescado.jpg",
          alt: "Filete de pescado a la plancha con arroz de coco",
        },
        {
          nombre: "Risotto de maíz",
          descripcion: "Maíz tierno, queso paipa y hongos salteados.",
          precio: 64000,
          imagen: "",
          alt: "",
        },
      ],
    },
    {
      id: "postres",
      nombre: "Postres",
      nota: "Algo dulce, en porción justa.",
      platos: [
        {
          nombre: "Volcán de chocolate",
          descripcion: "Chocolate al 70% y helado de café.",
          precio: 28000,
          imagen: "assets/fotos/plato-chocolate.jpg",
          alt: "Volcán de chocolate con centro fundido y helado de café",
        },
        {
          nombre: "Tres leches de coco",
          descripcion: "Bizcocho empapado, crema de coco y maracuyá.",
          precio: 26000,
          imagen: "assets/fotos/plato-tres-leches.jpg",
          alt: "Porción de tres leches de coco con maracuyá",
        },
        {
          nombre: "Flan de arequipe",
          descripcion: "Flan de arequipe con sal marina.",
          precio: 24000,
          imagen: "",
          alt: "",
        },
      ],
    },
    {
      id: "bebidas",
      nombre: "Bebidas",
      nota: "Sin prisa.",
      platos: [
        {
          nombre: "Limonada de hierbabuena",
          descripcion: "Limón, hierbabuena y panela.",
          precio: 12000,
          imagen: "",
          alt: "",
        },
        {
          nombre: "Jugo de lulo",
          descripcion: "Lulo exprimido, sin azúcar añadida.",
          precio: 11000,
          imagen: "",
          alt: "",
        },
        {
          nombre: "Maracuyá y ginebra",
          descripcion: "Maracuyá, ginebra y un cubo de hielo.",
          precio: 34000,
          imagen: "assets/fotos/plato-coctel.jpg",
          alt: "Cóctel de maracuyá con hielo en vaso corto",
        },
        {
          nombre: "Copa de vino de la casa",
          descripcion: "Tinto o blanco. Pregunta por la botella abierta.",
          precio: 29000,
          imagen: "",
          alt: "",
        },
        {
          nombre: "Café de origen",
          descripcion: "Filtrado de la semana, en taza o para llevar.",
          precio: 9000,
          imagen: "",
          alt: "",
        },
      ],
    },
  ],

  /* ---------- Galería ---------- */
  galeria: [
    {
      imagen: "assets/fotos/comedor.jpg",
      alt: "Comedor de Casa Lumbre con mesas de nogal y luz de tarde",
    },
    {
      imagen: "assets/fotos/galeria-mesa.jpg",
      alt: "Mesa puesta con cerámica clara, lino y vasos de barro",
    },
    {
      imagen: "assets/fotos/galeria-ventana.jpg",
      alt: "Ventanal del comedor con sombra larga sobre el piso",
    },
    {
      imagen: "assets/fotos/galeria-horno.jpg",
      alt: "Horno de leña con brasas en la cocina",
    },
    {
      imagen: "assets/fotos/plato-pulpo.jpg",
      alt: "Detalle del pulpo a la brasa",
    },
    {
      imagen: "assets/fotos/plato-chocolate.jpg",
      alt: "Volcán de chocolate recién abierto",
    },
  ],

  /* ---------- Testimonios ---------- */
  testimonios: [
    {
      cita: "La costilla llega lacada y la yuca, suave. El comedor es sereno: se puede conversar.",
      nombre: "Camila Restrepo",
      detalle: "Medellín",
    },
    {
      cita: "Pedimos el pulpo y el volcán de chocolate. Los tiempos fueron justos y el servicio, atento sin invadir.",
      nombre: "Andrés Gil",
      detalle: "Envigado",
    },
    {
      cita: "Vine un domingo al almuerzo. La carta es corta y todo estaba bien hecho. Volveré por el tartar.",
      nombre: "Lucía Mejía",
      detalle: "Bogotá",
    },
  ],
};
