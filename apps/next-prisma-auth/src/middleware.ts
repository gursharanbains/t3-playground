import { NextRequest, NextResponse } from "next/server";
import { verifyJWT } from "@/lib/jwt";
import { getErrorResponse } from "@/lib/errors";

export interface AuthenticatedRequest extends NextRequest {
  user: {
    id: string;
  };
}

export async function middleware(req: NextRequest) {
  let token: string | undefined;

  if (req.cookies.has("token")) {
    token = req.cookies.get("token")?.value;
  } else if (req.headers.get("Authorization")?.startsWith("Bearer ")) {
    token = req.headers.get("Authorization")?.substring(7);
  }

  if (req.nextUrl.pathname.startsWith("/login") && !token) return;

  if (
    !token &&
    (req.nextUrl.pathname.startsWith("/api/users") ||
      req.nextUrl.pathname.startsWith("/api/auth/logout"))
  ) {
    return getErrorResponse(
      new Error("Not authenticated"),
      401,
      "You are not authenticated. Please login."
    );
  }

  const requestHeaders = new Headers(req.headers);

  try {
    if (token) {
      const { userId } = await verifyJWT<{ userId: string }>(token);
      requestHeaders.set("X-USER-ID", userId);

      (req as AuthenticatedRequest).user = { id: userId };
    }
  } catch (error) {
    if (req.nextUrl.pathname.startsWith("/api")) {
      return getErrorResponse(
        new Error("Token invalid"),
        401,
        "Token is invalid or user doesn't exist"
      );
    }

    return NextResponse.redirect(
      new URL(`/login?${new URLSearchParams({ error: "badauth1" })}`, req.url)
    );
  }

  const authUser = (req as AuthenticatedRequest).user;

  if (!authUser) {
    return NextResponse.redirect(
      new URL(
        `/login?${new URLSearchParams({
          error: "badauth2",
          forceLogin: "true",
        })}`,
        req.url
      )
    );
  }

  if (req.url.includes("/login") && authUser) {
    return NextResponse.redirect(new URL("/profile", req.url));
  }

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export const config = {
  matcher: ["/profile", "/login", "/api/user/:path*", "/api/auth/logout"],
};
