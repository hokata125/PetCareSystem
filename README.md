# ĐỀ TÀI: HỆ THỐNG QUẢN LÝ & CHĂM SÓC THÚ CƯNG
## Các nghiệp vụ chính:
### 1. Đặt lịch dịch vụ (Spa, Khám chữa bệnh, Trông hộ thú cưng):
Các ràng buộc:
- Người dùng phải đăng nhập mới được đặt lịch.
- Chỉ được đặt lịch trong giờ làm việc của trung tâm (8:00 – 20:00), theo các khung giờ cố định có sẵn.
- Không được đặt lịch trong quá khứ và phải đặt trước thời điểm hiện tại ít nhất 1 giờ.
- Một khung giờ chỉ nhận tối đa 3 lượt đặt lịch (không phân biệt Spa, Khám hay Trông hộ).
- Người dùng bắt buộc phải nhập tên và cân nặng thú cưng (giá dịch vụ sẽ tự động tính size thú cưng).
- Một tài khoản khách hàng chỉ được đặt tối đa 2 lịch dịch vụ/ngày.
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
- Cho phép khách hàng nhắn tin trực tiếp với nhân viên ngay trên giao diện website.
- Bất kỳ người dùng nào truy cập website (kể cả chưa đăng nhập) đều có thể sử dụng khung chat để được tư vấn.
- Chỉ Admin & Staff được cấp tài khoản quản trị mới có quyền truy cập hệ thống quản lý để trả lời tin nhắn của khách hàng.
