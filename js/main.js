
  // Image carousel (fade)
  (function () {
    const track = document.querySelector('.img-carousel .track');
    if (!track) return;
    const slides = Array.prototype.slice.call(track.children);
    let idx = 0;
    function go(i) {
      idx = (i + slides.length) % slides.length;
      slides.forEach(function (sl, k) { sl.classList.toggle('active', k === idx); });
      document.querySelectorAll('.img-carousel .dots button').forEach(function (b, k) {
        b.classList.toggle('active', k === idx);
      });
    }
    document.querySelectorAll('.img-carousel .nav.prev').forEach(function (b) { b.addEventListener('click', function () { go(idx - 1); }); });
    document.querySelectorAll('.img-carousel .nav.next').forEach(function (b) { b.addEventListener('click', function () { go(idx + 1); }); });
    document.querySelectorAll('.img-carousel .dots button').forEach(function (b, k) {
      b.addEventListener('click', function () { go(k); });
    });
    setInterval(function () { go(idx + 1); }, 4000);
    go(0);
  })();

  // Text carousel (fade)
  (function () {
    const track = document.querySelector('.carousel-track');
    if (!track) return;
    const slides = Array.prototype.slice.call(track.children);
    let idx = 0;
    function go(i) {
      idx = (i + slides.length) % slides.length;
      slides.forEach(function (sl, k) { sl.classList.toggle('active', k === idx); });
      document.querySelectorAll('.carousel-dots button').forEach(function (b, k) {
        b.classList.toggle('active', k === idx);
      });
    }
    document.querySelectorAll('.carousel-nav .prev').forEach(function (b) { b.addEventListener('click', function () { go(idx - 1); }); });
    document.querySelectorAll('.carousel-nav .next').forEach(function (b) { b.addEventListener('click', function () { go(idx + 1); }); });
    document.querySelectorAll('.carousel-dots button').forEach(function (b, k) {
      b.addEventListener('click', function () { go(k); });
    });
    setInterval(function () { go(idx + 1); }, 5000);
    go(0);
  })();

  // Open / Closed status (IST, Mon-Sat 9-21)
  function updateStatus() {
    const els = document.querySelectorAll('[data-status]');
    const now = new Date();
    const ist = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }));
    const day = ist.getDay();
    const hour = ist.getHours();
    const open = (day >= 1 && day <= 6) && (hour >= 9 && hour < 21);
  // Scroll reveal
  const revealEls = document.querySelectorAll('section, .card, .trust-item, .process-step');
  revealEls.forEach(function (el) { el.classList.add('reveal'); });
  const ro = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) { e.target.classList.add('in'); ro.unobserve(e.target); }
    });
  }, { threshold: 0.12 });
  revealEls.forEach(function (el) { ro.observe(el); });
    els.forEach(function (el) {
      el.className = 'status-badge ' + (open ? 'status-open' : 'status-closed');
      el.innerHTML = '<span class="status-dot"></span> ' + (open ? 'Open Now' : 'Closed');
    });
  }
  updateStatus();
  setInterval(updateStatus, 60000);
