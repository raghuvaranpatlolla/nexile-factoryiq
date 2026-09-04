from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import List
from app.database.session import get_db
from app.models.models import Document, DocumentVersion, BOM, Product, Item, KnowledgeArticle

router = APIRouter(prefix="/documents", tags=["Documents & Knowledge"])

@router.get("")
def get_documents(db: Session = Depends(get_db)):
    docs = db.query(Document).order_by(Document.id.desc()).all()
    res = []
    for d in docs:
        res.append({
            "id": d.id,
            "doc_number": d.doc_number,
            "title": d.title,
            "doc_type": d.doc_type,
            "current_version": d.current_version,
            "status": d.status,
            "created_at": d.created_at
        })
    return res

@router.get("/boms")
def get_bom_tree(product_id: int = Query(1), db: Session = Depends(get_db)):
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        product_name = "High-Speed Automotive ECU"
        sku = "PRD-ECU-9000"
    else:
        product_name = product.name
        sku = product.sku

    boms = db.query(BOM).filter(BOM.product_id == product_id).all()
    
    components = []
    if boms:
        for b in boms:
            components.append({
                "part_number": b.component_item.part_number if b.component_item else "PN-COMP-01",
                "name": b.component_item.name if b.component_item else "Component",
                "quantity": b.quantity,
                "unit": b.component_item.unit_of_measure if b.component_item else "PCS",
                "cost": b.component_item.standard_cost if b.component_item else 15.0,
                "revision": b.revision
            })
    else:
        components = [
            {"part_number": "PN-MICRO-MCU-32", "name": "32-Bit Automotive Microcontroller", "quantity": 1, "unit": "PCS", "cost": 18.50, "revision": "A"},
            {"part_number": "PN-ALU-HSINK-01", "name": "Extruded Aluminum Heatsink Base", "quantity": 1, "unit": "PCS", "cost": 12.00, "revision": "B"},
            {"part_number": "PN-CAN-TRANS-02", "name": "High-Speed CAN Transceiver IC", "quantity": 2, "unit": "PCS", "cost": 3.40, "revision": "A"},
            {"part_number": "PN-PCB-6L-FR4", "name": "6-Layer High TG FR4 PCB Substrate", "quantity": 1, "unit": "PCS", "cost": 8.90, "revision": "C"}
        ]
        
    return {
        "product_id": product_id,
        "product_name": product_name,
        "sku": sku,
        "revision": "v2.1",
        "total_cost": sum(c["cost"] * c["quantity"] for c in components),
        "components": components
    }

@router.get("/knowledge-base")
def get_knowledge_articles(db: Session = Depends(get_db)):
    articles = db.query(KnowledgeArticle).all()
    return articles
