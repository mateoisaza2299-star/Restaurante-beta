/**
 * Pinta la página con los datos de js/datos.js
 * y activa la navegación, las pestañas de la carta
 * y las animaciones al desplazarse.
 */
(function () {
  const datos = RESTAURANTE;

  function soloDigitos(valor) {
    return String(valor).replace(/\D/g, "");
  }

  function formatoPrecio(valor) {
    if (typeof valor === "string" && /[^\d]/.test(valor)) return valor;
    const numero = Number(valor);
    if (!Number.isFinite(numero)) return String(valor);
    const conPuntos = Math.round(numero)
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    return "$" + conPuntos;
  }

  function urlWhatsapp() {
    const numero = soloDigitos(datos.whatsapp);
    const texto = encodeURIComponent(datos.mensajeWhatsapp || "");
    return "https://wa.me/" + numero + "?text=" + texto;
  }

  function urlMapaExterno() {
    return "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(datos.mapa);
  }

  function urlMapaEmbebido() {
    return "https://maps.google.com/maps?q=" + encodeURIComponent(datos.mapa) + "&hl=es&z=16&output=embed";
  }

  function aplicarReserva(enlace) {
    if (!enlace) return;
    enlace.href = urlWhatsapp();
    enlace.target = "_blank";
    enlace.rel = "noopener noreferrer";
  }

  function crearLineas(contenedor, lineas) {
    contenedor.replaceChildren();
    lineas.forEach((linea) => {
      const span = document.createElement("span");
      span.textContent = linea;
      contenedor.appendChild(span);
    });
  }

  function pintarIdentidad() {
    document.title = datos.nombre + " · " + datos.ciudad;
    const descripcion = document.querySelector('meta[name="description"]');
    if (descripcion) {
      descripcion.setAttribute(
        "content",
        datos.nombre + ", " + datos.tagline + " " + datos.direccion.join(", ") + "."
      );
    }

    const logo = document.getElementById("logo");
    logo.textContent = datos.nombre;
    logo.setAttribute("aria-label", datos.nombre + ", inicio");

    const heroFoto = document.getElementById("hero-foto");
    heroFoto.src = datos.hero.imagen;
    heroFoto.alt = datos.hero.alt;
    heroFoto.decoding = "async";
    heroFoto.setAttribute("fetchpriority", "high");
    document.getElementById("hero-ceja").textContent = datos.ciudad;
    document.getElementById("hero-titulo").textContent = datos.nombre;
    document.getElementById("hero-frase").textContent = datos.tagline;

    document.getElementById("acerca-titulo").textContent = datos.titular;
    const cuerpo = document.getElementById("acerca-cuerpo");
    cuerpo.replaceChildren();
    datos.historia.forEach((parrafo) => {
      const p = document.createElement("p");
      p.textContent = parrafo;
      cuerpo.appendChild(p);
    });

    document.getElementById("menu-nota").textContent = datos.notaCarta;

    ["btn-reserva-nav", "btn-reserva-hero", "btn-reserva-visita"].forEach((id) => {
      aplicarReserva(document.getElementById(id));
    });
  }

  function pintarNavegacion() {
    const nav = document.getElementById("navegacion");
    const enlaces = [
      { etiqueta: "Nosotros", href: "#nosotros" },
      { etiqueta: "Menú", href: "#menu" },
      { etiqueta: "Galería", href: "#galeria" },
      { etiqueta: "Visítanos", href: "#visita" },
    ];
    nav.replaceChildren();
    enlaces.forEach((item) => {
      const a = document.createElement("a");
      a.href = item.href;
      a.textContent = item.etiqueta;
      nav.appendChild(a);
    });
  }

  /**
   * Trazos de la carta. Van en terracota vía currentColor.
   * No llevan relleno negro.
   */
  const DIBUJOS = {
    tenedor: '<svg viewBox="0 0 40 72" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M14 8c.4 7 .2 14 2.2 20M20 6v22M26 8c-.4 7-.2 14-2.2 20M16 28c2.4 3.2 5.6 3.2 8 0M20 30v34"/></svg>',
    cuchillo: '<svg viewBox="0 0 40 72" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M16 12c1-7 9-7 10 1l2 16c-1 5-9 5-11 0zM21 30v34"/></svg>',
    cuchara: '<svg viewBox="0 0 40 72" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><ellipse cx="20" cy="16" rx="8" ry="10"/><path d="M20 26v38"/></svg>',
    batidor: '<svg viewBox="0 0 40 72" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M20 38c-12-8-12-24 0-28M20 38c12-8 12-24 0-28M20 38c-6-8-5-20 0-24M20 38c6-8 5-20 0-24M20 38v28"/></svg>',
    sarten: '<svg viewBox="0 0 64 48" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><ellipse cx="24" cy="26" rx="16" ry="10"/><path d="M40 26h16M12 20c4-6 16-6 22 0"/></svg>',
    cucharon: '<svg viewBox="0 0 48 72" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="18" r="10"/><path d="M26 24l12 36"/></svg>',
    copa: '<svg viewBox="0 0 40 72" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M10 8h20M12 8c-1 12 2 18 8 20 6-2 9-8 8-20M20 28v22M12 52h16"/></svg>',
    taza: '<svg viewBox="0 0 48 56" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M10 12h18v16a9 9 0 0 1-18 0zM28 18h4a6 6 0 0 1 0 12h-4M8 46h28"/></svg>',
    hoja: '<svg viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M20 34C8 26 8 12 22 8c4 8 4 16-2 26zM20 34c0-8 2-14 8-18"/></svg>',
    llama: '<svg viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M20 34c-7-5-9-12-5-18 1 4 3 5 3 5 0-6 3-11 7-14-1 5 2 7 2 7 2-2 3-5 3-5 4 5 2 13-10 25z"/></svg>',
    pastel: '<svg viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M8 20h24v8H8zM10 20c2-6 6-8 10-8s8 2 10 8M20 12V8"/></svg>',
    vaso: '<svg viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M10 8h20l-4 14a8 8 0 0 1-12 0zM20 22v8M13 32h14"/></svg>',
  };

  const ESTANTE = ["tenedor", "cuchillo", "cuchara", "batidor", "sarten", "cucharon", "copa", "taza"];
  const ICONO_CATEGORIA = {
    entradas: "hoja",
    fuertes: "llama",
    postres: "pastel",
    bebidas: "vaso",
  };

  function icono(nombre) {
    const marca = document.createElement("span");
    marca.className = "doodle";
    marca.setAttribute("aria-hidden", "true");
    marca.innerHTML = DIBUJOS[nombre] || "";
    return marca;
  }

  /**
   * Carta ilustrada.
   * Lee RESTAURANTE.carta y pinta las categorías.
   * No usa las fotos: el diseño vive en css/estilos.css.
   */
  function crearPlato(plato) {
    const articulo = document.createElement("article");
    articulo.className = "plato";

    const linea = document.createElement("div");
    linea.className = "plato-linea";

    const titulo = document.createElement("h4");
    titulo.className = "plato-nombre";
    titulo.textContent = plato.nombre;

    const puntos = document.createElement("span");
    puntos.className = "puntos";
    puntos.setAttribute("aria-hidden", "true");

    const precio = document.createElement("p");
    precio.className = "precio";
    precio.textContent = formatoPrecio(plato.precio);

    const descripcion = document.createElement("p");
    descripcion.className = "descripcion";
    descripcion.textContent = plato.descripcion;

    linea.append(titulo, puntos, precio);
    articulo.append(linea, descripcion);
    return articulo;
  }

  function crearEstante() {
    const estante = document.createElement("div");
    estante.className = "estante";
    estante.setAttribute("aria-hidden", "true");

    const fila = document.createElement("div");
    fila.className = "estante-fila";
    ESTANTE.forEach((nombre) => fila.appendChild(icono(nombre)));

    const tabla = document.createElement("div");
    tabla.className = "estante-tabla";
    estante.append(fila, tabla);
    return estante;
  }

  function pintarCarta() {
    const raiz = document.getElementById("carta");
    const rejilla = document.createElement("div");
    rejilla.className = "carta-rejilla";

    datos.carta.forEach((categoria) => {
      const caja = document.createElement("section");
      caja.className = "categoria-caja revelar";
      caja.id = "carta-" + categoria.id;
      caja.setAttribute("aria-labelledby", "titulo-" + categoria.id);

      const cabeza = document.createElement("div");
      cabeza.className = "categoria-cabeza";
      cabeza.appendChild(icono(ICONO_CATEGORIA[categoria.id] || "hoja"));

      const titulo = document.createElement("h3");
      titulo.className = "categoria-titulo";
      titulo.id = "titulo-" + categoria.id;
      titulo.textContent = categoria.nombre;
      cabeza.appendChild(titulo);
      caja.appendChild(cabeza);

      if (categoria.nota) {
        const nota = document.createElement("p");
        nota.className = "panel-nota";
        nota.textContent = categoria.nota;
        caja.appendChild(nota);
      }

      const lista = document.createElement("div");
      lista.className = "platos";
      categoria.platos.forEach((plato) => lista.appendChild(crearPlato(plato)));
      caja.appendChild(lista);
      rejilla.appendChild(caja);
    });

    raiz.replaceChildren(crearEstante(), rejilla);
  }

  function pintarGaleria() {
    const grid = document.getElementById("galeria-grid");
    grid.replaceChildren();
    datos.galeria.forEach((foto, indice) => {
      const figura = document.createElement("figure");
      figura.className = "revelar";
      figura.style.transitionDelay = (indice % 3) * 70 + "ms";
      const img = document.createElement("img");
      img.src = foto.imagen;
      img.alt = foto.alt;
      img.width = 900;
      img.height = 900;
      img.loading = "lazy";
      img.decoding = "async";
      figura.appendChild(img);
      grid.appendChild(figura);
    });
  }

  function pintarVisita() {
    crearLineas(document.getElementById("direccion"), datos.direccion);

    const telefono = document.getElementById("telefono");
    telefono.textContent = datos.telefono;
    telefono.href = "tel:" + String(datos.telefono).replace(/[^\d+]/g, "");

    const correo = document.getElementById("correo");
    correo.textContent = datos.correo;
    correo.href = "mailto:" + datos.correo;

    const lista = document.getElementById("horarios");
    lista.replaceChildren();
    datos.horarios.forEach((fila) => {
      const item = document.createElement("div");
      const dia = document.createElement("dt");
      dia.textContent = fila.dia;
      const horas = document.createElement("dd");
      horas.textContent = fila.horas;
      item.append(dia, horas);
      lista.appendChild(item);
    });

    document.getElementById("texto-reserva").textContent = datos.textoReserva;

    const mapa = document.getElementById("mapa");
    mapa.src = urlMapaEmbebido();
    mapa.title = "Mapa de " + datos.nombre + " en " + datos.ciudad;

    const comoLlegar = document.getElementById("como-llegar");
    comoLlegar.href = urlMapaExterno();
  }

  function pintarTestimonios() {
    const lista = document.getElementById("lista-testimonios");
    lista.replaceChildren();
    datos.testimonios.forEach((item) => {
      const cita = document.createElement("blockquote");
      cita.className = "cita revelar";
      const texto = document.createElement("p");
      texto.textContent = item.cita;
      const pie = document.createElement("footer");
      pie.textContent = item.nombre;
      const detalle = document.createElement("span");
      detalle.textContent = item.detalle;
      pie.appendChild(detalle);
      cita.append(texto, pie);
      lista.appendChild(cita);
    });
  }

  function pintarPie() {
    document.getElementById("pie-nombre").textContent = datos.nombre;
    document.getElementById("pie-tagline").textContent = datos.tagline;
    crearLineas(document.getElementById("pie-direccion"), datos.direccion);

    const tel = document.getElementById("pie-telefono");
    tel.textContent = datos.telefono;
    tel.href = "tel:" + String(datos.telefono).replace(/[^\d+]/g, "");

    const correo = document.getElementById("pie-correo");
    correo.textContent = datos.correo;
    correo.href = "mailto:" + datos.correo;

    const redes = document.getElementById("pie-redes");
    redes.replaceChildren();
    datos.redes.forEach((red) => {
      const li = document.createElement("li");
      const a = document.createElement("a");
      a.href = red.url;
      a.textContent = red.nombre;
      a.target = "_blank";
      a.rel = "noopener noreferrer";
      li.appendChild(a);
      redes.appendChild(li);
    });

    aplicarReserva(document.getElementById("btn-reserva-pie"));
    document.getElementById("pie-legal").textContent =
      "© " + new Date().getFullYear() + " " + datos.nombre + ". " + datos.ciudad + ".";
  }

  function pintarWhatsapp() {
    const boton = document.getElementById("whatsapp");
    aplicarReserva(boton);
    boton.setAttribute("aria-label", "Reservar mesa por WhatsApp");
    boton.title = "Reservar por WhatsApp";
  }

  function iniciarNav() {
    const boton = document.getElementById("nav-toggle");
    const nav = document.getElementById("navegacion");
    const etiqueta = boton.querySelector(".sr-only");

    function cerrado(abierto) {
      nav.classList.toggle("abierto", abierto);
      boton.setAttribute("aria-expanded", abierto ? "true" : "false");
      etiqueta.textContent = abierto ? "Cerrar navegación" : "Abrir navegación";
      document.body.classList.toggle("nav-abierta", abierto);
    }

    boton.addEventListener("click", () => {
      cerrado(!nav.classList.contains("abierto"));
    });

    nav.addEventListener("click", (evento) => {
      if (evento.target.closest("a")) cerrado(false);
    });

    document.getElementById("enlace-menu").addEventListener("click", () => cerrado(false));

    document.addEventListener("keydown", (evento) => {
      if (evento.key === "Escape") cerrado(false);
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth >= 900) cerrado(false);
    });
  }

  function iniciarRevelado() {
    const nodos = document.querySelectorAll(".revelar");
    if (!("IntersectionObserver" in window)) {
      nodos.forEach((nodo) => nodo.classList.add("visible"));
      return;
    }
    const observador = new IntersectionObserver(
      (entradas) => {
        entradas.forEach((entrada) => {
          if (!entrada.isIntersecting) return;
          entrada.target.classList.add("visible");
          observador.unobserve(entrada.target);
        });
      },
      { threshold: 0.14, rootMargin: "0px 0px -8% 0px" }
    );
    nodos.forEach((nodo) => observador.observe(nodo));
  }

  function iniciarBarra() {
    const barra = document.getElementById("barra");
    const actualizar = () => barra.classList.toggle("con-borde", window.scrollY > 8);
    actualizar();
    window.addEventListener("scroll", actualizar, { passive: true });
  }

  function iniciarScrollSpy() {
    const secciones = [...document.querySelectorAll("main section[id]")];
    const enlaces = [...document.querySelectorAll("#navegacion a, #enlace-menu")];
    if (!("IntersectionObserver" in window)) return;

    const observador = new IntersectionObserver(
      (entradas) => {
        entradas.forEach((entrada) => {
          if (!entrada.isIntersecting) return;
          const id = "#" + entrada.target.id;
          enlaces.forEach((enlace) => {
            const activo = enlace.getAttribute("href") === id;
            enlace.classList.toggle("activo", activo);
            if (activo) enlace.setAttribute("aria-current", "true");
            else enlace.removeAttribute("aria-current");
          });
        });
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 }
    );

    secciones.forEach((seccion) => observador.observe(seccion));
  }

  function iniciar() {
    pintarIdentidad();
    pintarNavegacion();
    pintarCarta();
    pintarGaleria();
    pintarVisita();
    pintarTestimonios();
    pintarPie();
    pintarWhatsapp();
    iniciarNav();
    iniciarRevelado();
    iniciarBarra();
    iniciarScrollSpy();
  }

  iniciar();
})();
