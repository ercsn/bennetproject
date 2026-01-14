# 🎮 Minecraft-Themed Dashboard Style Specification

## 1. Visual Vibe

**"Survival HUD meets Crafting Table"**

The interface should feel like peering into a Minecraft inventory system—blocky, tactile, and crafted from familiar materials. Think deepslate stone walls, oak wood panels, and iron-reinforced corners. Every element should feel "placed" with chunky borders and inset bevels, as if each stat tile is an inventory slot holding precious data. Subtle pixel noise and tiled textures give surfaces depth without overwhelming the content. Interactions should be satisfying: buttons press inward, wins pulse with emerald glow, achievements toast up like item pickups. The pixel font anchors everything in retro-gaming nostalgia while the color palette keeps it grounded in Minecraft's underground survival aesthetic.

---

## 2. Design Tokens (CSS Variables)

### Color Palette
```css
:root {
  /* Background & Foundations */
  --mc-deepslate: #1a1a1a;           /* Main dark background */
  --mc-obsidian: #0d0d0d;            /* Darker accents/shadows */
  --mc-stone: #7f7f7f;               /* Mid-tone gray */
  --mc-cobblestone: #5a5a5a;         /* Darker stone tone */

  /* Panel Materials */
  --mc-oak-light: #9c7854;           /* Oak wood light */
  --mc-oak-dark: #6b4423;            /* Oak wood dark */
  --mc-iron: #d8d8d8;                /* Iron/steel accents */
  --mc-iron-dark: #4a4a4a;           /* Darker iron */

  /* Game States */
  --mc-emerald: #50c878;             /* Win/success */
  --mc-emerald-glow: rgba(80, 200, 120, 0.6);
  --mc-redstone: #dc143c;            /* Loss/danger */
  --mc-redstone-glow: rgba(220, 20, 60, 0.6);
  --mc-gold: #ffaa00;                /* Highlight/achievement */
  --mc-gold-glow: rgba(255, 170, 0, 0.6);
  --mc-diamond: #5dade2;             /* Info/neutral */

  /* Text */
  --mc-text-primary: #f0f0f0;        /* Main text */
  --mc-text-secondary: #b0b0b0;      /* Secondary text */
  --mc-text-dim: #707070;            /* Dimmed text */

  /* Spacing */
  --mc-space-xs: 4px;
  --mc-space-sm: 8px;
  --mc-space-md: 16px;
  --mc-space-lg: 24px;
  --mc-space-xl: 32px;

  /* Borders */
  --mc-border-thin: 2px;
  --mc-border-thick: 4px;
  --mc-border-chunky: 6px;

  /* Border Radius (minimal for blocky feel) */
  --mc-radius-none: 0px;
  --mc-radius-sm: 2px;
  --mc-radius-md: 4px;

  /* Shadows (beveled/inset look) */
  --mc-shadow-inset:
    inset 2px 2px 0 rgba(0, 0, 0, 0.5),
    inset -2px -2px 0 rgba(255, 255, 255, 0.15);

  --mc-shadow-outset:
    2px 2px 0 rgba(0, 0, 0, 0.5),
    -2px -2px 0 rgba(255, 255, 255, 0.15) inset;

  --mc-shadow-raised:
    inset -2px -2px 0 rgba(0, 0, 0, 0.5),
    inset 2px 2px 0 rgba(255, 255, 255, 0.15);

  --mc-shadow-pressed:
    inset 3px 3px 6px rgba(0, 0, 0, 0.7);

  /* Glows */
  --mc-glow-emerald:
    0 0 8px var(--mc-emerald-glow),
    0 0 16px var(--mc-emerald-glow);

  --mc-glow-redstone:
    0 0 8px var(--mc-redstone-glow),
    0 0 16px var(--mc-redstone-glow);

  --mc-glow-gold:
    0 0 8px var(--mc-gold-glow),
    0 0 16px var(--mc-gold-glow);
}
```

### Typography
```css
:root {
  /* Pixel Fonts (load from Google Fonts) */
  --mc-font-primary: 'Press Start 2P', cursive;  /* Chunky, authentic */
  --mc-font-secondary: 'VT323', monospace;       /* Lighter, more readable */

  /* Font Sizes (keep them blocky) */
  --mc-text-xs: 8px;
  --mc-text-sm: 10px;
  --mc-text-md: 12px;
  --mc-text-lg: 16px;
  --mc-text-xl: 20px;
  --mc-text-2xl: 28px;
  --mc-text-3xl: 36px;
}
```

---

