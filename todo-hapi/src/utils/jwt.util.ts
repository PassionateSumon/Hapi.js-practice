import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export class JWTUtil {
  static generateToken(userId: string): string {
    // console.log(jwt.sign({ userId }, process.env.JWT_SECRET as string))
    return jwt.sign({ userId }, process.env.JWT_SECRET as string);
  }
  static verifyToken(token: string): any {
    return jwt.verify(token, process.env.JWT_SECRET as string);
  }
}
