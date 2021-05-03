var centroidesLayer = L.geoJSON();

var geojsonMarkerOptions = {
    radius: 5,
    fillColor: "#ff7800",
    color: "#000",
    weight: 1,
    opacity: 1,
    fillOpacity: 0.9
};

const getCentroidesLayer = () => {
    centroidesLayer = L.geoJSON([], {
        pointToLayer: (_, latlng) => {
            return L.circleMarker(latlng, geojsonMarkerOptions);
        },
        onEachFeature: (feature, layer) => {
            if (feature.properties && feature.properties.popupContent) {
                layer.bindPopup(feature.properties.popupContent);
            }
        }
    });
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
                centroidesLayer.addData(feature);
            });
        });
    }).catch(function (err) {
        console.error(err);
    });
    return centroidesLayer;
}