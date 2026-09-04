import datetime
from sqlalchemy import (
    Column, Integer, String, Boolean, Float, DateTime, Text, ForeignKey, Table, Enum, JSON
)
from sqlalchemy.orm import relationship
from app.database.session import Base

# Association table for Role <-> Permission
role_permissions = Table(
    'role_permissions',
    Base.metadata,
    Column('role_id', Integer, ForeignKey('roles.id', ondelete="CASCADE")),
    Column('permission_id', Integer, ForeignKey('permissions.id', ondelete="CASCADE"))
)

class Role(Base):
    __tablename__ = 'roles'
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(50), unique=True, index=True, nullable=False) # e.g. Super Admin, Management, Customer, Quality Manager, etc.
    description = Column(Text, nullable=True)
    
    users = relationship("User", back_populates="role")
    permissions = relationship("Permission", secondary=role_permissions, back_populates="roles")

class Permission(Base):
    __tablename__ = 'permissions'
    id = Column(Integer, primary_key=True, index=True)
    code = Column(String(100), unique=True, index=True, nullable=False) # e.g. project:read, project:write, quality:approve
    name = Column(String(100), nullable=False)
    module = Column(String(50), nullable=False)
    
    roles = relationship("Role", secondary=role_permissions, back_populates="permissions")

