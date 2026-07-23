from fastapi import UploadFile
from sqlalchemy.orm import Session

from app.core.security import hash_password, verify_password
from app.models.models import User
from app.schemas.users import UserCreate, UserUpdate
from app.services.uploads import upload_image


def get_user_by_id(
    db: Session,
    user_id: int,
) -> User | None:
    return db.query(User).filter(User.id == user_id).first()


def get_user_by_username(
    db: Session,
    input_username: str,
) -> User | None:
    return db.query(User).filter(User.username == input_username.strip()).first()


def get_user_by_email(
    db: Session,
    input_email: str,
) -> User | None:
    return db.query(User).filter(User.email == input_email.strip()).first()


def get_user_by_phone_number(
    db: Session,
    input_phone_number: str,
) -> User | None:
    return (
        db.query(User).filter(User.phone_number == input_phone_number.strip()).first()
    )


def create_user(
    db: Session,
    user_input_data: UserCreate,
) -> User:

    if get_user_by_username(db, user_input_data.username):
        raise ValueError("Tên tài khoản đã tồn tại!")

    if get_user_by_email(db, user_input_data.email):
        raise ValueError("Email đã tồn tại!")

    if get_user_by_phone_number(db, user_input_data.phone_number):
        raise ValueError("Số điện thoại đã tồn tại!")

    user = User(
        username=user_input_data.username,
        password=hash_password(user_input_data.password),
        full_name=user_input_data.full_name,
        gender=user_input_data.gender,
        email=user_input_data.email,
        dob=user_input_data.dob,
        phone_number=user_input_data.phone_number,
        address=user_input_data.address,
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
    new_phone_number = update_data.get("phone_number")
    new_password = update_data.pop("password", None)

    if new_email is not None and new_email != user.email:
        if get_user_by_email(db, new_email):
            raise ValueError("Email đã tồn tại!")

    if new_phone_number is not None and new_phone_number != user.phone_number:
        if get_user_by_phone_number(db, new_phone_number):
            raise ValueError("Số điện thoại đã tồn tại!")

    if new_password is not None:
        user.password = hash_password(new_password)

    for field, value in update_data.items():
        setattr(user, field, value)

    try:
        db.commit()
    except Exception:
        db.rollback()
        raise

    return user


def update_user_avatar(
    db: Session,
    user: User,
    avatar_file: UploadFile,
) -> User:
    avatar_url = upload_image(
        image_file=avatar_file,
        dir_name="users",
        public_id=f"user_{user.id}_avatar",
    )

    user.avatar = avatar_url

    try:
        db.commit()
    except Exception:
        db.rollback()
        raise

    return user
