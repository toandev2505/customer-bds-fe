# 🏢 Real Estate CRM - Hệ Thống Quản Lý Khách Hàng Bất Động Sản

## 🌟 Giới Thiệu Dự Án
**Real Estate CRM** là một ứng dụng quản lý khách hàng chuyên biệt cho lĩnh vực bất động sản, được thiết kế với giao diện hiện đại, tối ưu trải nghiệm người dùng (UX/UI). Hệ thống cung cấp cái nhìn tổng quan và chi tiết về tệp khách hàng tiềm năng, giúp môi giới và sàn giao dịch theo dõi sát sao nhu cầu và tiến độ giao dịch.

### 🚀 Các Tính Năng Chính:
*   **Bảng Điều Khiển (Dashboard):** Theo dõi trực quan các chỉ số quan trọng như tổng số khách hàng, lượng Lead mới, số lượng giao dịch thành công và tổng ngân sách dự kiến thông qua các biểu đồ Recharts sinh động.
*   **Quản Lý Khách Hàng:** Danh sách khách hàng thông minh với khả năng tìm kiếm nhanh theo tên, số điện thoại hoặc email.
*   **Chi Tiết Khách Hàng:** Lưu trữ đầy đủ thông tin từ liên hệ, loại bất động sản quan tâm (Căn hộ, Đất nền, Nhà phố, Biệt thự), ngân sách đến trạng thái chăm sóc (Lead, Dự kiến, Liên hệ, Ký hợp đồng, Đã bán).
*   **Thao Tác CRUD Toàn Diện:** Thêm mới, chỉnh sửa thông tin và xóa khách hàng với quy trình xác nhận an toàn.
*   **Giao Diện Phản Hồi (Responsive):** Hoạt động mượt mà trên nhiều thiết bị, tích hợp hiệu ứng chuyển động chuyên nghiệp từ Framer Motion.

---

## 👥 Đội Ngũ Phát Triển (Nhóm 17)
| STT | Họ và Tên | MSSV | Vai trò chính |
|:---:|---|---|---|
| 1 | Trương Lý Quốc Toàn | DH52201595 | Backend Lead |
| 2 | Trương Nguyễn Tường Vy | DH52201788 | Frontend Lead |
| 3 | Tạ Thanh Tấn | DH52201416 | Backend Developer |
| 4 | Trần Võ Thúy Vy | DH52201787 | Frontend Developer |
| 5 | Trương Đàm Công Quý | DH52201336 | QA & Deployment |
| 6 | Huỳnh Lê Thu Hương | DH52200755 | Thiết kế hệ thống & Tài liệu |

---

## 🏗 Thiết Kế Hệ Thống (System Design)

### 1. Sơ đồ Use Case (Use Case Diagram)
```mermaid
graph LR
    subgraph "Hệ thống CRM"
        UC1(Quản lý nhân viên)
        UC2(Quản lý khách hàng)
        UC3(Phân quyền truy cập)
        UC4(Xem báo cáo thống kê)
        UC5(Đăng nhập)
    end

    staff((Nhân viên Sale))
    admin((Quản trị viên))

    staff --> UC5
    staff --> UC2

    admin --> UC5
    admin --> UC1
    admin --> UC2
    admin --> UC3
    admin --> UC4
```

### 2. Sơ đồ Lớp (Class Diagram - Database Schema)
```mermaid
classDiagram
    class User {
        +int id
        +string name
        +string email
        +string role
        +login()
    }
    class Customer {
        +int id
        +string fullName
        +string phone
        +string email
        +string address
        +string propertyType
        +string status
        +string budget
        +string note
        +int assignedStaffId
    }

    User "1" -- "*" Customer : phụ trách
```

