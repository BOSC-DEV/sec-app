

# Fix for Phantom Text Boxes / Flashing Cursor Issue

## Problem Summary
You're experiencing phantom "text boxes" and flashing cursor indicators appearing throughout the application - on the home page logo, buttons, and other interactive elements. This creates a confusing experience where it looks like you can type anywhere.

## Root Cause Analysis
After investigating the codebase, the issue is caused by **Radix UI's TooltipProvider** accessibility features. The TooltipProvider wraps your entire application and creates hidden `<span>` elements with `position: fixed` and `tabindex="0"` for focus management. These elements can sometimes display text cursor indicators when focused.

Additionally, the existing focus ring styles (using `focus-visible:ring-2`) on buttons and interactive elements may be contributing to visible focus states that appear as text input indicators.

## Solution

### Step 1: Configure TooltipProvider with Better Defaults
Update the TooltipProvider in `App.tsx` to use settings that prevent the focus-trapping behavior:
- Add `delayDuration={0}` to prevent delayed tooltip showing
- Add `disableHoverableContent` to simplify tooltip behavior
- Add `skipDelayDuration={0}` for immediate response

### Step 2: Add Global CSS to Hide Phantom Focus Elements
Add CSS rules to `index.css` that:
- Target fixed-position span elements with tabindex that are empty (Radix focus traps)
- Hide them visually and prevent them from receiving focus indicators
- Prevent text cursor from appearing on non-input elements

### Step 3: Clean Up App.css
Remove the unused `App.css` file which contains leftover Vite template styles that aren't being used but could potentially conflict.

## Technical Implementation Details

### CSS Changes (index.css)
```css
/* Hide Radix focus trap elements that cause phantom cursors */
span[tabindex="0"]:empty,
span[tabindex="0"][style*="position: fixed"] {
  caret-color: transparent !important;
  outline: none !important;
  pointer-events: none !important;
}

/* Prevent text cursor on non-input interactive elements */
button, a, [role="button"], 
img, svg, div[role="img"] {
  caret-color: transparent;
  cursor: pointer;
}

/* Ensure links and buttons don't show text cursor */
a, button {
  user-select: none;
}
```

### App.tsx TooltipProvider Update
```tsx
<TooltipProvider delayDuration={0} skipDelayDuration={0}>
  {/* rest of app */}
</TooltipProvider>
```

## Expected Outcome
After these changes:
- No more phantom text boxes appearing on logos, buttons, or other interactive elements
- No more flashing cursor indicators where they shouldn't appear
- Focus states will still work properly for accessibility (keyboard navigation)
- All existing functionality remains intact

## Files to Modify
1. `src/index.css` - Add CSS rules to prevent caret/focus on non-input elements
2. `src/App.tsx` - Update TooltipProvider configuration
3. `src/App.css` - Delete this unused file to clean up the project

