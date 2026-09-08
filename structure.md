# Struktur Penulisan Program Web

Panduan arsitektur universal untuk membangun aplikasi web modern — berlaku untuk vanilla JS, React, Vue, Svelte, atau framework lainnya.

---

## 1. Arsitektur Umum

Setiap aplikasi web modern pada dasarnya punya **5 concern utama**:

```
┌─────────────────────────────────────────────┐
│                   VIEW                      │
│         Komponen UI & Halaman               │
├─────────────┬───────────────┬───────────────┤
│   ROUTING   │     STATE     │    SERVICES   │
│  Navigasi   │  Data Global  │  Logika Bisnis │
├─────────────┴───────────────┴───────────────┤
│                  DATA LAYER                 │
│         Fetching, Storage, Cache            │
├─────────────────────────────────────────────┤
│               INFRASTRUCTURE               │
│    Config, Utils, Theme, Build Tool         │
└─────────────────────────────────────────────┘
```

| Concern | Tanggung Jawab | Contoh |
|---|---|---|
| **Routing** | Menentukan halaman mana yang ditampilkan | React Router, Vue Router, Hash Router |
| **State** | Menyimpan data global yang dibutuhkan banyak komponen | Redux, Pinia, Vuex, Zustand, module pattern |
| **Services** | Logika bisnis, API calls, manipulasi data | authService, forumService, apiClient |
| **View** | Komponen UI dan halaman yang dirender ke DOM | Komponen, page, layout |
| **Infrastructure** | Konfigurasi, utilitas, theme, tooling | config.js, theme.js, constants |

---

## 2. Direktori Standar

Template folder yang bisa diadaptasi ke proyek apapun:

```
project/
├── src/
│   ├── core/                   # Bootstrap & infrastruktur
│   │   ├── main.js             # Entry point, inisialisasi
│   │   ├── router.js           # Routing logic
│   │   ├── app.js              # Global event bindings
│   │   ├── config.js           # Konstanta & konfigurasi
│   │   └── theme.js            # Tema & styling global
│   │
│   ├── services/               # Logika bisnis & state management
│   │   ├── auth.js             # Autentikasi
│   │   ├── api.js              # HTTP client
│   │   └── [feature].js        # Service per domain bisnis
│   │
│   ├── data/                   # Data fetching & central store
│   │   ├── index.js            # DataStore (centralized state)
│   │   ├── api/                # API endpoint definitions
│   │   └── *.json              # Static data (jika ada)
│   │
│   ├── components/             # Komponen reusable (UI building blocks)
│   │   ├── layout/             # Struktur halaman
│   │   │   ├── navbar/
│   │   │   ├── sidebar/
│   │   │   └── footer/
│   │   └── ui/                 # Komponen atomic
│   │       ├── button/
│   │       ├── modal/
│   │       └── card/
│   │
│   ├── features/               # Halaman / modul per fitur
│   │   ├── home/
│   │   ├── profile/
│   │   └── [fitur]/
│   │
│   ├── utils/                  # Fungsi helper murni
│   │   ├── styleLoader.js
│   │   ├── formatters.js
│   │   └── validators.js
│   │
│   └── assets/                 # Gambar, font, file statis
│       ├── images/
│       └── fonts/
│
├── public/                     # File yang diakses langsung
│   └── index.html
│
├── styles/                     # CSS global & variables
│   └── global.css
│
├── package.json
└── [build config]
```

### Prinsip Penamaan Folder

| Folder | Isi | Prinsip |
|---|---|---|
| `core/` | Bootstrap, routing, config | **Sedikit file**, stabil, jarang diubah |
| `services/` | Logika bisnis, state | **Satu file per domain** (auth, forum, buddy) |
| `components/` | UI reusable | **Bisa dipakai lintas halaman** |
| `features/` | Halaman / modul | **Satu folder per halaman**, berisi render + logic + style |
| `utils/` | Fungsi murni | **No side effects**, pure functions |
| `data/` | Data layer | **Satu titik akses** untuk semua data |

---

## 3. Separation of Concern

### 3.1 Core (Infrastructure)

File-file yang menjalankan aplikasi. **Jarang diubah**, hanya saat menambah fitur structural.

```
core/
├── main.js       → Entry point: init semua modul, export ke window/global
├── router.js     → Routing: hash change → render halaman → update UI
├── app.js        → Global event: search, dark mode, keyboard shortcuts
├── config.js     → Konstanta: storage keys, URL, limits
└── theme.js      → Tema: light/dark toggle, CSS variables
```

**Konvensi:**
- `main.js` adalah **satu-satunya** file yang di-import oleh HTML/build entry
- Setiap modul di `core/` di-export sebagai **singleton** (IIFE pattern / class instance)
- Jangan mengimpor dari `features/` atau `components/` di dalam `core/`

