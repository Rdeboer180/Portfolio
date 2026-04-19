# Portfolio Image Sanitization Migration

## Overview

This migration updates all portfolio case study images to use sanitized, audit-approved versions that protect proprietary and sensitive information.

**Date Completed:** April 19, 2026  
**Manifest Source:** `public/assets/portfolio-safe/codebase-handoff.json`

## What Changed

### 1. Sanitized Image Assets
- **Location:** `/public/assets/portfolio-safe/` (reference copy)
- **Working Location:** `/public/images/work/` (active use)
- All portfolio images have been replaced with sanitized versions from the audit

### 2. Image References Updated
- **File:** `src/data/projects.ts`
- Updated all image `src` paths to reference sanitized versions (`_safe` or `_blurred` suffixes)
- **Scope Rule:** Only images under `supporting/` directories are actually used in the site and were processed per the manifest

### 3. Overlay Cards for Proprietary Content
- **New Component:** `src/components/OverlayCard.tsx`
- **Styling:** `src/styles/components/_overlay-card.scss`
- Images marked for "replace_with_overlay" now render as styled placeholder cards with:
  - Subtle diagonal striped background
  - Centered overlay text explaining proprietary constraints
  - Rounded corners and shadow consistent with image cards
  - Optional captions
  - Proper ARIA labels for accessibility

### 4. ProjectImage Interface Extension
- **File:** `src/data/projects.ts`
- Extended `ProjectImage` interface to support overlay properties:
  ```typescript
  isOverlay?: boolean;
  overlayText?: string;
  src?: string; // now optional to support overlay-only configs
  ```

### 5. CaseStudyPage Component Updates
- **File:** `src/components/CaseStudyPage.tsx`
- Imported `OverlayCard` component
- Updated `renderImg()` to detect `isOverlay` flag and render `<OverlayCard>` instead of `<img>`
- Maintains existing image layouts (full, half, mobile) for both regular and overlay cards

### 6. Proprietary Constraints Note
- Added explanatory note to the AEM Component System case study (last project) in the `outcomeNote`
- Appears on the case study detail page to contextualize why certain images are omitted

## File Inventory

### Actions by Case Study

| Case Study | Keep | Blurred | Overlay |
|-----------|------|---------|---------|
| WheelRack | 17 | 3 | 11 |
| Tire Categories | 9 | — | 21 |
| Tire Rack Winter | 7 | 2 | 5 |
| Heatherwood | 17 | — | — |
| Landing Pages | 8 | — | 6 |
| AEM Component System | 6 | 1 | 7 |
| Tire Rack | 1 | — | — |
| **Total** | **65** | **6** | **50** |

### Cleanup
- **Deleted:** 125 old unsanitized image files (replaced by portfolio-safe versions)
- **Removed:** All non-supporting portfolio files per scope rule

## How to Add Future Portfolio Images

1. **Always audit first:** Run images through the portfolio audit process to identify sensitive/proprietary content
2. **Update the manifest:** Add entries to `codebase-handoff.json` with:
   - `original_path`: your image path
   - `new_path`: sanitized path (or `null` for overlay)
   - `action`: "keep", "replace_with_blurred", or "replace_with_overlay"
   - `alt_text`, `caption`, `overlay_text` as needed
3. **Run the migration script:** Process the manifest to update code and copy files
4. **Test both regular and overlay rendering:** Verify images display correctly on case study pages

## File Locations

- **Sanitized assets (reference):** `/public/assets/portfolio-safe/`
- **Active image files:** `/public/images/work/{case-study}/`
- **Component:** `/src/components/OverlayCard.tsx`
- **Styles:** `/src/styles/components/_overlay-card.scss`
- **Project data:** `/src/data/projects.ts`
- **Case study page:** `/src/components/CaseStudyPage.tsx`

## Testing Checklist

- [ ] All case study pages load without console errors
- [ ] Images with `action: keep` and `action: replace_with_blurred` display correctly
- [ ] Images with `action: replace_with_overlay` render OverlayCard components
- [ ] Overlay cards display striped background and centered text
- [ ] Captions appear below both regular images and overlay cards
- [ ] Mobile images (phone frames) render correctly
- [ ] Lightbox zoom functionality works for all non-overlay images
- [ ] ARIA labels are present on overlay cards
- [ ] Proprietary constraints note appears in AEM case study outcome

## Notes

- The OverlayCard component uses a 16/10 aspect ratio to match portfolio image sizing
- Overlay text is constrained to ≤60ch for readability
- The striped background (#efece6 to #e6e3dc) provides subtle visual distinction
- All changes maintain backward compatibility with existing case study layouts
