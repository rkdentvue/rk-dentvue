
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

  const BENGALURU_OPENING_DATE = '2026-11-22';

  // Open / Closed status (IST, Mon-Sat 9-21)
  function updateStatus() {
    const els = document.querySelectorAll('[data-status]');
    const now = new Date();
    const ist = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }));
    const day = ist.getDay();
    const hour = ist.getHours();
    const open = (day >= 1 && day <= 6) && (hour >= 9 && hour < 21);
    const istDate = [ist.getFullYear(), String(ist.getMonth() + 1).padStart(2, '0'), String(ist.getDate()).padStart(2, '0')].join('-');
    const bengaluruOpeningLabel = document.querySelector('[data-bengaluru-opening]');
    if (bengaluruOpeningLabel) {
      bengaluruOpeningLabel.textContent = istDate < BENGALURU_OPENING_DATE
        ? 'Kothanur · Opens 22 Nov'
        : 'Kothanur · Full suite';
    }
    els.forEach(function (el) {
      const openingSoon = el.dataset.status === 'bengaluru' && istDate < BENGALURU_OPENING_DATE;
      const status = openingSoon ? 'opening' : (open ? 'open' : 'closed');
      const label = openingSoon ? 'Opening soon · 22 Nov' : (open ? 'Open Now' : 'Closed');
      el.className = 'status-badge status-' + status;
      el.innerHTML = '<span class="status-dot"></span> ' + label;
    });
  }
  updateStatus();
  setInterval(updateStatus, 60000);
