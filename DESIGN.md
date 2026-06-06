# Design System — Material Design 3 Inspired

This document defines the visual design language for the Project Management Platform. It is based on Google's **Material Design 3 (Material You)** principles — personalized, adaptive, accessible, and expressive.

---

## 1. Design Principles

| Principle | Application |
|-----------|-------------|
| **Personalized** | Dynamic color adaptation; user-chosen accent color reflects in UI tokens |
| **Adaptive** | Responsive layout grid; sidebars collapse; typography scales fluidly |
| **Accessible** | WCAG AA contrast (4.5:1 text, 3:1 large text); touch targets ≥ 48px |
| **Expressive** | Meaningful motion; tonal elevation replaces heavy shadows; rounded corners |
| **Hierarchical** | Clear typographic scale (display → headline → title → body → label) |

---

## 2. Color System (Material 3 Dynamic Tokens)

### Light Theme

| Token | Role | Value (Hex) |
|-------|------|-------------|
| `--primary` | Key brand color; interactive elements | `#2266CC` |
| `--on-primary` | Content on primary surfaces | `#FFFFFF` |
| `--primary-container` | Filled variant background | `#D6E3FF` |
| `--on-primary-container` | Content on primary container | `#001B3E` |
| `--secondary` | Accent surfaces | `#535F70` |
| `--on-secondary` | Content on secondary | `#FFFFFF` |
| `--surface` | Main page background | `#F8F9FF` |
| `--surface-container` | Card/panel background | `#F0F2FA` |
| `--on-surface` | Primary text | `#191C20` |
| `--on-surface-variant` | Secondary/muted text | `#44474E` |
| `--outline` | Borders, dividers | `#74777F` |
| `--error` | Destructive/error actions | `#BA1A1A` |
| `--on-error` | Content on error | `#FFFFFF` |
| `--error-container` | Error background | `#FFDAD6` |

### Dark Theme

| Token | Role | Value (Hex) |
|-------|------|-------------|
| `--primary` | Key brand color | `#AAC7FF` |
| `--on-primary` | Content on primary | `#002F65` |
| `--surface` | Page background | `#111318` |
| `--surface-container` | Card/panel background | `#1D1F24` |
| `--on-surface` | Primary text | `#E2E2E9` |
| `--on-surface-variant` | Muted text | `#C4C6CF` |
| `--outline` | Dividers | `#8E9099` |

### Semantic Colors

| Role | Light | Dark |
|------|-------|------|
| Success (task complete) | `#2E7D32` | `#66BB6A` |
| Warning (due soon) | `#E65100` | `#FFA040` |
| Urgent (overdue) | `#C62828` | `#EF5350` |
| Info (mentions, comments) | `#1565C0` | `#42A5F5` |

---

## 3. Typography

### Font Stack

- **Primary:** `Inter` (headings, body, labels)
- **Monospace:** `JetBrains Mono` (code, IDs)
- **Fallback:** system-ui, -apple-system, sans-serif

### Type Scale (Material 3 Roles)

| Role | Size | Weight | Line Height | Usage |
|------|------|--------|-------------|-------|
| `display-large` | 57px | 400 (Regular) | 64px | Hero / empty states |
| `headline-large` | 32px | 500 (Medium) | 40px | Page titles |
| `headline-medium` | 28px | 500 | 36px | Section headers |
| `title-large` | 22px | 500 | 28px | Card titles |
| `title-medium` | 16px | 500 | 24px | Navigation, subtitles |
| `body-large` | 16px | 400 | 24px | Long-form content |
| `body-medium` | 14px | 400 | 20px | Default body text |
| `body-small` | 12px | 400 | 16px | Captions, metadata |
| `label-large` | 14px | 500 | 20px | Button text, tabs |
| `label-medium` | 12px | 500 | 16px | Chips, badges |
| `label-small` | 11px | 500 | 16px | Overline, tags |

---

## 4. Shape & Elevation

### Border Radius

| Token | Value | Usage |
|-------|-------|-------|
| `shape-extra-small` | 4px | Checkboxes, input fields |
| `shape-small` | 6px | Buttons, chips |
| `shape-medium` | 8px | Cards, dialogs, dropdowns |
| `shape-large` | 12px | Sidebar, modals |
| `shape-extra-large` | 16px | Bottom sheets, FAB |

### Tonal Elevation (Material 3)

Mantine's `Paper` uses `shadow` prop mapped to these elevation levels:

| Level | Light Shadow | Dark Effect |
|-------|-------------|-------------|
| 0 (Flat) | None | `surface` |
| 1 (Raised) | `0 1px 3px rgba(0,0,0,0.08)` | `surface-container` |
| 2 (Overlay) | `0 2px 6px rgba(0,0,0,0.10)` | +2% white overlay |
| 3 (Modal) | `0 8px 24px rgba(0,0,0,0.12)` | +4% white overlay |
| 4 (Drawer) | `0 16px 48px rgba(0,0,0,0.16)` | +6% white overlay |

In dark mode, elevation is communicated via surface **lightness shifts** rather than shadows (tonal elevation principle).

---

## 5. Layout & Spacing