## 3. Component Styles

### Base Body & Container
```css
body {
  font-family: var(--mc-font-secondary);
  background-color: var(--mc-deepslate);
  background-image:
    /* Pixel noise overlay */
    url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PGZpbHRlciBpZD0ibm9pc2UiPjxmZVR1cmJ1bGVuY2UgdHlwZT0iZnJhY3RhbE5vaXNlIiBiYXNlRnJlcXVlbmN5PSIwLjkiIG51bU9jdGF2ZXM9IjQiIHN0aXRjaFRpbGVzPSJzdGl0Y2giLz48L2ZpbHRlcj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsdGVyPSJ1cmwoI25vaXNlKSIgb3BhY2l0eT0iMC4wNSIvPjwvc3ZnPg=='),
    /* Subtle stone texture */
    repeating-linear-gradient(
      90deg,
      transparent,
      transparent 2px,
      rgba(255, 255, 255, 0.01) 2px,
      rgba(255, 255, 255, 0.01) 4px
    ),
    repeating-linear-gradient(
      0deg,
      transparent,
      transparent 2px,
      rgba(255, 255, 255, 0.01) 2px,
      rgba(255, 255, 255, 0.01) 4px
    );
  color: var(--mc-text-primary);
  min-height: 100vh;
  image-rendering: pixelated;
  image-rendering: crisp-edges;
}
```

### Top HUD Bar (Header)
```css
header {
  background: linear-gradient(180deg, var(--mc-oak-light) 0%, var(--mc-oak-dark) 100%);
  border: var(--mc-border-thick) solid var(--mc-iron-dark);
  border-radius: var(--mc-radius-sm);
  box-shadow: var(--mc-shadow-outset);
  padding: var(--mc-space-lg) var(--mc-space-xl);
  margin-bottom: var(--mc-space-lg);
  position: relative;
}

header::before {
  /* Wood grain texture overlay */
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image:
    repeating-linear-gradient(
      90deg,
      transparent,
      transparent 16px,
      rgba(0, 0, 0, 0.1) 16px,
      rgba(0, 0, 0, 0.1) 18px
    );
  pointer-events: none;
  border-radius: var(--mc-radius-sm);
}

header h1 {
  font-family: var(--mc-font-primary);
  font-size: var(--mc-text-2xl);
  color: var(--mc-text-primary);
  text-shadow:
    2px 2px 0 rgba(0, 0, 0, 0.8),
    4px 4px 0 rgba(0, 0, 0, 0.4);
  letter-spacing: 2px;
  margin-bottom: var(--mc-space-md);
}

nav {
  display: flex;
  gap: var(--mc-space-sm);
}

nav a {
  font-family: var(--mc-font-secondary);
  font-size: var(--mc-text-md);
  padding: var(--mc-space-sm) var(--mc-space-md);
  background: var(--mc-stone);
  border: var(--mc-border-thin) solid var(--mc-iron-dark);
  box-shadow: var(--mc-shadow-raised);
  color: var(--mc-text-primary);
  text-decoration: none;
  text-transform: uppercase;
  transition: all 0.1s ease;
  position: relative;
}

nav a:hover {
  background: var(--mc-iron);
  transform: translateY(-1px);
}

nav a:active {
  box-shadow: var(--mc-shadow-pressed);
  transform: translateY(1px);
}

nav a.active {
  background: var(--mc-iron);
  box-shadow: var(--mc-shadow-inset);
  color: var(--mc-gold);
}
```

