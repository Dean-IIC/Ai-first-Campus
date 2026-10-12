# Design

The design system for the HKBK College of Engineering website: tokens, type, layout, components, patterns and accessibility. Implementation lives in `app/globals.css` (tokens), `components/ui/` (shadcn primitives) and `components/features/` (patterns).

## 1. Principles

1. **Clear and institutional.** White, calm pages with colour used to tell visitors where they are, not for decoration.
2. **Colour means section.** Each part of the site has one colour, used on its icons, panel edges, active tabs, banner line and menu highlight.
3. **Everything visible.** Menus show every item; nothing important hides behind a single "Menu" button.
4. **Honest content.** Placeholders look like placeholders ("Coming soon", dashed cards, "Sample entry" tags).
5. **Both themes, always.** Every component works in light and dark mode through tokens.
6. **Accessible by default.** WCAG 2.2 AA contrast, keyboard access and visible focus in both themes.

## 2. Colour tokens

Semantic tokens (shadcn/ui naming), defined on `:root` and `.dark`:

| Token | Light | Dark | Use |
| --- | --- | --- | --- |
| `background` | `#ffffff` | `#0b1220` | Page |
| `foreground` | `#172033` | `#e3e9f3` | Body text |
| `card` | `#ffffff` | `#111b2e` | Panels, cards, header row |
| `popover` | `#ffffff` | `#111b2e` | Mega menus |
| `primary` / `primary-foreground` | `#123e7c` / `#ffffff` | `#8db4ff` / `#0a1730` | Buttons, links |
| `secondary`, `accent` | `#e8eff9` | `#1a2740` | Subtle fills, hovers |
| `muted` / `muted-foreground` | `#f5f7fa` / `#5b6576` | `#16223a` / `#9aa8bf` | Quiet surfaces, secondary text |
| `border` / `input` | `#e1e6ee` / `#d5dce7` | `#24324d` / `#2f3f5e` | Lines, field borders |
| `ring` | `#f2a900` | `#f2a900` | Focus rings |
| `destructive` | `#b42318` | `#f97066` | Errors |
| `heading` | `#0a2a57` | `#f1f5fb` | Headings |
| `brand-tint` | `#e8eff9` | `#13213a` | Banners, monograms |

Fixed brand colours (same in both themes): `brand #123e7c`, `brand-dark #0a2a57` (menu bar, footer, big-numbers band), `gold #f2a900`, `gold-hover #ffbb1f`, `gold-dark #8f6200`.

### Section colours

| Tone | Solid (`t-*`) | Dark-mode text (`t-*-light`) | Light tint / dark tint | Sections |
| --- | --- | --- | --- | --- |
| blue | `#1a4f9c` | `#8db4ff` | `#e8eff9` / `#15264a` | Home, About, Placements, IQAC |
| green | `#1e7a4c` | `#6fd3a0` | `#e4f3ea` / `#12302a` | Programmes, Departments |
| amber | `#925700` | `#f2b45a` | `#fcf0da` / `#33260f` | Centre of Excellence, MoUs, IDEA Lab |
| rose | `#a3253d` | `#f38aa0` | `#fae7eb` / `#3a1720` | IEEE, news |
| violet | `#5b3fa6` | `#b9a5ff` | `#eeeaf8` / `#241b45` | Houses |
| teal | `#0b7480` | `#5fd0dc` | `#e0f2f4` / `#0f2d33` | AI First Campus, Quantum Ready Campus |

Rules:
- Use the `TONE` map in `lib/ui.ts` (`text`, `bg`, `tint`, `borderTop`, `borderLeft`, `tabActive`, `hoverTint`, `activeRow`, `dotActive`, `glow`). Never build class names at runtime.
- Section colour as text always pairs with its light variant: `text-t-teal dark:text-t-teal-light` (the `TONE` map does this).
- Amber was darkened to `#925700` so 13px badge text meets 4.5:1 on its tint.

## 3. Typography

| Role | Font | Size and weight |
| --- | --- | --- |
| Body | IBM Plex Sans | 16px / 1.6, regular |
| Page title (banner) | Plex Sans | 30-40px, bold |
| Home hero | Plex Sans | 36-52px, bold, 1.1 line height |
| Section heading | Plex Sans | 24-28px, bold, with a 6px coloured bar |
| Card title | Plex Sans | 18px, semibold |
| Leadership letters, vision statements, quotes | IBM Plex Serif | 17-20px, 1.7-1.8 line height |
| Menu items | Plex Sans | 14px, semibold |
| Footer links and headings | Plex Sans | 12px (headings bold gold); bottom bar 11px |

Sentence case everywhere. No all-caps labels. Fonts are self-hosted (Fontsource).

## 4. Layout

- **Containers:** `shell` = `max-w-7xl` with 16/24/32px side padding; `barWidth` = `max-w-[90rem]` for the menu bar and logo row (both in `lib/ui.ts`).
- **Breakpoints:** mobile first; `sm` 640, `md` 768, `lg` 1024, `xl` 1280, `2xl` 1536.
- **Inner pages:** banner with breadcrumb, then the content in one column at full container width. There is no left panel.
- **Header:** sticky navy menu bar at the very top (sticky from `xl`), then a white logo row with affiliation, address and theme toggle.
- **Spacing:** sections separated by 56px (`pt-14`); cards use 20-24px padding; radii 12-16px for cards and panels, 6px for buttons and inputs.

