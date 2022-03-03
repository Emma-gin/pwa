if ("serviceWorker" in navigator) {
    navigator.serviceWorker
        .register("/serviceWorker.js")
        .then()
        .catch();
}


const container = document.querySelector(".container");
const cities = [
    { name: "Lyon", image: "images/lyon.jpg" },
    { name: "Grenoble", image: "images/grenoble.jpg" },
    { name: "Le Havre", image: "images/leHavre.jpg" },
    { name: "Marseille", image: "images/marseille.jpg" },
    { name: " Paris", image: "images/paris.jpg" },
    { name: " Nantes", image: "images/nantes.jpg" },
    { name: "Nice", image: "images/nice.jpg" },
    { name: "Strasbourg", image: "images/strasbourg.jpg" },
    { name: "Toulouse", image: "images/toulouse.jpg" },
];

const showCities= () => {
    let output = "";
    cities.forEach(
        ({ name, image }) =>
            (output += `
                <div class="card">
                <img class="card--avatar" src=${image} />
                <h1 class="card--title">${name}</h1>
                </div>
                `)
    );
    container.innerHTML = output;
};

document.addEventListener("DOMContentLoaded", showCities);

/* OFFLINE / ONLINE */

function updateStatus() {
    if (navigator.onLine) {
        document.location.href = "/index.html";
    } else {
        document.location.href = "/offline.html";
    }
}

window.addEventListener("online", updateStatus);
window.addEventListener("offline", updateStatus);

//banner install

let deferredPrompt;
const installBanner = document.querySelector(".banner_install");
installBanner.style.display = "none";

window.addEventListener("beforeinstallprompt", (e) => {
    // Prevent Chrome 67 and earlier from automatically showing the prompt
    e.preventDefault();
    // Stash the event so it can be triggered later.
    deferredPrompt = e;
    // Update UI to notify the user they can add to home screen
    installBanner.style.display = "block";

    installBanner.addEventListener("click", () => {
        // hide our user interface that shows our A2HS button
        installBanner.style.display = "none";
        // Show the prompt
        deferredPrompt.prompt();
        // Wait for the user to respond to the prompt
        deferredPrompt.userChoice.then((choiceResult) => {
            if (choiceResult.outcome === "accepted") {
                console.log("User accepted the A2HS prompt");
            } else {
                console.log("User dismissed the A2HS prompt");
            }
            deferredPrompt = null;
        });
    });
});

//notifications

let notifs_banner = document.querySelector(".banner_notifs");
if (Notification.permission !== "default") {
    notifs_banner.style.display = "none";
}

notifs_banner.addEventListener("click", function () {
    Notification.requestPermission().then(function (result) {
        if (result !== "default") {
            notifs_banner.style.display = "none";
        }
    });
});

//geolocalisation

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition, showError);
    } else {
        alert("Ce navigateur ne permet pas la géolocalisation.");
    }
}
function showPosition(position) {

    let latitudePara = document.getElementById('latitude');
    let longitudePara = document.getElementById('longitude');
    let altitudePara = document.getElementById('altitude');

    let latitude = "Latitude: " + position.coords.latitude;
    let longitude = "\nLongitude: " + position.coords.longitude;
    let altitude = "\nAltitude: " + position.coords.altitude;

    latitudePara.innerHTML = latitude;
    longitudePara.innerHTML = longitude;
    altitudePara.innerHTML = altitude;


    let map = new maplibregl.Map({
        container: "mapid",
        style: "https://api.jawg.io/styles/2d0503e9-f78d-4997-92bc-4732cedb4258.json?access-token=9Bxa3ORRdm98iHlKthRllCUs7OOGzPdSfVpY7rdLMpwpang4QGEZDclpiEkRAETS",
        zoom: 12,
        center: [position.coords.longitude, position.coords.latitude],
    });
    maplibregl.setRTLTextPlugin(
        "https://unpkg.com/@mapbox/mapbox-gl-rtl-text@0.2.3/mapbox-gl-rtl-text.min.js"
    );


    // Marker with custom icon
    const el = document.createElement("div");
    el.className = "marker";
    new maplibregl.Marker(el)
        .setLngLat([position.coords.longitude, position.coords.latitude])
        .addTo(map);

    //add search bar
    let jawgPlaces = new JawgPlaces.MapLibre({});
    // search input on map
    map.addControl(jawgPlaces);
}
getLocation();


function showError(error) {
    switch (error.code) {
        case error.PERMISSION_DENIED:
            alert("Vous avez refusé la localisation.");
            break;
        case error.POSITION_UNAVAILABLE:
            alert("Votre localisation est indisponible pour le moment");
            break;
        case error.TIMEOUT:
            alert("Merci de relancer votre demande de localisation.");
            break;
        case error.UNKNOWN_ERROR:
            alert("Une erreur est survenue, merci de rééssayer ultérieurement.");
            break;
    }
}