### Stat Tile (Inventory Slot Style)
```css
.stat-card {
  background: linear-gradient(135deg, var(--mc-cobblestone) 0%, var(--mc-deepslate) 100%);
  border: var(--mc-border-thick) solid var(--mc-iron-dark);
  border-radius: var(--mc-radius-sm);
  box-shadow: var(--mc-shadow-inset);
  padding: var(--mc-space-lg);
  text-align: center;
  position: relative;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Corner reinforcements (iron brackets) */
.stat-card::before,
.stat-card::after {
  content: '';
  position: absolute;
  width: 8px;
  height: 8px;
  background: var(--mc-iron-dark);
  border: 1px solid var(--mc-iron);
}

.stat-card::before {
  top: -2px;
  left: -2px;
  border-radius: 0 0 2px 0;
}

.stat-card::after {
  top: -2px;
  right: -2px;
  border-radius: 0 0 0 2px;
}

.stat-card:hover {
  transform: translateY(-4px) scale(1.02);
  box-shadow:
    var(--mc-shadow-inset),
    0 4px 0 rgba(0, 0, 0, 0.5);
}

.stat-value {
  font-family: var(--mc-font-primary);
  font-size: var(--mc-text-3xl);
  color: var(--mc-text-primary);
  text-shadow: 2px 2px 0 rgba(0, 0, 0, 0.8);
  margin-bottom: var(--mc-space-sm);
}

.stat-label {
  font-family: var(--mc-font-secondary);
  font-size: var(--mc-text-sm);
  color: var(--mc-text-secondary);
  text-transform: uppercase;
  letter-spacing: 1px;
}

/* Win Stat Tile */
.stat-card.win {
  background: linear-gradient(135deg, #1a5a3a 0%, #0d2d1d 100%);
  border-color: var(--mc-emerald);
  animation: pulse-emerald 2s ease-in-out infinite;
}

.stat-card.win .stat-value {
  color: var(--mc-emerald);
}

/* Loss Stat Tile */
.stat-card.loss {
  background: linear-gradient(135deg, #5a1a1a 0%, #2d0d0d 100%);
  border-color: var(--mc-redstone);
  animation: pulse-redstone 2s ease-in-out infinite;
}

.stat-card.loss .stat-value {
  color: var(--mc-redstone);
}

@keyframes pulse-emerald {
  0%, 100% { box-shadow: var(--mc-shadow-inset); }
  50% { box-shadow: var(--mc-shadow-inset), var(--mc-glow-emerald); }
}

@keyframes pulse-redstone {
  0%, 100% { box-shadow: var(--mc-shadow-inset); }
  50% { box-shadow: var(--mc-shadow-inset), var(--mc-glow-redstone); }
}
```

### Panel/Section (Oak Wood Panel)
```css
.chart-section,
.matches-section,
.filter-section,
.form-section {
  background: linear-gradient(180deg, var(--mc-oak-light) 0%, var(--mc-oak-dark) 100%);
  border: var(--mc-border-chunky) solid var(--mc-iron-dark);
  border-radius: var(--mc-radius-md);
  box-shadow:
    var(--mc-shadow-outset),
    0 8px 16px rgba(0, 0, 0, 0.6);
  padding: var(--mc-space-xl);
  position: relative;
  margin-bottom: var(--mc-space-lg);
}

/* Wood plank texture */
.chart-section::before,
.matches-section::before,
.filter-section::before,
.form-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image:
    repeating-linear-gradient(
      90deg,
      transparent,
      transparent 24px,
      rgba(0, 0, 0, 0.15) 24px,
      rgba(0, 0, 0, 0.15) 26px
    ),
    repeating-linear-gradient(
      0deg,
      transparent,
      transparent 100px,
      rgba(0, 0, 0, 0.08) 100px,
      rgba(0, 0, 0, 0.08) 102px
    );
  pointer-events: none;
  border-radius: var(--mc-radius-md);
}

.chart-section h2,
.matches-section h2,
.form-section h2 {
  font-family: var(--mc-font-primary);
  font-size: var(--mc-text-xl);
  color: var(--mc-text-primary);
  text-shadow: 2px 2px 0 rgba(0, 0, 0, 0.8);
  margin-bottom: var(--mc-space-lg);
  letter-spacing: 1px;
}
```

### Chunky Button (Crafting Button Style)
```css
.btn {
  font-family: var(--mc-font-secondary);
  font-size: var(--mc-text-md);
  padding: var(--mc-space-md) var(--mc-space-lg);
  border: var(--mc-border-thick) solid;
  border-radius: var(--mc-radius-sm);
  cursor: pointer;
  text-transform: uppercase;
  transition: all 0.1s ease;
  position: relative;
  letter-spacing: 1px;
}

.btn-primary {
  background: linear-gradient(180deg, var(--mc-emerald) 0%, #2d8a59 100%);
  border-color: #1a5a3a;
  color: var(--mc-text-primary);
  text-shadow: 1px 1px 0 rgba(0, 0, 0, 0.8);
  box-shadow: var(--mc-shadow-raised);
}

.btn-primary:hover {
  background: linear-gradient(180deg, #60d890 0%, var(--mc-emerald) 100%);
  transform: translateY(-2px);
  box-shadow:
    var(--mc-shadow-raised),
    0 4px 0 rgba(0, 0, 0, 0.5);
}

.btn-primary:active {
  transform: translateY(1px);
  box-shadow: var(--mc-shadow-pressed);
}

.btn-secondary {
  background: linear-gradient(180deg, var(--mc-stone) 0%, var(--mc-cobblestone) 100%);
  border-color: var(--mc-iron-dark);
  color: var(--mc-text-primary);
  text-shadow: 1px 1px 0 rgba(0, 0, 0, 0.8);
  box-shadow: var(--mc-shadow-raised);
}

.btn-secondary:hover {
  background: linear-gradient(180deg, #8f8f8f 0%, var(--mc-stone) 100%);
  transform: translateY(-2px);
}

.btn-secondary:active {
  transform: translateY(1px);
  box-shadow: var(--mc-shadow-pressed);
}

.btn-success {
  background: linear-gradient(180deg, var(--mc-gold) 0%, #cc8800 100%);
  border-color: #996600;
  color: var(--mc-obsidian);
  text-shadow: 1px 1px 0 rgba(255, 255, 255, 0.5);
  box-shadow: var(--mc-shadow-raised);
}

.btn-success:hover {
  background: linear-gradient(180deg, #ffbb00 0%, var(--mc-gold) 100%);
  transform: translateY(-2px);
  box-shadow:
    var(--mc-shadow-raised),
    var(--mc-glow-gold);
}
```

