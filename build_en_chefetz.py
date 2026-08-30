import re

with open('en-property-chefetz.html', 'r', encoding='utf-8') as f:
    text = f.read()

text = text.replace('<title>Luxury Penthouse in Ramat Aviv - Nadlan Nof Yam</title>', '<title>Biasha Chefetz 16 - Nadlan Nof Yam</title>')

carousel_images = """                <img src="images/chefetz/chefetz-cover.jpg" alt="Chefetz View 1" class="carousel-slide active">
                <img src="images/chefetz/chefetz-2.jpg" alt="Chefetz View 2" class="carousel-slide">
                <img src="images/chefetz/chefetz-3.jpg" alt="Chefetz View 3" class="carousel-slide">
                <img src="images/chefetz/chefetz-4.jpg" alt="Chefetz View 4" class="carousel-slide">"""

text = re.sub(r'<div class="carousel-images">[\s\S]*?</div>', f'<div class="carousel-images">\n{carousel_images}\n            </div>', text, 1)

text = re.sub(r'<span id="totalSlideNum">\d+</span>', '<span id="totalSlideNum">4</span>', text)

thumbnails = """            <img src="images/chefetz/chefetz-cover.jpg" alt="Thumb 1" class="thumb active" onclick="setSlide(1)">
            <img src="images/chefetz/chefetz-2.jpg" alt="Thumb 2" class="thumb" onclick="setSlide(2)">
            <img src="images/chefetz/chefetz-3.jpg" alt="Thumb 3" class="thumb" onclick="setSlide(3)">
            <img src="images/chefetz/chefetz-4.jpg" alt="Thumb 4" class="thumb" onclick="setSlide(4)">"""

text = re.sub(r'<div class="carousel-thumbnails">[\s\S]*?</div>', f'<div class="carousel-thumbnails">\n{thumbnails}\n        </div>', text, 1)

text = text.replace('<h1 class="property-page-title">Mini Penthouse Gush Haghadol / Nofei Yam</h1>', '<h1 class="property-page-title">Biasha Chefetz 16</h1>')
text = text.replace('<p class="property-page-location">Ramat Aviv, Tel Aviv</p>', '<p class="property-page-location">Tel Aviv</p>')

key_features = """                    <div class="key-feature"><span>4</span> Rooms (orig. 5)</div>
                    <div class="key-feature"><span>155</span> sqm built</div>
                    <div class="key-feature"><span>70</span> sqm balcony</div>
                    <div class="key-feature"><span>6th Floor</span> out of 7</div>"""

text = re.sub(r'<div class="property-key-features">[\s\S]*?</div>', f'<div class="property-key-features">\n{key_features}\n                </div>', text, 1)

desc = """                        Stunning apartment at Biasha Chefetz 16. Offering 155 sqm of built space plus a huge 70 sqm balcony.
                        <br><br>
                        Located on the 6th floor out of 7, with West and South-West exposures in the rooms. 
                        The apartment was converted from 5 to 4 rooms, with the option to easily separate the Mamad (safe room) from the master suite.
                        Features particularly high ceilings (3 meters), 2 separate parking spaces, and a huge attached storage room."""

text = re.sub(r'<div class="property-description" style="margin-bottom: 40px;">[\s\S]*?</p>', f'<div class="property-description" style="margin-bottom: 40px;">\n                    <h2 style="font-family: var(--font-heading); margin-bottom: 20px;">About the Property</h2>\n                    <p style="font-size: 1.15rem; line-height: 1.8; color: var(--color-text-light);">\n{desc}\n                    </p>', text)


