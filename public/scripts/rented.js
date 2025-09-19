const data = localStorage.getItem("vhs_rental_user");
let userId, token;
if (data != null) {
    try {
        let dataObject = JSON.parse(atob(data));
        if (dataObject.userId && dataObject.token) {
            userId = dataObject.userId;
            token = dataObject.token;
        }
    } catch (e) { }
}
if (!userId || !token) {
    document.getElementById('rented-list').innerHTML = '<div class="alert alert-danger">Missing user info.</div>';
} else {
    fetch(`/api/inventory/my-rentals?userId=${userId}&sessionToken=${token}`)
        .then(async res => {
            if (res.ok) {
                const items = await res.json();
                renderRented(items);
            } else {
                document.getElementById('rented-list').innerHTML = '<div class="alert alert-danger">Failed to load rentals.</div>';
            }
        });
}
function renderRented(items) {
    const rentedList = document.getElementById('rented-list');
    if (!items.length) {
        rentedList.innerHTML = '<div class="alert alert-warning">No current rentals found.</div>';
        return;
    }
    let html = '<table class="table table-dark table-striped"><thead><tr><th>Film</th><th>Rental ID</th><th>Inventory ID</th><th>Rental Date</th><th>Return Date</th><th></th><th></th></tr></thead><tbody>';
    items.forEach(item => {
        html += `<tr>
            <td>${item.film_name}</td>
            <td>${item.rental_id}</td>
            <td>${item.inventory_id}</td>
            <td>${new Date(item.rental_date).toLocaleString()}</td>
            <td>${new Date(item.return_date).toLocaleString()}</td>
            <td><a href="/Film?v=${item.film_id}" class="btn btn-info btn-sm">View</a></td>
            <td><button class="btn btn-danger btn-sm return-btn" data-id="${item.inventory_id}">Return</button></td>
        </tr>`;
    });
    html += '</tbody></table>';
    html += '<div id="return-message" class="mt-3"></div>';
    rentedList.innerHTML = html;
    document.querySelectorAll('.return-btn').forEach(btn => {
        btn.addEventListener('click', function () {
            returnCopy(this.getAttribute('data-id'));
        });
    });
}

function returnCopy(inventoryId) {
    fetch('/api/inventory/return-user', {
        method: 'PUT',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userId, inventory_id: Number(inventoryId), sessionToken: token })
    }).then(async res => {
        const result = await res.json();
        const msgDiv = document.getElementById('return-message');
        if (res.ok && result.success) {
            location.reload()
        } else {
            msgDiv.innerHTML = `<div class="alert alert-danger">${result.message || 'Return failed.'}</div>`;
        }
    });
}