(function () {
  const nav = document.getElementById('nav');
  const menuBtn = document.getElementById('menuBtn');
  const navLinks = document.getElementById('navLinks');
  const themeToggle = document.getElementById('themeToggle');
  const root = document.documentElement;

  const saved = localStorage.getItem('theme');
  if (saved) root.setAttribute('data-theme', saved);

  themeToggle.addEventListener('click', function () {
    const cur = root.getAttribute('data-theme');
    let next;
    if (!cur) {
      const sysDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      next = sysDark ? 'light' : 'dark';
    } else {
      next = cur === 'dark' ? 'light' : 'dark';
    }
    root.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
  });

  menuBtn.addEventListener('click', function () { navLinks.classList.toggle('open'); });
  navLinks.querySelectorAll('a').forEach(function (a) {
    a.addEventListener('click', function () { navLinks.classList.remove('open'); });
  });
  window.addEventListener('scroll', function () {
    if (window.scrollY > 40) nav.classList.add('scrolled'); else nav.classList.remove('scrolled');
  });

  // Appointment booking -> WhatsApp only
  window.handleAppointment = function (ev) {
    ev.preventDefault();
    const f = ev.target;
    const name = f.querySelector('input[type="text"]').value.trim();
    const phone = f.querySelector('input[type="tel"]').value.trim();
    const centreEl = f.querySelector('input[name="centre"]:checked');
    const centre = centreEl ? centreEl.value : (f.querySelector('select[name="centre"]') ? f.querySelector('select[name="centre"]').value : '');
    const scanEl = f.querySelector('#appt-scan');
    const scan = scanEl ? scanEl.value : '';
    const msg = f.querySelector('textarea').value.trim();
    const lines = [
      'Hello RK Dentvue, I would like to book an appointment.',
      '',
      'Name: ' + name,
      'Phone: ' + phone,
      'Centre: ' + (centre || '-'),
      'Scan: ' + (scan || '-')
    ];
    if (msg) lines.push('Message: ' + msg);
    const text = lines.map(encodeURIComponent).join('%0A');
    window.open('https://wa.me/919620009222?text=' + text, '_blank');
    const m = document.getElementById('apptMsg');
    if (m) { m.style.display = 'block'; setTimeout(function () { m.style.display = 'none'; }, 4000); }
    f.reset();
  };

  // Enquiry -> Web3Forms (no mail client)
  window.handleEnquiry = async function (ev) {
    ev.preventDefault();
    const f = ev.target;
    const status = document.getElementById('enqMsg');
    const submitBtn = document.getElementById('enq-submit');
    const showStatus = (text, ok) => {
      if (!status) return;
      status.textContent = text;
      status.style.color = ok ? 'var(--success)' : 'var(--danger)';
      status.style.display = 'block';
      if (ok) setTimeout(function () { status.style.display = 'none'; }, 5000);
    };

    const honey = f.querySelector('input[name="_honey"]')?.value;
    const botcheck = f.querySelector('input[name="botcheck"]');
    if (honey || (botcheck && botcheck.checked)) return;

    const name = (f.querySelector('input[name="name"]')?.value || '').trim();
    const phone = (f.querySelector('input[name="phone"]')?.value || '').trim();
    const email = (f.querySelector('input[name="email"]')?.value || '').trim();
    const centre = (f.querySelector('select[name="centre"]')?.value || '').trim();
    const msg = (f.querySelector('textarea[name="message"]')?.value || '').trim();

    if (!name) { showStatus('Please enter your name.', false); f.querySelector('input[name="name"]')?.focus(); return; }
    if (!phone || phone.replace(/\D/g, '').length < 10) { showStatus('Please enter a valid phone number.', false); f.querySelector('input[name="phone"]')?.focus(); return; }
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { showStatus('Please enter a valid email address.', false); f.querySelector('input[name="email"]')?.focus(); return; }

    const originalBtnText = submitBtn ? submitBtn.textContent : 'Send enquiry';
    if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = 'Sending enquiry...'; }

    const accessKey = (f.querySelector('input[name="access_key"]')?.value || '').trim();
    const hasValidKey = accessKey && accessKey !== 'YOUR_ACCESS_KEY_HERE' && accessKey.length > 10;

    try {
      if (hasValidKey) {
        const lines = [
          'New enquiry received from RK Dentvue website',
          '',
          'Name: ' + name,
          'Phone: ' + phone
        ];
        if (email) lines.push('Email: ' + email);
        lines.push('Preferred centre: ' + (centre || '-'));
        lines.push('');
        lines.push('Message:');
        lines.push(msg || 'No additional note');
        const message = lines.join('\n');

        const payload = {
          access_key: accessKey,
          from_name: 'RK Dentvue Website',
          subject: 'New Enquiry - RK Dentvue',
          message: message
        };
        if (email) payload.replyto = email;

        const res = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body: JSON.stringify(payload)
        });
        let data = null;
        try { data = await res.json(); } catch (e) { data = null; }
        if (res.ok && data && data.success === true) {
          showStatus('Thank you! Your enquiry has been sent. Our team will contact you shortly.', true);
          f.reset();
        } else {
          showStatus('Could not send your enquiry right now. Please call +91 96200 09222 or email rkdentvue@gmail.com.', false);
        }
      } else {
        showStatus('Enquiry form is not configured yet (missing Web3Forms access key). Please call +91 96200 09222 or email rkdentvue@gmail.com.', false);
      }
    } catch (err) {
      console.error(err);
      showStatus('Could not send your enquiry right now. Please call +91 96200 09222 or email rkdentvue@gmail.com.', false);
    } finally {
      if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = originalBtnText; }
    }
  };
})();
