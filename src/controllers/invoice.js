
import sql from "../db.js";
import { StatusCodes } from "http-status-codes";

async function getById(id) {
  const data = await sql`SELECT invoice.*, ROW_to_json(issuer) AS issuer, ROW_TO_JSON(customer) AS CUSTOMER, (SELECT COALESCE(SUM(job."totalPrice"),0) FROM job WHERE invoice_id = invoice.id) AS "totalPrice" FROM invoice
  JOIN companies AS customer ON customer_id = customer.id
  JOIN companies AS issuer ON issuer_id = issuer.id WHERE invoice.id = ${id}`;
  return data[0]
}

export async function getInvoiceById(req, res) {
  try {
    const invoiceId = req.params.invoiceId
    const invoice = await getById(invoiceId)
    res.status(StatusCodes.OK).json({ invoice })
  } catch (err) {
    console.error(err.message)
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: err.message})
  }
}

export async function getAllInvoices(req, res) {
  try {
    const { paid = undefined, sort = undefined, sortOrder = "DESC" } = req.query 
    const invoices = await sql`SELECT invoice.*, ROW_to_json(issuer) AS issuer, ROW_TO_JSON(customer) AS CUSTOMER, (SELECT COALESCE(SUM(job."totalPrice"),0) FROM job WHERE invoice_id = invoice.id) AS "totalPrice" FROM invoice
    JOIN companies AS customer ON customer_id = customer.id
    JOIN companies AS issuer ON issuer_id = issuer.id
    ${paid ? sql`WHERE invoice."isPaid" = ${paid === "true"}` : sql``}
    ORDER BY invoice.started DESC`
    //${sort ? sql`ORDER BY ${sort} ASC` : sql``}`;
    res.status(StatusCodes.OK).json({ invoices })
  } catch (err) {
    console.error(err.message)
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: err.message})
  }
}

export async function getAllPlotsForInvoiceGeoJson(req, res) {
  try {
    const invoiceId = req.params.invoiceId

    const plots = await sql`SELECT st_asgeojson(ST_Transform(boundary, 4326)) as plot, job_has_plot.date AS "dateDone", ROW_TO_JSON(plots.*) AS "plotDetails", ROW_TO_JSON(job.*) AS "job"
    FROM plots 
    JOIN job_has_plot ON plots.id = job_has_plot.plot_id 
    JOIN job ON job.id = job_has_plot.job_id
    WHERE job.invoice_id = ${invoiceId}`;

    const plotsGeoJson = {
      type: "FeatureCollection",
      features: [],
    }

    plots.forEach(p => {
      //console.log(p)
      plotsGeoJson.features.push({ type: "Feature", geometry: JSON.parse(p.plot), properties: {plot: p.plotDetails, job: p.job, dateDone: p.dateDone}})
    })

    res.status(StatusCodes.OK).json({ plots: plotsGeoJson })
  } catch (err) {
    console.error(err.message)
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: err.message})
  }
}

export async function addInvoice(req, res) {
  try {
    const { title, note = '', started, ended = null, isPaid = false, dueDate = null, customer_id, issuer_id } = req.body

    const invoices = await sql`INSERT INTO invoice VALUES (
      DEFAULT,
      ${title},
      ${note},
      ${started},
      ${ended},
      ${isPaid},
      ${dueDate},
      ${customer_id},
      ${issuer_id}
    ) returning *`

    res.status(StatusCodes.OK).json({ invoice: await getById(invoices[0].id) })
  } catch (err) {
    //console.log(err)
    console.error(err.message)
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: err.message})
  }
}

export async function editInvoice(req, res) {
  try {
    const invoiceId = req.params.invoiceId
    const i = await getById(invoiceId)

    const { title = i.title, note = i.note, started = i.started, ended = i.ended, isPaid = i.isPaid, dueDate = i.dueDate, customer_id = i.customer_id, issuer_id = i.issuer_id } = req.body

    const invoices = await sql`UPDATE invoice SET
      title = ${title},
      note = ${note},
      started = ${started},
      ended = ${ended},
      "isPaid" = ${isPaid},
      "dueDate" = ${dueDate},
      customer_id = ${customer_id},
      issuer_id = ${issuer_id}
    WHERE id = ${invoiceId}`

    res.status(StatusCodes.OK).json({ invoice: await getById(invoiceId) })
  } catch (err) {
    //console.log(err)
    console.error(err.message)
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: err.message})
  }
}

export async function deleteInvoice(req, res) {
  try {
    const invoiceId = req.params.invoiceId
    await sql`DELETE FROM invoice WHERE id = ${invoiceId}`

    res.status(StatusCodes.OK).json({ message: "Invoice deleted" })
  } catch (err) {
    //console.log(err)
    console.error(err.message)
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: err.message})
  }
}