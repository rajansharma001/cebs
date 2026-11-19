/**
 * Chhinchu English Boarding School (CEBS) & CEBS Montessori — Homepage Script
 * Standalone Vanilla JavaScript (Modified from ProSchool WordPress Theme)
 */

document.addEventListener('DOMContentLoaded', function () {
    'use strict';

    const yearEl = document.getElementById('year-now');
    if (yearEl) {
        yearEl.textContent = new Date().getFullYear();
    }

    function escapeHtml(str) {
        return String(str).replace(/[&<>"']/g, function (ch) {
            return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch];
        });
    }

    /* ==========================================================
       1. DARK / LIGHT MODE TOGGLE
       ========================================================== */
    const themeToggleBtn = document.getElementById('theme-toggle');
    const themeIcon = document.getElementById('theme-icon');

    function applyTheme(dark) {
        document.documentElement.classList.toggle('dark-mode', dark);
        if (themeIcon) {
            themeIcon.className = dark ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
        }
    }

    if (localStorage.getItem('cebs_theme') === 'dark') {
        applyTheme(true);
    }

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', function () {
            const isDark = !document.documentElement.classList.contains('dark-mode');
            applyTheme(isDark);
            localStorage.setItem('cebs_theme', isDark ? 'dark' : 'light');
        });
    }

    /* ==========================================================
       2. BILINGUAL SUBTITLE TOGGLE (EN / नेपाली)
       ========================================================== */
    const langToggleBtn = document.getElementById('lang-toggle');
    let currentLang = 'en';

    if (langToggleBtn) {
        langToggleBtn.addEventListener('click', function () {
            currentLang = currentLang === 'en' ? 'np' : 'en';
            document.querySelectorAll('[data-en][data-np]').forEach(function (el) {
                el.innerHTML = el.getAttribute('data-' + currentLang);
            });
            langToggleBtn.textContent = currentLang === 'en' ? 'नेपाली / EN' : 'EN / नेपाली';
        });
    }

    /* ==========================================================
       3. STICKY HEADER, ACTIVE NAV & SCROLL-TO-TOP
       ========================================================== */
    const header = document.getElementById('header');
    const navLinks = document.querySelectorAll('#desktop-nav a');
    const scrollTopBtn = document.getElementById('scroll-to-top');

    function handleScroll() {
        const scrollY = window.scrollY || window.pageYOffset;
        if (header) {
            header.classList.toggle('scrolled', scrollY > 50);
        }
        if (scrollTopBtn) {
            scrollTopBtn.classList.toggle('visible', scrollY > 320);
        }

        let activeId = 'home';
        document.querySelectorAll('section[id], footer[id]').forEach(function (sec) {
            if (scrollY >= sec.offsetTop - 165) {
                activeId = sec.getAttribute('id');
            }
        });
        navLinks.forEach(function (link) {
            const target = link.getAttribute('href').replace('#', '');
            link.classList.toggle('active', target === activeId);
        });
    }

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    if (scrollTopBtn) {
        scrollTopBtn.addEventListener('click', function () {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    /* ==========================================================
       4. MOBILE NAVIGATION DRAWER
       ========================================================== */
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileDrawer = document.getElementById('mobile-drawer');
    const drawerBackdrop = document.getElementById('drawer-backdrop');
    const drawerCloseBtn = document.getElementById('drawer-close');

    function setDrawer(open) {
        if (!mobileDrawer || !drawerBackdrop || !mobileMenuBtn) return;
        mobileDrawer.classList.toggle('open', open);
        drawerBackdrop.classList.toggle('open', open);
        mobileMenuBtn.setAttribute('aria-expanded', String(open));
        document.body.style.overflow = open ? 'hidden' : '';
    }

    if (mobileMenuBtn) mobileMenuBtn.addEventListener('click', function () { setDrawer(true); });
    if (drawerCloseBtn) drawerCloseBtn.addEventListener('click', function () { setDrawer(false); });
    if (drawerBackdrop) drawerBackdrop.addEventListener('click', function () { setDrawer(false); });
    document.querySelectorAll('.mobile-nav-list a').forEach(function (link) {
        link.addEventListener('click', function () { setDrawer(false); });
    });

    /* ==========================================================
       5. HERO SLIDER
       ========================================================== */
    const heroSection = document.querySelector('.hero');
    const slides = document.querySelectorAll('.hero-slide');
    const dots = document.querySelectorAll('.hero-dot');
    const prevBtn = document.getElementById('hero-prev');
    const nextBtn = document.getElementById('hero-next');
    let slideIndex = 0;
    let slideTimer = null;

    function goToSlide(index) {
        if (slides.length === 0) return;
        slideIndex = (index + slides.length) % slides.length;
        slides.forEach(function (s, idx) {
            s.classList.toggle('active', idx === slideIndex);
        });
        dots.forEach(function (d, idx) {
            d.classList.toggle('active', idx === slideIndex);
        });
    }

    function startSlider() {
        stopSlider();
        slideTimer = setInterval(function () {
            goToSlide(slideIndex + 1);
        }, 6200);
    }

    function stopSlider() {
        if (slideTimer) {
            clearInterval(slideTimer);
            slideTimer = null;
        }
    }

    if (slides.length > 0) {
        if (prevBtn) {
            prevBtn.addEventListener('click', function () {
                goToSlide(slideIndex - 1);
                startSlider();
            });
        }
        if (nextBtn) {
            nextBtn.addEventListener('click', function () {
                goToSlide(slideIndex + 1);
                startSlider();
            });
        }
        dots.forEach(function (dot) {
            dot.addEventListener('click', function () {
                goToSlide(parseInt(dot.getAttribute('data-slide'), 10));
                startSlider();
            });
        });
        if (heroSection) {
            heroSection.addEventListener('mouseenter', stopSlider);
            heroSection.addEventListener('mouseleave', startSlider);
        }
        startSlider();
    }

    /* ==========================================================
       6. SCROLL REVEAL (IntersectionObserver)
       ========================================================== */
    // Reveal top floating cards immediately on load so mobile/tall viewports never show blank space
    document.querySelectorAll('.floating-cards .reveal-up').forEach(function (card) {
        requestAnimationFrame(function () {
            card.classList.add('is-revealed');
        });
    });

    const revealEls = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right, .reveal-scale');
    if (revealEls.length > 0 && 'IntersectionObserver' in window) {
        const revealObserver = new IntersectionObserver(function (entries, obs) {
            entries.forEach(function (entry) {
                if (!entry.isIntersecting) return;
                entry.target.classList.add('is-revealed');
                obs.unobserve(entry.target);
            });
        }, { threshold: 0.06, rootMargin: '60px 0px 80px 0px' });

        revealEls.forEach(function (el) { revealObserver.observe(el); });
    } else {
        revealEls.forEach(function (el) { el.classList.add('is-revealed'); });
    }

    /* ==========================================================
       7. STATISTICAL COUNTERS ANIMATION
       ========================================================== */
    const counters = document.querySelectorAll('.counter');
    if (counters.length > 0 && 'IntersectionObserver' in window) {
        const counterObserver = new IntersectionObserver(function (entries, obs) {
            entries.forEach(function (entry) {
                if (!entry.isIntersecting) return;
                const el = entry.target;
                const target = parseInt(el.getAttribute('data-target'), 10) || 0;
                const suffix = el.getAttribute('data-suffix') || '';
                const duration = 1600;
                const startTime = performance.now();

                function tick(now) {
                    const progress = Math.min((now - startTime) / duration, 1);
                    const eased = 1 - Math.pow(1 - progress, 3);
                    const value = Math.round(target * eased);
                    el.textContent = progress < 1 ? String(value) : String(target) + suffix;
                    if (progress < 1) {
                        requestAnimationFrame(tick);
                    }
                }

                requestAnimationFrame(tick);
                obs.unobserve(el);
            });
        }, { threshold: 0.45 });

        counters.forEach(function (c) { counterObserver.observe(c); });
    }

    /* ==========================================================
       8. PROGRAM DIVISION FILTERS (School vs +2)
       ========================================================== */
    const programFilterBtns = document.querySelectorAll('[data-program-filter]');
    const academicCards = document.querySelectorAll('.academic-card');

    programFilterBtns.forEach(function (btn) {
        btn.addEventListener('click', function () {
            const filter = btn.getAttribute('data-program-filter');
            programFilterBtns.forEach(function (b) { b.classList.remove('active'); });
            btn.classList.add('active');

            academicCards.forEach(function (card) {
                const match = filter === 'all' || card.getAttribute('data-level') === filter;
                card.classList.toggle('is-hidden', !match);
                if (match) {
                    card.classList.add('is-revealed');
                }
            });
        });
    });

    /* ==========================================================
       9. GALLERY CATEGORY FILTERS & LIGHTBOX
       ========================================================== */
    const galleryFilterBtns = document.querySelectorAll('[data-gallery-filter]');
    const allGalleryItems = Array.from(document.querySelectorAll('.gallery-item'));
    let visibleGalleryItems = allGalleryItems.slice();

    galleryFilterBtns.forEach(function (btn) {
        btn.addEventListener('click', function () {
            const filter = btn.getAttribute('data-gallery-filter');
            galleryFilterBtns.forEach(function (b) { b.classList.remove('active'); });
            btn.classList.add('active');

            visibleGalleryItems = [];
            allGalleryItems.forEach(function (item) {
                const match = filter === 'all' || item.getAttribute('data-category') === filter;
                item.classList.toggle('is-hidden', !match);
                if (match) visibleGalleryItems.push(item);
            });
        });
    });

    /* ==========================================================
       10. OFFICIAL NOTICES MODAL DATA
       ========================================================== */
    const noticesData = [
        {
            date: 'Academic Session Notice • Baisakh',
            title: 'Admissions Open: CEBS Montessori (Nursery–UKG), Grade 1–10 & +2',
            body: '<p style="margin-bottom:12px;"><strong>Chhinchu English Boarding School (CEBS)</strong> &amp; <strong>CEBS Montessori</strong> invite admission applications for the upcoming academic session at Bheriganga Municipality-12, Chhinchu, Surkhet.</p>' +
                  '<ul style="padding-left:18px; line-height:1.85; margin-bottom:12px;">' +
                  '<li><strong>CEBS Montessori Wing:</strong> Playgroup, Nursery, LKG &amp; UKG</li>' +
                  '<li><strong>School Level:</strong> Grades 1 – 10 (English-medium &amp; SEE preparation)</li>' +
                  '<li><strong>+2 Higher Secondary (NEB):</strong> Science, Management, Law &amp; Education</li>' +
                  '</ul>' +
                  '<p>Visit the school office or call <strong>+977 83-540234</strong> for entrance assessment dates and form collection.</p>',
            signer: 'Purushotam Timalsena — Principal, CEBS Chhinchu'
        },
        {
            date: 'NEB +2 Intake • Merit Scholarships',
            title: '+2 Scholarship & Stream Orientation Notice',
            body: '<p style="margin-bottom:12px;">Merit scholarships and counseling desks are now active for SEE graduates wishing to enroll in <strong>+2 Science, Management, Law, or Education</strong> at Chhinchu English Boarding School.</p>' +
                  '<p style="margin-bottom:12px;">Bring your SEE Grade Sheet, character certificate, and two passport photographs to qualify for merit-based tuition waivers alongside laboratory &amp; library induction.</p>' +
                  '<p>Email inquiries may also be sent to <strong>chhinchuschool@gmail.com</strong>.</p>',
            signer: 'NEB +2 Academic Desk — Chhinchu, Surkhet'
        },
        {
            date: 'Hostel & Residential Wing Notice',
            title: 'Boarding / Hostel Seat Registration for Karnali Scholars',
            body: '<p style="margin-bottom:12px;">CEBS offers structured residential boarding facilities welcoming boys and girls from across Surkhet and neighboring hill districts of Karnali Province.</p>' +
                  '<p>Hostel facilities include supervised evening &amp; morning study hours, clean dining, warm mentorship, and quick access to the campus science labs and library. Limited hostel beds are allocated on a first-come basis.</p>',
            signer: 'Hostel & Administration Office — +977 83-540234'
        }
    ];

    /* ==========================================================
       11. MODAL ENGINE (Notice / Admission / Tour / Lightbox)
       ========================================================== */
    const noticeModal = document.getElementById('notice-modal');
    const admissionModal = document.getElementById('admission-modal');
    const tourModal = document.getElementById('tour-modal');
    const lightboxModal = document.getElementById('lightbox-modal');
    const allModals = [noticeModal, admissionModal, tourModal, lightboxModal];

    function closeAllModals() {
        allModals.forEach(function (m) {
            if (m) m.classList.remove('open');
        });
        document.body.style.overflow = '';
    }

    function openModal(modal) {
        closeAllModals();
        if (modal) {
            modal.classList.add('open');
            document.body.style.overflow = 'hidden';
        }
    }

    document.querySelectorAll('.js-close-modal').forEach(function (btn) {
        btn.addEventListener('click', closeAllModals);
    });

    allModals.forEach(function (modal) {
        if (!modal) return;
        modal.addEventListener('click', function (e) {
            if (e.target === modal) closeAllModals();
        });
    });

    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') {
            closeAllModals();
            setDrawer(false);
        }
    });

    document.querySelectorAll('.js-open-notice').forEach(function (trigger) {
        function handleNoticeOpen(e) {
            e.preventDefault();
            const id = parseInt(trigger.getAttribute('data-notice-id'), 10) || 0;
            const item = noticesData[id] || noticesData[0];
            document.getElementById('notice-modal-date').textContent = item.date;
            document.getElementById('notice-modal-title').textContent = item.title;
            document.getElementById('notice-modal-body').innerHTML = item.body;
            document.getElementById('notice-modal-signer').textContent = item.signer;
            openModal(noticeModal);
        }
        trigger.addEventListener('click', handleNoticeOpen);
        trigger.addEventListener('keydown', function (e) {
            if (e.key === 'Enter' || e.key === ' ') handleNoticeOpen(e);
        });
    });

    const programSelect = document.getElementById('inq-program');
    document.querySelectorAll('.js-open-admission').forEach(function (btn) {
        btn.addEventListener('click', function (e) {
            e.preventDefault();
            const preset = btn.getAttribute('data-preset');
            if (preset && programSelect) {
                programSelect.value = preset;
            }
            setDrawer(false);
            openModal(admissionModal);
        });
    });

    const tourBtn = document.getElementById('open-tour-modal');
    if (tourBtn) {
        tourBtn.addEventListener('click', function () {
            openModal(tourModal);
        });
    }

    // Lightbox Binding
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCaption = document.getElementById('lightbox-caption');
    const lbPrev = document.getElementById('lightbox-prev');
    const lbNext = document.getElementById('lightbox-next');
    let lbIndex = 0;

    function showLightboxImage(idx) {
        if (visibleGalleryItems.length === 0) return;
        lbIndex = (idx + visibleGalleryItems.length) % visibleGalleryItems.length;
        const item = visibleGalleryItems[lbIndex];
        const img = item.querySelector('img');
        if (lightboxImg && img) {
            lightboxImg.src = img.src;
            lightboxImg.alt = img.alt;
        }
        if (lightboxCaption) {
            lightboxCaption.textContent = item.getAttribute('data-caption') || img.alt;
        }
    }

    allGalleryItems.forEach(function (item) {
        item.addEventListener('click', function () {
            const idx = visibleGalleryItems.indexOf(item);
            showLightboxImage(idx >= 0 ? idx : 0);
            openModal(lightboxModal);
        });
    });

    if (lbPrev) lbPrev.addEventListener('click', function () { showLightboxImage(lbIndex - 1); });
    if (lbNext) lbNext.addEventListener('click', function () { showLightboxImage(lbIndex + 1); });

    /* ==========================================================
       12. TESTIMONIALS CAROUSEL
       ========================================================== */
    const tSlides = document.querySelectorAll('.testimonial-slide');
    const tDots = document.querySelectorAll('.testimonial-dot');
    let tIndex = 0;

    function showTestimonial(idx) {
        if (tSlides.length === 0) return;
        tIndex = (idx + tSlides.length) % tSlides.length;
        tSlides.forEach(function (s, i) { s.classList.toggle('active', i === tIndex); });
        tDots.forEach(function (d, i) { d.classList.toggle('active', i === tIndex); });
    }

    tDots.forEach(function (dot) {
        dot.addEventListener('click', function () {
            showTestimonial(parseInt(dot.getAttribute('data-t'), 10));
        });
    });

    if (tSlides.length > 1) {
        setInterval(function () {
            showTestimonial(tIndex + 1);
        }, 7200);
    }

    /* ==========================================================
       13. ACADEMIC RESULT CHECKER (DEMO SAMPLE DATA)
       ========================================================== */
    const resultRecords = {
        'CEBS-10-104': {
            dob: '2067-08-14',
            batch: 'see-10',
            name: 'Sushmita Oli (Demo Student)',
            program: 'Grade 10 — Pre-SEE Terminal Exam',
            status: 'DISTINCTION (PASS)',
            gpa: '3.85 GPA (A+)',
            subjects: [
                { name: 'Compulsory English', full: 100, obtained: 91, grade: 'A+' },
                { name: 'Compulsory Mathematics', full: 100, obtained: 93, grade: 'A+' },
                { name: 'Science & Technology', full: 100, obtained: 89, grade: 'A' },
                { name: 'Optional Mathematics', full: 100, obtained: 88, grade: 'A' },
                { name: 'Computer Science', full: 100, obtained: 95, grade: 'A+' }
            ]
        },
        'CEBS-12S-018': {
            dob: '2065-03-21',
            batch: 'plus2-sci',
            name: 'Bishal Budha (Demo Student)',
            program: '+2 Science — Grade 12 Internal Assessment',
            status: 'MERIT HONOR (PASS)',
            gpa: '3.72 GPA (A+)',
            subjects: [
                { name: 'Physics (Theory + Lab)', full: 100, obtained: 86, grade: 'A' },
                { name: 'Chemistry (Theory + Lab)', full: 100, obtained: 88, grade: 'A' },
                { name: 'Mathematics', full: 100, obtained: 90, grade: 'A+' },
                { name: 'Biology / Computer', full: 100, obtained: 84, grade: 'A' },
                { name: 'Compulsory English', full: 100, obtained: 82, grade: 'A' }
            ]
        },
        'CEBS-11L-009': {
            dob: '2066-11-05',
            batch: 'plus2-law',
            name: 'Anjali Khadka (Demo Student)',
            program: '+2 Law — Grade 11 Assessment',
            status: 'DISTINCTION (PASS)',
            gpa: '3.64 GPA (A)',
            subjects: [
                { name: 'Constitutional Law', full: 100, obtained: 85, grade: 'A' },
                { name: 'Jurisprudence & Legal Theories', full: 100, obtained: 83, grade: 'A' },
                { name: 'Procedural Law & Legal Drafting', full: 100, obtained: 87, grade: 'A' },
                { name: 'Compulsory English', full: 100, obtained: 84, grade: 'A' },
                { name: 'Compulsory Nepali', full: 100, obtained: 81, grade: 'A' }
            ]
        }
    };

    const resultForm = document.getElementById('result-checker-form');
    const resultOutput = document.getElementById('result-output');
    const symInput = document.getElementById('symbol_number');
    const dobInput = document.getElementById('dob');
    const batchInput = document.getElementById('batch');

    document.querySelectorAll('.js-fill-result').forEach(function (chip) {
        chip.addEventListener('click', function () {
            if (symInput) symInput.value = chip.getAttribute('data-sym');
            if (dobInput) dobInput.value = chip.getAttribute('data-dob');
            if (batchInput) batchInput.value = chip.getAttribute('data-batch');
            if (resultForm) resultForm.dispatchEvent(new Event('submit', { cancelable: true }));
        });
    });

    if (resultForm && resultOutput) {
        resultForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const sym = symInput.value.trim().toUpperCase();
            const dob = dobInput.value.trim();
            const batch = batchInput.value;
            const rec = resultRecords[sym];

            resultOutput.classList.remove('error');
            resultOutput.classList.add('visible');

            if (rec && rec.dob === dob && rec.batch === batch) {
                let html = '<div style="display:flex; justify-content:space-between; flex-wrap:wrap; gap:8px; margin-bottom:10px;">' +
                    '<strong style="color:var(--color-heading); font-size:1.05rem;">' + escapeHtml(rec.name) + '</strong>' +
                    '<span style="background:var(--color-navy); color:var(--color-gold); padding:3px 10px; font-size:0.78rem; font-weight:600;">' + escapeHtml(rec.status) + '</span>' +
                    '</div>' +
                    '<p style="font-size:0.88rem; color:var(--color-text-muted); margin-bottom:6px;"><strong>Symbol No:</strong> ' + escapeHtml(sym) + ' &bull; <strong>Program:</strong> ' + escapeHtml(rec.program) + '</p>' +
                    '<p style="font-size:0.9rem; color:var(--color-heading); font-weight:600;">Result Evaluation: ' + escapeHtml(rec.gpa) + '</p>';

                html += '<table class="marksheet-table"><thead><tr><th>Subject</th><th>Full Marks</th><th>Obtained</th><th>Grade</th></tr></thead><tbody>';
                rec.subjects.forEach(function (sub) {
                    html += '<tr><td>' + escapeHtml(sub.name) + '</td><td>' + sub.full + '</td><td>' + sub.obtained + '</td><td><strong>' + escapeHtml(sub.grade) + '</strong></td></tr>';
                });
                html += '</tbody></table>';
                resultOutput.innerHTML = html;
            } else {
                resultOutput.classList.add('error');
                resultOutput.innerHTML = '<strong>No matching record found in this offline HTML demo.</strong><br>' +
                    '<span style="font-size:0.86rem;">Try one of the <em>Demo quick-fill</em> buttons above to preview a sample Grade 10 SEE, +2 Science, or +2 Law marksheet, or contact CEBS office at <strong>+977 83-540234</strong>.</span>';
            }
        });
    }

    /* ==========================================================
       14. ADMISSION & HOSTEL INQUIRY FORM
       ========================================================== */
    const admissionForm = document.getElementById('admission-inquiry-form');
    const admissionFeedback = document.getElementById('admission-feedback');

    if (admissionForm && admissionFeedback) {
        admissionForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const name = document.getElementById('inq-name').value.trim();
            const phone = document.getElementById('inq-phone').value.trim();
            const program = document.getElementById('inq-program').value;
            const boarding = document.getElementById('inq-boarding').value;
            const ref = 'CEBS-83-' + Math.floor(1000 + Math.random() * 9000);

            admissionFeedback.classList.remove('error');
            admissionFeedback.classList.add('visible');
            admissionFeedback.innerHTML =
                '<strong style="color:var(--color-heading);">Inquiry Recorded (Demo Reference: ' + ref + ')</strong>' +
                '<p style="font-size:0.88rem; margin-top:8px; color:var(--color-text-muted);">Thank you, <strong>' + escapeHtml(name) + '</strong>. Your inquiry for <em>' + escapeHtml(program) + '</em> (' + escapeHtml(boarding) + ') via phone <strong>' + escapeHtml(phone) + '</strong> has been formatted. For direct assistance in Chhinchu, call <strong>+977 83-540234</strong> or email <strong>chhinchuschool@gmail.com</strong>.</p>';
            admissionForm.reset();
        });
    }
});
