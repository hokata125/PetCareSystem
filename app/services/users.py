from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.security import hash_password, verify_password
from app.models.models import User
from app.schemas.users import UserCreate, UserUpdate


def get_user_by_id(
    db: Session,
    user_id: int,
) -> User | None:
    return db.get(User, user_id)


def get_user_by_username(
    db: Session,
    input_username: str,
) -> User | None:
    return db.scalar(select(User).where(User.username == input_username))


def get_user_by_email(
    db: Session,
    input_email: str,
) -> User | None:
    return db.scalar(select(User).where(User.email == input_email))


def create_user(
    db: Session,
    user_input_data: UserCreate,
) -> User:
    
    if get_user_by_username(db, user_input_data.username):
        raise ValueError("Username đã tồn tại!")

    if get_user_by_email(db, user_input_data.email):
        raise ValueError("Email đã tồn tại!")

    user = User(
        username=user_input_data.username,
        password=hash_password(user_input_data.password),
        full_name=user_input_data.full_name,
        gender=user_input_data.gender,
        email=user_input_data.email,
        dob=user_input_data.dob,
        phone_number=user_input_data.phone_number,
        address=user_input_data.address,
        avatar=user_input_data.avatar,
    )

    try:
        db.add(user)
        db.commit()
    except Exception:
        db.rollback()
        raise

    return user


def auth_user(
    db: Session,
    input_username: str,
    input_password: str,
) -> User | None:
    user = get_user_by_username(db, input_username)

    if user is None:
        return None
    
    if not user.is_active:
        return None

    if not verify_password(input_password, user.password):
        return None

    return user


def update_user(
    db: Session,
    user: User,
    user_input_data: UserUpdate,
) -> User:
    update_data = user_input_data.model_dump(
        exclude_unset=True,
        exclude_none=True,
    )

    new_email = update_data.get("email")

    if new_email is not None and new_email != user.email:
        if get_user_by_email(db, new_email):
            raise ValueError("Email đã tồn tại!")

    for field, value in update_data.items():
        setattr(user, field, value)

    try:
        db.commit()
    except Exception:
        db.rollback()
        raise

    return user