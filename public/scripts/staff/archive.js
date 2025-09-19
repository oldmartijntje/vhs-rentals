const urlParams = new URLSearchParams(window.location.search);
const film_id = urlParams.get('v');

const archiveAccordion = document.getElementById('archive-accordion');
const pagination = document.getElementById('archive-pagination');
const paginationTop = document.getElementById('archive-pagination-top');
const filmIdInput = document.getElementById('filmIdInput');
const filterBtn = document.getElementById('filterBtn');

let currentPage = 1;
const pageSize = 25;
let archiveData = [];

function fetchArchive(page = 1, filmFilter = null) {
    let apiUrl = `/api/inventory/archive?userId=${userId}&sessionToken=${token}`;
    if (filmFilter) {
        apiUrl += `&film_id=${filmFilter}`;
    } else if (film_id) {
        apiUrl += `&film_id=${film_id}`;
    }
    fetch(apiUrl)
        .then(res => res.json())
        .then(data => {
            archiveData = Array.isArray(data) ? data : [];
            renderArchive(page);
            renderPagination();
        });
}

function renderArchive(page) {
    archiveAccordion.innerHTML = '';
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    const pageItems = archiveData.slice(start, end);
    // Movie header logic
    const filteredMovieHeader = document.getElementById('filtered-movie-header');
    const params = new URLSearchParams(window.location.search);
    const filteredFilmId = params.get('v');
    if (filteredFilmId && pageItems.length > 0) {
        // Use first item's film_name
        const filmName = pageItems[0].film_name;
        filteredMovieHeader.innerHTML = `<h2 class='mb-3'><a href="/Film?v=${filteredFilmId}">${filmName}</a>'s Renting History</h2>
            <button id='viewFullArchiveBtn' class='btn btn-outline-secondary mb-2'>View Full Archive</button>`;
        // Add event for button
        setTimeout(() => {
            const btn = document.getElementById('viewFullArchiveBtn');
            if (btn) {
                btn.onclick = () => {
                    const newParams = new URLSearchParams(window.location.search);
                    newParams.delete('v');
                    newParams.set('page', 1);
                    window.location.search = newParams.toString();
                };
            }
        }, 0);
    } else {
        filteredMovieHeader.innerHTML = '';
    }
    pageItems.forEach((item, idx) => {
        const collapseId = `collapse${item.rental_id}`;
        const headingId = `heading${item.rental_id}`;
        const accItem = document.createElement('div');
        accItem.className = 'accordion-item';
        accItem.innerHTML = `
            <h2 class="accordion-header" id="${headingId}">
                <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#${collapseId}" aria-expanded="false" aria-controls="${collapseId}">
                    ${item.film_name} (Inventory #${item.inventory_id})<br><span class='text-secondary'>Rental ID: ${item.rental_id}</span>
                </button>
            </h2>
            <div id="${collapseId}" class="accordion-collapse collapse" aria-labelledby="${headingId}" data-bs-parent="#archive-accordion">
                <div class="accordion-body">
                    <strong>Store Address:</strong> ${item.store_address}<br>
                    <strong>Customer ID:</strong> ${item.customer_id}<br>
                    <strong>Rental ID:</strong> ${item.rental_id}<br>
                    <strong>Rental Date:</strong> ${new Date(item.rental_date).toLocaleString()}<br>
                    <strong>Return Date:</strong> ${new Date(item.return_date).toLocaleString()}<br>
                    <strong>Film Id:</strong> ${item.film_id}<br>
                    <strong>Film Name:</strong> <a href="/Film?v=${item.film_id}">${item.film_name}</a><br>
                </div>
            </div>
        `;
        archiveAccordion.appendChild(accItem);
    });
}

function renderPagination() {
    function renderBar(bar) {
        bar.innerHTML = '';
        const totalPages = Math.ceil(archiveData.length / pageSize);
        if (totalPages <= 1) return;
        const createPageItem = (page, isActive = false) => {
            const li = document.createElement('li');
            li.className = 'page-item' + (isActive ? ' active' : '');
            const btn = document.createElement('button');
            btn.className = 'page-link';
            btn.textContent = page;
            btn.onclick = () => {
                // Set page query param in URL
                const params = new URLSearchParams(window.location.search);
                params.set('page', page);
                window.location.search = params.toString();
            };
            li.appendChild(btn);
            return li;
        };
        const windowSize = 2;
        let start = Math.max(1, currentPage - windowSize);
        let end = Math.min(totalPages, currentPage + windowSize);
        if (start > 1) {
            bar.appendChild(createPageItem(1, currentPage === 1));
            if (start > 2) {
                const li = document.createElement('li');
                li.className = 'page-item disabled';
                li.innerHTML = '<span class="page-link">…</span>';
                bar.appendChild(li);
            }
        }
        for (let i = start; i <= end; i++) {
            bar.appendChild(createPageItem(i, i === currentPage));
        }
        if (end < totalPages) {
            if (end < totalPages - 1) {
                const li = document.createElement('li');
                li.className = 'page-item disabled';
                li.innerHTML = '<span class="page-link">…</span>';
                bar.appendChild(li);
            }
            bar.appendChild(createPageItem(totalPages, currentPage === totalPages));
        }
    }
    renderBar(pagination);
    if (paginationTop) renderBar(paginationTop);
}

filterBtn.addEventListener('click', () => {
    const filterValue = filmIdInput.value.trim();
    currentPage = 1;
    const params = new URLSearchParams(window.location.search);
    params.set('page', 1);
    if (filterValue) {
        params.set('v', filterValue);
    } else {
        params.delete('v');
    }
    window.location.search = params.toString();
});

// Initial load: get page from query param
function getPageFromQuery() {
    const params = new URLSearchParams(window.location.search);
    const page = parseInt(params.get('page'), 10);
    return isNaN(page) || page < 1 ? 1 : page;
}
currentPage = getPageFromQuery();
fetchArchive(currentPage);
