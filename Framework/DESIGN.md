---
name: Bella Chama
colors:
  surface: '#fef9f0'
  surface-dim: '#ded9d1'
  surface-bright: '#fef9f0'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f8f3ea'
  surface-container: '#f2ede4'
  surface-container-high: '#ece8df'
  surface-container-highest: '#e7e2d9'
  on-surface: '#1d1c16'
  on-surface-variant: '#57423d'
  inverse-surface: '#32302b'
  inverse-on-surface: '#f5f0e7'
  outline: '#8a726c'
  outline-variant: '#ddc0b9'
  surface-tint: '#a23e26'
  primary: '#882b15'
  on-primary: '#ffffff'
  primary-container: '#a8422a'
  on-primary-container: '#ffd7cd'
  inverse-primary: '#ffb4a3'
  secondary: '#625d5b'
  on-secondary: '#ffffff'
  secondary-container: '#e9e1dd'
  on-secondary-container: '#686360'
  tertiary: '#773a00'
  on-tertiary: '#ffffff'
  tertiary-container: '#9a4e02'
  on-tertiary-container: '#ffd7be'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffdad2'
  primary-fixed-dim: '#ffb4a3'
  on-primary-fixed: '#3d0700'
  on-primary-fixed-variant: '#822711'
  secondary-fixed: '#e9e1dd'
  secondary-fixed-dim: '#ccc5c1'
  on-secondary-fixed: '#1e1b19'
  on-secondary-fixed-variant: '#4a4643'
  tertiary-fixed: '#ffdcc5'
  tertiary-fixed-dim: '#ffb783'
  on-tertiary-fixed: '#301400'
  on-tertiary-fixed-variant: '#713700'
  background: '#fef9f0'
  on-background: '#1d1c16'
  surface-variant: '#e7e2d9'
typography:
  display:
    fontFamily: Bebas Neue
    fontSize: 48px
    fontWeight: '400'
    lineHeight: 48px
    letterSpacing: 0.02em
  headline-lg:
    fontFamily: Bebas Neue
    fontSize: 32px
    fontWeight: '400'
    lineHeight: 36px
    letterSpacing: 0.03em
  headline-lg-mobile:
    fontFamily: Bebas Neue
    fontSize: 28px
    fontWeight: '400'
    lineHeight: 32px
    letterSpacing: 0.03em
  headline-md:
    fontFamily: Bebas Neue
    fontSize: 24px
    fontWeight: '400'
    lineHeight: 28px
    letterSpacing: 0.02em
  title-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '700'
    lineHeight: 24px
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.05em
  price-display:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '800'
    lineHeight: 24px
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  base: 4px
  xs: 8px
  sm: 12px
  md: 16px
  lg: 24px
  xl: 32px
  container-margin: 16px
  gutter: 12px
---

## Brand & Style
The design system for this project centers on a "Modern Gastronomic" aesthetic that bridges the gap between a rustic Brazilian *boteco* and a sophisticated steakhouse. The personality is warm, artisanal, and evocative of charcoal grilling and evening gatherings.

The style utilizes a **Minimalist-Tactile** hybrid approach. It avoids excessive decoration in favor of high-quality typography, intentional whitespace, and a color palette that feels organic rather than synthetic. The UI should evoke a sensory response—heat, texture, and flavor—through the use of rich earth tones and a structured hierarchy that prioritizes food photography and ease of ordering.

## Colors
The palette is inspired by the elements of a steakhouse: fire, coal, and the warmth of a shared table.

