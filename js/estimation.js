// Property valuation wizard. Shared by estimation.html (HE) and en-estimation.html (EN) —
// both pages use the same element ids, only the visible label text differs per language.
// The pricing model itself lives in pricing-config.json so it can be tuned without touching code.

// Browsers restore the previous scroll position on this page (e.g. clicking the nav
// link while already on it, or coming back via history) and land straight on the wizard
// with the hero title scrolled off-screen. Force the top on every load.
if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
}
window.scrollTo(0, 0);

document.addEventListener('DOMContentLoaded', () => {
    window.scrollTo(0, 0);

    const wizard = document.getElementById('estimWizard');
    if (!wizard) return; // not on this page

    const isEn = (document.documentElement.lang || 'he').toLowerCase().startsWith('en');
    const TOTAL_STEPS = 4;
    let currentStep = 1;
    let pricingConfig = null;

    const state = {
        nature: 'sale',
        type: null,
        neighborhood: null,
        street: '',
        houseNumber: '',
        floor: 0,
        buildingFloors: 0,
        surface: null,
        rooms: 3,
        bathrooms: 1,
        year: null,
        elevator: false,
        balcony: false,
        balconySize: null,
        parking: false,
        parkingCount: 1,
        mamad: false,
        renovated: false,
        highlights: [],
        name: '',
        phone: '',
        email: ''
    };

    fetch('pricing-config.json')
        .then(r => r.json())
        .then(cfg => { pricingConfig = cfg; })
        .catch(() => { pricingConfig = null; });

    // ---------- Stepper UI ----------
    function renderStepper() {
        document.querySelectorAll('.estim-stepper-dot').forEach(dot => {
            const n = parseInt(dot.dataset.step, 10);
            dot.classList.toggle('active', n === currentStep);
            dot.classList.toggle('done', n < currentStep);
            dot.textContent = n < currentStep ? '✓' : n;
        });
        document.querySelectorAll('.estim-stepper-line').forEach(line => {
            const n = parseInt(line.dataset.afterStep, 10);
            line.classList.toggle('done', n < currentStep);
        });
    }

    function showStep(n, scroll = true) {
        document.querySelectorAll('.estim-step').forEach(step => {
            step.classList.toggle('active', parseInt(step.dataset.step, 10) === n);
        });
        currentStep = n;
        renderStepper();
        if (scroll) {
            wizard.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }

    // ---------- Toggle / choice helpers ----------
    function wireToggleGroup(containerId, onChange) {
        const container = document.getElementById(containerId);
        if (!container) return;
        container.querySelectorAll('.estim-chip, .estim-choice-card').forEach(el => {
            el.addEventListener('click', () => {
                container.querySelectorAll('.estim-chip, .estim-choice-card').forEach(x => x.classList.remove('active'));
                el.classList.add('active');
                onChange(el.dataset.value);
            });
        });
    }

    function wireMultiToggleGroup(containerId, onChange) {
        const container = document.getElementById(containerId);
        if (!container) return;
        container.querySelectorAll('.estim-chip, .estim-choice-card').forEach(el => {
            el.addEventListener('click', () => {
                el.classList.toggle('active');
                const values = Array.from(container.querySelectorAll('.active')).map(x => x.dataset.value);
                onChange(values);
            });
        });
    }

    function wireYesNo(containerId, onChange) {
        const container = document.getElementById(containerId);
        if (!container) return;
        container.querySelectorAll('.estim-chip').forEach(el => {
            el.addEventListener('click', () => {
                container.querySelectorAll('.estim-chip').forEach(x => x.classList.remove('active'));
                el.classList.add('active');
                onChange(el.dataset.value === 'yes');
            });
        });
    }

    function wireStepperInput(id, min, max, onChange, initial) {
        const wrap = document.getElementById(id);
        if (!wrap) return;
        const input = wrap.querySelector('input');
        const dec = wrap.querySelector('[data-action="dec"]');
        const inc = wrap.querySelector('[data-action="inc"]');
        input.value = initial;
        const clamp = v => Math.max(min, Math.min(max, v));
        const set = v => { input.value = clamp(v); onChange(parseInt(input.value, 10)); };
        dec.addEventListener('click', () => set((parseInt(input.value, 10) || 0) - 1));
        inc.addEventListener('click', () => set((parseInt(input.value, 10) || 0) + 1));
        input.addEventListener('input', () => set(parseInt(input.value, 10) || 0));
    }

    function showConditional(id, show) {
        const el = document.getElementById(id);
        if (el) el.style.display = show ? '' : 'none';
    }

    // ---------- Step 1 ----------
    wireToggleGroup('estimNatureChips', v => { state.nature = v; });
    wireToggleGroup('estimTypeChoices', v => { state.type = v; });

    const neighborhoodSelect = document.getElementById('estimNeighborhood');
    if (neighborhoodSelect) {
        neighborhoodSelect.addEventListener('change', () => { state.neighborhood = neighborhoodSelect.value; });
    }
    const streetInput = document.getElementById('estimStreet');
    if (streetInput) streetInput.addEventListener('input', () => { state.street = streetInput.value; });
    const houseNumberInput = document.getElementById('estimHouseNumber');
    if (houseNumberInput) houseNumberInput.addEventListener('input', () => { state.houseNumber = houseNumberInput.value; });

    wireStepperInput('estimFloorStepper', 0, 60, v => { state.floor = v; }, 0);
    wireStepperInput('estimBuildingFloorsStepper', 0, 60, v => { state.buildingFloors = v; }, 0);

    // ---------- Step 2 ----------
    const surfaceInput = document.getElementById('estimSurface');
    if (surfaceInput) surfaceInput.addEventListener('input', () => { state.surface = parseFloat(surfaceInput.value) || null; });

    wireStepperInput('estimRoomsStepper', 1, 20, v => { state.rooms = v; }, 3);
    wireStepperInput('estimBathroomsStepper', 0, 10, v => { state.bathrooms = v; }, 1);

    const yearInput = document.getElementById('estimYear');
    if (yearInput) yearInput.addEventListener('input', () => { state.year = parseInt(yearInput.value, 10) || null; });

    wireYesNo('estimElevatorChips', v => { state.elevator = v; });
    wireYesNo('estimMamadChips', v => { state.mamad = v; });
    wireYesNo('estimRenovatedChips', v => { state.renovated = v; });

    wireYesNo('estimBalconyChips', v => {
        state.balcony = v;
        showConditional('estimBalconySizeGroup', v);
    });
    const balconySizeInput = document.getElementById('estimBalconySize');
    if (balconySizeInput) balconySizeInput.addEventListener('input', () => { state.balconySize = parseFloat(balconySizeInput.value) || null; });

    wireYesNo('estimParkingChips', v => {
        state.parking = v;
        showConditional('estimParkingCountGroup', v);
    });
    wireStepperInput('estimParkingCountStepper', 1, 6, v => { state.parkingCount = v; }, 1);

    // ---------- Step 3 ----------
    wireMultiToggleGroup('estimHighlightsGrid', values => { state.highlights = values; });

    // ---------- Step 4 ----------
    const nameInput = document.getElementById('estimName');
    if (nameInput) nameInput.addEventListener('input', () => { state.name = nameInput.value; });
    const phoneInput = document.getElementById('estimPhone');
    if (phoneInput) phoneInput.addEventListener('input', () => { state.phone = phoneInput.value; });
    const emailInput = document.getElementById('estimEmail');
    if (emailInput) emailInput.addEventListener('input', () => { state.email = emailInput.value; });

    // ---------- Navigation ----------
    function validateStep(n) {
        const errorEl = document.querySelector(`.estim-step[data-step="${n}"] .estim-error-msg`);
        let msg = '';
        if (n === 1) {
            if (!state.type) msg = isEn ? 'Please choose a property type.' : 'נא לבחור סוג נכס.';
            else if (!state.street) msg = isEn ? 'Please enter the street.' : 'נא להזין רחוב.';
        } else if (n === 2) {
            if (!state.surface || state.surface <= 0) msg = isEn ? 'Living area (sqm) is required.' : 'נא להזין שטח בנוי (מ"ר) - שדה חובה.';
        } else if (n === 4) {
            if (!state.name || !state.phone) msg = isEn ? 'Name and phone are required.' : 'נא להזין שם וטלפון.';
            const consent = document.getElementById('estimConsent');
            if (!msg && consent && !consent.checked) msg = isEn ? 'Please confirm you agree to be contacted.' : 'נא לאשר את ההסכמה ליצירת קשר.';
        }
        if (errorEl) {
            errorEl.textContent = msg;
            errorEl.classList.toggle('visible', !!msg);
        }
        return !msg;
    }

    document.querySelectorAll('.estim-btn-next').forEach(btn => {
        btn.addEventListener('click', () => {
            const step = parseInt(btn.closest('.estim-step').dataset.step, 10);
            if (!validateStep(step)) return;
            if (step < TOTAL_STEPS) {
                showStep(step + 1);
            } else {
                calculateAndShowResult();
            }
        });
    });

    document.querySelectorAll('.estim-btn-back').forEach(btn => {
        btn.addEventListener('click', () => {
            const step = parseInt(btn.closest('.estim-step').dataset.step, 10);
            if (step > 1) showStep(step - 1);
        });
    });

    // ---------- Calculation ----------
    function computePrice() {
        if (!pricingConfig) return null;
        const cfg = pricingConfig;
        const neighborhoodKey = state.neighborhood && cfg.neighborhoods[state.neighborhood]
            ? state.neighborhood
            : 'אחר';
        let price = cfg.neighborhoods[neighborhoodKey].pricePerSqm * state.surface;

        price *= cfg.propertyTypeCoefficient[state.type] || 1;

        if (state.floor === 0) {
            price *= cfg.coefficients.groundFloor.multiplier;
        } else if (state.floor >= cfg.coefficients.highFloor.minFloor) {
            price *= cfg.coefficients.highFloor.multiplier;
        }

        if (state.elevator) price *= cfg.coefficients.elevator;
        if (state.renovated) price *= cfg.coefficients.renovated;
        if (state.mamad) price *= cfg.coefficients.safeRoom;
        if (state.balcony) price *= cfg.coefficients.balcony;
        if (state.parking) {
            price *= cfg.coefficients.parking;
            if (state.parkingCount > 1) {
                price *= Math.pow(cfg.coefficients.extraParkingSpot, state.parkingCount - 1);
            }
        }
        if (state.highlights.includes('seaview')) price *= cfg.coefficients.seaView;
        if (state.highlights.includes('quiet')) price *= cfg.coefficients.quiet;
        if (state.highlights.includes('bright')) price *= cfg.coefficients.bright;

        if (state.year) {
            if (state.year >= cfg.coefficients.newBuilding.afterYear) {
                price *= cfg.coefficients.newBuilding.multiplier;
            } else if (state.year <= cfg.coefficients.oldBuilding.beforeYear) {
                price *= cfg.coefficients.oldBuilding.multiplier;
            }
        }

        const spread = cfg.rangeSpread;
        return {
            low: Math.round((price * (1 - spread)) / 1000) * 1000,
            high: Math.round((price * (1 + spread)) / 1000) * 1000
        };
    }

    function formatILS(n) {
        return '₪ ' + Math.round(n).toLocaleString('he-IL');
    }

    function calculateAndShowResult() {
        const result = computePrice();
        document.querySelectorAll('.estim-step').forEach(s => s.classList.remove('active'));
        document.querySelector('.estim-stepper').style.display = 'none';

        const resultEl = document.getElementById('estimResult');
        resultEl.classList.add('active');

        const addressLine = document.getElementById('estimResultAddress');
        if (addressLine) {
            const parts = [state.street, state.houseNumber].filter(Boolean).join(' ');
            addressLine.textContent = parts || (isEn ? 'Your property' : 'הנכס שלכם');
        }

        const lowEl = document.getElementById('estimResultLow');
        const highEl = document.getElementById('estimResultHigh');
        if (result) {
            lowEl.textContent = formatILS(result.low);
            highEl.textContent = formatILS(result.high);
        } else {
            lowEl.textContent = '—';
            highEl.textContent = '—';
        }

        const propertyLine = [
            state.type,
            state.surface ? state.surface + ' מ"ר' : null,
            state.rooms ? state.rooms + ' חדרים' : null
        ].filter(Boolean).join(' | ');

        const waMsg = isEn
            ? `Hi, I'd like to schedule a meeting about my property valuation.\n${propertyLine}\nAddress: ${state.street} ${state.houseNumber}\nEstimated range: ${result ? formatILS(result.low) + ' - ' + formatILS(result.high) : ''}`
            : `שלום, אשמח לקבוע פגישה לגבי הערכת השווי של הנכס שלי.\n${propertyLine}\nכתובת: ${state.street} ${state.houseNumber}\nטווח משוער: ${result ? formatILS(result.low) + ' - ' + formatILS(result.high) : ''}`;

        const waLink = document.getElementById('estimWhatsappBtn');
        if (waLink) waLink.href = 'https://wa.me/972584008292?text=' + encodeURIComponent(waMsg);

        const contactBtn = document.getElementById('estimContactRequestBtn');
        if (contactBtn) {
            contactBtn.addEventListener('click', () => {
                // TODO: replace with a POST to the n8n webhook once it's ready.
                // For now this opens a pre-filled email to the agency with the full form data.
                const subject = isEn ? 'Property valuation request' : 'בקשה ליצירת קשר - הערכת שווי';
                const body = [
                    `${isEn ? 'Name' : 'שם'}: ${state.name}`,
                    `${isEn ? 'Phone' : 'טלפון'}: ${state.phone}`,
                    `${isEn ? 'Email' : 'אימייל'}: ${state.email}`,
                    `${isEn ? 'Nature' : 'סוג עסקה'}: ${state.nature}`,
                    `${isEn ? 'Type' : 'סוג נכס'}: ${state.type}`,
                    `${isEn ? 'Address' : 'כתובת'}: ${state.street} ${state.houseNumber}, ${state.neighborhood || ''}`,
                    `${isEn ? 'Floor' : 'קומה'}: ${state.floor} / ${state.buildingFloors}`,
                    `${isEn ? 'Surface' : 'שטח'}: ${state.surface} מ"ר`,
                    `${isEn ? 'Rooms' : 'חדרים'}: ${state.rooms}`,
                    `${isEn ? 'Bathrooms' : 'חדרי אמבטיה'}: ${state.bathrooms}`,
                    `${isEn ? 'Year built' : 'שנת בנייה'}: ${state.year || '-'}`,
                    `${isEn ? 'Elevator' : 'מעלית'}: ${state.elevator ? 'כן' : 'לא'}`,
                    `${isEn ? 'Balcony' : 'מרפסת'}: ${state.balcony ? (state.balconySize || '') + ' מ"ר' : 'לא'}`,
                    `${isEn ? 'Parking' : 'חניה'}: ${state.parking ? state.parkingCount : 'לא'}`,
                    `${isEn ? 'Safe room' : 'ממ"ד'}: ${state.mamad ? 'כן' : 'לא'}`,
                    `${isEn ? 'Renovated' : 'משופצת'}: ${state.renovated ? 'כן' : 'לא'}`,
                    `${isEn ? 'Highlights' : 'יתרונות'}: ${state.highlights.join(', ')}`,
                    `${isEn ? 'Estimated range' : 'טווח משוער'}: ${result ? formatILS(result.low) + ' - ' + formatILS(result.high) : ''}`
                ].join('\n');
                window.location.href = `mailto:sophianadlan@gmail.com,sigalnadlan@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

                const thankyou = document.getElementById('estimThankyou');
                if (thankyou) thankyou.classList.add('visible');
            }, { once: true });
        }
    }

    showStep(1, false);
});