class User(Base):
    __tablename__ = 'users'
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(120), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    full_name = Column(String(100), nullable=False)
    job_title = Column(String(100), nullable=True)
    department = Column(String(100), nullable=True)
    avatar_url = Column(String(255), nullable=True)
    is_active = Column(Boolean, default=True)
    role_id = Column(Integer, ForeignKey('roles.id'), nullable=False)
    site_id = Column(Integer, ForeignKey('sites.id'), nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    
    role = relationship("Role", back_populates="users")
    site = relationship("Site")

class Site(Base):
    __tablename__ = 'sites'
    id = Column(Integer, primary_key=True, index=True)
    code = Column(String(20), unique=True, nullable=False) # e.g. HYD-01, BLR-02
    name = Column(String(100), nullable=False) # Hyderabad, Bangalore, Chennai, Pune
    location = Column(String(255), nullable=False)
    country = Column(String(50), default="India")
    timezone = Column(String(50), default="Asia/Kolkata")
    
    production_lines = relationship("ProductionLine", back_populates="site")

class Customer(Base):
    __tablename__ = 'customers'
    id = Column(Integer, primary_key=True, index=True)
    code = Column(String(50), unique=True, nullable=False)
    name = Column(String(100), nullable=False)
    industry = Column(String(100), nullable=True)
    contact_email = Column(String(120), nullable=True)
    phone = Column(String(50), nullable=True)
    country = Column(String(50), nullable=True)

class Supplier(Base):
    __tablename__ = 'suppliers'
    id = Column(Integer, primary_key=True, index=True)
    code = Column(String(50), unique=True, nullable=False)
    name = Column(String(100), nullable=False)
    category = Column(String(100), nullable=True) # Electronics, Raw Metals, Plastics, Machining
    contact_person = Column(String(100), nullable=True)
    email = Column(String(120), nullable=True)
    phone = Column(String(50), nullable=True)
    rating = Column(Float, default=4.5)

class Program(Base):
    __tablename__ = 'programs'
    id = Column(Integer, primary_key=True, index=True)
    code = Column(String(50), unique=True, nullable=False)
    name = Column(String(100), nullable=False)
    customer_id = Column(Integer, ForeignKey('customers.id'), nullable=False)
    budget = Column(Float, default=0.0)
    status = Column(String(50), default="Active")
    
    customer = relationship("Customer")
    projects = relationship("Project", back_populates="program")

class Product(Base):
    __tablename__ = 'products'
    id = Column(Integer, primary_key=True, index=True)
    sku = Column(String(50), unique=True, index=True, nullable=False)
    name = Column(String(100), nullable=False)
    description = Column(Text, nullable=True)
    category = Column(String(50), nullable=True)
    revision = Column(String(20), default="v1.0")
    unit_cost = Column(Float, default=0.0)

class Project(Base):
    __tablename__ = 'projects'
    id = Column(Integer, primary_key=True, index=True)
    project_code = Column(String(50), unique=True, index=True, nullable=False) # e.g. PRJ-HYD-101
    name = Column(String(150), nullable=False)
    description = Column(Text, nullable=True)
    customer_id = Column(Integer, ForeignKey('customers.id'), nullable=False)
    program_id = Column(Integer, ForeignKey('programs.id'), nullable=True)
    product_id = Column(Integer, ForeignKey('products.id'), nullable=True)
    site_id = Column(Integer, ForeignKey('sites.id'), nullable=False)
    manager_id = Column(Integer, ForeignKey('users.id'), nullable=True)
    
    status = Column(String(50), default="In Progress") # Draft, Planned, In Progress, At Risk, Blocked, Completed, Cancelled
    health = Column(String(20), default="Green") # Green, Yellow, Red
    priority = Column(String(20), default="High") # Low, Medium, High, Critical
    progress_percent = Column(Float, default=0.0)
    
    start_date = Column(DateTime, default=datetime.datetime.utcnow)
    target_date = Column(DateTime, nullable=True)
    completed_date = Column(DateTime, nullable=True)
    
    customer = relationship("Customer")
    program = relationship("Program", back_populates="projects")
    product = relationship("Product")
    site = relationship("Site")
    manager = relationship("User")
    
    milestones = relationship("Milestone", back_populates="project", cascade="all, delete-orphan")
    risks = relationship("ProjectRisk", back_populates="project", cascade="all, delete-orphan")
    issues = relationship("ProjectIssue", back_populates="project", cascade="all, delete-orphan")

class Milestone(Base):
    __tablename__ = 'milestones'
    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(Integer, ForeignKey('projects.id', ondelete="CASCADE"), nullable=False)
    title = Column(String(150), nullable=False)
    phase = Column(String(50), nullable=False) # R&D, NPI, Design Review, Qualification, Launch
    due_date = Column(DateTime, nullable=False)
    status = Column(String(50), default="Pending") # Pending, In Progress, Completed, Delayed
    completed_at = Column(DateTime, nullable=True)
    
    project = relationship("Project", back_populates="milestones")

class ProjectRisk(Base):
    __tablename__ = 'project_risks'
    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(Integer, ForeignKey('projects.id', ondelete="CASCADE"), nullable=False)
    title = Column(String(150), nullable=False)
    category = Column(String(50), default="Technical")
    impact = Column(String(20), default="Medium") # Low, Medium, High
    probability = Column(String(20), default="Medium")
    mitigation_plan = Column(Text, nullable=True)
    owner = Column(String(100), nullable=True)
    status = Column(String(50), default="Identified") # Identified, Mitigated, Closed
    
    project = relationship("Project", back_populates="risks")

class ProjectIssue(Base):
    __tablename__ = 'project_issues'
    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(Integer, ForeignKey('projects.id', ondelete="CASCADE"), nullable=False)
    title = Column(String(150), nullable=False)
    severity = Column(String(20), default="Major") # Minor, Major, Critical
    status = Column(String(50), default="Open") # Open, In Progress, Resolved
    assigned_to = Column(String(100), nullable=True)
    due_date = Column(DateTime, nullable=True)
    
    project = relationship("Project", back_populates="issues")

class ProductionLine(Base):
    __tablename__ = 'production_lines'
    id = Column(Integer, primary_key=True, index=True)
    site_id = Column(Integer, ForeignKey('sites.id'), nullable=False)
    code = Column(String(50), nullable=False)
    name = Column(String(100), nullable=False)
    capacity_per_shift = Column(Integer, default=1000)
    status = Column(String(50), default="Running") # Running, Idle, Maintenance, Stopped
    
    site = relationship("Site", back_populates="production_lines")

class WorkOrder(Base):
    __tablename__ = 'work_orders'
    id = Column(Integer, primary_key=True, index=True)
    wo_number = Column(String(50), unique=True, index=True, nullable=False) # WO-2026-001
    project_id = Column(Integer, ForeignKey('projects.id'), nullable=True)
    product_id = Column(Integer, ForeignKey('products.id'), nullable=False)
    site_id = Column(Integer, ForeignKey('sites.id'), nullable=False)
    production_line_id = Column(Integer, ForeignKey('production_lines.id'), nullable=False)
    
    target_quantity = Column(Integer, nullable=False)
    produced_quantity = Column(Integer, default=0)
    rework_quantity = Column(Integer, default=0)
    scrap_quantity = Column(Integer, default=0)
    yield_rate = Column(Float, default=100.0)
    
    shift = Column(String(20), default="Shift A")
    status = Column(String(50), default="In Progress") # Planned, In Progress, Completed, On Hold
    start_time = Column(DateTime, default=datetime.datetime.utcnow)
    end_time = Column(DateTime, nullable=True)
    
    project = relationship("Project")
    product = relationship("Product")
    site = relationship("Site")
    production_line = relationship("ProductionLine")

class Item(Base):
    __tablename__ = 'items'
    id = Column(Integer, primary_key=True, index=True)
    part_number = Column(String(50), unique=True, index=True, nullable=False)
    name = Column(String(100), nullable=False)
    category = Column(String(50), nullable=True) # Component, Assembly, Raw Material
    unit_of_measure = Column(String(20), default="PCS")
    standard_cost = Column(Float, default=0.0)

class BOM(Base):
    __tablename__ = 'boms'
    id = Column(Integer, primary_key=True, index=True)
    product_id = Column(Integer, ForeignKey('products.id'), nullable=False)
    parent_item_id = Column(Integer, ForeignKey('items.id'), nullable=True)
    component_item_id = Column(Integer, ForeignKey('items.id'), nullable=False)
    quantity = Column(Float, default=1.0)
    reference_designator = Column(String(100), nullable=True)
    revision = Column(String(20), default="A")
    
    product = relationship("Product")
    component_item = relationship("Item", foreign_keys=[component_item_id])

class Document(Base):
    __tablename__ = 'documents'
    id = Column(Integer, primary_key=True, index=True)
    doc_number = Column(String(50), unique=True, index=True, nullable=False) # DOC-ENG-001
    title = Column(String(150), nullable=False)
    doc_type = Column(String(50), nullable=False) # Drawing, Specification, Certificate, Test Report, BOM, Contract
    project_id = Column(Integer, ForeignKey('projects.id'), nullable=True)
    current_version = Column(String(20), default="1.0")
    status = Column(String(50), default="Approved") # Draft, Under Review, Approved, Obsolete
    file_path = Column(String(255), nullable=True)
    uploaded_by_id = Column(Integer, ForeignKey('users.id'), nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    
    project = relationship("Project")
    uploaded_by = relationship("User")
    versions = relationship("DocumentVersion", back_populates="document", cascade="all, delete-orphan")

class DocumentVersion(Base):
    __tablename__ = 'document_versions'
    id = Column(Integer, primary_key=True, index=True)
    document_id = Column(Integer, ForeignKey('documents.id', ondelete="CASCADE"), nullable=False)
    version = Column(String(20), nullable=False) # 1.0, 1.1, 2.0
    change_summary = Column(Text, nullable=True)
    file_path = Column(String(255), nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    
    document = relationship("Document", back_populates="versions")

class ECO(Base):
    __tablename__ = 'ecos'
    id = Column(Integer, primary_key=True, index=True)
    eco_number = Column(String(50), unique=True, index=True, nullable=False) # ECO-2026-088
    title = Column(String(150), nullable=False)
    product_id = Column(Integer, ForeignKey('products.id'), nullable=False)
    reason = Column(Text, nullable=False)
    status = Column(String(50), default="Under Review") # Draft, Under Review, Approved, Implemented, Rejected
    priority = Column(String(20), default="Medium")
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    
    product = relationship("Product")

class Certificate(Base):
    __tablename__ = 'certificates'
    id = Column(Integer, primary_key=True, index=True)
    cert_number = Column(String(50), unique=True, index=True, nullable=False)
    name = Column(String(150), nullable=False) # ISO 9001:2015, IATF 16949, AS9100D, Compliance Pack
    issuing_body = Column(String(100), nullable=False)
    site_id = Column(Integer, ForeignKey('sites.id'), nullable=True)
    supplier_id = Column(Integer, ForeignKey('suppliers.id'), nullable=True)
    issue_date = Column(DateTime, nullable=False)
    expiry_date = Column(DateTime, nullable=False)
    status = Column(String(50), default="Active") # Active, Expiring Soon, Expired
    owner = Column(String(100), nullable=True)
    file_path = Column(String(255), nullable=True)
    
    site = relationship("Site")
    supplier = relationship("Supplier")

class NCR(Base):
    __tablename__ = 'ncrs'
    id = Column(Integer, primary_key=True, index=True)
    ncr_number = Column(String(50), unique=True, index=True, nullable=False) # NCR-2026-042
    title = Column(String(150), nullable=False)
    project_id = Column(Integer, ForeignKey('projects.id'), nullable=True)
    site_id = Column(Integer, ForeignKey('sites.id'), nullable=False)
    supplier_id = Column(Integer, ForeignKey('suppliers.id'), nullable=True)
    severity = Column(String(20), default="Major") # Minor, Major, Critical
    status = Column(String(50), default="Open") # Open, Under Investigation, CAPA Required, Closed
    description = Column(Text, nullable=False)
    containment_action = Column(Text, nullable=True)
    root_cause = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    due_date = Column(DateTime, nullable=True)
    
    project = relationship("Project")
    site = relationship("Site")
    supplier = relationship("Supplier")

class CAPA(Base):
    __tablename__ = 'capas'
    id = Column(Integer, primary_key=True, index=True)
    capa_number = Column(String(50), unique=True, index=True, nullable=False) # CAPA-2026-019
    ncr_id = Column(Integer, ForeignKey('ncrs.id'), nullable=True)
    title = Column(String(150), nullable=False)
    corrective_action = Column(Text, nullable=False)
    preventive_action = Column(Text, nullable=False)
    owner = Column(String(100), nullable=False)
    status = Column(String(50), default="In Progress") # Draft, In Progress, Pending Verification, Closed
    effectiveness_verified = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    due_date = Column(DateTime, nullable=False)
    
    ncr = relationship("NCR")

class Audit(Base):
    __tablename__ = 'audits'
    id = Column(Integer, primary_key=True, index=True)
    audit_number = Column(String(50), unique=True, index=True, nullable=False) # AUD-2026-005
    title = Column(String(150), nullable=False)
    audit_type = Column(String(50), default="Internal Quality") # Internal, External Customer, ISO Registrar
    site_id = Column(Integer, ForeignKey('sites.id'), nullable=False)
    lead_auditor = Column(String(100), nullable=False)
    audit_date = Column(DateTime, nullable=False)
    status = Column(String(50), default="Scheduled") # Scheduled, In Progress, Completed, Action Required
    score_percent = Column(Float, default=95.0)

class SPCRecord(Base):
    __tablename__ = 'spc_records'
    id = Column(Integer, primary_key=True, index=True)
    parameter_name = Column(String(100), nullable=False) # Dimension A, Solder Thickness, Voltage Tolerance
    site_id = Column(Integer, ForeignKey('sites.id'), nullable=False)
    production_line_id = Column(Integer, ForeignKey('production_lines.id'), nullable=False)
    sample_size = Column(Integer, default=5)
    mean_value = Column(Float, nullable=False)
    ucl = Column(Float, nullable=False) # Upper Control Limit
    lcl = Column(Float, nullable=False) # Lower Control Limit
    usl = Column(Float, nullable=False) # Upper Spec Limit
    lsl = Column(Float, nullable=False) # Lower Spec Limit
    cpk = Column(Float, nullable=False)
    is_out_of_control = Column(Boolean, default=False)
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)

class SupplierScorecard(Base):
    __tablename__ = 'supplier_scorecards'
    id = Column(Integer, primary_key=True, index=True)
    supplier_id = Column(Integer, ForeignKey('suppliers.id'), nullable=False)
    period = Column(String(20), nullable=False) # e.g. 2026-Q1, 2026-Q2
    otd_percent = Column(Float, default=94.0) # On-Time Delivery
    quality_yield_percent = Column(Float, default=98.5)
    lead_time_days = Column(Float, default=12.0)
    overall_score = Column(Float, default=92.0)
    
    supplier = relationship("Supplier")

class PurchaseOrder(Base):
    __tablename__ = 'purchase_orders'
    id = Column(Integer, primary_key=True, index=True)
    po_number = Column(String(50), unique=True, index=True, nullable=False) # PO-2026-789
    supplier_id = Column(Integer, ForeignKey('suppliers.id'), nullable=False)
    site_id = Column(Integer, ForeignKey('sites.id'), nullable=False)
    total_amount = Column(Float, default=0.0)
    status = Column(String(50), default="Confirmed") # Draft, Submitted, Confirmed, Partial, Delayed, Completed, Cancelled
    ordered_date = Column(DateTime, default=datetime.datetime.utcnow)
    required_date = Column(DateTime, nullable=False)
    delivery_date = Column(DateTime, nullable=True)
    
    supplier = relationship("Supplier")
    site = relationship("Site")
    items = relationship("PurchaseOrderItem", back_populates="po", cascade="all, delete-orphan")

class PurchaseOrderItem(Base):
    __tablename__ = 'po_items'
    id = Column(Integer, primary_key=True, index=True)
    po_id = Column(Integer, ForeignKey('purchase_orders.id', ondelete="CASCADE"), nullable=False)
    item_id = Column(Integer, ForeignKey('items.id'), nullable=False)
    quantity = Column(Integer, nullable=False)
    unit_price = Column(Float, nullable=False)
    
    po = relationship("PurchaseOrder", back_populates="items")
    item = relationship("Item")

class Inventory(Base):
    __tablename__ = 'inventory'
    id = Column(Integer, primary_key=True, index=True)
    item_id = Column(Integer, ForeignKey('items.id'), nullable=False)
    site_id = Column(Integer, ForeignKey('sites.id'), nullable=False)
    quantity_on_hand = Column(Integer, default=100)
    quantity_reserved = Column(Integer, default=10)
    min_stock_level = Column(Integer, default=20)
    max_stock_level = Column(Integer, default=500)
    reorder_point = Column(Integer, default=30)
    location_bin = Column(String(50), default="A-01-12")
    status = Column(String(50), default="Healthy") # Healthy, Low Stock, Critical Shortage, Overstock
    
    item = relationship("Item")
    site = relationship("Site")

class Shipment(Base):
    __tablename__ = 'shipments'
    id = Column(Integer, primary_key=True, index=True)
    shipment_number = Column(String(50), unique=True, index=True, nullable=False) # SHP-2026-441
    carrier = Column(String(100), default="DHL Express")
    tracking_number = Column(String(100), nullable=False)
    origin_site_id = Column(Integer, ForeignKey('sites.id'), nullable=False)
    destination = Column(String(200), nullable=False)
    status = Column(String(50), default="In Transit") # Preparing, In Transit, Delivered, Delayed, Exception
    eta = Column(DateTime, nullable=False)
    shipped_date = Column(DateTime, default=datetime.datetime.utcnow)
    
    origin_site = relationship("Site")

class RMA(Base):
    __tablename__ = 'rmas'
    id = Column(Integer, primary_key=True, index=True)
    rma_number = Column(String(50), unique=True, index=True, nullable=False) # RMA-2026-092
    customer_id = Column(Integer, ForeignKey('customers.id'), nullable=False)
    product_id = Column(Integer, ForeignKey('products.id'), nullable=False)
    serial_number = Column(String(100), nullable=False)
    reason = Column(Text, nullable=False)
    status = Column(String(50), default="Received") # Requested, Approved, Received, Inspecting, Repaired, Replaced, Closed
    priority = Column(String(20), default="High")
    assigned_technician = Column(String(100), nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    
    customer = relationship("Customer")
    product = relationship("Product")

class WarrantyClaim(Base):
    __tablename__ = 'warranty_claims'
    id = Column(Integer, primary_key=True, index=True)
    claim_number = Column(String(50), unique=True, index=True, nullable=False) # WRN-2026-015
    rma_id = Column(Integer, ForeignKey('rmas.id'), nullable=True)
    customer_id = Column(Integer, ForeignKey('customers.id'), nullable=False)
    product_id = Column(Integer, ForeignKey('products.id'), nullable=False)
    claim_amount = Column(Float, default=0.0)
    status = Column(String(50), default="Under Review") # Under Review, Approved, Rejected, Paid
    failure_mode = Column(String(100), nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

class EOLNotice(Base):
    __tablename__ = 'eol_notices'
    id = Column(Integer, primary_key=True, index=True)
    notice_number = Column(String(50), unique=True, index=True, nullable=False)
    product_id = Column(Integer, ForeignKey('products.id'), nullable=False)
    last_order_date = Column(DateTime, nullable=False)
    last_shipment_date = Column(DateTime, nullable=False)
    replacement_product_id = Column(Integer, ForeignKey('products.id'), nullable=True)
    status = Column(String(50), default="Active Notice")
    
    product = relationship("Product", foreign_keys=[product_id])

class Comment(Base):
    __tablename__ = 'comments'
    id = Column(Integer, primary_key=True, index=True)
    entity_type = Column(String(50), nullable=False) # project, ncr, capa, rma, document
    entity_id = Column(Integer, nullable=False)
    user_id = Column(Integer, ForeignKey('users.id'), nullable=False)
    content = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    
    user = relationship("User")

class Notification(Base):
    __tablename__ = 'notifications'
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey('users.id'), nullable=False)
    title = Column(String(150), nullable=False)
    message = Column(Text, nullable=False)
    category = Column(String(50), default="System") # Project, Quality, Production, SupplyChain, Alert
    priority = Column(String(20), default="Medium") # Low, Medium, High, Critical
    is_read = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    link = Column(String(255), nullable=True)

class KnowledgeArticle(Base):
    __tablename__ = 'knowledge_articles'
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(150), nullable=False)
    category = Column(String(50), nullable=False) # SOP, Quality Procedure, Maintenance, Training
    content = Column(Text, nullable=False)
    author = Column(String(100), nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    tags = Column(String(200), nullable=True)

class ActivityLog(Base):
    __tablename__ = 'activity_logs'
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey('users.id'), nullable=True)
    user_email = Column(String(120), nullable=True)
    action = Column(String(50), nullable=False) # LOGIN, CREATE, UPDATE, DELETE, APPROVE
    entity_name = Column(String(50), nullable=False) # Project, NCR, WorkOrder, User
    entity_id = Column(String(50), nullable=True)
    details = Column(Text, nullable=True)
    ip_address = Column(String(50), nullable=True)
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)
