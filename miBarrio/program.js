document.getElementById("barrio").innerText = "TIMIZA";
document.getElementById("localidad").innerText = "KENNEDY";

document.addEventListener("DOMContentLoaded", function() {
    let mapInitialized = false;

    function isScrolledIntoView(el) {
        let rect = el.getBoundingClientRect();
        return rect.top < window.innerHeight && rect.bottom >= 0;
    }

    function initializeMap() {
        if (!mapInitialized) {
            var map = L.map('map').setView([4.613622147268676, -74.15558080896226], 16);

            L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
                maxZoom: 19,
                attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            }).addTo(map);

            async function loadPolygon() {
                let myData = await fetch('timiza.geojson');
                let myPolygon = await myData.json();
                L.geoJSON(myPolygon, {
                    style: { color: 'blue' }
                }).addTo(map);
            }

            loadPolygon();
            mapInitialized = true;
            document.getElementById("map-section").style.opacity = "1"; // Hace visible el mapa
        }
    }

    window.addEventListener("scroll", function() {
        if (isScrolledIntoView(document.getElementById("map-section"))) {
            initializeMap();
        }
    });
});

document.addEventListener("DOMContentLoaded", function () {
    // Inicializar los mapas
    const map1 = L.map('map1').setView([4.6097, -74.0817], 13);
    const map2 = L.map('map2').setView([4.6097, -74.0817], 13);

    // Agregar capas base
    const vectorLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map1);

    const rasterLayer = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenTopoMap contributors'
    }).addTo(map2);

    // Cargar el polígono de Timiza en ambos mapas
    fetch('timiza.geojson')
        .then(response => response.json())
        .then(data => {
            L.geoJSON(data, { style: { color: 'blue', weight: 3, fillOpacity: 0.3 } }).addTo(map1);
            L.geoJSON(data, { style: { color: 'blue', weight: 3, fillOpacity: 0.3 } }).addTo(map2);
        })
        .catch(error => console.error('Error cargando GeoJSON:', error));

    // Barra deslizante para dividir los mapas
    const slider = document.getElementById('slider');
    let isDragging = false;

    slider.addEventListener('mousedown', function () { isDragging = true; });
    
    document.addEventListener('mousemove', function (e) {
        if (!isDragging) return;
        let percentage = (e.clientX / window.innerWidth) * 100;
        if (percentage < 10) percentage = 10;
        if (percentage > 90) percentage = 90;
        document.getElementById('map1').style.width = percentage + '%';
        slider.style.left = percentage + '%';
    });

    document.addEventListener('mouseup', function () { isDragging = false; });
});

async function loadPolygon() {
    let response = await fetch('timiza.geojson');
    let data = await response.json();
    let polygonStyle = { color: 'blue', weight: 3, fillOpacity: 0.3 };

    // Agregar el polígono a ambos mapas
    let geoJsonLayer = L.geoJSON(data, { style: polygonStyle }).addTo(map1);
    L.geoJSON(data, { style: polygonStyle }).addTo(map2);

    // Calcular métricas con Turf.js
    let area = turf.area(data).toFixed(2);
    let perimeter = turf.length(data, { units: 'meters' }).toFixed(2);
    let centroid = turf.centroid(data).geometry.coordinates;
    let bbox = turf.bbox(data);
    let vertices = data.features[0].geometry.coordinates[0].length;

    // Mostrar los datos en la interfaz
    document.getElementById('area').textContent = area;
    document.getElementById('perimeter').textContent = perimeter;
    document.getElementById('centroid').textContent = `[${centroid[1]}, ${centroid[0]}]`;
    document.getElementById('bbox').textContent = `[${bbox[1]}, ${bbox[0]}] a [${bbox[3]}, ${bbox[2]}]`;
    document.getElementById('vertices').textContent = vertices;
}

loadPolygon();