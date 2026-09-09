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
