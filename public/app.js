const form = document.getElementById('form-sv');
const dsSV = document.getElementById('ds-sv');
const thongBao = document.getElementById('thong-bao');
const trong = document.getElementById('trong');

function hienThongBao(noiDung, loai) {
  thongBao.textContent = noiDung;
  thongBao.className = 'thong-bao ' + loai;
}

// Tai danh sach sinh vien tu server va ve ra bang
async function taiDanhSach() {
  const res = await fetch('/api/sinhvien');
  const data = await res.json();

  dsSV.innerHTML = '';
  trong.hidden = data.length > 0;

  data.forEach((sv) => {
    const tr = document.createElement('tr');
    [sv.MaSV, sv.HoTen, sv.Lop || '', sv.Email || ''].forEach((giaTri) => {
      const td = document.createElement('td');
      td.textContent = giaTri; // textContent de tranh loi chen ma HTML
      tr.appendChild(td);
    });

    const tdXoa = document.createElement('td');
    const nutXoa = document.createElement('button');
    nutXoa.textContent = 'Xóa';
    nutXoa.className = 'xoa';
    nutXoa.addEventListener('click', () => xoaSinhVien(sv.Id));
    tdXoa.appendChild(nutXoa);
    tr.appendChild(tdXoa);

    dsSV.appendChild(tr);
  });
}

async function xoaSinhVien(id) {
  if (!confirm('Bạn chắc chắn muốn xóa sinh viên này?')) return;
  await fetch('/api/sinhvien/' + id, { method: 'DELETE' });
  taiDanhSach();
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const body = {
    maSV: document.getElementById('maSV').value,
    hoTen: document.getElementById('hoTen').value,
    lop: document.getElementById('lop').value,
    email: document.getElementById('email').value
  };

  const res = await fetch('/api/sinhvien', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
  const kq = await res.json();

  if (res.ok) {
    hienThongBao('Đã thêm sinh viên thành công!', 'ok');
    form.reset();
    taiDanhSach();
  } else {
    hienThongBao(kq.loi || 'Có lỗi xảy ra', 'loi');
  }
});

taiDanhSach();
