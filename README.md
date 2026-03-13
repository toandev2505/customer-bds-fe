# 🏢 Real Estate CRM - Hệ Thống Quản Lý Bất Động Sản

## 🌟 Giới Thiệu Dự Án
Dự án **Real Estate CRM** được xây dựng nhằm giải quyết bài toán quản lý tập trung dữ liệu khách hàng và giỏ hàng cho các sàn giao dịch bất động sản. Hệ thống giúp tối ưu hóa quy trình vận hành, phân quyền nhân viên và theo dõi lịch sử tương tác khách hàng một cách khoa học.

---

## 👥 Đội Ngũ Phát Triển (Nhóm 17)
| STT | Họ và Tên | MSSV | Vai trò chính |
|:---:|---|---|---|
| 1 | Trương Lý Quốc Toàn | DH52201595 | Backend Lead |
| 2 | Trương Nguyễn Tường Vy | DH52201788 | Frontend Lead |
| 3 | Tạ Thanh Tấn | DH52201416 | Backend Developer |
| 4 | Trần Võ Thúy Vy | DH52201787 | Frontend Developer |
| 5 | Trương Đàm Công Quý | DH52201336 | QA & Deployment |
| 6 | **Huỳnh Lê Thu Hương** | **DH52200755** | **Thiết kế hệ thống & Tài liệu** |

---

## 🏗 Thiết Kế Hệ Thống (System Design)

### 1. Sơ đồ Use Case (Use Case Diagram)
```mermaid
graph LR
    subgraph "Hệ thống CRM"
        UC1(Quản lý nhân viên)
        UC2(Quản lý giỏ hàng BĐS)
        UC3(Quản lý khách hàng)
        UC4(Phân quyền truy cập)
        UC5(Xem báo cáo thống kê)
        UC6(Đăng nhập)
    end

    staff((Nhân viên Sale))
    admin((Quản trị viên))

    staff --> UC6
    staff --> UC2
    staff --> UC3

    admin --> UC6
    admin --> UC1
    admin --> UC2
    admin --> UC3
    admin --> UC4
    admin --> UC5
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
    class Property {
        +int id
        +string title
        +string address
        +double price
        +string status
    }
    class Interaction {
        +int id
        +int customerId
        +datetime date
        +string note
    }

    User "1" -- "*" Customer : phụ trách
    Customer "1" -- "*" Interaction : lịch sử tương tác
    Customer "*" -- "*" Property : nhu cầu
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

---

## 🛠 Công Nghệ Sử Dụng
- **Frontend:** ReactJS.
- **Backend:** Spring Boot.
- **Database:** MySQL.

---

## 📅 Lộ Trình Phát Triển (Roadmap)
- [x] Thiết lập cấu trúc dự án & UI cơ bản.
- [x] Xây dựng API CRUD User (Yêu cầu kiểm tra 14/3).
- [ ] Hoàn thiện module Quản lý Khách hàng.
- [ ] Triển khai module Giỏ hàng Bất động sản.

---
*Tài liệu được duy trì bởi **Huỳnh Lê Thu Hương**.*
