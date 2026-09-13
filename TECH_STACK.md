# Cara Kerja Forum StudNow

Dokumentasi sistem dan alur kerja forum StudNow sebagai konteks pembuatan web forum lainnya.

---

## 1. Autentikasi

- User mendaftar dengan **nama, email, dan password** lalu login
- Session disimpan di `localStorage` (`studnow_session`)
- Setelah login, user bisa mengakses fitur yang dilindungi (chat, DM, profil, buat forum)
- User yang belum login hanya bisa melihat halaman publik (home, explore, about)

---

## 2. Forum

### Struktur Forum
- Setiap forum punya **nama, deskripsi, kategori, jumlah anggota, dan level privasi**
- Forum bisa **public** (langsung join) atau **private** (perlu approval, di-auto approve setelah 5-15 detik)
- Setiap forum punya **channel** (text channel dan voice channel placeholder)

### Interaksi di Forum
- User bisa **join** forum public langsung, forum private menunggu approval
- Di dalam forum, user bisa **kirim pesan** di channel
- Ada **daftar anggota** yang bisa dilihat
- User bisa **leave** forum

### Membuat Forum Sendiri
- User bisa **membuat forum baru** (custom forum) dengan nama, deskripsi, kategori
- User bisa **mengedit** dan **menghapus** forum yang dibuatnya sendiri
- Data forum custom tersimpan di localStorage

---

## 3. Chat & DM

### Chat
- User bisa bergabung ke **room chat** berdasarkan topik/kursus
- Pesan dikirim dan ditampilkan secara real-time (simulasi dengan delay)
- Setiap chat room punya **daftar peserta** dan **riwayat pesan**

### Direct Message (DM)
- User bisa mengirim **pesan langsung** ke user lain
- Fitur DM meliputi: **kirim, edit, hapus, balas, dan tandai sudah dibaca**
- Percakapan DM tersimpan di localStorage

---

## 4. Sosial

### Follow / Unfollow
- User bisa **follow** user lain untuk melihat aktivitasnya
- **Mutual follow** = saling follow = status teman

### Block
- User bisa **memblokir** user lain
- User yang diblokir tidak bisa berinteraksi dengan yang memblokir

---

## 5. Profil

- Setiap user punya **profil** yang berisi nama, avatar, bio, dan minat belajar
- User bisa **mengedit profil** (nama, bio, avatar, minat)
- Profil bisa dibagikan melalui **QR code**
- User bisa melihat **daftar forum yang diikuti** dan **minat belajar**

---

## 6. Minat Belajar

- Saat signup, user memilih **minat belajar** (misal: Matematika, Fisika, Pemrograman)
- Minat digunakan untuk:
  - **Rekomendasi forum** yang sesuai minat
  - **Filter konten** di halaman home
- User bisa **menambah/menghapus minat** kapan saja dari profil

---

## 7. Pencarian

- User bisa **mencari forum** berdasarkan kata kunci
- Pencarian menggunakan **fuzzy search** dengan scoring:
  - Match di **judul** = skor tertinggi
  - Match di **tag/kategori** = skor sedang
  - Match di **deskripsi** = skor terendah
- Hasil pencarian diurutkan berdasarkan relevansi

---

## 8. Notifikasi

- User menerima **notifikasi** untuk aktivitas:
  - Seseorang join forum yang sama
  - Ada pesan baru di forum yang diikuti
  - Permintaan join forum private
- Notifikasi ditampilkan dengan **badge counter** di navbar

---

## 9. Grup

- Selain forum, ada **grup** untuk diskusi lebih kecil
- Grup punya **daftar anggota** dan **deskripsi**
- User bisa **join** dan **leave** grup

---

## 10. Tampilan & Tema

### Responsive Design
- **Desktop (>=901px)**: Navbar + footer terlihat
- **Mobile (<=900px)**: Top bar + bottom navigation terlihat

### Dark / Light Mode
- User bisa beralih antara **dark mode** dan **light mode**
- Preferensi tema disimpan di localStorage
- Secara default mengikuti **preferensi sistem** operasi

---

## Alur Data

```
Data awal (JSON statis) → dimuat saat app start → disimpan ke localStorage → 
di CRUD oleh user melalui service layer → ditampilkan oleh UI components
```

```
User action → Service handler → Update localStorage → Emit custom event → 
UI re-render sesuai perubahan
```

---

*Terakhir diperbarui: September 2026*
