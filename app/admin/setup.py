from fastapi import FastAPI
from sqladmin import Admin

from app.admin.views import (
    AbandonedPetView,
    AdoptionView,
    BookingView,
    OrderView,
    ProductView,
    ServiceView,
    UserView,
)
from app.db.session import engine


def setup_admin(app: FastAPI) -> Admin:
    admin = Admin(app, engine)

    admin.add_view(UserView)
    admin.add_view(ProductView)
    admin.add_view(ServiceView)
    admin.add_view(AbandonedPetView)
    admin.add_view(BookingView)
    admin.add_view(OrderView)
    admin.add_view(AdoptionView)

    return admin
