const express = require('express');
const sql = require('mssql');
const path = require('path');

const DB_NAME = 'QLSV';

// Thong tin ket noi SQL Server (mac dinh khop voi cau hinh Codespaces)
const baseConfig = {
  user: process.env.DB_USER || 'sa',
  password: process.env.DB_PASSWORD || 'YourStrong@Passw0rd',
  server: process.env.DB_SERVER || 'localhost',
  port: parseInt(process.env.DB_PORT || '1433', 10),
  options: { encrypt: false, trustServerCertificate: true }
};

let pool;
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Tao database + bang neu chua co (SQL Server khoi dong cham nen thu lai nhieu lan)
async function khoiTaoDatabase() {
  let master;
  for (let i = 1; i <= 20; i++) {
    try {
      master = await new sql.ConnectionPool({ ...baseConfig, database: 'master' }).connect();
      break;
    } catch (err) {
      console.log(`Chua ket noi duoc SQL Server (lan ${i}/20), doi 3 giay...`);
      await sleep(3000);
    }
  }
  if (!master) throw new Error('Khong ket noi duoc SQL Server');

  await master.request().query(`IF DB_ID('${DB_NAME}') IS NULL CREATE DATABASE ${DB_NAME}`);
  await master.close();

  pool = await new sql.ConnectionPool({ ...baseConfig, database: DB_NAME }).connect();
  await pool.request().query(`
    IF OBJECT_ID('dbo.SinhVien', 'U') IS NULL
    CREATE TABLE dbo.SinhVien (
      Id      INT IDENTITY(1,1) PRIMARY KEY,
      MaSV    NVARCHAR(20)  NOT NULL UNIQUE,
      HoTen   NVARCHAR(100) NOT NULL,
      Lop     NVARCHAR(50)  NULL,
      Email   NVARCHAR(100) NULL,
      NgayTao DATETIME      NOT NULL DEFAULT GETDATE()
    )`);
  console.log('Da ket noi SQL Server, database QLSV san sang.');
}

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Lay danh sach sinh vien
app.get('/api/sinhvien', async (req, res) => {
  try {
    const result = await pool.request().query('SELECT Id, MaSV, HoTen, Lop, Email FROM dbo.SinhVien ORDER BY Id DESC');
    res.json(result.recordset);
  } catch (err) {
    console.error(err);
    res.status(500).json({ loi: 'Loi khi doc du lieu' });
  }
});

// Them sinh vien moi
app.post('/api/sinhvien', async (req, res) => {
  const { maSV, hoTen, lop, email } = req.body || {};
  if (!maSV || !hoTen) {
    return res.status(400).json({ loi: 'Vui long nhap Ma SV va Ho ten' });
  }
  try {
    await pool
      .request()
      .input('MaSV', sql.NVarChar(20), String(maSV).trim())
      .input('HoTen', sql.NVarChar(100), String(hoTen).trim())
      .input('Lop', sql.NVarChar(50), lop ? String(lop).trim() : null)
      .input('Email', sql.NVarChar(100), email ? String(email).trim() : null)
      .query('INSERT INTO dbo.SinhVien (MaSV, HoTen, Lop, Email) VALUES (@MaSV, @HoTen, @Lop, @Email)');
    res.status(201).json({ ok: true });
  } catch (err) {
    if (err.number === 2627 || err.number === 2601) {
      return res.status(409).json({ loi: 'Ma SV nay da ton tai' });
    }
    console.error(err);
    res.status(500).json({ loi: 'Loi khi them du lieu' });
  }
});

// Xoa sinh vien
app.delete('/api/sinhvien/:id', async (req, res) => {
  try {
    await pool.request().input('Id', sql.Int, parseInt(req.params.id, 10)).query('DELETE FROM dbo.SinhVien WHERE Id = @Id');
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ loi: 'Loi khi xoa du lieu' });
  }
});

const PORT = process.env.PORT || 3000;
khoiTaoDatabase()
  .then(() => app.listen(PORT, () => console.log(`Mo trinh duyet tai cong ${PORT}`)))
  .catch((err) => {
    console.error(err.message);
    process.exit(1);
  });
