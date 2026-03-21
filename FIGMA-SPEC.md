# Figma-Ready Specification
## Ryan De Boer Portfolio — Complete Design System & Component Mapping

Generated from codebase at `/portfolio-site/src/`

---

## 1. DESIGN TOKEN VARIABLES

### 1.1 Color Variables

| Figma Variable Name | Hex Value | Usage |
|---|---|---|
| `color/brand/primary-light` | `#fdede9` | Results bg, light accent |
| `color/brand/primary-muted` | `#f07654` | Hover states |
| `color/brand/primary` | `#f03d01` | CTAs, active states, accents |
| `color/brand/primary-dark` | `#c23001` | Hover on primary buttons |
| `color/neutral/white` | `#ffffff` | Backgrounds, button text |
| `color/neutral/lightest` | `#f5f5f5` | Subtle alt backgrounds |
| `color/neutral/light` | `#e5e5e5` | Dividers, borders, inactive |
| `color/neutral/muted` | `#7a7a7a` | Body copy, captions |
| `color/neutral/standard` | `#4a4a4a` | Secondary text |
| `color/neutral/dark` | `#1b1b1b` | Headings, primary text, dark bg |
| `color/secondary/lightest` | `#f4f6f7` | Section backgrounds (alt) |
| `color/secondary/light` | `#d6dce4` | Tag borders, subtle UI |
| `color/secondary/standard` | `#8f9daf` | Tertiary accents |
| `color/secondary/dark` | `#5e6c7c` | Secondary button border/text |
| `color/semantic/border-default` | `rgba(27,27,27,0.1)` | Default card/component borders |
| `color/semantic/border-light` | `rgba(0,0,0,0.1)` | Subtle dividers |
| `color/semantic/nav-bg` | `rgba(255,255,255,0.9)` | Frosted glass nav background |
| `color/semantic/nav-border` | `rgba(0,0,0,0.04)` | Nav bottom border |

#### INCONSISTENCIES FOUND & UNIFIED:

| Issue | Locations | Unified Token |
|---|---|---|
| `#f2f7f9` used as FAQ bg | `_faq.scss:9` | Map to `color/secondary/lightest` (`#f4f6f7`) or create `color/surface/faq` |
| `#f0f5f4` card bg tint | `_work.scss:45` | Create `color/surface/card-1` |
| `#f2f4f0` card bg tint | `_work.scss:53` | Create `color/surface/card-2` |
| `#f0f2f5` card bg tint | `_work.scss:57` | Create `color/surface/card-3` |
| `#1b1b1b` hardcoded | `_case-study-page.scss:242,260` | Use `color/neutral/dark` variable |
| `#f3e8ff` proficiency icon bg | `HeroHybrid.tsx:5` | Create `color/icon-bg/figma` |
| `#dcfce7` proficiency icon bg | `HeroHybrid.tsx:13` | Create `color/icon-bg/html` |
| `#101828` proficiency icon bg | `HeroHybrid.tsx:14` | Create `color/icon-bg/github` |

### 1.2 Typography Variables

| Figma Variable Name | Value | Font Family |
|---|---|---|
| `typography/heading-1` | 38px / 45.6px leading / Bold (700) | Hubot Sans |
| `typography/heading-2` | 34px / 40.8px leading / Bold (700) | Hubot Sans |
| `typography/heading-3` | 30px / 36px leading / Bold (700) | Hubot Sans |
| `typography/heading-4` | 26px / 31.2px leading / Bold (700) | Hubot Sans |
| `typography/heading-5` | 22px / 26.4px leading / Bold (700) | Hubot Sans |
| `typography/body-lg` | 18px / 28px leading / Regular (400) | Inter |
| `typography/body` | 16px / 25.6px leading / Regular (400) | Inter |
| `typography/body-sm` | 14px / 20px leading / Regular (400) | Inter |
| `typography/caption` | 12px / 16px leading / Regular (400) | Inter |
| `typography/label` | 12px / 16px leading / Bold (700), uppercase, 0.1em tracking | Inter |
| `typography/hero-headline` | 52px / 1.1 leading / Bold (700) | Hubot Sans |
| `typography/mono` | 14px / 20px leading / Regular (400) | Menlo |

#### Font Weight Styles:
| Figma Style Name | Weight |
|---|---|
| `weight/regular` | 400 |
| `weight/medium` | 500 |
| `weight/semibold` | 600 |
| `weight/bold` | 700 |
| `weight/extrabold` | 800 |

