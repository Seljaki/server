import {StatusCodes} from "http-status-codes";
import sql from "../db.js";
import {getEquipmentById} from "../models/equipmentModel.js";


export async function listAllEquipment(req, res) {
    try {
        const { name } = req.query
        const equipment = await sql`SELECT * FROM equipment ${ name ? sql`WHERE name ILIKE ${'%'+name+'%'}` : sql``}`;
        res.status(StatusCodes.OK).json({ equipment })
    } catch (err) {
        console.error(err.message)
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message: err.message})
    }
}
export async function equipmentById(req, res) {
    try {
        const equipmentId = req.params.equipmentId
        const equipment = await getEquipmentById(equipmentId)
        res.status(StatusCodes.OK).json({ equipment })
    } catch (err) {
        console.error(err.message)
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: err.message})
    }
}

export async function addEquipment(req, res) {
    try {
        const {name, nextService = null, nextServiceHours = null, hours = null, equipmentType = "OTHER"} = req.body

        const equipment = await sql`INSERT INTO equipment VALUES(DEFAULT, ${name}, ${nextService}, ${nextServiceHours}, ${hours}, ${equipmentType})
    returning *`

        res.status(StatusCodes.OK).json({equipment: equipment[0]})
    } catch (err) {
        console.error(err.message)
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message: err.message})
    }
}

export async function updateEquipment(req, res) {
    try {
        const equipmentId = req.params.equipmentId
        const c = await getEquipmentById(equipmentId)
        const { name = c.name, nextService = c.nextService, nextServiceHours= c.nextServiceHours, hours = c.hours, equipmentType = c.equipmentType } = req.body

        const equipment = await sql`UPDATE equipment SET 
    name = ${name}, "nextService" = ${nextService}, "nextServiceHours" = ${nextServiceHours}, hours = ${hours}, "equipmentType" = ${equipmentType}
    WHERE id = ${equipmentId}
    returning *`

        res.status(StatusCodes.OK).json({ equipment: equipment[0] })
    } catch (err) {
        console.error(err.message)
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: err.message})
    }
}

export async function deleteEquipment(req, res) {
    try {
        const equipmentId = req.params.equipmentId

        await sql`DELETE FROM equipment WHERE id = ${equipmentId}`

        res.status(StatusCodes.OK).json({ message: "Equipment deleted" })
    } catch (err) {
        console.error(err.message)
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: err.message})
    }
}