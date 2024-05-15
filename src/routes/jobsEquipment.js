import sql from "../db.js";
import {StatusCodes} from "http-status-codes";

export async function getAllEquipmentForJob(req, res) {
    try {
        const jobId = req.params.jobId

        const equipment = await sql`SELECT equipment.* FROM equipment JOIN job_has_equipment ON equipment.id = job_has_equipment.equipment_id WHERE job_has_equipment.job_id = ${jobId}`;

        res.status(StatusCodes.OK).json({ equipment })
    } catch (err) {
        console.error(err.message)
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: err.message})
    }
}


export async function insertJobEquipment(req, res) {
    try {
        const { jobId, equipmentId } = req.params

        const jobEquipment = await sql`INSERT INTO job_has_equipment VALUES (
      DEFAULT,
      ${jobId},
      ${equipmentId}
    ) returning *`;

        res.status(StatusCodes.OK).json({ jobEquipment: jobEquipment })
    } catch (err) {
        console.error(err.message)
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: err.message})
    }
}


export async function deleteJobEquipment(req, res) {
    try {
        const { jobId, equipmentId } = req.params

        const jobEquipment = await sql`DELETE FROM job_has_equipment WHERE
    job_id = ${jobId} AND equipment_id = ${equipmentId}`;

        res.status(StatusCodes.OK).json({ message: 'Relation deleted' })
    } catch (err) {
        console.error(err.message)
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: err.message})
    }
}