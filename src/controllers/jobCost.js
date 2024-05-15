import sql from "../db.js";
import { StatusCodes } from "http-status-codes";

export async function getAllJobCostsForJob(jobId) {
  return sql`SELECT * FROM "jobCost" WHERE job_id = ${jobId}`
}

export async function getJobCostById(jobCostId) {
  const data = await sql`SELECT * FROM "jobCost" WHERE id = ${jobCostId}`
  return data[0]
}

export async function getAllJobCostsExpress(req, res) {
  try {
    const jobId = req.params.jobId

    const jobCosts = await getAllJobCostsForJob(jobId)

    res.status(StatusCodes.OK).json({ jobCosts })
  } catch (err) {
    console.error(err.message)
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: err.message})
  }
}

export async function addJobCostToJob(req, res) {
  try {
    const jobId = req.params.jobId
    const { title, amount, job_id = jobId } = req.body

    const jobCosts = await sql`INSERT INTO "jobCost" VALUES (
      DEFAULT,
      ${title},
      ${amount},
      ${job_id}
    ) returning *`

    res.status(StatusCodes.OK).json({ jobCost: jobCosts[0] })
  } catch (err) {
    console.error(err.message)
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: err.message})
  }
}

export async function updateJobCost(req, res) {
  try {
    const jobCostId = req.params.jobCostId
    const jc = await getJobCostById(jobCostId)
    const { title = jc.title, amount = jc.amount, job_id = jc.job_id } = req.body

    const jobCosts = await sql`UPDATE "jobCost" SET
      title = ${title},
      amount = ${amount},
      job_id = ${job_id}
    WHERE id = ${jobCostId} returning *`

    res.status(StatusCodes.OK).json({ jobCost: jobCosts[0] })
  } catch (err) {
    console.error(err.message)
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: err.message})
  }
}

export async function deleteJobCost(req, res) {
  try {
    const jobCostId = req.params.jobCostId

    await sql`DELETE FROM "jobCost"
    WHERE id = ${jobCostId}`

    res.status(StatusCodes.OK).json({ message: "Job cost deleted" })
  } catch (err) {
    console.error(err.message)
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: err.message})
  }
}

export async function getJobCostByIdExpress(req, res) {
  try {
    const jobCostId = req.params.jobCostId

    res.status(StatusCodes.OK).json({ jobCost: await getJobCostById(jobCostId) })
  } catch (err) {
    console.error(err.message)
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: err.message})
  }
}