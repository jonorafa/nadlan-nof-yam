import re

#########################
# 1. HEBREW VERSION
#########################
with open('property-gimel.html', 'r', encoding='utf-8') as f:
    text = f.read()

# Replace Title
text = text.replace('<title>פנטהאוז יוקרתי ברמת אביב - נדל״ן נוף ים</title>', '<title>יובל נאמן 3 - נדל״ן נוף ים</title>')

# Images Carousel
carousel_images = """                <img src="images/yuval/yuval-cover.jpg" alt="View 1" class="carousel-slide active">
                <img src="images/yuval/yuval-2.jpg" alt="View 2" class="carousel-slide">
                <img src="images/yuval/yuval-3.jpg" alt="View 3" class="carousel-slide">
                <img src="images/yuval/yuval-4.jpg" alt="View 4" class="carousel-slide">
                <img src="images/yuval/yuval-5.jpg" alt="View 5" class="carousel-slide">"""

text = re.sub(r'<div class="carousel-images">[\s\S]*?</div>', f'<div class="carousel-images">\n{carousel_images}\n            </div>', text, 1)

# Thumbnails
thumbnails = """            <img src="images/yuval/yuval-cover.jpg" alt="Thumb 1" class="thumb active" onclick="setSlide(1)">
            <img src="images/yuval/yuval-2.jpg" alt="Thumb 2" class="thumb" onclick="setSlide(2)">
            <img src="images/yuval/yuval-3.jpg" alt="Thumb 3" class="thumb" onclick="setSlide(3)">
            <img src="images/yuval/yuval-4.jpg" alt="Thumb 4" class="thumb" onclick="setSlide(4)">
            <img src="images/yuval/yuval-5.jpg" alt="Thumb 5" class="thumb" onclick="setSlide(5)">"""

text = re.sub(r'<div class="carousel-thumbnails">[\s\S]*?</div>', f'<div class="carousel-thumbnails">\n{thumbnails}\n        </div>', text, 1)

text = text.replace('<span id="totalSlideNum">10</span>', '<span id="totalSlideNum">5</span>')

# Content
text = text.replace('<h1 class="property-page-title">פנטהאוז חדש לגמרי</h1>', '<h1 class="property-page-title" style="margin-bottom: 5px;">יובל נאמן 3</h1><h3 style="color: #e53935; margin-bottom: 20px;">נמכר על ידי נדל״ן נוף ים</h3>')
text = text.replace('<p class="property-page-location">רמת אביב גימל</p>', '<p class="property-page-location">שכונת למד / אזור אזורי חן</p>')

key_features = """                    <div class="key-feature"><span>6</span> חדרים</div>
                    <div class="key-feature"><span>250</span> מ"ר בנוי</div>
                    <div class="key-feature"><span>93</span> מ"ר מרפסת</div>
                    <div class="key-feature"><span>☆☆☆</span> במפלס אחד !!!!</div>"""

text = re.sub(r'<div class="property-key-features">[\s\S]*?</div>', f'<div class="property-key-features">\n{key_features}\n                </div>', text, 1)

desc = """                        פנטהאוז הכי יפה באזור, למביני עניין ☆☆☆.
                        <br><br>
                        שודרג על ידי אדריכל איטלקי - כל החומרים יובאו מאיטליה ♡♡♡. 
                        מציע 301 מ"ר לפי ארנונה (250 מ"ר בנוי) עם מרפסת רחבה של 93 מ"ר, הכל במפלס אחד.
                        כולל 6 חדרים מרווחים, 2 חניות נפרדות, מחסן של 9 מטר, ונוף מדהים לים. 
                        מיקום מעולה. כל הקודם זוכה ☀️🍇☀️."""

text = re.sub(r'<div class="property-description" style="margin-bottom: 40px;">[\s\S]*?</p>', f'<div class="property-description" style="margin-bottom: 40px;">\n                    <h2 style="font-family: var(--font-heading); margin-bottom: 20px;">על הנכס</h2>\n                    <p style="font-size: 1.15rem; line-height: 1.8; color: var(--color-text-light);">\n{desc}\n                    </p>', text)

