import sql from "../db.js";

export async function getGeomFromJson(geoJson) {
  const data = await sql`SELECT ST_Transform(ST_GeomFromGeoJSON(${JSON.stringify(geoJson)}), 3794) as geom`
  return data[0].geom
}