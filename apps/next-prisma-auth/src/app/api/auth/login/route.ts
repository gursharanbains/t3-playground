import { getErrorResponse } from "@/lib/errors";
import prisma from "@/lib/prismaClient";
import { LoginData, LoginSchema } from "@/lib/validation/user";
import { NextRequest, NextResponse } from "next/server";
import { compare } from "bcryptjs";
import { getEnvVariable } from "@/lib/env";
import { signJWT } from "@/lib/jwt";

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as LoginData;
    const data = LoginSchema.parse(body);
    const user = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (!user || !(await compare(data.password, user.password))) {
      return getErrorResponse(new Error(), 401, "invalid data");
    }

    const JWT_EXPIRE_IN = getEnvVariable("JWT_EXPIRE_IN");

    const token = await signJWT(
      { userId: user.id },
      { exp: `${JWT_EXPIRE_IN}` }
    );

    // JWT_EXPIRE_IN is in minutes, convert to seconds
    const tokenExpiry = parseInt(JWT_EXPIRE_IN) * 60;

    const cookieOpts = {
      name: "token",
      value: token,
      httpOnly: true,
      path: "/",
      secure: process.env.NODE_ENV !== "development",
      maxAge: tokenExpiry,
    };

    const res = new NextResponse(JSON.stringify({ token }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });

    await Promise.all([
      res.cookies.set(cookieOpts),
      res.cookies.set({
        name: "logged-in",
        value: "true",
        maxAge: tokenExpiry,
      }),
    ]);
    return res;
  } catch (err) {
    return getErrorResponse(err);
  }
}
