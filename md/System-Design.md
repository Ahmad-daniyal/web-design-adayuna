# System Design

> Struktur folder, komponen, pengelompokan modul, dan sistem 4 lapis `src/shared/js/`. Sumber kebenaran tertinggi adalah `CONCLUSION.md` — file ini hanya memisahkan bagian arsitektur dari index.

---

## Struktur Folder

```txt
project-root/
├── AGENTS.md                     # Panduan untuk AI agent
├── index.html                    # Entry point — window.BASE, theme FOUC guard, Bootstrap Icons
├── package.json
├── .gitignore
├── LICENSE
├── README.md
├── core/                         # Bootstrap & infrastruktur inti aplikasi
│   ├── config.js                 # Named exports: STORAGE_KEYS, DATA_PATHS, CSS_PATHS, LIMITS, dll
│   ├── main.js                   # Bootstrap: mount layout sequential, normalize hash, init router
│   ├── router.js                 # Static imports, route table, auth guard, route-change event
│   └── theme.js                  # get/set/toggle/init theme, dispatch theme-change event
├── md/                           # Dokumentasi proyek
│   ├── CONCLUSION.md             # Index + meta rules (file ini)
│   ├── Context.md                # Data JSON, routing, config, aturan penting
│   ├── Design.md                 # CSS rules, library yang diizinkan
│   ├── Plan.md                   # Cara kerja coding ke depan
│   ├── SKILLS.md                 # Skill & konvensi tim
│   └── System-Design.md          # Struktur folder, komponen, arsitektur (file ini)
├── public/                       # Static assets yang di-serve langsung
│   └── data/                     # Shared JSON — dipakai 2+ modul
├── tools/
│   └── newModule.sh              # CLI helper untuk scaffold modul baru + auto-wire routing
└── src/
    ├── assets/                   # Static assets (favicon, logo, gambar)
    ├── modules/                  # Satu folder per modul — flat, max 1 level sub-halaman
    │   ├── home/                 # Halaman default landing
    │   │   ├── home.js           # Entry point — fetchData, injectStyle
    │   │   ├── home.css
    │   │   ├── home.json
    │   │   ├── components/       # Komponen spesifik modul home
    │   │   └── services/         # Service spesifik modul home
    │   └── [module-name]/
    │       ├── [module].js       # Entry — export async function ModuleName()
    │       ├── [module].css
    │       ├── [module].json     # Hanya jika data spesifik modul ini
    │       ├── components/
    │       ├── services/
    │       └── [child]/          # Sub-halaman (max 1 level)
    │           ├── page.js       # Entry — export async function ChildName()
    │           ├── page.css
    │           ├── page.json
    │           ├── components/
    │           └── services/
    └── shared/                   # Shared — tidak spesifik modul
        ├── components/           # Komponen yang dipakai oleh 2+ modul
        │   ├── layout/           # Komponen struktur halaman (mount sekali di main.js)
        │   │   ├── navbar/
        │   │   │   ├── navbar.js # Navigasi desktop — data-link, route-change listener
        │   │   │   └── navbar.css
        │   │   ├── footer/
        │   │   │   ├── footer.js # Footer — route-change listener untuk visibility
        │   │   │   └── footer.css
        │   │   ├── top-bar/
        │   │   │   ├── top-bar.js# Navigasi mobile — top bar
        │   │   │   └── top-bar.css
        │   │   └── bottom-bar/
        │   │       ├── bottom-bar.js # Navigasi mobile — bottom tab bar
        │   │       └── bottom-bar.css
        │   ├── ui/               # Komponen UI reusable (stateless, data-driven)
        │   └── shared/           # Komponen shared dengan logic ringan
        └── js/
            ├── data/             # Data-access layer — fetch & cache eksternal
            ├── services/         # Singleton stateful — state & business logic
            └── utils/            # Pure functions — tidak ada state, tidak ada side effect
                ├── url.js        # getHashPath, getHashParams, navigateTo, asset (BASE-aware)
                ├── api.js        # fetchData — prepend window.BASE otomatis
                ├── styleLoader.js# injectStyle — dedup via Set, prepend window.BASE
                ├── dom.js        # qs, qsa, createElement, empty helpers
                └── format.js     # timeAgo, formatDate, formatTime, escapeHtml
```