#### INCONSISTENCIES FOUND:
| Issue | Location | Fix |
|---|---|---|
| `font-size: 52px` hardcoded | `_hero-hybrid.scss:160` | Create `typography/hero-headline` token |
| `font-size: 15px` hardcoded (x3) | `_faq.scss:55,143`, `_how-i-work.scss` | Create `typography/body-md` (15px/1.6) or map to `body-sm` (14px) |
| `font-size: 17px` hardcoded | `_faq.scss:103` | Create `typography/body-md-bold` or map to `body-lg` (18px) |
| `font-size: 11px` hardcoded | `_work.scss:116`, `_design-system.scss` | Create `typography/tag` token |

### 1.3 Spacing Variables

| Figma Variable Name | Value |
|---|---|
| `spacing/xs` | 6px |
| `spacing/sm` | 8px |
| `spacing/md` | 12px |
| `spacing/lg` | 16px |
| `spacing/xl` | 24px |
| `spacing/2xl` | 32px |
| `spacing/3xl` | 48px |
| `spacing/4xl` | 64px |

#### INCONSISTENCIES FOUND:
| Issue | Locations |
|---|---|
| `4px` used as gap/padding | `_about.scss:61`, `_case-study-page.scss:175,313`, `_work.scss:119` |
| `2px` used as gap | `_how-i-work.scss:174`, `_section-badge.scss:45`, `_testimonials.scss` |
| Recommendation: create `spacing/2xs` = 4px and `spacing/3xs` = 2px |

### 1.4 Border Radius Variables

| Figma Variable Name | Value |
|---|---|
| `radius/sm` | 6px |
| `radius/md` | 8px |
| `radius/lg` | 10px |
| `radius/xl` | 12px |
| `radius/2xl` | 16px |
| `radius/full` | 9999px |
| `radius/button` | 10px |

#### INCONSISTENCIES:
| Issue | Location |
|---|---|
| `border-radius: 40px` (phone frame) | `_case-study-page.scss:243` |
| `border-radius: 28px` (phone screen) | `_case-study-page.scss:253` |
| Recommendation: create `radius/phone-frame` = 40px, `radius/phone-screen` = 28px |

### 1.5 Shadow Variables

| Figma Variable Name | Value |
|---|---|
| `shadow/sm` | `0 2px 4px 0 rgba(0,0,0,0.15)` |
| `shadow/md` | `0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.2)` |
| `shadow/lg` | `0 6px 8px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.25)` |
| `shadow/xl` | `0 8px 10px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.3)` |

Note: CSS tokens file defines slightly different shadow values than SCSS variables. Unify to SCSS values as source of truth.

### 1.6 Button Variables

| Property | SM | MD | LG |
|---|---|---|---|
| Height | 32px | 40px | 48px |
| Horizontal padding | 16px | 24px | 32px |
| Border radius | 10px | 10px | 10px |
| Font size | 14px | 16px | 18px |
| Font weight | 800 (Extrabold) | 800 | 800 |

### 1.7 Layout Variables

| Figma Variable Name | Value |
|---|---|
| `layout/container-max` | 1186px |
| `layout/container-padding` | 32px |
| `layout/grid-columns` | 12 |
| `layout/grid-gutter` | 24px |

### 1.8 Breakpoints

| Name | Value |
|---|---|
| `breakpoint/xs` | 480px |
| `breakpoint/sm` | 640px |
| `breakpoint/md` | 768px |
| `breakpoint/lg` | 1024px |
| `breakpoint/xl` | 1280px |

---

## 2. COMPONENT AUTO LAYOUT RULES

### 2.1 HeroHybrid

**Frame:** `Hero/Hybrid`
- Direction: Vertical
- Padding: 100px 32px 48px
- Fill: `color/neutral/white`
- Width: Fill container
- Min height: 100vh

**Child: `Hero/Nav`** (Fixed, top: 0)
- Direction: Horizontal
- Justify: Space between
- Padding: 24px 48px
- Fill: `color/semantic/nav-bg` + backdrop blur 12px
- Width: Fill container
- Children: `Nav/Logo` (Hug) | `Nav/Links` (Hug, gap: 32px)

