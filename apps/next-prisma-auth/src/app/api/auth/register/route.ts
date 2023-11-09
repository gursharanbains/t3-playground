import { getErrorResponse } from "@/lib/errors";
import prisma from "@/lib/prismaClient";
import { RegisterData, RegisterSchema } from "@/lib/validation/user";
import { hash } from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as RegisterData;
    const data = RegisterSchema.parse(body);

    const hashedPassword = await hash(data.password, 12);

    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: hashedPassword,
      },
    });

    console.log(user);

    return new NextResponse(
      JSON.stringify({
        data: { user: { ...user, password: undefined } },
      }),
      {
        status: 201,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (err: any) {
    if (err.code === "P2002") {
      return getErrorResponse(err, 409, "user with that email already exists");
    }

    return getErrorResponse(err);
  }
}
