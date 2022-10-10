const ipInput = document.getElementById('ip_search');
const ipAddressEL = document.getElementById('ip-address')
const locationEl = document.getElementById('location')
const timezoneEL = document.getElementById('timezone')
const ispEL = document.getElementById('isp')
const searchBtn = document.getElementById('search-btn')


// ON the initial load, the ip address of the client will be used
window.onload = () => showDetailsAndMap()

// searching for the ip address provided by the user
searchBtn.addEventListener('click', () => showDetailsAndMap())


// Retrieving the IP Address from the IPify API
async function getIPAddressDetails(IPAddress) {
    const APIKey = 'at_K1sHwhLxBNoOs8r5x74fsGTXLJnit'
    const URL = `https://geo.ipify.org/api/v2/country,city,vpn?apiKey=${APIKey}&ipAddress=${IPAddress}`

    const response = await fetch(URL)
    const data = await response.json()

    return {
        ip: data.ip,
        location: `${data.location.city}, ${data.location.region}`,
        timezone: data.location.timezone,
        isp: data.isp,
        latitude: data.location.lat,
        longitude: data.location.lng
    }
}
 
// Setting up the map with Leaflet JS
function updateMapView(lat, lng) {
    const map = L.map('map').setView([lat, lng], 13);

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);

    L.latLng(lat, lng);

    //Setting up the icon
    const myIcon = L.icon({
        iconUrl: '../images/icon-location.svg',
        iconSize: [38, 50],
        iconAnchor: [22, 94],
        popupAnchor: [-3, -76],
        shadowSize: [68, 95],
        shadowAnchor: [22, 94]
    });

    L.marker([lat, lng], {icon: myIcon}).addTo(map);
}

// Updating the UI with the IP Address details and MAP location
function showDetailsAndMap() {
    const requestedIP = ipInput.value
    getIPAddressDetails(requestedIP)
        .then(data => {
            ipAddressEL.textContent = data.ip
            locationEl.textContent = data.location
            timezoneEL.textContent = data.timezone
            ispEL.textContent = data.isp

            updateMapView(data.latitude, data.longitude)
        })
        .catch(error => console.log(error))
}