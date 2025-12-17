1. The "Vertical Fisheye" (The Lens)
The Concept: A vertical list where the items at the top and bottom are small and squashed, but the item in the center is huge (zoomed in). As you scroll, the items flow through this "magnifying glass" effect seamlessly.

Why it works: It allows you to show a long list, but forces the user to focus on the description of the center item.

Structural Representation:


____________________________________________________
|                                                  |
|      (Item 4: Small, Blurred, Opacity 0.5)       |
|      [Img] Pizza ........................ $10    |
|                                                  |
|      (Item 5: Medium, Semi-clear)                |
|      [ Image ]  Burger .................. $12    |
|                                                  |
|      +--------------------------------------+    |
|      |  [    LARGE HIGH-RES IMAGE    ]      |    |
|      |                                      |    | <--- FOCUS AREA
|      |   STEAK SANDWICH                     |    |      (100% Scale)
|      |   $18.50                             |    |
|      |   "Grilled sirloin with onions..."   |    |
|      +--------------------------------------+    |
|                                                  |
|      (Item 7: Medium, Semi-clear)                |
|      [ Image ]  Salad ................... $09    |
|                                                  |
|      (Item 8: Small, Blurred, Opacity 0.5)       |
|      [Img] Soup ......................... $05    |
|__________________________________________________|



Interaction: Smooth scroll. The center item automatically expands.


2. The "Helix Spiral" (DNA Strand)
The Concept: The items are arranged on a 3D spiral (helix) rotating around a central pillar. As you scroll down, the items spiral forward. When an item reaches the front, it "unrolls" or flattens out to show the full description and price.

Why it works: It looks incredibly futuristic and handles a large number of categories well.

Structural Representation:

____________________________________________________
|                                                  |
|            (Item 3 - Far back/Right)             |
|                                                  |
|   (Item 2 - Mid Left)                            |
|                                                  |
|          +-----------------------------+         |
|          |   [ ACTIVE FRONT CARD ]     |         |
|          |                             |         | <--- The card that
|          |   Grilled Salmon            |         |      rotated to the
|          |   $24.00                    |         |      front position.
|          |   (Lemon butter sauce...)   |         |
|          +-----------------------------+         |
|                                                  |
|    (Item 5 - Mid Right)                          |
|                                                  |
|            (Item 6 - Far back/Left)              |
|__________________________________________________|


Interaction: Scroll moves the items along the Z-axis (depth) and rotates them Y-axis.


3. The "Cinema Spotlight" (Horizontal Dark Mode)
The Concept: The screen is dark. A horizontal strip of images sits at the bottom. When you click or scroll to an item, the background lights up with a massive version of that food, and the text details float elegantly on the left side.

Why it works: It feels like a movie theater. Very premium.

Structural Representation:



____________________________________________________
|                                                  |
|   TITLE:  LAVA CAKE                              |
|   PRICE:  $8.00                                  |
|   DESC:   "Molten chocolate center..."           |
|                                                  |
|           ( GIANT BACKGROUND IMAGE )             |
|           (      TAKES UP 80%      )             |
|                                                  |
|__________________________________________________|
|  [img]  [img]  [img]  [img]  [img]  [img]        | <--- Navigation Strip
|  Prev   Curr   Next   ...    ...    ...          |      (Bottom)
|__________________________________________________|



4. The "Revolver" (Top-Down Chamber)
The Concept: Imagine a revolver barrel or a round chamber. The items are in a circle. The circle rotates. The "Active" item doesn't just sit there; it pops out of the circle towards the side to display its text details.

Why it works: It separates the image (in the wheel) from the text (on the side), keeping it clean.

Structural Representation:

____________________________________________________
|                                                  |
|       ( Spinning Circle of Plates )              |
|                                                  |
|          (Item A)    (Item B)                    |
|             \           /                        |
|              \         /                         |
|   (Item F)---- [Center] ----(Item C: ACTIVE)     | <--- connects to
|              /         \            |            |      Detail Card
|             /           \           |            |
|          (Item E)    (Item D)       V            |
|                                                  |
|                             +------------------+ |
|                             |  Item C Name     | |
|                             |  $15.99          | |
|                             |  Description...  | |
|                             +------------------+ |
|__________________________________________________|




