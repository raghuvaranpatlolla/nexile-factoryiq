from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.models.models import Project, Document, Product, PurchaseOrder, NCR, RMA, Inventory, KnowledgeArticle
from app.api.deps import get_current_user

router = APIRouter()

@router.get("")
def global_search(q: str = Query(..., min_length=1), db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    term = f"%{q.strip()}%"

    # Search Projects
    projects = db.query(Project).filter(
        (Project.name.ilike(term)) | (Project.project_id_code.ilike(term))
    ).limit(5).all()

    # Search Documents
    documents = db.query(Document).filter(
        (Document.title.ilike(term)) | (Document.doc_number.ilike(term))
    ).limit(5).all()

    # Search Products
    products = db.query(Product).filter(
        (Product.name.ilike(term)) | (Product.part_number.ilike(term))
    ).limit(5).all()

    # Search POs
    pos = db.query(PurchaseOrder).filter(
        (PurchaseOrder.po_number.ilike(term)) | (PurchaseOrder.material_name.ilike(term))
    ).limit(5).all()

    # Search NCRs
    ncrs = db.query(NCR).filter(
        (NCR.ncr_number.ilike(term)) | (NCR.product_name.ilike(term)) | (NCR.description.ilike(term))
    ).limit(5).all()

    # Search RMAs
    rmas = db.query(RMA).filter(
        (RMA.rma_number.ilike(term)) | (RMA.customer_name.ilike(term)) | (RMA.product_name.ilike(term))
    ).limit(5).all()

    # Search Knowledge Base
    articles = db.query(KnowledgeArticle).filter(
        (KnowledgeArticle.title.ilike(term)) | (KnowledgeArticle.content.ilike(term))
    ).limit(5).all()

    results = []
    if projects:
        results.append({"category": "Projects", "count": len(projects), "items": [{"id": p.id, "title": f"{p.project_id_code} - {p.name}", "subtitle": f"Status: {p.status}"} for p in projects]})
    if documents:
        results.append({"category": "Documents", "count": len(documents), "items": [{"id": d.id, "title": f"{d.doc_number} - {d.title}", "subtitle": f"Type: {d.doc_type} | Rev: {d.revision}"} for d in documents]})
    if products:
        results.append({"category": "Products & BOM", "count": len(products), "items": [{"id": pr.id, "title": f"{pr.part_number} - {pr.name}", "subtitle": f"Category: {pr.category}"} for pr in products]})
    if pos:
        results.append({"category": "Purchase Orders", "count": len(pos), "items": [{"id": po.id, "title": f"{po.po_number} - {po.material_name}", "subtitle": f"Status: {po.status}"} for po in pos]})
    if ncrs:
        results.append({"category": "NCR / CAPA", "count": len(ncrs), "items": [{"id": n.id, "title": f"{n.ncr_number} - {n.product_name}", "subtitle": f"Severity: {n.severity}"} for n in ncrs]})
    if rmas:
        results.append({"category": "After-Sales RMA", "count": len(rmas), "items": [{"id": r.id, "title": f"{r.rma_number} - {r.customer_name}", "subtitle": f"Status: {r.status}"} for r in rmas]})
    if articles:
        results.append({"category": "Knowledge Base", "count": len(articles), "items": [{"id": a.id, "title": a.title, "subtitle": f"Category: {a.category}"} for a in articles]})

    return {
        "query": q,
        "total_categories": len(results),
        "results": results
    }
