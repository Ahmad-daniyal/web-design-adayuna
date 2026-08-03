# Alur Aplikasi Edquest

Alur kerja aplikasi dari halaman dibuka sampai interaksi utama.

## 1. Bootstrapping

```
index.html
  └─ css/global.css            (tema light/dark, base)
  └─ js/core/main.js (module entry)
       ├─ initTheme()          → class .dark di <html> (cegah flash)
       ├─ bridge window        → Auth, Settings, Forum, Matching, App, Router
       ├─ await preloadData()  → fetch data/forum.json + data/buddies.json
       │                        + features/home/home.json → dataStore
       ├─ Router.init()        → mount navbar/sidebar/footer/auth-modal
       │                        ke slot di index.html, lalu handleRoute()
       ├─ App.init()           → bind event UI global (search, dark mode,
       │                        focus mode, dropdown, dsb.)
       └─ Auth.init()          → restore sesi dari localStorage/sessionStorage
```

## 2. Routing

```
hash change → Router.handleRoute()
   ├─ path = hash minus '/'
   ├─ render = routes[path] ?? renderHome
   ├─ render() dipanggil → isi #app (kembalikan string HTML)
   ├─ updateNavActive(pageName) → highlight link aktif
   ├─ window.scrollTo(top)
   └─ dispatch pageChanged { pageName }
        └─ App.initPageHandlers:
             forum   → Forum.refresh()   (render thread + filter)
             friend  → Matching.init()   (render buddies + bind form)
             profile → Profile.init()    (sync user, bind jurnal)
```

## 3. Alur Fitur

### Autentikasi
```
Login/Register modal → Auth.openModal(tab)
  - form submit → validasi → simpan user di localStorage/sessionStorage
  - logout/clearSession → hapus user → updateUIForLoggedInUser()
```

### Forum
```
Forum.refresh() → renderThreads(dataStore.forum) + filter kategori
  klik thread-card → Forum.openThread(id) → modal diskusi (komentar, vote)
  klik "Buat Thread" → butuh login → toast "segera hadir"
```

### Study Buddy Matching
```
Matching.init() → renderBuddies(dataStore.buddies)
  submit form → filter (mapel, minat, kelas) → render ulang / empty state
  "Ajak Berteman" / "Lihat" → toast
```

### Profil & Jurnal
```
Profile.init() → syncUser() (nama, avatar, poin)
  journalEntryForm submit → +5 poin → Auth.persistUser → render entri baru
  anon toggle → ganti label Mode Anonim / Mode Nama
```

### FAQ & Kontak
```
renderFaq → faqAccordion (toggling) + form kontak
  contact form submit → App.submitContact → toast + reset form
```

### Utilitas Global
```
Search overlay   → filter dataStore.forum → klik hasil → buka thread
Dark mode toggle → simpan localStorage 'edquest_dark' → class .dark
Focus mode       → simpan 'edquest_focus' → body.focus-mode (sembunyikan sidebar)
Ice breaker copy → klik kartu → clipboard → toast
Escape           → tutup semua modal aktif
```
