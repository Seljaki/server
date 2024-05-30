import { StatusCodes } from "http-status-codes";
import sql from "../db.js";

async function getProfitPerJob() {
  return sql`SELECT SUM(job."totalPrice") AS "totalIncome", jobtype.name FROM job JOIN jobType ON job.jobtype_id = jobType.id GROUP BY jobtype.name`
}


export async function getAllGeneralStatistics(req, res) {
  try {
    const profitPerJob = await getProfitPerJob()

    res.status(StatusCodes.OK).json({ profitPerJob })
  } catch (err) {
    console.error(err.message)
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: err.message})
  }
}