**Child: `Hero/Grid`**
- Direction: Horizontal (2-col grid)
- Columns: 1fr 1fr
- Gap: 48px
- Align: Center

  **Child: `Hero/Text`**
  - Direction: Vertical
  - Gap: implicit (margin-based)
  - Width: Fill
  - Children:
    - `Hero/Intro` (Vertical, gap: 2px) → `Label` (caption, primary, uppercase) + `Role` (body-sm, muted)
    - `Hero/Headline` (52px Hubot Sans Bold, min-height: 1.2em)
    - `Hero/Body` (body-lg, muted, max-width: 480px)
    - `Hero/Actions` (Horizontal, gap: 16px)
      - `Button/Primary` (Hug, height: 38px, radius: 10px, fill: primary)
      - `Button/Secondary` (Hug, height: 38px, radius: 10px, border: neutral-light)

  **Child: `Hero/Visual`**
  - Direction: Vertical, center
  - Width: 420px, Height: 420px
  - Children: stacked layers (orange-bg circle 380px, border-ring 380px, profile-circle 374px)

**Child: `Hero/Proficiencies`**
- Direction: Horizontal
- Gap: 32px
- Padding: 16px 24px
- Fill: white
- Radius: 12px
- Shadow: shadow/sm
- Children: `Prof/Section` (Vertical) | `Prof/Divider` (1px, 40px) | `Prof/Section` (Vertical)

**Responsive (md: 768px):**
- Grid → single column, text centered
- Visual → order: -1, 280px
- Proficiencies → vertical stack

### 2.2 HowIWork

**Frame:** `Section/HowIWork`
- Direction: Vertical
- Padding: 64px 0
- Fill: `color/secondary/lightest`
- Width: Fill container

**Child: `HowIWork/Container`** (max-width: 1186px, centered)
- Padding: 0 32px

  **Child: `HowIWork/Header`** (margin-bottom: 48px)
  - `Eyebrow` (caption, primary, uppercase, tracking: 0.1em)
  - `Title` (h2, neutral-dark)

  **Child: `HowIWork/Layout`** (Grid: 1.15fr 1fr, gap: 32px)

    **Child: `HowIWork/Visual`**
    - `ImageFrame` (radius: xl, shadow: lg, margin-right: -64px overlap)
      - `ImagePlaceholder` (aspect: 4/3, fill: white, border: border-default)
    - `StepCount` (mono, caption, muted)

    **Child: `HowIWork/Steps`** (Vertical, padding-left: 48px)
    - Each `Step` (Horizontal, gap: 16px, padding: 24px 0, border-bottom: neutral-light)
      - `Step/Indicator` (3px wide, 40px tall, fill: neutral-light, child fill: primary)
      - `Step/Content` (Vertical)
        - `Step/Label` (body, bold, Hubot Sans, dark → primary when active)
        - `Step/Body` (15px Inter, muted, max-height animated)

**Responsive (md):** single column, no overlap, no left padding

### 2.3 About

**Frame:** `Section/About`
- Direction: Vertical
- Padding: 64px 0
- Fill: `color/neutral/white`

**Child: `About/Container`** (max-width: 1186px)

  **Child: `About/Content`** (max-width: 720px, margin-bottom: 48px)
  - `SectionBadge` (component instance)
  - `Title` (h2, neutral-dark, margin-top: 24px)
  - `Body` (body-lg, neutral-standard) x2 paragraphs

  **Child: `About/Stats`** (Grid: 4-col, gap: 24px, padding: 32px 0, border-top/bottom: neutral-light)
  - Each `Stat` (Vertical, gap: 4px, padding-left: 16px, border-left: 3px primary)
    - `Stat/Value` (h3, bold, neutral-dark)
    - `Stat/Label` (body-sm, muted)

**Responsive (md):** stats → 2-col | (sm): stats → 1-col

### 2.4 Impact

**Frame:** `Section/Impact`
- Direction: Vertical
- Padding: 64px 0
- Fill: `color/secondary/lightest`

**Child: `Impact/Container`** (max-width: 1186px)

  **Child: `Impact/Header`** (margin-bottom: 48px)
  - Badge + Title (h2)

  **Child: `Impact/Columns`** (Grid: 1fr 1fr, gap: 64px)
  - Each `Column`:
    - `Column/Heading` (caption, bold, muted, uppercase, tracking: 0.08em)
    - `Column/List` (Vertical)
      - Each `Item` (Horizontal, gap: 16px, padding: 16px 0, border-bottom: neutral-light)
        - `Item/Number` (body, bold, muted, min-width: 24px)
        - `Item/Text` (body, semibold, Hubot Sans, dark)

