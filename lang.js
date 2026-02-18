/**
 * lang.js — Bilingual EN/AM toggle for Eden Mekonen's site
 *
 * HOW IT WORKS:
 *   Every translatable element gets two attributes:
 *     data-en="English text here"
 *     data-am="አማርኛ ጽሑፍ እዚህ"   ← fill these in
 *
 *   On toggle, this script swaps the textContent of every
 *   such element to match the selected language.
 *
 * ADDING TRANSLATIONS:
 *   1. Find the element you want to translate in the HTML.
 *   2. Add/fill the data-am="..." attribute with the Amharic text.
 *   3. That's it — the toggle handles the rest automatically.
 *
 * ADDING NEW PAGES:
 *   1. Add the toggle button HTML (copy from any existing page).
 *   2. Add data-en / data-am attributes to all text nodes.
 *   3. Include <script src="./lang.js"></script> before </body>.
 */

(function () {
    const LANG_KEY = 'eden-lang-pref';

    /**
     * Apply a language to all translatable elements on the page.
     * @param {'en'|'am'} lang
     */
    function applyLang(lang) {
        // Update <html lang="..."> for accessibility / screen readers
        document.documentElement.lang = lang;

        // Swap text on every element that carries data-en / data-am
        document.querySelectorAll('[data-en]').forEach(function (el) {
            var text = el.getAttribute('data-' + lang);
            // Only update leaf nodes (no child elements) to avoid
            // clobbering nested links or icons
            if (text !== null && el.children.length === 0) {
                el.textContent = text;
            }
        });

        // Update toggle button states
        var btnEn = document.getElementById('btn-en');
        var btnAm = document.getElementById('btn-am');
        if (btnEn && btnAm) {
            btnEn.classList.toggle('active', lang === 'en');
            btnAm.classList.toggle('active', lang === 'am');
            btnEn.setAttribute('aria-pressed', String(lang === 'en'));
            btnAm.setAttribute('aria-pressed', String(lang === 'am'));
        }

        // Persist preference across pages
        try { localStorage.setItem(LANG_KEY, lang); } catch (e) { /* private browsing */ }
    }

    /**
     * Exposed globally so onclick="setLang('am')" works in HTML.
     */
    window.setLang = applyLang;

    // On load: restore saved preference (default: 'en')
    document.addEventListener('DOMContentLoaded', function () {
        var saved = 'en';
        try { saved = localStorage.getItem(LANG_KEY) || 'en'; } catch (e) {}
        applyLang(saved);
    });
})();
