// Loads customer account info and populates the account page
(function () {
    let url;
    if (true) {
        url = `/api/account?userId=${userId}&sessionToken=${token}`;
        fetch(url, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        }).then(async function (res) {
            if (res.status == 200 && res.ok == true) {
                const customer = await res.json();
                document.querySelectorAll('.list-group-item')[0].innerHTML = `<strong>Name:</strong> ${customer.first_name} ${customer.last_name}`;
                document.querySelectorAll('.list-group-item')[1].innerHTML = `<strong>Email:</strong> ${customer.email}`;
                document.querySelectorAll('.list-group-item')[2].innerHTML = `<strong>Address:</strong> ${customer.address.address}, ${customer.address.city_name}, ${customer.address.country_name}`;
                document.querySelectorAll('.list-group-item')[3].innerHTML = `<strong>Account Created:</strong> ${customer.create_date}`;
                document.querySelectorAll('.list-group-item')[4].innerHTML = `<strong>Last Update:</strong> ${customer.last_update}`;
                document.querySelectorAll('.list-group-item')[5].innerHTML = `<strong>Status:</strong> ${customer.active ? "Active" : "Inactive"}`;
            } else {
                showErrorAndRedirect("/", "errorModal");
            }
        });
    }
})();
