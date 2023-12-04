// Replace 'YOUR_GEOJSON_URL_HERE' with the actual GeoJSON URL of the earthquake dataset
var earthquakeDataUrl = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson';

var map = L.map('map').setView([0, 0], 2);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
}).addTo(map);

// Function to determine the color based on depth
function getColor(depth) {
    return depth > 300 ? '#800026' :
           depth > 200 ? '#BD0026' :
           depth > 100 ? '#E31A1C' :
           depth > 50  ? '#FC4E2A' :
                         '#FFEDA0';
}

// Function to determine the size based on magnitude
function getRadius(magnitude) {
    return magnitude * 5;
}

// Function to create a custom legend
function createLegend() {
    var legend = L.control({ position: 'bottomright' });

    legend.onAdd = function (map) {
        var div = L.DomUtil.create('div', 'info legend');
        var grades = [0, 50, 100, 200, 300];
        var labels = [];

        for (var i = 0; i < grades.length; i++) {
            div.innerHTML +=
                '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
                grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
        }

        return div;
    };

    legend.addTo(map);
}

// Fetch earthquake data and add markers to the map
fetch(earthquakeDataUrl)
    .then(response => response.json())
    .then(data => {
        L.geoJSON(data.features, {
            pointToLayer: function (feature, latlng) {
                return L.circleMarker(latlng, {
                    radius: getRadius(feature.properties.mag),
                    fillColor: getColor(feature.geometry.coordinates[2]),
                    color: '#000',
                    weight: 1,
                    opacity: 1,
                    fillOpacity: 0.8
                }).bindPopup('<b>Location:</b> ' + feature.properties.place + '<br><b>Magnitude:</b> ' + feature.properties.mag + '<br><b>Depth:</b> ' + feature.geometry.coordinates[2]);
            }
        }).addTo(map);

        createLegend();
    });
