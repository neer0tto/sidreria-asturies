// Menú de navegación móvil
const botonMenu = document.getElementById('botonMenu');
const navPrincipal = document.getElementById('navPrincipal');

botonMenu.addEventListener('click', () => {
  const abierto = navPrincipal.classList.toggle('esta-abierto');
  botonMenu.classList.toggle('esta-abierto');
  botonMenu.setAttribute('aria-expanded', abierto);
});

navPrincipal.querySelectorAll('a').forEach((enlace) => {
  enlace.addEventListener('click', () => {
    navPrincipal.classList.remove('esta-abierto');
    botonMenu.classList.remove('esta-abierto');
    botonMenu.setAttribute('aria-expanded', 'false');
  });
});

// Menú de secciones: tarjetas que abren cada sección a pantalla completa con fundido suave
const gridSecciones = document.getElementById('gridSecciones');
const tarjetasSeccion = document.querySelectorAll('.tarjeta-seccion');
const seccionesCompletas = document.querySelectorAll('.seccion-completa');

function abrirSeccion(id) {
  const seccion = document.getElementById(id);
  if (!seccion || !seccion.classList.contains('seccion-completa')) return;
  gridSecciones.classList.add('oculta');
  seccion.classList.add('activa');
  seccion.setAttribute('aria-hidden', 'false');
  document.body.classList.add('seccion-abierta');
}

function cerrarSeccion(seccion) {
  seccion.classList.remove('activa');
  seccion.setAttribute('aria-hidden', 'true');
  gridSecciones.classList.remove('oculta');
  document.body.classList.remove('seccion-abierta');
}

tarjetasSeccion.forEach((tarjeta) => {
  tarjeta.addEventListener('click', () => abrirSeccion(tarjeta.dataset.seccion));
});

seccionesCompletas.forEach((seccion) => {
  seccion.setAttribute('aria-hidden', 'true');
  const botonCerrar = seccion.querySelector('[data-cerrar]');
  if (botonCerrar) {
    botonCerrar.addEventListener('click', () => cerrarSeccion(seccion));
  }
});

// Los enlaces del header abren la sección correspondiente con el mismo fundido
navPrincipal.querySelectorAll('a[href^="#"]').forEach((enlace) => {
  const idDestino = enlace.getAttribute('href').slice(1);
  const destino = document.getElementById(idDestino);
  if (destino && destino.classList.contains('seccion-completa')) {
    enlace.addEventListener('click', (evento) => {
      evento.preventDefault();
      abrirSeccion(idDestino);
    });
  }
});

// Animación de aparición al hacer scroll (fade in + desplazamiento hacia arriba)
const observador = new IntersectionObserver((entradas) => {
  entradas.forEach((entrada) => {
    if (entrada.isIntersecting) {
      entrada.target.classList.add('visible');
      observador.unobserve(entrada.target);
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll('.reveal').forEach((seccion) => observador.observe(seccion));

// Tarjetas del menú: aparecen una tras otra (stagger)
const tarjetasPlatos = document.querySelectorAll('.plato-card');

const observadorPlatos = new IntersectionObserver((entradas) => {
  entradas.forEach((entrada) => {
    if (entrada.isIntersecting) {
      const indice = Array.from(tarjetasPlatos).indexOf(entrada.target);
      entrada.target.style.transitionDelay = `${indice * 0.1}s`;
      entrada.target.classList.add('visible');
      observadorPlatos.unobserve(entrada.target);
    }
  });
}, { threshold: 0.15 });

tarjetasPlatos.forEach((tarjeta) => observadorPlatos.observe(tarjeta));

// Tarjetas del menú de secciones: aparecen con fundido + escala leve, en cascada
const observadorTarjetasSeccion = new IntersectionObserver((entradas) => {
  entradas.forEach((entrada) => {
    if (entrada.isIntersecting) {
      const indice = Array.from(tarjetasSeccion).indexOf(entrada.target);
      entrada.target.style.transitionDelay = `${indice * 0.12}s`;
      entrada.target.classList.add('visible');
      observadorTarjetasSeccion.unobserve(entrada.target);
    }
  });
}, { threshold: 0.2 });

tarjetasSeccion.forEach((tarjeta) => observadorTarjetasSeccion.observe(tarjeta));

// Parallax sutil: la textura de fondo de cada sección se desplaza más lento que el contenido
const prefiereMovimientoReducido = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (!prefiereMovimientoReducido) {
  seccionesCompletas.forEach((seccion) => {
    let ticking = false;
    seccion.addEventListener('scroll', () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const desplazamiento = Math.max(-18, Math.min(18, seccion.scrollTop * 0.15));
        seccion.style.backgroundPositionY = `${desplazamiento}px`;
        ticking = false;
      });
    });
  });
}

// Formulario de reservas: arma el mensaje y abre WhatsApp con los datos ya escritos
const formularioReservas = document.getElementById('formularioReservas');
const NUMERO_WHATSAPP = '34918411365'; // PLACEHOLDER: confirmar que este número tenga WhatsApp Business activo

formularioReservas.addEventListener('submit', (evento) => {
  evento.preventDefault();

  const datos = new FormData(formularioReservas);
  const nombre = datos.get('nombre');
  const telefono = datos.get('telefono');
  const fecha = datos.get('fecha');
  const hora = datos.get('hora');
  const personas = datos.get('personas');
  const comentarios = datos.get('comentarios');

  let mensaje = `Hola, quiero reservar mesa en Sidrería Paraíso Asturies.%0A`;
  mensaje += `Nombre: ${nombre}%0A`;
  mensaje += `Teléfono: ${telefono}%0A`;
  mensaje += `Fecha: ${fecha}%0A`;
  mensaje += `Hora: ${hora}%0A`;
  mensaje += `Personas: ${personas}`;
  if (comentarios) {
    mensaje += `%0AComentarios: ${comentarios}`;
  }

  window.open(`https://wa.me/${NUMERO_WHATSAPP}?text=${mensaje}`, '_blank');
});
