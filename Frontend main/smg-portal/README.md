# LogiTrack — Logistics Employee Portal Frontend

A complete React + Vite + Tailwind CSS frontend for a MERN-stack logistics management system, inspired by the SMG Intern Portal UI reference (dark navy sidebar, professional corporate look).

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | React 18 (Vite) |
| Styling | Tailwind CSS 3 |
| Routing | React Router v6 |
| HTTP Client | Axios |
| Charts | Recharts |
| Icons | Lucide React |
| Auth | JWT via localStorage |

---

## Project Structure

```
logistics-portal/
├── public/
├── src/
│   ├── components/
│   │   ├── layout/
│   │   │   ├── DashboardLayout.jsx   # Main layout wrapper
│   │   │   ├── Sidebar.jsx           # Collapsible nav sidebar
│   │   │   └── Topbar.jsx            # Top navbar w/ search, notifs, avatar
│   │   └── ui/
│   │       └── index.jsx             # StatCard, Badge, Modal, DataTable, etc.
│   ├── hooks/
│   │   └── useAuth.jsx               # Auth context + JWT state
│   ├── pages/
│   │   ├── LoginPage.jsx             # Login with role selector
│   │   ├── AdminDashboard.jsx        # Admin home w/ charts & stats
│   │   ├── CustomerDashboard.jsx     # Customer home w/ track widget
│   │   ├── PartnerDashboard.jsx      # Partner home w/ delivery queue
│   │   ├── ShipmentTrackingPage.jsx  # Public tracking + timeline UI
│   │   ├── ShipmentsPage.jsx         # CRUD shipments (role-aware)
│   │   ├── CustomersPage.jsx         # Customer directory (admin)
│   │   ├── PartnersPage.jsx          # Partner directory (admin)
│   │   └── NotFound.jsx              # 404 page
│   ├── services/
│   │   └── api.js                    # Axios instance + all API calls
│   ├── App.jsx                       # Router + route guards
│   ├── main.jsx                      # Entry point
│   └── index.css                     # Tailwind + custom component classes
├── index.html
├── vite.config.js
├── tailwind.config.js
└── package.json
```

---

## Setup & Run

### 1. Install dependencies
```bash
npm install
```

### 2. Start development server
```bash
npm run dev
```
Opens at http://localhost:3000

### 3. Build for production
```bash
npm run build
```

---

## Backend Integration

All API calls are in `src/services/api.js`. The base URL is:
```
http://localhost:5000/api
```

### Expected API Endpoints

#### Auth
```
POST   /api/auth/login          { email, password, role } → { token, user }
POST   /api/auth/register       { name, email, password, role }
GET    /api/auth/profile
```

#### Shipments
```
GET    /api/shipments           ?status=&limit=&sort=
GET    /api/shipments/:id
GET    /api/shipments/track/:trackingNo
POST   /api/shipments
PUT    /api/shipments/:id
PATCH  /api/shipments/:id/status  { status }
DELETE /api/shipments/:id
GET    /api/shipments/stats
```

#### Customers
```
GET    /api/customers
GET    /api/customers/:id
POST   /api/customers
PUT    /api/customers/:id
DELETE /api/customers/:id
```

#### Partners
```
GET    /api/partners
GET    /api/partners/:id
POST   /api/partners
PUT    /api/partners/:id
DELETE /api/partners/:id
GET    /api/partners/:id/shipments
```

#### Dashboard
```
GET    /api/dashboard/admin
GET    /api/dashboard/customer
GET    /api/dashboard/partner
```

### JWT Auth Flow
1. Login returns `{ token, user }` — stored in `localStorage`
2. Every request auto-attaches `Authorization: Bearer <token>`
3. 401 responses auto-redirect to `/login`

---

## User Roles & Routes

| Role | Dashboard | Features |
|------|-----------|---------|
| `admin` | `/admin` | All shipments, customers, partners, analytics |
| `customer` | `/customer` | Own shipments, quick track |
| `partner` | `/partner` | Assigned deliveries, status updates |

### Demo Credentials (configure in your backend)
```
Admin:    admin@logitrack.com    / Admin@123
Customer: customer@logitrack.com / Customer@123
Partner:  partner@logitrack.com  / Partner@123
```

---

## Pages & Features

### Login Page
- Role selector (Admin / Customer / Partner)
- Email + password with show/hide
- JWT token stored on success
- Demo credential quick-fill buttons

### Admin Dashboard
- KPI stat cards (shipments, revenue, partners)
- Area chart: monthly shipment trends
- Pie chart: status breakdown
- Recent shipments table

### Customer Dashboard
- Quick shipment tracker with inline search
- My shipments table
- Status summary cards

### Partner Dashboard
- Today's delivery queue
- Weekly performance bar chart
- Quick action buttons (mark delivered, start route, report delay)

### Shipment Tracking Page
- Public-facing (no auth required)
- Searchable by tracking number
- Visual progress bar
- Step-by-step timeline with icons
- Sender/receiver/package details

### Shipments Page (role-aware)
- Filter by status (7 states)
- Full-text search
- Admin: create new shipment modal
- Click to view tracking

### Customers & Partners Pages
- Directory with search
- Add / Edit / Delete (modal-based)
- Summary stat tiles

---

## UI Design Notes

Matches the SMG Intern Portal reference:
- **Sidebar**: Deep navy gradient (`#0f2347` → `#1a3a6b`), collapsible, role-filtered nav
- **Topbar**: White, search bar, notification bell, avatar dropdown
- **Cards**: White rounded-xl with subtle shadows
- **Accent color**: Amber/gold (`#f59e0b`) for CTAs and highlights
- **Typography**: Inter font, clean hierarchy
- **Responsive**: Mobile sidebar overlay, responsive grid breakpoints
