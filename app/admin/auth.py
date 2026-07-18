from fastapi import Request
from sqladmin.authentication import AuthenticationBackend

from app.core.configs import settings
from app.db.session import SessionLocal
from app.models.models import UserRole
from app.services.users import auth_user, get_user_by_id


class AdminAuthentication(AuthenticationBackend):
    async def login(self, request: Request) -> bool:
        form = await request.form()
        username = form.get("username")
        password = form.get("password")

        if not isinstance(username, str) or not isinstance(password, str):
            return False

        with SessionLocal() as db:
            user = auth_user(
                db,
                username,
                password,
            )

            if user is None or not user.is_active or user.role != UserRole.ADMIN:
                return False

            request.session.update(
                {
                    "admin_id": user.id,
                    "admin_name": user.full_name,
                }
            )

        return True

    async def logout(self, request: Request) -> bool:
        request.session.clear()
        return True

    async def authenticate(self, request: Request) -> bool:
        user_id = request.session.get("admin_id")

        if not isinstance(user_id, int):
            return False

        with SessionLocal() as db:
            user = get_user_by_id(db, user_id)

            if user is None or not user.is_active or user.role != UserRole.ADMIN:
                request.session.clear()
                return False

        return True


admin_authentication = AdminAuthentication(
    secret_key=settings.SECRET_KEY,
)
