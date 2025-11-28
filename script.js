/* ---------------------------
  Configuraciones (ajusta aquí)
---------------------------- */
// Cambia la fecha del evento (ISO 8601). Ej: '2025-12-31T17:00:00'
const EVENT_DATE_ISO = '2025-12-27T09:00:00';


// Si quieres texto visible para la fecha:
document.getElementById('eventDateText').textContent = new Date(EVENT_DATE_ISO).toLocaleString();

/* NAV TOGGLE (mobile) */
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');
navToggle && navToggle.addEventListener('click', ()=> navLinks.classList.toggle('show'));

/* LIGHTBOX GALLERY */
const gallery = document.getElementById('gallery');
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');
const closeLightbox = document.getElementById('closeLightbox');

if (gallery) {
  gallery.addEventListener('click', e => {
    if (e.target && e.target.matches('img.gallery-item')) {
      lightboxImg.src = e.target.src;
      lightbox.classList.add('show');
      lightbox.setAttribute('aria-hidden','false');
    }
  });
}
const hideLightbox = () => {
  lightbox.classList.remove('show');
  lightbox.setAttribute('aria-hidden','true');
  lightboxImg.src = '';
};
closeLightbox.addEventListener('click', hideLightbox);
lightbox.addEventListener('click', e => { if(e.target === lightbox) hideLightbox(); });

/* COUNTDOWN */
function updateCountdown() {
  const now = new Date().getTime();
  const eventTime = new Date(EVENT_DATE_ISO).getTime();
  const diff = eventTime - now;
  if (diff <= 0) {
    document.getElementById('countdownTimer').innerHTML = '<div><strong>¡El día ha llegado!</strong></div>';
    clearInterval(countdownInterval);
    return;
  }
  const days = Math.floor(diff / (1000*60*60*24));
  const hours = Math.floor((diff % (1000*60*60*24)) / (1000*60*60));
  const minutes = Math.floor((diff % (1000*60*60)) / (1000*60));
  const seconds = Math.floor((diff % (1000*60)) / 1000);
  document.getElementById('days').textContent = String(days).padStart(2,'0');
  document.getElementById('hours').textContent = String(hours).padStart(2,'0');
  document.getElementById('minutes').textContent = String(minutes).padStart(2,'0');
  document.getElementById('seconds').textContent = String(seconds).padStart(2,'0');
}
const countdownInterval = setInterval(updateCountdown, 1000);
updateCountdown();

/* FRASES ROTADORAS */
const phrases = [
  "El amor no mira con los ojos, sino con el alma.",
  "Juntos es mi lugar favorito.",
  "Donde esté tu corazón, estará mi hogar.",
  "Amar no es mirarse el uno al otro; es mirar juntos en la misma dirección."
];
let phraseIndex = 0;
const phraseText = document.getElementById('phraseText');
document.getElementById('nextPhrase').addEventListener('click', ()=> {
  phraseIndex = (phraseIndex + 1) % phrases.length;
  phraseText.textContent = '"' + phrases[phraseIndex] + '"';
});
document.getElementById('prevPhrase').addEventListener('click', ()=> {
  phraseIndex = (phraseIndex - 1 + phrases.length) % phrases.length;
  phraseText.textContent = '"' + phrases[phraseIndex] + '"';
});

/* RSVP - manejo simple (sin backend) */
const rsvpForm = document.getElementById('rsvpForm');
const rsvpThanks = document.getElementById('rsvpThanks');
if (rsvpForm) {
  rsvpForm.addEventListener('submit', (e)=>{
    e.preventDefault();
    // leer datos
    const data = {
      name: document.getElementById('name').value.trim(),
      phone: document.getElementById('phone').value.trim(),
      attendance: document.getElementById('attendance').value,
      guests: document.getElementById('guests').value,
      message: document.getElementById('message').value.trim()
    };
    // Aquí podrías enviar 'data' a tu servidor via fetch a un endpoint.
    // Por ahora mostramos la pantalla de gracias.
    rsvpForm.hidden = true;
    rsvpThanks.hidden = false;
    console.log('RSVP (simulado):', data);
  });
}

/* Mejoras: reproducir video en modal (opcional), animaciones, etc. */
/* NOTAS para uso:
   - Reemplaza los nombres de las imágenes: foto1.jpg, foto2.jpg... por tus archivos reales.
   - Reemplaza 'video-invitacion.mp4' por tu archivo de video o cambia por un iframe de YouTube.
   - Cambia la constante EVENT_DATE_ISO por la fecha/hora real del matrimonio.
*/

/* VIDEO: overlay play control
   - Si haces click sobre el overlay se reproduce/pausa el video.
   - El overlay se oculta mientras el video está en reproducción. */
document.addEventListener('DOMContentLoaded', ()=>{
  const weddingVideo = document.getElementById('weddingVideo');
  const videoOverlay = document.getElementById('videoOverlay');
  if (!weddingVideo || !videoOverlay) return;

  // Al hacer click en overlay togglear reproducción
  videoOverlay.addEventListener('click', (e)=>{
    e.preventDefault();
    if (weddingVideo.paused) {
      weddingVideo.play().catch(()=>{});
    } else {
      weddingVideo.pause();
    }
  });

  // Mostrar u ocultar overlay según estado
  weddingVideo.addEventListener('play', ()=> videoOverlay.classList.add('hidden'));
  weddingVideo.addEventListener('pause', ()=> videoOverlay.classList.remove('hidden'));
  weddingVideo.addEventListener('ended', ()=> videoOverlay.classList.remove('hidden'));

  // Si el usuario usa el control nativo para reproducir, ocultamos overlay también
  weddingVideo.addEventListener('playing', ()=> videoOverlay.classList.add('hidden'));
});

// Permitir pausar/reproducir haciendo click directamente sobre el área del video
// (pero no interferir con los controles nativos). Solo activamos el toggle si el target
// del click es exactamente el elemento <video>.
document.addEventListener('DOMContentLoaded', ()=>{
  const weddingVideo = document.getElementById('weddingVideo');
  if (!weddingVideo) return;
  // Toggle play/pause on click or tap — implementado para que no vuelva a reproducir al soltar
  let touchHandled = false;
  const togglePlay = (e) => {
    if (e && e.target && e.target !== weddingVideo) return;
    // evitar doble disparo por touch -> click
    if (touchHandled && e && e.type === 'click') return;
    if (weddingVideo.paused) {
      weddingVideo.play().catch(()=>{});
    } else {
      weddingVideo.pause();
    }
  };

  // touchend para móviles (preventDefault para evitar click simulado posterior)
  weddingVideo.addEventListener('touchend', (e) => {
    touchHandled = true;
    togglePlay(e);
    // permitir que otros handlers se ejecuten después de breve tiempo
    setTimeout(()=> touchHandled = false, 500);
    e.preventDefault();
    e.stopPropagation();
  }, {passive:false});

  // click para escritorio
  weddingVideo.addEventListener('click', (e)=>{
    togglePlay(e);
  });
});
