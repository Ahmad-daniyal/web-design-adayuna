# Edquest — Komunitas Belajar Cerdas

## Materi Presentasi & Referensi Pembuatan Slide (PPT)

> Project dibuat untuk **INVENTION 2026** · Versi demo/mockup (data di localStorage, tanpa server)

---

# 1. Judul & Subjudul Project

## Edquest — Komunitas Belajar Cerdas

> Tagline: **"Mulai perjalanan belajarmu tanpa rasa malu."**

- **Edquest** adalah platform belajar digital untuk siswa **SMA/SMK**
- Fasilitas utama: berdiskusi, mencari teman belajar, dan melacak progress belajar
- Semua dalam satu lingkungan **nyaman, bebas dari rasa takut dihakimi**
- Dibangun sebagai **Single Page Application (SPA)** dengan JavaScript murni (Vanilla JS)
- Di-ikuti sebagai project **INVENTION 2026**

> 💡 **Visual slide:** Mockup/screenshot halaman hero Edquest di tengah slide, tagline besar, logo "E". Tambahkan nama tim & nama lomba di bagian bawah.

---

# 2. Latar Belakang / Masalah

## Kenapa Edquest Dibuat?

- Banyak **siswa pintar tapi ragu bertanya** — rasa malu, takut dinilai kurang paham, atau khawatir dihakimi teman membuat siswa memilih diam
- **Belajar sendiri terasa berat** — tanpa teman diskusi, materi sulit dipahami dan motivasi mudah menurun
- **Tidak ada ruang aman untuk tumbuh** — siswa butuh tempat untuk berpendapat, mencoba, dan melihat perkembangan diri tanpa tekanan

### Masalah → Solusi

| Masalah | Fakta di Lapangan | Solusi Edquest |
|---|---|---|
| Ragu bertanya | Siswa penuh rasa ingin tahu namun takut tampil bodoh | Forum diskusi dengan opsi **anonim & nama panggilan** |
| Belajar sendiri berat | Motivasi turun, materi terasa sulit dipahami | **Study Buddy Matching** — teman belajar sesuai mapel & minat |
| Tidak ada ruang tumbuh | Tidak ada wadah untuk berkembang tanpa tekanan | **Progress Journal** + poin & badge sebagai apresiasi |

> 💡 **Visual slide:** 3 kotak "Masalah" di kiri dengan ikon, panah ke 3 kotak "Solusi" di kanan. Gunakan warna kontras (merah/seru untuk masalah, biru/tenang untuk solusi).

---

# 3. Tujuan Project

## Membangun Generasi Siswa yang Percaya Diri

- Melahirkan siswa yang **percaya diri untuk belajar, bertanya, dan berbagi ilmu** — tanpa batasan rasa malu
- Bukan hanya menyediakan materi, tetapi menumbuhkan **keberanian mengakui ketidaktahuan**
- Target pengguna: siswa **SMA/SMK** — baik yang rajin maupun yang masih ragu memulai

### Tiga Pilar Edquest

| Pilar | Makna |
|---|---|
| **Ruang Aman** | Lingkungan diskusi nyaman dengan opsi anonim — bertanya tanpa rasa malu |
| **Koneksi** | Menghubungkan siswa dengan teman belajar sesuai minat & gaya belajar |
| **Progress** | Melacak perjalanan belajar lewat jurnal, poin, dan badge |

### Cara Kerja (3 Langkah)

1. **Daftar Akun** — pakai nama panggilan, tidak perlu nama asli bila malu
2. **Ikut Diskusi** — bertanya, menjawab, atau membaca thread di forum
3. **Tumbuh Bareng** — dapatkan poin, badge, dan teman belajar baru

> 💡 **Visual slide:** Diagram 3 lingkaran pilar yang saling tumpang tindih, lalu slide kedua dengan alur 3 langkah berpanah (1→2→3).

---

# 4. Ruang Lingkup

## Cakupan & Batasan Project

### Cakupan Halaman (8 Rute SPA)

- **Home** — hero, statistik komunitas, ice breaker, fitur unggulan, CTA
- **Forum** — thread diskusi + filter kategori mapel
- **Friend** — Study Buddy Matching & pencarian teman
- **Match/Arena** — duel kuis, leaderboard, rating
- **About** — latar belakang, visi & misi
- **FAQ** — pertanyaan umum + form kontak
- **Profile** — data pengguna, jurnal, badge, statistik duel
- **Settings (modal)** — pengaturan pengguna

### Cakupan Konten

