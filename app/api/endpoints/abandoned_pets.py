from fastapi import APIRouter

router = APIRouter()

@router.get("/rescue-pets")
def get_rescue_pets():
    return {"message": "List of rescue pets"}