const urlParams = new URLSearchParams(window.location.search);
const film = urlParams.get('v');
if (film == null) {
    window.location.href = "/Films";
}
if (invalidNumber(film, 0, 0, true)) {
    window.location.href = `/.Film?v=${film}`;
}

const addQueryParamNavElements = document.querySelectorAll(".addQueryParam");
addQueryParamNavElements.forEach((item) => {
    item.href = item.href + `?v=${film}`
});
let authenticatedGetRequest = false;

let data = localStorage.getItem("vhs_rental_user");
if (data != null) {
    try {
        let dataObject = JSON.parse(atob(data));
        if (dataObject.userId != undefined && dataObject.token != undefined) {
            authenticatedGetRequest = true;
        }
    } catch (e) {

    }
}
// fetch('/api/login/validateToken', {
//     method: 'GET',
//     headers: {
//         'Accept': 'application/json',
//         'Content-Type': 'application/json'
//     },
//     body: JSON.stringify({ autoLoginUserId: autoLoginUserId, sessionToken: autoLoginToken })
// }).then(async function (res) {
//     const content = await res.json();
//     if (res.status == 200 && res.ok == true) {
//         autoLoginAuthenticatedUser = true;
//         setHeaderText(autoLoginVersion);
//     }
// })