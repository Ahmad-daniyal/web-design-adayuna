# Edquest — Komunitas Belajar Cerdas

> Mulai perjalanan belajarmu tanpa rasa malu.

Edquest adalah platform belajar digital untuk siswa SMA/SMK di mana kamu bisa berdiskusi dengan teman sebaya, mencari teman belajar yang cocok, dan melacak progress belajarmu — semua dalam lingkungan yang nyaman dan bebas dari rasa takut dihakimi.

---

## Konsep

Edquest dibangun di atas satu keyakinan sederhana: **setiap siswa punya potensi, dan tidak ada yang merasa paling pintar**. Semua orang di sini sama-sama belajar.

Tiga pilar yang menopang seluruh pengalaman Edquest:

| Pilar | Makna |
|---|---|
| **Ruang Aman** | Lingkungan diskusi yang nyaman dengan opsi anonim — bertanya tanpa rasa malu. |
| **Koneksi** | Menghubungkan siswa dengan teman belajar yang sesuai minat dan gaya belajar. |
| **Progress** | Membantu siswa melacak perjalanan belajarnya lewat jurnal, poin, dan badge. |

**Target pengguna:** siswa SMA/SMK yang ingin belajar lebih percaya diri, baik yang sudah rajin maupun yang masih ragu untuk memulai.

---

## Tujuan

Edquest lahir untuk membangun **generasi siswa yang percaya diri untuk belajar, bertanya, dan berbagi ilmu — tanpa batasan rasa malu**. Tidak hanya menyediakan materi, Edquest ingin menumbuhkan keberanian: siswa yang tidak takut mengakui ketidaktahuan dan berani meminta bantuan teman sebaya.

Cara kerjanya cukup tiga langkah:

1. **Daftar Akun** — pakai nama panggilan, tidak perlu nama asli kalau malu.
2. **Ikut Diskusi** — bertanya, menjawab, atau sekadar membaca thread di forum.
3. **Tumbuh Bareng** — dapatkan poin, badge, dan teman belajar baru.

---

## Masalah yang Dipecahkan

Edquest hadir menjawab tiga masalah nyata yang dihadapi banyak siswa:

### 1. Siswa pintar tapi ragu bertanya
Rasa malu, takut dinilai kurang paham, atau khawatir dihakimi teman membuat banyak siswa memilih diam — padahal di dalam kepala mereka penuh rasa ingin tahu.

**Solusi Edquest:** forum diskusi yang aman dengan opsi anonim dan nama panggilan. Bertanya tidak lagi terasa menakutkan.

### 2. Belajar sendiri terasa berat
Tanpa teman diskusi, materi sulit dipahami dan motivasi mudah menurun. Belajar sendirian membuat banyak siswa kehilangan arah.

**Solusi Edquest:** Study Buddy Matching yang mencocokkan siswa berdasarkan mapel dan gaya belajar, sehingga ada teman untuk saling bantu dan menjaga semangat.

### 3. Tidak ada ruang aman untuk tumbuh
Siswa butuh tempat untuk berpendapat, mencoba, dan melihat perkembangan diri mereka tanpa tekanan.

**Solusi Edquest:** Progress Journal yang mencatat perkembangan harian plus sistem poin dan badge sebagai apresiasi — bukan perlombaan, melainkan dorongan untuk terus aktif belajar.

---

## Fitur Utama

- **Forum Diskusi Anonim** — thread diskusi per kategori mapel (Matematika, Fisika, Kimia, Biologi, Sejarah, Bahasa, IPS).
- **Study Buddy Matching** — cari teman belajar sesuai mapel dan minat/gaya belajar.
- **Progress Journal** — catat aktivitas belajar harian, setiap catatan memberi +5 poin. Jurnal ini punya halaman sendiri, terpisah dari Profil.
- **Catatan AI** — dari jurnal, klik satu catatan untuk membukanya di halaman Catatan AI, lalu minta rangkuman singkat, poin penting, langkah belajar, atau kuis pilihan ganda. Hasilnya menempel pada catatan itu (ikut tersimpan di localStorage) dan bisa dibuka lagi kapan saja. Catatan pertama yang muncul setelah pendaftaran adalah **catatan contoh**, jadi cara pakainya kelihatan tanpa perlu menulis dari nol; setiap catatan bisa dihapus lagi.
- **Poin & Badge** — apresiasi atas kontribusi dan pencapaian belajar.
- **Ice Breaker** — kalimat siap salin untuk memulai diskusi tanpa canggung.
- **Mode Gelap & Pencarian** — pengalaman membaca yang nyaman siang maupun malam.

---

## Teknologi

- **Vanilla JavaScript SPA** — tanpa framework, ES Modules native, entry file `js/core/main.js`.
- **Struktur modular** — `js/core/` (main, router, app, config, theme), `js/services/` (auth, forum, buddy, match, profile, notes, ai, settings), `js/utils/`, `js/data/`, `components/` (layout & ui), `features/` (halaman + CSS masing-masing).
- **Data JSON** — konten statis (forum, buddy, home, template catatan, catatan contoh, bank soal kuis) diambil dari `data/*.json` dan `features/notes/notes.json`, di-cache ke `dataStore` lewat `preloadData()`.
- **CSS terpecah** — `css/global.css` untuk tema light/dark + satu file CSS per komponen/fitur, dimuat otomatis via `injectStyle()`.
- **Hash Routing** — 7 halaman: `#/`, `#/forum`, `#/friend`, `#/match`, `#/profile`, `#/catatan`, `#/about` — kompatibel penuh dengan static hosting. Halaman Catatan punya dua mode: daftar catatan di `#/catatan` dan bantuan AI di `#/catatan?note=<ref-catatan>`. Tautan lama `#/faq` diarahkan ke `#/about?tab=faq`.
- **Tailwind CSS (CDN)** + CSS variables untuk tema light/dark.
- **Font Awesome 6** dan **Google Fonts (Inter)**.
- **localStorage / sessionStorage** — sesi pengguna dan data spesifik user disimpan di browser, termasuk hasil AI pada tiap catatan (`entry.ai`).
- **Mesin AI demo** — `js/services/ai.js` murni lokal: ringkasan, poin penting, dan langkah belajar dihitung dari teks catatan, sedangkan soal kuis diambil dari `data/questions.json` dan dipilih deterministik. Tidak ada panggilan API, jadi tidak butuh API key maupun biaya. Mengganti dengan AI sungguhan cukup mengubah isi empat fungsi di file tersebut.

> Catatan: ini versi demo/mockup. Data disimpan sementara di localStorage dan tidak dikirim ke server manapun.

---

## Menjalankan Proyek

Proyek ini memakai **ES Modules** dan **`fetch()`** untuk memuat data JSON. Keduanya diblokir browser saat dibuka langsung dari file, jadi halaman **wajib** dijalankan lewat server statis.

```bash
npx serve .
# atau
npx http-server -p 8080 .
```

Kemudian buka `http://localhost:8080` di browser.

> Jangan membuka `index.html` dengan double-click. Pada mode `file://` browser memblokir pemuatan modul dan data, sehingga halaman tampil kosong.

---

*Dibangun dengan semangat "belajar tanpa rasa malu" — untuk semua siswa yang berani memulai.*
