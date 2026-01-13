---
title: "Layout"
excerpt: "A short intro to basic layout and element behavior"
image: "layout.png"
isFeatured: false
date: "2026-01-13"
---

# Layout

## Block and inline elements

**Block** elements start on a new line and take the full available width. You can set width and height, and margins/padding affect layout on all sides.

**Inline** elements stay in the line flow, take only the width of their content, and do not break the line. Width and height do not apply directly. There are important spacing nuances:

- `margin-left/right` and `padding-left/right` work as expected and affect neighboring inline elements.
- `margin-top/bottom` do not push lines apart.
- `padding-top/bottom` is drawn around the text but does not increase line height and can overlap neighboring lines.

Short example:

```html
<div>Block 1</div>
<div>Block 2</div>

<span>Inline 1</span>
<span>Inline 2</span>
```

If you need a compromise, use `inline-block`: the element stays in a line but supports width and height like a block.

## Vertical margin collapsing

For block elements, vertical margins (top/bottom) can **collapse**: when two blocks are stacked, the space between them is the **larger** of the two margins, not the sum.

This can also happen between a parent and its first/last child if the parent has no `padding`, `border`, or `overflow` that creates separation.

To avoid collapsing, add `padding` or `border` to the parent, set `overflow: auto/hidden`, or use `display: flow-root`.
