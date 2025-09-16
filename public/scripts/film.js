const urlParams = new URLSearchParams(window.location.search);
const film = urlParams.get('v');
if (film == null) {
    window.location.href = "/Films";
}
if (invalidNumber(film, 0, 0, true)) {
    window.location.href = `/.Film?v=${film}`;
}

function compactSetInnerHtmlForEach(list, value) {
    list.forEach((item) => {
        item.innerHTML = value;
    })
}

function splitToBulletPoint(string) {
    let parts = string.split(",");
    let template = "<ul>";
    parts.forEach((item) => {
        template = template + `<li>${item}</li>`;
    });
    template = template + `</ul>`;
    return template;
}

function stringifyAvailabilityAdress(list) {
    let returnable = [];
    list.forEach((item) => {
        returnable.push(`${item.city} ${item.country}: ${item.available}/${item.available + item.currently_rented_out} Available`)
    })
    return returnable.join(", ");
}

const addQueryParamNavElements = document.querySelectorAll(".addQueryParam");
addQueryParamNavElements.forEach((item) => {
    item.href = item.href + `?v=${film}`
});
let authenticatedGetRequest = false;

let data = localStorage.getItem("vhs_rental_user");
let userId;
let token;
if (data != null) {
    try {
        let dataObject = JSON.parse(atob(data));
        if (dataObject.userId != undefined && dataObject.token != undefined) {
            authenticatedGetRequest = true;
            token = dataObject.token;
            userId = dataObject.userId;
        }
    } catch (e) {

    }
}
let url;
if (authenticatedGetRequest) {
    url = `/api/film?id=${film}&sessionToken=${token}&userId=${userId}`
} else {
    url = `/api/film?id=${film}`
}
fetch(url, {
    method: 'GET',
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    }
}).then(async function (res) {
    if (res.status == 200 && res.ok == true) {
        const content = await res.json();
        let titles = document.querySelectorAll(".filmTitleInnerHTML");
        let actors = document.querySelectorAll(".actorInnerHTML");
        let actorsDiv = document.querySelectorAll(".actorsInnerHTML");
        let categories = document.querySelectorAll(".categoryInnerHTML");
        let descriptions = document.querySelectorAll(".descriptionInnerHTML");
        let years = document.querySelectorAll(".yearInnerHTML");
        let rating = document.querySelectorAll(".ratingInnerHTML");
        let price = document.querySelectorAll(".priceInnerHTML");
        let length = document.querySelectorAll(".lenghtInnerHTML");
        let copies = document.querySelectorAll(".copiesInnerHTML");
        compactSetInnerHtmlForEach(titles, content.title);
        compactSetInnerHtmlForEach(actors, content.actors?.split(",")[0]);
        compactSetInnerHtmlForEach(actorsDiv, splitToBulletPoint(content.actors));
        compactSetInnerHtmlForEach(categories, content.category);
        compactSetInnerHtmlForEach(descriptions, content.description);
        compactSetInnerHtmlForEach(years, content.release_year);
        compactSetInnerHtmlForEach(rating, content.rating);
        compactSetInnerHtmlForEach(price, content.price);
        compactSetInnerHtmlForEach(length, content.length);
        let inventoryVersion = content.informationId;
        switch (inventoryVersion) {
            case 0:
                compactSetInnerHtmlForEach(copies, "Couldn't connect to database");
                break;
            case 1:
                compactSetInnerHtmlForEach(copies, (content.inventory ? "There are copies available." : "There are currently no copies available."));
                copies.forEach((el) => el.classList.add("text-center"));
                break;
            case 2:
                compactSetInnerHtmlForEach(copies, `There are currently ${content.inventory.available}/${content.inventory.available + content.inventory.rented} copies available.`);
                copies.forEach((el) => el.classList.add("text-center"));
                break;
            case 3:
                const inventory = Object.values(
                    content.inventory.reduce((acc, item) => {
                        if (!acc[item.store_id]) {
                            acc[item.store_id] = {
                                store_id: item.store_id,
                                currently_rented_out: 0,
                                available: 0
                            };
                        }
                        if (item.currently_rented_out === 0) {
                            acc[item.store_id].available++;
                        } else {
                            acc[item.store_id].currently_rented_out++;
                        }
                        return acc;
                    }, {})
                );
                const merged = inventory.map(store => {
                    const addr = content.addresses.find(a => a.store_id === store.store_id);
                    return {
                        store_id: store.store_id,
                        address: addr?.address || null,
                        city: addr?.city_name || null,
                        country: addr?.country_name || null,
                        currently_rented_out: store.currently_rented_out,
                        available: store.available
                    };
                });
                compactSetInnerHtmlForEach(copies, splitToBulletPoint(stringifyAvailabilityAdress(merged)));
                break;
            default:

        }
    } else {
        showErrorAndRedirect("/", "errorModal")
    }
})