**Responsive (md):** single column

### 2.5 Skills

**Frame:** `Section/Skills`
- Direction: Vertical
- Padding: 64px 0
- Fill: `color/neutral/white`

**Child: `Skills/Grid`** (Grid: 4-col, gap: 24px)
- Each `Card` (Vertical, padding: 32px, fill: secondary-lightest, border: border-default, radius: xl)
  - `Card/Title` (body, bold, Hubot Sans, dark, margin-bottom: 16px)
  - `Card/List` (Vertical, gap: 8px)
    - Each `Item` (body-sm, standard, left-padded 16px, orange dot before)

**Responsive (lg):** 2-col | (sm): 1-col

### 2.6 TechnicalAbilities

**Frame:** `Section/Technical`
- Direction: Vertical
- Padding: 64px 0
- Fill: `color/secondary/lightest`

**Child: `Technical/Grid`** (Grid: 4-col, gap: 32px, margin-bottom: 48px)
- Each `Column`:
  - `Column/Title` (body, semibold, dark, border-bottom: 2px primary, padding-bottom: 8px)
  - `Column/List` (Vertical, gap: 8px)
    - Each `Item` (body-sm, standard, orange triangle before)

**Child: `Technical/Also`** (fill: white, border: border-default, radius: xl, padding: 32px)
- `Also/Label` (body, semibold, dark, margin-bottom: 16px)
- `Also/Tags` (Horizontal wrap, gap: 8px)
  - Each `Tag` (body-sm, standard, fill: secondary-lightest, padding: 8px 16px, radius: full)

**Responsive (lg):** 2-col | (sm): 1-col

### 2.7 SelectedWork

**Frame:** `Section/SelectedWork`
- Direction: Vertical
- Padding: 64px 32px
- Fill: `color/neutral/white`

**Child: `SelectedWork/Header`** (center, margin-bottom: 48px)
- Badge + Title (h2)

**Child: `SelectedWork/List`** (Vertical, gap: 32px)
- Each `Card` (Grid: 1fr 1fr, radius: 2xl, overflow: hidden, min-height: 420px)
  - Fill: `color/surface/card-1` (or card-2, card-3 per nth-child)

  **Child: `Card/Body`** (Vertical, gap: 12px, padding: 48px 48px 48px 64px)
  - `Card/Title` (h4, bold, italic, dark)
  - `Card/Tags` (Horizontal wrap, gap: 6px)
    - Each `Tag` (11px, semibold, uppercase, standard, padding: 4px 12px, border: secondary-light, radius: full, fill: white)
  - `Card/Stats` (Horizontal wrap, gap: 6px, margin-top: 12px)
    - Each `Stat` (caption, semibold, muted) with middle dot separator

  **Child: `Card/Visual`** (Fill, overflow: hidden, padding: 24px 24px 24px 0)
  - `Image` (fill, object-fit: cover, radius: lg, shadow: md, scale: 1.08 → 1.0 on hover)

  **Reverse variant:** body order: 2, visual order: 1, visual padding flipped

**Responsive (md):** single column, body padding: 32px, visual height: 260px

### 2.8 Testimonials

**Frame:** `Section/Testimonials`
- Direction: Vertical
- Padding: 64px 0
- Fill: `color/neutral/white`

**Child: `Testimonials/Grid`** (Grid: 3-col, gap: 24px)
- Each `Card` (Vertical, gap: 16px, padding: 32px, fill: secondary-lightest, border: border-default, radius: xl)
  - `Card/Stars` (Horizontal, gap: 2px, color: primary) — 5x star SVG (14x14)
  - `Card/Quote` (body, italic, standard, flex: 1)
  - `Card/Author` (Vertical, gap: 2px, padding-top: 12px, border-top: neutral-light)
    - `Author/Name` (body-sm, semibold, Hubot Sans, dark)
    - `Author/Role` (caption, muted)

**Responsive (lg):** 2-col | (sm): 1-col

### 2.9 FAQ

**Frame:** `Section/FAQ`
- Direction: Vertical
- Padding: 64px 0
- Fill: `#f2f7f9` (→ unify to `color/secondary/lightest`)

