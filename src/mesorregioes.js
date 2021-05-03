var mesorregioesLayer = L.geoJSON();

const getColorMesorregiao = (nome) => {

    switch (nome) {
        case 'MATA PARAIBANA':
            return '#2b6320'
        case 'AGRESTE PARAIBANO':
            return '#a8ba32'
        case 'BORBOREMA':
            return '#3432ba'
        case 'SERTÃO PARAIBANO':
            return '#d13048'
        default:
            return '#000000';
    }
}
var legendMesorregioes = L.control({ position: 'bottomright' });

legendMesorregioes.onAdd = (map) => {

    var div = L.DomUtil.create('div', 'info legend'),
        grades = ['MATA PARAIBANA', 'AGRESTE PARAIBANO', 'BORBOREMA', 'SERTÃO PARAIBANO']

    for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
            '<i style="background:' + getColorMesorregiao(grades[i]) + '"></i> ' +
            grades[i] + '<br>';
    }

    return div;
};

const addInfoMesorregioes = (map) => {
    legendMesorregioes.addTo(map);
}

const removeInfoMesorregioes = () => {
    legendMesorregioes.remove();
}


const styleMesorregioes = (feature) => {
    return {
        fillColor: getColorMesorregiao(feature.properties.nome),
        weight: 1.3,
        opacity: 1,
        color: "#000000",
        fillOpacity: 1
    };
}

const highlightFeatureMesorregioes = (feature, e) => {
    var layer = e.target;

    layer.setStyle({
        weight: 5,
        color: '#666',
        dashArray: '',
        fillOpacity: 1
    });

    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
        layer.bringToFront();
    }
    layer.bindTooltip(feature.properties.nome).openTooltip();
}

const resetHighlightMesorregioes = (e) => {
    mesorregioesLayer.resetStyle(e.target);
}

const zoomToFeatureMesorregioes = (e, map) => {
    map.fitBounds(e.target.getBounds());
}

const onEachFeatureMesorregioes = (feature,layer, map) => {

    layer.on({
        mouseover: (e) => {highlightFeatureMesorregioes(feature, e)},
        mouseout: resetHighlightMesorregioes,
        click: (e) => { zoomToFeatureMesorregioes(e, map) }
    });
}

const getMesorregioesLayer = (map) => {
    mesorregioesLayer = L.geoJSON([], {
        style: styleMesorregioes,
        onEachFeature: (feature, layer) => {
            onEachFeatureMesorregioes(feature,layer, map)
        }
    });
    const urlMesorregioes = 'http://localhost:8000/mesorregioes';
    fetch(urlMesorregioes, {
        method: 'get',
        mode: 'cors'
    }).then(function (response) {
        response.json().then(function (data) {
            data = JSON.parse(data);
            data.forEach(meso => {
                var feature = {
                    "type": "Feature",
                    "properties": { "nome": meso.nome },
                    "geometry": JSON.parse(meso.geometry)
                };
                mesorregioesLayer.addData(feature);
            });
        });
    }).catch(function (err) {
        console.error(err);
    });
    return mesorregioesLayer;
}