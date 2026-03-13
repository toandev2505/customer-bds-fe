# 🏢 Real Estate CRM - Hệ Thống Quản Lý Bất Động Sản

## 🌟 Giới Thiệu Dự Án
Dự án **Real Estate CRM** được xây dựng nhằm giải quyết bài toán quản lý tập trung dữ liệu khách hàng và giỏ hàng cho các sàn giao dịch bất động sản. Hệ thống giúp tối ưu hóa quy trình vận hành, phân quyền nhân viên và theo dõi lịch sử tương tác khách hàng một cách khoa học.

---

## 👥 Đội Ngũ Phát Triển (Nhóm 2)
| STT | Họ và Tên | MSSV | Vai trò chính |
|:---:|---|---|---|
| 1 | Trương Lý Quốc Toàn | DH52201595 | Backend Lead |
| 2 | Trương N. Tường Vy | DH52201788 | Frontend Lead |
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
        +string demand
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

### 3. Sơ đồ Tuần tự (Sequence Diagram - Luồng lấy danh sách User)
```mermaid
sequenceDiagram
    autonumber
    participant U as User (Browser)
    participant FE as Frontend (React)
    participant BE as Backend (Spring Boot)
    participant DB as Database (MySQL)

    U->>FE: Truy cập đường dẫn /users
    FE->>BE: Gọi API GET /users
    Note over BE: Kiểm tra quyền truy cập
    BE->>DB: Truy vấn SELECT * FROM users
    DB-->>BE: Trả về tập dữ liệu
    BE-->>FE: Trả về JSON (200 OK)
    FE-->>U: Render danh sách lên giao diện
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
