import { getErrorResponse } from "@/lib/errors";
import prisma from "@/lib/prismaClient";
import { AuthenticatedRequest } from "@/middleware";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: AuthenticatedRequest) {
  const userId = req.headers.get("X-USER-ID");

  if (!userId) {
    return getErrorResponse(
      new Error("Not authenticated"),
      401,
      "You are not authenticated, please login."
    );
  }

  const user = await prisma.user.findUnique({ where: { id: userId } });

  return NextResponse.json({
    data: { user: { ...user, password: undefined } },
  });
}