### Grid

- **Base unit:** 8px (all spacing is a multiple of `8`)
- **Content max-width:** 1440px
- **Column count:** 12-column grid (responsive)

### Spacing Scale

| Token | Value |
|-------|-------|
| `spacing-xs` | 4px |
| `spacing-sm` | 8px |
| `spacing-md` | 16px |
| `spacing-lg` | 24px |
| `spacing-xl` | 32px |
| `spacing-2xl` | 48px |
| `spacing-3xl` | 64px |

### Responsive Breakpoints

| Name | Value | Target |
|------|-------|--------|
| `xs` | < 576px | Mobile portrait |
| `sm` | 576px | Mobile landscape |
| `md` | 768px | Tablet |
| `lg` | 992px | Desktop |
| `xl` | 1200px | Desktop wide |
| `xxl` | 1440px | Desktop ultra-wide |

---

## 6. Motion

### Duration

| Token | Value | Usage |
|-------|-------|-------|
| `duration-short` | 150ms | Hover, ripple, micro-interactions |
| `duration-medium` | 250ms | Panel expand, drawer slide |
| `duration-long` | 350ms | Page transitions, modal enter/exit |

### Easing

| Token | Curve | Usage |
|-------|-------|-------|
| `easing-emphasized` | `cubic-bezier(0.2, 0, 0, 1.0)` | Enter (cards, dialogs) |
| `easing-emphasized-decel` | `cubic-bezier(0.05, 0.7, 0.1, 1.0)` | Exit (dismiss panels) |
| `easing-standard` | `cubic-bezier(0.2, 0.0, 0, 1.0)` | Default transitions |
| `easing-linear` | `cubic-bezier(0, 0, 1, 1)` | Opacity / color changes |

---

## 7. Design Tokens Mapped to Mantine

Mantine's `theme` object maps to Material 3 design tokens:

```ts
// MantineProvider theme override
import { createTheme, DEFAULT_THEME } from '@mantine/core';

const materialTheme = createTheme({
  fontFamily: 'Inter, system-ui, sans-serif',
  fontFamilyMonospace: 'JetBrains Mono, monospace',
  primaryColor: 'blue',
  primaryShade: 6,
  defaultRadius: 'md',         // map to shape-medium (8px)
  spacing: { xs: 4, sm: 8, md: 16, lg: 24, xl: 32 },
  breakpoints: { xs: 576, sm: 768, md: 992, lg: 1200, xl: 1440 },
  shadows: {
    xs: '0 1px 3px rgba(0,0,0,0.08)',
    sm: '0 2px 6px rgba(0,0,0,0.10)',
    md: '0 4px 12px rgba(0,0,0,0.10)',
    lg: '0 8px 24px rgba(0,0,0,0.12)',
    xl: '0 16px 48px rgba(0,0,0,0.16)',
  },
});
```

Tailwind overrides in `globals.css` apply the same tokens:

```css
@theme {
  --color-primary: #2266CC;
  --color-surface: #F8F9FF;
  --color-surface-container: #F0F2FA;
  --color-on-surface: #191C20;
  --color-on-surface-variant: #44474E;
  --color-outline: #74777F;
  --color-error: #BA1A1A;
  --spacing-xs: 4px;
  --spacing-sm: 8px;
}
```

---

## 8. Accessibility

- **Color contrast:** All text meets WCAG AA (4.5:1); large text ≥ 3:1
- **Focus indicators:** 2px outline with `--primary` color
- **Touch targets:** Minimum 44×44px (48×48px preferred)
- **Screen readers:** ARIA labels on all icon-only controls; dynamic regions use `aria-live`
- **Reduced motion:** Respect `prefers-reduced-motion`; disable all non-essential animations
- **Font scaling:** All text uses `rem` units; no hard-coded `px` for font sizes

---

## 9. Component Design Guidelines

| Component | Material 3 Pattern | Implementation |
|-----------|-------------------|----------------|
| **Buttons** | Filled tonal (primary), outlined (secondary), text (tertiary) | Mantine `Button` variants |
| **Cards** | Rounded corners (8px), tonal elevation level 1 | Mantine `Paper` / `Card` |
| **Sidebar** | Surface container, collapsible, zoned sections | Mantine `AppShell.Navbar` |
| **Dialogs** | Centered modal, rounded (12px), overlay backdrop | Mantine `Modal` |
| **Chips / Tags** | Assist chips with `label-large` typography | Mantine `Chip` / `Badge` |
| **Text Input** | Filled variant with label, outline on focus | Mantine `TextInput` |
| **Navigation** | Tonal tabs (horizontal) / NavLink items (sidebar) | Mantine `Tabs` / `NavLink` |
| **Avatar** | Circular, initials for fallback, color-coded by entity | Mantine `Avatar` |

---

## 10. Iconography

- **Library:** `@tabler/icons-react` (line style, consistent 24px grid)
- **Sizes:** `sm` = 16px, `md` = 20px, `lg` = 24px, `xl` = 32px
- **Color:** Inherits from parent text color via `currentColor`
- **Stroke width:** 1.5px (Tabler default)
