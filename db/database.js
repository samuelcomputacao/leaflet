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
    return await query('SELECT  m.nome AS nome, m.pop_estim AS populacao, ST_AsGeoJSON(m.geom) AS geometry  FROM municipios m');
} 

const get_centroid = async() => {
    return await query('SELECT m.nome as nome, ST_AsGeoJSON(ST_Centroid(m.geom)) AS geometry from municipios m');
}

const get_limite_pb = async () => {
    return await query('SELECT ST_AsGeoJSON(ST_Union(m.geom)) as geometry FROM municipios m')
}

const get_mesorregioes = async () => {
    return await query('SELECT m.nm_meso AS nome, ST_AsGeoJSON(m.geom) AS geometry from mesorregioes m')
}

const get_microrregioes = async () => {
    return await query('SELECT m.nm_micro AS nome, ST_AsGeoJSON(m.geom) AS geometry from microrregioes m')
}

const get_ferrovias = async () => {
    return await query('SELECT ST_AsGeoJSON(f.geom) AS geometry from ferrovias f')
}

const get_rodovias = async () => {
    return await query("SELECT coalesce(r.codrodov,r.nomerodov) AS codigo, coalesce(r.trecho,'Não informado') AS trecho, ST_AsGeoJSON(r.geom) AS geometry from rodovias r")
}

module.exports = {get_municipios, get_centroid,get_limite_pb,get_mesorregioes,get_microrregioes, get_ferrovias, get_rodovias}