- **7 kategori mapel**: Matematika, Fisika, Kimia, Biologi, Sejarah, Bahasa Indonesia, IPS
- **107 soal latihan** (7 mapel × 6 tingkat kesulitan: rendah → cerdas)
- **8 thread forum** contoh dengan komentar & solusi terverifikasi
- **8+ study buddy** contoh + data pengguna terdaftar
- **10 peserta leaderboard** contoh

### Batasan Project

- Versi **demo/mockup** untuk lomba — data disimpan sementara di **localStorage/sessionStorage**
- **Tanpa backend/server** — tidak ada data yang dikirim ke server manapun
- Interaksi real-time (chat, DM, voice) masih **placeholder/simulasi**
- Akun & postingan tidak sinkron antar perangkat (bergantung browser yang sama)

> 💡 **Visual slide:** Diagram "cakupan penuh vs batasan" — bagian kiri daftar fitur yang termasuk, bagian kanan tanda "X" untuk batasan (localStorage, tanpa server).

---

# 5. Metodologi / Pendekatan

## Cara Pengerjaan Project

### Teknologi yang Digunakan

- **Vanilla JavaScript SPA** — tanpa framework, memakai ES Modules native
- **Data JSON statis** — konten dimuat dari `data/*.json` lalu di-cache ke `dataStore`
- **CSS terpecah per modul** — `global.css` (tema & base) + 1 file CSS per komponen/fitur
- **Tailwind CSS (CDN)** + **CSS Variables** untuk tema light/dark
- **Font Awesome 6** & **Google Fonts** (Inter, Plus Jakarta Sans)
- **localStorage / sessionStorage** — sesi & data spesifik pengguna

### Arsitektur Modular (5 Concern Utama)

```
┌──────────────────────────────────────────────┐
│                   VIEW                       │
│          Komponen UI & Halaman               │
├──────────────┬──────────────┬────────────────┤
│   ROUTING    │    STATE     │    SERVICES    │
│   Navigasi   │   DataStore  │  Logika Bisnis │
├──────────────┴──────────────┴────────────────┤
│                DATA LAYER                    │
│        Fetch JSON → Cache → Persist          │
├──────────────────────────────────────────────┤
│            INFRASTRUCTURE                    │
│       Config, Utils, Theme                   │
└──────────────────────────────────────────────┘
```

### Struktur Folder

- `js/core/` — main, router, app, config, theme (infrastruktur)
- `js/services/` — auth, forum, buddy, match, profile, settings, notifications
- `js/data/` — dataStore + preloadData (satu titik akses data)
- `js/utils/` — styleLoader, url (fungsi murni)
- `components/` — layout (navbar, sidebar, footer) & ui (auth-modal)
- `features/` — home, forum, friend, match, about, faq, profile (1 folder per halaman)
- `data/` — file JSON statis (forum, buddies, questions, leaderboard, about, faq)

### Alur Kerja Aplikasi

```
Boot → Theme → Preload Data → Router → Render Halaman → Event → Update → Re-render
```

1. **Bootstrapping** — init tema (cegah flash), bridge service ke window, `preloadData()` memuat 7 file JSON
2. **Routing** — perubahan hash (`#/forum`) → render halaman → highlight nav aktif → dispatch `pageChanged`
3. **Interaksi** — klik/tulis → event handler → service method → update dataStore/localStorage → re-render UI
4. **Persistensi** — data pengguna (akun, poin, jurnal, statistik) tersimpan di localStorage

> 💡 **Visual slide:** Diagram arsitektur berlapis (5 concern) + flowchart alur data `Fetch → Store → Render → Event → Update`. Sertakan juga logo teknologi (JS, Tailwind, JSON).

---

# 6. Fitur / Hasil Utama

## Fitur Unggulan Edquest

### Forum Diskusi Anonim
- **7 kategori mapel** + filter kategori real-time
- **8 thread contoh** lengkap dengan komentar & balasan
- **Buat Thread Baru** — modal form + validasi (judul ≥ 5, isi ≥ 10 karakter)
- **Posting anonim** — toggle "Post sebagai anonim" di komentar
- **Vote (upvote)** pada komentar jawaban
- **Solusi Terverifikasi** — badge khusus untuk jawaban terbaik
- **Follow & Share thread** — ikuti topik, salin link ke clipboard
- **Thread Terkait & Kontributor Populer** — sidebar rekomendasi
- **Ringkasan Thread** — statistik keaktifan, balasan, suara, views

