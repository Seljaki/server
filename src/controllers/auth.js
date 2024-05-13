import sql from "../db.js"
import bcrypt from 'bcrypt'
import { generateJwt } from "../utils/jwtGenerator.js"
import { StatusCodes } from "http-status-codes"

export async function login(req, res) {
  try {
    const { username, password } = req.body

    const users = await sql`SELECT * FROM users WHERE username = ${username}`
    if(users.length !== 1) 
      return res.status(StatusCodes.UNAUTHORIZED).json("Password or username is incorrect")

    const isValid = await bcrypt.compare(password, users[0].password)

    if(!isValid)
      return res.status(StatusCodes.UNAUTHORIZED).json("Password or username is incorrect")

    const token = generateJwt(users[0].id, users[0].username)
    return res.status(StatusCodes.OK).json({ token: token })
  } catch (err) {
    console.error(err.message)
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: err.message})
  }
}