amenities = """                                    <div class="amenity-item">
                                        <svg viewBox="0 0 24 24" fill="none" class="amenity-icon"><rect x="3" y="3" width="18" height="18" rx="2" ry="2" stroke="currentColor" stroke-width="1"/><path d="M9 3v18" stroke="currentColor" stroke-width="1"/><path d="M15 3v18" stroke="currentColor" stroke-width="1"/><path d="M3 9h18" stroke="currentColor" stroke-width="1"/><path d="M3 15h18" stroke="currentColor" stroke-width="1"/></svg>
                                        <span>250 מ"ר בנוי</span>
                                    </div>
                                    <div class="amenity-item">
                                        <svg viewBox="0 0 24 24" fill="none" class="amenity-icon"><path d="M3 12h18" stroke="currentColor" stroke-width="1"/><path d="M4 12v8" stroke="currentColor" stroke-width="1"/><path d="M20 12v8" stroke="currentColor" stroke-width="1"/><path d="M8 12v8" stroke="currentColor" stroke-width="1"/><path d="M12 12v8" stroke="currentColor" stroke-width="1"/><path d="M16 12v8" stroke="currentColor" stroke-width="1"/><path d="M3 16h18" stroke="currentColor" stroke-width="1"/><path d="M3 20h18" stroke="currentColor" stroke-width="1"/></svg>
                                        <span>93 מ"ר מרפסת</span>
                                    </div>
                                    <div class="amenity-item">
                                        <svg viewBox="0 0 24 24" fill="none" class="amenity-icon"><path d="M3 12h18" stroke="currentColor" stroke-width="1"/><path d="M4 12v8" stroke="currentColor" stroke-width="1"/><path d="M20 12v8" stroke="currentColor" stroke-width="1"/><path d="M8 12v8" stroke="currentColor" stroke-width="1"/><path d="M12 12v8" stroke="currentColor" stroke-width="1"/><path d="M16 12v8" stroke="currentColor" stroke-width="1"/><path d="M3 16h18" stroke="currentColor" stroke-width="1"/><path d="M3 20h18" stroke="currentColor" stroke-width="1"/></svg>
                                        <span>6 חדרים</span>
                                    </div>
                                    <div class="amenity-item">
                                        <svg viewBox="0 0 24 24" fill="none" class="amenity-icon"><rect x="4" y="4" width="16" height="16" rx="2" stroke="currentColor" stroke-width="1"/><path d="M9 16V8h4a3 3 0 0 1 0 6H9" stroke="currentColor" stroke-width="1"/></svg>
                                        <span>2 חניות נפרדות</span>
                                    </div>
                                    <div class="amenity-item">
                                        <svg viewBox="0 0 24 24" fill="none" class="amenity-icon"><rect x="3" y="3" width="18" height="18" rx="2" ry="2" stroke="currentColor" stroke-width="1"/><path d="M9 3v18" stroke="currentColor" stroke-width="1"/><path d="M15 3v18" stroke="currentColor" stroke-width="1"/><path d="M3 9h18" stroke="currentColor" stroke-width="1"/><path d="M3 15h18" stroke="currentColor" stroke-width="1"/></svg>
                                        <span>9 מ"ר מחסן</span>
                                    </div>
                                    <div class="amenity-item">
                                        <svg viewBox="0 0 24 24" fill="none" class="amenity-icon"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="1"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M12 4l-4 16 4-4 4 4-4-16z" stroke="currentColor" stroke-width="1"/></svg>
                                        <span>נוף לים</span>
                                    </div>
                                    <div class="amenity-item">
                                        <svg viewBox="0 0 24 24" fill="none" class="amenity-icon"><rect x="5" y="3" width="14" height="18" rx="2" ry="2" stroke="currentColor" stroke-width="1"/><path d="M12 7v4" stroke="currentColor" stroke-width="1"/></svg>
                                        <span>מפלס אחד</span>
                                    </div>
                                    <div class="amenity-item">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" class="amenity-icon"><path d="M12 4a3 3 0 0 1 3 3v2H9V7a3 3 0 0 1 3-3z"/><circle cx="7" cy="14" r="1" fill="currentColor"/><circle cx="12" cy="16" r="1" fill="currentColor"/><circle cx="17" cy="14" r="1" fill="currentColor"/><circle cx="9" cy="19" r="1" fill="currentColor"/><circle cx="15" cy="19" r="1" fill="currentColor"/></svg>
                                        <span>עיצוב אדריכל איטלקי</span>
                                    </div>"""

text = re.sub(r'<div class="amenities-grid">[\s\S]*?</div>\s*</div>', f'<div class="amenities-grid">\n{amenities}\n                                </div>\n                            </div>', text, 1)

# Fix Prices
text = text.replace('13500000', '12300000')
text = text.replace('₪ 13,500,000', '<span class="price-crossed">₪ 17,500,000</span> ₪ 12,300,000')


# Location fix to avoid empty accordion
text = re.sub(r'<div class="accordion-item">\s*<button class="accordion-header">מיקום נגישות.*?</div>\s*</div>', '', text, flags=re.DOTALL)


with open('property-yuval.html', 'w', encoding='utf-8') as f:
    f.write(text)



#########################
# 2. ENGLISH VERSION
#########################
with open('property-yuval.html', 'r', encoding='utf-8') as f:
    eng = f.read()

# Swap RTL tags
eng = eng.replace('<html lang="he" dir="rtl">', '<html lang="en" dir="ltr">')

# Header Links
eng = eng.replace('<li><a href="index.html#home">דף הבית</a></li>', '<li><a href="en.html#home">Home</a></li>')
eng = eng.replace('<li><a href="index.html#sale">מכירה</a></li>', '<li><a href="en.html#sale">Buy</a></li>')
eng = eng.replace('<li><a href="index.html#rent">השכרה</a></li>', '<li><a href="en.html#rent">Rent</a></li>')
eng = eng.replace('<li><a href="index.html#team">הצוות שלנו</a></li>', '<li><a href="en.html#team">Team</a></li>')
eng = eng.replace('<li><a href="index.html#contact">צור קשר</a></li>', '<li><a href="en.html#contact">Contact</a></li>')