### XP Progress Bar
```css
.xp-bar-container {
  background: var(--mc-obsidian);
  border: var(--mc-border-thick) solid var(--mc-iron-dark);
  border-radius: var(--mc-radius-sm);
  box-shadow: var(--mc-shadow-inset);
  height: 24px;
  position: relative;
  overflow: hidden;
}

.xp-bar-fill {
  background: linear-gradient(
    90deg,
    var(--mc-emerald) 0%,
    var(--mc-gold) 50%,
    var(--mc-emerald) 100%
  );
  height: 100%;
  transition: width 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  box-shadow:
    inset 0 2px 0 rgba(255, 255, 255, 0.3),
    0 0 10px var(--mc-emerald-glow);
}

.xp-bar-fill::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: repeating-linear-gradient(
    90deg,
    transparent,
    transparent 8px,
    rgba(255, 255, 255, 0.1) 8px,
    rgba(255, 255, 255, 0.1) 16px
  );
  animation: slide-xp 1s linear infinite;
}

@keyframes slide-xp {
  0% { transform: translateX(0); }
  100% { transform: translateX(16px); }
}

.xp-bar-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-family: var(--mc-font-secondary);
  font-size: var(--mc-text-sm);
  color: var(--mc-text-primary);
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.9);
  z-index: 1;
}
```

### Match Item (Log Entry)
```css
.match-item {
  background: linear-gradient(135deg, rgba(127, 127, 127, 0.2) 0%, rgba(90, 90, 90, 0.2) 100%);
  border: var(--mc-border-thin) solid var(--mc-iron-dark);
  border-radius: var(--mc-radius-sm);
  box-shadow: var(--mc-shadow-inset);
  padding: var(--mc-space-md);
  display: grid;
  grid-template-columns: auto 1fr auto auto;
  gap: var(--mc-space-md);
  align-items: center;
  transition: all 0.2s ease;
  position: relative;
}

.match-item:hover {
  background: linear-gradient(135deg, rgba(127, 127, 127, 0.3) 0%, rgba(90, 90, 90, 0.3) 100%);
  border-color: var(--mc-iron);
  transform: translateX(4px);
}

.match-result-badge {
  font-family: var(--mc-font-secondary);
  font-size: var(--mc-text-sm);
  padding: var(--mc-space-sm) var(--mc-space-md);
  border: var(--mc-border-thin) solid;
  border-radius: var(--mc-radius-sm);
  text-transform: uppercase;
  font-weight: bold;
  text-shadow: 1px 1px 0 rgba(0, 0, 0, 0.8);
}

.match-result-badge.win {
  background: var(--mc-emerald);
  border-color: #1a5a3a;
  color: var(--mc-text-primary);
  box-shadow: 0 0 8px var(--mc-emerald-glow);
}

.match-result-badge.loss {
  background: var(--mc-redstone);
  border-color: #8a0a1a;
  color: var(--mc-text-primary);
  box-shadow: 0 0 8px var(--mc-redstone-glow);
}

.match-result-badge.inconclusive {
  background: var(--mc-stone);
  border-color: var(--mc-iron-dark);
  color: var(--mc-text-primary);
}
```

