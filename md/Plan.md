# Plan

> Cara menambah halaman baru, komponen baru, mendaftarkan route, MD update rule, dan delivery checklist. Sumber kebenaran tertinggi adalah `CONCLUSION.md` — file ini hanya memisahkan bagian tata kerja dari index.

---
## 1. Tambah Modul Baru

Gunakan `tools/newModule.sh` untuk scaffold otomatis:

```bash
./tools/newModule.sh <module-name> [child1 child2 ...]
# Contoh: ./tools/newModule.sh profile edit settings
```

Script ini akan:
- Membuat folder + boilerplate entry point, CSS, JSON
- Auto-register routes di `core/router.js`
- Auto-add DATA_PATHS entry di `core/config.js`

Untuk modul tanpa child:
```txt
src/modules/[nama]/
├── [nama].js        ← export async function NamaPage()
├── [nama].css
├── [nama].json      ← hanya jika data spesifik modul ini
├── components/
└── services/
```

Untuk modul dengan child:
```txt
src/modules/[nama]/
├── [nama].js
├── [nama].css
├── [nama].json
├── components/
├── services/
└── [child]/
    ├── page.js      ← export async function ChildPage()
    ├── page.css
    └── page.json
```

### 2. (Jika manual) Entry Point

```js
import { fetchData } from '../../shared/js/utils/api.js';
import { injectStyle } from '../../shared/js/utils/styleLoader.js';

export async function ModuleName() {
  injectStyle('/src/modules/[nama]/[nama].css');
  const container = document.createElement('div');
  container.innerHTML = '<div class="loading">Loading...</div>';
  try {
    const data = await fetchData('/src/modules/[nama]/[nama].json');
    container.replaceChildren(/* render data */);
  } catch {
    container.innerHTML = '<div class="error">Failed to load.</div>';
  }
  return container;
}
```

### 3. Daftarkan ke Router

```js
// core/router.js
import { ModuleName } from '../src/modules/[nama]/[nama].js';

const routes = {
  '/[nama]': ModuleName,
};
```

### 4. Tambahkan Link Navigasi

```html
<a href="/[nama]" data-link>[Label]</a>
```

---

## 5. Contoh Implementasi Modul Profil

Untuk halaman profil baru, langkah yang disarankan:

1. Buat modul `profile` dengan entry `src/modules/profile/profile.js`
2. Tambahkan data spesifik di `src/modules/profile/profile.json`
3. Daftarkan rute `/profile` di `core/router.js`
4. Tambahkan link navigasi ke navbar atau top bar
5. Update dokumen di `md/` sesuai perubahan modul baru

Contoh ringkas:

```txt
src/modules/profile/
├── profile.js
├── profile.css
└── profile.json
```

---

## 6. Hapus Modul

Gunakan `tools/deleteModule.sh` untuk membersihkan modul beserta semua referensinya secara otomatis:

```bash
./tools/deleteModule.sh <module-name>
# Contoh: ./tools/deleteModule.sh profile
```

Script ini akan:
- Menghapus seluruh folder `src/modules/<module>/` (termasuk semua child page)
- Menghapus import + route entry dari `core/router.js` (cocok berdasarkan nama fungsi, jadi override path manual seperti `'/'` tetap terbersihkan)
- Menghapus entry `DATA_PATHS.<MODULE>` dari `core/config.js`
- Menjalankan pengecekan grep akhir dan memperingatkan jika ada referensi tersisa

Child page ditemukan otomatis dari filesystem — tidak perlu dilewatkan sebagai argumen. Script meminta konfirmasi `y/N` sebelum menghapus; `components/` dan `services/` dikecualikan dari penemuan child.

---

## MD Update Rule

Setiap response yang membuat modul baru, halaman, komponen, utility, atau perubahan arsitektur HARUS juga mengupdate bagian yang relevan di `md/`. Jangan deliver perubahan kode tanpa update dokumentasi.

---

## Delivery Checklist

Sebelum mengeluarkan kode, verifikasi:

- [ ] Import paths mengikuti aturan dependency direction
- [ ] Tidak ada hardcoded values yang seharusnya di `config.js`
- [ ] Setiap async function punya error handling
- [ ] CSS tetap dalam batas line limits
- [ ] Tidak ada module logic yang bocor ke `shared/components/`
- [ ] Tidak ada shared logic yang terkubur di dalam satu module
- [ ] `CONCLUSION.md` dan file `md/` terkait diupdate jika arsitektur berubah
- [ ] Tidak ada framework atau build tool yang diperkenalkan
