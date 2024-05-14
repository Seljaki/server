import sql from "../db.js";
import { StatusCodes } from "http-status-codes";

export async function getAllJobTypes(req, res) {
  try {
    const { name } = req.query 
    const plotTypes = await sql`SELECT * FROM jobType ${ name ? sql`WHERE name ILIKE ${'%'+name+'%'}` : sql``}`;
    res.status(StatusCodes.OK).json({ plotTypes })
  } catch (err) {
    console.error(err.message)
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: err.message})
  }
}

export async function getAllQuantityTypes(req, res) {
  try {
    const { name } = req.query 
    const quantityTypes = await sql`SELECT unnest(enum_range(NULL::QUANTITY_TYPE))`;
    res.status(StatusCodes.OK).json({ quantityTypes })
  } catch (err) {
    console.error(err.message)
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: err.message})
  }
}

export async function addJobType(req, res) {
  try {
    const { name, quantityType, price } = req.body

    const jobTypes = await sql`INSERT INTO jobType VALUES (
      DEFAULT,
      ${name},
      ${quantityType},
      ${price}
    ) returning *`

    res.status(StatusCodes.OK).json({ jobType: jobTypes[0] })
  } catch (err) {
    //console.log(err)
    console.error(err.message)
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: err.message})
  }
}

export async function updateJobType(req, res) {
  try {
    const jobTypeId = req.params.jobTypeId
    const jts = await sql`SELECT * FROM jobType WHERE id = ${jobTypeId}`
    const jt = jts[0]

    const { name = jt.name, quantityType = jt.quantityType, price = jt.price} = req.body

    const jobTypes = await sql`INSERT INTO jobType VALUES (
      DEFAULT,
      ${name},
      ${quantityType},
      ${price}
    ) returning *`

    res.status(StatusCodes.OK).json({ jobType: jobTypes[0] })
  } catch (err) {
    //console.log(err)
    console.error(err.message)
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: err.message})
  }
}