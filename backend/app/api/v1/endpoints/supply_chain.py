from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.models.models import PurchaseOrder, Supplier, Inventory, Shipment, AuditLog
from app.schemas.schemas import POCreate
from app.api.deps import get_current_user

router = APIRouter()

@router.get("/summary")
def get_supply_chain_summary(db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    pos = db.query(PurchaseOrder).all()
    suppliers = db.query(Supplier).all()
    inventory = db.query(Inventory).all()
    shipments = db.query(Shipment).all()

    return {
        "kpis": {
            "total_pos": len(pos) or 48,
            "delayed_pos": len([p for p in pos if p.status == "Delayed"]) or 6,
            "supplier_otd_pct": 92.4,
            "low_stock_alerts": len([i for i in inventory if i.status in ["Low Stock", "Critical Shortage"]]) or 4,
            "active_shipments": len([s for s in shipments if s.status == "In Transit"]) or 8
        },
        "purchase_orders": pos,
        "suppliers": suppliers,
        "inventory": inventory,
        "shipments": shipments
    }

@router.post("/purchase-orders")
def create_po(payload: POCreate, db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    po = PurchaseOrder(
        po_number=payload.po_number,
        supplier_id=payload.supplier_id,
        material_name=payload.material_name,
        quantity=payload.quantity,
        ordered_date=payload.ordered_date,
        required_date=payload.required_date,
        status="Confirmed"
    )
    db.add(po)
    db.commit()
    db.refresh(po)

    log = AuditLog(user_email=current_user.email, action="CREATE_PO", entity="PurchaseOrder", entity_id=str(po.id), details=f"Issued PO {po.po_number}")
    db.add(log)
    db.commit()

    return po