### Study Buddy Matching
- Filter pencarian: **nama/ID, mapel, minat belajar, kelas**
- Kartu teman belajar dengan avatar, kelas, status online
- Aksi "Ajak Berteman" (kirim permintaan) & "Lihat" profil
- Data buddy dari JSON + akun pengguna terdaftar → **bercampur otomatis**

### Arena Duel (Kuis Cerdas)
- **2 mode**: Classic (tanpa rating) & Ranked (naik peringkat)
- **10 soal** per tanding dari bank 107 soal, timer per tanding (120s Classic / 70s Ranked)
- Sistem **matchmaking** lawan seimbang (bot AI sesuai rank)
- Skor & **streak bonus** (+1 tiap 3 jawaban benar beruntun)
- **5 tier**: Bronze → Silver → Gold → Platinum → Diamond
- **7 badge pencapaian** (Langkah Pertama, Streak Keren, Raja Sulit, Si Cerdas, Naik Kelas, Gladiator, Legenda)
- **Leaderboard** global dengan rekor W/L/D
- **Pembahasan lengkap** setiap soal setelah tanding (jawaban + penjelasan)
- **Overlay Rank Naik** + animasi confetti saat naik tier

### Progress Journal
- Catatan aktivitas belajar harian per mapel
- **+5 poin** setiap catatan → termotivasi mencatat rutin
- Riwayat jurnal dengan waktu relatif ("2 jam lalu", "Kemarin", dll)

### Sistem Poin & Badge
- Poin dari aktivitas: jurnal, duel, kontribusi forum
- Badge tampil di profil (ikon terkunci untuk yang belum diraih)
- **Rank points** = rating + badge×15 + poin÷10

### Notifikasi
- **7 tipe**: badge, rank, match, journal, forum, buddy, system
- Dropdown notifikasi + **badge counter unread** di navbar
- "Tandai dibaca", "Bersihkan semua", klik untuk navigasi

### Autentikasi
- **Register** — nama, email, sekolah, mapel, minat, kelas, password (validasi lengkap, password ≥ 8 karakter)
- **Login** — dengan opsi "Ingat saya" (localStorage/sessionStorage)
- Auto-generate **ID pengguna 6 digit**

### Ice Breaker
- **4 kalimat siap salin** untuk memulai diskusi tanpa canggung
- Sekali klik → teks tersalin ke clipboard → tinggal tempel di forum

### UI/UX & Pengalaman
- **Mode Gelap / Terang** — otomatis mengikuti preferensi sistem
- **Mode Fokus** — menyembunyikan sidebar untuk fokus membaca
- **Pencarian global (Search Overlay)** — cari thread/topik, klik hasil → langsung buka thread
- **Reading progress bar** di atas navbar
- **Responsive** — desktop (navbar + sidebar) & mobile (top bar + bottom navigation)
- Animasi kartu 3D (pointer tracking) & transisi halus
- Toast notification untuk umpan balik aksi

> 💡 **Visual slide:** Grid kartu fitur (ikon + nama + 1 kalimat). Sisihkan 2-3 slide khusus screenshot: (1) Forum + komentar, (2) Arena Duel vs bot, (3) Profil + jurnal + badge.

---

# 7. Tantangan & Solusi

## Kendala yang Dihadapi & Cara Mengatasinya

| # | Tantangan | Solusi yang Diterapkan |
|---|---|---|
| 1 | **Regresi perilaku** saat merombak struktur program | Render tetap mengembalikan **string HTML** (kontrak dari versi awal dipertahankan) → risiko regresi minimal |
| 2 | **CSS menumpuk di satu file** sulit dikelola | CSS **terpecah per komponen/fitur** + `injectStyle()` idempotent (Set anti-duplikat) → hanya dimuat saat dibutuhkan |
| 3 | **Konfigurasi tersebar** (string literal di banyak file) | **Konfigurasi terpusat** di `js/core/config.js` (storage keys, path data, limit, tier, poin) |
| 4 | **Sinkronisasi data forum** antara data global & simpanan pengguna | Layout service memakai metode **CRUD lokal** (dataStore + localStorage) dengan event delegation |
| 5 | **Cookies/timer duel** bisa terus berjalan saat pindah halaman | **Cleanup timer** (`clearInterval`/`clearTimeout`) di event `pageChanged` saat bukan halaman match |
| 6 | **Event ganda pada halaman FAQ** (double-bind) | Aman karena modul di-import **sekali**; dicatat untuk di-refactor bila dibutuhkan |
| 7 | **Data statis di JSON** belum bisa dipakai produksi | Arsitektur **siap migrasi JSON → API** — cukup ubah `CONFIG.DATA_PATHS` & `preloadData` |
| 8 | **CSS dinamis `<link>` belum di-minify** | Dianjurkan **digabung & minify** saat build produksi |
| 9 | **Cocokkan lawan seimbang di Arena** | Bot lawan dibuat adaptif mengikuti **tier & rating pengguna** (akurasi 45–93%) |
| 10 | **Validasi input pengguna** (form, modal, komentar) | Validasi sisi klien + **escaping HTML** untuk mencegah input berbahaya |