**Child: `FAQ/Container`** (Grid: 1fr 1.6fr, gap: 64px, align: start)

  **Child: `FAQ/Left`** (Sticky, top: 100px)
  - `Eyebrow` (caption, bold, primary, uppercase)
  - `Title` (h2, dark)
  - `Intro` (15px, muted, max-width: 320px)

  **Child: `FAQ/Right`** (Vertical)
  - Each `Item` (border-bottom: neutral-light)
    - `Question` (Horizontal, justify: space-between, padding: 24px 0)
      - `Question/Text` (17px, semibold, Hubot Sans, dark)
      - `Question/Toggle` (28x28, 20px, primary, + or ×)
    - `Answer/Wrapper` (max-height animated)
      - `Answer` (15px, standard, padding-bottom: 24px)

**Responsive (md):** single column

### 2.10 ContactCTA

**Frame:** `Section/ContactCTA`
- Direction: Vertical
- Padding: 64px 0
- Fill: `color/neutral/dark`

**Child: `ContactCTA/Content`** (max-width: 640px, centered, text: center)
- `Eyebrow` (caption, bold, primary, uppercase)
- `Title` (h1, white)
- `Body` (body-lg, muted)
- `Actions` (Horizontal, gap: 16px, center)
  - `Button/Primary` (height: 48px, padding: 0 32px, fill: primary, radius: 10px)
  - `Button/Secondary` (height: 48px, padding: 0 32px, border: muted, radius: 10px)

### 2.11 Footer

**Frame:** `Footer`
- Direction: Vertical
- Padding: 48px 0
- Fill: `color/secondary/lightest`

**Child: `Footer/Container`** (max-width: 1186px)
- `Footer/Links` (Horizontal, gap: 32px, margin-bottom: 32px)
  - Each `Link` (body, dark, underline, offset: 4px)
- `Footer/Copy` (body-sm, muted)

### 2.12 SectionBadge (Molecule)

**Frame:** `Badge/Section`
- Direction: Horizontal
- Gap: 8px
- Padding: 6px 12px
- Fill: `color/secondary/lightest`
- Border: `color/border-default`
- Radius: `radius/full`
- Children:
  - `Badge/Icon` (16x16, color: primary)
  - `Badge/Label` (caption, bold, standard, uppercase, tracking: 0.06em)

---

## 3. FIGMA LAYER HIERARCHY

