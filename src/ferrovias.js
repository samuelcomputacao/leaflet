var ferroviasLayer = L.geoJSON();

const ferroviasStyle = {
    weight: 2,
    opacity: 1,
    color: '#961890',
    dashArray: '4'
}

const getFerroviasLayer = () => {
    ferroviasLayer = L.geoJSON([], { style: ferroviasStyle });
    const urlFerrovias = 'http://localhost:8000/ferrovias';
    fetch(urlFerrovias, {
        method: 'get',
        mode: 'cors'
    }).then(function (response) {
        response.json().then(function (data) {
            data = JSON.parse(data);
            data.forEach(ferr => {
                var feature = {
                    "type": "Feature",
                    "geometry": JSON.parse(ferr.geometry)
                }
                ferroviasLayer.addData(feature);
            });
        });
    }).catch(function (err) {
        console.error(err);
    });
    return ferroviasLayer;
}