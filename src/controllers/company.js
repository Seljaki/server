import { StatusCodes } from "http-status-codes";
import sql from "../db.js";
import { getCompanyById, removeDefaultIssuer } from "../models/companyModel.js";

export async function listAllCompanies(req, res) {
  try {
    const companies = await sql`SELECT * FROM companies`;
    res.status(StatusCodes.OK).json({ companies })
  } catch (err) {
    console.error(err.message)
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: err.message})
  }
}

export async function addCompany(req, res) {
  try {
    const { name, address, isTaxpayer = false, phone = null, taxNumber = null, iban = null, email = null, isDefaultIssuer = false, accessToken = crypto.randomUUID()} = req.body
    if(isDefaultIssuer)
      await removeDefaultIssuer()

    const companies = await sql`INSERT INTO companies VALUES(DEFAULT, ${name}, ${address}, ${accessToken}, ${isTaxpayer}, ${phone}, ${taxNumber}, ${iban}, ${email}, ${isDefaultIssuer})
    returning *`

    res.status(StatusCodes.OK).json({ company: companies[0] })
  } catch (err) {
    console.error(err.message)
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: err.message})
  }
}

export async function deleteCompany(req, res) {
  try {
    const companyId = req.params.companyId
  
    await sql`DELETE FROM companies WHERE id = ${companyId}`

    res.status(StatusCodes.OK).json({ message: "Company deleted" })
  } catch (err) {
    console.error(err.message)
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: err.message})
  }
}

export async function updateCompany(req, res) {
  try {
    const companyId = req.params.companyId
    const c = await getCompanyById(companyId)

    const { name = c.name, address = c.address, isTaxpayer = c.istaxpayer, phone = c.phone, taxNumber = c.taxnumber, iban = c.iban, email = c.email, isDefaultIssuer = c.defaultissuer, accessToken = c.accesstoken} = req.body

    if(isDefaultIssuer)
      await removeDefaultIssuer()

    const companies = await sql`UPDATE companies SET 
    name = ${name}, address = ${address}, accesstoken = ${accessToken}, istaxpayer = ${isTaxpayer}, phone = ${phone}, taxnumber = ${taxNumber}, iban = ${iban}, email = ${email}, defaultissuer = ${isDefaultIssuer} 
    WHERE id = ${companyId}
    returning *`

    res.status(StatusCodes.OK).json({ company: companies[0] })
  } catch (err) {
    console.error(err.message)
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: err.message})
  }
}