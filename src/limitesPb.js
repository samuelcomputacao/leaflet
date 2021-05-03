var limitePbStyle = {
    "color": "#000000",
    "weight": 3,
    "opacity": 0.6,
    "fillOpacity": 0
};

var limitePbLayer = L.geoJSON();

const getLimitesPBLayer = () => {
    limitePbLayer = L.geoJSON([], {
        style: limitePbStyle,
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
    return limitePbLayer;
}