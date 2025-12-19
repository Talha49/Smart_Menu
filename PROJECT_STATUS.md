# SmartMenu - Project Status & Roadmap (Rewrite)

## 🎯 Project Vision
**SmartMenu** is a Multi-Tenant SaaS platform providing hospitality venues with instant digital menu management.
**Goal:** Build a high-quality, professional SaaS application **from scratch** using **Vanilla CSS** and **No UI Libraries**.

**Business Model:** Freemium
- **Free Tier:** Limited to 15 items, "Powered by SmartMenu" watermark.
- **Pro Tier:** Unlimited items, Custom Branding (Logo, Colors), No Watermark.

**Core Architecture:**
- **Framework:** Next.js 15 (App Router)
- **Database:** MongoDB (Multi-tenant via `restaurantId`)
- **Styling:** **Vanilla CSS** (Visual Excellence, Glassmorphism, Animations) - *Strictly No UI Libraries*
- **State Management:** Zustand (for session/restaurant data)
- **Auth:** NextAuth.js
- **Real-time:** Polling (SWR) for live menu updates on public screens.

---

## 🛠️ Development Rules (Strict)
1.  **NO UI Libraries:** No Shadcn, No Material UI, No Bootstrap, No Tailwind.
    *   *Exception:* You may use utility libraries like `clsx` or `framer-motion` (if approved), but all visual components must be built from scratch.
2.  **Visual Excellence:** The UI must be stunning, premium, and "wow" the user.
    -   Use CSS Variables for global theming.
    -   Smooth transitions and micro-animations for every interaction.
    -   Modern typography (Inter, Roboto, or Outfit).
    -   Glassmorphism, gradients, and subtle shadows.
3.  **Component Driven:** Build reusable, self-contained components (Buttons, Inputs, Modals, Cards).

---

## 📅 Implementation Roadmap

### 🏁 Phase 1: Foundation & Design System
- [ ] **Project Setup:** Initialize Next.js, clean `globals.css`, setup font optimization.
- [ ] **Design System (CSS Variables):**
    -   Define colors (Primary, Accent, Background, Text, Error, Success).
    -   Define spacing, border-radius, and shadows.
- [ ] **Base UI Kit (Hand-crafted):**
    -   [ ] **Button:** Primary, Secondary, Ghost, Destructive, Loading state.
    -   [ ] **Input:** Floating labels, Error states, Icons (start/end).
    -   [ ] **Card:** Glassmorphism variant, Solid variant.
    -   [ ] **Modal:** **Custom implementation** (Centered, Scrollable overlay, Animations).
    -   [ ] **Toast/Notification:** Stackable alerts.
- [ ] **Authentication:**
    -   [ ] **Login Page:** High-end design, Show/Hide password.
    -   [ ] **Signup Page:** Password strength indicator.
    -   [ ] **Onboarding:** Multi-step form for creating the Restaurant.

### 📦 Phase 2: Core Dashboard (Admin)
- [ ] **Dashboard Layout:**
    -   Responsive Sidebar Navigation.
    -   Top Bar with User Profile/Logout.
- [ ] **Menu Management:**
    -   [ ] **List View:** Grid of menu items with images.
    -   [ ] **Create/Edit Modal:** Form to add Name, Price, Description, Category.
    -   [ ] **Availability Toggle:** "Killer Feature" - Switch for In-stock/Out-of-stock.
    -   [ ] **Image Upload:** Custom Drag & Drop area (integrating Vercel Blob or similar).
- [ ] **Category Management:**
    -   [ ] Manage Categories (Appetizers, Mains, etc.).
    -   [ ] Drag-and-drop reordering (optional but recommended).

### 🚀 Phase 3: Public Views (Client)
- [ ] **QR Menu Page (`/menu/[id]`):**
    -   [ ] Mobile-first responsive design.
    -   [ ] **Real-time Updates:** Poll every 30s.
    -   [ ] Category Navigation (Sticky headers or Scroll spy).
    -   [ ] Item Detail Modal (Pop-up on click).
    -   [ ] Search & Filter functionality.
    -   [ ] **Watermark:** Shown if on Free Plan.
- [ ] **TV Display Page (`/tv/[id]`):**
    -   [ ] Landscape optimized (16:9).
    -   [ ] Large, readable typography.
    -   [ ] Auto-scroll or Slideshow mode for continuous display.

### 💎 Phase 4: Pro Features
- [ ] **Branding Settings:**
    -   [ ] Logo Upload.
    -   [ ] Brand Color Picker (Overwrites CSS variables for that menu).
    -   [ ] Font Selection.
- [ ] **Stripe Integration:**
    -   [ ] Upgrade Flow.
    -   [ ] Webhook handling (Auto-enable Pro features).
    -   [ ] Billing Portal.
- [ ] **Advanced Features:**
    -   [ ] Menu Templates (Pre-made designs).
    -   [ ] AI Description generator (Future).

---

## 🗄️ Database Schema Reference

### User
```javascript
{
  email: String (Unique, Required),
  password: String (Hashed),
  restaurant: ObjectId (Ref: Restaurant),
  createdAt: Date
}
```

### Restaurant
```javascript
{
  name: String,
  restaurantId: String (Unique Slug),
  owner: ObjectId (Ref: User),
  plan: Enum['free', 'pro'],
  // Pro Features
  logoUrl: String,
  brandColor: String,
  fontFamily: String,
  stripeCustomerId: String,
  createdAt: Date
}
```

### MenuItem
```javascript
{
  name: String,
  price: Number,
  description: String,
  category: String,
  imageUrl: String,
  isAvailable: Boolean (Default: true),
  restaurant: ObjectId (Ref: Restaurant), // Indexed
  sortOrder: Number, // For manual UI sorting
  createdAt: Date
}
```

---

## 📝 Feature Requirements Checklist

| Feature | Requirement | Priority |
| :--- | :--- | :--- |
| **No UI Library** | strictly plain CSS or Modules. No Tailwind. | **CRITICAL** |
| **Responsiveness** | Mobile (Phone), Tablet, Desktop, TV (4k). | **High** |
| **Real-time** | Public menu must update within 30s of Admin change. | **High** |
| **Free Limit** | Max 15 items. Watermark visible. | **High** |
| **Images** | Support aspect ratio (1:1 or 4:3). Optimized loading. | **Medium** |
| **Accessibility** | All custom components must be keyboard accessible. | **Medium** |
