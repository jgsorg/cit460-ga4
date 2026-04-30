/*
  script handles:
  - product filtering
  - avail/archive toggle
  - hash syncing for sections
  - analytic tracking (GTM)

  note: i usually dont add comments to my code, so i hope the ones i am adding are sufficient for the needs of this project as i am not well versed in them
*/

/*
  the small amount of help i needed with the js coding was all from JavaScript Documentation
  here are a few links i still have opened ^^
  https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener
  https://developer.mozilla.org/en-US/docs/Web/API/History/replaceState
  https://developer.mozilla.org/en-US/docs/Web/API/Element/closest

*/

/*
  Google Tag Manager Events!!! - 
  --I don't know if you use things like this or like analytic related things for your own projects, but using GA4 and GTM with Google Data
  Studio is a way to make your charts / analytics nice looking and all in 1 spot.--

  TAGS
  - filter_click
  - product_section_click
  - initialization google tag (not an event, but necessary for everything to work)

  TRIGGERS
  - event = filter_click
  - event = product_section_click

  VARIABLES
  (filter variables are self explanatory)
  - element_id
  - filter_group
  - filter_id
  - filter_label
  - filter_was_active
  - section: avail/archive
  - source_page: used to see what section people are clicking on first on the home page / product page
  (filter variables are self explanatory)

*/

/*
  Google Analytic 4 Info!
  Custom definitions
  └── Custom dimensions
      - Filter ID (event param=filter_id)
      - Section (event param=section)
      - Source page (event param=source_page)

  These are used to track the events and allow them to be used under the "Explore" tab in GA4 for analytic tables.

*/

console.log("script.js loaded", location.pathname); // confirm loading (was used for prior debugging, keeping for potential future needs)


document.addEventListener('DOMContentLoaded', () => {
  const hero = document.querySelector('.hero');
  const availBtn = document.getElementById('availbtn');
  const archivedBtn = document.getElementById('archivedbtn');
  const productsSection = document.getElementById('products');

  const chips = Array.from(document.querySelectorAll('.itemsnav .chip'));
  const cards = Array.from(document.querySelectorAll('.product-grid .card'));

  let currentView = 'available'; 
  let currentCategory = 'all';   

// filters product card categories and selected chip filters
  function applyFilters() {
    cards.forEach(card => {
      const status = (card.dataset.status || '').toLowerCase();
      const category = (card.dataset.category || '').toLowerCase();

      const matchesView = status === currentView;
      const matchesCategory = currentCategory === 'all' || category === currentCategory;


      card.style.display = (matchesView && matchesCategory) ? '' : 'none'; // show or hide card based on filters
    });
  }

// updates active chip... set(s)ActiveChip haha...
  function setActiveChip(category) {
    currentCategory = category;

    chips.forEach(chip => {
      chip.classList.toggle('is-active', (chip.dataset.filter || 'all') === category);
    });

    applyFilters();
  }

// updates avail / archive view & button/arrow
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


// updates view based on URL hash
  function applyViewFromHash() {
    const hash = (window.location.hash || '').toLowerCase();


    if (hash === '#archived') setView('archived');
    else setView('available'); 
  }



// event listeners for buttons and hashes
  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      const filter = (chip.dataset.filter || 'all').toLowerCase();
      setActiveChip(filter);
    });
  });


  availBtn?.addEventListener('click', () => {
    
    if (hero?.classList.contains('is-archived')) {
      setView('available');
      history.replaceState(null, '', '#available');  // updates url without refresh (too many refreshes annoys me on websites)
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

// filters
window.dataLayer = window.dataLayer || [];

document.addEventListener("click", function (e) {
  const btn = e.target.closest('nav.itemsnav button.chip[data-filter]'); 
  if (!btn) return;

  window.dataLayer.push({
    event: "filter_click",
    filter_id: btn.getAttribute("data-filter"),
    filter_label: (btn.textContent || "").trim(),
    filter_group: "product_category",
    filter_was_active: btn.classList.contains("is-active") ? "true" : "false"
  });
});

// avail / archive

document.addEventListener("click", function (e) {
  const btn = e.target.closest("#availbtn, #archivedbtn");
  if (!btn) return;

  const section = btn.id === "availbtn" ? "available" : "archived";

  window.dataLayer.push({
    event: "product_section_click",
    section,
    source_page: "product",
    element_id: btn.id
  });
});