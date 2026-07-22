import cloudinary.uploader
from cloudinary.exceptions import Error as CloudinaryError
from fastapi import UploadFile

ALLOWED_IMAGE_TYPES = {
    "image/jpeg",
    "image/png",
    "image/webp",
}
MAX_IMAGE_SIZE = 5 * 1024 * 1024


def upload_image(
    image_file: UploadFile,
    dir_name: str,
    public_id: str,
) -> str:
    if image_file.content_type not in ALLOWED_IMAGE_TYPES:
        raise ValueError("Ảnh phải có định dạng JPEG, PNG hoặc WEBP!")

    if image_file.size is not None and image_file.size > MAX_IMAGE_SIZE:
        raise ValueError("Dung lượng ảnh không được vượt quá 5 MB!")

    if not dir_name.strip():
        raise ValueError("Tên thư mục lưu ảnh không hợp lệ!")

    if not public_id.strip():
        raise ValueError("Public ID của ảnh không hợp lệ!")

    try:
        upload_result = cloudinary.uploader.upload(
            image_file.file,
            asset_folder=f"petcare/{dir_name.strip()}",
            public_id=public_id.strip(),
            resource_type="image",
            overwrite=True,
            invalidate=True,
        )
    except CloudinaryError:
        raise ValueError("Không thể tải ảnh lên Cloudinary!")

    secure_url = upload_result.get("secure_url")
    if not secure_url:
        raise ValueError("Cloudinary không trả về đường dẫn ảnh!")

    return secure_url
