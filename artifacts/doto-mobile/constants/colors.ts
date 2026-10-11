/**
 * Semantic design tokens for the mobile app.
 *
 * These tokens mirror the naming conventions used in web artifacts (index.css)
 * so that multi-artifact projects share a cohesive visual identity.
 *
 * Replace the placeholder values below with values that match the project's
 * brand. If a sibling web artifact exists, read its index.css and convert the
 * HSL values to hex so both artifacts use the same palette.
 *
 * To add dark mode, add a `dark` key with the same token names.
 * The useColors() hook will automatically pick it up.
 */

const palette = {
    // Legacy aliases (kept for backward compatibility)
    text: '#F5F6F5',
    tint: '#19D36A',

    // Core surfaces
    background: '#171819',
    foreground: '#F5F6F5',

    // Cards / elevated surfaces
    card: '#222526',
    cardForeground: '#F5F6F5',

    // Primary action color (buttons, links, active states)
    primary: '#19D36A',
    primaryForeground: '#101211',

    // Secondary / less-emphasis interactive surfaces
    secondary: '#303435',
    secondaryForeground: '#F5F6F5',

    // Muted / subdued elements (dividers, timestamps, placeholders)
    muted: '#2A2D2E',
    mutedForeground: '#96999B',

    // Accent highlights (badges, selected items, focus rings)
    accent: '#35393A',
    accentForeground: '#F5F6F5',

    // Destructive actions (delete, error states)
    destructive: '#FF6673',
    destructiveForeground: '#FFFFFF',

    // Borders and input outlines
    border: '#343839',
    input: '#343839',

    // Instrument and promotion accents
    buttonLight: '#FFFFFF',
    buttonLightText: '#101211',
    bitcoin: '#F7931A',
    gold: '#E8B84B',
    ethereum: '#7386EF',
    fxBlue: '#5587F2',
    promoPurple: '#7358DC',
    promoLilac: '#A874FF',
    promoPale: '#D8C9FF',
    promoSoft: '#F7EBFF',
    promoMint: '#98F4BC',
};

const colors = {
  light: palette,
  dark: palette,
  // Border radius (in px). Sync from the sibling web artifact's --radius
  // CSS variable. This value applies to cards, buttons, inputs, and modals.
  radius: 20,
};

export default colors;
