var municipiosLayer = L.geoJSON();

const getColorMunicipio = (p) => {
    return p > 800000 ? '#800026' :
        p > 400000 ? '#BD0026' :
            p > 100000 ? '#E31A1C' :
                p > 50000 ? '#FC4E2A' :
                    p > 20000 ? '#FD8D3C' :
                        p > 10000 ? '#FEB24C' :
                            p > 5000 ? '#FED976' :
                                '#FFEDA0';
}

const municipioStyle = (feature) => {
    return {
        fillColor: getColorMunicipio(feature.properties.populacao),
        weight: 1.3,
        opacity: 1,
        color: "#000000",
        fillOpacity: 1
    };
}

const highlightFeatureMunicipio = (e) => {
    var layer = e.target;

    layer.setStyle({
        weight: 5,
        color: '#777',
        fillOpacity: 1
    });

    // if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
    //     layer.bringToFront();
    // }
    info.update(layer.feature.properties);
}

const resetHighlightMunicipio = (e) => {
    municipiosLayer.resetStyle(e.target);
    info.update();
}

const zoomToFeatureMunicipio = (e, map) => {
    map.fitBounds(e.target.getBounds());
}

const onEachFeatureMunicipio = (layer, map) => {
    layer.on({
        mouseover:highlightFeatureMunicipio,
        mouseout:resetHighlightMunicipio,
        click: (e) => {zoomToFeatureMunicipio(e,map)}
    });
}

const getMunicipiosLayer = (map) => {
    municipiosLayer = L.geoJSON([], {
        style: municipioStyle,
        onEachFeature: (_,layer) => {
            onEachFeatureMunicipio(layer, map)
        },
    });

    const urlMunicipios = 'http://localhost:8000/municipios';
    fetch(urlMunicipios, {
        method: 'get',
        mode: 'cors'
    }).then(function (response) {
        response.json().then(function (data) {
            data = JSON.parse(data);
            data.forEach(element => {
                var feature = {
                    "type": "Feature",
                    "properties": { "populacao": element.populacao, "nome": element.nome },
                    "geometry": JSON.parse(element.geometry)
                }
                municipiosLayer.addData(feature);
            });
        });
    }).catch(function (err) {
        console.error(err);
    });

    return municipiosLayer;
}

var legendMunicipios = L.control({ position: 'bottomright' });

legendMunicipios.onAdd = function (map) {

    var div = L.DomUtil.create('div', 'info legend'),
        grades = [0, 5000, 10000, 20000, 50000, 100000, 400000, 800000]

    for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
            '<i style="background:' + getColorMunicipio(grades[i] + 1) + '"></i> ' +
            grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
    }

    return div;
};

var info = L.control({ position: 'bottomright' });

info.onAdd = function () {
    this._div = L.DomUtil.create('div', 'info');
    this.update();
    return this._div;
};

info.update = function (props) {

    this._div.innerHTML = (props ? '<h4>População estimada por Municipio</h4>' +
        '<b>' + props.nome + '</b><br />' + props.populacao + ' pessoas'
        : '');
};


const addInfoMunicipios = (map) => {
    legendMunicipios.addTo(map);
    info.addTo(map);
}

const removeInfoMunicipios = () => {
    legendMunicipios.remove();
    info.remove();
}
