const LatLong = [-7.133597693372753, -36.61743164062501];
var overlaysAtivas = [0, 0, 0, 0, 0, 0, 0];

var map = L.map('mapid', {
    center: LatLong,
    zoom: 8
});

var layer = L.tileLayer(
    'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png?{foo}',
    {
        foo: 'bar',
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });
layer.addTo(map);


var municipiosLayer = getMunicipiosLayer(map);
var mesorregioesLayer = getMesorregioesLayer(map);
var microrregioesLayer = getMicrorregioesLayer();
var ferroviasLayer = getFerroviasLayer();
var rodoviasLayer = getRodoviasLayer();
var centroidesLayer = getCentroidesLayer();
var limitePbLayer = getLimitesPBLayer();

limitePbLayer.addTo(map);

var baseLayers = {
    "OpenStreetMap": layer
};

var overlays = {
    "Municípios": municipiosLayer,
    "Centróides": centroidesLayer,
    "Mesorregiões": mesorregioesLayer,
    "Microrregiões": microrregioesLayer,
    "Ferrovias": ferroviasLayer,
    "Rodovias": rodoviasLayer
};

var control = L.control.layers(baseLayers, overlays).addTo(map);

map.on('overlayadd', onOverlayAdd);
map.on('overlayremove', onOverlayRemove);

const maxOverlay = () => {
    i = 0;
    maior = 0
    while (i < 7) {
        if (overlaysAtivas[i] > overlaysAtivas[maior]) {
            maior = i;
        }
        i += 1;
    }
    return maior;
}
const addOverlay = (overlay) => {

    if (overlay === 'Municípios') {
        overlaysAtivas[1] = overlaysAtivas[maxOverlay()] + 1;
    } else if (overlay === 'Centróides') {
        overlaysAtivas[2] = overlaysAtivas[maxOverlay()] + 1;
    } else if (overlay === 'Mesorregiões') {
        overlaysAtivas[3] = overlaysAtivas[maxOverlay()] + 1;
    } else if (overlay === 'Microrregiões') {
        overlaysAtivas[4] = overlaysAtivas[maxOverlay()] + 1;
    } else if (overlay === 'Ferrovias') {
        overlaysAtivas[5] = overlaysAtivas[maxOverlay()] + 1;
    } else if (overlay === 'Rodovias') {
        overlaysAtivas[6] = overlaysAtivas[maxOverlay()] + 1;
    }

}

const removeOverlay = (overlay) => {

    if (overlay === 'Municípios') {
        overlaysAtivas[1] = 0;
    } else if (overlay === 'Centróides') {
        overlaysAtivas[2] = 0;
    } else if (overlay === 'Mesorregiões') {
        overlaysAtivas[3] = 0;
    } else if (overlay === 'Microrregiões') {
        overlaysAtivas[4] = 0;
    } else if (overlay === 'Ferrovias') {
        overlaysAtivas[5] = 0;
    } else if (overlay === 'Rodovias') {
        overlaysAtivas[6] = 0;
    }

}
function updateOverlay() {
    console.log(overlaysAtivas);
    var indice = maxOverlay();
    removeInfoMunicipios();
    removeInfoMesorregioes();
    removeInfoRodovias();
    if (indice === 1) {
        addInfoMunicipios(map);
    } else if (indice === 3) {
        addInfoMesorregioes(map);
    } else if(indice === 6){
        addInfoRodovias(map);
    }
}


function onOverlayAdd(e) {
    addOverlay(e.name);
    updateOverlay();
}

function onOverlayRemove(e) {
    removeOverlay(e.name);
    updateOverlay();
}

