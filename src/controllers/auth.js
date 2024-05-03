import sql from "../db.js"
import bcrypt from 'bcrypt'
import { generateJwt } from "../utils/jwtGenerator.js"

export async function login(req, res) {
  try {
    const { username, password } = req.body

    const users = await sql`SELECT * FROM users WHERE username = ${username}`
    if(users.length !== 1) 
      return res.status(401).json("Password or username is incorrect")

    const isValid = await bcrypt.compare(password, users[0].password)

    if(!isValid)
      return res.status(401).json("Password or username is incorrect")

    const token = generateJwt(users[0].id, users[0].username)
    return res.status(201).json({ token: token })
  } catch (err) {
    console.error(err.message)
    res.status(500).json({ message: err.message})
  }
}