document.addEventListener('DOMContentLoaded', () => {
  const hero = document.querySelector('.hero');
  const availBtn = document.getElementById('availbtn');
  const archivedBtn = document.getElementById('archivedbtn');
  const productsSection = document.getElementById('products');

  const chips = Array.from(document.querySelectorAll('.itemsnav .chip'));
  const cards = Array.from(document.querySelectorAll('.product-grid .card'));

  let currentView = 'available'; 
  let currentCategory = 'all';   


  function applyFilters() {
    cards.forEach(card => {
      const status = (card.dataset.status || '').toLowerCase();
      const category = (card.dataset.category || '').toLowerCase();

      const matchesView = status === currentView;
      const matchesCategory = currentCategory === 'all' || category === currentCategory;


      card.style.display = (matchesView && matchesCategory) ? '' : 'none';
    });
  }

  function setActiveChip(category) {
    currentCategory = category;

    chips.forEach(chip => {
      chip.classList.toggle('is-active', (chip.dataset.filter || 'all') === category);
    });

    applyFilters();
  }

  function setView(view) {
    if (!hero) return;

    currentView = view;
    const isArchived = view === 'archived';

    hero.classList.toggle('is-archived', isArchived);

    if (availBtn) {
      availBtn.textContent = isArchived ? 'View Available' : 'Scroll down...';
    }
    if (archivedBtn) {
      archivedBtn.textContent = isArchived ? 'Scroll down...' : 'View Archived';
    }

    document.body.dataset.view = view;

    applyFilters();
  }

  function applyViewFromHash() {
    const hash = (window.location.hash || '').toLowerCase();


    if (hash === '#archived') setView('archived');
    else setView('available'); 
  }




  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      const filter = (chip.dataset.filter || 'all').toLowerCase();
      setActiveChip(filter);
    });
  });


  availBtn?.addEventListener('click', () => {
    
    if (hero?.classList.contains('is-archived')) {
      setView('available');
      history.replaceState(null, '', '#available'); 
      return;
    }
  
    productsSection?.scrollIntoView({ behavior: 'smooth' });
  });

  archivedBtn?.addEventListener('click', () => {
    
    if (!hero?.classList.contains('is-archived')) {
      setView('archived');
      history.replaceState(null, '', '#archived'); 
      return;
    }

    productsSection?.scrollIntoView({ behavior: 'smooth' });
  });


  window.addEventListener('hashchange', applyViewFromHash);


  setActiveChip('all');   
  applyViewFromHash();    
});