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
    console.log(`INSERT INTO job VALUES (
      DEFAULT,
      ${quantity},
      ${price},
      ${totalPrice}
      ${timeTaken},
      ${invoiceId},
      ${jobtype_id}
    ) returning *`)
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