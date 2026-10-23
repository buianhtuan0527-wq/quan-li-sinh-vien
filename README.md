# Quản lý sinh viên

Bài tập: app có giao diện HTML/CSS, cơ sở dữ liệu SQL Server, chức năng thêm (và xem, xóa) sinh viên.

## Cấu trúc

- `public/` – giao diện web (HTML, CSS, JavaScript)
- `server.js` – máy chủ Node.js, nhận yêu cầu từ giao diện và làm việc với SQL Server
- `database.sql` – script tạo database `QLSV` và bảng `SinhVien`
- `.devcontainer/` – cấu hình để GitHub Codespaces tự dựng SQL Server và chạy app

## Chạy trên GitHub (Codespaces)

1. Trên trang repository, bấm nút xanh **Code** → tab **Codespaces** → **Create codespace on main**.
2. Chờ vài phút để GitHub dựng môi trường (lần đầu hơi lâu vì tải SQL Server).
3. Khi Codespace mở xong, mở **Terminal** và gõ:
   ```
   npm start
   ```
4. Khi thấy dòng `Da ket noi SQL Server...`, bấm vào thông báo **Open in Browser** (hoặc mở tab **Ports** → cổng 3000 → biểu tượng quả địa cầu).
5. Nhập thông tin và bấm **Thêm**. Dữ liệu được lưu vào SQL Server.

> Lưu ý: GitHub Pages chỉ chạy được web tĩnh, không chạy được SQL Server. Vì vậy dùng Codespaces.
> Khi dừng Codespace thì app tắt; mở lại và chạy `npm start` là dùng tiếp.

## Chạy trên máy cá nhân

1. Cài Node.js và SQL Server (bật đăng nhập SQL, tài khoản `sa`).
2. Đặt biến môi trường `DB_PASSWORD` (và `DB_SERVER` nếu cần), rồi:
   ```
   npm install
   npm start
   ```
3. Mở http://localhost:3000
