# Minecraft Texture Atlas

## Required File

The dashboard requires a Minecraft texture atlas file at:
`public/blocks.png`

## Texture Atlas Specifications

- **Size**: 540px × 270px (10 blocks wide × 5 blocks tall)
- **Each block**: 54px × 54px
- **Format**: PNG with pixelated rendering

## Block Positions Used

The CSS references specific blocks from the atlas:

- **Stone** (Row 4, Col 9): Used for stat cards, match items, buttons
- **Dirt** (Row 4, Col 2): Used for panels and sections
- **Oak Planks** (Row 4, Col 4): Used for header and streak card
- **Lime/Green Block** (Row 1, Col 7): Used for win buttons and success elements
- **Red Block** (Row 2, Col 8): Used for loss buttons and delete button
- **Emerald Ore** (Row 3, Col 6): Used for win stat cards
- **Redstone Ore** (Row 3, Col 8): Used for loss stat cards
- **Gold Block** (Row 2, Col 0): Used for success buttons

## Fallback Colors

If the texture file is missing, CSS variables provide fallback solid colors.