- **Terracota (#A8422A):** Used exclusively for high-priority actions, primary buttons, and active navigational states. It represents the heat of the grill.
- **Carvão (#171412):** The structural anchor. Used for all primary headings and heavy text to ensure maximum readability and a premium feel.
- **Creme (#F6F1E8):** The global background color. It provides a softer, more "paper-like" warmth than pure white, reducing eye strain in low-light environments.
- **Branco (#FFFFFF):** Reserved for product cards and modals to create "lift" and focus against the Creme background.
- **Brasa (#D27A32):** A culinary accent used for highlights, such as "Chef's Choice" tags or price emphasis within cards.
- **Verde (#3F7D4A):** A functional utility color used strictly for availability indicators (e.g., "Open Now").
- **Cinza (#756D67):** Used for ingredient descriptions and metadata to maintain a clear visual hierarchy.

## Typography
The typography strategy pairings high-impact display fonts with functional body faces.

- **Headlines:** Use **Bebas Neue**. Its condensed, vertical nature feels architectural and bold, reminiscent of vintage steakhouse signage. Use it for category titles and section headers.
- **Body & Interface:** Use **Plus Jakarta Sans**. This font provides a contemporary, friendly roundness that balances the sharpness of the headlines. It ensures that long ingredient lists remain legible.
- **Price Treatment:** Prices should be rendered in **Plus Jakarta Sans** with an extra-bold weight to ensure they are the second most important element on product cards after the item name.

## Layout & Spacing
This design system utilizes a **Mobile-First Fluid Grid** with a specific focus on thumb-driven navigation.

- **Grid Model:** 4-column layout for mobile, expanding to 12-columns for tablet/desktop. 
- **Sticky Navigation:** The category bar must remain fixed at the top during scroll, using horizontal overflow with hidden scrollbars.
- **Touch Targets:** All interactive elements (buttons, quantity adjusters) must maintain a minimum hit area of 44x44px.
- **Rhythm:** Use a 4px baseline grid. Most vertical spacing between related elements should be `sm` (12px), while spacing between distinct sections should be `lg` (24px) or `xl` (32px) to provide "room to breathe" and highlight food photography.

## Elevation & Depth
Depth is created through **Tonal Layering** rather than traditional shadows.

1.  **Level 0 (Base):** The `Creme` background serves as the canvas.
2.  **Level 1 (Cards/Surfaces):** `Branco` product cards sit directly on the background with a subtle 1px border (#E8E2D9) instead of a shadow. This keeps the interface feeling "flat" and clean.
3.  **Level 2 (Modals/Overlays):** For selection modals, use a backdrop blur (10px) over the background with the modal itself being `Branco`.
4.  **Level 3 (Sticky Elements):** The Floating Cart Bar and Sticky Category Nav use a very soft, diffused ambient shadow (8% opacity of #171412) to indicate they sit above the scrolling content.

## Shapes
The shape language is **Soft (0.25rem)**. This subtle rounding provides a modern touch while maintaining a sturdy, professional appearance suitable for a steakhouse. 

- **Product Images:** Should always feature the `rounded-lg` (0.5rem) setting to soften the "edge" of the photography.
- **Primary Buttons:** Use a slightly higher roundedness (0.5rem) to make them feel more "clickable" and distinct from structural cards.
- **Quantity Pickers:** Use the base `rounded` (0.25rem) to maintain a crisp, functional look.

## Components

### Product Cards
Compact and horizontal for efficiency. Image on the left (aspect ratio 1:1), Title (`title-lg`), short description (`body-md`), and price (`price-display`) on the right. The entire card is a white surface with a thin `neutral` border.

### Sticky Category Bar
Horizontal scrolling text labels. Active state: `Terracota` text with a 2px bottom border. Inactive state: `Cinza` text. No background color change for inactive states to keep the header light.

### Primary Buttons (CTAs)
Solid `Terracota` background with white text. Use `Bebas Neue` for button labels in Checkout to maintain the brand's bold voice, but use `Plus Jakarta Sans` for smaller utility buttons (like "Add").

### Floating Cart Bar
A full-width bar at the bottom of the screen. `Carvão` background with white text. It displays the item count on the left and the total price on the right, with a "View Order" label centered.

### Selection Modal
Slides up from the bottom. Features a "Close" icon at the top right. Options are presented in lists with large touch targets. Radio buttons and checkboxes use `Terracota` for the checked state.

### Input Fields
Used primarily in checkout. Subtle `Creme` background with a 1px `Cinza` border. Focus state: Border changes to `Terracota` with no glow.