const injected = new Set();

export function injectStyle(path) {
  if (injected.has(path)) return;
  injected.add(path);
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = path;
  document.head.appendChild(link);
}