amenities = """                                    <div class="amenity-item">
                                        <svg viewBox="0 0 24 24" fill="none" class="amenity-icon"><rect x="3" y="3" width="18" height="18" rx="2" ry="2" stroke="currentColor" stroke-width="1"/><path d="M9 3v18" stroke="currentColor" stroke-width="1"/><path d="M15 3v18" stroke="currentColor" stroke-width="1"/><path d="M3 9h18" stroke="currentColor" stroke-width="1"/><path d="M3 15h18" stroke="currentColor" stroke-width="1"/></svg>
                                        <span>155 sqm built</span>
                                    </div>
                                    <div class="amenity-item">
                                        <svg viewBox="0 0 24 24" fill="none" class="amenity-icon"><path d="M3 12h18" stroke="currentColor" stroke-width="1"/><path d="M4 12v8" stroke="currentColor" stroke-width="1"/><path d="M20 12v8" stroke="currentColor" stroke-width="1"/><path d="M8 12v8" stroke="currentColor" stroke-width="1"/><path d="M12 12v8" stroke="currentColor" stroke-width="1"/><path d="M16 12v8" stroke="currentColor" stroke-width="1"/><path d="M3 16h18" stroke="currentColor" stroke-width="1"/><path d="M3 20h18" stroke="currentColor" stroke-width="1"/></svg>
                                        <span>70 sqm balcony</span>
                                    </div>
                                    <div class="amenity-item">
                                        <svg viewBox="0 0 24 24" fill="none" class="amenity-icon"><path d="M3 12h18" stroke="currentColor" stroke-width="1"/><path d="M4 12v8" stroke="currentColor" stroke-width="1"/><path d="M20 12v8" stroke="currentColor" stroke-width="1"/><path d="M8 12v8" stroke="currentColor" stroke-width="1"/><path d="M12 12v8" stroke="currentColor" stroke-width="1"/><path d="M16 12v8" stroke="currentColor" stroke-width="1"/><path d="M3 16h18" stroke="currentColor" stroke-width="1"/><path d="M3 20h18" stroke="currentColor" stroke-width="1"/></svg>
                                        <span>4 rooms (orig. 5)</span>
                                    </div>
                                    <div class="amenity-item">
                                        <svg viewBox="0 0 24 24" fill="none" class="amenity-icon"><rect x="4" y="4" width="16" height="16" rx="2" stroke="currentColor" stroke-width="1"/><path d="M9 16V8h4a3 3 0 0 1 0 6H9" stroke="currentColor" stroke-width="1"/></svg>
                                        <span>2 separate parking</span>
                                    </div>
                                    <div class="amenity-item">
                                        <svg viewBox="0 0 24 24" fill="none" class="amenity-icon"><rect x="3" y="3" width="18" height="18" rx="2" ry="2" stroke="currentColor" stroke-width="1"/><path d="M9 3v18" stroke="currentColor" stroke-width="1"/><path d="M15 3v18" stroke="currentColor" stroke-width="1"/><path d="M3 9h18" stroke="currentColor" stroke-width="1"/><path d="M3 15h18" stroke="currentColor" stroke-width="1"/></svg>
                                        <span>Huge storage room</span>
                                    </div>
                                    <div class="amenity-item">
                                        <svg viewBox="0 0 24 24" fill="none" class="amenity-icon"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="1"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M12 4l-4 16 4-4 4 4-4-16z" stroke="currentColor" stroke-width="1"/></svg>
                                        <span>Exposure: West, South-West</span>
                                    </div>
                                    <div class="amenity-item">
                                        <svg viewBox="0 0 24 24" fill="none" class="amenity-icon"><rect x="5" y="3" width="14" height="18" rx="2" ry="2" stroke="currentColor" stroke-width="1"/><path d="M12 7v4" stroke="currentColor" stroke-width="1"/></svg>
                                        <span>High ceilings (3m)</span>
                                    </div>
                                    <div class="amenity-item">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" class="amenity-icon"><path d="M12 4a3 3 0 0 1 3 3v2H9V7a3 3 0 0 1 3-3z"/><circle cx="7" cy="14" r="1" fill="currentColor"/><circle cx="12" cy="16" r="1" fill="currentColor"/><circle cx="17" cy="14" r="1" fill="currentColor"/><circle cx="9" cy="19" r="1" fill="currentColor"/><circle cx="15" cy="19" r="1" fill="currentColor"/></svg>
                                        <span>6th floor of 7</span>
                                    </div>"""

text = re.sub(r'<div class="amenities-grid">[\s\S]*?</div>\s*</div>', f'<div class="amenities-grid">\n{amenities}\n                                </div>\n                            </div>', text, 1)

# fix location box
text = re.sub(r'<div class="accordion-item">\s*<button class="accordion-header">Location & Accessibility.*?</div>\s*</div>', '', text, flags=re.DOTALL)


text = text.replace('8750000', '10000000')
text = text.replace('₪ 8,750,000', '₪ 10,000,000')

with open('en-property-chefetz.html', 'w', encoding='utf-8') as f:
    f.write(text)

print("Updated en-property-chefetz.html")
