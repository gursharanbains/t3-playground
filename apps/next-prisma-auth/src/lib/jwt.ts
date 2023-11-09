import { getEnvVariable } from "./env";
import jwt from "jsonwebtoken";

export function signJWT(payload: { userId: string }, options: { exp: string }) {
  const secret = getEnvVariable("JWT_SECRET_KEY");
  return jwt.sign(payload, secret);
}

export async function verifyJWT(token: string): Promise<any> {
  try {
    const secret = getEnvVariable("JWT_SECRET_KEY");
    const verify = jwt.verify(token, secret);
  } catch (err) {
    throw new Error("Your token is invalid/expired.");
  }
}
