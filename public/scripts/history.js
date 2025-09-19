document.addEventListener('DOMContentLoaded', () => {
    const accordion = document.getElementById('customer-history-accordion');
    const pagination = document.getElementById('customer-history-pagination');
    const paginationTop = document.getElementById('customer-history-pagination-top');
    const filteredMovieHeader = document.getElementById('filtered-movie-header');

    const filmIdInput = document.getElementById('filmIdInput');
    const filterBtn = document.getElementById('filterBtn');

    let currentPage = 1;
    const pageSize = 25;
    let archiveData = [];

    function getFilmIdFromQuery() {
        const params = new URLSearchParams(window.location.search);
        return params.get('v') || '';
    }

    function getPageFromQuery() {
        const params = new URLSearchParams(window.location.search);
        const page = parseInt(params.get('page'), 10);
        return isNaN(page) || page < 1 ? 1 : page;
    }

    function setFilmIdInputFromQuery() {
        const filmId = getFilmIdFromQuery();
        if (filmId && filmIdInput) filmIdInput.value = filmId;
    }

    function fetchArchive(page = 1, filmFilter = null) {
        let apiUrl = `/api/inventory/archive?userId=${userId}&sessionToken=${token}`;
        if (filmFilter) {
            apiUrl += `&film_id=${filmFilter}`;
        }
        fetch(apiUrl)
            .then(res => res.json())
            .then(data => {
                archiveData = Array.isArray(data) ? data : [];
                renderArchive(page, filmFilter);
                renderPagination();
            });
    }

    function renderArchive(page, filmId) {
        accordion.innerHTML = '';
        filteredMovieHeader.innerHTML = '';
        const start = (page - 1) * pageSize;
        const end = start + pageSize;
        const pageItems = archiveData.slice(start, end);
        if (!pageItems.length) {
            if (filmId) {
                filteredMovieHeader.innerHTML = `<h2 class='mb-3'>No rental history for this film</h2>
                <button id='viewFullArchiveBtn' class='btn btn-outline-secondary mb-2'>View Full Archive</button>`;
            }
            accordion.innerHTML = `<div class="alert alert-info">No rental history found.</div>`;
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
            return;
        }
        if (filmId && pageItems.length > 0) {
            const filmName = pageItems[0].film_name;
            filteredMovieHeader.innerHTML = `<h2 class='mb-3'><a href="/Film?v=${filmId}">${filmName}</a> Rental History</h2>
                <button id='viewFullArchiveBtn' class='btn btn-outline-secondary mb-2'>View Full Archive</button>`;
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
                <div id="${collapseId}" class="accordion-collapse collapse" aria-labelledby="${headingId}" data-bs-parent="#customer-history-accordion">
                    <div class="accordion-body">
                        <strong>Rental ID:</strong> ${item.rental_id}<br>
                        <strong>Inventory ID:</strong> ${item.inventory_id}<br>
                        <strong>Rental Date:</strong> ${new Date(item.rental_date).toLocaleString()}<br>
                        <strong>Return Date:</strong> ${new Date(item.return_date).toLocaleString()}<br>
                        <strong>Film Id:</strong> ${item.film_id}, 
                        <a class="btn btn-sm btn-secondary" href="/Customer/History?v=${item.film_id}">Filter</a>
                        <a class="btn btn-sm btn-secondary" href="/Film?v=${item.film_id}">View Film</a>
                        <br>
                        <strong>Film Name:</strong> <a href="/Film?v=${item.film_id}">${item.film_name}</a><br>
                        <strong>Price:</strong> <span class="text-info">€${item.film_price}</span>
                    </div>
                </div>
            `;
            accordion.appendChild(accItem);
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

    filterBtn && filterBtn.addEventListener('click', () => {
        const filmId = filmIdInput.value.trim();
        const params = new URLSearchParams(window.location.search);
        params.set('page', 1);
        if (filmId) {
            params.set('v', filmId);
        } else {
            params.delete('v');
        }
        window.location.search = params.toString();
    });

    // Initial load: set input and fetch
    setFilmIdInputFromQuery();
    currentPage = getPageFromQuery();
    const filmId = getFilmIdFromQuery();
    fetchArchive(currentPage, filmId);
});