> 💡 **Visual slide:** Tabel dua kolom "Tantangan → Solusi". Pilih 4-5 poin paling kuat untuk tiap slide agar tidak terlalu padat.

---

# 8. Hasil / Output Akhir

## Pencapaian & Deliverable Project

### Deliverable Utama
- **Aplikasi Edquest SPA** berjalan penuh di browser — tanpa build step, bisa dijalankan dari statis hosting
- **7 halaman fungsional** (Home, Forum, Friend, Arena, About, FAQ, Profile) + Settings
- **7 file data JSON** — konten terpusat, mudah diperbarui tanpa menyentuh kode
- **8 service modular** — autentikasi, forum, buddy, match, profil, notifikasi, settings, tema

### Verifikasi & Testing
- Semua rute ter-render **tanpa console error** (diuji headless Chromium)
- Tes interaksi via CDP **lolos**: 
  - Registrasi/login + persistensi sesi ✅
  - Pencarian forum & buka thread ✅
  - Filter kategori & Study Buddy ✅
  - Jurnal (+5 poin) ✅
  - Buat thread & kirim komentar ✅
  - Duel Arena (classic & ranked) ✅
  - Notifikasi push/tandai dibaca ✅
  - Modal tutup dengan Escape, accordion FAQ, form kontak ✅

### Skala Konten (Mockup)
- **107 soal** latihan · **8 thread** forum · **8 buddy** · **10 peserta** leaderboard · **7 kategori** mapel · **5 tier** · **7 badge**

### Dokumentasi
- `README.md` (konsep & produk), `flow.md` (alur aplikasi), `structure.md` (arsitektur), `conclusion.md` (keputusan desain)

> 💡 **Visual slide:** Checklist "Sudah Berjalan" dengan ikon centang hijau. Slide kedua: diagram struktur folder final agar audiens non-teknis melihat kerapian arsitektur.

---

# 9. Kesimpulan

- **Edquest** menjawab masalah nyata siswa: *ragu bertanya, belajar sendiri berat, dan kurangnya ruang tumbuh yang aman*
- Bukan sekadar platform materi — Edquest **menumbuhkan keberanian**: berani bertanya, berani mengakui ketidaktahuan, berani berbagi ilmu
- Dibangun rapi dengan **arsitektur modular Vanilla JS** (core/services/data/components/features) yang mudah dikembangkan
- Fitur utama terbukti berjalan: **Forum + Study Buddy + Arena Duel + Progress Journal + gamifikasi + notifikasi**
- Sesuai misi dasar: *"Setiap siswa punya potensi, dan tidak ada yang merasa paling pintar — semua orang di sini sama-sama belajar"*

> *"Keberanian untuk bertanya adalah awal dari semua pengetahuan."*
> — Semua siswa berhak belajar tanpa rasa takut

> 💡 **Visual slide:** Kutipan besar di tengah slide dengan latar gradien biru, logo Edquest, satu kalimat tagline penutup.

---

# 10. Rencana Selanjutnya

## Langkah Lanjutan (Roadmap)

### Jangka Pendek
- **Migrasi data JSON → API server** — basis data sungguhan (pengguna, thread, skor)
- **Build & minify produksi** — gabungkan CSS per modul, kurangi ukuran halaman
- **Search fuzzy / scoring** — hasil pencarian lebih relevan (judul > tag > deskripsi)

### Jangka Menengah
- **Chat real-time & DM** antar pengguna (saat ini simulasi/placeholder)
- **Forum private & approval** untuk diskusi kelompok kecil
- **Sinkronisasi multi-perangkat** (backend akun)

### Jangka Panjang
- **Grup belajar** & fitur sosial tambahan (follow, block, mutual)
- **Ekspansi bank soal** lintas jenjang & kurikulum
- **Rekomendasi konten personal** berdasarkan minat & riwayat belajar

> 💡 **Visual slide:** Timeline roadmap horizontal (Near Term / Mid Term / Long Term) dengan ikon per tahap.