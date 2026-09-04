import datetime
from sqlalchemy.orm import Session
from app.database.session import SessionLocal, engine, Base
from app.models.models import (
    Role, Permission, User, Site, Customer, Supplier, Program, Product, Item, BOM,
    Project, Milestone, ProjectRisk, ProjectIssue, ProductionLine, WorkOrder,
    Document, DocumentVersion, ECO, Certificate, NCR, CAPA, Audit, SPCRecord,
    SupplierScorecard, PurchaseOrder, PurchaseOrderItem, Inventory, Shipment,
    RMA, WarrantyClaim, EOLNotice, Notification, KnowledgeArticle, ActivityLog
)
from app.core.security import get_password_hash

def seed_database():
    Base.metadata.create_all(bind=engine)
    db: Session = SessionLocal()
    
    # Check if already seeded
    if db.query(User).filter(User.email == "admin@factoryiq.com").first():
        print("Database already seeded.")
        db.close()
        return

    print("Seeding Nexile - FactoryIQ Manufacturing Excellence database...")

    # 1. Roles
    role_names = [
        "Super Admin", "Management", "Customer", "Program Manager", "Project Manager",
        "R&D / Engineering", "NPI Team", "Production Manager", "Production User",
        "Quality Manager", "Quality Engineer", "Procurement", "Supplier", "Logistics",
        "After-Sales / Service", "Finance / Compliance", "Viewer"
    ]
    roles_dict = {}
    for r_name in role_names:
        role = Role(name=r_name, description=f"{r_name} role permissions in FactoryIQ")
        db.add(role)
        db.flush()
        roles_dict[r_name] = role

    # 2. Sites
    sites_data = [
        {"code": "HYD-01", "name": "Hyderabad Main Campus", "location": "HITEC City, Hyderabad", "country": "India"},
        {"code": "BLR-02", "name": "Bangalore Innovation Hub", "location": "Electronic City, Bangalore", "country": "India"},
        {"code": "CHE-03", "name": "Chennai Assembly Plant", "location": "Sriperumbudur, Chennai", "country": "India"},
        {"code": "PUN-04", "name": "Pune Precision Line", "location": "Chakan, Pune", "country": "India"}
    ]
    sites_dict = {}
    for s in sites_data:
        site = Site(**s)
        db.add(site)
        db.flush()
        sites_dict[s["code"]] = site

    # 3. Users
    pwd_hash = get_password_hash("Password123!")
    users_data = [
        {"email": "admin@factoryiq.com", "full_name": "Alexander Vance", "job_title": "Chief Technology Officer", "department": "Executive", "role_id": roles_dict["Super Admin"].id, "site_id": sites_dict["HYD-01"].id},
        {"email": "manager@factoryiq.com", "full_name": "Eleanor Rigby", "job_title": "VP Manufacturing Operations", "department": "Management", "role_id": roles_dict["Management"].id, "site_id": sites_dict["HYD-01"].id},
        {"email": "project@factoryiq.com", "full_name": "David Sterling", "job_title": "Senior Program Manager", "department": "PMO", "role_id": roles_dict["Project Manager"].id, "site_id": sites_dict["BLR-02"].id},
        {"email": "quality@factoryiq.com", "full_name": "Dr. Sarah Lin", "job_title": "Global Quality Lead", "department": "Quality", "role_id": roles_dict["Quality Manager"].id, "site_id": sites_dict["CHE-03"].id},
        {"email": "production@factoryiq.com", "full_name": "Marcus Brody", "job_title": "Shop Floor Director", "department": "Production", "role_id": roles_dict["Production Manager"].id, "site_id": sites_dict["HYD-01"].id},
        {"email": "supplier@factoryiq.com", "full_name": "Kenji Sato", "job_title": "Supplier Portal Admin", "department": "Supply Chain", "role_id": roles_dict["Supplier"].id, "site_id": sites_dict["PUN-04"].id},
        {"email": "customer@factoryiq.com", "full_name": "Jennifer Aniston", "job_title": "Aerospace Procurement Lead", "department": "External Customer", "role_id": roles_dict["Customer"].id, "site_id": sites_dict["HYD-01"].id},
        {"email": "engineer@factoryiq.com", "full_name": "Vikram Seth", "job_title": "Principal NPI Engineer", "department": "Engineering", "role_id": roles_dict["R&D / Engineering"].id, "site_id": sites_dict["BLR-02"].id},
        {"email": "service@factoryiq.com", "full_name": "Samantha Reed", "job_title": "Field Service Director", "department": "After-Sales", "role_id": roles_dict["After-Sales / Service"].id, "site_id": sites_dict["HYD-01"].id}
    ]
    for u in users_data:
        db_u = User(hashed_password=pwd_hash, **u)
        db.add(db_u)

    # 4. Customers
    cust1 = Customer(code="CUST-AERO", name="Aerospace Dynamics Corp", industry="Aerospace & Defense", contact_email="procurement@aerdyn.com", country="USA")
    cust2 = Customer(code="CUST-TSLA", name="Tesla Mobility Solutions", industry="Automotive EV", contact_email="supply@teslamobility.com", country="USA")
    cust3 = Customer(code="CUST-SIEM", name="Siemens Energy Tech", industry="Industrial Power", contact_email="vendor@siemens-energy.de", country="Germany")
    db.add_all([cust1, cust2, cust3])
    db.flush()

    # 5. Suppliers
    sup1 = Supplier(code="SUP-MICRON", name="Micron Semiconductors", category="Electronics", contact_person="Ravi Kumar", email="sales@micron-semis.com", rating=4.8)
    sup2 = Supplier(code="SUP-FOXCONN", name="Foxconn Precision Assembly", category="Contract Assembly", contact_person="Li Wei", email="orders@foxconn-assembly.com", rating=4.6)
    sup3 = Supplier(code="SUP-ALCOA", name="Alcoa Metals & Alloys", category="Raw Aluminum", contact_person="Hans Gruber", email="commercial@alcoa-metals.com", rating=4.2)
    db.add_all([sup1, sup2, sup3])
    db.flush()

    # 6. Programs & Products
    prog1 = Program(code="PRG-EV-PLATFORM", name="NextGen EV Inverter Architecture", customer_id=cust2.id, budget=4500000.0)
    prog2 = Program(code="PRG-AVIONICS-2026", name="Flight Control Avionics Modernization", customer_id=cust1.id, budget=8200000.0)
    db.add_all([prog1, prog2])
    db.flush()

    prod1 = Product(sku="PRD-ECU-9000", name="High-Speed Automotive ECU", category="EV Electronics", revision="v2.1", unit_cost=420.00)
    prod2 = Product(sku="PRD-AVN-5000", name="Quad-Redundant Flight Computer", category="Avionics", revision="v3.0", unit_cost=1850.00)
    prod3 = Product(sku="PRD-MED-INV", name="MRI Gradient Power Amplifier", category="Medical Electronics", revision="v1.4", unit_cost=3100.00)
    db.add_all([prod1, prod2, prod3])
    db.flush()

    # 7. Projects (Creating sample projects to match the 128 total count dashboard metric)
    prj_sample = [
        {"project_code": "PRJ-HYD-101", "name": "EV Inverter SMT Line Ramp", "customer_id": cust2.id, "program_id": prog1.id, "product_id": prod1.id, "site_id": sites_dict["HYD-01"].id, "status": "In Progress", "health": "Green", "priority": "Critical", "progress_percent": 78.5},
        {"project_code": "PRJ-BLR-204", "name": "Flight Computer Thermal Qual", "customer_id": cust1.id, "program_id": prog2.id, "product_id": prod2.id, "site_id": sites_dict["BLR-02"].id, "status": "At Risk", "health": "Yellow", "priority": "High", "progress_percent": 54.0},
        {"project_code": "PRJ-CHE-305", "name": "Medical Amplifier Housing Machine", "customer_id": cust3.id, "program_id": prog1.id, "product_id": prod3.id, "site_id": sites_dict["CHE-03"].id, "status": "Blocked", "health": "Red", "priority": "High", "progress_percent": 32.0},
        {"project_code": "PRJ-PUN-409", "name": "Automotive ECU Vibration Test", "customer_id": cust2.id, "program_id": prog1.id, "product_id": prod1.id, "site_id": sites_dict["PUN-04"].id, "status": "Completed", "health": "Green", "priority": "Medium", "progress_percent": 100.0}
    ]
    for p_info in prj_sample:
        p = Project(start_date=datetime.datetime.utcnow() - datetime.timedelta(days=60), target_date=datetime.datetime.utcnow() + datetime.timedelta(days=90), **p_info)
        db.add(p)
        db.flush()
        
        # Add milestones
        ms1 = Milestone(project_id=p.id, title="PDR - Preliminary Design Review", phase="R&D", due_date=datetime.datetime.utcnow() - datetime.timedelta(days=30), status="Completed")
        ms2 = Milestone(project_id=p.id, title="CDR - Critical Design Review", phase="Engineering", due_date=datetime.datetime.utcnow() - datetime.timedelta(days=10), status="Completed")
        ms3 = Milestone(project_id=p.id, title="NPI Tooling & Jig Qualification", phase="NPI", due_date=datetime.datetime.utcnow() + datetime.timedelta(days=15), status="In Progress")
        ms4 = Milestone(project_id=p.id, title="PPAP Level 3 Customer Sign-off", phase="Qualification", due_date=datetime.datetime.utcnow() + datetime.timedelta(days=45), status="Pending")
        db.add_all([ms1, ms2, ms3, ms4])
        
        # Add risks and issues
        r1 = ProjectRisk(project_id=p.id, title="Chipset Lead Time Delay from Supplier", category="Supply Chain", impact="High", probability="High", mitigation_plan="Buffer safety stock with spot buy distributor", owner="Procurement Lead")
        i1 = ProjectIssue(project_id=p.id, title="Solder Void Rate exceeding 2% in BGA area", severity="Major", status="In Progress", assigned_to="Quality Engineer")
        db.add_all([r1, i1])

    # Seed additional dummy projects to reach realistic dashboard volume
    for i in range(5, 129):
        p_status = "In Progress" if i % 4 != 0 else ("At Risk" if i % 7 == 0 else ("Blocked" if i % 15 == 0 else "Completed"))
        p_health = "Green" if p_status in ["In Progress", "Completed"] else ("Yellow" if p_status == "At Risk" else "Red")
        p_site = list(sites_dict.values())[i % 4]
        p_code = f"PRJ-{p_site.code[:3]}-{100+i}"
        proj = Project(
            project_code=p_code,
            name=f"Manufacturing Phase {i} Sub-Assembly Build",
            customer_id=cust1.id if i % 2 == 0 else cust2.id,
            program_id=prog1.id if i % 2 == 0 else prog2.id,
            product_id=prod1.id if i % 3 == 0 else prod2.id,
            site_id=p_site.id,
            status=p_status,
            health=p_health,
            priority="High" if i % 3 == 0 else "Medium",
            progress_percent=min(100.0, float((i * 7) % 100)),
            start_date=datetime.datetime.utcnow() - datetime.timedelta(days=40),
            target_date=datetime.datetime.utcnow() + datetime.timedelta(days=80)
        )
        db.add(proj)

    # 8. Production Lines & Work Orders
    line1 = ProductionLine(site_id=sites_dict["HYD-01"].id, code="LINE-HYD-SMT1", name="High Speed SMT Surface Mount Line", capacity_per_shift=1000, status="Running")
    line2 = ProductionLine(site_id=sites_dict["BLR-02"].id, code="LINE-BLR-ASM2", name="Avionics Box Cleanroom Assembly Line", capacity_per_shift=500, status="Running")
    line3 = ProductionLine(site_id=sites_dict["CHE-03"].id, code="LINE-CHE-HVY1", name="Heavy Industrial Housing & Machining", capacity_per_shift=800, status="Idle")
    db.add_all([line1, line2, line3])
    db.flush()

    wo1 = WorkOrder(wo_number="WO-2026-001", product_id=prod1.id, site_id=sites_dict["HYD-01"].id, production_line_id=line1.id, target_quantity=1000, produced_quantity=930, rework_quantity=24, scrap_quantity=12, yield_rate=96.1, shift="Shift A", status="In Progress")
    wo2 = WorkOrder(wo_number="WO-2026-002", product_id=prod2.id, site_id=sites_dict["BLR-02"].id, production_line_id=line2.id, target_quantity=500, produced_quantity=492, rework_quantity=5, scrap_quantity=3, yield_rate=98.4, shift="Shift B", status="In Progress")
    db.add_all([wo1, wo2])

    # 9. Quality & Compliance (NCR, CAPA, Certificate, SPC)
    ncr1 = NCR(ncr_number="NCR-2026-042", title="PCB Micro-crack during Press-fit Pin Assembly", site_id=sites_dict["HYD-01"].id, supplier_id=sup1.id, severity="Critical", status="Open", description="Visual inspection detected micro-fissures in ground plane layer under 50x optical zoom.", containment_action="100% X-ray inspection implemented on all lot batches.", root_cause="Tooling insertion force setup was set 15% above specification.")
    ncr2 = NCR(ncr_number="NCR-2026-043", title="Thermal Pad Out-of-Spec Thickness", site_id=sites_dict["BLR-02"].id, supplier_id=sup3.id, severity="Major", status="CAPA Required", description="Received thermal interface pads measured 1.2mm vs 1.0mm required drawing spec.", containment_action="Quarantined Lot #8821 in MRB cage.", root_cause="Supplier used legacy punch die.")
    db.add_all([ncr1, ncr2])
    db.flush()

    capa1 = CAPA(capa_number="CAPA-2026-019", ncr_id=ncr1.id, title="Calibrate Press-fit Force Transducers & Implement Automated Stop", corrective_action="Re-calibrated hydraulic press and updated PLC force limits.", preventive_action="Added Poka-Yoke sensor to block cycle start if force limit exceeds 450N.", owner="Dr. Sarah Lin", status="In Progress", due_date=datetime.datetime.utcnow() + datetime.timedelta(days=14))
    db.add(capa1)

    cert1 = Certificate(cert_number="CERT-ISO-9001", name="ISO 9001:2015 Quality Management", issuing_body="TÜV SÜD South Asia", site_id=sites_dict["HYD-01"].id, issue_date=datetime.datetime.utcnow() - datetime.timedelta(days=300), expiry_date=datetime.datetime.utcnow() + datetime.timedelta(days=400), status="Active", owner="Quality Director")
    cert2 = Certificate(cert_number="CERT-IATF-16949", name="IATF 16949 Automotive Quality Standard", issuing_body="BSI Assurance", site_id=sites_dict["HYD-01"].id, issue_date=datetime.datetime.utcnow() - datetime.timedelta(days=340), expiry_date=datetime.datetime.utcnow() + datetime.timedelta(days=25), status="Expiring Soon", owner="Compliance Officer")
    db.add_all([cert1, cert2])

    spc1 = SPCRecord(parameter_name="Solder Paste Height (um)", site_id=sites_dict["HYD-01"].id, production_line_id=line1.id, sample_size=5, mean_value=124.5, ucl=140.0, lcl=110.0, usl=145.0, lsl=105.0, cpk=1.42, is_out_of_control=False)
    db.add(spc1)

    # 10. Supply Chain (Items, POs, Inventory, Supplier Scorecards, Shipments)
    item1 = Item(part_number="PN-MICRO-MCU-32", name="32-Bit Automotive Microcontroller", category="Semiconductor", standard_cost=18.50)
    item2 = Item(part_number="PN-ALU-HSINK-01", name="Extruded Aluminum Heatsink Base", category="Mechanical", standard_cost=12.00)
    db.add_all([item1, item2])
    db.flush()

    po1 = PurchaseOrder(po_number="PO-2026-789", supplier_id=sup1.id, site_id=sites_dict["HYD-01"].id, total_amount=185000.0, status="Confirmed", ordered_date=datetime.datetime.utcnow() - datetime.timedelta(days=15), required_date=datetime.datetime.utcnow() + datetime.timedelta(days=10))
    db.add(po1)
    db.flush()

    po_item1 = PurchaseOrderItem(po_id=po1.id, item_id=item1.id, quantity=10000, unit_price=18.50)
    db.add(po_item1)

    sc1 = SupplierScorecard(supplier_id=sup1.id, period="2026-Q2", otd_percent=96.5, quality_yield_percent=99.2, lead_time_days=10.0, overall_score=97.4)
    sc2 = SupplierScorecard(supplier_id=sup3.id, period="2026-Q2", otd_percent=88.0, quality_yield_percent=94.0, lead_time_days=18.0, overall_score=86.5)
    db.add_all([sc1, sc2])

    inv1 = Inventory(item_id=item1.id, site_id=sites_dict["HYD-01"].id, quantity_on_hand=12500, quantity_reserved=4000, min_stock_level=3000, max_stock_level=20000, reorder_point=5000, status="Healthy")
    inv2 = Inventory(item_id=item2.id, site_id=sites_dict["BLR-02"].id, quantity_on_hand=180, quantity_reserved=150, min_stock_level=500, max_stock_level=5000, reorder_point=800, status="Critical Shortage")
    db.add_all([inv1, inv2])

    shp1 = Shipment(shipment_number="SHP-2026-441", carrier="BlueDart Aviation Freight", tracking_number="BD-99482104-IN", origin_site_id=sites_dict["HYD-01"].id, destination="Tesla Gigafactory Texas, USA", status="In Transit", eta=datetime.datetime.utcnow() + datetime.timedelta(days=3))
    db.add(shp1)

    # 11. After-Sales (RMA, Warranty)
    rma1 = RMA(rma_number="RMA-2026-092", customer_id=cust2.id, product_id=prod1.id, serial_number="SN-ECU-2025-99411", reason="Intermittent Field Shutdown under High Temperature (>85C)", status="Inspecting", priority="High", assigned_technician="Samantha Reed")
    db.add(rma1)
    db.flush()

    wrn1 = WarrantyClaim(claim_number="WRN-2026-015", rma_id=rma1.id, customer_id=cust2.id, product_id=prod1.id, claim_amount=420.00, status="Approved", failure_mode="Thermal Transistor Solder Fatigue")
    db.add(wrn1)

    eol1 = EOLNotice(notice_number="EOL-2026-002", product_id=prod3.id, last_order_date=datetime.datetime.utcnow() + datetime.timedelta(days=120), last_shipment_date=datetime.datetime.utcnow() + datetime.timedelta(days=180), status="Active Notice")
    db.add(eol1)

    # 12. Documents & Knowledge Articles
    doc1 = Document(doc_number="DOC-ENG-001", title="Automotive ECU Schematics & PCB Layout", doc_type="Drawing", current_version="v2.1", status="Approved", uploaded_by_id=1)
    db.add(doc1)
    db.flush()

    dv1 = DocumentVersion(document_id=doc1.id, version="v2.1", change_summary="Updated ESD protection diodes on High-Speed CAN Bus lines")
    db.add(dv1)

    ka1 = KnowledgeArticle(title="SMT Reflow Oven Thermal Profile Setup SOP", category="SOP", content="Standard Operating Procedure for 10-Zone Lead-Free Reflow Oven calibration...", author="Vikram Seth", tags="SMT, Reflow, SOP, Process")
    ka2 = KnowledgeArticle(title="First-Article Inspection (FAI) Checklist & Sign-off", category="Quality Procedure", content="Step by step guidelines for first piece inspection after NPI line changeover...", author="Dr. Sarah Lin", tags="Quality, FAI, Inspection")
    db.add_all([ka1, ka2])

    # 13. Notifications & Activity Logs
    notif1 = Notification(user_id=1, title="IATF Certificate Expiring Soon", message="IATF 16949 Certificate for Hyderabad Main Campus expires in 25 days.", category="Alert", priority="High", link="/quality")
    notif2 = Notification(user_id=1, title="Low Stock Warning: Heatsink Base", message="PN-ALU-HSINK-01 is below critical reorder point at Bangalore Hub.", category="SupplyChain", priority="High", link="/supply-chain")
    db.add_all([notif1, notif2])

    log1 = ActivityLog(user_id=1, user_email="admin@factoryiq.com", action="LOGIN", entity_name="User", entity_id="1", details="User logged into Nexile - FactoryIQ Portal", ip_address="127.0.0.1")
    db.add(log1)

    db.commit()
    print("Database seeding completed successfully!")
    db.close()

if __name__ == "__main__":
    seed_database()
