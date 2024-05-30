import { StatusCodes } from "http-status-codes";
import sql from "../db.js";

async function getProfitPerJob() {
  return sql`SELECT SUM(job."totalPrice")::real AS "totalIncome", jobtype.name,
  (SELECT -COALESCE(SUM("jobCost".amount)::REAL, 0) FROM job 
  LEFT JOIN jobType AS jt ON job.jobtype_id = jt.id 
  LEFT JOIN "jobCost" ON "jobCost".job_id = job.id
  WHERE jt.name = jobtype.name
  GROUP BY jt.name) AS "costs"
  FROM job 
  JOIN jobType ON job.jobtype_id = jobType.id 
  GROUP BY jobtype.name`
}

async function getProfitPerYear() {
  return sql`WITH invoice_years AS (
    SELECT 
        invoice.id AS invoice_id, 
        DATE_PART('Year', invoice.started) AS joining_year
    FROM 
        invoice
)
SELECT 
    iy.joining_year, 
    COALESCE(SUM(job."totalPrice"), 0) AS "totalIncome",
    (
        SELECT 
            -COALESCE(SUM("jobCost".amount)::REAL, 0) AS "cost" 
        FROM 
            job 
        JOIN 
            "jobCost" ON "jobCost".job_id = job.id
        JOIN 
            invoice AS inv ON job.invoice_id = inv.id
        WHERE 
            DATE_PART('Year', inv.started) = iy.joining_year
    ) AS "costs"
FROM 
    invoice
JOIN 
    job ON job.invoice_id = invoice.id
JOIN 
    invoice_years AS iy ON invoice.id = iy.invoice_id
GROUP BY 
    iy.joining_year;`
}

async function getProfitPerMonth() {
  return sql`WITH invoice_years AS (
    SELECT 
        invoice.id AS invoice_id, 
        DATE_PART('Month', invoice.started) AS joining_month
    FROM 
        invoice
)
SELECT 
    iy.joining_month, 
    COALESCE(SUM(job."totalPrice"), 0) AS "totalIncome",
    (
        SELECT 
            -COALESCE(SUM("jobCost".amount)::REAL, 0) AS "cost" 
        FROM 
            job 
        JOIN 
            "jobCost" ON "jobCost".job_id = job.id
        JOIN 
            invoice AS inv ON job.invoice_id = inv.id
        WHERE 
            DATE_PART('Month', inv.started) = iy.joining_month
    ) AS "costs"
FROM 
    invoice
JOIN 
    job ON job.invoice_id = invoice.id
JOIN 
    invoice_years AS iy ON invoice.id = iy.invoice_id
GROUP BY 
    iy.joining_month;`
}

export async function getAllGeneralStatistics(req, res) {
  try {
      const [profitPerJob, profitPerYear, profitPerMonth] = await Promise.all([
        getProfitPerJob(),
        getProfitPerYear(),
        getProfitPerMonth()
    ]);

    res.status(StatusCodes.OK).json({ profitPerJob, profitPerYear, profitPerMonth })
  } catch (err) {
    console.error(err.message)
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: err.message})
  }
}