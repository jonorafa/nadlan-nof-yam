document.addEventListener("DOMContentLoaded", () => {
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                // Adjust for sticky header height
                const headerHeight = document.querySelector('.header').offsetHeight;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerHeight;
  
                window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth"
                });
            }
        });
    });

    // Sticky header with shrink effect
    const header = document.getElementById("header");
    window.addEventListener("scroll", () => {
        if (window.scrollY > 50) {
            header.classList.add("scrolled");
        } else {
            header.classList.remove("scrolled");
        }
    });

    // Reveal animations on scroll
    const revealElements = document.querySelectorAll('.property-card, .team-card, .section-title');
    
    const revealOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const revealOnScroll = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if (!entry.isIntersecting) {
                return;
            } else {
                entry.target.classList.add('reveal-visible');
                observer.unobserve(entry.target);
            }
        });
    }, revealOptions);

    revealElements.forEach(el => {
        el.classList.add('reveal-hidden');
        revealOnScroll.observe(el);
    });

    // Accordion Logic
    const accordions = document.querySelectorAll('.accordion-header');
    accordions.forEach(acc => {
        acc.addEventListener('click', function() {
            this.classList.toggle('active');
            const content = this.nextElementSibling;
            const icon = this.querySelector('.icon');
            if (content.style.maxHeight) {
                content.style.maxHeight = null;
                if(icon) icon.textContent = '+';
            } else {
                content.style.maxHeight = content.scrollHeight + "px";
                if(icon) icon.textContent = '-';
            }
        });
    });

    // Mortgage Calculator Logic
    const priceInput = document.getElementById('calc-price');
    const downpaymentInput = document.getElementById('calc-downpayment');
    const interestInput = document.getElementById('calc-interest');
    const yearsInput = document.getElementById('calc-years');
    const monthlyResult = document.getElementById('calc-monthly');

    function calculateMortgage() {
        if (!priceInput) return;
        
        const price = parseFloat(priceInput.value) || 0;
        const downpayment = parseFloat(downpaymentInput.value) || 0;
        const interestRate = parseFloat(interestInput.value) || 0;
        const years = parseFloat(yearsInput.value) || 0;

        const principal = price - downpayment;

        if (principal <= 0 || interestRate <= 0 || years <= 0) {
            monthlyResult.textContent = '₪ 0';
            return;
        }

        const r = (interestRate / 100) / 12;
        const n = years * 12;
        const monthlyPayment = principal * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
        
        monthlyResult.textContent = '₪ ' + Math.round(monthlyPayment).toLocaleString('he-IL');
    }

    if (priceInput) {
        [priceInput, downpaymentInput, interestInput, yearsInput].forEach(input => {
            input.addEventListener('input', calculateMortgage);
        });
        calculateMortgage();
    }

    // --- Property Share buttons ---
    const shareButtons = document.querySelectorAll('.property-share__btn');
    if (shareButtons.length > 0) {
        const lang = (document.documentElement.lang || 'he').toLowerCase();
        const pageUrl = window.location.href;
        const pageTitle = document.title;

        const copiedMessage = lang.startsWith('en')
            ? 'Link copied to clipboard ✓'
            : 'הקישור הועתק ✓';

        const shareText = lang.startsWith('en')
            ? `Check out this property on Nadlan Nof Yam: ${pageTitle}`
            : `תראה את הנכס הזה של נדל״ן נוף ים: ${pageTitle}`;

        const emailSubject = lang.startsWith('en')
            ? `Property: ${pageTitle}`
            : `נכס: ${pageTitle}`;

        function showToast(message) {
            let toast = document.querySelector('.share-toast');
            if (!toast) {
                toast = document.createElement('div');
                toast.className = 'share-toast';
                document.body.appendChild(toast);
            }
            toast.textContent = message;
            requestAnimationFrame(() => toast.classList.add('visible'));
            setTimeout(() => toast.classList.remove('visible'), 2400);
        }

        shareButtons.forEach(btn => {
            btn.addEventListener('click', async function (e) {
                e.preventDefault();
                const type = this.dataset.share;

                if (type === 'whatsapp') {
                    const url = `https://wa.me/?text=${encodeURIComponent(shareText + ' ' + pageUrl)}`;
                    window.open(url, '_blank', 'noopener,noreferrer');
                }
                else if (type === 'email') {
                    const body = shareText + '\n\n' + pageUrl;
                    const url = `mailto:?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(body)}`;
                    window.location.href = url;
                }
                else if (type === 'copy') {
                    try {
                        await navigator.clipboard.writeText(pageUrl);
                        showToast(copiedMessage);
                    } catch (err) {
                        // Fallback for old browsers
                        const tmp = document.createElement('textarea');
                        tmp.value = pageUrl;
                        document.body.appendChild(tmp);
                        tmp.select();
                        document.execCommand('copy');
                        document.body.removeChild(tmp);
                        showToast(copiedMessage);
                    }
                }
                else if (type === 'native') {
                    // Mobile native share sheet (iOS/Android)
                    if (navigator.share) {
                        try {
                            await navigator.share({
                                title: pageTitle,
                                text: shareText,
                                url: pageUrl
                            });
                        } catch (err) {
                            // User canceled — silent
                        }
                    } else {
                        // Desktop fallback → just copy
                        try {
                            await navigator.clipboard.writeText(pageUrl);
                            showToast(copiedMessage);
                        } catch (err) {}
                    }
                }
            });
        });
    }

    // --- Contact Form → WhatsApp handler ---
    // Sofia's business WhatsApp number (international format, no "+" or leading 0)
    const WHATSAPP_NUMBER = '972584008292';

    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const nameField = document.getElementById('name');
            const phoneField = document.getElementById('phone');
            const name = nameField ? nameField.value.trim() : '';
            const phone = phoneField ? phoneField.value.trim() : '';

            if (!name || !phone) return; // native "required" should already block this

            // Detect page language from <html lang="..."> → serve the right message
            const lang = (document.documentElement.lang || 'he').toLowerCase();

            let message;
            if (lang.startsWith('en')) {
                message =
                    `Hello, my name is ${name}. ` +
                    `My phone number is ${phone}. ` +
                    `I would like you to get back to me about a property.`;
            } else {
                // Hebrew (default)
                message =
                    `שלום, שמי ${name}. ` +
                    `הטלפון שלי: ${phone}. ` +
                    `אשמח שתחזרו אליי לגבי נכס.`;
            }

            const whatsappUrl =
                `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

            // Open WhatsApp in a new tab so the user keeps the site open behind
            window.open(whatsappUrl, '_blank', 'noopener,noreferrer');

            // Reset the form so the UI feels responsive
            contactForm.reset();
        });
    }
});

// --- Property Image Carousel ---
let currentSlideIndex = 1;

function showSlide(n) {
    const slides = document.querySelectorAll('.carousel-slide');
    const thumbs = document.querySelectorAll('.carousel-thumbnails .thumb');
    const currentSlideNum = document.getElementById('currentSlideNum');
    
    if (slides.length === 0) return;

    if (n > slides.length) { currentSlideIndex = 1; }
    if (n < 1) { currentSlideIndex = slides.length; }

    slides.forEach(slide => {
        slide.classList.remove('active', 'zoomed');
        slide.style.transform = '';
    });
    thumbs.forEach(thumb => thumb.classList.remove('active'));

    slides[currentSlideIndex - 1].classList.add('active');
    if (thumbs.length > 0 && thumbs[currentSlideIndex - 1]) {
        thumbs[currentSlideIndex - 1].classList.add('active');
        try {
            const container = document.querySelector('.carousel-thumbnails');
            if (container) {
                const thumb = thumbs[currentSlideIndex - 1];
                const scrollPos = thumb.offsetLeft - (container.clientWidth / 2) + (thumb.clientWidth / 2);
                container.scrollTo({ left: scrollPos, behavior: 'smooth' });
            }
        } catch(e) {}
    }
    
    if (currentSlideNum) currentSlideNum.textContent = currentSlideIndex;
}

function changeSlide(n) {
    showSlide(currentSlideIndex += n);
}

function setSlide(n) {
    showSlide(currentSlideIndex = n);
}

// ===== PROPERTIES DATA (for wishlist modal) =====
const PROPERTIES_DATA = [
    { id: 'seaview',   title: 'קו ראשון לים | בניין בוטיק',              titleEn: 'First Line to the Sea | Boutique Building', location: 'רמת אביב',          locationEn: 'Ramat Aviv',           price: '₪ 5,600,000',      image: 'images/seaview/seaview-sale-cover.jpg', link: 'property-seaview.html',   linkEn: 'en-property-seaview.html' },
    { id: 'einstein',  title: 'דירת 5 חדרים בבלעדיות',                    titleEn: '5-Room Apartment (Exclusive)',               location: 'שכונת נופי ים',      locationEn: 'Nofei Yam',            price: '₪ 6,300,000',      image: 'images/einstein/einstein-cover.jpg',    link: 'property-einstein.html' },
    { id: 'duplex',    title: 'בלעדיות חדשה | דופלקס פנטהאוז נדיר',       titleEn: 'New Exclusive | Rare Duplex Penthouse',      location: 'תל אביב, בקרבת הים', locationEn: 'Tel Aviv, near the sea', price: '₪ 11,500,000',   image: 'images/bien2/duplex-cover.jpg',         link: 'property-duplex.html' },
    { id: 'sheket',    title: 'דירת 3.5 חדרים ענקית',                     titleEn: 'Huge 3.5-Room Apartment',                    location: 'סמוך לשדרת איינשטיין', locationEn: 'Near Einstein St.',  price: '₪ 4,500,000',      image: 'images/bien3/sheket-cover.jpg',         link: 'property-sheket.html' },
    { id: 'gimel',     title: 'פנטהאוז חדש לגמרי',                        titleEn: 'Brand New Penthouse',                        location: 'רמת אביב גימל',     locationEn: 'Ramat Aviv Gimel',     price: '₪ 13,500,000',     image: 'images/gimel/gimel-8.jpg',              link: 'property-gimel.html' },
    { id: 'penthouse', title: 'מיני פנטהאוז בגוש הגדול / נופי ים',       titleEn: 'Mini Penthouse | Sea Views',                  location: 'רמת אביב החדשה',    locationEn: 'New Ramat Aviv',       price: '₪ 8,750,000',      image: 'images/penthouse/penthouse1.jpg',       link: 'property-penthouse.html' },
    { id: 'chefetz',   title: 'ישה חפץ 16',                                titleEn: 'Yisha Chefetz 16',                            location: 'רמת אביב החדשה',    locationEn: 'New Ramat Aviv',       price: '₪ 10,000,000',     image: 'images/chefetz/chefetz-cover.jpg',      link: 'property-chefetz.html' },
    { id: 'yuval',     title: 'יובל נאמן 3',                               titleEn: 'Yuval Neeman 3',                              location: 'רמת אביב',          locationEn: 'Ramat Aviv',           price: '₪ 12,300,000',     image: 'images/yuval/yuval-cover.jpg',          link: 'property-yuval.html' },
    { id: 'lamed',     title: 'דירה חדשה בלמד החדשה',                     titleEn: 'New Apartment in Lamed',                      location: 'שכונת למד, תל אביב', locationEn: 'Lamed, Tel Aviv',     price: '₪ 12,500 / mo',    image: 'images/seaview/seaview-cover.jpg',      link: 'property-lamed.html' },
    { id: 'reshpon',   title: 'וילה יוקרתית ברשפון | בריכה וג\'קוזי',      titleEn: 'Luxury Villa in Reshpon | Pool & Jacuzzi',    location: 'רשפון',              locationEn: 'Reshpon',              price: '₪ 14,500,000',     image: 'images/reshpon/reshpon-cover.jpg',      link: 'property-reshpon.html' },
];

// ===== WISHLIST (localStorage) =====
function getWishlist() {
    try { return JSON.parse(localStorage.getItem('nadlan_wishlist') || '[]'); }
    catch { return []; }
}
function saveWishlist(list) {
    localStorage.setItem('nadlan_wishlist', JSON.stringify(list));
}
function updateWishlistUI() {
    const wishlist = getWishlist();
    const n = wishlist.length;
    // Header badge
    const badge = document.getElementById('wishlistCountBadge');
    if (badge) {
        badge.textContent = n > 0 ? n : '';
        badge.classList.toggle('has-items', n > 0);
    }
    // Drawer badge
    const drawerBadge = document.getElementById('menuDrawerWishlistCount');
    if (drawerBadge) {
        drawerBadge.textContent = n > 0 ? n : '';
        drawerBadge.classList.toggle('has-items', n > 0);
    }
    // All heart buttons on page
    document.querySelectorAll('.wishlist-heart').forEach(btn => {
        btn.classList.toggle('active', wishlist.includes(btn.dataset.propId));
    });
}
function toggleWishlistItem(propId) {
    const wishlist = getWishlist();
    const idx = wishlist.indexOf(propId);
    if (idx === -1) wishlist.push(propId);
    else wishlist.splice(idx, 1);
    saveWishlist(wishlist);
    updateWishlistUI();
}
let wishlistSlideIndex = 0;

function renderWishlistModal() {
    const wishlist = getWishlist();
    const body = document.getElementById('wishlistModalBody');
    if (!body) return;
    const isEn = (document.documentElement.lang || 'he').toLowerCase().startsWith('en');
    const pageDir = document.documentElement.dir || 'rtl';

    if (wishlist.length === 0) {
        wishlistSlideIndex = 0;
        body.innerHTML = isEn
            ? '<p style="text-align:center;padding:50px 20px;color:var(--color-text-light);font-size:1.05rem;line-height:1.8;">No saved properties yet.<br>Click ❤ on a property card to add one.</p>'
            : '<p style="text-align:center;padding:50px 20px;color:var(--color-text-light);font-size:1.05rem;line-height:1.8;">עדיין אין נכסים שמורים.<br>לחצו על ❤ על כרטיס נכס כדי להוסיף.</p>';
        return;
    }

    wishlistSlideIndex = Math.max(0, Math.min(wishlistSlideIndex, wishlist.length - 1));
    const count = wishlist.length;
    const showNav = count > 1;

    const slidesHTML = wishlist.map(id => {
        const p = PROPERTIES_DATA.find(x => x.id === id);
        if (!p) return '';
        const link        = isEn && p.linkEn     ? p.linkEn     : p.link;
        const title       = isEn && p.titleEn    ? p.titleEn    : p.title;
        const loc         = isEn && p.locationEn ? p.locationEn : p.location;
        const viewLabel   = isEn ? 'View property →' : '← צפה בנכס';
        const removeLabel = isEn ? 'Remove ✕' : 'הסר ✕';
        return `<a href="${link}" class="wishlist-slide">
            <div class="wishlist-slide-img" style="background-image:url('${p.image}')"></div>
            <div class="wishlist-slide-body" dir="${pageDir}">
                <h4 class="wishlist-slide-title">${title}</h4>
                <p class="wishlist-slide-location">📍 ${loc}</p>
                <p class="wishlist-slide-price">${p.price}</p>
                <div class="wishlist-slide-actions">
                    <span class="btn-wishlist-view">${viewLabel}</span>
                    <button class="btn-wishlist-remove" data-prop-id="${id}">${removeLabel}</button>
                </div>
            </div>
        </a>`;
    }).join('');

    const dotsHTML = wishlist.map((_, i) =>
        `<span class="wishlist-dot${i === wishlistSlideIndex ? ' active' : ''}" data-idx="${i}"></span>`
    ).join('');

    body.innerHTML = `
        <div class="wishlist-slider-wrap">
            <div class="wishlist-slides-track" id="wishlistTrack">${slidesHTML}</div>
            ${showNav ? `
            <button class="wishlist-nav-btn wishlist-prev-btn" id="wishlistPrev">‹</button>
            <button class="wishlist-nav-btn wishlist-next-btn" id="wishlistNext">›</button>` : ''}
        </div>
        <div class="wishlist-slider-footer">
            ${showNav ? `<div class="wishlist-dots" id="wishlistDots">${dotsHTML}</div>` : '<div></div>'}
            <span class="wishlist-counter" id="wishlistCounter">${wishlistSlideIndex + 1} / ${count}</span>
        </div>`;

    const track = document.getElementById('wishlistTrack');
    if (track) track.style.transform = `translateX(${-wishlistSlideIndex * 100}%)`;

    document.getElementById('wishlistPrev')?.addEventListener('click', e => {
        e.preventDefault(); e.stopPropagation();
        goToWishlistSlide(wishlistSlideIndex - 1);
    });
    document.getElementById('wishlistNext')?.addEventListener('click', e => {
        e.preventDefault(); e.stopPropagation();
        goToWishlistSlide(wishlistSlideIndex + 1);
    });

    body.querySelectorAll('.wishlist-dot').forEach(dot => {
        dot.addEventListener('click', () => goToWishlistSlide(parseInt(dot.dataset.idx)));
    });

    body.querySelectorAll('.btn-wishlist-remove').forEach(btn => {
        btn.addEventListener('click', e => {
            e.preventDefault(); e.stopPropagation();
            toggleWishlistItem(btn.dataset.propId);
            renderWishlistModal();
        });
    });

    // Touch swipe
    let touchStartX = 0;
    if (track) {
        track.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
        track.addEventListener('touchend', e => {
            const diff = touchStartX - e.changedTouches[0].clientX;
            if (Math.abs(diff) > 40) goToWishlistSlide(diff > 0 ? wishlistSlideIndex + 1 : wishlistSlideIndex - 1);
        }, { passive: true });
    }
}

function goToWishlistSlide(idx) {
    const wishlist = getWishlist();
    if (!wishlist.length) return;
    wishlistSlideIndex = ((idx % wishlist.length) + wishlist.length) % wishlist.length;
    const track = document.getElementById('wishlistTrack');
    if (track) track.style.transform = `translateX(${-wishlistSlideIndex * 100}%)`;
    document.querySelectorAll('#wishlistModalBody .wishlist-dot').forEach((dot, i) => {
        dot.classList.toggle('active', i === wishlistSlideIndex);
    });
    const counter = document.getElementById('wishlistCounter');
    if (counter) counter.textContent = `${wishlistSlideIndex + 1} / ${wishlist.length}`;
}
function openWishlistModal() {
    wishlistSlideIndex = 0;
    renderWishlistModal();
    const modal = document.getElementById('wishlistModal');
    if (modal) { modal.style.display = 'flex'; document.body.style.overflow = 'hidden'; }
}
function closeWishlistModal() {
    const modal = document.getElementById('wishlistModal');
    if (modal) { modal.style.display = 'none'; document.body.style.overflow = ''; }
}

// ===== FILTER SYSTEM =====
const BUDGET_MAX = 20000000;
const filterState = { type: 'all', rooms: 'all', surface: 'all', budgetMin: 0, budgetMax: BUDGET_MAX };

function formatPriceShort(v) {
    if (v === 0) return '0';
    const m = v / 1000000;
    return (m % 1 === 0 ? m : m.toFixed(1)) + 'M ₪';
}

function updatePriceSliderDisplay() {
    const minEl = document.getElementById('rangeMin');
    const maxEl = document.getElementById('rangeMax');
    if (!minEl || !maxEl) return;
    const min = parseInt(minEl.value);
    const max = parseInt(maxEl.value);
    const leftPct  = (min / BUDGET_MAX) * 100;
    const rightPct = ((BUDGET_MAX - max) / BUDGET_MAX) * 100;
    const fill = document.getElementById('rangeFill');
    if (fill) { fill.style.left = leftPct + '%'; fill.style.right = rightPct + '%'; }
    const display = document.getElementById('priceRangeDisplay');
    if (display) {
        if (min === 0 && max === BUDGET_MAX) display.textContent = 'הכל';
        else if (min === 0)              display.textContent = 'עד ' + formatPriceShort(max);
        else if (max === BUDGET_MAX)     display.textContent = 'מ-' + formatPriceShort(min);
        else                             display.textContent = formatPriceShort(min) + ' – ' + formatPriceShort(max);
    }
}

function applyFilters() {
    document.querySelectorAll('.property-link').forEach(card => {
        const type    = card.dataset.propType;
        const price   = parseInt(card.dataset.propPrice)   || 0;
        const rooms   = parseInt(card.dataset.propRooms)   || 0;
        const surface = parseInt(card.dataset.propSurface) || 0;
        let show = true;

        if (filterState.type !== 'all') {
            if (filterState.type === 'sale' && type !== 'sale' && type !== 'sold') show = false;
            if (filterState.type === 'rent' && type !== 'rent') show = false;
        }
        if (show && filterState.rooms !== 'all') {
            if (filterState.rooms === '1-3' && rooms > 3) show = false;
            if (filterState.rooms === '4-5' && (rooms < 4 || rooms > 5)) show = false;
            if (filterState.rooms === '6+'  && rooms < 6) show = false;
        }
        if (show && filterState.surface !== 'all') {
            if (filterState.surface === '0-120'   && surface > 120) show = false;
            if (filterState.surface === '120-200' && (surface < 120 || surface > 200)) show = false;
            if (filterState.surface === '200+'    && surface < 200) show = false;
        }
        if (show && type !== 'rent') {
            if (filterState.budgetMin > 0 && price < filterState.budgetMin) show = false;
            if (filterState.budgetMax < BUDGET_MAX && price > filterState.budgetMax) show = false;
        }
        card.style.display = show ? '' : 'none';
    });
    // No-results messages per grid
    [['saleGrid','saleNoResults'], ['rentGrid','rentNoResults']].forEach(([gId, nId]) => {
        const grid = document.getElementById(gId);
        const noRes = document.getElementById(nId);
        if (!grid || !noRes) return;
        const visible = grid.querySelectorAll('.property-link:not([style*="display: none"])');
        noRes.style.display = visible.length === 0 ? 'block' : 'none';
    });
    // Active filter count badge
    const countEl = document.getElementById('activeFilterCount');
    if (countEl) {
        const n = [
            filterState.type !== 'all',
            filterState.rooms !== 'all',
            filterState.surface !== 'all',
            filterState.budgetMin > 0 || filterState.budgetMax < BUDGET_MAX
        ].filter(Boolean).length;
        countEl.textContent = n;
        countEl.style.display = n > 0 ? 'inline-flex' : 'none';
    }
}

// ===== MENU DRAWER =====
function openMenuDrawer() {
    const drawer = document.getElementById('menuDrawer');
    const btn = document.getElementById('menuHamburgerBtn');
    if (!drawer) return;
    drawer.classList.add('is-open');
    drawer.setAttribute('aria-hidden', 'false');
    if (btn) { btn.classList.add('is-open'); btn.setAttribute('aria-expanded', 'true'); }
    document.body.classList.add('menu-open');
}
function closeMenuDrawer() {
    const drawer = document.getElementById('menuDrawer');
    const btn = document.getElementById('menuHamburgerBtn');
    if (!drawer) return;
    drawer.classList.remove('is-open');
    drawer.setAttribute('aria-hidden', 'true');
    if (btn) { btn.classList.remove('is-open'); btn.setAttribute('aria-expanded', 'false'); }
    document.body.classList.remove('menu-open');
}

// ===== BIND ALL INTERACTIONS =====
document.addEventListener('DOMContentLoaded', () => {
    // Filter panel toggle
    const filterToggleBtn = document.getElementById('filterToggleBtn');
    const filterPanel = document.getElementById('filterPanel');
    if (filterToggleBtn && filterPanel) {
        filterToggleBtn.addEventListener('click', () => {
            const isOpen = filterPanel.classList.toggle('open');
            filterToggleBtn.classList.toggle('active', isOpen);
            filterToggleBtn.setAttribute('aria-expanded', String(isOpen));
        });
    }
    // Filter chips
    document.querySelectorAll('.filter-chip').forEach(chip => {
        chip.addEventListener('click', () => {
            const key = chip.dataset.filter;
            const value = chip.dataset.value;
            document.querySelectorAll(`.filter-chip[data-filter="${key}"]`).forEach(c => c.classList.remove('active'));
            chip.classList.add('active');
            filterState[key] = value;
            applyFilters();
        });
    });
    // Filter reset
    document.getElementById('filterResetBtn')?.addEventListener('click', () => {
        filterState.type = 'all'; filterState.rooms = 'all'; filterState.surface = 'all';
        filterState.budgetMin = 0; filterState.budgetMax = BUDGET_MAX;
        document.querySelectorAll('.filter-chip').forEach(chip => {
            chip.classList.toggle('active', chip.dataset.value === 'all');
        });
        const minEl = document.getElementById('rangeMin');
        const maxEl = document.getElementById('rangeMax');
        if (minEl) minEl.value = 0;
        if (maxEl) maxEl.value = BUDGET_MAX;
        updatePriceSliderDisplay();
        applyFilters();
    });

    // Price range slider
    ['rangeMin', 'rangeMax'].forEach(id => {
        document.getElementById(id)?.addEventListener('input', function () {
            const minEl = document.getElementById('rangeMin');
            const maxEl = document.getElementById('rangeMax');
            if (!minEl || !maxEl) return;
            let min = parseInt(minEl.value), max = parseInt(maxEl.value);
            if (min > max) { if (id === 'rangeMin') { min = max; minEl.value = min; } else { max = min; maxEl.value = max; } }
            filterState.budgetMin = min;
            filterState.budgetMax = max;
            updatePriceSliderDisplay();
            applyFilters();
        });
    });
    updatePriceSliderDisplay();

    // Wishlist hearts on cards
    document.querySelectorAll('.wishlist-heart').forEach(btn => {
        btn.addEventListener('click', e => {
            e.preventDefault();
            e.stopPropagation();
            toggleWishlistItem(btn.dataset.propId);
        });
    });
    // Wishlist header button
    document.getElementById('wishlistHeaderBtn')?.addEventListener('click', openWishlistModal);
    document.getElementById('wishlistModalClose')?.addEventListener('click', closeWishlistModal);
    document.getElementById('wishlistModalOverlay')?.addEventListener('click', closeWishlistModal);

    // Menu drawer open/close
    document.getElementById('menuHamburgerBtn')?.addEventListener('click', openMenuDrawer);
    document.getElementById('menuDrawerClose')?.addEventListener('click', closeMenuDrawer);
    document.getElementById('menuDrawerOverlay')?.addEventListener('click', closeMenuDrawer);
    document.querySelectorAll('[data-close-menu]').forEach(el => {
        el.addEventListener('click', () => setTimeout(closeMenuDrawer, 100));
    });
    // ESC closes drawer/modal
    document.addEventListener('keydown', e => {
        if (e.key === 'Escape') {
            closeMenuDrawer();
            closeWishlistModal();
        }
    });
    // Open wishlist from drawer
    document.getElementById('menuOpenWishlist')?.addEventListener('click', () => {
        closeMenuDrawer();
        setTimeout(openWishlistModal, 300);
    });

    // Initial state
    updateWishlistUI();
});

// Initialize Carousel on Load
document.addEventListener('DOMContentLoaded', () => {
    const totalSlideNum = document.getElementById('totalSlideNum');
    const slides = document.querySelectorAll('.carousel-slide');
    if (totalSlideNum && slides.length > 0) {
        totalSlideNum.textContent = slides.length;
        showSlide(currentSlideIndex);
    }
    
    // Image Zoom functionality
    const carouselMain = document.querySelector('.carousel-main');
    if (carouselMain) {
        carouselMain.addEventListener('dblclick', function(e) {
            if (e.target.closest('.carousel-arrow') || e.target.closest('.carousel-counter')) {
                return;
            }
            const activeSlide = document.querySelector('.carousel-slide.active');
            if (!activeSlide) return;
            
            if (activeSlide.classList.contains('zoomed')) {
                activeSlide.classList.remove('zoomed');
                activeSlide.style.transform = '';
            } else {
                activeSlide.classList.add('zoomed');
                activeSlide.style.transform = 'scale(2.5)';
                
                const rect = carouselMain.getBoundingClientRect();
                const x = ((e.clientX - rect.left) / rect.width) * 100;
                const y = ((e.clientY - rect.top) / rect.height) * 100;
                activeSlide.style.transformOrigin = `${x}% ${y}%`;
            }
        });
        
        carouselMain.addEventListener('mousemove', function(e) {
            const activeSlide = document.querySelector('.carousel-slide.zoomed');
            if (activeSlide) {
                const rect = carouselMain.getBoundingClientRect();
                const x = ((e.clientX - rect.left) / rect.width) * 100;
                const y = ((e.clientY - rect.top) / rect.height) * 100;
                activeSlide.style.transformOrigin = `${x}% ${y}%`;
            }
        });
        
        carouselMain.addEventListener('mouseleave', function() {
            const activeSlide = document.querySelector('.carousel-slide.zoomed');
            if (activeSlide) {
                activeSlide.classList.remove('zoomed');
                activeSlide.style.transform = '';
            }
        });
    }
});