## 5. Components

### Primitives (`components/ui/`)

Button (variants: default, gold, outline, secondary, ghost, link, destructive; sizes: default, sm, lg, icon), Card, Badge (default, secondary, outline, muted, dashed), Tabs (Radix), Input, Textarea, Label (Radix), Checkbox (native), NativeSelect (native), Separator (Radix), Skeleton, Alert (default, success, destructive).

### Patterns (`components/features/`)

| Pattern | Component | Notes |
| --- | --- | --- |
| Panel | `content/panel.tsx` | Card with optional header, icon tile and coloured top edge |
| Highlighted banner name | `layout/page-banner.tsx` (`prefix`, `watermark`) | Small prefix line, name in the section's gradient (`TONE[tone].gradientText`), faint watermark label; used on department pages |
| Statement tile | `departments/statement-tile.tsx` | Vision and mission cards: gradient icon tile, large faded quotation mark, tinted surface, gradient base bar |
| Information tiles | `departments/department-facts.tsx` | Icon tile with label and value (programme, department, research centre) |
| Folder tabs | `content/content-tabs.tsx` | Radix Tabs; every panel stays in the HTML; URL hash opens a tab |
| Section heading | `content/bits.tsx` `SectionHeading` | Coloured bar + title + intro + optional action |
| Status pill, chip, sample tag, date badge, monogram | `content/bits.tsx` | Built on Badge |
| Mega menu | `navigation/mega-menu.tsx` | Link columns + feature card with picture and button; frosted background |
| Featured message (every leadership message) | `people/featured-message.tsx` | Navy gradient header, gold-framed portrait, pull quote, name in gold serif; letter with italic greeting, drop cap and signature in the theme blue |
| AI Faculty Champion card | `people/champion-view.tsx` | 120px circular photo with a solid teal ring (dashed placeholder without a photo); bold navy name, designation, grey department, optional LinkedIn mark; lifts on hover |
| Edit mode (`?edit=1`) | `people/champion-grid.tsx`, `champion-crop-dialog.tsx`, `champion-edit-fields.tsx`, `champion-editor-toolbar.tsx`, `champion-drafts.ts` | Inline fields, circular photo crop, Clear card, Export update (.zip); visible only with `?edit=1` |
| Person slot | `people/person-slot.tsx` | Real person or numbered dashed placeholder |
| Big numbers | `home/key-figures.tsx` + `count-up.tsx` | Glass tiles on a darkened campus photo; rows of six, centred |
| Infographics | `infographics/` | Process steps, milestone timeline, donut chart |
| Forms | `forms/` | FormField (label, hint, error), ExtraFieldInput, EnquiryForm with Alert feedback |

## 6. Iconography

Lucide icons, `aria-hidden`, 16-24px. Initiative icons come from `lib/portals.tsx`.

## 7. Imagery

| Image | File | Use |
| --- | --- | --- |
| College logo | `public/images/hkbk-logo.png` (256px, palette PNG) | Header, footer (on a white disc), favicon (`app/icon.png`) |
| Campus photograph | `public/images/campus.webp` | Hero, About, big-numbers background, mega-menu feature |
| AI illustration | `public/images/ai-network.webp` | AI First pages, mega-menu feature |
| Quantum illustration | `public/images/quantum-computer.webp` | Quantum Ready Campus, Labs feature |
| Bloch sphere | `public/images/bloch-sphere.webp` | Quantum Ready Campus (on a white backing in dark mode) |

Photographs must be owned by the college or used with permission. Every image has accurate alt text in `lib/site.ts`; decorative images use `alt=""`.

## 8. Motion and effects

- Transitions 150-200ms on colour, shadow and transform; hover lifts of 2px on tiles.
- Count-up on the big numbers when they scroll into view; dropdowns fade and slide 4px.
- Glassmorphism only over photos or dark surfaces: menu bar, hero location badge, big-numbers tiles, mega menus. Translucent fill, `backdrop-blur`, soft glow.
- `prefers-reduced-motion: reduce` disables animation globally.

## 9. Accessibility

- WCAG 2.2 AA; axe-core A/AA audits pass in light and dark mode on key pages.
- Focus: 2-3px gold ring on every interactive element.
- Keyboard: menu dropdowns open with focus (wide screens) or Enter (narrow); Escape closes; tabs use arrow keys.
- Forms: visible labels, "(optional)" markers, `aria-invalid` and error text per field, Alert summary.
- Landmarks: skip link, `nav` labels ("Main", "Footer"), one `h1` per page.

## 10. Content style

Write for a parent or student reading on a phone: short sentences, plain words, sentence case, buttons that say what they do ("Send enquiry", not "Submit"). No unverifiable claims ("best college"). Mark drafts with `status: draft` in front matter.
