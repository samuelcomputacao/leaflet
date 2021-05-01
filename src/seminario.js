
const LatLong = [-7.133597693372753, -36.61743164062501];

var map = L.map('mapid', {
    center: LatLong,
    zoom: 8,
});

var layer = L.tileLayer(
    'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png?{foo}',
    {
        foo: 'bar',
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });
layer.addTo(map);


var municipioStyle = {
    "color": "#000000",
    "weight": 1,
    "opacity": 0.6,
    "fillOpacity": 0.5
};

var limitePbStyle = {
    "color": "#000000",
    "weight": 3,
    "opacity": 0.6,
    "fillOpacity": 0
};

var geojsonMarkerOptions = {
    radius: 5,
    fillColor: "#ff7800",
    color: "#000",
    weight: 1,
    opacity: 1,
    fillOpacity: 0.9
};


var municipiosLayer = L.geoJSON([], { style: municipioStyle }).addTo(map);
var limitePbLayer = L.geoJSON([], { style: limitePbStyle }).addTo(map);
var centroidLayer = L.geoJSON([], {
    pointToLayer: (feature, latlng) => {
        return L.circleMarker(latlng, geojsonMarkerOptions);
    },
    onEachFeature: (feature, layer) => {
        if (feature.properties && feature.properties.popupContent) {
            layer.bindPopup(feature.properties.popupContent);
        }
    }
}).addTo(map);

const urlMunicipios = 'http://localhost:8000/municipios';
fetch(urlMunicipios, {
    method: 'get',
    mode: 'cors'
}).then(function (response) {
    response.json().then(function (data) {
        data = JSON.parse(data);
        data.forEach(element => {
            var geojson = element.geojson;
               municipiosLayer.addData(JSON.parse(geojson));
        });
    });
}).catch(function (err) {
    console.error(err);
});


var geojsonFeature = {
    "type": "Point",
    "coordinates": [-104.99404, 39.75621]
};

const urlCentroides = 'http://localhost:8000/centroides';
fetch(urlCentroides, {
    method: 'get',
    mode: 'cors'
}).then(function (response) {
    response.json().then(function (data) {
        data = JSON.parse(data);
        data.forEach(centroid => {
            var feature = {
                "type": "Feature",
                "properties": { "popupContent": centroid.nome },
                "geometry": JSON.parse(centroid.geometry)
            }
            centroidLayer.addData(feature);
        });
    });
}).catch(function (err) {
    console.error(err);
});

const urlLimitePb = 'http://localhost:8000/limite_pb';
fetch(urlLimitePb, {
    method: 'get',
    mode: 'cors'
}).then(function (response) {
    response.json().then(function (data) {
        data = JSON.parse(data);
        var feature = {
            "type": "Feature",
            "geometry": JSON.parse(data[0].geometry),
        }
        limitePbLayer.addData(feature);
    });
}).catch(function (err) {
    console.error(err);
});

var baseLayers = {
    "OpenStreetMap": layer
};

var overlays = {
    "Limite PB": limitePbLayer,
    "Municípios": municipiosLayer,
    "Centróides": centroidLayer,
};

L.control.layers(baseLayers, overlays).addTo(map);


// var popup = L.popup();
// function onMapClick(e) {
//     popup
//         .setLatLng(e.latlng)
//         .setContent(`Coordenadas [${e.latlng.lat}, ${e.latlng.lng}]`)
//         .openOn(map);
// }



// var popup = L.popup();
// function onMapClick(e) {
//     popup
//         .setLatLng(e.latlng)
//         .setContent(`Coordenadas [${e.latlng.lat}, ${e.latlng.lng}]`)
//         .openOn(map);
// }

// map.on('click', onMapClick);




