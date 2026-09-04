from fastapi import APIRouter
from app.api.v1.endpoints import (
    auth, dashboard, projects, production, quality,
    supply_chain, after_sales, documents, collaboration,
    knowledge, analytics, notifications, search, admin
)

api_router = APIRouter()

api_router.include_router(auth.router, prefix="/auth", tags=["Authentication"])
api_router.include_router(dashboard.router, prefix="/dashboard", tags=["Executive Dashboard"])
api_router.include_router(projects.router, prefix="/projects", tags=["Program & Project Management"])
api_router.include_router(production.router, prefix="/production", tags=["Production Visibility"])
api_router.include_router(quality.router, prefix="/quality", tags=["Quality & Compliance"])
api_router.include_router(supply_chain.router, prefix="/supply-chain", tags=["Supply Chain & Logistics"])
api_router.include_router(after_sales.router, prefix="/after-sales", tags=["After-Sales & Warranty"])
api_router.include_router(documents.router, prefix="/documents", tags=["Document Management"])
api_router.include_router(collaboration.router, prefix="/collaboration", tags=["Collaboration Hub"])
api_router.include_router(knowledge.router, prefix="/knowledge", tags=["Knowledge Base"])
api_router.include_router(analytics.router, prefix="/analytics", tags=["Analytics & Reports"])
api_router.include_router(notifications.router, prefix="/notifications", tags=["Notifications"])
api_router.include_router(search.router, prefix="/search", tags=["Global Search"])
api_router.include_router(admin.router, prefix="/admin", tags=["Administration & Audit Trail"])
