-- Script SQL Server cua bai tap (app tu chay script nay khi khoi dong,
-- file nay de nop kem / giai thich voi co giao)

IF DB_ID('QLSV') IS NULL
    CREATE DATABASE QLSV;
GO

USE QLSV;
GO

IF OBJECT_ID('dbo.SinhVien', 'U') IS NULL
CREATE TABLE dbo.SinhVien (
    Id      INT IDENTITY(1,1) PRIMARY KEY,
    MaSV    NVARCHAR(20)  NOT NULL UNIQUE,
    HoTen   NVARCHAR(100) NOT NULL,
    Lop     NVARCHAR(50)  NULL,
    Email   NVARCHAR(100) NULL,
    NgayTao DATETIME      NOT NULL DEFAULT GETDATE()
);
GO

-- Cau lenh mau
-- INSERT INTO dbo.SinhVien (MaSV, HoTen, Lop, Email) VALUES (N'SV001', N'Nguyễn Văn A', N'CNTT62', N'a@gmail.com');
-- SELECT * FROM dbo.SinhVien;
