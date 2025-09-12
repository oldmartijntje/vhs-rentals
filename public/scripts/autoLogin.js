let loginHeaderNav = document.getElementById('loginOrAccountNav')
let data = localStorage.getItem("vhs_rental_user")
let tryLogin = false;
let userId = null;
let refreshToken = null;
let token = null;
let version = null;
let authenticatedUser = false;
if (data != null) {
    try {
        let dataObject = JSON.parse(atob(data));
        console.log(dataObject)
        if (dataObject.userId != undefined && dataObject.token != undefined && dataObject.version != undefined) {
            userId = dataObject.userId;
            token = dataObject.token;
            version = dataObject.version
            tryLogin = true;
            if (dataObject.refreshToken != undefined) {
                refreshToken = dataObject.refreshToken;
            }
        }

    } catch (e) {

    }
}
if (tryLogin) {
    fetch('/api/login/validateToken', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userId: userId, sessionToken: token })
    }).then(async function (res) {
        const content = await res.json();
        if (res.status == 200 && res.ok == true) {
            authenticatedUser = true;
            setHeaderText(version);
        } else {
            if (refreshToken != null) {
                fetch('/api/login/tokenRefresh', {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ userId: userId, refreshToken: refreshToken })
                }).then(async function (res) {
                    if (res.status != 200 || res.ok != true) {
                        localStorage.removeItem("vhs_rental_user");
                        return;
                    }
                    const content2 = await res.json();
                    if (res.status == 200 && res.ok == true && content2.sessionToken != undefined && content2.refreshToken != undefined) {
                        data = {
                            userId: content2.userId,
                            token: content2.sessionToken,
                            version: version, // for checking whether a user is staff / customer client sided
                            // it doesn't matter if it is tampered with, because GETting data won't work if tempered
                            // it will only show you what the staff pages look like without content.
                            expirationMinutes: content2.expirationMinutes,
                            gathering: new Date(),
                            refreshExpirationMinutes: content2.refreshExpirationMinutes,
                            refreshToken: content2.refreshToken

                        }
                        localStorage.setItem("vhs_rental_user", btoa(JSON.stringify(data)));
                        authenticatedUser = true;
                        setHeaderText(version);
                    } else {
                        localStorage.removeItem("vhs_rental_user");
                    }
                });
            } else {
                localStorage.removeItem("vhs_rental_user");
            }
        }
    });
}
setHeaderText(0)

function setHeaderText(version) {
    let loginLinks = document.querySelectorAll(".login-link");
    let userLinks = document.querySelectorAll(".loggedin-link");
    let customerLinks = document.querySelectorAll(".customer-link");
    let staffLinks = document.querySelectorAll(".staff-link");
    if (version == 1 || version == 2) {
        loginLinks.forEach((el) => {
            el.style.display = "none";
        });
        userLinks.forEach((el) => {
            el.style.display = "";
        });
    } else {
        loginLinks.forEach((el) => {
            el.style.display = "";
        });
        userLinks.forEach((el) => {
            el.style.display = "none";
        });
    }
    if (version == 1) {
        customerLinks.forEach((el) => {
            el.style.display = "";
        });
    } else if (version == 2) {
        staffLinks.forEach((el) => {
            el.style.display = "";
        });
    } else {
        customerLinks.forEach((el) => {
            el.style.display = "none";
        });
        staffLinks.forEach((el) => {
            el.style.display = "none";
        });
    }
}