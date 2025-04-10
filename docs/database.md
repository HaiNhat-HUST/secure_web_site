# Database

## Thiết lập database

1.  **Kiểm tra file `docker-compose.yml`:**
    *   Location: `database/docker-compose.yml`
    *   Tìm đến service có tên là `database`
    *   **Ghi nhớ các giá trị quan trọng** được định nghĩa trong phần `environment` của service này:
        *   `POSTGRES_USER`: Tên người dùng database (vd: `rms_user`)
        *   `POSTGRES_PASSWORD`: Mật khẩu database (vd: `123456`)
        *   `POSTGRES_DB`: Tên database (vd: `rms_db`)
    *   File này cũng định nghĩa port mapping (thường là `"5432:5432"`) và volume (`pgdata`) để lưu trữ dữ liệu.

2.  **Khởi chạy container PostgreSQL:**
    *   Trong terminal, đảm bảo bạn đang ở thư mục gốc của dự án (nơi chứa file `docker-compose.yml`).
    *   Chạy lệnh sau:
        ```bash
        docker-compose up -d database
        ```
        *   Lệnh này sẽ tải image PostgreSQL (nếu chưa có) và khởi chạy container ở chế độ nền (`-d`). Nó chỉ khởi chạy service `database`.

3.  **Kiểm tra container đang chạy:**
    *   Chạy lệnh:
        ```bash
        docker ps
        ```
    *   Bạn sẽ thấy một container có tên giống `rms_postgres_db` (hoặc tên bạn đặt trong `container_name` của file compose) với trạng thái `Up`.

## Init Database với Migrations

Bước này sẽ tạo cấu trúc bảng cần thiết (`users`, `job_postings`, `applications`, ...) trong database PostgreSQL vừa khởi chạy. Các định nghĩa bảng này nằm trong các file migration trong code dự án.

1.  **Di chuyển vào thư mục Backend:**
    ```bash
    cd app-backend
    ```

2.  **Cài đặt Dependencies cho Backend:**
    *   Lệnh này sẽ cài đặt Knex và các thư viện cần thiết khác được định nghĩa trong `package.json`.
    ```bash
    npm install
    # Hoặc nếu dùng yarn:
    # yarn install
    ```

3.  **Chạy Migrations:**
    *   Lệnh này sẽ yêu cầu Knex kết nối đến database (đang chạy trong Docker) và thực thi tất cả các file migration chưa được chạy trong thư mục `database/migrations/`.
    ```bash
    npx knex migrate:latest
    ```
    *   **Kết quả mong đợi:** Bạn sẽ thấy output trong terminal cho biết các file migration (ví dụ: `..._initial_schema.js`) đang được chạy. Nếu không có lỗi, các bảng sẽ được tạo thành công trong database. Knex cũng sẽ tạo/cập nhật bảng `knex_migrations` để theo dõi.

## Kết nối đến Database 
Bây giờ bạn có thể kết nối đến database PostgreSQL đang chạy trong container bằng công cụ GUI đã cài đặt (DBeaver/pgAdmin) để kiểm tra, chạy script SQL, hoặc xem dữ liệu.

**Thông số kết nối:**

*   **Host:** `localhost` (hoặc `127.0.0.1`)
*   **Port:** `5432` (Hoặc port phía *HOST* nếu bạn thay đổi mapping trong `docker-compose.yml`, ví dụ: nếu bạn map `"5433:5432"` thì port kết nối là `5433`)
*   **Database:** Tên database bạn đã ghi nhớ từ `docker-compose.yml` (vd: `rms_db`)
*   **User:** Tên người dùng bạn đã ghi nhớ từ `docker-compose.yml` (vd: `rms_user`)
*   **Password:** Mật khẩu bạn đã ghi nhớ từ `docker-compose.yml` (vd: `your_strong_password`)

**Ví dụ các bước kết nối với DBeaver:**

1.  Mở DBeaver.
2.  Nhấp vào biểu tượng "New Database Connection" (hình ổ cắm điện) ở góc trên bên trái.
3.  Chọn "PostgreSQL" và nhấp "Next".
4.  Trong tab "Main":
    *   **Host:** `localhost`
    *   **Port:** `5432`
    *   **Database:** `rms_db`
    *   **Username:** `rms_user`
    *   **Password:** `123456`
5.  Nhấp vào nút "Test Connection ..." ở dưới cùng bên trái để kiểm tra. Nếu thành công, bạn sẽ thấy thông báo "Connected".
6.  Nhấp "Finish".
7.  Bạn sẽ thấy kết nối mới trong danh sách Database Navigator bên trái. Mở rộng nó để xem database và các schemas/tables (ban đầu có thể chưa có tables nếu chưa chạy migrations).