from fastapi import APIRouter

router = APIRouter()

@router.get("/services")
def get_services():
    return {"message": "List of services"}