import { NextRequest, NextResponse } from "next/server";
import { getSession } from "./utils/session";

export async function middleware(request: NextRequest) {
  const session = await getSession();

  if (!session.token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
  return NextResponse.next();
}

export const config = { matcher: ["/", "/projects/:path*"] };
