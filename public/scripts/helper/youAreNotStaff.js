let data = localStorage.getItem("vhs_rental_user");

let userId;
let token;
if (data != null) {
    try {
        let dataObject = JSON.parse(atob(data));
        if (dataObject.userId != undefined && dataObject.token != undefined && dataObject.version == 2) {
            userId = dataObject.userId;
            token = dataObject.token;
        } else if (dataObject.userId != undefined && dataObject.token != undefined) {
            showErrorAndRedirect("/", "authorizationModal");
        } else {
            showErrorAndRedirect("/Login", "loginModal");
        }
    } catch (e) { }
} else {
    showErrorAndRedirect("/Login", "loginModal");
}