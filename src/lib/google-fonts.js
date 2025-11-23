/**
 * Google Fonts API Integration
 * Free and open source - no API key required
 * https://fonts.google.com/
 */

// Popular Google Fonts for menu design
export const popularGoogleFonts = [
  { family: 'Inter', category: 'sans-serif' },
  { family: 'Roboto', category: 'sans-serif' },
  { family: 'Open Sans', category: 'sans-serif' },
  { family: 'Lato', category: 'sans-serif' },
  { family: 'Montserrat', category: 'sans-serif' },
  { family: 'Poppins', category: 'sans-serif' },
  { family: 'Raleway', category: 'sans-serif' },
  { family: 'Playfair Display', category: 'serif' },
  { family: 'Merriweather', category: 'serif' },
  { family: 'Lora', category: 'serif' },
  { family: 'Crimson Text', category: 'serif' },
  { family: 'Source Sans Pro', category: 'sans-serif' },
  { family: 'Nunito', category: 'sans-serif' },
  { family: 'Ubuntu', category: 'sans-serif' },
  { family: 'Oswald', category: 'sans-serif' },
  { family: 'Dancing Script', category: 'handwriting' },
  { family: 'Pacifico', category: 'handwriting' },
  { family: 'Caveat', category: 'handwriting' },
  { family: 'Bebas Neue', category: 'display' },
  { family: 'Righteous', category: 'display' },
];

/**
 * Get Google Fonts URL for a font family
 * @param {string} fontFamily - Font family name
 * @returns {string} Google Fonts URL
 */
export function getGoogleFontUrl(fontFamily) {
  if (!fontFamily) return '';
  const fontName = fontFamily.replace(/\s+/g, '+');
  return `https://fonts.googleapis.com/css2?family=${fontName}:wght@300;400;500;600;700&display=swap`;
}

/**
 * Get all font families as options for select
 * @returns {Array} Array of {value, label} objects
 */
export function getFontOptions() {
  return popularGoogleFonts.map((font) => ({
    value: font.family,
    label: font.family,
    category: font.category,
  }));
}

/**
 * Load Google Font dynamically with mobile optimizations
 * @param {string} fontFamily - Font family to load
 */
export function loadGoogleFont(fontFamily) {
  if (!fontFamily || !document) return;
  
  const fontUrl = getGoogleFontUrl(fontFamily);
  const linkId = `google-font-${fontFamily.replace(/\s+/g, '-').toLowerCase()}`;
  
  // Check if font is already loaded
  if (document.getElementById(linkId)) return;
  
  const link = document.createElement('link');
  link.id = linkId;
  link.rel = 'stylesheet';
  link.href = fontUrl;
  link.media = 'print'; // Load in background
  link.onload = function() {
    this.media = 'all'; // Apply when loaded
  };
  // Add font-display: swap for faster rendering
  link.setAttribute('data-font-display', 'swap');
  document.head.appendChild(link);
}

