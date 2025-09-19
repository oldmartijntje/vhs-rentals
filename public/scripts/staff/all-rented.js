// JS for currently rented inventory page
// Fetches from /api/inventory/all-rented and renders results in #rented-accordion

document.addEventListener('DOMContentLoaded', () => {

    const userId = 4139;
    const sessionToken = 'f69d1a05851d7fe2543e3ef9b32c57d9de4a060e7f4a9e23efbd6fd2ad910d75';
    const endpointBase = `/api/inventory/all-rented?userId=${userId}&sessionToken=${sessionToken}`;
    const accordion = document.getElementById('rented-accordion');
    const filterBtn = document.getElementById('filterBtn');
    const filmIdInput = document.getElementById('filmIdInput');
    const filteredMovieHeader = document.getElementById('filtered-movie-header');

    // Get film_id from query params
    function getFilmIdFromQuery() {
        const params = new URLSearchParams(window.location.search);
        return params.get('v') || '';
    }

    // Set filmIdInput from query param if present
    function setFilmIdInputFromQuery() {
        const filmId = getFilmIdFromQuery();
        if (filmId) filmIdInput.value = filmId;
    }

    function renderAccordion(items, filmId) {
        accordion.innerHTML = '';
        filteredMovieHeader.innerHTML = '';
        if (!items || items.length === 0) {
            accordion.innerHTML = '<div class="alert alert-info">No currently rented items found.</div>';
            return;
        }
        // If filtering by filmId, show film title header
        if (filmId && items.length > 0) {
            const filmName = items[0].film_name;
            filteredMovieHeader.innerHTML = `<h2 class='mb-3'><a href="/Film?v=${filmId}">${filmName}</a> copies that are rented</h2>
                <button id='viewAllRentedBtn' class='btn btn-outline-secondary mb-2'>View All Rented</button>`;
            setTimeout(() => {
                const btn = document.getElementById('viewAllRentedBtn');
                if (btn) {
                    btn.addEventListener('click', () => {
                        const params = new URLSearchParams(window.location.search);
                        params.delete('v');
                        window.location.search = params.toString();
                    });
                }
            }, 0);
        }
        items.forEach((item, idx) => {
            const card = document.createElement('div');
            card.className = 'accordion-item';
            card.innerHTML = `
                <h2 class="accordion-header" id="heading${idx}">
                    <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse${idx}" aria-expanded="false" aria-controls="collapse${idx}">
                        ${item.film_name} (Inventory #${item.inventory_id})<br><span class='text-secondary'>Rental ID: ${item.rental_id}</span>
                    </button>
                </h2>
                <div id="collapse${idx}" class="accordion-collapse collapse" aria-labelledby="heading${idx}" data-bs-parent="#rented-accordion">
                    <div class="accordion-body">
                        <strong>Store:</strong> ${item.store_address}<br>
                        <strong>Customer ID:</strong> ${item.customer_id}<br>
                        <strong>Rental ID:</strong> ${item.rental_id}<br>
                        <strong>Rental Date:</strong> ${new Date(item.rental_date).toLocaleString()}<br>
                        <strong>Return Date:</strong> ${new Date(item.return_date).toLocaleString()}<br>
                        <strong>Film Id:</strong> ${item.film_id}, 
                        <a class="btn btn-sm btn-secondary" href="/Staff/Rented?v=${item.film_id}">Filter</a>
                        <a class="btn btn-sm btn-secondary" href="/Staff/Archive?v=${item.film_id}">View Archive</a>
                        <br>
                        <strong>Film Name:</strong> <a href="/Film?v=${item.film_id}">${item.film_name}</a><br>
                    </div>
                </div>
            `;
            accordion.appendChild(card);
        });
    }

    function fetchRented(filmId) {
        let url = endpointBase;
        if (filmId) url += `&film_id=${filmId}`;
        fetch(url)
            .then(res => res.json())
            .then(data => {
                if (data && data.success !== false && Array.isArray(data)) {
                    renderAccordion(data, filmId);
                } else if (data && data.success !== false && Array.isArray(data.result)) {
                    renderAccordion(data.result, filmId);
                } else {
                    accordion.innerHTML = '<div class="alert alert-danger">Failed to load data.</div>';
                }
            })
            .catch(() => {
                accordion.innerHTML = '<div class="alert alert-danger">Error loading data.</div>';
            });
    }

    filterBtn.addEventListener('click', () => {
        const filmId = filmIdInput.value.trim();
        const params = new URLSearchParams(window.location.search);
        if (filmId) {
            params.set('v', filmId);
        } else {
            params.delete('v');
        }
        window.location.search = params.toString();
    });

    // On page load, set input and fetch
    setFilmIdInputFromQuery();
    const filmId = getFilmIdFromQuery();
    fetchRented(filmId);
});
