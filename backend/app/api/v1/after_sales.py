from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import List
from app.database.session import get_db
from app.models.models import RMA, WarrantyClaim, EOLNotice, Product, Customer
from app.schemas.schemas import RMAOut

router = APIRouter(prefix="/after-sales", tags=["After-Sales & Service"])

@router.get("/rmas", response_model=List[RMAOut])
def get_rmas(db: Session = Depends(get_db)):
    rmas = db.query(RMA).order_by(RMA.id.desc()).all()
    res = []
    for r in rmas:
        r_dict = RMAOut.model_validate(r)
        if r.customer:
            r_dict.customer_name = r.customer.name
        if r.product:
            r_dict.product_name = r.product.name
        res.append(r_dict)
    return res

@router.get("/warranties")
def get_warranties(db: Session = Depends(get_db)):
    claims = db.query(WarrantyClaim).all()
    return claims

@router.get("/eol")
def get_eol_notices(db: Session = Depends(get_db)):
    notices = db.query(EOLNotice).all()
    res = []
    for n in notices:
        res.append({
            "id": n.id,
            "notice_number": n.notice_number,
            "product_name": n.product.name if n.product else "N/A",
            "last_order_date": n.last_order_date,
            "last_shipment_date": n.last_shipment_date,
            "status": n.status
        })
    return res
