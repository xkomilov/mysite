
document.documentElement.classList.add('js');
try { if (localStorage.getItem('xk-theme') === 'light') document.documentElement.dataset.theme = 'light'; } catch (_) {}
