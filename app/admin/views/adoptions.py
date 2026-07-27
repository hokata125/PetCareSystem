from sqladmin import ModelView

from app.models.models import Adoption


class AdoptionView(ModelView, model=Adoption):
    can_create = False
    can_delete = False

    column_list = [
        Adoption.id,
        Adoption.user_id,
        Adoption.owner_full_name,
        Adoption.owner_phone_number,
        Adoption.owner_address,
        Adoption.abandoned_pet_id,
        Adoption.pet_name,
        Adoption.pet_type,
        Adoption.pet_age,
        Adoption.pet_weight,
        Adoption.pet_health_status,
        Adoption.adoption_status,
    ]
    column_sortable_list = [
        Adoption.id,
        Adoption.adoption_status,
    ]
    form_columns = [Adoption.adoption_status]
