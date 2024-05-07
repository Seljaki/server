import { generateJwt } from "../utils/jwtGenerator.js"
import { createUser, hashPassword } from "../utils/user.js"
import sql from "../db.js"

export async function addUser(req, res) {
  try {
    const { username, email, password } = req.body
    if(username.length === 0 | password.length < 3)
      throw new Error("Invalid name/password lenght")

    const newUser = await createUser(username, password, email)

    const token = generateJwt(newUser.id, username)
    res.status(201).json({ token })
  } catch (err) {
    console.error(err.message)
    res.status(500).json({ message: err.message})
  }
}

export async function listAllUsers(req, res) {
  try {
    const users = await sql`SELECT id, username, email FROM users`;
    res.status(201).json({ users })
  } catch (err) {
    console.error(err.message)
    res.status(500).json({ message: err.message})
  }
}

export async function updateUser(req, res) {
  try {
    const users = await sql`SELECT * FROM users WHERE id = ${req.user.id}`;
    const user = users[0]
    const { username, email, password } = req.body

    if(email)
      user.email = email
    if(password)
      user.password = await hashPassword(password)
    if(username && user.username !== username) {
      const users = await sql`SELECT * FROM users WHERE username = ${username}`;
      if(users.length !== 0)
        throw new Error("user with username already exists")
      user.username = username
    }

    await sql`UPDATE users SET username = ${user.username}, password = ${user.password}, email = ${user.email} WHERE id = ${req.user.id}`

    res.status(201).json({ user })
  } catch (err) {
    console.error(err.message)
    res.status(500).json({ message: err.message})
  }
}

export async function deleteUser(req, res) {
  try {
    const userId = req.params.userId ? req.params.userId : req.user.id
    await sql`DELETE FROM users WHERE id = ${userId}`;
    res.status(201).json({ user })
  } catch (err) {
    console.error(err.message)
    res.status(500).json({ message: err.message})
  }
}