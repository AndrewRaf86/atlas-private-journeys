# Design System Strategy: The Digital Concierge

## 1. Overview & Creative North Star
The Creative North Star for this design system is **"The Digital Concierge."** 

This system moves away from the rigid, boxy layouts of standard travel booking sites to mimic the experience of a high-end editorial magazine or a private gallery. We achieve a "premium" feel not through complexity, but through intentionality. By utilizing wide tracking, generous white space, and a rejection of traditional borders, we create a layout that feels "breathtaking." 

The system breaks the "template" look by using **intentional asymmetry**. Images should rarely be centered; instead, they should overlap container boundaries or be paired with offset typography to create a sense of movement and architectural depth, mirroring the sophisticated interior compositions seen in the brand’s physical properties.

---

## 2. Colors: Tonal Sophistication
Our palette is anchored in deep midnight blues (`primary: #00113a`) and rich, warm ochres (`secondary: #775a19`), balanced against a spectrum of architectural whites and greys.

### The "No-Line" Rule
To maintain an elite aesthetic, **1px solid borders are prohibited for sectioning.** Structural separation must be achieved through:
*   **Background Shifts:** Transitioning from `surface` (#f9f9f9) to `surface-container-low` (#f3f3f3).
*   **Negative Space:** Using the Spacing Scale to create "breathing rooms" between content blocks.

### Surface Hierarchy & Nesting
Treat the UI as a series of layered fine papers. To define an area of focus (like a booking widget or a luxury amenity card), nest a `surface-container-lowest` (#ffffff) element inside a `surface-container` (#eeeeee) section. This creates a natural, soft "pop" that feels more expensive than a flat grid.

### The "Glass & Gradient" Rule
Floating elements (like navigation bars or hovering price tags) should utilize **Glassmorphism**. Apply `surface` colors at 80% opacity with a `backdrop-blur` of 12px. Main CTAs should avoid flat fills; use a subtle linear gradient from `primary` (#00113a) to `primary-container` (#002366) to add "soul" and visual weight.

---

## 3. Typography: The Editorial Voice
We use a high-contrast typographic scale to establish authority and elegance.

*   **Display & Headlines (Noto Serif):** These are our "hero" moments. Use `display-lg` for destination names. The serif evokes history and tradition.
*   **Titles & Body (Manrope):** A modern, clean sans-serif that balances the classicism of the headlines. It ensures that even long itineraries remain highly readable.
*   **Labels (Work Sans):** Used for metadata, small captions, and "luxury markers." Work Sans at `label-sm` should always be uppercase with a +5% letter-spacing to feel like a high-fashion tag.

---

## 4. Elevation & Depth: Tonal Layering
Traditional drop shadows are too "digital." We convey depth through physics-based layering.

*   **The Layering Principle:** Depth is achieved by stacking. A `surface-container-highest` element feels closer to the user than a `surface-dim` element.
*   **Ambient Shadows:** If an element must float, use a shadow with a blur radius of 30px–60px and an opacity of 4%–6%. The shadow color must be a tinted variant of `on-surface` (#1a1c1c), never pure black.
*   **The "Ghost Border" Fallback:** For input fields or essential accessibility boundaries, use a "Ghost Border": the `outline-variant` token at 15% opacity. It provides a hint of structure without interrupting the visual flow.

---

## 5. Components

### Buttons
*   **Primary:** Gradient fill (`primary` to `primary-container`), white text, `md` (0.375rem) roundedness. 
*   **Secondary:** Ghost style. No fill, `outline` token at 20% opacity. 
*   **Interaction:** On hover, the primary button should "lift" slightly through a subtle increase in the ambient shadow, not a color change.

### Cards & Lists
*   **No Dividers:** Forbid the use of line-based dividers. Use vertical white space or a shift to `surface-container-low` to separate list items.
*   **Luxury Stay Cards:** Use a `surface-container-lowest` background with an image that breaks the top-left corner (offsetting by -1rem) to create that signature asymmetrical look.

### Input Fields
*   **Styling:** Minimalist. Only a bottom-border using `outline-variant` at 30% opacity. When focused, the border transitions to `secondary` (#775a19).
*   **Labels:** Use `label-md` in `on-surface-variant`. Labels should sit inside the field for a cleaner look.

### Additional Signature Component: The "Feature Overlap"
A specialized component for luxury stays: A large, high-resolution image (`surface-tint` overlay at 5%) with a `headline-lg` text block that overlaps the image edge by 20%, sitting on a semi-transparent glass container.

---

## 6. Do's and Don'ts

### Do:
*   **Do** use asymmetrical margins (e.g., 80px left, 120px right) to create an organic, custom-built feel.
*   **Do** lean into "Warm Minimalism"—complement the cool blues with the `secondary` gold and `secondary-fixed` cream tones to match the interior wood and lighting in the brand photos.
*   **Do** ensure all images have a subtle `xl` (0.75rem) corner radius to soften the high-contrast layout.

### Don't:
*   **Don't** use pure black (#000000). Use `tertiary` (#131416) for the deepest blacks to maintain a photographic, tonal quality.
*   **Don't** use standard "Select" dropdowns. Create custom, full-width overlays that feel like an extension of the concierge experience.
*   **Don't** use heavy, opaque borders. If you feel the need to "box" something in, you likely need more white space instead.