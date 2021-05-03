var microrregioesLayer = L.geoJSON();

const getMicrorregioesLayer = () => {
    microrregioesLayer = L.geoJSON([]);
    const urlMicrorregioes = 'http://localhost:8000/microrregioes';
    fetch(urlMicrorregioes, {
        method: 'get',
        mode: 'cors'
    }).then(function (response) {
        response.json().then(function (data) {
            data = JSON.parse(data);
            data.forEach(micro => {
                var feature = {
                    "type": "Feature",
                    "properties": { "nome": micro.nome },
                    "geometry": JSON.parse(micro.geometry)
                }
                microrregioesLayer.addData(feature);
            });
        });
    }).catch(function (err) {
        console.error(err);
    });
    return microrregioesLayer;
}