### Achievement Toast (Item Pickup Style)
```css
.achievement-toast {
  position: fixed;
  top: var(--mc-space-lg);
  right: var(--mc-space-lg);
  background: linear-gradient(90deg, rgba(107, 68, 35, 0.95) 0%, rgba(156, 120, 84, 0.95) 100%);
  border: var(--mc-border-thick) solid var(--mc-gold);
  border-radius: var(--mc-radius-sm);
  box-shadow:
    var(--mc-shadow-outset),
    var(--mc-glow-gold),
    0 8px 32px rgba(0, 0, 0, 0.8);
  padding: var(--mc-space-md) var(--mc-space-lg);
  display: flex;
  align-items: center;
  gap: var(--mc-space-md);
  animation: toast-slide-in 0.4s cubic-bezier(0.4, 0, 0.2, 1),
             toast-slide-out 0.4s cubic-bezier(0.4, 0, 0.2, 1) 3.6s forwards;
  z-index: 1000;
}

.achievement-toast-title {
  font-family: var(--mc-font-primary);
  font-size: var(--mc-text-md);
  color: var(--mc-gold);
  text-shadow: 2px 2px 0 rgba(0, 0, 0, 0.8);
  margin-bottom: var(--mc-space-xs);
}

.achievement-toast-message {
  font-family: var(--mc-font-secondary);
  font-size: var(--mc-text-sm);
  color: var(--mc-text-primary);
}

@keyframes toast-slide-in {
  from {
    transform: translateX(400px);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@keyframes toast-slide-out {
  from {
    transform: translateX(0);
    opacity: 1;
  }
  to {
    transform: translateX(400px);
    opacity: 0;
  }
}
```

### Tooltip (Hovering Info Card)
```css
.mc-tooltip {
  position: absolute;
  background: rgba(16, 0, 16, 0.95);
  border: var(--mc-border-thin) solid var(--mc-diamond);
  border-radius: var(--mc-radius-sm);
  padding: var(--mc-space-sm) var(--mc-space-md);
  font-family: var(--mc-font-secondary);
  font-size: var(--mc-text-sm);
  color: var(--mc-text-primary);
  pointer-events: none;
  z-index: 1000;
  white-space: nowrap;
  box-shadow:
    0 0 8px rgba(93, 173, 226, 0.6),
    0 4px 16px rgba(0, 0, 0, 0.8);
  animation: tooltip-fade-in 0.2s ease;
}

.mc-tooltip::before {
  content: '';
  position: absolute;
  bottom: -4px;
  left: 50%;
  transform: translateX(-50%);
  width: 0;
  height: 0;
  border-left: 4px solid transparent;
  border-right: 4px solid transparent;
  border-top: 4px solid var(--mc-diamond);
}

@keyframes tooltip-fade-in {
  from { opacity: 0; transform: translateY(-4px); }
  to { opacity: 1; transform: translateY(0); }
}
```

---

## 4. Micro-Interactions Summary

1. **Button Press**: Translate down 1-2px with inset shadow
2. **Button Hover**: Translate up 2px with extended shadow
3. **Stat Tile Hover**: Scale 1.02 + lift 4px
4. **Win/Loss Pulse**: 2s infinite glow animation
5. **Achievement Toast**: Slide in from right, hold 3s, slide out
6. **XP Bar Fill**: Animated gradient slide effect
7. **Match Item Hover**: Slide right 4px + brighten background
8. **Tooltip**: Fade in 0.2s with slight upward motion

---

## 5. Texture & Effects

### Pixel Noise Overlay
Base64 SVG noise (already in body background above) at 5% opacity

### Wood Grain (for panels)
Vertical lines using `repeating-linear-gradient` at 16-24px intervals

### Stone Texture (for stat cards)
Subtle crosshatch with 2px grid at 1% opacity

### Beveled Borders
Use combination of inset/outset box-shadows to simulate 3D depth

---

## 6. Font Loading

Add to `<head>`:
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Press+Start+2P&family=VT323&display=swap" rel="stylesheet">
```

---

## 7. Implementation Checklist

- [ ] Add CSS variable tokens to `:root`
- [ ] Import Google Fonts (Press Start 2P, VT323)
- [ ] Update body with deepslate background + noise
- [ ] Restyle header as oak wood HUD bar
- [ ] Convert stat cards to inventory slot style with corners
- [ ] Add win/loss pulse animations
- [ ] Restyle panels with oak wood texture
- [ ] Update all buttons to chunky beveled style
- [ ] Create XP bar component (if adding achievements)
- [ ] Update match items with proper borders
- [ ] Implement achievement toast notification system
- [ ] Add tooltip styles
- [ ] Test all hover/active states
- [ ] Verify pixel font rendering
- [ ] Check responsive behavior

---

**End of Style Specification**
