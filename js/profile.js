const Profile = (() => {
  let bound = false;

  function init() {
    if (bound) return;
    bindJournalForm();
    bindAnonToggle();
    bound = true;
  }

  function bindJournalForm() {
    const addBtn = document.getElementById('addJournalBtn');
    const form = document.getElementById('journalForm');
    const cancelBtn = document.getElementById('cancelJournalBtn');
    if (!addBtn || !form) return;
    addBtn.addEventListener('click', () => { form.style.display = form.style.display === 'none' ? 'block' : 'none'; });
    if (cancelBtn) cancelBtn.addEventListener('click', () => { form.style.display = 'none'; });
    const entryForm = document.getElementById('journalEntryForm');
    if (entryForm) {
      entryForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const mapel = document.getElementById('journalMapel').value;
        const text = document.getElementById('journalText').value.trim();
        if (!text) { Auth.showToast('Catatan tidak boleh kosong', 'error'); return; }
        const colors = { matematika:{bg:'var(--primary-light)',color:'var(--primary)'}, fisika:{bg:'#fce7f3',color:'#be185d'}, kimia:{bg:'#dbeafe',color:'#1d4ed8'}, biologi:{bg:'#dcfce7',color:'#15803d'}, sejarah:{bg:'#fef3c7',color:'#b45309'}, bahasa:{bg:'#ede9fe',color:'#7c3aed'}, ips:{bg:'#ffedd5',color:'#c2410c'}, umum:{bg:'#e2e8f0',color:'#475569'} };
        const c = colors[mapel] || colors.umum;
        const entry = document.createElement('div');
        entry.className = 'progress-card';
        entry.innerHTML = '<div class="flex items-center justify-between mb-2"><span class="text-xs font-semibold px-2 py-1 rounded-full" style="background:' + c.bg + ';color:' + c.color + ';">' + (mapel.charAt(0).toUpperCase() + mapel.slice(1)) + '</span><span class="text-xs" style="color:var(--text-muted);">Baru saja</span></div>' +
          '<p class="text-sm leading-relaxed" style="color:var(--text-secondary);">' + text + '</p><div class="flex items-center gap-2 mt-2 text-xs" style="color:var(--primary);"><i class="fas fa-circle-check"></i> +5 poin</div>';
        const container = document.getElementById('journalEntries');
        if (container) container.insertBefore(entry, container.firstChild);
        document.getElementById('journalText').value = '';
        form.style.display = 'none';
        Auth.showToast('Progress tercatat! +5 poin', 'success');
      });
    }
  }

  function bindAnonToggle() {
    const toggle = document.getElementById('anonToggle');
    if (!toggle) return;
    toggle.addEventListener('change', () => {
      const label = toggle.closest('label').querySelector('span');
      if (label) {
        label.innerHTML = toggle.checked
          ? '<i class="fas fa-eye-slash mr-2" style="color:var(--text-muted);"></i>Mode Anonim'
          : '<i class="fas fa-eye mr-2" style="color:var(--text-muted);"></i>Mode Nama';
      }
    });
  }

  return { init };
})();

window.addEventListener('pageChanged', (e) => {
  if (e.detail.pageName === 'profile') setTimeout(() => Profile.init(), 50);
});