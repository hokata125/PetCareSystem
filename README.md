# ĐỀ TÀI: HỆ THỐNG QUẢN LÝ & CHĂM SÓC THÚ CƯNG

## Các nghiệp vụ chính:

### 1. Đặt lịch dịch vụ (Spa, Khám bệnh, Trông hộ thú cưng):

Các ràng buộc:

- Người dùng phải đăng nhập mới được đặt lịch.
- Chỉ được đặt lịch trong giờ làm việc của trung tâm (8:00 – 20:00)
- Không được đặt lịch trong quá khứ và phải đặt cách thời điểm hiện tại ít nhất 30 phút.
- Đối với Spa, Khám bệnh và Huấn luyện, mỗi mốc thời gian bắt đầu chỉ nhận tối đa 5 lịch cho từng loại dịch vụ.
- Đối với Trông hộ thú cưng, trung tâm không giới hạn số lượng pet. Khách hàng chọn giờ gửi và giờ kết thúc để hệ thống tính tiền.
- Người dùng bắt buộc phải nhập tên và cân nặng thú cưng từ 1 - 50kg. Giá dịch vụ sẽ thay đổi theo từng khoảng cân nặng của pet (trừ dịch vụ Trông hộ).

### 2. Huỷ lịch dịch vụ:

Các ràng buộc:

- Chỉ khách hàng tạo lịch đặt hoặc Admin mới có quyền huỷ.
- Khách hàng chỉ được tự hủy khi lịch đặt đang ở trạng thái CHỜ DUYỆT.
- Không được huỷ khi lịch đã chuyển sang trạng thái ĐÃ XÁC NHẬN, ĐÃ HOÀN THÀNH hoặc ĐÃ HỦY.

### 3. Quản lý sản phẩm & đặt mua hàng (Thức ăn, phụ kiện, đồ chơi):

Các ràng buộc:

- Chỉ Admin mới có quyền thêm, sửa, xóa sản phẩm. Khách hàng chỉ có quyền xem và đặt mua.
- Giá bán và số lượng tồn kho của sản phẩm bắt buộc phải là số dương (>= 0).
- Không cho phép đặt mua nếu sản phẩm đã hết hàng (tồn kho = 0).
- Khi đơn đặt hàng được tạo và xác nhận thành công, số lượng tồn kho tự động trừ tương ứng.

### 4. Nhận nuôi thú cưng bị bỏ rơi

Các ràng buộc:

- Chỉ Admin mới có quyền thêm, sửa, xóa hồ sơ thú cưng bị bỏ rơi (trạng thái mặc định là ĐANG TÌM CHỦ).
- Người dùng phải đăng nhập mới được gửi đơn đăng ký nhận nuôi.
- Khi 1 khách hàng gửi đơn đăng ký thành công, trạng thái thú cưng sẽ chuyển sang ĐÃ ĐẶT GIỮ. Không được đăng ký nhận nuôi nếu thú cưng đang ở trạng thái ĐÃ ĐẶT GIỮ hoặc ĐÃ CÓ CHỦ.
- Nếu khách hàng đã đăng ký nhưng không đến cửa hàng nhận thú cưng theo hẹn, Admin có quyền hủy đặt giữ, trạng thái thú cưng trở về ĐANG TÌM CHỦ để các khách hàng khác tiếp tục đăng ký.

### 5. Chăm sóc khách hàng thông qua chat trực tiếp

Các ràng buộc:

- Hệ thống tích hợp widget chat bên thứ ba (Tawk.to).
- Cho phép khách hàng nhắn tin trực tiếp với nhân viên ngay trên giao diện website.
- Bất kỳ người dùng nào truy cập website đều có thể nhắn tin tư vấn.
- Admin/Staff trả lời tin nhắn thông qua dashboard của nền tảng chat.
