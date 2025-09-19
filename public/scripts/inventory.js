const urlParams = new URLSearchParams(window.location.search);
const filmId = urlParams.get('v');
if (!filmId || !userId || !token) {
    document.getElementById('inventory-list').innerHTML = '<div class="alert alert-danger">Missing film or user info.</div>';
} else {
    fetch(`/api/inventory?userId=${userId}&sessionToken=${token}&film_id=${filmId}`)
        .then(async res => {
            if (res.ok) {
                const items = await res.json();
                renderInventory(items);
            } else {
                document.getElementById('inventory-list').innerHTML = '<div class="alert alert-danger">Failed to load inventory.</div>';
            }
        });
}

// Navigation buttons
window.addEventListener('DOMContentLoaded', () => {
    const filmId = new URLSearchParams(window.location.search).get('v');
    document.getElementById('view-film-btn').onclick = () => {
        window.location.href = `/Film?v=${filmId}`;
    };
    document.getElementById('rented-btn').onclick = () => {
        window.location.href = `/Rented`;
    };
    document.getElementById('history-btn').onclick = () => {
        window.location.href = `/Customer/History?v=${filmId}`;
    };
});
function renderInventory(items) {
    const inventoryList = document.getElementById('inventory-list');
    if (!items.length) {
        inventoryList.innerHTML = '<div class="alert alert-warning">No copies found.</div>';
        return;
    }
    // Show film title above the table
    const filmTitle = items[0].film_name ? items[0].film_name : '';
    let html = '';
    if (filmTitle) {
        html += `<h2 class="text-center mb-3">Copies of ${filmTitle}</h2>`;
    }
    html += '<table class="table table-dark table-striped"><thead><tr><th>Inventory ID</th><th>Store</th><th>Address</th><th>Costs Per Week</th><th>Status</th><th></th></tr></thead><tbody>';
    items.forEach(item => {
        html += `<tr>
            <td>${item.inventory_id}</td>
            <td>${item.store_id}</td>
            <td>${item.store_address}</td>
            <td><span class="text-info">€${item.film_price}</span></td>
            <td>${item.rented === 0 ? '<span class="text-success">Available</span>' : (item.you ? '<span class="text-warning">Rented by you</span>' : '<span class="text-danger">Rented</span>')}</td>
            <td>${item.rented === 0 ? `<button class="btn btn-primary rent-btn" data-id="${item.inventory_id}">Rent</button>` : ''}
${item.you ? `<button class="btn btn-danger btn-sm return-btn" data-id="${item.inventory_id}">Return</button>` : ''}</td>
        </tr>`;
    });
    html += '</tbody></table>';
    html += '<div id="return-message" class="mt-3"></div>';
    inventoryList.innerHTML = html;
    document.querySelectorAll('.rent-btn').forEach(btn => {
        btn.addEventListener('click', function () {
            rentCopy(this.getAttribute('data-id'));
        });
    });
    document.querySelectorAll('.return-btn').forEach(btn => {
        btn.addEventListener('click', function () {
            returnCopy(this.getAttribute('data-id'));
        });
    });
}
function rentCopy(inventoryId) {
    fetch('/api/inventory/rent', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userId, inventory_id: Number(inventoryId), sessionToken: token })
    }).then(async res => {
        const result = await res.json();
        if (res.ok && result.success) {
            location.reload()
        } else {
            document.getElementById('rental-confirmation').style.display = '';
            document.getElementById('rental-confirmation').innerHTML = `<div class="alert alert-danger">Rental failed.</div>`;
        }
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
            msgDiv.innerHTML = '<div class="alert alert-success">Returned successfully!</div>';
            setTimeout(() => location.reload(), 1500);
        } else {
            msgDiv.innerHTML = `<div class="alert alert-danger">${result.message || 'Return failed.'}</div>`;
        }
    });
}
