import sql from "../db.js"
import bcrypt from 'bcrypt'

export async function hashPassword(password) {
  const saltRun = 10
  const salt = await bcrypt.genSalt(saltRun)
  return bcrypt.hash(password, salt)
}

export async function createUser(username, password, email) {
  const user = await sql`SELECT * FROM users WHERE username = ${username} OR email = ${email}`
  if(user.length !== 0)
    throw new Error("User with this name or email already exists")
  
  const encryptedPassword = await hashPassword(password)

  const newUser = await sql`
    INSERT INTO users(email, password, username) VALUES (${email}, ${encryptedPassword}, ${username})
    returning *`
  return newUser[0]
}