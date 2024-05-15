import sql from "../db.js";

export async function getEquipmentById(equipmentId) {
    const equipment = await sql`SELECT * FROM equipment WHERE id = ${equipmentId}`
    return equipment[0]
}