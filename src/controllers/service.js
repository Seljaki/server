import {StatusCodes} from "http-status-codes";
import sql from "../db.js";
import {getServiceById} from "../models/serviceModel.js";

export async function listAllServices(req, res) {
    try {
        const { equipment_id } = req.query
        const services = await sql`SELECT * FROM service ${ equipment_id ? sql`WHERE equipment_id=equipment_id` : sql``}`;
        res.status(StatusCodes.OK).json({ services })
    } catch (err) {
        console.error(err.message)
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message: err.message})
    }
}

export async function serviceById(req, res) {
    try {
        const serviceId = req.params.serviceId
        const service = await getServiceById(serviceId)
        res.status(StatusCodes.OK).json({ service })
    } catch (err) {
        console.error(err.message)
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: err.message})
    }
}

export async function addService(req, res) {
    try{
        const {title, note ='', hours = null, cost=0.00, equipment_id} = req.body

        const services = await sql`INSERT INTO service VALUES(DEFAULT, ${title}, ${note}, ${hours}, DEFAULT, ${cost}, ${equipment_id})
    returning *`
        res.status(StatusCodes.OK).json({service: services[0]})
    }catch (err) {
        console.error(err.message)
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message: err.message})
    }

}

export async function updateService(req, res) {
    try {
        const serviceId = req.params.serviceId
        const c = await getServiceById(serviceId)
        const { title = c.title, note = c.note, hours= c.hours, date= c.date,cost = c.cost, equipment_id = c.equipment_id } = req.body

        const services = await sql`UPDATE service SET 
    title = ${title}, note = ${note}, hours = ${hours}, date = ${date}, cost = ${cost}, equipment_id = ${equipment_id}
    WHERE id = ${serviceId}
    returning *`

        res.status(StatusCodes.OK).json({ service: services[0] })
    } catch (err) {
        console.error(err.message)
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: err.message})
    }
}

export async function deleteService(req, res) {
    try {
        const serviceId = req.params.serviceId

        await sql`DELETE FROM service WHERE id = ${serviceId}`

        res.status(StatusCodes.OK).json({ message: "Service deleted" })
    } catch (err) {
        console.error(err.message)
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: err.message})
    }
}