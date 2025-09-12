let usernameField = document.getElementById('username')
let passwordField = document.getElementById('password')
let loginHeaderNav = document.getElementById('loginOrAccountNav')
let errorLoginText = document.getElementById('errorLoginText')
let rememberMe = document.getElementById('rememberMe')
let data = localStorage.getItem("vhs_rental_user")
let tryLogin = false;
let username = null;
let refreshToken = null;
let token = null;
let authenticatedUser = false;
if (data != null) {
    try {
        let dataObject = JSON.parse(data);
        if (dataObject.username != undefined && dataObject.token != undefined) {
            username = dataObject.username;
            token = dataObject.token;
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
        body: JSON.stringify({ username: username, sessionToken: token })
    }).then(async function (res) {
        const content = await res.json();
        writeLog(res, "/validateToken");
        writeLog(content, "/validateToken");
        if (res.status == 200 && res.ok == true) {
            authenticatedUser = true;
            setHeaderText();
        } else {
            if (refreshToken != null) {
                fetch('/api/login/refreshToken', {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ username: username, refreshToken: refreshToken })
                }).then(async function (res) {
                    writeLog(res, "/refreshToken");
                    const content2 = await res.json();
                    writeLog(content2, "/refreshToken");
                    if (res.status == 200 && res.ok == true && content2.sessionToken != undefined && content2.refreshToken != undefined) {
                        data = {
                            username: username,
                            token: content2.sessionToken,
                            refreshToken: content2.refreshToken
                        };
                        localStorage.setItem("vhs_rental_user", JSON.stringify(data));
                        authenticatedUser = true;
                        setHeaderText();
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

function setHeaderText() {
    // set the header button
    loginHeaderNav.children[0].innerHTML = "Dashboard"
    loginHeaderNav.children[0].href = "/dashboard"
    if (loginHeaderNav.children[0].classList.contains("active")) {
        location.href = "/dashboard";
    }
}

function submitLogin(version) {
    console.log(version) // 1 = customer; 2 = staff
    if (passwordField != null && passwordField != null) {
        if (usernameField.value && passwordField.value) {
            fetch('/api/login', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username: usernameField.value, password: passwordField.value })
            }).then(async function (res) {
                const content = await res.json();
                if (res.status == 200 && res.ok == true && content.sessionToken != undefined) {
                    data = {
                        username: usernameField.value,
                        token: content.sessionToken
                    }
                    if (rememberMe.checked && content.refreshToken != undefined) {
                        data.refreshToken = content.refreshToken;
                    }
                    localStorage.setItem("vhs_rental_user", JSON.stringify(data));
                    try {
                        if (errorLoginText) {
                            errorLoginText.style.display = "none";
                        }
                    } catch (e) {

                    }
                    authenticatedUser = true;
                    setHeaderText();
                } else {
                    try {
                        if (errorLoginText) {
                            errorLoginText.style.display = "block";
                            errorLoginText.children[0].innerText = content.message;
                        }
                    } catch (e) {

                    }
                }
                writeLog(res, "/login");
                writeLog(content, "/login");
            });


        }
    }
}