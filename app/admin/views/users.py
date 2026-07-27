from sqladmin import ModelView

from app.models.models import User


class UserView(ModelView, model=User):
    can_create = False
    can_edit = False
    can_delete = False

    column_list = [
        User.id,
        User.username,
        User.full_name,
        User.gender,
        User.email,
        User.phone_number,
        User.role,
        User.is_active,
    ]
    column_searchable_list = [
        User.username,
        User.full_name,
        User.email,
        User.phone_number,
    ]
    column_sortable_list = [
        User.id,
        User.username,
        User.full_name,
        User.role,
        User.is_active,
    ]
    column_details_exclude_list = [
        User.password,
        User.bookings,
        User.adoptions,
        User.orders,
    ]