```
Page: Homepage
├── Frame: Hero/Hybrid [Fill, min-height: 100vh, bg: white]
│   ├── Frame: Hero/Nav [Fixed, top: 0, horizontal, space-between]
│   │   ├── Text: Nav/Logo ["Ryan DeBoer"]
│   │   └── Frame: Nav/Links [horizontal, gap: 32px]
│   │       ├── Text: Nav/Link ["About"]
│   │       ├── Text: Nav/Link ["Work"]
│   │       ├── Text: Nav/Link ["Skills"]
│   │       └── Frame: Nav/CTA [pill, border]
│   ├── Frame: Hero/Content [max-width: 1186px, centered]
│   │   └── Frame: Hero/Grid [horizontal, 1fr 1fr, gap: 48px]
│   │       ├── Frame: Hero/Text [vertical]
│   │       │   ├── Frame: Hero/Intro [vertical, gap: 2px]
│   │       │   │   ├── Text: Hero/Label
│   │       │   │   └── Text: Hero/Role
│   │       │   ├── Text: Hero/Headline [typing animation]
│   │       │   ├── Text: Hero/Body
│   │       │   └── Frame: Hero/Actions [horizontal, gap: 16px]
│   │       │       ├── Instance: Button/Primary
│   │       │       └── Instance: Button/Secondary
│   │       └── Frame: Hero/Visual [420x420, centered]
│   │           ├── Frame: Hero/OrangeBG [380x380, circle, rotating]
│   │           ├── Frame: Hero/BorderRing [380x380, circle, stroke]
│   │           └── Frame: Hero/ProfileCircle [374x374, circle, clip]
│   │               └── Image: Hero/ProfileImg
│   └── Frame: Hero/Proficiencies [horizontal, gap: 32px, shadow-sm]
│       ├── Frame: Prof/Section [vertical]
│       │   ├── Text: Prof/Label
│       │   └── Frame: Prof/Icons [horizontal, overlapping -5px]
│       │       └── Frame: Prof/Icon [30x30, circle] x11
│       ├── Frame: Prof/Divider [1px x 40px]
│       └── Frame: Prof/Section [vertical]
│           ├── Text: Prof/Stars
│           ├── Text: Prof/Text
│           └── Text: Prof/Link
│
├── Frame: Section/HowIWork [fill, bg: secondary-lightest]
│   └── Frame: HowIWork/Container [max-1186px]
│       ├── Frame: HowIWork/Header [vertical]
│       │   ├── Text: Eyebrow
│       │   └── Text: Title
│       └── Frame: HowIWork/Layout [grid: 1.15fr 1fr]
│           ├── Frame: HowIWork/Visual
│           │   ├── Frame: HowIWork/ImageFrame [radius-xl, shadow-lg]
│           │   │   └── Frame: HowIWork/Placeholder [4:3]
│           │   └── Text: HowIWork/StepCount
│           └── Frame: HowIWork/Steps [vertical, padding-left: 48px]
│               └── Frame: HowIWork/Step [horizontal, gap: 16px] x4
│                   ├── Frame: Step/Indicator [3px x 40px]
│                   │   └── Frame: Step/Progress [fill: primary]
│                   └── Frame: Step/Content [vertical]
│                       ├── Text: Step/Label
│                       └── Text: Step/Body
│
├── Frame: Section/About [fill, bg: white]
│   └── Frame: About/Container [max-1186px]
│       ├── Frame: About/Content [max-720px]
│       │   ├── Instance: Badge/Section ["About Me"]
│       │   ├── Text: About/Title
│       │   ├── Text: About/Body
│       │   └── Text: About/Body
│       └── Frame: About/Stats [grid: 4-col, border-top/bottom]
│           └── Frame: About/Stat [vertical, border-left: primary] x4
│               ├── Text: Stat/Value
│               └── Text: Stat/Label
│
├── Frame: Section/Impact [fill, bg: secondary-lightest]
│   └── Frame: Impact/Container [max-1186px]
│       ├── Frame: Impact/Header
│       │   ├── Instance: Badge/Section ["Impact"]
│       │   └── Text: Impact/Title
│       └── Frame: Impact/Columns [grid: 1fr 1fr, gap: 64px]
│           ├── Frame: Impact/Column [vertical]
│           │   ├── Text: Column/Heading
│           │   └── Frame: Column/List [vertical]
│           │       └── Frame: Column/Item [horizontal] x5
│           │           ├── Text: Item/Number
│           │           └── Text: Item/Text
│           └── Frame: Impact/Column [vertical]
│               ├── Text: Column/Heading
│               └── Frame: Column/List [vertical]
│                   └── Frame: Column/Item [horizontal] x5
│
├── Frame: Section/Skills [fill, bg: white]
│   └── Frame: Skills/Container [max-1186px]
│       ├── Frame: Skills/Header [max-600px]
│       │   ├── Instance: Badge/Section ["Strengths"]
│       │   ├── Text: Skills/Title
│       │   └── Text: Skills/Subtitle
│       └── Frame: Skills/Grid [grid: 4-col, gap: 24px]
│           └── Frame: Skills/Card [vertical, bg: secondary-lightest] x4
│               ├── Text: Card/Title
│               └── Frame: Card/List [vertical, gap: 8px]
│                   └── Frame: Card/Item [horizontal] x4
│                       ├── Ellipse: Card/Dot [6x6, primary]
│                       └── Text: Card/ItemText
│
├── Frame: Section/Technical [fill, bg: secondary-lightest]
│   └── Frame: Technical/Container [max-1186px]
│       ├── Frame: Technical/Header [max-600px]
│       ├── Frame: Technical/Grid [grid: 4-col, gap: 32px]
│       │   └── Frame: Technical/Column [vertical] x4
│       │       ├── Text: Column/Title [border-bottom: primary]
│       │       └── Frame: Column/List [vertical, gap: 8px]
│       │           └── Frame: Column/Item x5
│       └── Frame: Technical/Also [bg: white, border, radius-xl]
│           ├── Text: Also/Label
│           └── Frame: Also/Tags [horizontal wrap, gap: 8px]
│               └── Frame: Also/Tag [pill, bg: secondary-lightest] x11
│
├── Frame: Section/SelectedWork [fill, bg: white]
│   └── Frame: SelectedWork/Container [max-1186px]
│       ├── Frame: SelectedWork/Header [center]
│       │   ├── Instance: Badge/Section ["Case Studies"]
│       │   └── Text: SelectedWork/Title
│       └── Frame: SelectedWork/List [vertical, gap: 32px]
│           └── Frame: SelectedWork/Card [grid: 1fr 1fr, radius: 2xl] x3
│               ├── Frame: Card/Body [vertical, gap: 12px, padding: 48/48/48/64]
│               │   ├── Text: Card/Title [h4, italic]
│               │   ├── Frame: Card/Tags [horizontal wrap, gap: 6px]
│               │   │   └── Frame: Card/Tag [pill, border] xN
│               │   └── Frame: Card/Stats [horizontal wrap, gap: 6px]
│               │       └── Text: Card/Stat xN
│               └── Frame: Card/Visual [fill, clip, padding: 24px]
│                   └── Image: Card/Image [scale: 1.08, shadow-md]
│
├── Frame: Section/Testimonials [fill, bg: white]
│   └── Frame: Testimonials/Container [max-1186px]
│       ├── Frame: Testimonials/Header
│       │   ├── Instance: Badge/Section ["Testimonials"]
│       │   └── Text: Testimonials/Title
│       └── Frame: Testimonials/Grid [grid: 3-col, gap: 24px]
│           └── Frame: Testimonials/Card [vertical, bg: secondary-lightest] x6
│               ├── Frame: Card/Stars [horizontal, gap: 2px]
│               │   └── Icon: Star [14x14, primary] x5
│               ├── Text: Card/Quote [italic]
│               └── Frame: Card/Author [vertical, border-top]
│                   ├── Text: Author/Name
│                   └── Text: Author/Role
│
├── Frame: Section/FAQ [fill, bg: #f2f7f9]
│   └── Frame: FAQ/Container [grid: 1fr 1.6fr, gap: 64px]
│       ├── Frame: FAQ/Left [sticky]
│       │   ├── Text: FAQ/Eyebrow
│       │   ├── Text: FAQ/Title
│       │   └── Text: FAQ/Intro
│       └── Frame: FAQ/Right [vertical]
│           └── Frame: FAQ/Item [vertical, border-bottom] x6
│               ├── Frame: FAQ/Question [horizontal, space-between]
│               │   ├── Text: Question/Text
│               │   └── Text: Question/Toggle [+/×]
│               └── Frame: FAQ/Answer [collapsible]
│                   └── Text: Answer/Text
│
├── Frame: Section/ContactCTA [fill, bg: neutral-dark]
│   └── Frame: ContactCTA/Content [max-640px, centered, text-center]
│       ├── Text: CTA/Eyebrow
│       ├── Text: CTA/Title
│       ├── Text: CTA/Body
│       └── Frame: CTA/Actions [horizontal, gap: 16px, center]
│           ├── Instance: Button/Primary
│           └── Instance: Button/Secondary
│
└── Frame: Footer [fill, bg: secondary-lightest]
    └── Frame: Footer/Container [max-1186px]
        ├── Frame: Footer/Links [horizontal, gap: 32px]
        │   ├── Text: Footer/Link ["LinkedIn"]
        │   └── Text: Footer/Link ["rdeboer180@gmail.com"]
        └── Text: Footer/Copy ["© 2026 Ryan De Boer"]
```

