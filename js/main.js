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

    const retrato = document.getElementById("acerca-img");
    retrato.src = datos.retrato.imagen;
    retrato.alt = datos.retrato.alt;
    document.getElementById("acerca-pie").textContent = datos.retrato.pie;
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
   * Carta digital.
   * Lee RESTAURANTE.carta y arma las pestañas y los platos.
   * El diseño vive en css/estilos.css; los precios, aquí no se escriben a mano.
   */
  function crearPlato(plato, indice) {
    const articulo = document.createElement("article");
    articulo.className = "plato revelar";
    articulo.style.transitionDelay = (indice % 2) * 70 + "ms";

    const marco = document.createElement("div");
    marco.className = "plato-marco";

    if (plato.imagen) {
      const img = document.createElement("img");
      img.src = plato.imagen;
      img.alt = plato.alt || "";
      img.width = 1152;
      img.height = 864;
      img.loading = "lazy";
      img.decoding = "async";
      img.addEventListener("error", () => {
        marco.remove();
        articulo.classList.add("sin-foto");
      });
      marco.appendChild(img);
      articulo.appendChild(marco);
    } else {
      articulo.classList.add("sin-foto");
    }

    const info = document.createElement("div");
    info.className = "plato-cuerpo";
    const cabeza = document.createElement("div");
    cabeza.className = "plato-cabeza";

    const titulo = document.createElement("h3");
    titulo.textContent = plato.nombre;

    const precio = document.createElement("p");
    precio.className = "precio";
    precio.textContent = formatoPrecio(plato.precio);

    const descripcion = document.createElement("p");
    descripcion.className = "descripcion";
    descripcion.textContent = plato.descripcion;

    cabeza.append(titulo, precio);
    info.append(cabeza, descripcion);
    articulo.appendChild(info);
    return articulo;
  }

  function pintarCarta() {
    const raiz = document.getElementById("carta");
    const pestanas = document.createElement("div");
    pestanas.className = "pestanas";
    pestanas.setAttribute("role", "tablist");
    pestanas.setAttribute("aria-label", "Categorías de la carta");

    const paneles = document.createElement("div");
    paneles.className = "paneles";

    datos.carta.forEach((categoria, indice) => {
      const tab = document.createElement("button");
      tab.type = "button";
      tab.className = "pestana";
      tab.id = "tab-" + categoria.id;
      tab.setAttribute("role", "tab");
      tab.setAttribute("aria-controls", "panel-" + categoria.id);
      tab.setAttribute("aria-selected", indice === 0 ? "true" : "false");
      tab.tabIndex = indice === 0 ? 0 : -1;
      tab.textContent = categoria.nombre;

      const panel = document.createElement("div");
      panel.className = "panel";
      panel.id = "panel-" + categoria.id;
      panel.setAttribute("role", "tabpanel");
      panel.setAttribute("aria-labelledby", tab.id);
      panel.hidden = indice !== 0;

      const marca = document.createElement("div");
      marca.className = "categoria-marca";
      const tituloCategoria = document.createElement("p");
      tituloCategoria.className = "categoria-titulo";
      tituloCategoria.textContent = categoria.nombre;
      marca.appendChild(tituloCategoria);
      panel.appendChild(marca);

      if (categoria.nota) {
        const nota = document.createElement("p");
        nota.className = "panel-nota";
        nota.textContent = categoria.nota;
        panel.appendChild(nota);
      }

      const lista = document.createElement("div");
      lista.className = "platos";
      categoria.platos.forEach((plato, indicePlato) => {
        lista.appendChild(crearPlato(plato, indicePlato));
      });
      panel.appendChild(lista);

      pestanas.appendChild(tab);
      paneles.appendChild(panel);
    });

    raiz.replaceChildren(pestanas, paneles);
    iniciarPestanas(pestanas);
  }

  function iniciarPestanas(lista) {
    const tabs = [...lista.querySelectorAll('[role="tab"]')];

    function seleccionar(indice) {
      tabs.forEach((tab, i) => {
        const activo = i === indice;
        tab.setAttribute("aria-selected", activo ? "true" : "false");
        tab.tabIndex = activo ? 0 : -1;
        const panel = document.getElementById(tab.getAttribute("aria-controls"));
        panel.hidden = !activo;
        if (activo) {
          panel.classList.remove("entra");
          void panel.offsetWidth;
          panel.classList.add("entra");
          panel.querySelectorAll(".revelar").forEach((nodo) => {
            nodo.classList.remove("visible");
            void nodo.offsetWidth;
            nodo.classList.add("visible");
          });
        }
      });
    }

    tabs.forEach((tab, indice) => {
      tab.addEventListener("click", () => seleccionar(indice));
      tab.addEventListener("keydown", (evento) => {
        let siguiente = null;
        if (evento.key === "ArrowRight") siguiente = (indice + 1) % tabs.length;
        if (evento.key === "ArrowLeft") siguiente = (indice - 1 + tabs.length) % tabs.length;
        if (evento.key === "Home") siguiente = 0;
        if (evento.key === "End") siguiente = tabs.length - 1;
        if (siguiente === null) return;
        evento.preventDefault();
        seleccionar(siguiente);
        tabs[siguiente].focus();
      });
    });
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
