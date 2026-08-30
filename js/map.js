/* =====================================================================
   Interactive property map — Nadlan Nof Yam
   --------------------------------------------------------------------
   Uses Leaflet + OpenStreetMap (free, no API key required).
   Each property below has a rough coordinate — fine-tune when you have
   the exact address of each listing.
   ===================================================================== */

(function () {
    const mapEl = document.getElementById('property-map');
    if (!mapEl || typeof L === 'undefined') return;

    // Center: heart of Nofei Yam neighborhood (where ~90% of listings are located)
    // Coordinates pulled directly from Google Maps for the neighborhood center.
    const MAP_CENTER = [32.1143, 34.7852];
    const DEFAULT_ZOOM = 15;

    // -----------------------------------------------------------------
    // Property data. Adjust `coords` per listing when you have the
    // exact street address (you can get coords from Google Maps by
    // right-clicking a spot → "What's here?").
    // -----------------------------------------------------------------
    const properties = [
        {
            title: 'קו ראשון לים | בניין בוטיק',
            location: 'רמת אביב',
            price: '₪ 5,600,000',
            status: 'sale',
            badge: 'בלעדיות',
            image: 'images/seaview/seaview-cover.jpg',
            link: 'property-seaview.html',
            // First line to the sea, Ramat Aviv (Nofei Yam area)
            coords: [32.1150, 34.7870]
        },
        {
            title: 'פנטהאוז חדש לגמרי',
            location: 'רמת אביב גימל',
            price: '₪ 13,500,000',
            status: 'sale',        // 'sale' | 'rent' | 'sold'
            badge: 'למכירה',
            image: 'images/gimel/gimel-8.jpg',
            link: 'property-gimel.html',
            coords: [32.1168, 34.7948]
        },
        {
            title: 'מיני פנטהאוז בגוש הגדול / נופי ים',
            location: 'רמת אביב החדשה',
            price: '₪ 8,750,000',
            status: 'sale',
            badge: 'למכירה',
            image: 'images/penthouse/penthouse1.jpg',
            link: 'property-penthouse.html',
            // Exact coordinates: 32°06'46.8"N 34°47'14.2"E
            coords: [32.1130, 34.7873]
        },
        {
            title: 'ישה חפץ 16',
            location: 'רמת אביב החדשה',
            price: '₪ 10,000,000',
            status: 'sale',
            badge: 'למכירה',
            image: 'images/chefetz/chefetz-cover.jpg',
            link: 'property-chefetz.html',
            // Exact coordinates: 32°07'00.7"N 34°47'21.1"E
            coords: [32.1169, 34.7892]
        },
        {
            title: 'יובל נאמן 3',
            location: 'רמת אביב',
            price: '₪ 12,300,000',
            status: 'sold',
            badge: 'נמכר',
            image: 'images/yuval/yuval-cover.jpg',
            link: 'property-yuval.html',
            // Prof Yuval Ne'eman St 3 - Exact coordinates: 32°06'45.7"N 34°47'11.7"E
            coords: [32.1127, 34.7865]
        },
        {
            title: 'דירה חדשה בלמד החדשה',
            location: 'שכונת למד, תל אביב',
            price: '₪ 12,500 / חודש',
            status: 'rent',
            badge: 'להשכרה',
            image: 'images/lamed/lamed-cover.jpg',
            link: 'property-lamed.html',
            // Exact coordinates: 32°06'38.0"N 34°47'16.8"E
            coords: [32.1106, 34.7880]
        }
    ];

    // Agency location (separate from properties)
    const agencyLocation = {
        title: 'משרד תיווך נוף ים',
        location: 'אמיר גלבוע 12',
        badge: 'משרד',
        // Exact coordinates: 32°06'58.7"N 34°47'15.8"E
        coords: [32.1163, 34.7877]
    };

    // -----------------------------------------------------------------
    // Initialize map
    // -----------------------------------------------------------------
    const map = L.map('property-map', {
        center: MAP_CENTER,
        zoom: DEFAULT_ZOOM,
        scrollWheelZoom: false,   // page scroll instead of zoom
        touchZoom: false,         // two-finger gesture won't hijack page scroll
        dragging: true,
        zoomControl: true,
        tap: false
    });

    // On mobile, require one-finger drag only; pinch-zoom is handled via +/- buttons.
    // On desktop, Ctrl/Cmd + scroll zooms; plain scroll passes through to the page.
    map.scrollWheelZoom.disable();
    if (map.touchZoom) map.touchZoom.disable();

    // Desktop: allow Ctrl/Cmd + wheel to zoom
    mapEl.addEventListener('wheel', function (e) {
        if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            const delta = e.deltaY > 0 ? -1 : 1;
            map.setZoom(map.getZoom() + delta);
        }
        // otherwise: let the page scroll naturally
    }, { passive: false });

    // Discoverability hint overlay
    const hint = document.createElement('div');
    hint.className = 'map-hint';
    hint.innerHTML = '<span class="map-hint__desktop">השתמש ב-Ctrl + גלילה לזום • או בכפתורי + / −</span>' +
                     '<span class="map-hint__mobile">השתמש בכפתורי + / − לזום</span>';
    mapEl.appendChild(hint);

    // Fade hint in on hover (desktop) / first touch (mobile), auto-hide after a few seconds
    let hintTimer;
    function showHint() {
        hint.classList.add('is-visible');
        clearTimeout(hintTimer);
        hintTimer = setTimeout(() => hint.classList.remove('is-visible'), 2500);
    }
    mapEl.addEventListener('mouseenter', showHint);
    mapEl.addEventListener('touchstart', showHint, { passive: true });

    // CartoDB Voyager tiles — free, commercial-friendly, reliable in production.
    // Using the official "rastertiles/voyager" endpoint that's guaranteed to work.
    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 20
    }).addTo(map);

    // -----------------------------------------------------------------
    // Custom marker icon factory (colored pin based on listing status)
    // -----------------------------------------------------------------
    function buildIcon(status) {
        const modifier = status === 'rent' ? ' property-marker--rent'
                       : status === 'sold' ? ' property-marker--sold'
                       : '';
        return L.divIcon({
            className: '',
            html: `<div class="property-marker${modifier}"></div>`,
            iconSize: [32, 32],
            iconAnchor: [16, 32],   // tip of the pin touches the coord
            popupAnchor: [0, -30]
        });
    }

    // -----------------------------------------------------------------
    // Popup template (property card)
    // -----------------------------------------------------------------
    function buildPopup(p) {
        const badgeClass = p.status === 'rent' ? 'map-popup__badge--rent'
                         : p.status === 'sold' ? 'map-popup__badge--sold'
                         : '';
        return `
            <div class="map-popup">
                <div class="map-popup__image" style="background-image: url('${p.image}');"></div>
                <div class="map-popup__body">
                    <span class="map-popup__badge ${badgeClass}">${p.badge}</span>
                    <h3 class="map-popup__title">${p.title}</h3>
                    <p class="map-popup__location">${p.location}</p>
                    <p class="map-popup__price">${p.price}</p>
                    <a href="${p.link}" class="map-popup__link">לצפייה בנכס ←</a>
                </div>
            </div>
        `;
    }

    // -----------------------------------------------------------------
    // Drop markers
    // -----------------------------------------------------------------
    // We intentionally keep the map centered on Nofei Yam (where ~90% of
    // listings are) and let the user pan/zoom to find the few outliers
    // (e.g., central Tel Aviv). No fitBounds — it zoomed too far out.
    properties.forEach(p => {
        L.marker(p.coords, { icon: buildIcon(p.status) })
            .addTo(map)
            .bindPopup(buildPopup(p), { closeButton: true, autoPan: true });
    });

    // -----------------------------------------------------------------
    // Agency marker (office location)
    // -----------------------------------------------------------------
    const agencyIcon = L.divIcon({
        className: '',
        html: `<div class="agency-marker"></div>`,
        iconSize: [40, 40],
        iconAnchor: [20, 40],
        popupAnchor: [0, -35]
    });

    const agencyPopup = `
        <div class="map-popup">
            <div class="map-popup__body">
                <h3 class="map-popup__title" style="margin-bottom: 10px;">${agencyLocation.title}</h3>
                <p class="map-popup__location">${agencyLocation.location}</p>
                <p style="color: var(--color-secondary); font-weight: 600; margin-top: 10px;">📞 058-400-8292</p>
                <p style="color: var(--color-secondary); font-weight: 600;">📞 050-217-5633</p>
            </div>
        </div>
    `;

    L.marker(agencyLocation.coords, { icon: agencyIcon })
        .addTo(map)
        .bindPopup(agencyPopup, { closeButton: true, autoPan: true });
})();
