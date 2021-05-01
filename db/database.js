const pg = require('pg')

const client = new pg.Client({
    user:'postgres',
    host:'localhost',
    database:'seminario',
    password:'12345',
    port:5432,
})

client.connect();

const query = async (query) => {
    const data = await client.query(query);
    return data
}

const get_municipios = async ()=>{
    return await query('SELECT  m.nome AS nome, m.pop_estim AS populacao, ST_AsGeoJSON(m.geom) AS geojson  FROM municipios m');
} 

const get_centroid = async() => {
    return await query('SELECT m.nome as nome, ST_AsGeoJSON(ST_Centroid(m.geom)) AS geometry from municipios m');
}

const get_limite_pb = async () => {
    return await query('SELECT ST_AsGeoJSON(ST_Union(m.geom)) as geometry FROM municipios m')
}

module.exports = {get_municipios, get_centroid,get_limite_pb}