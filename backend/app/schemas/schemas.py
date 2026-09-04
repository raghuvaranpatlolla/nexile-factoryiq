import datetime
from typing import Optional, List, Any
from pydantic import BaseModel, EmailStr, ConfigDict

# Token & Auth
class Token(BaseModel):
    access_token: str
    token_type: str
    user: dict

class TokenData(BaseModel):
    user_id: Optional[int] = None
    email: Optional[str] = None
    role: Optional[str] = None

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class UserCreate(BaseModel):
    email: EmailStr
    password: str
    full_name: str
    job_title: Optional[str] = "Manufacturing Engineer"
    department: Optional[str] = "Operations"
    role_id: int
    site_id: Optional[int] = None

class UserOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    email: str
    full_name: str
    job_title: Optional[str]
    department: Optional[str]
    is_active: bool
    role_id: int
    role_name: Optional[str] = None
    site_id: Optional[int]

# Site, Customer, Supplier, Product
class SiteOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    code: str
    name: str
    location: str
    country: str

class CustomerOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    code: str
    name: str
    industry: Optional[str]
    contact_email: Optional[str]

class SupplierOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    code: str
    name: str
    category: Optional[str]
    rating: float

class ProductOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    sku: str
    name: str
    category: Optional[str]
    revision: str
    unit_cost: float

# Project & Milestones
class MilestoneOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    title: str
    phase: str
    due_date: datetime.datetime
    status: str

class ProjectCreate(BaseModel):
    project_code: str
    name: str
    description: Optional[str] = ""
    customer_id: int
    program_id: Optional[int] = None
    product_id: Optional[int] = None
    site_id: int
    manager_id: Optional[int] = None
    priority: Optional[str] = "High"
    target_date: Optional[datetime.datetime] = None

class ProjectOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    project_code: str
    name: str
    description: Optional[str]
    customer_id: int
    customer_name: Optional[str] = None
    site_id: int
    site_name: Optional[str] = None
    status: str
    health: str
    priority: str
    progress_percent: float
    start_date: datetime.datetime
    target_date: Optional[datetime.datetime]
    milestones: List[MilestoneOut] = []

# Production & Work Order
class WorkOrderOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    wo_number: str
    product_id: int
    product_name: Optional[str] = None
    site_id: int
    site_name: Optional[str] = None
    production_line_id: int
    line_code: Optional[str] = None
    target_quantity: int
    produced_quantity: int
    rework_quantity: int
    scrap_quantity: int
    yield_rate: float
    shift: str
    status: str
    start_time: datetime.datetime

# Quality (NCR, CAPA, Certificate)
class NCROut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    ncr_number: str
    title: str
    site_id: int
    severity: str
    status: str
    description: str
    containment_action: Optional[str]
    root_cause: Optional[str]
    created_at: datetime.datetime

class CAPAOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    capa_number: str
    title: str
    corrective_action: str
    preventive_action: str
    owner: str
    status: str
    due_date: datetime.datetime

class CertificateOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    cert_number: str
    name: str
    issuing_body: str
    issue_date: datetime.datetime
    expiry_date: datetime.datetime
    status: str

# Supply Chain (PO, Inventory, Shipment)
class PurchaseOrderOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    po_number: str
    supplier_id: int
    supplier_name: Optional[str] = None
    total_amount: float
    status: str
    ordered_date: datetime.datetime
    required_date: datetime.datetime

class InventoryOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    item_part_number: Optional[str] = None
    item_name: Optional[str] = None
    site_name: Optional[str] = None
    quantity_on_hand: int
    quantity_reserved: int
    min_stock_level: int
    reorder_point: int
    status: str

class ShipmentOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    shipment_number: str
    carrier: str
    tracking_number: str
    destination: str
    status: str
    eta: datetime.datetime

# After-Sales
class RMAOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    rma_number: str
    customer_name: Optional[str] = None
    product_name: Optional[str] = None
    serial_number: str
    reason: str
    status: str
    priority: str
    assigned_technician: Optional[str]

# Global Search
class SearchResult(BaseModel):
    category: str
    id: int
    title: str
    subtitle: str
    link: str

class NotificationOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    title: str
    message: str
    category: str
    priority: str
    is_read: bool
    created_at: datetime.datetime

class AuditLogOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    user_email: Optional[str]
    action: str
    entity_name: str
    entity_id: Optional[str]
    details: Optional[str]
    timestamp: datetime.datetime