### 3.2 Services (Business Logic & State)

Logika bisnis yang **tidak terikat ke UI tertentu**. Bisa di-test secara terpisah.

```
services/
├── auth.js         → Login, register, session, user management
├── forum.js        → CRUD threads, filter, komentar
├── buddy.js        → Matching logic, filter calon buddy
├── profile.js      → Profil user, jurnal, poin
└── settings.js     → Pengaturan user, modal settings
```

**Konvensi:**
- Setiap service export **satu objek/instance** dengan method-method terkait
- Service boleh mengimpor dari `core/config.js` dan `data/`
- Service **tidak boleh** mengimpor dari `components/` atau `features/`
- State yang dibagikan antar service simpan di `data/` (central store)

### 3.3 Features (Halaman)

Satu folder = satu halaman/fitur. Berisi **semua yang dibutuhkan** halaman itu.

```
features/forum/
├── forum.js        → renderForum(), fungsi terkait forum
├── css/
│   └── forum.css   → Style khusus halaman forum
└── forum.json      → Data statis (opsional)
```

**Konvensi:**
- File utama export **render function** yang mengembalikan HTML string (vanilla) atau komponen (framework)
- CSS dimuat secara **lazy** via `injectStyle()` atau framework import
- Feature **boleh** mengimpor dari `services/`, `data/`, `utils/`, `core/config.js`
- Feature **tidak boleh** mengimpor dari feature lain secara langsung

### 3.4 Components (Reusable UI)

Komponen yang **dipakai di banyak halaman**.

```
components/
├── layout/                  # Struktur halaman (selalu tampil)
│   ├── navbar/
│   ├── sidebar/
│   └── footer/
└── ui/                      # Komponen atomic (dipakai sesuai kebutuhan)
    ├── auth-modal/
    ├── toast/
    └── card/
```

**Konvensi:**
- Setiap komponen = **satu folder** berisi `nama.js` + `css/nama.css`
- Komponen export **render function** yang mengembalikan HTML
- Komponen **tidak boleh** mengimpor dari `services/` atau `features/`
- Komponen berinteraksi ke parent lewat **event delegation** (onclick, data-action)

### 3.5 Utils (Pure Functions)

Fungsi-fungsi helper murni tanpa side effects.

```
utils/
├── styleLoader.js    → injectStyle(path) — lazy load CSS file
├── formatters.js     → formatDate(), formatCurrency()
├── validators.js     → validateEmail(), validatePassword()
└── url.js            → getHashPath(), navigate()
```

**Konvensi:**
- **Satu fungsi = satu tanggung jawab**
- Tidak boleh mengimpor dari layer manapun kecuali `core/config.js`
- Tidak boleh memodifikasi DOM atau state global

---

## 4. Routing

### Pola Universal

```
User navigasi (klik link / URL berubah)
        │
        ▼
Router deteksi perubahan
        │
        ▼
Resolusi path → matching halaman
        │
        ▼
Render halaman baru ke DOM
        │
        ▼
Dispatch event (pageChanged)
        │
        ▼
Services/Features re-init sesuai halaman
```

### Implementasi per Framework

| Framework | Pola Routing | Mekanisme |
|---|---|---|
| Vanilla JS | Hash routing (`#/page`) | `hashchange` event → render function |
| React | React Router | `<Route>` → component render |
| Vue | Vue Router | `router-view` → dynamic component |
| Svelte | SvelteKit / file-based | File system = route |
| Any SPA | History API | `pushState` + `popstate` event |

### Route Table Pattern

```javascript
// Konsep universal — semua framework pada dasarnya melakukan ini
const routes = {
  '/':        renderHome,      // Halaman utama
  'forum':    renderForum,     // Halaman forum
  'profile':  renderProfile,   // Halaman profil
  'about':    renderAbout,     // Halaman tentang
  // ...tambah sesuai kebutuhan
};
```

---

## 5. State Management

### Pola Centralized Store

Semua data global disimpan di **satu tempat** supaya mudah diakses dan di-debug.

```
                    ┌──────────────┐
                    │   dataStore   │
                    │  (Central)    │
                    └──────┬───────┘
                           │
          ┌────────────────┼────────────────┐
          │                │                │
     ┌────▼────┐     ┌────▼────┐     ┌────▼────┐
     │  Forum   │     │  Buddy  │     │ Profile │
     │  Service │     │ Service │     │ Service │
     └────┬────┘     └────┬────┘     └────┬────┘
          │                │                │
     ┌────▼────┐     ┌────▼────┐     ┌────▼────┐
     │ Forum   │     │ Buddy   │     │ Profile │
     │ Feature │     │ Feature │     │ Feature │
     └─────────┘     └─────────┘     └─────────┘
```

