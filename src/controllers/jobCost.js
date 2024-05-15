import sql from "../db.js";
import { StatusCodes } from "http-status-codes";

export async function getAllJobCostsForJob(jobId) {
  return sql`SELECT * FROM jobCost WHERE id = ${jobId}`
}

export async function getAllJobCostsExpress(req, res) {
  try {
    const jobId = req.params.jobId

    const jobCosts = await getAllJobCostsForJob(jobCosts)

    res.status(StatusCodes.OK).json({ jobCosts })
  } catch (err) {
    console.error(err.message)
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: err.message})
  }
}