from app.db.base import Base
from app.db.session import engine
from app.models import models


def init_db():
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)

if __name__ == "__main__":
    init_db()
