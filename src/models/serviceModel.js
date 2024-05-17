import sql from "../db.js";

export async function getServiceById(serviceId) {
    const equipment = await sql`SELECT * FROM service WHERE id = ${serviceId}`
    return equipment[0]
}