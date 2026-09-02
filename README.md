<div align="center">
  <h1>🐾 OU-Pet Center</h1>
  <p>Hệ thống quản lý, chăm sóc và cung cấp các dịch vụ, sản phẩm dành cho thú cưng</p>
</div>

## Đề tài

**OU-Pet Center** là hệ thống cung cấp các dịch vụ, sản phẩm liên quan đến thú cưng. Khách hàng có thể tìm kiếm sản phẩm, xem dịch vụ, đăng ký nhận nuôi thú cưng bị bỏ rơi, đặt lịch chăm sóc, đặt hàng và thanh toán trực tuyến bằng mã QR.

Hệ thống đồng thời cung cấp trang quản trị để quản lý người dùng, sản phẩm, dịch vụ, thú cưng, đơn nhận nuôi, đơn hàng, lịch đặt và giao dịch thanh toán. Tiện ích Tawk.to được tích hợp để khách hàng đã đăng nhập có thể trao đổi trực tiếp với nhân viên.

---

## Demo trực tuyến

> **Lưu ý:** Lần đầu truy cập có thể phản hồi chậm hơn bình thường do backend trên Azure App Service cần thời gian khởi động lại sau một khoảng thời gian không hoạt động.

- Website dành cho khách hàng: [OU-Pet Center](https://ou-pet-center.vercel.app)
- Trang quản trị: [OU-Pet Center Admin](https://ou-pet-center-app-dkgnfxc7bddph4c4.malaysiawest-01.azurewebsites.net/admin)

| Vai trò       | Tên đăng nhập | Mật khẩu   |
| ------------- | ------------- | ---------- |
| Quản trị viên | `admin`       | `test1234` |
| Khách hàng    | `hoangkhang`  | `test1234` |

---

## Tổng quan

Hệ thống gồm hai vai trò chính:

| Vai trò           | Mô tả                                                                                                                                    |
| ----------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| **Khách hàng**    | Quản lý tài khoản, xem sản phẩm/dịch vụ/thú cưng, tạo và theo dõi đơn hàng, lịch đặt, đơn nhận nuôi, thanh toán QR và chat với nhân viên |
| **Quản trị viên** | Đăng nhập SQLAdmin để quản lý dữ liệu hệ thống, cập nhật trạng thái nghiệp vụ và xác nhận giao dịch thanh toán                           |

Các điểm nổi bật:

- Xác thực bằng JWT và vô hiệu hóa token cũ bằng `token_version` khi đổi mật khẩu hoặc đăng xuất.
- Tìm kiếm, sắp xếp và phân trang sản phẩm, thú cưng bị bỏ rơi.
- Đặt lịch cho SPA, khám bệnh, trông hộ và huấn luyện thú cưng.
- Tạo, theo dõi và hủy đơn hàng, lịch đặt, đơn nhận nuôi.
- Thanh toán chuyển khoản bằng mã QR SePay với thời hạn 10 phút.
- Upload và lưu trữ hình ảnh qua Cloudinary.
- Chat hỗ trợ khách hàng bằng Tawk.to với phiên chat riêng cho từng tài khoản.
- Quản trị dữ liệu bằng SQLAdmin.

---

## Tech Stack

| Layer                | Công nghệ                                               |
| -------------------- | ------------------------------------------------------- |
| **Backend**          | Python, FastAPI, SQLAlchemy, Pydantic, PyMySQL, Uvicorn |
| **Authentication**   | JWT HS256, Argon2, token version, session cho SQLAdmin  |
| **Frontend**         | React 19, Vite 8, JavaScript, React Router 8, Axios     |
| **UI**               | Tailwind CSS 4, Headless UI, Lucide React               |
| **Database**         | MySQL                                                   |
| **Cloud Storage**    | Cloudinary                                              |
| **Payment**          | SePay QR, xác nhận thủ công bởi quản trị viên           |
| **Customer Support** | Tawk.to                                                 |
| **Admin**            | SQLAdmin                                                |

---

## Kiến trúc hệ thống

### Kiến trúc triển khai

```text
Khách hàng
    → React frontend (Vercel)
    → FastAPI backend (Azure App Service)
    → Azure Database for MySQL Flexible Server 8.4

Quản trị viên
    → SQLAdmin tại /admin (Azure App Service)
    → Azure Database for MySQL Flexible Server 8.4

Dịch vụ tích hợp
    ├── Cloudinary: lưu trữ hình ảnh
    ├── SePay: tạo mã QR thanh toán
    └── Tawk.to: hỗ trợ trò chuyện trực tuyến
```

### Backend

Backend được tổ chức theo các tầng:

```text
PetCareSystem-Backend/
├── app/
│   ├── admin/          # Cấu hình xác thực và giao diện SQLAdmin
│   ├── api/            # Dependency và các API endpoint
│   ├── core/           # Cấu hình, JWT, bảo mật và Tawk identity
│   ├── db/             # Kết nối, khởi tạo và seed database
│   ├── models/         # SQLAlchemy models
│   ├── schemas/        # Pydantic request/response schemas
│   ├── services/       # Xử lý nghiệp vụ
│   └── main.py         # Khởi tạo ứng dụng FastAPI
├── .env.example
└── requirements.txt
```

Luồng xử lý chính:

```text
HTTP Request
    → FastAPI Endpoint
    → Pydantic Schema / Dependency xác thực
    → Service xử lý nghiệp vụ
    → SQLAlchemy Model
    → MySQL
```

### Frontend

```text
PetCareSystem-Frontend/
├── src/
│   ├── assets/         # Hình ảnh và tài nguyên tĩnh
│   ├── components/     # Component giao diện dùng lại
│   ├── configs/        # Axios HTTP client
│   ├── layouts/        # Layout chung của website
│   ├── pages/          # Các trang theo từng nghiệp vụ
│   ├── routes/         # Route yêu cầu đăng nhập
│   ├── services/       # Hàm gọi API và tích hợp Tawk.to
│   ├── App.jsx         # Route và state người dùng hiện tại
│   └── main.jsx        # Điểm khởi tạo React
├── .env.example
└── package.json
```

### Xác thực và phân quyền

| Phạm vi        | Cơ chế              | Mô tả                                                             |
| -------------- | ------------------- | ----------------------------------------------------------------- |
| API công khai  | Không yêu cầu token | Đăng ký, đăng nhập, xem sản phẩm, dịch vụ và thú cưng             |
| API khách hàng | JWT Bearer Token    | Hồ sơ, đơn hàng, lịch đặt, nhận nuôi, thanh toán và Tawk identity |
| SQLAdmin       | Session             | Chỉ tài khoản có vai trò `ADMIN` được truy cập                    |

Frontend lưu access token trong `localStorage` và Axios interceptor tự động gắn token vào header `Authorization`. Backend kiểm tra chữ ký JWT, thời hạn token, trạng thái tài khoản và `token_version` ở mỗi API yêu cầu đăng nhập.

---

## Tính năng chính

### Khách hàng

- Đăng ký, đăng nhập và đăng xuất.
- Xem và cập nhật thông tin cá nhân, avatar, mật khẩu.
- Xem danh sách và chi tiết sản phẩm; tìm kiếm, sắp xếp, phân trang.
- Xem danh sách và chi tiết dịch vụ.
- Xem danh sách và chi tiết thú cưng bị bỏ rơi; tìm kiếm, lọc, sắp xếp, phân trang.
- Tạo đơn hàng theo sản phẩm và số lượng.
- Đặt lịch dịch vụ theo thông tin thú cưng và thời gian sử dụng.
- Gửi đơn đăng ký nhận nuôi thú cưng.
- Xem lịch sử và chi tiết đơn hàng, lịch đặt, đơn nhận nuôi.
- Hủy đơn theo các điều kiện nghiệp vụ.
- Thanh toán đơn hàng và lịch đặt bằng mã QR; gửi yêu cầu xác nhận thanh toán.
- Chat với nhân viên bằng widget Tawk.to sau khi đăng nhập.

### Quản trị viên

- Đăng nhập trang SQLAdmin bằng tài khoản quản trị.
- Quản lý người dùng, sản phẩm, dịch vụ và thú cưng bị bỏ rơi.
- Theo dõi và cập nhật đơn hàng, lịch đặt, đơn nhận nuôi.
- Xác nhận hoặc từ chối giao dịch thanh toán.
- Quản lý trạng thái giao dịch và dữ liệu liên quan theo ràng buộc nghiệp vụ.

---

## API Endpoints

Quy ước truy cập:

- **Public**: Không yêu cầu đăng nhập.
- **JWT**: Yêu cầu header `Authorization: Bearer <access_token>`.

### Authentication

| Method | Endpoint         | Truy cập | Mô tả                                   |
| ------ | ---------------- | -------- | --------------------------------------- |
| `POST` | `/auth/register` | Public   | Đăng ký tài khoản khách hàng            |
| `POST` | `/auth/login`    | Public   | Đăng nhập và nhận JWT access token      |
| `POST` | `/auth/logout`   | JWT      | Đăng xuất và vô hiệu hóa token hiện tại |

### Users

| Method  | Endpoint                  | Truy cập | Mô tả                                   |
| ------- | ------------------------- | -------- | --------------------------------------- |
| `GET`   | `/users/profile`          | JWT      | Lấy hồ sơ người dùng hiện tại           |
| `GET`   | `/users/tawk-identity`    | JWT      | Lấy danh tính và hash đăng nhập Tawk.to |
| `PATCH` | `/users/profile`          | JWT      | Cập nhật thông tin cá nhân              |
| `PATCH` | `/users/profile/password` | JWT      | Đổi mật khẩu và vô hiệu hóa token cũ    |
| `PATCH` | `/users/profile/avatar`   | JWT      | Cập nhật ảnh đại diện                   |

### Products

| Method | Endpoint                 | Truy cập | Mô tả                                                          |
| ------ | ------------------------ | -------- | -------------------------------------------------------------- |
| `GET`  | `/products`              | Public   | Lấy danh sách sản phẩm; hỗ trợ tìm kiếm, sắp xếp và phân trang |
| `GET`  | `/products/{product_id}` | Public   | Lấy chi tiết sản phẩm                                          |

### Services

| Method | Endpoint                 | Truy cập | Mô tả                                                         |
| ------ | ------------------------ | -------- | ------------------------------------------------------------- |
| `GET`  | `/services`              | Public   | Lấy danh sách dịch vụ; hỗ trợ tìm kiếm, sắp xếp và phân trang |
| `GET`  | `/services/{service_id}` | Public   | Lấy chi tiết dịch vụ                                          |

### Abandoned Pets

| Method | Endpoint                             | Truy cập | Mô tả                                                               |
| ------ | ------------------------------------ | -------- | ------------------------------------------------------------------- |
| `GET`  | `/abandoned-pets`                    | Public   | Lấy danh sách thú cưng; hỗ trợ tìm kiếm, lọc, sắp xếp và phân trang |
| `GET`  | `/abandoned-pets/{abandoned_pet_id}` | Public   | Lấy chi tiết thú cưng                                               |

### Orders

| Method  | Endpoint                    | Truy cập | Mô tả                                        |
| ------- | --------------------------- | -------- | -------------------------------------------- |
| `POST`  | `/orders`                   | JWT      | Tạo đơn hàng cho người dùng hiện tại         |
| `GET`   | `/orders`                   | JWT      | Lấy lịch sử đơn hàng của người dùng hiện tại |
| `GET`   | `/orders/{order_id}`        | JWT      | Lấy chi tiết một đơn hàng                    |
| `PATCH` | `/orders/{order_id}/cancel` | JWT      | Hủy đơn hàng                                 |

### Order Payments

| Method  | Endpoint                             | Truy cập | Mô tả                                      |
| ------- | ------------------------------------ | -------- | ------------------------------------------ |
| `GET`   | `/orders/{order_id}/payment`         | JWT      | Lấy giao dịch và mã QR thanh toán đơn hàng |
| `PATCH` | `/orders/{order_id}/payment/confirm` | JWT      | Gửi yêu cầu xác nhận đã chuyển khoản       |
| `PATCH` | `/orders/{order_id}/payment/expire`  | JWT      | Đánh dấu giao dịch đơn hàng hết hạn        |

### Bookings

| Method  | Endpoint                        | Truy cập | Mô tả                                        |
| ------- | ------------------------------- | -------- | -------------------------------------------- |
| `POST`  | `/bookings`                     | JWT      | Tạo lịch đặt dịch vụ                         |
| `GET`   | `/bookings`                     | JWT      | Lấy lịch sử đặt lịch của người dùng hiện tại |
| `GET`   | `/bookings/{booking_id}`        | JWT      | Lấy chi tiết một lịch đặt                    |
| `PATCH` | `/bookings/{booking_id}/cancel` | JWT      | Hủy lịch đặt                                 |

### Booking Payments

| Method  | Endpoint                                 | Truy cập | Mô tả                                      |
| ------- | ---------------------------------------- | -------- | ------------------------------------------ |
| `GET`   | `/bookings/{booking_id}/payment`         | JWT      | Lấy giao dịch và mã QR thanh toán lịch đặt |
| `PATCH` | `/bookings/{booking_id}/payment/confirm` | JWT      | Gửi yêu cầu xác nhận đã chuyển khoản       |
| `PATCH` | `/bookings/{booking_id}/payment/expire`  | JWT      | Đánh dấu giao dịch lịch đặt hết hạn        |

### Adoptions

| Method  | Endpoint                          | Truy cập | Mô tả                                         |
| ------- | --------------------------------- | -------- | --------------------------------------------- |
| `POST`  | `/adoptions`                      | JWT      | Tạo đơn đăng ký nhận nuôi                     |
| `GET`   | `/adoptions`                      | JWT      | Lấy lịch sử nhận nuôi của người dùng hiện tại |
| `GET`   | `/adoptions/{adoption_id}`        | JWT      | Lấy chi tiết một đơn nhận nuôi                |
| `PATCH` | `/adoptions/{adoption_id}/cancel` | JWT      | Hủy đơn nhận nuôi                             |

---

## Cài đặt và chạy dự án ở local

### 1. Clone repository

```bash
git clone https://github.com/hokata125/PetCareSystem.git
cd PetCareSystem
```

### 2. Tạo MySQL database

Đăng nhập MySQL và tạo database:

```sql
CREATE DATABASE petcaredb
CHARACTER SET utf8mb4;
```

Nếu sử dụng tên database khác, hãy cập nhật tên tương ứng trong `DATABASE_URL`.

### 3. Cài đặt backend

```powershell
cd PetCareSystem-Backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
Copy-Item .env.example .env
```

Điền các giá trị cấu hình cần thiết vào file `.env` vừa tạo.

### 4. Khởi tạo dữ liệu mẫu

> **Lưu ý:** Lệnh seed sẽ xóa toàn bộ bảng và dữ liệu hiện có, sau đó tạo lại database schema và dữ liệu mẫu. Chỉ nên chạy lệnh seed khi khởi tạo môi trường mới.

Từ thư mục `PetCareSystem-Backend`, chạy:

```bash
python -m app.db.seed_db
```

Dữ liệu mẫu gồm 4 dịch vụ, 50 sản phẩm, 50 thú cưng bị bỏ rơi và các tài khoản dùng để demo:

| Vai trò       | Tên đăng nhập | Mật khẩu   |
| ------------- | ------------- | ---------- |
| Quản trị viên | `admin`       | `test1234` |
| Khách hàng    | `hoangkhang`  | `test1234` |

### 5. Chạy backend

```bash
uvicorn app.main:app --reload
```

Các địa chỉ mặc định:

- Backend: `http://127.0.0.1:8000`
- Swagger UI: `http://127.0.0.1:8000/docs`
- SQLAdmin: `http://127.0.0.1:8000/admin`

### 6. Cài đặt và chạy frontend

```powershell
cd PetCareSystem-Frontend
npm install
Copy-Item .env.example .env
npm run dev
```

Frontend mặc định chạy tại:

```text
http://127.0.0.1:5173
```
