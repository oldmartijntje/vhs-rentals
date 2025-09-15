let autoLoginData = localStorage.getItem("vhs_rental_user")
let autoLoginTryLogin = false;
let autoLoginUserId = null;
let autoLoginRefreshToken = null;
let autoLoginToken = null;
let autoLoginVersion = null;
let autoLoginAuthenticatedUser = false;
if (autoLoginData != null) {
    try {
        let dataObject = JSON.parse(atob(autoLoginData));
        console.log(dataObject)
        if (dataObject.autoLoginUserId != undefined && dataObject.autoLoginToken != undefined && dataObject.autoLoginVersion != undefined) {
            autoLoginUserId = dataObject.autoLoginUserId;
            autoLoginToken = dataObject.autoLoginToken;
            autoLoginVersion = dataObject.autoLoginVersion
            autoLoginTryLogin = true;
            if (dataObject.autoLoginRefreshToken != undefined) {
                autoLoginRefreshToken = dataObject.autoLoginRefreshToken;
            }
        }

    } catch (e) {

    }
}
if (autoLoginTryLogin) {
    fetch('/api/login/validateToken', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ autoLoginUserId: autoLoginUserId, sessionToken: autoLoginToken })
    }).then(async function (res) {
        const content = await res.json();
        if (res.status == 200 && res.ok == true) {
            autoLoginAuthenticatedUser = true;
            setHeaderText(autoLoginVersion);
        } else {
            if (autoLoginRefreshToken != null) {
                fetch('/api/login/tokenRefresh', {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ autoLoginUserId: autoLoginUserId, autoLoginRefreshToken: autoLoginRefreshToken })
                }).then(async function (res) {
                    if (res.status != 200 || res.ok != true) {
                        localStorage.removeItem("vhs_rental_user");
                        return;
                    }
                    const content2 = await res.json();
                    if (res.status == 200 && res.ok == true && content2.sessionToken != undefined && content2.autoLoginRefreshToken != undefined) {
                        autoLoginData = {
                            autoLoginUserId: content2.autoLoginUserId,
                            autoLoginToken: content2.sessionToken,
                            autoLoginVersion: autoLoginVersion, // for checking whether a user is staff / customer client sided
                            // it doesn't matter if it is tampered with, because GETting autoLoginData won't work if tempered
                            // it will only show you what the staff pages look like without content.
                            expirationMinutes: content2.expirationMinutes,
                            gathering: new Date(),
                            refreshExpirationMinutes: content2.refreshExpirationMinutes,
                            autoLoginRefreshToken: content2.autoLoginRefreshToken

                        }
                        localStorage.setItem("vhs_rental_user", btoa(JSON.stringify(autoLoginData)));
                        autoLoginAuthenticatedUser = true;
                        setHeaderText(autoLoginVersion);
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