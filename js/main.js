/* ============================================================
   Guardian Medical Services — main.js
   Nav scroll state, mobile menu, FAQ accordion,
   scroll reveal, booking form handling.
   ============================================================ */
(function () {
    'use strict';

    /* ---------- Sticky header shadow on scroll ---------- */
    var header = document.querySelector('.site-header');
    if (header) {
        var onScroll = function () {
            header.classList.toggle('scrolled', window.scrollY > 8);
        };
        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll();
    }

    /* ---------- Mobile menu toggle ---------- */
    var toggle = document.querySelector('.nav-toggle');
    var links = document.querySelector('.nav-links');
    if (toggle && links) {
        toggle.addEventListener('click', function () {
            var open = links.classList.toggle('open');
            toggle.classList.toggle('open', open);
            toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
            document.body.style.overflow = open ? 'hidden' : '';
        });
        // Close menu when a link is clicked
        links.querySelectorAll('a').forEach(function (a) {
            a.addEventListener('click', function () {
                links.classList.remove('open');
                toggle.classList.remove('open');
                toggle.setAttribute('aria-expanded', 'false');
                document.body.style.overflow = '';
            });
        });
    }

    /* ---------- FAQ accordion ---------- */
    document.querySelectorAll('.faq-item').forEach(function (item) {
        var q = item.querySelector('.faq-q');
        var a = item.querySelector('.faq-a');
        if (!q || !a) return;
        q.addEventListener('click', function () {
            var isOpen = item.classList.contains('open');
            // close siblings
            document.querySelectorAll('.faq-item.open').forEach(function (other) {
                if (other !== item) {
                    other.classList.remove('open');
                    var oa = other.querySelector('.faq-a');
                    if (oa) oa.style.maxHeight = null;
                }
            });
            if (isOpen) {
                item.classList.remove('open');
                a.style.maxHeight = null;
            } else {
                item.classList.add('open');
                a.style.maxHeight = a.scrollHeight + 'px';
            }
        });
    });

    /* ---------- Scroll reveal ---------- */
    var reveals = document.querySelectorAll('.reveal');
    if (reveals.length && 'IntersectionObserver' in window) {
        var io = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    io.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
        reveals.forEach(function (el) { io.observe(el); });
    } else {
        reveals.forEach(function (el) { el.classList.add('visible'); });
    }

    /* ---------- Booking form ---------- */
    var form = document.getElementById('bookingForm');
    if (form) {
        // Guard against past dates
        var dateInput = document.getElementById('rideDate');
        if (dateInput) {
            var t = new Date();
            var iso = t.getFullYear() + '-' +
                String(t.getMonth() + 1).padStart(2, '0') + '-' +
                String(t.getDate()).padStart(2, '0');
            dateInput.setAttribute('min', iso);
        }

        var success = document.getElementById('successMessage');
        var submitBtn = form.querySelector('button[type="submit"]');

        form.addEventListener('submit', function (e) {
            // If the form has a real Formspree endpoint, let it submit via fetch.
            var action = form.getAttribute('action') || '';
            var isPlaceholder = action.indexOf('YOUR_FORM_ID') !== -1 || action === '';

            if (isPlaceholder) {
                // No backend wired yet — show success locally so the page is testable.
                e.preventDefault();
                showSuccess();
                form.reset();
                return;
            }

            // Real Formspree endpoint: submit via AJAX for inline success.
            e.preventDefault();
            if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = 'Sending…'; }
            fetch(action, {
                method: 'POST',
                body: new FormData(form),
                headers: { 'Accept': 'application/json' }
            }).then(function (res) {
                if (res.ok) {
                    showSuccess();
                    form.reset();
                } else {
                    alert('Sorry, something went wrong submitting your request. Please call us at (530) 453-6220.');
                }
            }).catch(function () {
                alert('Sorry, something went wrong submitting your request. Please call us at (530) 453-6220.');
            }).finally(function () {
                if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = 'Request My Ride'; }
            });
        });

        function showSuccess() {
            if (!success) return;
            success.classList.add('show');
            success.scrollIntoView({ behavior: 'smooth', block: 'center' });
            setTimeout(function () { success.classList.remove('show'); }, 12000);
        }
    }

    /* ---------- Footer year ---------- */
    var yr = document.getElementById('year');
    if (yr) yr.textContent = new Date().getFullYear();
})();
