# Recruitment Management Web Application

## 📝 Tổng quan

Đây là một ứng dụng web quản lý tuyển dụng được xây dựng bằng `React` cho frontend và `(Backend Technology - ví dụ: Node.js/Express, Python/Django, etc.)` cho backend. Dự án này nhằm mục đích tạo ra một nền tảng giúp nhà tuyển dụng đăng tin tuyển dụng, quản lý ứng viên và giúp ứng viên tìm kiếm, ứng tuyển vào các vị trí phù hợp.

## ✨ Tính năng chính (Dự kiến)

*   **Nhà tuyển dụng:**
    *   Đăng nhập / Đăng ký
    *   Tạo và quản lý tin tuyển dụng (CRUD)
    *   Xem và quản lý danh sách ứng viên ứng tuyển
    *   Quản lý hồ sơ công ty
    *   Dashboard thống kê (số lượng tin đăng, ứng viên,...)
*   **Ứng viên:**
    *   Đăng nhập / Đăng ký
    *   Tạo và quản lý hồ sơ cá nhân (Profile)
    *   Tìm kiếm việc làm (Newsfeed)
    *   Xem chi tiết tin tuyển dụng (Post Detail)
    *   Ứng tuyển vào vị trí công việc

## 🚀 Công nghệ sử dụng

*   **Frontend:**
    *   `React.js`
    *   `(Ví dụ: Redux/Zustand/Context API for State Management)`
    *   `(Ví dụ: React Router for Routing)`
    *   `(Ví dụ: Axios for API Calls)`
    *   `(Ví dụ: Material UI / Ant Design / Tailwind CSS for Styling)`
*   **Backend:**
    *   `(Ví dụ: Node.js with Express.js)`
    *   `(Ví dụ: RESTful API / GraphQL)`
*   **Database:**
    *   `(Ví dụ: MongoDB / PostgreSQL / MySQL)`
*   **Khác:**
    *   `Git & GitHub for Version Control`

## 🏗️ Cấu trúc thư mục dự án

```text
recruitment-management/
├── backend/                  # Thư mục chứa code backend
|--------------
|   TODO
|--------------
│
├── frontend/                 # Thư mục chứa code frontend (React) - có thể đổi tên từ app-frontend
│   ├── public/               # Chứa file public (index.html, favicon,...)
│   ├── src/
│   │   ├── assets/           # Chứa tài nguyên tĩnh (images, fonts,...)
│   │   ├── components/       # Các UI component tái sử dụng
│   │   ├── contexts/         # Hoặc /store - Quản lý state global (Context API, Redux,...)
│   │   ├── hooks/            # Các custom React hooks
│   │   ├── layouts/          # Bố cục chung cho các trang (Navbar, Footer, Sidebar)
│   │   ├── pages/            # Các component tương ứng với từng trang (Dashboard, Profile, Newsfeed)
│   │   ├── routes/           # Cấu hình routing
│   │   ├── services/         # Hoặc /api - Các hàm gọi API backend
│   │   ├── styles/           # Hoặc /theme - Global styles, theme configuration
│   │   ├── utils/            # Các hàm tiện ích chung
│   │   ├── App.js            # Component gốc của ứng dụng
│   │   └── index.js          # Điểm khởi chạy ứng dụng React
│   ├── .env.example          # File ví dụ biến môi trường (API URL,...)
│   ├── .gitignore
│   └── package.json
│
├── .gitignore                # File gitignore chung cho toàn project
├── 
└── README.md                 # File README này

```

*Lưu ý:* Tên thư mục `app-frontend` trong README gốc của bạn có thể đổi thành `frontend` cho nhất quán và dễ hiểu hơn.

## 🛠️ Cài đặt và Chạy dự án

**Yêu cầu:**

*   Node.js (`v16` trở lên) & `npm` / `yarn`
*   Git
*   `(Ví dụ: MongoDB / PostgreSQL Server)` - Tùy thuộc vào DB bạn chọn

**Các bước:**

1.  **Clone repository:**
    ```bash
    git clone <your-repository-url>
    cd recruitment-management
    ```

2.  **Cài đặt Backend:**
    ```bash
    cd backend
    npm install # hoặc yarn install
    # Sao chép .env.example thành .env và cấu hình các biến môi trường (DB connection string, JWT secret,...)
    cp .env.example .env
    # Chỉnh sửa file .env với thông tin của bạn
    ```

3.  **Cài đặt Frontend:**
    ```bash
    cd ../frontend # hoặc cd ../app-frontend nếu bạn giữ tên cũ
    npm install # hoặc yarn install
    # Sao chép .env.example thành .env và cấu hình các biến môi trường (API_BASE_URL,...)
    cp .env.example .env
    # Chỉnh sửa file .env với thông tin của bạn (ví dụ: API_BASE_URL=http://localhost:5000/api)
    ```

4.  **Chạy Backend:**
    ```bash
    cd ../backend
    npm run dev # Giả sử bạn có script "dev" trong package.json để chạy server với nodemon
    # Hoặc npm start
    ```
    *Backend sẽ chạy tại địa chỉ (ví dụ: `http://localhost:5000`)*

