(() => {
  const floatWa = document.querySelector('.float-wa');
  const onScroll = () => { if (floatWa) floatWa.classList.toggle('is-on', window.scrollY > window.innerHeight * 0.7); };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* Entradas escalonadas */
  document.querySelectorAll('section').forEach((sec) => {
    sec.querySelectorAll('.reveal').forEach((el, i) => el.style.setProperty('--d', `${Math.min(i, 5) * 80}ms`));
  });
  const io = new IntersectionObserver((entries) => {
    entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); } });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.1 });
  document.querySelectorAll('.reveal').forEach((el) => io.observe(el));

  /* Hoja de ruta: el tramo que está en el centro de la pantalla se resalta */
  const legs = [...document.querySelectorAll('.leg')];
  const lo = new IntersectionObserver((entries) => {
    entries.forEach((en) => { if (en.isIntersecting) legs.forEach((l) => l.classList.toggle('is-on', l === en.target)); });
  }, { rootMargin: '-45% 0px -45% 0px' });
  legs.forEach((l) => lo.observe(l));

  /* Armá tu salida: arma la hoja y el mensaje de WhatsApp */
  const form = document.getElementById('plan');
  const out = document.getElementById('plan-out');
  const send = document.getElementById('plan-send');
  const mes = form.querySelector('[name="mes"]');
  const meses = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
  const now = new Date();
  for (let i = 0; i < 12; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() + i, 1);
    const o = document.createElement('option');
    o.textContent = `${meses[d.getMonth()]} ${d.getFullYear()}`;
    mes.appendChild(o);
  }
  const update = () => {
    const f = new FormData(form);
    const n = Math.max(1, Math.min(30, Number(f.get('personas')) || 1));
    const destino = f.get('destino');
    const winter = /Pehuenia/.test(destino) && /junio|julio|agosto|septiembre/.test(f.get('mes'));
    const lines = [
      `Destino: ${destino}`,
      `Cuándo: ${f.get('mes')}`,
      `Somos: ${n} ${n === 1 ? 'persona' : 'personas'}`,
      `Vehículo: ${f.get('auto')}`,
    ];
    if (winter) lines.push('Temporada de nieve: hace falta ropa de abrigo en capas.');
    out.textContent = lines.join('\n');
    send.href = 'https://wa.me/5492923642283?text=' + encodeURIComponent('Hola Daniel! Armé mi salida en la web:\n' + lines.join('\n') + '\n¿Hay lugar?');
  };
  form.addEventListener('input', update);
  form.addEventListener('change', update);
  form.addEventListener('submit', (e) => e.preventDefault());
  update();

  /* Video: carga YouTube recién al tocar */
  document.querySelectorAll('.yt').forEach((b) => b.addEventListener('click', () => {
    const f = document.createElement('iframe');
    f.src = `https://www.youtube-nocookie.com/embed/${b.dataset.id}?autoplay=1&rel=0`;
    f.title = 'Travesía 4x4 en Grafiti, Chile';
    f.allow = 'autoplay; encrypted-media; picture-in-picture';
    f.allowFullscreen = true;
    b.replaceWith(f);
  }));

  /* Compartir */
  const share = document.getElementById('share');
  share.addEventListener('click', async () => {
    try {
      if (navigator.share) await navigator.share({ title: 'Patagonia Travesías', url: location.href });
      else { await navigator.clipboard.writeText(location.href); share.textContent = 'Link copiado'; }
    } catch (e) { /* cancelado */ }
  });
})();
