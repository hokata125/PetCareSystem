from fastapi import Request
from sqladmin import ModelView
from wtforms.validators import DataRequired, NumberRange

from app.models.models import Product


class ProductView(ModelView, model=Product):
    can_delete = False

    column_list = [
        Product.id,
        Product.name,
        Product.description,
        Product.price,
        Product.stock_quantity,
        Product.is_active,
    ]
    column_searchable_list = [Product.name]
    column_sortable_list = [
        Product.id,
        Product.name,
        Product.price,
        Product.stock_quantity,
    ]
    column_details_exclude_list = [Product.orders]
    form_columns = [
        Product.name,
        Product.description,
        Product.price,
        Product.stock_quantity,
        Product.image,
        Product.is_active,
    ]
    form_args = {
        "name": {
            "validators": [
                DataRequired(
                    message="Tên sản phẩm không được để trống!",
                )
            ]
        },
        "price": {
            "validators": [
                NumberRange(
                    min=1,
                    message="Giá sản phẩm phải lớn hơn 0!",
                )
            ]
        },
        "stock_quantity": {
            "validators": [
                NumberRange(
                    min=0,
                    max=10000,
                    message="Số lượng tồn kho phải từ 0 - 10000!",
                )
            ]
        },
    }

    async def on_model_change(
        self,
        data: dict,
        model: Product,
        is_created: bool,
        request: Request,
    ) -> None:
        data["name"] = data["name"].strip()
