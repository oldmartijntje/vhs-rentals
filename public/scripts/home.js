document.addEventListener('DOMContentLoaded', function () {
    // Color button logic (if present)
    const btn = document.getElementById('colorBtn');
    if (btn) {
        btn.addEventListener('click', function () {
            document.body.style.backgroundColor =
                '#' + Math.floor(Math.random() * 16777215).toString(16);
        });
    }

    // Newest Arrivals dynamic loading
    const newestArrivalsContainer = document.querySelector('[data-newest-arrivals]');
    if (newestArrivalsContainer) {
        fetch('/api/film/newest?amount=3')
            .then(res => res.json())
            .then(films => {
                newestArrivalsContainer.innerHTML = '';
                films.forEach(film => {
                    const card = document.createElement('div');
                    card.className = 'card';
                    card.style.width = '18rem';
                    card.innerHTML = `
                        <img src="/static/images/vhs.svg" class="card-img-top card-image-size" alt="...">
                        <div class="card-body d-flex flex-column">
                            <h5 class="card-title">${film.title}</h5>
                            <p class="card-text flex-grow-1">${film.description}</p>
                            <span class="text-secondary mb-2">${film.release_year}</span>
                            <a href="/Film?v=${film.film_id}" class="btn btn-info">Details</a>
                        </div>
                    `;
                    newestArrivalsContainer.appendChild(card);
                });
            })
            .catch(err => {
                newestArrivalsContainer.innerHTML = '<div class="text-danger">Failed to load newest arrivals.</div>';
            });
    }
});
