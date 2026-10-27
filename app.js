const menuToggle = document.querySelector('.menu-toggle');
const mobileNav = document.querySelector('#mobile-nav');
function closeMenu() {
  menuToggle.setAttribute('aria-expanded', 'false');
  menuToggle.setAttribute('aria-label', 'Abrir menu');
  mobileNav.hidden = true;
}
menuToggle.addEventListener('click', () => {
  const expanded = menuToggle.getAttribute('aria-expanded') === 'true';
  menuToggle.setAttribute('aria-expanded', String(!expanded));
  menuToggle.setAttribute('aria-label', expanded ? 'Abrir menu' : 'Fechar menu');
  mobileNav.hidden = expanded;
});
mobileNav.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', event => { if (event.key === 'Escape') closeMenu(); });
window.matchMedia('(min-width: 801px)').addEventListener('change', event => { if (event.matches) closeMenu(); });

const visitDialog = document.querySelector('#visit-dialog');
const visitForm = document.querySelector('#visit-form');
const visitResult = document.querySelector('#visit-result');
const goalSelect = document.querySelector('#goal');
function resetVisit() {
  visitForm.hidden = false;
  visitResult.hidden = true;
}
function openVisit(goal) {
  closeMenu();
  resetVisit();
  goalSelect.value = goal || 'Conhecer o ginásio';
  visitDialog.showModal();
}
document.querySelectorAll('[data-visit]').forEach(button => button.addEventListener('click', () => openVisit()));
document.querySelectorAll('[data-goal]').forEach(button => button.addEventListener('click', () => openVisit(button.dataset.goal)));
visitForm.addEventListener('submit', event => {
  event.preventDefault();
  document.querySelector('#selected-goal').textContent = goalSelect.value;
  visitForm.hidden = true;
  visitResult.hidden = false;
  visitResult.focus();
});
document.querySelector('.reset-visit').addEventListener('click', () => { resetVisit(); goalSelect.focus(); });

const cards = [...document.querySelectorAll('.training-card')];
document.querySelectorAll('[data-filter]').forEach(button => {
  button.addEventListener('click', () => {
    const filter = button.dataset.filter;
    document.querySelectorAll('[data-filter]').forEach(item => {
      const active = item === button;
      item.classList.toggle('active', active);
      item.setAttribute('aria-pressed', String(active));
    });
    cards.forEach(card => { card.hidden = filter !== 'all' && card.dataset.category !== filter; });
    const visible = cards.filter(card => !card.hidden).length;
    document.querySelector('#filter-status').textContent = `${visible} ${visible === 1 ? 'objetivo apresentado' : 'objetivos apresentados'}.`;
  });
});

const galleryDialog = document.querySelector('#gallery-dialog');
document.querySelectorAll('[data-image]').forEach(button => {
  button.addEventListener('click', () => {
    const image = document.querySelector('#lightbox-image');
    image.src = button.dataset.image;
    image.alt = button.querySelector('img').alt;
    document.querySelector('#lightbox-caption').textContent = button.dataset.caption;
    galleryDialog.showModal();
  });
});
document.querySelector('[data-info]').addEventListener('click', () => document.querySelector('#info-dialog').showModal());
document.querySelectorAll('dialog').forEach(dialog => {
  dialog.querySelector('[data-close]').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => {
    if (event.target !== dialog) return;
    const rect = dialog.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
  });
});
document.querySelectorAll('.faq details').forEach(detail => {
  detail.addEventListener('toggle', () => {
    if (detail.open) document.querySelectorAll('.faq details').forEach(other => { if (other !== detail) other.open = false; });
  });
});
document.querySelector('#year').textContent = new Date().getFullYear();
