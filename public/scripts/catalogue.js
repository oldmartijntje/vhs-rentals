document.addEventListener('DOMContentLoaded', function () {
    const catalogueList = document.getElementById('catalogue-list');
    const pagination = document.getElementById('catalogue-pagination');
    const FILMS_PER_PAGE = 32;
    let films = [];
    let currentPage = 1;
    function getPageFromQuery() {
        const params = new URLSearchParams(window.location.search);
        const page = parseInt(params.get('page'), 10);
        return isNaN(page) || page < 1 ? 1 : page;
    }
    function setPageInQuery(page) {
        const params = new URLSearchParams(window.location.search);
        params.set('page', page);
        window.history.replaceState({}, '', `${window.location.pathname}?${params}`);
    }
    currentPage = getPageFromQuery();

    function renderFilms(page) {
        catalogueList.innerHTML = '';
        const start = (page - 1) * FILMS_PER_PAGE;
        const end = start + FILMS_PER_PAGE;
        const pageFilms = films.slice(start, end);
        if (pageFilms.length === 0) {
            catalogueList.innerHTML = '<div class="col"><div class="alert alert-warning text-center">No films found.</div></div>';
            return;
        }
        pageFilms.forEach(film => {
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
                            <span class="badge bg-secondary">${film.release_year || ''}</span>
                        </div>
                        <div class="mb-2">
                            <span class="text-warning">Rating: ${film.rating || 'N/A'}</span>
                            <span class="ms-3 text-success">€${film.price || 'N/A'}</span>
                        </div>
                        <a href="/Film?v=${film.film_id}" class="btn btn-primary mt-auto">Details</a>
                    </div>
                </div>
            `;
            catalogueList.appendChild(card);
        });
    }

    function renderPagination() {
        pagination.innerHTML = '';
        const totalPages = Math.ceil(films.length / FILMS_PER_PAGE);
        if (totalPages <= 1) return;
        for (let i = 1; i <= totalPages; i++) {
            const li = document.createElement('li');
            li.className = 'page-item' + (i === currentPage ? ' active' : '');
            const btn = document.createElement('button');
            btn.className = 'page-link';
            btn.textContent = i;
            btn.onclick = () => {
                currentPage = i;
                setPageInQuery(currentPage);
                renderFilms(currentPage);
                renderPagination();
                window.scrollTo({ top: 0, behavior: 'smooth' });
            };
            li.appendChild(btn);
            pagination.appendChild(li);
        }
    }

    function fetchFilms() {
        // Send page param to backend
        fetch(`/api/film/all?page=${currentPage}`)
            .then(res => res.json())
            .then(data => {
                films = Array.isArray(data.data) ? data.data : [];
                renderFilms(currentPage);
                renderPagination();
            })
            .catch(() => {
                catalogueList.innerHTML = '<div class="col"><div class="alert alert-danger text-center">Failed to load films.</div></div>';
            });
    }

    fetchFilms();
});
