const urlParams = new URLSearchParams(window.location.search);
const film = urlParams.get('v');
if (film == null) {
    window.location.href = "/Films";
}
if (invalidNumber(film, 0, 0, true)) {
    window.location.href = `/.Film?v=${film}`;
}

function compactSetInnerHtmlForEach(list, value) {
    console.log(value, list.length)
    list.forEach((item) => {
        console.log(value, item)
        item.innerHTML = value;
    })
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
fetch(`/api/film?id=${film}`, {
    method: 'GET',
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    }
}).then(async function (res) {
    const content = await res.json();
    if (res.status == 200 && res.ok == true) {
        let titles = document.querySelectorAll(".filmTitleInnerHTML");
        let actors = document.querySelectorAll(".actorInnerHTML");
        let categories = document.querySelectorAll(".categoryInnerHTML");
        let descriptions = document.querySelectorAll(".descriptionInnerHTML");
        let years = document.querySelectorAll(".yearInnerHTML");
        compactSetInnerHtmlForEach(titles, content.title)
        compactSetInnerHtmlForEach(actors, content.actors?.split(",")[0])
        compactSetInnerHtmlForEach(categories, content.category)
        compactSetInnerHtmlForEach(descriptions, content.description)
        compactSetInnerHtmlForEach(years, content.release_year)
        console.log(content)
    }
})