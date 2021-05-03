const express = require('express');
const cors = require('cors');
const pg = require('./db/database');

webServer = require('./server');

process.title = 'Leaflet';
var args = process.argv,
port = args[2] || 8080, webServer;

webServer.listen(8080, function() {
console.log('Server started at port ' + port);
});


//Servidor do Dados
const app = express();

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", 'GET,PUT,POST,DELETE');
    app.use(express.json());
    app.use(cors());
    next();
});

app.get('/municipios',async (_, res) => {
    const { rows } = await pg.get_municipios();
    res.json(JSON.stringify(rows));
});

app.get('/centroides',async (_, res) => {
    const { rows } = await pg.get_centroid();
    res.json(JSON.stringify(rows));
});

app.get('/limite_pb',async (_, res) => {
    const { rows } = await pg.get_limite_pb();
    res.json(JSON.stringify(rows));
}),

app.get('/mesorregioes',async (_, res) => {
    const { rows } = await pg.get_mesorregioes();
    res.json(JSON.stringify(rows));
}),

app.get('/microrregioes',async (_, res) => {
    const { rows } = await pg.get_microrregioes();
    res.json(JSON.stringify(rows));
}),

app.get('/ferrovias',async (_, res) => {
    const { rows } = await pg.get_ferrovias();
    res.json(JSON.stringify(rows));
}),

app.get('/rodovias',async (_, res) => {
    const { rows } = await pg.get_rodovias();
    res.json(JSON.stringify(rows));
})

app.listen(8000);