---

## Organisasi `src/shared/components/`

Setiap komponen memiliki subfolder sendiri berisi `[name].js` dan `[name].css` — pola subfolder ini memudahkan penambahan file partial tanpa mengganggu komponen lain.

### Tiga Kategori

| Folder | Isi | Ciri khas |
|---|---|---|
| `shared/components/layout/` | navbar, top-bar, bottom-bar, footer | Di-mount sekali di `core/main.js`, tidak pernah di-render ulang |
| `shared/components/ui/` | card, form-field, avatar | Stateless, menerima data sebagai parameter |
| `shared/components/shared/` | page-header, interest-recommendations | Boleh punya state ringan, dipakai 2+ modul |

### Kapan Membuat Komponen Baru

- Dipakai oleh **2+ modul yang berbeda** → buat di `src/shared/components/` (kategori yang sesuai)
- Hanya dipakai **1 modul** → simpan di dalam `src/modules/[module]/components/`
- Ada **3+ komponen spesifik modul** → tempatkan di `components/` dalam folder modul tersebut

---

## Konvensi Struktur Modul

### Prinsip

Setiap modul adalah folder flat di `src/modules/`. Modul boleh memiliki sub-halaman, tapi **maksimal 1 level** — tidak boleh ada sub-halaman di dalam sub-halaman.

| Kondisi | Pola |
|---|---|
| Modul tanpa sub-halaman | `src/modules/[module]/` — entry `[module].js` |
| Modul dengan sub-halaman | `src/modules/[module]/[child]/` — entry `page.js` |
| Sub-halaman dalam sub-halaman | ❌ DILARANG |

### Contoh Struktur yang Benar

```txt
# BENAR — modul tanpa sub-halaman
src/modules/about/
├── about.js
├── about.css
├── about.json
├── components/
└── services/

# BENAR — modul dengan sub-halaman (1 level)
src/modules/profile/
├── profile.js          ← /profile
├── profile.css
├── profile.json
├── components/
├── services/
├── edit/               ← /profile/edit
│   ├── page.js
│   ├── page.css
│   └── page.json
└── settings/           ← /profile/settings
    ├── page.js
    ├── page.css
    └── page.json
```

### Contoh yang Salah

```txt
# SALAH — sub-halaman di dalam sub-halaman (2 level)
src/modules/profile/edit/avatar/crop/page.js   ← max 1 level!

# SALAH — modul di dalam modul lain
src/modules/admin/profile/profile.js           ← harus flat
```

---

## Organisasi `src/shared/js/`

### Empat Lapisan

| Folder | Isi | Boleh import dari |
|---|---|---|
| `core/` | Bootstrap & infrastruktur (main, router, theme) | shared/js/utils, shared/js/services |
| `src/shared/js/services/` | Singleton stateful — auth, state, business logic | shared/js/utils, shared/js/data |
| `src/shared/js/data/` | Data-access layer — fetch & cache ke sumber eksternal | shared/js/utils |
| `src/shared/js/utils/` | Pure functions — tidak ada state, tidak ada side effect | — (tidak boleh import dari layer lain) |

### Aturan Dependency

- `shared/js/utils/` tidak boleh mengimport dari `services/`, `data/`, atau `core/`
- `shared/js/data/` hanya boleh mengimport dari `shared/js/utils/`
- `shared/js/services/` boleh mengimport dari `shared/js/utils/` dan `shared/js/data/`
- `core/` boleh mengimport dari semua layer
- `src/modules/*/` boleh mengimport dari `core/` dan semua lapisan `src/shared/js/`
- `src/shared/components/` hanya boleh mengimport dari `src/shared/js/`, tidak dari `src/modules/`
