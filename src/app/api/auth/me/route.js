import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized. Please login first.",
        },
        { status: 401 }
      );
    }

    const decoded = verifyToken(token);

    if (!decoded) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid or expired token.",
        },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "User is authenticated",
      user: decoded,
    });
  } catch (error) {
    console.error("Auth Me Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Authentication check failed",
      },
      { status: 500 }
    );
  }
}