### 3. Sơ đồ Tuần tự (Sequence Diagram)
#### A. Luồng lấy danh sách Khách hàng
```mermaid
sequenceDiagram
    autonumber
    participant U as User (Browser)
    participant FE as Frontend (React)
    participant BE as Backend (Spring Boot)
    participant DB as Database (MySQL)

    U->>FE: Truy cập mục "Danh sách KH"
    FE->>BE: Gọi API GET /customers
    Note over BE: Kiểm tra quyền truy cập
    BE->>DB: Truy vấn SELECT * FROM customers
    DB-->>BE: Trả về tập dữ liệu (3 khách hàng)
    BE-->>FE: Trả về JSON (200 OK)
    FE-->>U: Hiển thị bảng danh sách khách hàng
```

#### B. Luồng thêm mới Khách hàng
```mermaid
sequenceDiagram
    autonumber
    participant U as User (Browser)
    participant FE as Frontend (React)
    participant BE as Backend (Spring Boot)
    participant DB as Database (MySQL)

    U->>FE: Điền Form & nhấn "Thêm mới"
    FE->>BE: Gọi API POST /customers (JSON data)
    Note over BE: Validate dữ liệu đầu vào
    BE->>DB: INSERT INTO customers (...)
    DB-->>BE: Thành công
    BE-->>FE: Trả về JSON (201 Created)
    FE-->>U: Thông báo thành công & cập nhật danh sách
```

#### C. Luồng chỉnh sửa Khách hàng
```mermaid
sequenceDiagram
    autonumber
    participant U as User (Browser)
    participant FE as Frontend (React)
    participant BE as Backend (Spring Boot)
    participant DB as Database (MySQL)

    U->>FE: Thay đổi thông tin & nhấn "Lưu thay đổi"
    FE->>BE: Gọi API PUT /customers/{id} (JSON data)
    Note over BE: Kiểm tra sự tồn tại & Validate
    BE->>DB: UPDATE customers SET ... WHERE id = {id}
    DB-->>BE: Thành công
    BE-->>FE: Trả về JSON (200 OK)
    FE-->>U: Thông báo cập nhật thành công
```

#### D. Luồng thống kê Dashboard
```mermaid
sequenceDiagram
    autonumber
    participant U as User (Browser)
    participant FE as Frontend (React)
    participant BE as Backend (Spring Boot)
    participant DB as Database (MySQL)

    U->>FE: Truy cập trang "Dashboard"
    FE->>BE: Gọi API GET /dashboard/stats
    Note over BE: Tính toán: Tổng KH, Lead, Doanh thu...
    BE->>DB: SELECT COUNT(*), SUM(budget)... FROM customers
    DB-->>BE: Trả về các con số tổng hợp
    BE-->>FE: Trả về JSON (Dữ liệu thống kê & Top khách hàng)
    FE-->>U: Hiển thị các thẻ số liệu và bảng "Khách hàng gần đây"
```

#### E. Luồng xóa Khách hàng
```mermaid
sequenceDiagram
    autonumber
    participant U as User (Browser)
    participant FE as Frontend (React)
    participant BE as Backend (Spring Boot)
    participant DB as Database (MySQL)

    U->>FE: Nhấn biểu tượng "Thùng rác"
    FE->>U: Hiển thị Modal xác nhận xóa
    U->>FE: Nhấn "Xác nhận xóa"
    FE->>BE: Gọi API DELETE /customers/{id}
    BE->>DB: DELETE FROM customers WHERE id = {id}
    DB-->>BE: Thành công
    BE-->>FE: Trả về JSON (204 No Content)
    FE-->>U: Thông báo xóa thành công & cập nhật danh sách
```

---

## 🛠 Công Nghệ Sử Dụng
- **Frontend:** ReactJS.
- **Backend:** Spring Boot.
- **Database:** MySQL.

---

## 📅 Lộ Trình Phát Triển (Roadmap)
- [x] Thiết lập cấu trúc dự án & UI Dashboard.
- [x] Xây dựng API CRUD User & Customer.
- [x] Hoàn thiện tính năng Thêm, Sửa, Xóa khách hàng.
- [ ] Tối ưu hóa báo cáo thống kê chuyên sâu.

---

