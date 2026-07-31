# Design

> Aturan CSS, library yang diizinkan, dan kebijakan jQuery. Sumber kebenaran tertinggi adalah `CONCLUSION.md` — file ini hanya memisahkan bagian desain dari index.

---

## Pendekatan Styling

- **Tailwind CSS via CDN** — utility class untuk layout/space/typography (`flex`, `gap-4`, `text-sm`, `dark:*`, dst.).
- **CSS variables** di `css/style.css` — untuk warna adaptif light/dark: `--bg-body`, `--bg-card`, `--bg-section`, `--text-primary`, `--text-secondary`, `--text-muted`, `--border-color`, `--primary`, `--primary-dark`, `--primary-light`, `--accent`, `--gradient-hero`, `--gradient-primary`.
- **Class custom** di `css/style.css` — untuk komponen yang dipakai berulang (`btn-edquest`, `glass-card`, `sidebar-link`, `modal-edquest`, `thread-card`, dst.).
- Mode gelap aktif dengan class `dark` di `<html>`; gunakan `dark:` utility Tailwind **atau** CSS variables — jangan hardcode warna yang tidak adaptif.

## Aturan CSS

- CSS must use expanded format — one property per line, one blank line between rules.
- `css/style.css` adalah satu-satunya file CSS. Kelompokkan dengan komentar section (`/* ===== Modal ===== */`).
- Hapus class yang sudah tidak dipakai (dead CSS) — jangan menumpuk.
- Jika `style.css` membengkak, ekstrak aturan komponen baru ke section terpisah dalam file yang sama.

## Library yang Diizinkan

- Tidak ada framework (React, Vue, Svelte, dll.)
- Tidak ada build tool untuk JS — ES Modules native via `type="module"`
- CDN yang dipakai: Tailwind CSS, Font Awesome 6, Google Fonts (Inter)

> **Catatan:** Vanilla JS selalu diutamakan. jQuery tidak digunakan.
