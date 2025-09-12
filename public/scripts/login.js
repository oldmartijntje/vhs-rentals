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
                        // setHeaderText();
                        // TODO:
                        // edit the header to be logged in
                        // redirected to staff panel or account page
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