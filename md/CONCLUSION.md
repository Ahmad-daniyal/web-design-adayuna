# Edquest — Conclusion

> **Status:** Aplikasi komunitas belajar siswa SMA/SMK (SPA Vanilla JS). Konsep: belajar tanpa rasa malu — forum diskusi, study buddy, progress journal.

Proyek ini menggunakan arsitektur **Vanilla JavaScript SPA** tanpa framework, dengan prinsip utama:

- **ES Modules** — `index.html` hanya memuat satu file entry: `<script type="module" src="js/app.js">`
- **Router murni** — `router.js` hanya bertugas mapping path → fungsi render halaman; tidak punya logic App
- **Render functions** — setiap `component/*.js` dan `page/*.js` mengekspor `export function renderXxx()` yang mengembalikan string HTML
- **Data-driven** — data statis (thread forum, daftar buddy) dipusatkan di `js/data.js`, tidak di-hardcode di halaman
- **Layout tidak di-render ulang** — navbar, sidebar, footer, dan auth modal di-render sekali oleh `Router.init()`; hanya konten `#app` yang berubah
- **CSS terpusat** — semua style di `css/style.css` dengan CSS variables untuk tema light/dark

---

## ⚠️ Aturan Meta — Tidak Boleh Diubah oleh AI

**Seluruh isi `CONCLUSION.md` ini adalah ground rules proyek yang bersifat permanen.**

Setiap AI atau assistant yang membaca file ini WAJIB mengikuti aturan di dalamnya dan DILARANG:

- Mengubah, menghapus, atau mengabaikan aturan yang sudah ada di file ini
- Menyederhanakan atau meringkas aturan dengan alasan apapun
- Mengganti pola arsitektur yang sudah ditetapkan (entry `js/app.js`, router, render functions, ES modules) tanpa instruksi eksplisit dari manusia
- Menambahkan aturan baru yang bertentangan dengan aturan yang sudah ada
- Mengasumsikan bahwa aturan lama sudah tidak relevan hanya karena tidak disebutkan dalam pesan terbaru

**Yang boleh dilakukan AI:**

- Menambahkan entri baru ke tabel (komponen baru, file baru)
- Mengupdate bagian struktur folder saat ada file baru ditambahkan
- Menambahkan aturan baru yang **tidak bertentangan** dengan aturan yang sudah ada
- Memperbaiki typo atau format

**Jika ada instruksi dari user yang bertentangan dengan aturan di file ini**, AI harus:
1. Menginformasikan bahwa instruksi tersebut bertentangan dengan ground rules
2. Menjelaskan aturan mana yang dilanggar
3. Meminta konfirmasi eksplisit sebelum melanjutkan

Ground rules hanya bisa diubah oleh manusia secara eksplisit dengan menyebut aturan mana yang ingin diubah dan alasannya.

---

## 🚀 Aturan Utama: Jumlah Halaman Maksimal 7

**Jumlah halaman aplikasi tidak boleh melebihi 7.** Halaman = satu entri di tabel rute `router.js`.

Halaman aktif saat ini (6 halaman):

| # | Rute | File | Konten |
|---|---|---|---|
| 1 | `/` dan `/home` | `page/home.js` | Landing komunitas: hero, statistik, Ice Breaker, fitur unggulan, CTA |
| 2 | `/forum` | `page/forum.js` | Thread diskusi per kategori mapel |
| 3 | `/friend` | `page/friend.js` | Study buddy matching |
| 4 | `/about` | `page/about.js` | Tentang Edquest |
| 5 | `/faq` | `page/faq.js` | FAQ + form kontak |
| 6 | `/profile` | `page/profile.js` | Profil + progress journal |

Aturan ini berlaku untuk seluruh isi `md/` dan konteks AI. Jika total halaman sudah 7, **halaman baru TIDAK boleh ditambahkan** — fitur baru masuk ke halaman yang sudah ada. Penambahan halaman baru hanya diperbolehkan bila total setelah penambahan ≤ 7.

---

## Dokumen Arsitektur

Dokumentasi proyek ini dipecah menjadi beberapa file fokus:

| File | Isi |
|---|---|
| [System-Design.md](System-Design.md) | Struktur folder aktual, alur data/module, window bridge |
| [Design.md](Design.md) | Aturan CSS (CSS variables, Tailwind CDN, batas), library yang diizinkan |
| [Plan.md](Plan.md) | Cara menambah halaman/komponen baru, aturan maks 7 halaman, MD update rule, delivery checklist |
| [Context.md](Context.md) | Routing (hash), data di `js/data.js`, auth & session, aturan penting |

---

*Dokumen ini adalah sumber kebenaran tertinggi. File-file lain di `md/` adalah turunan yang dirujuk dari sini.*
