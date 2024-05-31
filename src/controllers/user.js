import { generateJwt } from "../utils/jwtGenerator.js"
import { createUser, hashPassword } from "../utils/user.js"
import sql from "../db.js"
import { StatusCodes } from "http-status-codes"

export async function addUser(req, res) {
  try {
    const { username, email = null, password } = req.body
    if(username.length === 0 | password.length < 3)
      throw new Error("Invalid name/password lenght")

    const newUser = await createUser(username, password, email)

    const token = generateJwt(newUser.id, username)
    res.status(StatusCodes.OK).json({ token })
  } catch (err) {
    console.error(err.message)
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: err.message})
  }
}

export async function listAllUsers(req, res) {
  try {
    const users = await sql`SELECT id, username, email FROM users`;
    res.status(StatusCodes.OK).json({ users })
  } catch (err) {
    console.error(err.message)
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: err.message})
  }
}

export async function updateUser(req, res) {
  try {
    const users = await sql`SELECT * FROM users WHERE id = ${req.user.id}`;
    const user = users[0]
    let { username = user.username, email = user.username, password = user.password} = req.body

    if(email === undefined)
      email = null

    if(user.username !== username) {
      const users = await sql`SELECT * FROM users WHERE username = ${username}`;
      if(users.length !== 0)
        throw new Error("user with username already exists")
      user.username = username
    }

    if(user.password !== password)
      password = await hashPassword(password)

    const u = await sql`UPDATE users SET username = ${username}, password = ${password}, email = ${email} WHERE id = ${req.user.id} returning *`

    res.status(StatusCodes.OK).json({ user: u })
  } catch (err) {
    console.error(err.message)
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: err.message})
  }
}

export async function deleteUser(req, res) {
  try {
    const userId = req.params.userId ? req.params.userId : req.user.id
    await sql`DELETE FROM users WHERE id = ${userId}`;
    res.status(StatusCodes.OK).json({ message: 'User deleted' })
  } catch (err) {
    console.error(err.message)
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: err.message})
  }
}