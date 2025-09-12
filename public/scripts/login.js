let usernameField = document.getElementById('email');
let passwordField = document.getElementById('password');
let rememberMe = document.getElementById('rememberMe');
let errorLoginText = document.getElementById('errorLoginText')

function submitLogin(version) {
    if (passwordField != null && passwordField != null) {
        if (usernameField.value && passwordField.value) {
            fetch('/api/login', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email: usernameField.value, password: passwordField.value, role: (version == 1 ? "customer" : "staff") })
            }).then(async function (res) {
                if (res.status == 200 && res.ok == true) {
                    const content = await res.json();
                    console.log(content)
                    if (content.sessionToken != undefined && content.userId != undefined) {
                        data = {
                            userId: content.userId,
                            token: content.sessionToken,
                            version: version, // for checking whether a user is staff / customer client sided
                            // it doesn't matter if it is tampered with, because GETting data won't work if tempered
                            // it will only show you what the staff pages look like without content.
                            expirationMinutes: content.expirationMinutes,
                            gathering: new Date()

                        }
                        if (rememberMe.checked && content.refreshToken != undefined) {
                            data.refreshExpirationMinutes = content.refreshExpirationMinutes,
                                data.refreshToken = content.refreshToken;
                        }
                        console.log(data)
                        localStorage.setItem("vhs_rental_user", btoa(JSON.stringify(data)));
                        try {
                            if (errorLoginText) {
                                errorLoginText.style.display = "none";
                            }
                        } catch (e) {

                        }
                        authenticatedUser = true;
                        if (version == 1) {
                            window.location.href = "/Account";
                        } else if (version == 2) {
                            window.location.href = "/Staff/Dashboard";
                        } else {
                            window.location.href = "/";
                            // really trying to make life difficult for ppl that tinker with localstorage.
                        }
                    } else {
                        try {
                            if (errorLoginText) {
                                errorLoginText.style.display = "block";
                                errorLoginText.children[0].innerText = content.message;
                                console.log(content.message)
                            }
                        } catch (e) {

                        }
                    }
                    return;
                }
                res.text().then(function (text) {
                    if (errorLoginText) {
                        errorLoginText.style.display = "block";
                        errorLoginText.children[0].innerText = text;
                    }
                })
            });
        }
    }
}