---

## 4. TAILWIND CLEANUP REQUIRED

| File | Line | Issue |
|---|---|---|
| `App.tsx:43` | `className="min-h-screen bg-white"` | Replace with SCSS class or inline |

---

## 5. FIGMA FILE STRUCTURE RECOMMENDATION

```
Figma File: "Ryan De Boer Portfolio — Design System"
├── Page: Tokens
│   ├── Frame: Colors (all swatches with variable names)
│   ├── Frame: Typography (all text styles)
│   ├── Frame: Spacing (visual scale)
│   ├── Frame: Radius (visual scale)
│   └── Frame: Shadows (visual samples)
│
├── Page: Components
│   ├── Frame: Badge/Section (component set)
│   ├── Frame: Button/Primary (component set: SM, MD, LG, states)
│   ├── Frame: Button/Secondary (component set: SM, MD, LG, states)
│   ├── Frame: Tag/Pill (component)
│   ├── Frame: Card/Testimonial (component)
│   ├── Frame: Card/Work (component, variant: default + reverse)
│   ├── Frame: FAQ/Item (component, variant: collapsed + expanded)
│   ├── Frame: Stat/Block (component)
│   ├── Frame: Impact/Item (component)
│   └── Frame: PhoneFrame (component)
│
├── Page: Homepage — Desktop (1440px)
│   └── [Full layer tree from Section 3]
│
├── Page: Homepage — Tablet (768px)
│   └── [Responsive variants]
│
└── Page: Homepage — Mobile (375px)
    └── [Responsive variants]
```
