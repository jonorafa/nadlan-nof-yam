---
name: map-location
description: Place or correct a property's pin on the site's interactive map from a Google Maps location. Use whenever the user sends a Google Maps reference — a screenshot of the map with a red pin, a maps URL, a plus code, or a street address — for one of the listings, even if they only say "voici la loca" / "הנה המיקום" / "here is the location" without naming the map explicitly.
---

# Placing a property on the interactive map

The homepage map (`#property-map`) is driven entirely by the `properties` array in
`js/map.js`. Each entry renders one clickable pin whose popup links to the property page.
Adding a listing elsewhere on the site does **not** put it on the map — that only happens
here.

## What the user sends, and how to get coordinates from it

The user usually sends a Google Maps **screenshot** with a red pin. Read it for these, in
order of reliability:

### 1. Plus code (most reliable — exact to ~14 m)

Shown in the Maps sidebar, e.g. `4Q8Q+P5 Tel-Aviv`. Decode it (Open Location Code):

Alphabet, index 0-19: `2 3 4 5 6 7 8 9 C F G H J M P Q R V W X`

A short code drops the first 4 characters; recover them from the locality. For **Tel Aviv
(~32.08, 34.78) the prefix is `8G4P`**, so `4Q8Q+P5` → full code `8G4P4Q8Q+P5`.

Then accumulate, latitude first in each pair, starting from `lat = -90`, `lng = -180`:

| Pair | Multiplier |
|------|-----------|
| 1    | 20°       |
| 2    | 1°        |
| 3    | 0.05°     |
| 4    | 0.0025°   |
| 5 (after `+`) | 0.000125° |

Worked example — `8G4P4Q8Q+P5`:
- `8G` → lat `6×20−90 = 30`, lng `10×20−180 = 20`
- `4P` → lat `+2×1 = 32`, lng `+14×1 = 34`
- `4Q` → lat `+2×0.05 = 32.10`, lng `+15×0.05 = 34.75`
- `8Q` → lat `+6×0.0025 = 32.115`, lng `+15×0.0025 = 34.7875`
- `P5` → lat `+14×0.000125 = 32.11675`, lng `+3×0.000125 = 34.787875`

Add half a cell (`0.0000625`) to centre it → `[32.1168, 34.7879]`. Round to 4 decimals.

### 2. Maps URL

`@32.1168,34.7879,17z` → the two numbers after `@` are lat,lng.
`!3d32.1168!4d34.7879` → `3d` is lat, `4d` is lng.
A shortened `maps.app.goo.gl` link has to be opened to reveal these.

### 3. Street address only

No exact fix available. Derive it from a neighbour already in `js/map.js` on the same or an
adjacent street, then **say in your reply that the pin is approximate** and offer to refine
it if they send the plus code.

## Editing `js/map.js`

Add to (or update in) the `properties` array:

```js
{
    title: 'אמיר גלבוע 7',           // must match the card + page H1 exactly
    location: 'רמת אביב החדשה',
    price: '₪ 8,800,000',
    status: 'sale',                  // 'sale' | 'rent' | 'sold'
    badge: 'למכירה',                 // 'למכירה' | 'בלעדיות' | 'להשכרה' | 'נמכר'
    image: 'images/bien5/amir-cover.jpg',
    link: 'property-amir.html',      // the pin's popup links here
    // Amir Gilboa St 7 - from Google Maps plus code 4Q8Q+P5 Tel-Aviv
    coords: [32.1168, 34.7879]
},
```

Always leave a comment above `coords` recording where the fix came from (plus code, URL,
or "approximate"). It is the only way to tell a surveyed pin from a guessed one later.

The agency office is a **separate** `agencyLocation` object below the array — never add a
listing there.

## Sanity checks before you finish

These have all gone wrong before on this site:

- **Not in the sea.** Ramat Aviv / Nofei Yam listings sit around `lat 32.11–32.12`,
  `lng 34.786–34.795`. A longitude below ~34.78 at this latitude is water. A duplex
  penthouse once shipped with a pin offshore.
- **Coordinates match the title.** A pin copied from another listing's entry keeps that
  listing's coords and title. Check both against the address the user sent.
- **Plausible against neighbours.** Compare with nearby entries — e.g. the office at
  אמיר גלבוע 12 is `[32.1163, 34.7877]`, so number 7 landing ~60 m away is right; landing
  1 km away is not.

## Verify in the browser

`js/map.js` is not exercised by anything except the live page, so check it:

```bash
npx serve -l 3000 .
```

Then load `http://localhost:3000/index.html` and confirm via the DOM (screenshots of the
map are unreliable in the preview pane):

```js
// pin count should equal properties.length + 1 for the office
document.querySelectorAll('#property-map .leaflet-marker-pane > div').length
```

Click the new pin and read `.leaflet-popup-content` to confirm the title, price and link.
Fetch with `{cache:'no-store'}` if you suspect a stale `map.js`.
