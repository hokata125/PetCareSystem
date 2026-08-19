import hashlib
import hmac

from app.core.configs import settings


def create_tawk_hash(user_id: int) -> str:
    return hmac.new(
        settings.TAWK_API_KEY.encode(),
        str(user_id).encode(),
        hashlib.sha256,
    ).hexdigest()
