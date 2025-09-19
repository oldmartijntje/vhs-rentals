const urlParams = new URLSearchParams(window.location.search);
const film_id = urlParams.get('v');

const inventoryTable = document.getElementById('inventory-table');
const addInventoryForm = document.getElementById('add-inventory-form');

function fetchInventory() {
    fetch(`/api/inventory?userId=${userId}&sessionToken=${token}&film_id=${film_id}`)
        .then(res => res.json())
        .then(data => {
            const tbody = inventoryTable.querySelector('tbody');
            tbody.innerHTML = '';
            if (Array.isArray(data)) {
                let title = document.getElementById("filmName");
                title.innerHTML = data[0].film_name;
                title.href = "/Film?v=" + data[0].film_id;
                data.forEach(inv => {
                    const tr = document.createElement('tr');
                    tr.innerHTML = `
                        <td>${inv.inventory_id}</td>
                        <td>${inv.store_id}</td>
                        <td>${inv.store_address}</td>
                        <td>${inv.rented ? `Yes, user ${inv.last_customer_id}` : 'No'}</td>
                        <td>
                            ${inv.rented ? `<button class="btn btn-warning btn-sm return-btn" data-id="${inv.inventory_id}">Return</button>` : ''}
                        </td>
                    `;
                    tbody.appendChild(tr);
                });
            }
        });
}

addInventoryForm.addEventListener('submit', e => {
    e.preventDefault();
    const store_id = document.getElementById('store_id').value;
    const payload = {
        userId,
        film_id: parseInt(film_id),
        store_id: parseInt(store_id),
        sessionToken: token
    };
    fetch('/api/inventory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    })
        .then(res => res.json())
        .then(result => {
            if (result.id) {
                fetchInventory();
                addInventoryForm.reset();
            } else {
                alert(`Failed to add inventory: ${result.message}`);
            }
        })
        .catch(err => console.error('Error adding inventory:', err));
});

inventoryTable.addEventListener('click', e => {
    if (e.target.classList.contains('return-btn')) {
        const inventory_id = e.target.getAttribute('data-id');
        const payload = {
            userId,
            inventory_id: parseInt(inventory_id),
            sessionToken: token
        };
        fetch('/api/inventory/return', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        })
            .then(res => res.json())
            .then(result => {
                if (result.success) {
                    fetchInventory();
                } else {
                    alert(`Failed to return inventory: ${result.message}`);
                }
            })
            .catch(err => console.error('Error returning inventory:', err));
    }
});

fetchInventory();