(function () {
  const nav = document.getElementById('nav');
  const menuBtn = document.getElementById('menuBtn');
  const navLinks = document.getElementById('navLinks');

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
    const name = f.querySelector('#appt-name').value.trim();
    const phone = f.querySelector('#appt-phone').value.trim();
    const centreEl = f.querySelector('input[name="centre"]:checked');
    const centre = centreEl ? centreEl.value : '';
    const scan2d = f.querySelector('#appt-2d').value;
    const scan3d = f.querySelector('#appt-3d').value;
    const date = f.querySelector('#appt-date').value;
    const time = f.querySelector('#appt-time').value;
    const doctor = f.querySelector('#appt-doctor').value.trim();
    const notes = f.querySelector('#appt-msg').value.trim();
    const status = document.getElementById('apptMsg');
    const phoneDigits = phone.replace(/\D/g, '');
    const scans = [scan2d, scan3d].filter(Boolean);

    let error = '';
    if (phoneDigits.length < 10) error = 'Please enter a valid 10-digit mobile number.';
    else if (!scans.length) error = 'Please choose a 2D scan, a 3D scan, or Other.';
    else if (centre === 'Bengaluru (Kothanur)' && date && date < BENGALURU_OPENING_DATE) {
      error = 'The Bengaluru (Kothanur) centre opens on 22 November 2026. Please choose that date or a later date.';
    }
    else if (centre === 'Bengaluru (Kothanur)' && date && new Date(date + 'T00:00:00').getDay() === 0) {
      error = 'Our Kothanur centre is closed on Sundays. Please choose another date, or select Hindupur or Dharmavaram.';
    }

    if (error) {
      status.textContent = error;
      status.style.color = 'var(--danger)';
      status.style.display = 'block';
      return;
    }

    const lines = [
      'Hello RK Dentvue, I would like to book an appointment.',
      '',
      'Name: ' + name,
      'Phone: ' + phone,
      'Centre: ' + centre,
      'Scans: ' + scans.join('; ')
    ];
    if (date) {
      const selectedDate = new Date(date + 'T00:00:00');
      lines.push('Preferred date: ' + selectedDate.toLocaleDateString('en-IN', {
        weekday: 'short', day: 'numeric', month: 'short', year: 'numeric'
      }));
    }
    if (time) lines.push('Preferred time: ' + time);
    if (doctor) lines.push('Referring doctor: ' + doctor);
    if (notes) lines.push('Notes: ' + notes);

    window.open('https://wa.me/916362766366?text=' + encodeURIComponent(lines.join('\n')), '_blank');
    f.reset();
    if (window.updateAppointmentOptions) window.updateAppointmentOptions();
    status.textContent = "Thanks! WhatsApp opens in a new tab. Press send there to share your request with us.";
    status.style.color = 'var(--success)';
    status.style.display = 'block';
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
          showStatus('Could not send your enquiry right now. Please call +91 63627 66366 or email rkdentvue@gmail.com.', false);
        }
      } else {
        showStatus('Enquiry form is not configured yet (missing Web3Forms access key). Please call +91 63627 66366 or email rkdentvue@gmail.com.', false);
      }
    } catch (err) {
      console.error(err);
      showStatus('Could not send your enquiry right now. Please call +91 63627 66366 or email rkdentvue@gmail.com.', false);
    } finally {
      if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = originalBtnText; }
    }
  };

  // On refresh, go to home page
  (function () {
    try {
      var nav = performance.getEntriesByType && performance.getEntriesByType('navigation')[0];
      var isReload = nav ? nav.type === 'reload' : (performance.navigation && performance.navigation.type === 1);
      if (isReload && !/index\.html$/.test(window.location.pathname) && window.location.pathname !== '/') {
        window.location.replace('index.html');
      }
    } catch (e) {}
  })();


  // Feedback trigger (works on all pages)
  (function () {
    document.querySelectorAll('.feedback-trigger').forEach(function (b) {
      b.addEventListener('click', function (e) {
        var modal = document.getElementById('feedback');
        if (modal) {
          e.preventDefault();
          modal.classList.add('open');
          document.body.style.overflow = 'hidden';
          try { history.replaceState(null, '', window.location.pathname); } catch (err) {}
        } else {
          try { sessionStorage.setItem('openFeedback', '1'); } catch (err) {}
          window.location.href = 'index.html';
        }
      });
    });
  })();


  // Feedback modal open/close
  (function () {
    const modal = document.getElementById('feedback');
    if (!modal) return;
    const open = function () { modal.classList.add('open'); document.body.style.overflow = 'hidden'; };
    const close = function () { modal.classList.remove('open'); document.body.style.overflow = ''; try { history.replaceState(null, '', window.location.pathname); } catch (err) {} };
    document.querySelectorAll('.feedback-trigger').forEach(function (b) {
      b.addEventListener('click', function (e) {
        if (window.location.pathname.endsWith('index.html') || window.location.pathname === '/' || window.location.pathname.endsWith('/')) {
          e.preventDefault();
          open();
        } else {
          window.location.href = 'index.html#feedback';
        }
      });
    });
    const closeBtn = document.getElementById('feedbackClose');
    if (closeBtn) closeBtn.addEventListener('click', close);
    modal.addEventListener('click', function (e) { if (e.target === modal) close(); });
    var shouldOpen = false;
    try { shouldOpen = sessionStorage.getItem('openFeedback') === '1'; } catch (err) {}
    if (shouldOpen) {
      try { sessionStorage.removeItem('openFeedback'); } catch (err) {}
      setTimeout(open, 50);
    }
  })();

})();

  // Feedback: star rating interaction
  (function () {
    const wrap = document.getElementById('starRating');
    if (!wrap) return;
    const hidden = document.getElementById('fb-rating');
    const stars = Array.prototype.slice.call(wrap.querySelectorAll('.star'));
    function paint(val) {
      stars.forEach(function (s) {
        const v = parseInt(s.getAttribute('data-value'), 10);
        s.classList.toggle('active', v <= val);
      });
    }
    stars.forEach(function (s) {
      s.addEventListener('click', function () {
        const v = parseInt(s.getAttribute('data-value'), 10);
        if (hidden) hidden.value = v;
        paint(v);
      });
      s.addEventListener('mouseenter', function () {
        paint(parseInt(s.getAttribute('data-value'), 10));
      });
    });
    wrap.addEventListener('mouseleave', function () {
      paint(parseInt((hidden && hidden.value) || '0', 10));
    });
    paint(0);
  })();

  // Feedback -> Web3Forms (no WhatsApp)
  window.handleFeedback = async function (ev) {
    ev.preventDefault();
    const f = ev.target;
    const status = document.getElementById('fbMsg');
    const submitBtn = document.getElementById('fb-submit');
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

    const rating = (document.getElementById('fb-rating') && document.getElementById('fb-rating').value) || '0';
    const q1 = (f.querySelector('input[name="q1"]:checked')?.value) || '-';
    const q2 = (f.querySelector('input[name="q2"]:checked')?.value) || '-';
    const q3 = (f.querySelector('input[name="q3"]:checked')?.value) || '-';
    const q4 = (f.querySelector('input[name="q4"]:checked')?.value) || '-';
    const msg = (document.getElementById('fb-msg') && document.getElementById('fb-msg').value || '').trim();
    const name = (document.getElementById('fb-name') && document.getElementById('fb-name').value || '').trim();

    if (rating === '0') { showStatus('Please select a star rating.', false); return; }

    const originalBtnText = submitBtn ? submitBtn.textContent : 'Submit feedback';
    if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = 'Sending feedback...'; }

    const accessKey = (f.querySelector('input[name="access_key"]')?.value || '').trim();
    const hasValidKey = accessKey && accessKey !== 'YOUR_ACCESS_KEY_HERE' && accessKey.length > 10;

    try {
      if (hasValidKey) {
        const lines = [
          'New feedback received from RK Dentvue website',
          '',
        ];
        if (name) lines.push('Name: ' + name);
        lines.push('Rating: ' + rating + ' / 5');
        lines.push('Staff friendly: ' + q1);
        lines.push('Clean & comfortable: ' + q2);
        lines.push('Scan quick & smooth: ' + q3);
        lines.push('Would recommend: ' + q4);
        lines.push('');
        lines.push('Message:');
        lines.push(msg || 'No additional note');
        const message = lines.join('\n');

        const payload = {
          access_key: accessKey,
          from_name: 'RK Dentvue Website',
          subject: 'New Feedback - RK Dentvue',
          message: message
        };

        const res = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body: JSON.stringify(payload)
        });
        let data = null;
        try { data = await res.json(); } catch (e) { data = null; }
        if (res.ok && data && data.success === true) {
          showStatus('Thank you! Your feedback has been submitted.', true);
          f.reset();
          const hidden = document.getElementById('fb-rating');
          if (hidden) hidden.value = '0';
          const wrap = document.getElementById('starRating');
          if (wrap) Array.prototype.slice.call(wrap.querySelectorAll('.star')).forEach(function (s) { s.classList.remove('active'); });
        } else {
          showStatus('Could not send feedback right now. Please try again.', false);
        }
      } else {
        showStatus('Feedback form is not configured yet.', false);
      }
    } catch (err) {
      console.error(err);
      showStatus('Could not send feedback right now. Please try again.', false);
    } finally {
      if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = originalBtnText; }
    }
  };


  // Appointment: scan and time options depend on the selected centre.
  (function () {
    const form = document.getElementById('apptForm');
    if (!form) return;

    const scans2d = [
      ['Digital OPG (panoramic)', 'hdb'],
      ['TMJ, 2 views', 'hdb'],
      ['TMJ, 4 views', 'hdb'],
      ['PNS / sinus view', 'hdb'],
      ['Lateral cephalogram', 'b'],
      ['PA cephalogram', 'b'],
      ['Reverse Towne’s view', 'b'],
      ['Submento vertex', 'b'],
      ['Hand wrist (bone age)', 'b'],
      ['Other', 'hdb']
    ];
    const scans3d = [
      ['CBCT, single tooth', 'hb'],
      ['CBCT, single segment (2–3 teeth)', 'hb'],
      ['CBCT, single quadrant', 'hb'],
      ['CBCT, full maxilla', 'hb'],
      ['CBCT, full mandible', 'hb'],
      ['CBCT, full mouth / both jaws', 'hb'],
      ['CBCT, TMJ closed', 'hb'],
      ['CBCT, TMJ open', 'hb']
    ];
    const centreCodes = {
      'Hindupur': 'h',
      'Dharmavaram': 'd',
      'Bengaluru (Kothanur)': 'b'
    };
    const centreNotes = {
      h: 'Hindupur offers OPG, TMJ, sinus and CBCT scans.',
      d: 'Dharmavaram offers OPG, TMJ and sinus scans. CBCT is not available at this centre.',
      b: 'The Kothanur centre in Bengaluru offers the full range of 2D and 3D scans.'
    };
    const hours = {
      'Hindupur': [540, 1230],
      'Dharmavaram': [540, 1230],
      'Bengaluru (Kothanur)': [570, 1200]
    };
    const centreRadios = form.querySelectorAll('input[name="centre"]');
    const centreHint = form.querySelector('#appt-scan-hint');
    const dateInput = form.querySelector('#appt-date');

    function populateScan(select, choices, placeholder, code) {
      const previous = select.value;
      const available = choices.filter(function (choice) { return !code || choice[1].includes(code); });
      select.disabled = available.length === 0;
      select.replaceChildren(new Option(placeholder, ''));
      if (!available.length) {
        select.add(new Option('Not available at this centre', ''));
        return;
      }
      available.forEach(function (choice) { select.add(new Option(choice[0], choice[0])); });
      if (available.some(function (choice) {
        return choice[0] === previous && (!code || choice[1].includes(code));
      })) {
        select.value = previous;
      }
    }

    function formatTime(minutes) {
      const hours24 = Math.floor(minutes / 60);
      const minutesPart = minutes % 60;
      const hours12 = hours24 % 12 || 12;
      return hours12 + ':' + String(minutesPart).padStart(2, '0') + (hours24 >= 12 ? ' pm' : ' am');
    }

    function updateOptions() {
      const selected = form.querySelector('input[name="centre"]:checked');
      const centre = selected ? selected.value : '';
      const code = centreCodes[centre] || '';
      populateScan(form.querySelector('#appt-2d'), scans2d, 'Select a 2D scan', code);
      populateScan(form.querySelector('#appt-3d'), scans3d, 'Select a 3D scan (CBCT)', code === 'h' || code === 'b' ? code : 'none');
      centreHint.textContent = code ? centreNotes[code] : 'Choose a centre to see the available scans.';

      const timeSelect = form.querySelector('#appt-time');
      const previousTime = timeSelect.value;
      timeSelect.replaceChildren(new Option('Any time', 'Any time'));
      const window = hours[centre];
      if (window) {
        for (let minute = window[0]; minute <= window[1]; minute += 30) {
          timeSelect.add(new Option(formatTime(minute), formatTime(minute)));
        }
      }
      if (Array.from(timeSelect.options).some(function (option) { return option.value === previousTime; })) {
        timeSelect.value = previousTime;
      }
    }

    dateInput.min = new Date(Date.now() + 330 * 60 * 1000).toISOString().slice(0, 10);
    centreRadios.forEach(function (radio) { radio.addEventListener('change', updateOptions); });
    form.addEventListener('input', function () {
      const status = document.getElementById('apptMsg');
      status.textContent = '';
      status.style.display = 'none';
    });
    window.updateAppointmentOptions = updateOptions;
    updateOptions();
  })();