5.  **Chạy Frontend:**
    ```bash
    cd ../frontend # hoặc cd ../app-frontend
    npm run dev # Hoặc yarn dev
    ```
    *Frontend sẽ chạy tại địa chỉ (ví dụ: `http://localhost:3000`)*

## 📋 Kế hoạch Phát triển (TODO)

Chi tiết kế hoạch phát triển và danh sách công việc được theo dõi tại file [TODO.md](./TODO.md).

## 🤝 Đóng góp

| Mã Sinh Viên | Tên Sinh Viên        |
| :----------- | :------------------- |
| 20225583     | Lê Hải Nhật          |
| 20225547    | Nguyễn Phương Linh   |
| 20225544     | Hạ Nhật Duy          |

| Feature                                                                                     | Person in charge      | Technologies / Methods                                         | Status        |
| :------------------------------------------------------------------------------------------ | :-------------------- | :------------------------------------------------------------- | :-------------|
| [BE+FE] Login + Register (with username/password)                                           | Lê Hải Nhật           | Express.js, JWT, PostgreSQL, React                             | Done          |
| [BE] Database management with knex and init schema                                          | Hạ Nhật Duy           | PostgreSQL, Knex.js                                            | Done          |
| [BE+FE] Profile UI and API                                                                  | Hạ Nhật Duy           | React, Express.js, REST API                                    | Done          |
| [BE] Applied job API (logic)                                                                       | Nguyễn Phương Linh    | Express.js, PostgreSQL                                         | Done |
| [BE+FE] Posts management (CRUD) API and Newsfeed UI                                  | Nguyễn Phương Linh    | Express.js, React, REST API                                    | Done   |
| [SEC] Password Authentication / Enforcing password policy                                   | Lê Hải Nhật           | Regex, Joi validation, OWASP guidelines                        | Done          |
| [SEC] Password Authentication / Secure password storage                       | Lê Hải Nhật           | bcrypt                                                         | Done          |
| [SEC] Password Authentication / Prevention of password guessing                             | Le Hai Nhat        | express-rate-limit, CAPTCHA, login attempt tracking            | Not Started   |
| [SEC] Password Authentication / Password recovery                  | Le Hai Nhat       | Token-based recovery + Send password recovery email          | Not Started   |
| [SEC] Session Auth / Secure mechanisms for using access tokens                              | Le Hai Nhat         | JWT expiration, tamper-proof signing, refresh tokens           | Not Started   |
| [SEC] Session Auth / CSRF Defense                                                           | Nguyễn Phương Linh       | CSRF tokens (e.g. `csurf`), SameSite cookie attributes         | Not Started   |
| [SEC] Session Auth / Session hijacking defense                                              | Chưa phân công        | IP/device validation, rotating tokens, session timeout         | Not Started   |
| [SEC] Authorization / Implement RBAC                                                        | Le Hai Nhat       | Role-based checks, middleware-based access control             | Done   |
| [SEC] Input validation / Input validation and sanitization                                  | Nguyễn Phương Linh       | Joi, express-validator, custom logic                           | In Progress   |
| [SEC] Input validation / Protection against Injection attacks                               | Nguyễn Phương Linh       | ORM (Knex), parameterized queries, input filtering             | In Progress   |
| [SEC] Input validation / Prevention of path traversal, directory indexing                   | Chưa phân công        | path.normalize, whitelist allowed paths                        | Not Started   |
| [SEC] Input validation / Upload file restriction                                             | Nguyễn Phương Linh       | multer, MIME type check, file size limit                       | In Progress   |
| [SEC] Info leakage prevention / Minimize server/software info in response                   | Nguyễn Phương Linh      | Remove headers, error masking                                  | In Progress   |
| [SEC] Info leakage prevention / Hide sensitive app info                                     | Nguyễn Phương Linh       | Custom error messages, disable stack trace                     |In Progress |
| [SEC] Compliance / HTTPS implementation                                                     | Chưa phân công        | SSL certificates, force HTTPS redirect                         | Not Started   |
| [SEC] Compliance / DoS mitigation                                                           | Chưa phân công        | Rate limiting, request size limit, timeout                     | Not Started   |
| [SEC] Compliance / Secure storage and management of sensitive values                        | Chưa phân công        | Environment variables, encryption, vaults                      | Not Started   |
| [SEC] Security Testing / Source code review (SonarQube, etc.)                               | Hạ Nhật Duy         | SonarQube, ESLint, code review                                 | Not Started   |
| [SEC] Security Testing / Basic penetration testing (ZAP Proxy, Nikto, etc.)                 | Hạ Nhật Duy        | OWASP ZAP, Nikto, RAF DAS                                      | Not Started   |
| [SEC] Bonus / Multi-factor authentication                                                   | Chưa phân công        | OTP via email/sms, authenticator apps                          | Not Started   |
| [SEC] Bonus / Session hijacking detection (unfamiliar device, cookie reuse prevention)      | Chưa phân công        | Device fingerprinting, IP check, token invalidation            | Not Started   |
| [SEC] Bonus / Advanced HTTP Flood prevention                                                | Chưa phân công        | Rate limiting, fail2ban, WAF                                   | Not Started   |

