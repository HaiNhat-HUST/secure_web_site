
# usage
- use `npm start` to run the front end (be in the frontend folder)
- access at http://localhost:3000

# folder structure
client/                 # Frontend (React)
├── 📂 public/             # Chứa favicon, index.html (public resources)
├── 📂 src/                # Code chính của frontend
│   ├── 📂 assets/         # Chứa hình ảnh, CSS, fonts
│   ├── 📂 components/     # Các component dùng chung: postItem, ....
│   ├── 📂 pages/          # Các trang chính (Home, About, Profile)
│   ├── 📂 services/       # File gọi API (Axios, Fetch)
│   ├── 📂 hooks/          # Custom React hooks
│   ├── 📂 store/          # Redux store (nếu dùng Redux)
│   ├── 📂 utils/          # Các hàm helper
│   ├── App.js             # Component gốc
├── index.js           # Điểm khởi động React
├── package.json           # Dependencies frontend
├── vite.config.js         # Config Vite (hoặc webpack.config.js nếu dùng Webpack)
├── .env                   # Biến môi trường frontend
├── README.md              # (here)

