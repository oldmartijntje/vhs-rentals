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
                            <button class="btn btn-secondary btn-sm edit-store-btn" data-id="${inv.inventory_id}" data-store="${inv.store_id}">Edit Store</button>
                            ${inv.rented ? `<button class="btn btn-warning btn-sm return-btn" data-id="${inv.inventory_id}">Return</button>` : ''}
                        </td>
                    `;
                    tbody.appendChild(tr);
                });
                // Edit Store Modal logic
                const editStoreModal = new bootstrap.Modal(document.getElementById('editStoreModal'));
                const editStoreForm = document.getElementById('edit-store-form');
                const editInventoryIdInput = document.getElementById('edit-inventory-id');
                const editStoreIdInput = document.getElementById('edit-store-id');

                inventoryTable.addEventListener('click', e => {
                    if (e.target.classList.contains('edit-store-btn')) {
                        const inventory_id = e.target.getAttribute('data-id');
                        const current_store_id = e.target.getAttribute('data-store');
                        editInventoryIdInput.value = inventory_id;
                        editStoreIdInput.value = current_store_id;
                        editStoreModal.show();
                    }
                });

                editStoreForm.addEventListener('submit', function (e) {
                    e.preventDefault();
                    const inventory_id = editInventoryIdInput.value;
                    const new_store_id = editStoreIdInput.value;
                    const payload = {
                        userId,
                        inventory_id: parseInt(inventory_id),
                        store_id: parseInt(new_store_id),
                        sessionToken: token
                    };
                    fetch('/api/inventory', {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(payload)
                    })
                        .then(res => res.json())
                        .then(result => {
                            if (result.success) {
                                editStoreModal.hide();
                                fetchInventory();
                            } else {
                                alert(`Failed to update store: ${result.message}`);
                            }
                        })
                        .catch(err => console.error('Error updating store:', err));
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
