import random
from app.db.base import Base
from app.db.session import SessionLocal, engine
from datetime import date

from sqlalchemy.orm import Session

from app.core.security import hash_password
from app.models.models import (
    AbandonedPet,
    Gender,
    PetStatus,
    Product,
    Service,
    ServiceType,
    User,
    UserRole,
)

SEED_USER_PASSWORD = "test1234"


def seed_users(db: Session) -> None:
    users = [
        User(
            username="admin",
            password=hash_password(SEED_USER_PASSWORD),
            full_name="Quan Tri Vien",
            gender=Gender.MALE,
            email="admin@example.com",
            dob=date(2026, 7, 18),
            phone_number="0123456789",
            address="Nguyễn Huệ, Quận 1",
            role=UserRole.ADMIN,
            is_active=True,
        ),
        User(
            username="hoangkhang",
            password=hash_password(SEED_USER_PASSWORD),
            full_name="Hoang Khang",
            gender=Gender.MALE,
            email="khang@example.com",
            dob=date(2015, 5, 21),
            phone_number="0999999999",
            address="Vĩnh Viễn, Quận 10",
            role=UserRole.CUSTOMER,
            is_active=True,
        ),
        User(
            username="huybui",
            password=hash_password(SEED_USER_PASSWORD),
            full_name="Huy Bui",
            gender=Gender.MALE,
            email="huybui@example.com",
            dob=date(2026, 7, 23),
            phone_number="0999999998",
            address="Quang Trung, Quận 12",
            role=UserRole.CUSTOMER,
            is_active=True,
        ),
        User(
            username="minhhau",
            password=hash_password(SEED_USER_PASSWORD),
            full_name="Minh Hau",
            gender=Gender.MALE,
            email="hau@example.com",
            dob=date(2015, 2, 15),
            phone_number="0188888888",
            address="Quang Trung, Quận Gò Vấp",
            role=UserRole.CUSTOMER,
            is_active=True,
        ),
    ]

    db.add_all(users)


def seed_services(db: Session) -> None:
    services = [
        Service(
            name="SPA THÚ CƯNG",
            description=(
                "Dịch vụ làm đẹp, thư giãn cho thú cưng gồm 5 bước:\n"
                "1. ABC\n"
                "2. DEF\n"
                "...\n"
                "5. XYZ"
            ),
            price=499000,
            service_type=ServiceType.SPA,
            image="https://res.cloudinary.com/vgvqzopy/image/upload/v1786794896/pet-spa_qqgjus.png",
            is_active=True,
        ),
        Service(
            name="KHÁM BỆNH THÚ CƯNG",
            description=(
                "Dịch vụ khám, kiểm tra tổng quát cho thú cưng gồm các bước như:\n"
                "1. ABC\n"
                "2. DEF\n"
                "...\n"
                "20. XYZ"
            ),
            price=1299000,
            service_type=ServiceType.CLINIC,
            image="https://res.cloudinary.com/vgvqzopy/image/upload/v1786794896/pet-clinic_nnpgmg.png",
            is_active=True,
        ),
        Service(
            name="TRÔNG HỘ THÚ CƯNG",
            description=(
                "Dịch vụ trông hộ thú cưng gồm các tiện ích và hoạt động như:\n"
                "1. ABC\n"
                "2. DEF\n"
                "...\n"
                "10. XYZ"
            ),
            price=120000,
            service_type=ServiceType.BOARDING,
            image="https://res.cloudinary.com/vgvqzopy/image/upload/v1786794896/pet-boarding_byeul4.png",
            is_active=True,
        ),
        Service(
            name="HUẤN LUYỆN THÚ CƯNG",
            description=(
                "Dịch vụ huấn luyện cho thú cưng thực hiện các tương tác, động tác như:\n"
                "1. ABC\n"
                "2. DEF\n"
                "...\n"
                "10. XYZ"
            ),
            price=899000,
            service_type=ServiceType.TRAINING,
            image="https://res.cloudinary.com/vgvqzopy/image/upload/v1786794896/pet-training_dokha5.png",
            is_active=True,
        ),
    ]

    db.add_all(services)


def seed_products(db: Session) -> None:
    random_generator = random.Random(42)
    products = []

    for product_number in range(1, 51):
        product = Product(
            name=f"Sản phẩm test {product_number}",
            description=f"Mô tả của sản phẩm test {product_number}.",
            price=random_generator.randint(1, 100) * 10000,
            stock_quantity=10000,
            image="https://res.cloudinary.com/vgvqzopy/image/upload/v1786283527/Hairball-600x600_jpnu1e.png",
            is_active=True,
        )

        products.append(product)

    db.add_all(products)


def seed_abandoned_pets(db: Session) -> None:
    random_generator = random.Random(42)
    abandoned_pets = []

    test_pet_type = [
        "Chó",
        "Mèo",
        "Thỏ",
        "Chim",
        "Hamster",
        "Rùa",
        "Cá",
        "Nhím",
        "Gà",
        "Vịt",
    ]
    test_health_status = (
        "- Sức khỏe tốt.\n"
        "- Đã được tiêm phòng.\n"
        "- Đã được phẫu thuật triệt sản.\n"
    )

    for pet_number in range(1, 51):
        abandoned_pet = AbandonedPet(
            name=f"Thú cưng test {pet_number}",
            pet_type=random_generator.choice(test_pet_type),
            age=random_generator.randint(1, 30),
            weight=random_generator.randint(10, 250) / 10,
            health_status=test_health_status,
            image="https://res.cloudinary.com/vgvqzopy/image/upload/v1786738449/abandoned-cat_yyyjoq.png",
            pet_status=PetStatus.AVAILABLE,
            is_active=True,
        )

        abandoned_pets.append(abandoned_pet)

    db.add_all(abandoned_pets)


if __name__ == "__main__":
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)

    db = SessionLocal()

    try:
        seed_users(db)
        seed_services(db)
        seed_products(db)
        seed_abandoned_pets(db)

        db.commit()
    except Exception:
        db.rollback()
        raise
    finally:
        db.close()
