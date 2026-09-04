from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from app.database.session import get_db
from app.models.models import PurchaseOrder, SupplierScorecard, Inventory, Shipment, Supplier, Item, Site
from app.schemas.schemas import PurchaseOrderOut, InventoryOut, ShipmentOut, SupplierOut

router = APIRouter(prefix="/supply-chain", tags=["Supply Chain"])

@router.get("/pos", response_model=List[PurchaseOrderOut])
def get_purchase_orders(db: Session = Depends(get_db)):
    pos = db.query(PurchaseOrder).order_by(PurchaseOrder.id.desc()).all()
    result = []
    for p in pos:
        p_dict = PurchaseOrderOut.model_validate(p)
        if p.supplier:
            p_dict.supplier_name = p.supplier.name
        result.append(p_dict)
    return result

@router.get("/suppliers", response_model=List[SupplierOut])
def get_suppliers(db: Session = Depends(get_db)):
    return db.query(Supplier).all()

@router.get("/scorecards")
def get_supplier_scorecards(db: Session = Depends(get_db)):
    scs = db.query(SupplierScorecard).all()
    res = []
    for s in scs:
        res.append({
            "id": s.id,
            "supplier_name": s.supplier.name if s.supplier else "N/A",
            "period": s.period,
            "otd_percent": s.otd_percent,
            "quality_yield_percent": s.quality_yield_percent,
            "lead_time_days": s.lead_time_days,
            "overall_score": s.overall_score
        })
    return res

@router.get("/inventory", response_model=List[InventoryOut])
def get_inventory(db: Session = Depends(get_db)):
    invs = db.query(Inventory).all()
    res = []
    for i in invs:
        i_dict = InventoryOut.model_validate(i)
        if i.item:
            i_dict.item_part_number = i.item.part_number
            i_dict.item_name = i.item.name
        if i.site:
            i_dict.site_name = i.site.name
        res.append(i_dict)
    return res

@router.get("/shipments", response_model=List[ShipmentOut])
def get_shipments(db: Session = Depends(get_db)):
    return db.query(Shipment).all()
