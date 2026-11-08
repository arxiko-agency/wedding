/* ==========================================================================
   SHREYA & RAHUL – site logic. Everything content-related comes from config.js
   ========================================================================== */
(function () {
  'use strict';
  var C = window.WEDDING;
  var $ = function (id) { return document.getElementById(id); };
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]; }); };
  var setText = function (id, t) { var e = $(id); if (e) e.textContent = t; };
  var setImg = function (id, src, alt) { var e = $(id); if (e) { e.src = src; if (alt != null) e.alt = alt; } };

  var BR = C.bride, GR = C.groom;
  var NAMES = BR + ' & ' + GR;
  var PLACE = C.country.toUpperCase() + ' ' + C.flag;

  /* ---------- time helpers (wedding time is Europe/Berlin wall-clock) ---------- */
  function tzOffsetMs(utcMs, tz) {
    var d = new Date(utcMs);
    var p = new Intl.DateTimeFormat('en-US', { timeZone: tz, hourCycle: 'h23', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' }).formatToParts(d);
    var o = {}; p.forEach(function (x) { o[x.type] = +x.value; });
    return Date.UTC(o.year, o.month - 1, o.day, o.hour, o.minute, o.second) - Math.floor(utcMs / 1000) * 1000;
  }
  function wallToUtc(iso, tz) {
    var m = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})(?::(\d{2}))?/.exec(iso || '');
    if (!m) return NaN;
    var guess = Date.UTC(+m[1], +m[2] - 1, +m[3], +m[4], +m[5], +(m[6] || 0));
    var off = tzOffsetMs(guess, tz);
    var utc = guess - off;
    off = tzOffsetMs(utc, tz);
    return guess - off;
  }
  var WEDDING_MS = wallToUtc(C.weddingDateISO, C.timeZone);
  var fmt = function (opts) { return new Intl.DateTimeFormat('en-GB', Object.assign({ timeZone: C.timeZone }, opts)).format(new Date(WEDDING_MS)); };

  /* ---------- URLs ---------- */
  var pageUrl = function () { return C.siteUrl || (location.href.split('#')[0]); };
  var venueQuery = [C.venue.name, C.venue.address].filter(Boolean).join(', ');
  var mapsOpen = C.venue.mapsUrl || ('https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(venueQuery));
  var mapsDir = 'https://www.google.com/maps/dir/?api=1&destination=' + encodeURIComponent(venueQuery);
  var waDigits = (C.whatsappNumber || '').replace(/\D/g, '');

  /* ---------- toast ---------- */
  var toastT;
  function toast(msg) {
    var t = $('toast'); t.textContent = msg; t.classList.add('show');
    clearTimeout(toastT); toastT = setTimeout(function () { t.classList.remove('show'); }, 2600);
  }

  /* ==================== FILL CONTENT ==================== */
  document.title = NAMES + ' – ' + C.tagline;
  setText('gBride', BR); setText('gGroom', GR); setText('hBride', BR); setText('hGroom', GR);
  setText('gInvite', C.inviteLine); setText('hInvite', C.inviteLine);
  setText('gPlace', PLACE); setText('hPlace', PLACE);
  setText('envNames', NAMES); setText('finNames', NAMES); setText('fNames', NAMES); setText('fPlace', C.country);
  setText('fYear', isNaN(WEDDING_MS) ? '' : fmt({ year: 'numeric' }));

  // photos – gate shows the FIRST photos you supplied, in order
  setImg('gatePhotoL', C.photos.groomPortrait, '');
  setImg('gatePhotoR', C.photos.bridePortrait, '');
  setImg('heroImg', C.photos.cover);
  setImg('groomPhoto', C.photos.groomPortrait, GR);
  setImg('bridePhoto', C.photos.bridePortrait, BR);
  setImg('fin1', C.photos.final[0], ''); setImg('fin2', C.photos.final[1], '');
  var sc = $('gate'); // placeholder fallback for missing images
  document.querySelectorAll('img').forEach(function (im) {
    im.addEventListener('error', function () {
      im.removeAttribute('src'); im.style.background = 'linear-gradient(135deg,#0a4d43,#04302a)'; im.style.minHeight = '120px';
    }, { once: true });
  });

  // couple
  setText('cBride', BR); setText('cGroom', GR);
  setText('cBrideRole', C.people.bride.label); setText('cBrideText', C.people.bride.text);
  setText('cGroomRole', C.people.groom.label); setText('cGroomText', C.people.groom.text);

  // story
  $('storyList').innerHTML = C.story.map(function (s, i) {
    return '<div class="tl-item reveal"><div class="ph"><img src="' + esc(s.photo) + '" alt="' + esc(s.title) + '" loading="lazy"></div>' +
      '<div class="tx"><span class="num">0' + (i + 1) + '</span><h3>' + esc(s.title) + '</h3><p>' + esc(s.text) + '</p></div></div>';
  }).join('');

  // date
  if (!isNaN(WEDDING_MS)) {
    var full = fmt({ day: 'numeric', month: 'long', year: 'numeric' });
    setText('hDate', full.toUpperCase());
    setText('dDay', fmt({ weekday: 'long' }));
    setText('dNum', fmt({ day: 'numeric' }));
    setText('dTime', 'at ' + fmt({ hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }));
    setText('dMonth', fmt({ month: 'long' }));
    setText('dYear', fmt({ year: 'numeric' }));
  }

  // venue
  setImg('venueImg', C.venue.photo, C.venue.name);
  setText('venueBadge', C.country); setText('vCountry', C.country + ' ' + C.flag);
  setText('vName', C.venue.name); setText('vAddress', C.venue.address); setText('vCity', C.venue.city + ', ' + C.country);
  setText('vNote', C.venue.note || '');
  $('mapBtn').href = mapsOpen; $('dirBtn').href = mapsDir; $('shMap').href = mapsOpen;

  // schedule
  $('scheduleList').innerHTML = C.schedule.map(function (e) {
    return '<li class="reveal"><time>' + esc(e.time) + '</time><div><h3>' + esc(e.title) + '</h3><p>' + esc(e.text) + '</p></div></li>';
  }).join('');

  // dress code
  setText('dcMen', C.dressCode.men); setText('dcWomen', C.dressCode.women); setText('dcNote', C.dressCode.note || '');
  $('palette').innerHTML = C.dressCode.palette.map(function (c) { return '<i style="background:' + esc(c) + '"></i>'; }).join('');

  // accommodation
  var A = C.accommodation;
  setText('hName', A.name); setText('hAddress', A.address); setText('hNote', A.note || '');
  var contact = [A.phone, A.email].filter(Boolean);
  setText('hContact', contact.join('  ·  '));
  if (A.bookingUrl) { $('hBook').hidden = false; $('hBook').href = A.bookingUrl; }
  $('hMap').href = A.mapsUrl || ('https://www.google.com/maps/dir/?api=1&destination=' + encodeURIComponent(A.name + ', ' + A.address));

  // registry
  setText('regMsg', C.registry.message);
  if (C.registry.url) $('regBtn').href = C.registry.url; else $('regBtn').hidden = true;

  // rsvp
  setText('rsvpDeadline', C.rsvp.deadlineText || '');
  var sel = $('guestSel'), opts = '<option value="" disabled selected>Select</option>';
  for (var g = 1; g <= (C.rsvp.maxGuests || 6); g++) opts += '<option value="' + g + '">' + g + (g === 1 ? ' guest' : ' guests') + '</option>';
  sel.innerHTML = opts;

  /* ==================== LOADER ==================== */
  var loaderDone = false;
  function endLoader() {
    if (loaderDone) return; loaderDone = true;
    $('loader').classList.add('done');
    document.body.classList.add('ready');
  }
  var minWait = new Promise(function (r) { setTimeout(r, reduced ? 300 : 2300); });
  var loaded = new Promise(function (r) { if (document.readyState === 'complete') r(); else window.addEventListener('load', r); });
  Promise.all([minWait, loaded]).then(endLoader);
  setTimeout(endLoader, 6000); // never hang

  /* ==================== MUSIC ==================== */
  var audio = $('bgm'), player = $('player');
  audio.src = C.music.src; audio.volume = C.music.volume != null ? C.music.volume : 0.7; audio.loop = true;
  function syncPlayer() { player.classList.toggle('playing', !audio.paused); player.classList.toggle('muted', audio.muted); }
  audio.addEventListener('play', syncPlayer); audio.addEventListener('pause', syncPlayer);
  $('pPlay').addEventListener('click', function () {
    if (audio.paused) audio.play().catch(function () { toast('Tap again to play music'); }); else audio.pause();
  });
  $('pMute').addEventListener('click', function () { audio.muted = !audio.muted; syncPlayer(); });
  $('pBack').addEventListener('click', function () { audio.currentTime = Math.max(0, audio.currentTime - 15); });
  $('pFwd').addEventListener('click', function () {
    var d = audio.duration || 150; var t = audio.currentTime + 15; audio.currentTime = t >= d ? 0 : t;
  });
  // The track file is 2:30 long and loops from the very start automatically.
  // Safety net in case a browser ignores the loop flag:
  audio.addEventListener('ended', function () { audio.currentTime = 0; audio.play().catch(function () {}); });

  /* ==================== OPEN INVITATION ==================== */
  var opened = false;
  $('openBtn').addEventListener('click', function () {
    if (opened) return; opened = true;
    var gate = $('gate');
    gate.classList.add('opening');
    audio.play().catch(function () {});            // user gesture → music allowed
    setTimeout(function () {
      document.body.classList.remove('locked');
      document.body.classList.add('opened');
      window.scrollTo(0, 0);
      gate.classList.add('gone');
      petals.burst(innerWidth<600?35:60);
      setTimeout(function () { gate.style.display = 'none'; }, 1600);
      observe();
    }, reduced ? 400 : 4200);
  });

  /* ==================== NAV / SCROLL ==================== */
  var nav = $('nav'), toTop = $('toTop');
  function onScroll() {
    var y = window.scrollY;
    nav.classList.toggle('scrolled', y > 60);
    toTop.classList.toggle('show', y > 700);
  }
  window.addEventListener('scroll', onScroll, { passive: true }); onScroll();
  $('burger').addEventListener('click', function () {
    var on = nav.classList.toggle('menu'); this.setAttribute('aria-expanded', on);
  });
  document.querySelectorAll('#navLinks a').forEach(function (a) { a.addEventListener('click', function () { nav.classList.remove('menu'); }); });
  toTop.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: 'smooth' }); });

  /* ==================== REVEAL ON SCROLL ==================== */
  var io;
  function observe() {
    if (!('IntersectionObserver' in window)) { document.querySelectorAll('.reveal').forEach(function (e) { e.classList.add('in'); }); return; }
    io = io || new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    document.querySelectorAll('.reveal:not(.in)').forEach(function (e) { io.observe(e); });
  }

  /* ==================== COUNTDOWN ==================== */
  var cdTimer;
  function tick() {
    var diff = WEDDING_MS - Date.now();
    if (isNaN(WEDDING_MS)) return;
    if (diff <= 0) {
      $('cd').hidden = true; $('cdDone').hidden = false; clearInterval(cdTimer); return;
    }
    var s = Math.floor(diff / 1000);
    var d = Math.floor(s / 86400), h = Math.floor(s % 86400 / 3600), m = Math.floor(s % 3600 / 60), sec = s % 60;
    var p = function (n) { return n < 10 ? '0' + n : '' + n; };
    $('cdD').textContent = d < 100 ? p(d) : d; $('cdH').textContent = p(h); $('cdM').textContent = p(m); $('cdS').textContent = p(sec);
  }
  tick(); cdTimer = setInterval(tick, 1000);

  /* ==================== CALENDAR (.ics) ==================== */
  function icsDate(ms) { return new Date(ms).toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, ''); }
  function addToCalendar() {
    if (isNaN(WEDDING_MS)) return toast('Wedding date not set');
    var end = WEDDING_MS + (C.durationHours || 6) * 3600 * 1000;
    var lines = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Wedding Invitation//EN', 'CALSCALE:GREGORIAN', 'BEGIN:VEVENT',
      'UID:' + WEDDING_MS + '@wedding-invitation', 'DTSTAMP:' + icsDate(Date.now()), 'DTSTART:' + icsDate(WEDDING_MS), 'DTEND:' + icsDate(end),
      'SUMMARY:' + NAMES + ' – Wedding', 'LOCATION:' + venueQuery.replace(/,/g, '\\,'),
      'DESCRIPTION:' + 'Wedding celebration of ' + NAMES + '. ' + pageUrl(), 'END:VEVENT', 'END:VCALENDAR'];
    var blob = new Blob([lines.join('\r\n')], { type: 'text/calendar;charset=utf-8' });
    var a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'shreya-rahul-wedding.ics';
    document.body.appendChild(a); a.click(); a.remove(); setTimeout(function () { URL.revokeObjectURL(a.href); }, 2000);
    toast('Calendar file ready');
  }
  $('calBtn').addEventListener('click', addToCalendar); $('shCal').addEventListener('click', addToCalendar);

  /* ==================== SHARE ==================== */
  $('shWA').addEventListener('click', function () {
    var t = NAMES + ' – you are invited to our wedding celebration! 💍\n' + pageUrl();
    window.open('https://wa.me/?text=' + encodeURIComponent(t), '_blank', 'noopener');
  });
  $('shCopy').addEventListener('click', function () {
    var url = pageUrl();
    function fallback() {
      var ta = document.createElement('textarea'); ta.value = url; ta.style.position = 'fixed'; ta.style.opacity = 0; document.body.appendChild(ta);
      ta.select(); var ok = false; try { ok = document.execCommand('copy'); } catch (e) {} ta.remove(); toast(ok ? 'Link copied' : 'Copy failed – ' + url);
    }
    if (navigator.clipboard && window.isSecureContext) navigator.clipboard.writeText(url).then(function () { toast('Link copied'); }, fallback); else fallback();
  });

  /* ==================== RSVP ==================== */
  var form = $('rsvpForm'), msg = $('rsvpMsg'), waBtn = $('rsvpWA');
  function formData() {
    var f = new FormData(form), o = {};
    f.forEach(function (v, k) { o[k] = String(v).trim(); });
    return o;
  }
  function waText(o) {
    return 'RSVP – ' + NAMES + ' wedding\nName: ' + (o.name || '') + '\nAttending: ' + (o.attending || '') + '\nGuests: ' + (o.guests || '') +
      (o.phone ? '\nPhone: ' + o.phone : '') + (o.email ? '\nEmail: ' + o.email : '') + (o.message ? '\nMessage: ' + o.message : '');
  }
  if (waDigits) {
    waBtn.hidden = false;
    var upd = function () { waBtn.href = 'https://wa.me/' + waDigits + '?text=' + encodeURIComponent(waText(formData())); };
    form.addEventListener('input', upd); form.addEventListener('change', upd); upd();
  }
  function setMsg(t, cls) { msg.textContent = t; msg.className = 'form-msg ' + (cls || ''); }

  form.addEventListener('submit', function (ev) {
    ev.preventDefault();
    var o = formData(), bad = [];
    form.querySelectorAll('.invalid').forEach(function (e) { e.classList.remove('invalid'); });
    if (!o.name) bad.push('name');
    if (!/^\S+@\S+\.\S+$/.test(o.email || '')) bad.push('email');
    if (!o.guests) bad.push('guests');
    form.querySelectorAll('[name="' + bad.join('"],[name="') + '"]').forEach(function (e) { if (bad.length) e.classList.add('invalid'); });
    if (!o.attending) bad.push('attending');
    if (bad.length) { setMsg('Please complete the highlighted fields (name, email, guests and attendance).', 'err'); return; }
    if (o._gotcha) return;                          // bot trap
    delete o._gotcha;

    if (!C.rsvp.endpoint) {
      setMsg('Online RSVP is not switched on yet, so your reply has NOT been saved.' + (waDigits ? ' Please use the WhatsApp button below to send it.' : ' Please contact the couple directly.'), 'err');
      return;
    }
    var btn = $('rsvpSubmit'); btn.disabled = true; btn.textContent = 'Sending…'; setMsg('');
    o.submittedAt = new Date().toISOString(); o.wedding = NAMES;
    var isGAS = /script\.google(usercontent)?\.com/.test(C.rsvp.endpoint);
    fetch(C.rsvp.endpoint, {
      method: 'POST',
      headers: { 'Content-Type': isGAS ? 'text/plain;charset=utf-8' : 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify(o)
    }).then(function (r) {
      if (!r.ok) throw new Error('HTTP ' + r.status);
      return r.text().then(function (t) { try { var j = JSON.parse(t); if (j && (j.ok === false || j.result === 'error' || j.error)) throw new Error('rejected'); } catch (e) { if (e.message === 'rejected') throw e; } });
    }).then(function () {
      form.reset(); setMsg('Thank you, ' + o.name + '! Your RSVP has been received. ' + (o.attending === 'Attending' ? 'We can’t wait to celebrate with you. 💚' : 'You will be missed.'), 'ok');
      toast('RSVP received');
    }).catch(function () {
      setMsg('Sorry, your RSVP could not be sent. Please try again' + (waDigits ? ' or use the WhatsApp button.' : '.'), 'err');
    }).finally(function () { btn.disabled = false; btn.textContent = 'Submit RSVP'; });
  });

  /* ==================== GALLERY + LIGHTBOX ==================== */
  var G = C.photos.gallery, mas = $('masonry'), li = 0;
  mas.innerHTML = G.map(function (src, i) {
    return '<div class="m-item reveal" tabindex="0" role="button" aria-label="Open photo ' + (i + 1) + '" data-i="' + i + '" style="transition-delay:' + ((i % 4) * 90) + 'ms"><img src="' + esc(src) + '" alt="Wedding photo ' + (i + 1) + '" loading="lazy"></div>';
  }).join('');
  var lb = $('lightbox'), lbImg = $('lbImg');
  function show(i) {
    li = (i + G.length) % G.length; lbImg.style.animation = 'none'; void lbImg.offsetWidth; lbImg.style.animation = '';
    lbImg.src = G[li]; lbImg.alt = 'Wedding photo ' + (li + 1); $('lbCount').textContent = (li + 1) + ' / ' + G.length;
  }
  function openLb(i) { show(i); lb.hidden = false; document.body.style.overflow = 'hidden'; }
  function closeLb() { lb.hidden = true; document.body.style.overflow = ''; }
  mas.addEventListener('click', function (e) { var it = e.target.closest('.m-item'); if (it) openLb(+it.dataset.i); });
  mas.addEventListener('keydown', function (e) { if ((e.key === 'Enter' || e.key === ' ') && e.target.dataset.i) { e.preventDefault(); openLb(+e.target.dataset.i); } });
  lb.querySelector('.lb-close').addEventListener('click', closeLb);
  lb.querySelector('.lb-prev').addEventListener('click', function () { show(li - 1); });
  lb.querySelector('.lb-next').addEventListener('click', function () { show(li + 1); });
  lb.addEventListener('click', function (e) { if (e.target === lb) closeLb(); });
  document.addEventListener('keydown', function (e) {
    if (lb.hidden) return;
    if (e.key === 'Escape') closeLb(); else if (e.key === 'ArrowLeft') show(li - 1); else if (e.key === 'ArrowRight') show(li + 1);
  });
  var tx = 0, ty = 0;
  lb.addEventListener('touchstart', function (e) { tx = e.changedTouches[0].clientX; ty = e.changedTouches[0].clientY; }, { passive: true });
  lb.addEventListener('touchend', function (e) {
    var dx = e.changedTouches[0].clientX - tx, dy = e.changedTouches[0].clientY - ty;
    if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy)) show(li + (dx < 0 ? 1 : -1));
  }, { passive: true });

  /* ==================== PARTICLES (floating gold dust) ==================== */
  var pc = $('particles'), px = pc.getContext('2d'), dots = [], PW, PH, dpr = Math.min(window.devicePixelRatio || 1, 2);
  function sizeCanvas(c) { c.width = innerWidth * dpr; c.height = innerHeight * dpr; }
  function initParticles() {
    sizeCanvas(pc); PW = pc.width; PH = pc.height;
    var n = innerWidth < 600 ? 28 : 55; dots = [];
    for (var i = 0; i < n; i++) dots.push({ x: Math.random() * PW, y: Math.random() * PH, r: (Math.random() * 1.8 + .6) * dpr, vy: -(Math.random() * .25 + .08) * dpr, vx: (Math.random() - .5) * .12 * dpr, a: Math.random() * Math.PI * 2 });
  }
  function drawParticles(t) {
    px.clearRect(0, 0, PW, PH);
    dots.forEach(function (d) {
      d.x += d.vx + Math.sin(t / 2000 + d.a) * .15 * dpr; d.y += d.vy;
      if (d.y < -10) { d.y = PH + 10; d.x = Math.random() * PW; }
      var al = .35 + .35 * Math.sin(t / 700 + d.a);
      var g = px.createRadialGradient(d.x, d.y, 0, d.x, d.y, d.r * 4);
      g.addColorStop(0, 'rgba(255,230,160,' + al + ')'); g.addColorStop(1, 'rgba(255,230,160,0)');
      px.fillStyle = g; px.beginPath(); px.arc(d.x, d.y, d.r * 4, 0, 6.283); px.fill();
    });
  }

  /* ==================== GOLDEN PETALS ==================== */
  var petals = (function () {
    var c = $('petals'), x = c.getContext('2d'), list = [], W, H;
    function size() { sizeCanvas(c); W = c.width; H = c.height; }
    function make(fromTop) {
      return { x: Math.random() * W, y: fromTop ? -20 * dpr : Math.random() * H * .6, s: (Math.random() * 7 + 7) * dpr, vy: (Math.random() * .9 + .5) * dpr,
        vx: (Math.random() - .5) * .8 * dpr, rot: Math.random() * 6.28, vr: (Math.random() - .5) * .04, sw: Math.random() * 6.28, hue: Math.random() < .7 ? 0 : 1, life: 1 };
    }
    function burst(n) { if (reduced) return; for (var i = 0; i < n; i++) { var p = make(true); p.y = -Math.random() * H * .5; list.push(p); } }
    function draw() {
      x.clearRect(0, 0, W, H);
      for (var i = list.length - 1; i >= 0; i--) {
        var p = list[i]; p.sw += .02; p.x += p.vx + Math.sin(p.sw) * .7 * dpr; p.y += p.vy; p.rot += p.vr;
        if (p.y > H + 30) { if (p.recycle) { p.y = -20 * dpr; p.x = Math.random() * W; } else { list.splice(i, 1); continue; } }
        x.save(); x.translate(p.x, p.y); x.rotate(p.rot); x.scale(1, .55 + .45 * Math.abs(Math.sin(p.sw * .8)));
        var g = x.createLinearGradient(-p.s, 0, p.s, 0);
        if (p.hue) { g.addColorStop(0, '#f6ead0'); g.addColorStop(1, '#e2c985'); } else { g.addColorStop(0, '#b78a35'); g.addColorStop(.5, '#f3dd9a'); g.addColorStop(1, '#c9a24b'); }
        x.fillStyle = g; x.globalAlpha = .88; x.beginPath();
        x.moveTo(0, -p.s); x.bezierCurveTo(p.s, -p.s * .6, p.s * .8, p.s * .7, 0, p.s); x.bezierCurveTo(-p.s * .8, p.s * .7, -p.s, -p.s * .6, 0, -p.s); x.fill();
        x.restore();
      }
    }
    // a few petals keep drifting gently once the site is open
    function ambient() { if (!reduced && document.body.classList.contains('opened') && list.length < 8) { var p = make(true); p.recycle = false; list.push(p); } }
    setInterval(ambient, 2600);
    return { size: size, burst: burst, draw: draw };
  })();

  function initCanvases() { initParticles(); petals.size(); }
  initCanvases();
  var rt; window.addEventListener('resize', function () { clearTimeout(rt); rt = setTimeout(initCanvases, 200); });
  if (!reduced) {
    (function loop(t) { if (!document.hidden) { drawParticles(t); petals.draw(); } requestAnimationFrame(loop); })(0);
  }
})();
