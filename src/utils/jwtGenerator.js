import dotenv from "dotenv";
import jwt from "jsonwebtoken";
dotenv.config()

export function generateJwt(userId, username) {
  const payload = {
    id: userId,
    username: username
  }

  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "30d"
  })
}