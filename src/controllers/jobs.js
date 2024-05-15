import sql from "../db.js";
import { StatusCodes } from "http-status-codes";
import { getJobTypeByIdJson } from "./jobTypes.js";

export async function getAllJobsForInvoice(req, res) {
  try {
    const invoiceId = req.params.invoiceId

    const jobs = await sql`SELECT * FROM job WHERE invoice_id = ${invoiceId}`;

    res.status(StatusCodes.OK).json({ jobs })
  } catch (err) {
    console.error(err.message)
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: err.message})
  }
}

export async function addJobToInvoice(req, res) {
  try {
    const invoiceId = req.params.invoiceId
    const { quantity, timeTaken, jobtype_id } = req.body
    let { price } = req.body

    const jobType = await getJobTypeByIdJson(jobtype_id)
    if(!price) {
      price = jobType.price
    }

    let totalPrice = price
    if(jobType.quantityType === 'price_per_hour') {
      totalPrice = price * (quantity/60.0)
    } else {
      totalPrice = quantity * price
    }

    const jobs = await sql`INSERT INTO job VALUES (
      DEFAULT,
      ${quantity},
      ${price},
      ${totalPrice},
      ${timeTaken},
      ${invoiceId},
      ${jobtype_id}
    ) returning *`

    res.status(StatusCodes.OK).json({ job: jobs[0] })
  } catch (err) {
    //console.log(err)
    console.error(err.message)
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: err.message})
  }
}

async function getById(id) {
  const data = await sql`SELECT * FROM job WHERE id = ${id}`
  return data[0]
}

export async function updateJob(req, res) {
  try {
    const invoiceId = req.params.invoiceId
    const jobId = req.params.jobId
    const j = await getById(jobId)

    const { quantity = j.quantity, timeTaken = j.timeTaken, jobtype_id = j.jobtype_id } = req.body
    let { price } = req.body

    const jobType = await getJobTypeByIdJson(jobtype_id)
    if(!price) {
      price = jobType.price
    }

    let totalPrice = price
    if(jobType.quantityType === 'price_per_hour') {
      totalPrice = price * (quantity/60.0)
    } else {
      totalPrice = quantity * price
    }

    const jobs = await sql`INSERT INTO job VALUES (
      DEFAULT,
      ${quantity},
      ${price},
      ${totalPrice},
      ${timeTaken},
      ${invoiceId},
      ${jobtype_id}
    ) returning *`

    res.status(StatusCodes.OK).json({ job: jobs[0] })
  } catch (err) {
    //console.log(err)
    console.error(err.message)
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: err.message})
  }
}

export async function deleteJob(req, res) {
  try {
    const jobId = req.params.jobId

    await sql`DELETE FROM job WHERE id = ${jobId}`

    res.status(StatusCodes.OK).json({ message: "Job deleted" })
  } catch (err) {
    //console.log(err)
    console.error(err.message)
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: err.message})
  }
}