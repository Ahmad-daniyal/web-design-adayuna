# Design

> Aturan CSS, library yang diizinkan, dan kebijakan jQuery. Sumber kebenaran tertinggi adalah `CONCLUSION.md` — file ini hanya memisahkan bagian desain dari index.

---

## CSS — Aturan Ukuran File

CSS must use expanded format — one property per line, one blank line between rules.

| Tipe file | Batas |
|---|---|
| CSS fitur utama | ~100 baris |
| CSS partial (`_*.css`) | ~150 baris |
| CSS komponen shared | ~100 baris |
| Global CSS | ~200 baris |

Jika file melebihi batasnya, ekstrak ke partial dengan prefix `_`:

```js
injectStyle('/src/modules/[nama]/[nama].css');
injectStyle('/src/modules/[nama]/_[nama]-section.css');
```

CSS partial (prefix `_`) hanya di-inject dari file JS fiturnya — tidak standalone.

---

## Library yang Diizinkan

- Tidak ada framework (React, Vue, Svelte, dll)
- Tidak ada build tool untuk JS — ES Modules native via `type="module"`

> **Catatan:** Vanilla JS selalu diutamakan. jQuery hanya digunakan jika memberikan manfaat nyata yang tidak bisa dicapai dengan vanilla JS secara wajar. Jangan gunakan jQuery hanya untuk mempersingkat selector.
