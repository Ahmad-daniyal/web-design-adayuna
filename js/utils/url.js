export function getHashPath() {
  const hash = window.location.hash.slice(1) || '/';
  return hash.split('?')[0].replace(/^\/+/, '');
}

export function navigate(page) {
  window.location.hash = '#/' + page;
}
