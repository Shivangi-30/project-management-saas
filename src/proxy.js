import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";

export function proxy(request) {
  const token = request.cookies.get("token")?.value;

  console.log("🍪 TOKEN EXISTS:", !!token);

  if (!token) {
    console.log("❌ NO TOKEN → LOGIN");
    
    return NextResponse.redirect(
      new URL("/auth/login", request.url)
    );
  }

  const decoded = verifyToken(token);

  console.log("🔐 TOKEN VALID:", !!decoded);

  if (!decoded) {
    console.log("❌ INVALID TOKEN → LOGIN");

    return NextResponse.redirect(
      new URL("/auth/login", request.url)
    );
  }

  console.log("✅ AUTHENTICATED → DASHBOARD");

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};