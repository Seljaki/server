import { generateJwt } from "../utils/jwtGenerator.js"
import { createUser } from "../utils/user.js"

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