import sql from "../db.js";

export async function removeDefaultIssuer() {
  return sql`UPDATE companies SET defaultIssuer = false`
}

export async function getCompanyById(companyId) {
  const companies = await sql`SELECT * FROM companies WHERE id = ${companyId}`
  return companies[0]
}