5. The "Stacked Deck" (Tinder-style Swipe)
The Concept: The menu is a stack of large, beautiful cards in the center of the screen. You don't see a list. You only see the top card. You swipe it away (throw it left or right) to see the next one. The "History" piles up on the side.

Why it works: It forces 100% attention on one item at a time.

Structural Representation:


____________________________________________________
|                                                  |
|  [ History ]                                     |
|  [ Pile    ]      +-----------------------+      |
|  [         ]      |                       |      |
|                   |      CURRENT CARD     |      |
|                   |      (Full View)      |      |
|                   |                       |      |
|                   |   "Chicken Tacos"     |      |
|                   |       $12.50          |      |
|                   |   3 pcs with salsa    |      |
|                   |                       |      |
|                   +-----------------------+      |
|                                                  |
|                       (Next card peeking)        |
|__________________________________________________|


Interaction: Swipe/Drag gestures.


# Project Specification: "Display-Only" Creative Menu Concepts

## Context
A Next.js restaurant menu app. 
* **Constraint:** No "Buy" or "Add to Cart" buttons. 
* **Goal:** Pure visual presentation (Digital Menu Board).
* **Data:** Each item displays Image, Title, Price, and Description.

## Tech Stack
* **Next.js** (App Router)
* **Framer Motion** (Animation)
* **Zustand** (Store active index)

---

## Concept 1: "The Vertical Fisheye"
**Logic:** A vertical list where the `scale` and `opacity` of an item depend on its distance from the center of the viewport.
* **Math:** * `dist = abs(centerOfScreen - itemCenter)`
    * `scale = 1 + max(0, (1 - dist / 300))` (Centers are huge)
    * `opacity = 1 - (dist / 500)` (Edges fade out)
* **Content:** The center item shows full description. Top/Bottom items only show Title/Image to save space.

## Concept 2: "The Helix Spiral"
**Logic:** Items arranged on a 3D spiral path along the Y-axis.
* **Transform:**
    * `translateZ`: Based on scroll position.
    * `rotateY`: `index * 45deg` + scrollOffset.
    * `x`: `Math.sin(index) * radius`.
* **Detail View:** The item with the lowest `translateZ` (closest to camera) sets `opacity: 1` and unfolds a `div` containing the Description text.

## Concept 3: "The Cinema Spotlight"
**Logic:** Master-Detail view.
* **Bottom Bar:** A horizontal scrollable list of thumbnails (flexbox).
* **Main Stage:** A full-screen background image of the `activeItem`.
* **Text:** An overlay on the left side: `h1` (Title), `h2` (Price), `p` (Description). 
* **Animation:** When `activeItem` changes, the Background Image uses `AnimatePresence` to fade cross-dissolve. Text slides in from left.

## Concept 4: "The Revolver" (Side Pop-out)
**Logic:** Items placed in a circle (`position: absolute`).
* **Wheel:** Positioned on the left side of the screen (`left: -20%`).
* **Active Zone:** The item at `0deg` (Rightmost point of the wheel).
* **Detail Card:** A separate component positioned at `right: 10%`. It listens to the `activeIndex` state. When the wheel spins, the Detail Card updates content with a "flip" animation.

## Concept 5: "The Stacked Deck"
**Logic:** A stack of cards at `position: absolute; top: 50%; left: 50%`.
* **Z-Index:** Reverse order (Item 0 is top).
* **Gestures:** Use `useDrag` (from `@use-gesture/react` or Framer Motion).
* **Physics:**
    * On Drag End: If velocity > threshold, fly card off screen (`x: 500`, `opacity: 0`).
    * Increment `activeIndex`.
* **Visuals:** The card is large. It contains the Image on top (60%) and Text/Price on bottom (40%).