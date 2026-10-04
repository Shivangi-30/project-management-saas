import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";

import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import { verifyToken, createToken } from "@/lib/auth";

export async function PUT(request) {
  try {
    await connectDB();

    // Get token from cookie
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized",
        },
        { status: 401 }
      );
    }

    // Verify token
    const decoded = verifyToken(token);

    if (!decoded) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid or expired token",
        },
        { status: 401 }
      );
    }

    // Get request data
    const body = await request.json();

    const {
      currentPassword,
      newPassword,
      confirmPassword,
    } = body;

    // Validate current password
    if (!currentPassword) {
      return NextResponse.json(
        {
          success: false,
          message: "Current password is required",
        },
        { status: 400 }
      );
    }

    // Validate new password
    if (!newPassword) {
      return NextResponse.json(
        {
          success: false,
          message: "New password is required",
        },
        { status: 400 }
      );
    }

    // Validate confirm password
    if (!confirmPassword) {
      return NextResponse.json(
        {
          success: false,
          message: "Please confirm your new password",
        },
        { status: 400 }
      );
    }

    // Check minimum password length
    if (newPassword.length < 6) {
      return NextResponse.json(
        {
          success: false,
          message: "New password must be at least 6 characters",
        },
        { status: 400 }
      );
    }

    // Check new password confirmation
    if (newPassword !== confirmPassword) {
      return NextResponse.json(
        {
          success: false,
          message: "New passwords do not match",
        },
        { status: 400 }
      );
    }

    // Find logged-in user
    const user = await User.findById(decoded.id);

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 404 }
      );
    }

    // Verify current password
    const isPasswordCorrect = await bcrypt.compare(
      currentPassword,
      user.password
    );

    if (!isPasswordCorrect) {
      return NextResponse.json(
        {
          success: false,
          message: "Current password is incorrect",
        },
        { status: 400 }
      );
    }

    // Prevent using the same password
    const isSamePassword = await bcrypt.compare(
      newPassword,
      user.password
    );

    if (isSamePassword) {
      return NextResponse.json(
        {
          success: false,
          message: "New password must be different from current password",
        },
        { status: 400 }
      );
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(
      newPassword,
      10
    );

    // Update password
    user.password = hashedPassword;

    await user.save();

    // Create fresh token
    const newToken = createToken(user);

    const response = NextResponse.json({
      success: true,
      message: "Password changed successfully",
    });

    // Update authentication cookie
    response.cookies.set("token", newToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Change Password Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to change password",
      },
      { status: 500 }
    );
  }
}