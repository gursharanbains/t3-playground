import { getEnvVariable } from "./env";
import { SignJWT, jwtVerify } from "jose";

export const signJWT = async (
  payload: { userId: string },
  options: { exp: string }
) => {
  const secret = new TextEncoder().encode(getEnvVariable("JWT_SECRET_KEY"));
  const alg = "HS256";
  return new SignJWT(payload)
    .setProtectedHeader({ alg })
    .setExpirationTime(options.exp)
    .setIssuedAt()
    .setSubject(payload.userId)
    .sign(secret);
};

export const verifyJWT = async <T>(token: string): Promise<T> => {
  try {
    const res = await jwtVerify(
      token,
      new TextEncoder().encode(process.env.JWT_SECRET_KEY)
    );
    return res.payload as T;
  } catch (error) {
    throw new Error("Your token has expired.");
  }
};
