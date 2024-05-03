import dotenv from "dotenv";
import jwt from "jsonwebtoken";
dotenv.config()

export async function requiresLogin(req, res, next) {
  try {
    const jwtToken = req.header('x-auth-token')

    if(!jwtToken)
      return res.status(401).json({ message: "Not authorized" })

    const decodedToken = jwt.verify(jwtToken, process.env.JWT_SECRET)

    if (!decodedToken.id) {
      return res
        .status(401)
        .send({ message: 'Token verification failed. Authorization denied.' });
    }

    req.user = decodedToken;
    next();
  } catch (error) {
    console.log(error.message)
    return res.status(401).json({ message: "Not authorized" })
  }
}