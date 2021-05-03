var rodoviasLayer = L.geoJSON();
var infoRodovias = L.control({ position: 'bottomright' });

const rodoviasStyle = {
    weight: 2,
    opacity: 1,
    color: '#2e00fc'
}

infoRodovias.onAdd = function () {
    this._div = L.DomUtil.create('div', 'info');
    this.update();
    return this._div;
};

infoRodovias.update = function (props) {

    this._div.innerHTML = (props ? '<h4>Rodovia da Paraíba</h4>' +
        'Código: <b>' + props.codigo + '</b><br /> Trecho: ' + props.trecho
        : '');
};

const highlightFeatureRodovia = (e) => {
    var layer = e.target;

    layer.setStyle({
        weight: 5,
        color: '#000',
        fillOpacity: 1
    });

    // if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
    //     layer.bringToFront();
    // }
    infoRodovias.update(layer.feature.properties);
}

const resetHighlightRodovia = (e) => {
    rodoviasLayer.resetStyle(e.target);
    infoRodovias.update();
}

const zoomToFeatureRodovia = (e, map) => {
    map.fitBounds(e.target.getBounds());
}

const onEachFeatureRodovia = (layer, map) => {
    layer.on({
        mouseover:highlightFeatureRodovia,
        mouseout:resetHighlightRodovia,
        click: (e) => {zoomToFeatureRodovia(e,map)}
    });
}

const getRodoviasLayer = () => {
    rodoviasLayer = L.geoJSON([], {
        style: rodoviasStyle,
        onEachFeature: (_, layer) => {
            onEachFeatureRodovia(layer, map)
        },
    });
    const urlRodovias = 'http://localhost:8000/rodovias';
    fetch(urlRodovias, {
        method: 'get',
        mode: 'cors'
    }).then(function (response) {
        response.json().then(function (data) {
            data = JSON.parse(data);
            data.forEach(rodov => {
                var feature = {
                    "type": "Feature",
                    "properties": {
                        "codigo": rodov.codigo,
                        "trecho": rodov.trecho
                    },
                    "geometry": JSON.parse(rodov.geometry)
                }
                rodoviasLayer.addData(feature);
            });
        });
    }).catch(function (err) {
        console.error(err);
    });
    return rodoviasLayer;
}

const addInfoRodovias = (map) => {
     infoRodovias.addTo(map);
}

const removeInfoRodovias = () => {
    infoRodovias.remove();
}
