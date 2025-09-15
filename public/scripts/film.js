const urlParams = new URLSearchParams(window.location.search);
const film = urlParams.get('v');
if (film == null) {
    window.location.href = "/Films"
}