### Contoh Central Store (Universal)

```javascript
// Pola ini bisa dipakai di vanilla, atau disesuaikan ke Redux/Pinia/dll
const dataStore = {
  forum: [],          // Thread forum
  buddies: [],        // Data study buddy
  home: null,         // Data halaman home
  questions: [],      // Pertanyaan quiz
  leaderboard: []     // Papan peringkat
};

// Fetch & isi data
async function preloadData() {
  await Promise.all([
    fetch('data/forum.json').then(r => r.json()).then(d => dataStore.forum = d),
    fetch('data/buddies.json').then(r => r.json()).then(d => dataStore.buddies = d),
    // ...
  ]);
}
```

### Persistensi Data

| Media | Kapan Dipakai | Contoh |
|---|---|---|
| **localStorage** | Data bertahan lama (sesi user, preferensi) | `edquest_user`, `edquest_dark` |
| **sessionStorage** | Data sementara (satu tab, satu sesi) | Login "remember me" unchecked |
| **IndexedDB** | Data besar (cache offline, riwayat) | Cache gambar, dokumen |
| **Server/DB** | Data production (akun, postingan) | API backend |

---

## 6. Data Flow

### Siklus Universal

```
  ┌──────────────────────────────────────────────┐
  │                                              │
  ▼                                              │
FETCH ──► STORE ──► RENDER ──► EVENT ──► UPDATE ──┘
(data)   (state)    (DOM)     (user)    (state)
```

| Tahap | Apa yang Terjadi | Contoh |
|---|---|---|
| **Fetch** | Ambil data dari JSON/API/server | `fetch('data/forum.json')` |
| **Store** | Simpan ke central state | `dataStore.forum = result` |
| **Render** | Tampilkan data ke DOM | `renderForum()` return HTML |
| **Event** | User berinteraksi | Klik tombol, submit form |
| **Update** | Ubah state & re-render | `Forum.refresh()` → re-render |

### Unidirectional Flow

```
User Action (click, type, submit)
        │
        ▼
Event Handler (delegated or direct)
        │
        ▼
Service Method (business logic)
        │
        ▼
State Update (dataStore / localStorage)
        │
        ▼
Re-render (view update)
        │
        ▼
User sees updated UI
```

---

## 7. Component/Module Pattern

### Render Function Pattern

Setiap komponen/halaman mengekspor **fungsi render** yang mengembalikan string HTML.

```javascript
// Konsep universal — semua framework pada dasarnya merender HTML

// Vanilla JS
export function renderForum() {
  return `
    <section>
      <h1>Forum</h1>
      <div id="threadList"></div>
    </section>
  `;
}

// React (konsep sama, sintaks berbeda)
function Forum() {
  return (
    <section>
      <h1>Forum</h1>
      <ThreadList />
    </section>
  );
}

// Vue (konsep sama, sintaks berbeda)
// <template>
//   <section>
//     <h1>Forum</h1>
//     <ThreadList />
//   </section>
// </template>
```

### Event Delegation Pattern

Alih-alih bind event ke setiap elemen, tangkap di **parent** dan filter.

```javascript
// Pola ini universal — bekerja di semua framework
document.addEventListener('click', (e) => {
  // Tangkap semua klik di document
  const loginBtn = e.target.closest('[data-action="login"]');
  if (loginBtn) handleLogin();

  const deleteBtn = e.target.closest('[data-action="delete"]');
  if (deleteBtn) handleDelete(deleteBtn.dataset.id);
});
```

### Module Singleton Pattern

```javascript
// IIFE → satu instance untuk seluruh aplikasi
export const Forum = (() => {
  let threads = [];

  function init() { /* ... */ }
  function refresh() { /* ... */ }
  function openThread(id) { /* ... */ }

  return { init, refresh, openThread };
})();
```

---

## 8. Styling Convention

### Layer CSS

```
┌─────────────────────────────────────┐
│         GLOBAL / BASE               │
│   Reset, variables, typography      │
│   (global.css / :root)              │
├─────────────────────────────────────┤
│       COMPONENT-LEVEL CSS           │
│   Navbar, sidebar, modal, button    │
│   (components/*/css/*.css)          │
├─────────────────────────────────────┤
│       FEATURE-LEVEL CSS             │
│   Forum, profile, home, match       │
│   (features/*/css/*.css)            │
├─────────────────────────────────────┤
│       UTILITY CLASSES               │
│   Tailwind, helper classes          │
│   (CDN atau build output)           │
└─────────────────────────────────────┘
```

