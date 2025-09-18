// Loads customer account info and populates the account page
(function () {
    let authenticatedGetRequest = false;
    let data = localStorage.getItem("vhs_rental_user");
    let userId;
    let token;
    if (data != null) {
        try {
            let dataObject = JSON.parse(atob(data));
            if (dataObject.userId != undefined && dataObject.token != undefined && dataObject.version == 1) {
                authenticated = true;
                token = dataObject.token;
                userId = dataObject.userId;
                authenticatedGetRequest = true;
            } else if (dataObject.userId != undefined && dataObject.token != undefined) {
                showErrorAndRedirect("/", "authorizationModal");
            } else {
                showErrorAndRedirect("/Login", "loginModal");
            }
        } catch (e) { }
    } else {
        showErrorAndRedirect("/Login", "loginModal");
    }
    let url;
    if (authenticatedGetRequest) {
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
