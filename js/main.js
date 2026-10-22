/* ============================================================
   Guardian Medical Services — main.js
   Header state, mobile menu, text-size control, booking stepper,
   Formspree submission, analytics hooks.
   The site works without this file: content is visible, the FAQ
   uses native <details>, and forms submit as plain POSTs.
   ============================================================ */
(function () {
    'use strict';

    var PHONE = '(530) 453-6220';

    /* ---------- Analytics hook (wire a provider later) ---------- */
    function track(name) {
        try {
            if (window.goatcounter && window.goatcounter.count) {
                window.goatcounter.count({ path: 'event-' + name, title: name, event: true });
            }
            document.dispatchEvent(new CustomEvent('gms:track', { detail: { name: name } }));
        } catch (e) { /* never block the user */ }
    }
    document.addEventListener('click', function (e) {
        var el = e.target.closest('[data-track], a[href^="tel:"]');
        if (!el) return;
        track(el.getAttribute('data-track') || 'call');
    });

    /* ---------- Sticky header shadow ---------- */
    var header = document.querySelector('.site-header');
    if (header) {
        var onScroll = function () { header.classList.toggle('scrolled', window.scrollY > 8); };
        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll();
    }

    /* The nav can wrap (larger text sizes, narrow desktops), so anchor offsets and
       sticky sidebars use the header's measured height instead of a fixed value. */
    var syncHeaderHeight = function () {
        if (header) document.documentElement.style.setProperty('--header-h', header.offsetHeight + 'px');
    };
    syncHeaderHeight();
    window.addEventListener('resize', syncHeaderHeight);
    window.addEventListener('load', syncHeaderHeight);
    var onMediaChange = function (mq, fn) {
        if (mq.addEventListener) mq.addEventListener('change', fn);
        else if (mq.addListener) mq.addListener(fn); // iOS Safari < 14
    };

    /* ---------- Mobile menu ---------- */
    var toggle = document.querySelector('.nav-toggle');
    var menu = document.getElementById('site-menu');
    if (toggle && menu) {
        var setMenu = function (open, returnFocus) {
            if (open && header) {
                // Start the panel right under the header, whether or not the utility bar is in view.
                menu.style.setProperty('--menu-top', Math.max(0, header.getBoundingClientRect().bottom) + 'px');
            }
            menu.classList.toggle('is-open', open);
            toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
            // Lock scrolling on <body>: setting it on <html> turns body into the scroll
            // container (body has overflow-x: hidden) and breaks the sticky header.
            document.body.style.overflow = open ? 'hidden' : '';
            if (open) {
                var first = menu.querySelector('a');
                if (first) first.focus();
            } else if (returnFocus) {
                toggle.focus();
            }
        };
        toggle.addEventListener('click', function () {
            setMenu(toggle.getAttribute('aria-expanded') !== 'true');
        });
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && menu.classList.contains('is-open')) setMenu(false, true);
        });
        document.addEventListener('click', function (e) {
            if (menu.classList.contains('is-open') && !menu.contains(e.target) && !toggle.contains(e.target)) {
                setMenu(false);
            }
        });
        menu.addEventListener('click', function (e) {
            if (e.target.closest('a')) setMenu(false);
        });
        onMediaChange(window.matchMedia('(min-width: 981px)'), function (mq) {
            if (mq.matches) setMenu(false);
        });
    }

    /* ---------- Text size (A / A+ / A++) ---------- */
    var sizeButtons = document.querySelectorAll('button[data-text-size]');
    var syncSizeButtons = function () {
        var current = document.documentElement.getAttribute('data-text-size') || '';
        sizeButtons.forEach(function (b) {
            b.setAttribute('aria-pressed', b.getAttribute('data-text-size') === current ? 'true' : 'false');
        });
    };
    sizeButtons.forEach(function (btn) {
        btn.addEventListener('click', function () {
            var size = btn.getAttribute('data-text-size');
            if (size) document.documentElement.setAttribute('data-text-size', size);
            else document.documentElement.removeAttribute('data-text-size');
            try { localStorage.setItem('gms-text-size', size); } catch (e) { /* private mode */ }
            syncSizeButtons();
            syncHeaderHeight();
        });
    });
    syncSizeButtons();

    /* ---------- Formspree submission (any form[data-formspree]) ---------- */
    function showStatus(form, message) {
        var box = form.querySelector('.form-status');
        if (!box) return;
        box.querySelector('span').textContent = message;
        box.classList.add('is-shown');
        box.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    function hideStatus(form) {
        var box = form.querySelector('.form-status');
        if (box) box.classList.remove('is-shown');
    }

    document.querySelectorAll('form[data-formspree]').forEach(function (form) {
        form.addEventListener('submit', function (e) {
            if (form.hasAttribute('data-stepper') && !form._stepperReady()) {
                e.preventDefault();
                return;
            }
            e.preventDefault();
            hideStatus(form);
            var submitBtn = form.querySelector('button[type="submit"]');
            var label = submitBtn ? submitBtn.innerHTML : '';
            if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = 'Sending…'; }

            fetch(form.action, {
                method: 'POST',
                body: new FormData(form),
                headers: { 'Accept': 'application/json' }
            }).then(function (res) {
                if (res.ok) return { ok: true };
                return res.json().then(function (data) { return { ok: false, data: data }; },
                                       function () { return { ok: false }; });
            }).then(function (result) {
                if (result.ok) {
                    var success = document.getElementById(form.getAttribute('data-success'));
                    form.hidden = true;
                    if (success) {
                        success.classList.add('is-shown');
                        success.focus();
                        success.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                    track(form.getAttribute('data-track-submit') || 'form-submit');
                    return;
                }
                var msg = 'Sorry, we couldn’t send your request. Please try again or call us at ' + PHONE + '.';
                if (result.data && result.data.errors && result.data.errors.length) {
                    msg = result.data.errors.map(function (er) { return er.message; }).join(' ') +
                          ' If this keeps happening, call us at ' + PHONE + '.';
                }
                showStatus(form, msg);
            }).catch(function () {
                showStatus(form, 'We couldn’t reach our booking system. Please check your connection, or call us at ' + PHONE + '.');
            }).finally(function () {
                if (submitBtn) { submitBtn.disabled = false; submitBtn.innerHTML = label; }
            });
        });
    });

    /* ---------- Booking stepper ---------- */
    var booking = document.getElementById('bookingForm');
    if (booking) initStepper(booking);

    function initStepper(form) {
        var steps = Array.prototype.slice.call(form.querySelectorAll('.form-step'));
        var progressItems = form.querySelectorAll('.progress-steps li');
        var progressText = form.querySelector('.progress-text');
        var current = 0;
        form.classList.add('is-stepper');
        // Validation runs per step in JS; native validation can't reach hidden steps.
        form.noValidate = true;

        // Prefill from URL: ?for=self|family|facility&service=wheelchair
        var params = new URLSearchParams(window.location.search);
        ['for', 'service'].forEach(function (key) {
            var val = params.get(key);
            if (!val) return;
            var name = key === 'for' ? 'bookingFor' : 'serviceType';
            var input = form.querySelector('input[name="' + name + '"][data-key="' + val + '"]') ||
                        form.querySelector('input[type="checkbox"][data-key="' + val + '"]');
            if (input) input.checked = true;
        });

        // Dates: no past dates; no past times for today
        var dateInput = form.querySelector('#rideDate');
        var timeInput = form.querySelector('#rideTime');
        var today = new Date();
        var iso = today.getFullYear() + '-' + String(today.getMonth() + 1).padStart(2, '0') + '-' + String(today.getDate()).padStart(2, '0');
        if (dateInput) dateInput.min = iso;
        var checkTime = function () {
            if (!dateInput || !timeInput) return;
            timeInput.setCustomValidity('');
            if (dateInput.value === iso && timeInput.value) {
                var now = new Date();
                var hm = String(now.getHours()).padStart(2, '0') + ':' + String(now.getMinutes()).padStart(2, '0');
                if (timeInput.value < hm) timeInput.setCustomValidity('Please choose a time later today, or pick another date.');
            }
        };
        if (dateInput) dateInput.addEventListener('change', checkTime);
        if (timeInput) timeInput.addEventListener('change', checkTime);

        // Conditional fields: <div data-show-when="name=value|value2">
        var conditionals = form.querySelectorAll('[data-show-when]');
        var updateConditionals = function () {
            conditionals.forEach(function (el) {
                var rule = el.getAttribute('data-show-when').split('=');
                var checked = form.querySelector('input[name="' + rule[0] + '"]:checked');
                var show = !!checked && rule[1].split('|').indexOf(checked.value) !== -1;
                el.classList.toggle('is-shown', show);
            });
        };
        form.addEventListener('change', updateConditionals);
        updateConditionals();

        function validateStep(step) {
            var fields = step.querySelectorAll('input, select, textarea');
            var firstBad = null;
            fields.forEach(function (f) {
                if (f.closest('[data-show-when]:not(.is-shown)') || f.closest('.hp')) return;
                var ok = f.checkValidity();
                if (f.type !== 'radio' && f.type !== 'checkbox') f.setAttribute('aria-invalid', ok ? 'false' : 'true');
                if (!ok && !firstBad) firstBad = f;
            });
            if (firstBad) {
                firstBad.reportValidity();
                firstBad.focus();
                return false;
            }
            return true;
        }

        function show(index, focus) {
            current = index;
            steps.forEach(function (s, i) { s.classList.toggle('is-active', i === index); });
            progressItems.forEach(function (li, i) {
                if (i === index) li.setAttribute('aria-current', 'step'); else li.removeAttribute('aria-current');
                li.classList.toggle('done', i < index);
            });
            if (progressText) progressText.textContent = 'Step ' + (index + 1) + ' of ' + steps.length;
            if (index === steps.length - 1) buildSummary();
            if (focus) {
                var title = steps[index].querySelector('.step-title');
                if (title) { title.focus(); }
                form.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }

        form.addEventListener('click', function (e) {
            var next = e.target.closest('[data-next]');
            var back = e.target.closest('[data-back]');
            var edit = e.target.closest('[data-goto]');
            if (next) {
                e.preventDefault();
                if (validateStep(steps[current])) show(Math.min(current + 1, steps.length - 1), true);
            } else if (back) {
                e.preventDefault();
                show(Math.max(current - 1, 0), true);
            } else if (edit) {
                e.preventDefault();
                show(parseInt(edit.getAttribute('data-goto'), 10), true);
            }
        });

        // Enter in a text field moves to the next step instead of submitting early.
        form.addEventListener('keydown', function (e) {
            if (e.key !== 'Enter' || e.target.tagName !== 'INPUT' || current >= steps.length - 1) return;
            e.preventDefault();
            if (validateStep(steps[current])) show(current + 1, true);
        });

        // The submit handler asks this before sending.
        form._stepperReady = function () {
            for (var i = 0; i < steps.length; i++) {
                if (!validateStep(steps[i])) { show(i, false); validateStep(steps[i]); return false; }
            }
            return true;
        };

        function val(name) {
            var el = form.querySelector('[name="' + name + '"]:checked') || form.querySelector('[name="' + name + '"]:not([type="radio"])');
            return el && el.value ? el.value : '';
        }
        function formatDate(v) {
            if (!v) return '';
            var p = v.split('-');
            var d = new Date(+p[0], +p[1] - 1, +p[2]);
            return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
        }
        function formatTime(v) {
            if (!v) return '';
            var p = v.split(':');
            var h = +p[0];
            return ((h % 12) || 12) + ':' + p[1] + (h < 12 ? ' AM' : ' PM');
        }
        function buildSummary() {
            var dl = form.querySelector('.trip-summary dl');
            if (!dl) return;
            var rows = [
                ['Rider', val('bookingFor')],
                ['Transport', val('serviceType')],
                ['Trip', val('tripType')],
                ['From', val('pickupCity')],
                ['To', val('destination')],
                ['When', [formatDate(val('rideDate')), val('timeType') ? val('timeType').toLowerCase() + ' ' + formatTime(val('rideTime')) : formatTime(val('rideTime'))].filter(Boolean).join(', ')]
            ];
            dl.innerHTML = '';
            rows.forEach(function (r) {
                if (!r[1]) return;
                var dt = document.createElement('dt'); dt.textContent = r[0];
                var dd = document.createElement('dd'); dd.textContent = r[1];
                dl.appendChild(dt); dl.appendChild(dd);
            });
        }

        show(0, false);
    }

    /* ---------- Footer year ---------- */
    var yr = document.getElementById('year');
    if (yr) yr.textContent = new Date().getFullYear();
})();
