# Simple Ordering Apps — Project Context

> ⚠️ **IMPORTANT:** This file is rewritten every time a change is made to the project. Always read this file first to get the full up-to-date context before making any changes or assumptions. If you are an AI agent, start here.

## Overview
A web-based self-ordering system for cafes (food, beverages, desserts). Customers browse a digital menu and place orders via tablet/mobile. Admins manage products, customers, and orders.

## Tech Stack
- **Frontend:** React 19 + Vite + Tailwind CSS v4
- **State:** React Context + useReducer
- **Routing:** React Router v6
- **Icons:** Lucide React
- **Styling:** Custom CSS (`.glass`, `.glass-card`, `.btn-primary`, `.input-glass`) + Tailwind utility classes
- **Backend:** Not yet implemented (TBD — Node.js/Express or Python/FastAPI)
- **Database:** Not yet implemented (TBD — SQLite or PostgreSQL)

## Routes
| Route | Page | File |
|---|---|---|
| `/order` | Order Menu (customer) | `src/pages/order/OrderMenu.jsx` |
| `/receipt` | Receipt / Thank You | `src/pages/order/Receipt.jsx` |
| `/admin` | Dashboard | `src/pages/admin/Dashboard.jsx` |
| `/admin/products` | Master Product | `src/pages/admin/MasterProduct.jsx` |
| `/admin/customers` | Master Customer | `src/pages/admin/MasterCustomer.jsx` |
| `/admin/orders` | List Orders | `src/pages/admin/ListOrders.jsx` |

## Layouts
- **Customer routes** use `CustomerLayout` — top glass header + bottom tab bar (Menu, Admin)
- **Admin routes** use `AdminLayout` — persistent glass sidebar on tablet/desktop, bottom tab nav on mobile
- **Receipt page** has no layout chrome (full-screen)

## Pages & Features

### Order Menu (`/order`)
- Category tabs: All, Food, Beverage, Dessert
- Product cards in 2-column grid with image, name, description, price, bestseller badge
- Floating cart FAB at bottom showing item count and total
- Cart drawer slides up from bottom with qty controls
- Checkout step: phone input → auto-detect customer → name prompt (new) or auto-fill (existing) → payment method selection → place order
- Payment method display: Cash, QR, Card (informational only — no processing)

### Receipt (`/receipt`)
- Checkmark animation, order ID, itemized summary, total
- Payment method display with pickup instruction
- Print button and auto-redirect to menu after 30s

### Dashboard (`/admin`)
- 4 metric cards: Revenue, Orders, Pending, Preparing
- Popular Items (top 5 today)
- Payment Method Split (horizontal bar chart)
- Recent Orders list (last 5)

### Master Product (`/admin/products`)
- Product list with search, image thumbnails, edit/delete
- Add/edit modal with fields: name, description, price, category (dropdown), image upload (FileReader + base64 preview)

### Master Customer (`/admin/customers`)
- Customer list with search by name/phone
- Edit modal with name/phone/email
- Customers auto-registered during order placement

### List Orders (`/admin/orders`)
- Filter by status: All, Pending, Preparing, Completed, Cancelled
- Search by order ID or customer name
- Action buttons: "Start Prepare" → "Complete" → done; cancel available for pending orders

## Design System — Apple Liquid Glass

### Color Palette
| Token | Hex/Value | Usage |
|---|---|---|
| `--bg-gradient` | `#F5EDE4` → `#E8D5C4` | Warm cafe background |
| Glass surface | `rgba(255,255,255,0.15)` + `blur(20px)` | Cards, nav, modals |
| `--accent` | `#E8652D` | Primary buttons, CTAs |
| `--success` | `#2D9B7A` | Checkmarks, completed |
| `--warning` | `#D4A83C` | Bestseller badge |
| `--text-primary` | `#1D1D1F` | Body text |
| `--text-secondary` | `#6E6E73` | Labels, captions |

### CSS Classes
- `.glass` — frosted glass surface with 20px blur + top-left highlight
- `.glass-card` — glass with 16px radius, softer shadow
- `.btn-primary` — orange capsule with shadow
- `.btn-secondary` — glass capsule border
- `.btn-ghost` — transparent with hover
- `.input-glass` — frosted input with focus glow
- `.tab-active` — orange active tab pill

### Key Principles
- Frosted glass on navigation chrome only (not content)
- No glass-on-glass stacking
- Capsule shapes for interactive elements
- Subtle top-left inner highlight via `inset box-shadow`
- Large touch targets (44px minimum)
- Adaptive text (light/dark based on underlying content)
- Animations: `.animate-fadeIn`, `.animate-slideUp`, `.animate-checkmark`

## Architecture

### State Management (`src/contexts/AppContext.jsx`)
Single `useReducer` with actions:
- Cart: `ADD_TO_CART`, `REMOVE_FROM_CART`, `UPDATE_QTY`, `CLEAR_CART`, `SET_SHOW_CART`
- Customer: `SET_PHONE`, `SET_CUSTOMER_NAME`, `SET_CUSTOMER`, `ADD_CUSTOMER`
- Products: `ADD_PRODUCT`, `UPDATE_PRODUCT`, `DELETE_PRODUCT`
- Customers: `UPDATE_CUSTOMER`, `DELETE_CUSTOMER`
- Orders: `ADD_ORDER`, `UPDATE_ORDER_STATUS`
- UI: `SET_ACTIVE_CATEGORY`, `SET_ADMIN_PAGE`, `SET_LAST_ORDER`

### Mock Data (`src/data/mockData.js`)
- 14 products across 3 categories
- 3 pre-registered customers
- 3 existing orders with different statuses
- 3 payment methods (Cash, QR, Card)

### Key Behaviors
1. **Auto-registration:** When customer enters a phone not in DB, they're prompted for a name; a new customer record is created on order submission
2. **Auto-fill:** Existing phone numbers instantly show the customer name (read-only)
3. **Order flow:** `pending` → `preparing` → `completed` (or cancelled from pending)

## File Structure
```
src/
├── main.jsx                    # Entry point, router setup
├── App.jsx                     # Root layout selector (admin vs customer)
├── index.css                   # Tailwind imports, Liquid Glass classes, animations
├── data/
│   └── mockData.js             # Products, customers, orders, payment methods
├── contexts/
│   └── AppContext.jsx          # Global state reducer + provider
├── components/
│   ├── AdminLayout.jsx         # Admin sidebar + mobile bottom nav
│   └── CustomerLayout.jsx     # Customer header + bottom nav
└── pages/
    ├── order/
    │   ├── OrderMenu.jsx       # Main ordering screen + cart drawer
    │   └── Receipt.jsx         # Order confirmation screen
    └── admin/
        ├── Dashboard.jsx       # Sales summary
        ├── MasterProduct.jsx   # Product CRUD
        ├── MasterCustomer.jsx  # Customer management
        └── ListOrders.jsx      # Order list & status
```

## Product Roadmap
1. **Table Management & QR Codes** — table master, QR per table, table ID in URL
2. **Real-Time Order Status** — WebSocket/SSE push, timeline, estimated wait time
3. **Order Modifications** — admin edit/cancel with audit log
4. **Bestseller Tags** — auto badge (top 3 sold), manual recommended tag
5. **Category Management** — CRUD categories, drag-drop reorder, visibility toggle
6. **Order History & Re-order** — customer lookup past orders, one-tap re-order

## Running the App
```bash
npm install
npm run dev
```
Opens at `http://localhost:5173`. Test on tablet via DevTools responsive mode (iPad Pro 1024x1366 recommended).

## PRD
Full PRD at `PRD_Simple_Ordering_Apps.docx` in project root.
