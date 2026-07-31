function renderFooter() { return `
<footer class="footer-edquest py-12">
  <div class="max-w-6xl mx-auto px-4 sm:px-6">
    <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
      <div>
        <a href="#/home" class="flex items-center gap-2 text-xl font-extrabold tracking-tight no-underline mb-4" style="color:var(--text-primary);">
          <span class="flex items-center justify-center w-9 h-9 rounded-xl text-white text-base" style="background:var(--gradient-primary);">E</span> Edquest
        </a>
        <p class="text-sm leading-relaxed" style="color:var(--text-secondary);">Komunitas belajar untuk siswa SMA/SMK. Belajar bareng, tumbuh bareng, tanpa rasa malu.</p>
      </div>
      <div>
        <h4 class="text-sm font-bold uppercase tracking-wider mb-4" style="color:var(--text-muted);">Navigasi</h4>
        <div class="flex flex-col gap-2">
          <a href="#/home" data-link="home" class="text-sm no-underline" style="color:var(--text-secondary);">Home</a>
          <a href="#/forum" data-link="forum" class="text-sm no-underline" style="color:var(--text-secondary);">Forum</a>
          <a href="#/friend" data-link="friend" class="text-sm no-underline" style="color:var(--text-secondary);">Friend</a>
          <a href="#/about" data-link="about" class="text-sm no-underline" style="color:var(--text-secondary);">About</a>
          <a href="#/faq" data-link="faq" class="text-sm no-underline" style="color:var(--text-secondary);">FAQ</a>
        </div>
      </div>
      <div>
        <h4 class="text-sm font-bold uppercase tracking-wider mb-4" style="color:var(--text-muted);">Fitur</h4>
        <div class="flex flex-col gap-2">
          <a href="#/forum" data-link="forum" class="text-sm no-underline" style="color:var(--text-secondary);">Forum Diskusi</a>
          <a href="#/friend" data-link="friend" class="text-sm no-underline" style="color:var(--text-secondary);">Study Buddy</a>
          <a href="#/profile" data-link="profile" class="text-sm no-underline" style="color:var(--text-secondary);">Progress Journal</a>
        </div>
      </div>
      <div>
        <h4 class="text-sm font-bold uppercase tracking-wider mb-4" style="color:var(--text-muted);">Ikuti Kami</h4>
        <div class="flex gap-3">
          <a href="#" class="w-10 h-10 rounded-full flex items-center justify-center no-underline" style="background:var(--bg-section);color:var(--text-secondary);" aria-label="Instagram"><i class="fab fa-instagram"></i></a>
          <a href="#" class="w-10 h-10 rounded-full flex items-center justify-center no-underline" style="background:var(--bg-section);color:var(--text-secondary);" aria-label="Twitter"><i class="fab fa-twitter"></i></a>
          <a href="#" class="w-10 h-10 rounded-full flex items-center justify-center no-underline" style="background:var(--bg-section);color:var(--text-secondary);" aria-label="TikTok"><i class="fab fa-tiktok"></i></a>
        </div>
        <p class="text-xs mt-4" style="color:var(--text-muted);">Edquest &mdash; INVENTION 2026</p>
      </div>
    </div>
    <hr class="my-8" style="border-color:var(--border-color);">
    <p class="text-center text-sm" style="color:var(--text-muted);">&copy; 2026 Edquest. Dibuat untuk INVENTION 2026.</p>
  </div>
</footer>
`; }