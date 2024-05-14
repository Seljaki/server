import sql from "../db.js";
import { StatusCodes } from "http-status-codes";
import { getGeomFromJson } from "../models/plotsModel.js";

export async function getAllPlots(req, res) {
  try {
    const { title } = req.query 
    // ST_AsGeoJSON(ST_Transform(boundary, 3794)) as boundary
    const plots = await sql`SELECT id, title, note, "plotSize", "plotNumber", "cadastralMunicipality", archived FROM plots ${ title ? sql`WHERE name ILIKE ${'%'+title+'%'}` : sql``}`;
    res.status(StatusCodes.OK).json({ plots })
  } catch (err) {
    console.error(err.message)
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: err.message})
  }
}

export async function getPlotById(req, res) {
  try {
    const plotId = req.params.plotId
    const plots = await sql`SELECT id, title, note, "plotSize", "plotNumber", "cadastralMunicipality", archived FROM plots WHERE id = ${plotId}`;
    res.status(StatusCodes.OK).json({ plots })
  } catch (err) {
    console.error(err.message)
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: err.message})
  }
}

export async function addPlot(req, res) {
  try {
    const { title, note = '', boundary, plotNumber, cadastralMunicipality } = req.body
    //const boundaryJson = JSON.stringify(boundary)
    const geom = await getGeomFromJson(boundary)
    //console.log(req.body)

    const plots = await sql`INSERT INTO plots VALUES (
      DEFAULT, 
      ${title}, 
      ${note}, 
      ${geom}, 
      (SELECT ST_Extent(${geom})::box2d),
      (SELECT ST_Area(${geom})),
      ${plotNumber},
      ${cadastralMunicipality},
      false
    ) returning *`

    res.status(StatusCodes.OK).json({ plot: plots[0] })
  } catch (err) {
    //console.log(err)
    console.error(err.message)
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: err.message})
  }
}

export async function deletePlot(req, res) {
  try {
    const plotId = req.params.plotId
  
    await sql`DELETE FROM plots WHERE id = ${plotId}`

    res.status(StatusCodes.OK).json({ message: "Plot deleted" })
  } catch (err) {
    console.error(err.message)
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: err.message})
  }
}

export async function updatePlot(req, res) {
  try {
    const plotId = req.params.plotId
    const ps = await sql`SELECT * FROM plots WHERE id = ${plotId}`
    const p = ps[0]

    const { title = p.title, note = p.note, plotNumber = p.plotNumber, cadastralMunicipality = p.cadastralMunicipality, archived = p.archived } = req.body
    let { boundary = p.boundary, plotSize = p.plotSize } = req.body

    if(p.boundary !== boundary){
      boundary = await getGeomFromJson(boundary)
    }

    console.log(`UPDATE companies SET 
    title = ${title}, 
    note = ${note}, 
    boundary = ${boundary}, 
    bbox = (SELECT ST_Extent(${boundary})::box2d),
    "plotSize" = (SELECT ST_Area(${boundary})),
    "plotNumber" = ${plotNumber},
    "cadastralMunicipality" = ${cadastralMunicipality},
    archived = ${archived}
    WHERE id = ${plotId};
    returning *`)

    const plots = await sql`UPDATE plots SET 
    title = ${title}, 
    note = ${note}, 
    boundary = ${boundary}, 
    bbox = (SELECT ST_Extent(${boundary})::box2d),
    "plotSize" = (SELECT ST_Area(${boundary})),
    "plotNumber" = ${plotNumber},
    "cadastralMunicipality" = ${cadastralMunicipality},
    archived = ${archived}
    WHERE id = ${plotId}
    returning *`

    res.status(StatusCodes.OK).json({ plot: plots[0] })
  } catch (err) {
    console.error(err.message)
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: err.message})
  }
}