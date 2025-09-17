const urlParams = new URLSearchParams(window.location.search);
const film = urlParams.get('v');

let isNewFilm = !film;

if (!isNewFilm && invalidNumber(film, 0, 0, true)) {
    window.location.href = `/.Staff/Edit/Film?v=${film}`;
}

const addQueryParamNavElements = document.querySelectorAll(".addQueryParam");
addQueryParamNavElements.forEach((item) => {
    item.href = item.href + `?v=${film}`
});

let data = localStorage.getItem("vhs_rental_user");
let userId;
let token;
let authenticated = false;

if (data != null) {
    try {
        let dataObject = JSON.parse(atob(data));
        if (dataObject.userId != undefined && dataObject.token != undefined && dataObject.version == 2) {
            authenticated = true;
            token = dataObject.token;
            userId = dataObject.userId;
        } else if (dataObject.userId != undefined && dataObject.token != undefined) {
            showErrorAndRedirect("/", "authorizationModal");
        } else {
            showErrorAndRedirect("/Login", "loginModal");
        }
    } catch (e) { }
} else {
    showErrorAndRedirect("/Login", "loginModal");
}

if (authenticated) {
    const filmForm = document.getElementById('film-form');
    const deleteBtn = document.getElementById('delete-film');
    const inventoryTable = document.querySelector('#inventory-table');
    const addressesTable = document.querySelector('#addresses-table');
    const inventoryHeader = inventoryTable.previousElementSibling;
    const addressesHeader = addressesTable.previousElementSibling;
    const pageTitle = document.querySelector('h1');
    const submitBtn = filmForm.querySelector('button[type="submit"]');

    if (isNewFilm) {
        // New film: adjust UI
        deleteBtn.style.display = 'none';
        inventoryTable.style.display = 'none';
        addressesTable.style.display = 'none';
        inventoryHeader.style.display = 'none';
        addressesHeader.style.display = 'none';
        pageTitle.textContent = "Add Film";
        submitBtn.textContent = "Add Film";

        // Handle form submission for POST
        filmForm.addEventListener('submit', e => {
            e.preventDefault();

            const newFilm = {
                title: document.getElementById('title').value,
                description: document.getElementById('description').value,
                category: document.getElementById('category').value,
                price: parseFloat(document.getElementById('price').value),
                length: parseInt(document.getElementById('length').value),
                rating: document.getElementById('rating').value,
                release_year: parseInt(document.getElementById('release_year').value),
                actors: document.getElementById('actors').value,
                userId: userId,
                sessionToken: token
            };

            fetch('/api/film', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newFilm)
            })
                .then(res => res.json())
                .then(result => {
                    if (result.id) {
                        // Redirect to edit page for newly created film
                        window.location.href = `/Staff/Edit/Film?v=${result.id}`;
                    } else {
                        alert(`Failed to create film: ${result.message}`);
                    }
                })
                .catch(err => console.error('Error creating film:', err));
        });

    } else {
        // Existing film: fetch data and populate form
        let url = `/api/film?id=${film}&sessionToken=${token}&userId=${userId}`;

        fetch(url, {
            method: 'GET',
            headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' }
        })
            .then(res => res.json())
            .then(filmData => {
                // Populate form fields
                document.getElementById('title').value = filmData.title;
                document.getElementById('description').value = filmData.description;
                document.getElementById('category').value = filmData.category;
                document.getElementById('price').value = filmData.price;
                document.getElementById('length').value = filmData.length;
                document.getElementById('rating').value = filmData.rating;
                document.getElementById('release_year').value = filmData.release_year;
                document.getElementById('actors').value = filmData.actors;

                // Populate inventory table
                if (filmData.inventory != null && filmData.inventory != 404) {
                    console.log(filmData.inventory)
                    inventoryTable.querySelector('tbody').innerHTML = filmData.inventory.map(inv => `
                    <tr>
                        <td>${inv.inventory_id}</td>
                        <td>${inv.store_id}</td>
                        <td>${inv.currently_rented_out}</td>
                    </tr>
                `).join('');

                    // Populate addresses table
                    addressesTable.querySelector('tbody').innerHTML = filmData.addresses.map(addr => `
                    <tr>
                        <td>${addr.address}${addr.address2 ? ', ' + addr.address2 : ''}</td>
                        <td>${addr.district}</td>
                        <td>${addr.city_name}</td>
                        <td>${addr.country_name}</td>
                    </tr>
                    `).join('');

                }
                // Handle form submission for PUT
                filmForm.addEventListener('submit', e => {
                    e.preventDefault();

                    const updatedFilm = {
                        title: document.getElementById('title').value,
                        description: document.getElementById('description').value,
                        category: document.getElementById('category').value,
                        price: parseFloat(document.getElementById('price').value),
                        length: parseInt(document.getElementById('length').value),
                        rating: document.getElementById('rating').value,
                        release_year: parseInt(document.getElementById('release_year').value),
                        actors: document.getElementById('actors').value,
                        userId: userId,
                        sessionToken: token,
                        film_id: film
                    };

                    fetch(`/api/film?id=${filmData.FID}`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(updatedFilm)
                    })
                        .then(res => {
                            if (res.ok) {
                                alert('Film updated successfully!');
                                window.location.href = `/Staff/Edit/Film?v=${film_id}`;
                            } else {
                                alert(`Failed to update film: ${result.message}`);
                            }
                        });
                });

                // Handle deletion
                deleteBtn.addEventListener('click', () => {
                    if (confirm('Are you sure you want to delete this film?')) {
                        fetch(`/api/film?id=${filmData.FID}&sessionToken=${token}&userId=${userId}`, {
                            method: 'DELETE',
                            headers: { 'Content-Type': 'application/json' }
                        })
                            .then(res => {

                                if (res.ok) {
                                    alert('Film deleted successfully!');
                                    window.location.href = '/films';
                                } else {
                                    alert(`Failed to delete film: ${result.message}`);
                                }
                            });
                    }
                });
            })
            .catch(err => console.error('Error fetching film:', err));
    }
}
