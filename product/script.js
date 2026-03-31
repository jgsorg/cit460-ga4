document.addEventListener('DOMContentLoaded', () => {
  const hero = document.querySelector('.hero');
  const availBtn = document.getElementById('availbtn');
  const archivedBtn = document.getElementById('archivedbtn');

  const productsSection = document.getElementById('products');

  function setView(view) {
  
    if (!hero) return;

    const isArchived = view === 'archived';
    hero.classList.toggle('is-archived', isArchived);

    if (availBtn) {
      availBtn.textContent = isArchived ? 'View Available' : 'Scroll down...';
    }
    if (archivedBtn) {
      archivedBtn.textContent = isArchived ? 'Scroll down...' : 'View Archived';
    }

    document.body.dataset.view = view;
  }

  availBtn?.addEventListener('click', () => {
    if (hero?.classList.contains('is-archived')) {
      setView('available');
      return;
    }
    productsSection?.scrollIntoView({ behavior: 'smooth' });
  });

  archivedBtn?.addEventListener('click', () => {

    if (!hero?.classList.contains('is-archived')) {
      setView('archived');
      return;
    }

    productsSection?.scrollIntoView({ behavior: 'smooth' });
  });

  setView('available');
});