### CSS Variables (Theming Universal)

```css
:root {
  --bg-body: #ffffff;
  --text-primary: #1a1a2e;
  --text-secondary: #64748b;
  --primary: #6366f1;
  --border-color: #e2e8f0;
  --shadow-sm: 0 1px 3px rgba(0,0,0,0.06);
}

.dark {
  --bg-body: #0f172a;
  --text-primary: #f1f5f9;
  --text-secondary: #94a3b8;
  --border-color: #1e293b;
  --shadow-sm: 0 1px 3px rgba(0,0,0,0.3);
}
```

### Lazy Loading CSS

```javascript
// Load CSS hanya saat komponen/fitur pertama kali dipakai
const injected = new Set();

export function injectStyle(path) {
  if (injected.has(path)) return;
  injected.add(path);
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = path;
  document.head.appendChild(link);
}
```

---

## 9. Convention Table

Aturan penamaan dan organisasi yang bisa disesuaikan per proyek:

| Aspek | Konvensi | Contoh |
|---|---|---|
| **File JS** | `camelCase.js` | `auth.js`, `styleLoader.js` |
| **Folder** | `lowercase` | `features/`, `components/` |
| **CSS** | `nama-komponen.css` | `navbar.css`, `forum.css` |
| **Export** | Named export (bukan default) | `export const Auth = ...` |
| **Import** | Relative path dari file saat ini | `import { CONFIG } from '../core/config.js'` |
| **Event binding** | `data-action` attribute atau `onclick` | `data-action="login"`, `onclick="Forum.openThread()"` |
| **Storage key** | `prefix_nama` | `edquest_user`, `edquest_dark` |
| **HTML ID** | `camelCase` | `threadList`, `searchInput`, `authModal` |
| **JSON key** | `snake_case` atau `camelCase` | `thread_count`, `matchStats` |
| **Render function** | `renderNamaFitur()` | `renderForum()`, `renderNavbar()` |
| **Service object** | `NamaService` (singleton) | `Auth`, `Forum`, `Matching` |
| **Config** | `UPPER_SNAKE_CASE` | `STORAGE_KEYS`, `DATA_PATHS` |

---

## 10. Template Checklist

Checklist untuk memulai proyek baru dengan struktur ini:

### Setup Awal
- [ ] Buat folder structure sesuai **Bagian 2**
- [ ] Siapkan `index.html` dengan slot mounting (`#app`, `#navbar-slot`, dll)
- [ ] Buat `core/config.js` — definisikan semua konstanta (storage keys, URLs, limits)
- [ ] Buat `core/main.js` — entry point, import & init semua modul
- [ ] Buat `styles/global.css` — CSS reset, variables, base typography

### Core Layer
- [ ] Buat `core/router.js` — hash/history routing + route table
- [ ] Buat `core/app.js` — global event bindings (search, theme, keyboard shortcuts)
- [ ] Buat `core/theme.js` — dark/light mode toggle
- [ ] Setup `main.js`: init theme → preload data → init router → init app → init auth

### Data Layer
- [ ] Buat `data/index.js` — central `dataStore` object
- [ ] Buat `data/index.js` — `preloadData()` function (parallel fetch)
- [ ] Siapkan file JSON untuk data statis
- [ ] Setup localStorage/sessionStorage keys di config

### Services Layer
- [ ] Buat `services/auth.js` — login, register, session, user CRUD
- [ ] Buat service lain sesuai domain bisnis (forum, buddy, dll)
- [ ] Setiap service export **satu singleton object**
- [ ] Service hanya import dari `core/` dan `data/`

### Components
- [ ] Buat layout components: `navbar/`, `sidebar/`, `footer/`
- [ ] Buat UI components: `modal/`, `toast/`, `button/` (sesuai kebutuhan)
- [ ] Setiap komponen punya folder sendiri: `nama.js` + `css/nama.css`
- [ ] Gunakan `injectStyle()` untuk lazy load CSS

### Features
- [ ] Buat folder per halaman di `features/`
- [ ] Setiap feature export render function
- [ ] Feature import dari services, data, utils — bukan dari feature lain
- [ ] Setup CSS per feature di `features/*/css/`

### Final
- [ ] Pastikan tidak ada circular imports
- [ ] Pastikan services tidak import dari views
- [ ] Pastikan components tidak import dari services
- [ ] Test routing: setiap hash mengarah ke halaman yang benar
- [ ] Test state: data persist di localStorage sesuai harapan
- [ ] Run lint & typecheck

---

*Struktur ini dirancang agar **universal** — ambil filosofinya, sesuaikan implementasinya dengan framework pilihanmu.*
