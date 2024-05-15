import sql from "../db.js";
import { StatusCodes } from "http-status-codes";

export async function getAllPlotsForJob(req, res) {
  try {
    const jobId = req.params.jobId

    const plots = await sql`SELECT plots.* FROM plots JOIN job_has_plot ON plots.id = job_has_plot.plot_id WHERE job_has_plot.job_id = ${jobId}`;

    res.status(StatusCodes.OK).json({ plots })
  } catch (err) {
    console.error(err.message)
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: err.message})
  }
}

export async function insertJobPlot(req, res) {
  try {
    const { jobId, plotId } = req.params

    const jobPlots = await sql`INSERT INTO job_has_plot VALUES (
      DEFAULT,
      ${jobId},
      ${plotId}
    ) returning *`;

    res.status(StatusCodes.OK).json({ jobPlot: jobPlots })
  } catch (err) {
    console.error(err.message)
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: err.message})
  }
}

export async function deleteJobPlot(req, res) {
  try {
    const { jobId, plotId } = req.params

    const jobPlots = await sql`DELETE FROM job_has_plot WHERE
    job_id = ${jobId} AND plot_id = ${plotId}`;

    res.status(StatusCodes.OK).json({ message: 'Relationm deleted' })
  } catch (err) {
    console.error(err.message)
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: err.message})
  }
}