# Nexile – FactoryIQ (Manufacturing Excellence Portal)

> **Enterprise Full-Stack Manufacturing Platform** connecting R&D, NPI, Project Tracking, Shop Floor Production, Quality Management, Compliance, Supply Chain, Logistics, After-Sales Service, and Executive Analytics.

---

## ⚡ Technology Stack

### **Frontend**
- **Framework**: Angular 17+ (Standalone Components, RxJS, Angular Router)
- **Visualizations**: ECharts (`ngx-echarts`), SVG CAD/BOM Viewers
- **Styling**: SCSS with CSS Variables for Dark/Light Theme Switching
- **Security**: JWT Auth Interceptor, Route Guards (`authGuard`)

### **Backend**
- **Framework**: Python 3.12, FastAPI, Pydantic v2
- **Database**: SQLAlchemy 2.0 ORM, SQLite (`factoryiq.db` out-of-the-box zero setup), PostgreSQL ready
- **Authentication**: JWT Bearer Tokens, Bcrypt Password Hashing
- **Real-Time**: WebSockets for live alerts (`/ws/notifications`)
- **API Documentation**: Interactive Swagger/OpenAPI at `http://localhost:8000/docs`

---

## 🔑 Default Demo Accounts

All demo accounts use the standard password: **`Password123!`**

| Role | Email | Privileges / Focus |
| :--- | :--- | :--- |
| **Super Admin** | `admin@factoryiq.com` | Full system control, user management, audit logs |
| **Management** | `manager@factoryiq.com` | Executive dashboard, KPIs, cross-site reports |
| **Project Manager** | `project@factoryiq.com` | Project creation, Gantt milestones, risk tracking |
| **Quality Manager** | `quality@factoryiq.com` | NCR, 8D CAPA workflow, ISO certs, SPC charts |
| **Production Manager**| `production@factoryiq.com` | Multi-site shop floor, lines, WIP work orders |
| **Supplier** | `supplier@factoryiq.com` | PO fulfillment, supplier scorecards, shipments |
| **Customer** | `customer@factoryiq.com` | Permitted projects, milestones, evidence repo |

---

## 🚀 Quickstart Local Execution

### **1. Backend Setup (FastAPI & SQLite)**
```bash
cd backend
python -m venv venv
# On Windows:
venv\Scripts\activate
# On Linux/macOS:
source venv/bin/activate

pip install -r requirements.txt
python -c "from app.database.session import engine, Base; from app.seed import seed_database; Base.metadata.create_all(bind=engine); seed_database()"
python -m uvicorn app.main:app --reload --port 8000
```
- API Docs: `http://localhost:8000/docs`

### **2. Frontend Setup (Angular)**
```bash
cd frontend
npm install
npm start
```
- Access Portal UI: `http://localhost:4200`

---

## 🐳 Docker Deployment

```bash
docker-compose up --build
```

---

## 📂 Core Feature Modules (34 Views)
1. **Login & Signup** (JWT Authentication, Quick Demo fill chips)
2. **Executive Dashboard** (Top KPIs, ECharts line output, defect trends, site filters)
3. **Program & Project Tracking** (List, Create, Detail view with 13 sub-tabs, Gantt timeline)
4. **Production Visibility** (Real-time shop floor status across 4 sites, WIP work orders)
5. **Quality & Compliance** (NCR/CAPA 8D workflow, ISO Certificate library, SPC Cpk charts, Audits)
6. **Supply Chain & Material Visibility** (POs, Supplier scorecards, Inventory stock levels, Logistics)
7. **After-Sales Service** (RMA tracking, Repair cases, Warranty claims, EOL notices)
8. **Documents & Engineering Viewers** (Revision control, BOM tree compare, 3D CAD viewport)
9. **Collaboration Hub** (Discussion channels & threads)
10. **Knowledge Base** (Searchable SOP procedures)
11. **Analytics & Reports** (Custom reports, CSV/PDF export)
12. **Administration & Audit Trail** (User management, 17 Role matrix, System audit log)
