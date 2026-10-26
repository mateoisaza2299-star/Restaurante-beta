/**
 * Pinta la página con los datos de js/datos.js
 * y activa la navegación, las pestañas de la carta,
 * la reserva, la galería y las animaciones.
 * Si los datos no están, el HTML estático sigue visible.
 */
(function () {
  const datos = typeof RESTAURANTE === "undefined" ? null : RESTAURANTE;
  const formatoCOP = new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  });

  function soloDigitos(valor) {
    return String(valor || "").replace(/\D/g, "");
  }

  function formatoPrecio(valor) {
    if (valor === null || valor === undefined || valor === "") return "Consultar";
    if (typeof valor === "string") {
      const limpio = valor.trim();
      if (!limpio || /consultar/i.test(limpio)) return "Consultar";
      if (!/^\d+$/.test(limpio)) return "Consultar";
      return formatoCOP.format(Number(limpio));
    }
    const numero = Number(valor);
    if (!Number.isFinite(numero)) return "Consultar";
    return formatoCOP.format(numero);
  }

  function numeroWhatsapp() {
    const bruto = String((datos && datos.whatsapp) || "");
    if (!bruto.trim() || /pendiente/i.test(bruto)) return "";
    const digitos = soloDigitos(bruto);
    if (digitos.length < 10 || digitos.length > 15) return "";
    return digitos;
  }

  function urlWhatsapp(texto) {
    const numero = numeroWhatsapp();
    if (!numero) return "";
    return "https://wa.me/" + numero + "?text=" + encodeURIComponent(texto || "");
  }

  function urlMapaExterno() {
    return "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(datos.mapa || "");
  }

  function urlMapaEmbebido() {
    return "https://maps.google.com/maps?q=" + encodeURIComponent(datos.mapa || "") + "&hl=es&z=16&output=embed";
  }

  function avisoExterno(enlace) {
    if (!enlace || enlace.querySelector(".sr-only")) return;
    const extra = document.createElement("span");
    extra.className = "sr-only";
    extra.textContent = " (se abre en una pestaña nueva)";
    enlace.appendChild(extra);
  }

  function crearLineas(contenedor, lineas) {
    if (!contenedor || !Array.isArray(lineas) || !lineas.length) return;
    contenedor.replaceChildren();
    lineas.forEach((linea) => {
      const span = document.createElement("span");
      span.textContent = linea;
      contenedor.appendChild(span);
    });
  }

  function mostrarAviso(texto) {
    let aviso = document.getElementById("aviso-global");
    if (!aviso) {
      aviso = document.createElement("p");
      aviso.id = "aviso-global";
      aviso.className = "aviso-datos";
      aviso.setAttribute("role", "status");
      const main = document.getElementById("contenido");
      main.insertBefore(aviso, main.firstChild);
    }
    aviso.hidden = false;
    aviso.textContent = texto;
  }

  function ponerMeta(selector, valor) {
    const nodo = document.querySelector(selector);
    if (nodo && valor) nodo.setAttribute("content", valor);
  }

  function fijarAnclasReserva() {
    ["btn-reserva-nav", "btn-reserva-hero", "btn-reserva-visita", "btn-reserva-pie"].forEach((id) => {
      const enlace = document.getElementById(id);
      if (!enlace) return;
      enlace.href = "#reservar";
      enlace.removeAttribute("target");
    });
  }

  function pintarIdentidad() {
    const titulo = datos.nombre + " · " + datos.ciudad;
    document.title = titulo;
    const resumen =
      datos.nombre +
      ", " +
      datos.tagline +
      (Array.isArray(datos.direccion) && datos.direccion.length ? " " + datos.direccion.join(", ") + "." : "");
    ponerMeta('meta[name="description"]', resumen);
    ponerMeta('meta[property="og:title"]', titulo);
    ponerMeta('meta[property="og:description"]', resumen);
    ponerMeta('meta[name="twitter:title"]', titulo);
    ponerMeta('meta[name="twitter:description"]', resumen);

    const logo = document.getElementById("logo");
    if (datos.nombre) {
      logo.textContent = datos.nombre;
      logo.setAttribute("aria-label", datos.nombre + ", inicio");
    }

    const heroFoto = document.getElementById("hero-foto");
    if (datos.hero && datos.hero.imagen) {
      heroFoto.src = datos.hero.imagen;
      heroFoto.alt = datos.hero.alt || "Foto de " + datos.nombre;
      heroFoto.decoding = "async";
      heroFoto.loading = "eager";
      heroFoto.setAttribute("fetchpriority", "high");
    }
    if (datos.ciudad) document.getElementById("hero-ceja").textContent = datos.ciudad;
    if (datos.nombre) document.getElementById("hero-titulo").textContent = datos.nombre;
    if (datos.tagline) document.getElementById("hero-frase").textContent = datos.tagline;

    if (datos.titular) document.getElementById("acerca-titulo").textContent = datos.titular;
    if (Array.isArray(datos.historia) && datos.historia.length) {
      const cuerpo = document.getElementById("acerca-cuerpo");
      cuerpo.replaceChildren();
      datos.historia.forEach((parrafo) => {
        const p = document.createElement("p");
        p.textContent = parrafo;
        cuerpo.appendChild(p);
      });
    }

    const retrato = document.getElementById("acerca-img");
    if (datos.retrato && datos.retrato.imagen) {
      retrato.src = datos.retrato.imagen;
      retrato.alt = datos.retrato.alt || "Cocina de " + datos.nombre;
      retrato.loading = "lazy";
      retrato.decoding = "async";
    }
    if (datos.retrato && datos.retrato.pie) document.getElementById("acerca-pie").textContent = datos.retrato.pie;
    if (datos.notaCarta) document.getElementById("menu-nota").textContent = datos.notaCarta;
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
    descripcion.textContent = plato.descripcion || "";

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

  function avisoCarta(texto) {
    const raiz = document.getElementById("carta");
    const aviso = document.createElement("p");
    aviso.className = "aviso-datos";
    aviso.textContent = texto;
    raiz.replaceChildren(aviso);
  }

  function pintarCarta() {
    const raiz = document.getElementById("carta");
    if (!Array.isArray(datos.carta) || !datos.carta.length) {
      avisoCarta("Hoy no hay platos publicados. Escríbenos y te contamos la carta de la semana.");
      return;
    }

    const pestanas = document.createElement("div");
    pestanas.className = "pestanas";
    pestanas.setAttribute("role", "tablist");
    pestanas.setAttribute("aria-label", "Categorías de la carta");

    const rejilla = document.createElement("div");
    rejilla.className = "carta-rejilla";
    rejilla.id = "carta-paneles";
    rejilla.setAttribute("role", "tabpanel");

    const botones = [];

    function seleccionar(id) {
      botones.forEach((boton) => {
        const activo = boton.dataset.categoria === id;
        boton.setAttribute("aria-selected", activo ? "true" : "false");
        boton.tabIndex = activo ? 0 : -1;
        if (activo) rejilla.setAttribute("aria-labelledby", boton.id);
      });
      rejilla.querySelectorAll(".categoria-caja").forEach((caja) => {
        const visible = id === "todas" || caja.dataset.categoria === id;
        caja.hidden = !visible;
        if (visible) caja.classList.add("visible");
      });
    }

    function crearTab(id, nombre) {
      const boton = document.createElement("button");
      boton.type = "button";
      boton.className = "pestana";
      boton.setAttribute("role", "tab");
      boton.dataset.categoria = id;
      boton.id = "tab-" + id;
      boton.textContent = nombre;
      boton.setAttribute("aria-selected", id === "todas" ? "true" : "false");
      boton.tabIndex = id === "todas" ? 0 : -1;
      boton.setAttribute("aria-controls", id === "todas" ? "carta-paneles" : "carta-" + id);
      boton.addEventListener("click", () => seleccionar(id));
      botones.push(boton);
      pestanas.appendChild(boton);
    }

    crearTab("todas", "Toda la carta");
    datos.carta.forEach((categoria) => {
      if (categoria && categoria.nombre) crearTab(categoria.id || categoria.nombre, categoria.nombre);
    });
    rejilla.setAttribute("aria-labelledby", "tab-todas");

    pestanas.addEventListener("keydown", (evento) => {
      const claves = ["ArrowRight", "ArrowLeft", "Home", "End"];
      if (!claves.includes(evento.key)) return;
      const actual = botones.indexOf(document.activeElement);
      if (actual < 0) return;
      evento.preventDefault();
      let siguiente = actual;
      if (evento.key === "ArrowRight") siguiente = (actual + 1) % botones.length;
      if (evento.key === "ArrowLeft") siguiente = (actual - 1 + botones.length) % botones.length;
      if (evento.key === "Home") siguiente = 0;
      if (evento.key === "End") siguiente = botones.length - 1;
      seleccionar(botones[siguiente].dataset.categoria);
      botones[siguiente].focus();
    });

    datos.carta.forEach((categoria) => {
      if (!categoria || !Array.isArray(categoria.platos)) return;
      const caja = document.createElement("section");
      caja.className = "categoria-caja revelar";
      caja.dataset.categoria = categoria.id || categoria.nombre;
      caja.id = "carta-" + caja.dataset.categoria;
      caja.setAttribute("aria-labelledby", "titulo-" + caja.dataset.categoria);

      const cabeza = document.createElement("div");
      cabeza.className = "categoria-cabeza";
      cabeza.appendChild(icono(ICONO_CATEGORIA[categoria.id] || "hoja"));

      const titulo = document.createElement("h3");
      titulo.className = "categoria-titulo";
      titulo.id = "titulo-" + caja.dataset.categoria;
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
      categoria.platos.forEach((plato) => {
        if (plato && plato.nombre) lista.appendChild(crearPlato(plato));
      });
      caja.appendChild(lista);
      rejilla.appendChild(caja);
    });

    if (!rejilla.childElementCount) {
      avisoCarta("Hoy no hay platos publicados. Escríbenos y te contamos la carta de la semana.");
      return;
    }

    raiz.replaceChildren(pestanas, crearEstante(), rejilla);
  }

  function pintarGaleria() {
    const grid = document.getElementById("galeria-grid");
    if (!Array.isArray(datos.galeria) || !datos.galeria.length) {
      const aviso = document.createElement("p");
      aviso.className = "aviso-datos";
      aviso.textContent = "Todavía no hay fotos publicadas.";
      grid.replaceChildren(aviso);
      return;
    }
    grid.replaceChildren();
    datos.galeria.forEach((foto, indice) => {
      if (!foto || !foto.imagen) return;
      const figura = document.createElement("figure");
      figura.className = "revelar";
      figura.style.transitionDelay = (indice % 3) * 70 + "ms";
      const boton = document.createElement("button");
      boton.type = "button";
      boton.className = "galeria-btn";
      const img = document.createElement("img");
      img.src = foto.imagen;
      img.alt = foto.alt || "Foto de " + datos.nombre;
      img.width = 900;
      img.height = 900;
      img.loading = "lazy";
      img.decoding = "async";
      boton.appendChild(img);
      figura.appendChild(boton);
      grid.appendChild(figura);
    });
    if (!grid.childElementCount) {
      const aviso = document.createElement("p");
      aviso.className = "aviso-datos";
      aviso.textContent = "Todavía no hay fotos publicadas.";
      grid.appendChild(aviso);
    }
  }

  function pintarVisita() {
    crearLineas(document.getElementById("direccion"), datos.direccion);

    const telefono = document.getElementById("telefono");
    if (datos.telefono) {
      telefono.textContent = datos.telefono;
      telefono.href = "tel:" + String(datos.telefono).replace(/[^\d+]/g, "");
    }

    const correo = document.getElementById("correo");
    if (datos.correo) {
      correo.textContent = datos.correo;
      correo.href = "mailto:" + datos.correo;
    }

    if (Array.isArray(datos.horarios) && datos.horarios.length) {
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
    }

    if (datos.textoReserva) document.getElementById("texto-reserva").textContent = datos.textoReserva;

    const mapa = document.getElementById("mapa");
    if (datos.mapa) {
      mapa.src = urlMapaEmbebido();
      mapa.title = "Mapa de " + datos.nombre + " en " + datos.ciudad;
      const comoLlegar = document.getElementById("como-llegar");
      comoLlegar.href = urlMapaExterno();
      comoLlegar.target = "_blank";
      comoLlegar.rel = "noopener noreferrer";
      avisoExterno(comoLlegar);
    }
  }

  function pintarTestimonios() {
    const seccion = document.getElementById("voces");
    const lista = document.getElementById("lista-testimonios");
    const reales = Array.isArray(datos.testimonios)
      ? datos.testimonios.filter((item) => item && item.cita && item.nombre)
      : [];
    if (!reales.length) {
      seccion.hidden = true;
      return;
    }
    seccion.hidden = false;
    lista.replaceChildren();
    reales.forEach((item) => {
      const cita = document.createElement("blockquote");
      cita.className = "cita revelar";
      const texto = document.createElement("p");
      texto.textContent = item.cita;
      const pie = document.createElement("footer");
      pie.textContent = item.nombre;
      if (item.detalle) {
        const detalle = document.createElement("span");
        detalle.textContent = item.detalle;
        pie.appendChild(detalle);
      }
      cita.append(texto, pie);
      lista.appendChild(cita);
    });
  }

  function pintarPie() {
    if (datos.nombre) document.getElementById("pie-nombre").textContent = datos.nombre;
    if (datos.tagline) document.getElementById("pie-tagline").textContent = datos.tagline;
    crearLineas(document.getElementById("pie-direccion"), datos.direccion);

    const tel = document.getElementById("pie-telefono");
    if (datos.telefono) {
      tel.textContent = datos.telefono;
      tel.href = "tel:" + String(datos.telefono).replace(/[^\d+]/g, "");
    }

    const correo = document.getElementById("pie-correo");
    if (datos.correo) {
      correo.textContent = datos.correo;
      correo.href = "mailto:" + datos.correo;
    }

    if (Array.isArray(datos.redes) && datos.redes.length) {
      const redes = document.getElementById("pie-redes");
      redes.replaceChildren();
      datos.redes.forEach((red) => {
        if (!red || !red.url || !red.nombre) return;
        const li = document.createElement("li");
        const a = document.createElement("a");
        a.href = red.url;
        a.textContent = red.nombre;
        a.target = "_blank";
        a.rel = "noopener noreferrer";
        avisoExterno(a);
        li.appendChild(a);
        redes.appendChild(li);
      });
    }

    document.getElementById("pie-legal").textContent =
      "© " + new Date().getFullYear() + " " + datos.nombre + ". " + datos.ciudad + ".";
  }

  function pintarWhatsapp() {
    const texto = datos.mensajeWhatsapp || "Hola, quiero reservar una mesa en " + datos.nombre + ".";
    const url = urlWhatsapp(texto);
    ["whatsapp", "enlace-whatsapp", "pie-whatsapp"].forEach((id) => {
      const enlace = document.getElementById(id);
      if (!enlace || !url) return;
      const etiqueta = enlace.querySelector(".sr-only");
      if (id === "enlace-whatsapp" && datos.whatsapp) {
        enlace.textContent = "WhatsApp " + datos.whatsapp;
      }
      enlace.href = url;
      enlace.target = "_blank";
      enlace.rel = "noopener noreferrer";
      if (etiqueta) enlace.appendChild(etiqueta);
      else avisoExterno(enlace);
      if (id === "whatsapp") {
        enlace.setAttribute("aria-label", "Reservar mesa por WhatsApp");
        enlace.title = "Reservar por WhatsApp";
      }
    });
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

    document.querySelectorAll(".barra a").forEach((enlace) => {
      enlace.addEventListener("click", () => cerrado(false));
    });

    document.addEventListener("keydown", (evento) => {
      if (evento.key !== "Escape") return;
      if (document.querySelector("dialog[open]")) return;
      cerrado(false);
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth >= 900) cerrado(false);
    });
  }

  function hoyBogota() {
    return new Intl.DateTimeFormat("en-CA", {
      timeZone: "America/Bogota",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(new Date());
  }

  function fechaValida(fecha) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(fecha)) return false;
    const partes = fecha.split("-").map(Number);
    const probe = new Date(Date.UTC(partes[0], partes[1] - 1, partes[2]));
    return (
      probe.getUTCFullYear() === partes[0] &&
      probe.getUTCMonth() === partes[1] - 1 &&
      probe.getUTCDate() === partes[2]
    );
  }

  function normalizarHora(valor) {
    const match = String(valor || "").match(/^(\d{2}):(\d{2})/);
    return match ? match[1] + ":" + match[2] : "";
  }

  function esReservaFutura(fecha, hora) {
    const cuando = new Date(fecha + "T" + hora + ":00-05:00");
    if (Number.isNaN(cuando.getTime())) return false;
    return cuando.getTime() >= Date.now() - 60000;
  }

  function limpio(valor) {
    return String(valor || "").replace(/\s+/g, " ").trim();
  }

  function leerReserva(form) {
    const campo = (nombre) => form.elements[nombre];
    return {
      nombre: limpio(campo("nombre").value),
      telefono: limpio(campo("telefono").value),
      fecha: limpio(campo("fecha").value),
      hora: normalizarHora(campo("hora").value),
      personas: limpio(campo("personas").value),
      notas: limpio(campo("notas").value),
    };
  }

  function validarReserva(reserva) {
    if (reserva.nombre.length < 2) {
      return { mensaje: "Escribe tu nombre para reservar.", campo: "reserva-nombre" };
    }
    const digitos = soloDigitos(reserva.telefono);
    if (digitos.length < 7 || digitos.length > 15) {
      return { mensaje: "Escribe un teléfono donde podamos confirmar.", campo: "reserva-telefono" };
    }
    if (!fechaValida(reserva.fecha)) {
      return { mensaje: "Elige una fecha válida.", campo: "reserva-fecha" };
    }
    if (!reserva.hora) {
      return { mensaje: "Elige la hora de la reserva.", campo: "reserva-hora" };
    }
    if (!esReservaFutura(reserva.fecha, reserva.hora)) {
      return { mensaje: "Elige una fecha y una hora que todavía no hayan pasado.", campo: "reserva-fecha" };
    }
    const personas = Number(reserva.personas);
    if (!Number.isInteger(personas) || personas < 1 || personas > 20) {
      return { mensaje: "Indica entre 1 y 20 personas.", campo: "reserva-personas" };
    }
    if (reserva.notas.length > 400) {
      return { mensaje: "Las notas son demasiado largas.", campo: "reserva-notas" };
    }
    return null;
  }

  function mensajeReserva(reserva) {
    const saludo = datos.mensajeWhatsapp || "Hola, quiero reservar una mesa en " + datos.nombre + ".";
    const lineas = [
      saludo,
      "Nombre: " + reserva.nombre,
      "Teléfono: " + reserva.telefono,
      "Fecha: " + reserva.fecha,
      "Hora: " + reserva.hora,
      "Personas: " + reserva.personas,
    ];
    if (reserva.notas) lineas.push("Notas: " + reserva.notas);
    return lineas.join("\n");
  }

  function marcarCampos(idInvalido) {
    ["reserva-nombre", "reserva-telefono", "reserva-fecha", "reserva-hora", "reserva-personas", "reserva-notas"].forEach(
      (id) => {
        const campo = document.getElementById(id);
        if (!campo) return;
        const invalido = id === idInvalido;
        campo.setAttribute("aria-invalid", invalido ? "true" : "false");
        if (invalido) campo.setAttribute("aria-describedby", "reserva-error");
        else campo.removeAttribute("aria-describedby");
      }
    );
  }

  function iniciarReserva() {
    const form = document.getElementById("form-reserva");
    if (!form) return;
    const fecha = document.getElementById("reserva-fecha");
    const error = document.getElementById("reserva-error");
    const fijarMinimo = () => {
      fecha.min = hoyBogota();
    };
    fijarMinimo();
    fecha.addEventListener("focus", fijarMinimo);

    form.addEventListener("input", () => {
      if (error.hidden) return;
      error.hidden = true;
      error.textContent = "";
    });

    form.addEventListener("submit", (evento) => {
      evento.preventDefault();
      fijarMinimo();
      const reserva = leerReserva(form);
      const fallo = validarReserva(reserva);
      if (fallo) {
        error.hidden = false;
        error.textContent = fallo.mensaje;
        marcarCampos(fallo.campo);
        const campo = document.getElementById(fallo.campo);
        if (campo) campo.focus();
        return;
      }
      const url = urlWhatsapp(mensajeReserva(reserva));
      if (!url) {
        error.hidden = false;
        error.textContent = "Aún no tenemos el WhatsApp configurado. Llama al teléfono de la página para reservar.";
        marcarCampos("");
        return;
      }
      error.hidden = true;
      error.textContent = "";
      marcarCampos("");
      const ventana = window.open(url, "_blank", "noopener,noreferrer");
      if (!ventana) window.location.href = url;
    });
  }

  function iniciarLightbox() {
    const dialogo = document.getElementById("lightbox");
    const cerrar = document.getElementById("lightbox-cerrar");
    const anterior = document.getElementById("lightbox-anterior");
    const siguiente = document.getElementById("lightbox-siguiente");
    if (!dialogo || !cerrar) return;

    let imagen = null;
    let indice = 0;
    let origen = null;

    function fotos() {
      return [...document.querySelectorAll(".galeria-btn img")];
    }

    function asegurarImagen() {
      if (imagen) return imagen;
      imagen = document.createElement("img");
      imagen.id = "lightbox-img";
      imagen.width = 1200;
      imagen.height = 800;
      dialogo.appendChild(imagen);
      return imagen;
    }

    function mostrar(i) {
      const lista = fotos();
      if (!lista.length) return;
      indice = (i + lista.length) % lista.length;
      const foto = lista[indice];
      const vista = asegurarImagen();
      vista.src = foto.currentSrc || foto.src;
      vista.alt = foto.alt;
      origen = foto.closest("button");
      if (!dialogo.open) dialogo.showModal();
    }

    document.getElementById("galeria-grid").addEventListener("click", (evento) => {
      const boton = evento.target.closest(".galeria-btn");
      if (!boton) return;
      const lista = fotos();
      const foto = boton.querySelector("img");
      mostrar(Math.max(0, lista.indexOf(foto)));
    });

    cerrar.addEventListener("click", () => dialogo.close());
    anterior.addEventListener("click", () => mostrar(indice - 1));
    siguiente.addEventListener("click", () => mostrar(indice + 1));

    dialogo.addEventListener("click", (evento) => {
      if (evento.target === dialogo) dialogo.close();
    });

    dialogo.addEventListener("close", () => {
      if (origen) origen.focus();
    });

    dialogo.addEventListener("keydown", (evento) => {
      if (evento.key === "ArrowRight") {
        evento.preventDefault();
        mostrar(indice + 1);
      } else if (evento.key === "ArrowLeft") {
        evento.preventDefault();
        mostrar(indice - 1);
      }
    });
  }

  function iniciarRevelado() {
    const nodos = document.querySelectorAll(".revelar");
    const reducido = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducido || !("IntersectionObserver" in window)) {
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

  function revelarEstatico() {
    document.documentElement.classList.remove("animar");
    document.querySelectorAll(".revelar").forEach((nodo) => nodo.classList.add("visible"));
  }

  function iniciar() {
    if (!datos || !datos.nombre) {
      mostrarAviso("No pudimos cargar los datos del restaurante. El horario, la dirección y el contacto siguen en la página.");
      iniciarNav();
      iniciarReserva();
      return;
    }
    try {
      document.documentElement.classList.add("animar");
      pintarIdentidad();
      pintarNavegacion();
      pintarCarta();
      pintarGaleria();
      pintarVisita();
      pintarTestimonios();
      pintarPie();
      pintarWhatsapp();
      fijarAnclasReserva();
      iniciarNav();
      iniciarReserva();
      iniciarLightbox();
      iniciarRevelado();
      iniciarBarra();
      iniciarScrollSpy();
    } catch (error) {
      revelarEstatico();
      mostrarAviso("Algo falló al preparar la página. El horario, la dirección y el contacto siguen disponibles.");
      iniciarNav();
    }
  }

  iniciar();
})();