eng = eng.replace('<title>יובל נאמן 3 - נדל״ן נוף ים</title>', '<title>Yuval Neeman 3 - Nadlan Nof Yam</title>')
eng = eng.replace('>יובל נאמן 3</h1>', '>Yuval Neeman 3</h1>')
eng = eng.replace('>נמכר על ידי נדל״ן נוף ים</h3>', '>Sold by Nadlan Nof Yam</h3>')
eng = eng.replace('>שכונת למד / אזור אזורי חן</p>', '>Tel Aviv</p>')

eng = eng.replace('חדרים', 'Rooms')
eng = eng.replace('מ"ר בנוי', 'sqm built')
eng = eng.replace('מ"ר מרפסת', 'sqm balcony')
eng = eng.replace('במפלס אחד !!!!', 'One Level !!!!')
eng = eng.replace('<h2 style="font-family: var(--font-heading); margin-bottom: 20px;">על הנכס</h2>', '<h2 style="font-family: var(--font-heading); margin-bottom: 20px;">About the Property</h2>')


desc_en = """                        The most beautiful penthouse in the area, for those who appreciate true luxury ☆☆☆.
                        <br><br>
                        Upgraded by a renowned Italian architect - all materials imported directly from Italy ♡♡♡.
                        Offers 301 sqm per Arnona (250 sqm built) with a massive 93 sqm balcony, uniquely situated entirely on one level.
                        Features 6 spacious rooms, 2 separate parking spaces, a 9 sqm private storage room, and an open breathtaking view to the sea.
                        Excellent location. First come, first served ☀️🍇☀️."""

eng = re.sub(r'פנטהאוז הכי יפה באזור.*?שמש🍇שמש\.', desc_en, eng, flags=re.DOTALL)
eng = re.sub(r'דירה מדהימה בישה חפץ 16.*?שמש🍇שמש\.', desc_en, eng, flags=re.DOTALL) # in case
eng = re.sub(r'פנטהאוז הכי יפה באזור.*?☀️🍇☀️\.', desc_en, eng, flags=re.DOTALL) 

# Ensure exact replace of Hebrew desc
hebrew_snippet = '''פנטהאוז הכי יפה באזור, למביני עניין ☆☆☆.
                        <br><br>
                        שודרג על ידי אדריכל איטלקי - כל החומרים יובאו מאיטליה ♡♡♡. 
                        מציע 301 מ"ר לפי ארנונה (250 מ"ר בנוי) עם מרפסת רחבה של 93 מ"ר, הכל במפלס אחד.
                        כולל 6 חדרים מרווחים, 2 חניות נפרדות, מחסן של 9 מטר, ונוף מדהים לים. 
                        מיקום מעולה. כל הקודם זוכה ☀️🍇☀️.'''

eng = eng.replace(hebrew_snippet, desc_en)

# Accordions
eng = eng.replace('פרטים נוספים', 'Additional Details')
eng = eng.replace('מפרט הנכס', 'Property Details')

eng = eng.replace('250 מ"ר בנוי', '250 sqm built')
eng = eng.replace('93 מ"ר מרפסת', '93 sqm balcony')
eng = eng.replace('6 חדרים', '6 rooms')
eng = eng.replace('2 חניות נפרדות', '2 separate parking spaces')
eng = eng.replace('9 מ"ר מחסן', '9 sqm storage')
eng = eng.replace('נוף לים', 'Sea view')
eng = eng.replace('מפלס אחד', 'One Level')
eng = eng.replace('עיצוב אדריכל איטלקי', 'Italian architect design')

eng = eng.replace('מחשבון משכנתא', 'Financial Calculator')
eng = eng.replace('חשב את ההחזר החודשי המדויק שלך.', 'Calculate your exact monthly repayment.')
eng = eng.replace('מחיר הנכס (₪)', 'Property Price (₪)')
eng = eng.replace('הון עצמי (₪)', 'Down Payment (₪)')
eng = eng.replace('ריבית משוערת (%)', 'Estimated Interest (%)')
eng = eng.replace('תקופת הלוואה (שנים)', 'Loan Period (Years)')
eng = eng.replace('החישוב כולל מס רכישה ועמלות כדין.', 'This calculation includes a 7% registration and fee right.')
eng = eng.replace('החזר חודשי', 'Monthly Repayment')
eng = eng.replace('הערכה זו הינה לשם התרשמות וסימולציה...', 'This estimate is for impression and simulation purposes. The actual repayment rate depends strictly on conditions offered by the banking entity.')
eng = eng.replace('צור קשר עכשיו', 'Contact Us')

eng = eng.replace('סופיה', 'Sofia')
eng = eng.replace('סוכנת נדל״ן יוקרה', 'Luxury Real Estate Agent')
eng = eng.replace('תאם סיור עכשיו', 'Schedule a Tour Now')
eng = eng.replace('שלחו אלינו דוא"ל', 'Email Us directly')

eng = eng.replace('נכסים אלו עשויים לעניין אותך גם', 'These properties might also interest you')

with open('en-property-yuval.html', 'w', encoding='utf-8') as f:
    f.write(eng)

print("Generated BOTH files.")
