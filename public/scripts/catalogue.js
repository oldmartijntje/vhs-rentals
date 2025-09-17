document.addEventListener('DOMContentLoaded', function () {
    const catalogueList = document.getElementById('catalogue-list');
    const pagination = document.getElementById('catalogue-pagination');
    const paginationTop = document.getElementById('catalogue-pagination-top');
    const FILMS_PER_PAGE = 32;
    let films = [];
    let totalPages = 0;
    let currentPage = 0;
    function getPageFromQuery() {
        const params = new URLSearchParams(window.location.search);
        const page = parseInt(params.get('page'), 10);
        return isNaN(page) || page < 1 ? 1 : page;
    }
    currentPage = getPageFromQuery();

    function renderFilms(page) {
        catalogueList.innerHTML = '';
        const start = (page - 1) * FILMS_PER_PAGE;
        const end = start + FILMS_PER_PAGE;
        if (films.length === 0) {
            catalogueList.innerHTML = '<div class="col"><div class="alert alert-warning text-center">No films found.</div></div>';
            return;
        }
        films.forEach(film => {
            const card = document.createElement('div');
            card.className = 'col';
            card.innerHTML = `
                <div class="card h-100 bg-dark-3 text-light shadow">
                    <img src="/static/images/vhs.svg" class="card-img-top card-image-size center" alt="VHS cover">
                    <div class="card-body d-flex flex-column">
                        <h5 class="card-title">${film.title}</h5>
                        <p class="card-text flex-grow-1">${film.description || ''}</p>
                        <div class="mb-2">
                            <span class="badge bg-info me-1">${film.category || 'Unknown'}</span>
                            <span class="badge bg-secondary me-1">${film.release_year || ''}</span>
                            <span class="badge bg-${film.inventory ? 'success' : 'danger'}">${film.inventory ? 'available' : 'out of stock'}</span>
                        </div>
                        <div class="mb-2">
                            <span class="text-warning">Rating: ${film.rating || 'N/A'}</span>
                            <span class="ms-3 text-success">€${film.price || 'N/A'}</span>
                        </div>
                        <a href="/Film?v=${film.FID}" class="btn btn-primary mt-auto">Details</a>
                    </div>
                </div>
            `;
            catalogueList.appendChild(card);
        });
    }

    function renderPagination() {
        function renderBar(bar) {
            bar.innerHTML = '';
            if (totalPages <= 1) return;
            const createPageItem = (page, isActive = false) => {
                const li = document.createElement('li');
                li.className = 'page-item' + (isActive ? ' active' : '');
                const btn = document.createElement('button');
                btn.className = 'page-link';
                btn.textContent = page;
                btn.onclick = () => {
                    window.location.href = `/Catalogue?page=${page}`;
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


    function fetchFilms() {
        // Send page param to backend
        fetch(`/api/film/all?page=${currentPage - 1}`)
            .then(res => res.json())
            .then(data => {
                films = Array.isArray(data.data) ? data.data : [];
                totalPages = data.totalPages ?? 1;
                renderFilms(currentPage);
                renderPagination();
            })
            .catch(() => {
                catalogueList.innerHTML = '<div class="col"><div class="alert alert-danger text-center">Failed to load films.</div></div>';
            });
    }

    fetchFilms();
});
