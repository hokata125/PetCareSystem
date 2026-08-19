# ĐỀ TÀI ĐỒ ÁN: HỆ THỐNG QUẢN LÝ & CHĂM SÓC THÚ CƯNG

## Các nghiệp vụ chính:

### 1. QUẢN LÝ DỊCH VỤ/SẢN PHẨM/THÚ CƯNG BỊ BỎ RƠI:

Các ràng buộc:

- Chỉ ADMIN mới có quyền thêm, sửa thông tin dịch vụ/sản phẩm/thú cưng bị bỏ rơi.
- ...

### 2. ĐẶT/HỦY LỊCH DỊCH VỤ (SPA, KHÁM BỆNH, TRÔNG HỘ, HUẤN LUYỆN):

Các ràng buộc:

#### ĐẶT LỊCH DỊCH VỤ:

- Người dùng phải đăng nhập mới được đặt lịch.
- Chỉ được đặt lịch trong giờ làm việc của trung tâm (8:00 – 20:00)
- Không được đặt lịch trong quá khứ và phải đặt cách thời điểm hiện tại ít nhất 30 phút.
- Đối với các dịch vụ SPA, KHÁM BỆNH và HUẤN LUYỆN, mỗi mốc thời gian bắt đầu chỉ nhận tối đa 5 lịch đặt cho từng loại dịch vụ. Mỗi dịch vụ có thời gian diễn ra là 2 giờ và phải kết thúc trong cùng 1 ngày, khách hàng chỉ được chọn thời gian bắt đầu. Khách hàng bắt buộc phải nhập tên, loại và cân nặng thú cưng để hệ thống tính tiền theo khoảng cân nặng của thú cưng.
- Đối với dịch vụ TRÔNG HỘ, trung tâm không giới hạn số lượng lịch đặt. Khách hàng phải chọn thời gian bắt đàu và thời gian kết thúc để hệ thống tính tiền theo số giờ gửi (không bắt buộc phải bắt đầu và kết thúc trong cùng 1 ngày nhưng thời gian bắt đầu & thời gian kết thúc phải nằm trong khung giờ làm việc).
- ...

#### HỦY LỊCH DỊCH VỤ:

- ...

### 3. ĐẶT/HỦY ĐƠN HÀNG SẢN PHẨM:

Các ràng buộc:

#### ĐẶT ĐƠN HÀNG:

- Không cho phép đặt mua nếu sản phẩm đã hết hàng (tồn kho = 0).
- Khi đơn đặt hàng được tạo và xác nhận thành công, số lượng tồn kho tự động trừ tương ứng.
- ...

#### HỦY ĐƠN HÀNG:

- ...

### 4. ĐĂNG KÝ/HỦY ĐƠN NHẬN NUÔI THÚ CƯNG BỊ BỎ RƠI:

Các ràng buộc:

#### ĐĂNG KÝ ĐƠN NHẬN NUÔI:

- Người dùng phải đăng nhập mới được gửi đơn đăng ký nhận nuôi.
- Khi 1 khách hàng gửi đơn đăng ký thành công, trạng thái thú cưng sẽ chuyển sang ĐÃ ĐẶT GIỮ. Không được đăng ký nhận nuôi nếu thú cưng đang ở trạng thái ĐÃ ĐẶT GIỮ hoặc ĐÃ CÓ CHỦ.
- Nếu khách hàng đã đăng ký nhưng không đến cửa hàng nhận thú cưng theo hẹn, Admin có quyền hủy đặt giữ, trạng thái thú cưng trở về ĐANG TÌM CHỦ để các khách hàng khác tiếp tục đăng ký.
- ...

#### HỦY ĐƠN NHẬN NUÔI:

- ...

### 5. CHĂM SÓC KHÁCH HÀNG THÔNG QUA TIỆN ÍCH CHAT TAWK.TO:

Các ràng buộc:

- Khách hàng phải đăng nhập mới có thể gửi tin nhắn & nhận phản từ nhân viên thông qua tiện ích chat Tawk.to ngay trên giao diện website.
- Nhân viên phải đăng nhập vào nền tảng chat Tawk.to với tài khoản đã được đăng ký mới có thể nhận & phản hồi tin nhắn từ khách hàng.
- Mỗi khách hàng đều có phiên chat riêng với nhân viên.
- ...

#### 6. THANH TOÁN TRỰC TUYẾN CHO ĐƠN HÀNG SẢN PHẨM/LỊCH ĐẶT DỊCH VỤ:

Các ràng buộc:

- Khách hàng phải thanh toán và xác nhận thanh toán trong vòng 10 phút kể từ khi bấm xác nhận đặt hàng/đặt lịch, nếu không thì đơn hàng/lịch đặt và giao dịch thanh toán tương ứng sẽ tự động hủy.
- ...
