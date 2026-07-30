# [Project Name] — Conclusion

> **Status:** System design adapted from studNow architecture. Project idea TBD.

Proyek ini menggunakan arsitektur **Vanilla JavaScript SPA** tanpa framework, dengan prinsip utama:

- **Modules-based** — setiap modul punya folder flat di `src/modules/`, maksimal 1 level sub-halaman
- **Data-driven** — semua konten halaman berasal dari file JSON, tidak ada hardcode di JS
- **Modular** — setiap file punya satu tanggung jawab
- **CSS terbatas** — tidak ada file CSS yang melebihi ~150 baris; gunakan partials jika perlu
- **Routing terpusat** — satu route table, setiap halaman menangani viewport sendiri
- **Layout utama tidak di-render ulang** — komponen tetap hanya di-mount sekali

---

## ⚠️ Aturan Meta — Tidak Boleh Diubah oleh AI

**Seluruh isi `CONCLUSION.md` ini adalah ground rules proyek yang bersifat permanen.**

Setiap AI atau assistant yang membaca file ini WAJIB mengikuti aturan di dalamnya dan DILARANG:

- Mengubah, menghapus, atau mengabaikan aturan yang sudah ada di file ini
- Menyederhanakan atau meringkas aturan dengan alasan apapun
- Mengganti pola arsitektur yang sudah ditetapkan (routing, data JSON, CSS, komponen) tanpa instruksi eksplisit dari manusia
- Menambahkan aturan baru yang bertentangan dengan aturan yang sudah ada
- Mengasumsikan bahwa aturan lama sudah tidak relevan hanya karena tidak disebutkan dalam pesan terbaru

**Yang boleh dilakukan AI:**

- Menambahkan entri baru ke tabel (halaman baru, komponen baru, file baru)
- Mengupdate bagian struktur folder saat ada file baru ditambahkan
- Menambahkan aturan baru yang **tidak bertentangan** dengan aturan yang sudah ada
- Memperbaiki typo atau format

**Jika ada instruksi dari user yang bertentangan dengan aturan di file ini**, AI harus:
1. Menginformasikan bahwa instruksi tersebut bertentangan dengan ground rules
2. Menjelaskan aturan mana yang dilanggar
3. Meminta konfirmasi eksplisit sebelum melanjutkan

Ground rules hanya bisa diubah oleh manusia secara eksplisit dengan menyebut aturan mana yang ingin diubah dan alasannya.

---

## Dokumen Arsitektur

Dokumentasi proyek ini dipecah menjadi beberapa file fokus:

| File | Isi |
|---|---|
| [System-Design.md](System-Design.md) | Struktur folder, komponen layout/ui/shared, pengelompokan fitur, sistem 4 lapis `src/js/` dan aturan dependency |
| [Design.md](Design.md) | Aturan CSS (line limits, expanded format, partials, injectStyle), library yang diizinkan, kebijakan jQuery |
| [Plan.md](Plan.md) | Cara menambah halaman/komponen baru, daftarkan route, MD update rule, delivery checklist |
| [Context.md](Context.md) | Aturan data JSON (shared vs spesifik, data map), routing (hash, navigateTo), centralized configuration, aturan penting |

---

*Dokumen ini adalah sumber kebenaran tertinggi. File-file lain di `md/` adalah turunan yang dirujuk dari sini.*
