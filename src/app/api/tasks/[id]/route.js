import { NextResponse } from "next/server";
import { cookies } from "next/headers";

import connectDB from "@/lib/mongodb";
import Task from "@/models/Task";
import Project from "@/models/Project";
import { verifyToken } from "@/lib/auth";

async function getAuthenticatedUser() {
  const cookieStore = await cookies();

  const token = cookieStore.get("token")?.value;

  if (!token) {
    return null;
  }

  const decoded = verifyToken(token);

  if (!decoded) {
    return null;
  }

  return decoded;
}

// GET - Single Task
export async function GET(request, { params }) {
  try {
    await connectDB();

    const user = await getAuthenticatedUser();

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized",
        },
        { status: 401 }
      );
    }

    const { id } = await params;

    const task = await Task.findOne({
      _id: id,
      userId: user.id,
    }).populate("projectId", "name");

    if (!task) {
      return NextResponse.json(
        {
          success: false,
          message: "Task not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      task,
    });
  } catch (error) {
    console.error("GET Single Task Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch task",
      },
      { status: 500 }
    );
  }
}

// PUT - Update Task
export async function PUT(request, { params }) {
  try {
    await connectDB();

    const user = await getAuthenticatedUser();

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized",
        },
        { status: 401 }
      );
    }

    const { id } = await params;

    const body = await request.json();

    const {
      projectId,
      title,
      description,
      status,
      priority,
      dueDate,
    } = body;

    // Validate title
    if (!title || !title.trim()) {
      return NextResponse.json(
        {
          success: false,
          message: "Task title is required",
        },
        { status: 400 }
      );
    }

    // Validate project
    if (!projectId) {
      return NextResponse.json(
        {
          success: false,
          message: "Project is required",
        },
        { status: 400 }
      );
    }

    // Check project ownership
    const project = await Project.findOne({
      _id: projectId,
      userId: user.id,
    });

    if (!project) {
      return NextResponse.json(
        {
          success: false,
          message: "Project not found",
        },
        { status: 404 }
      );
    }

    const task = await Task.findOneAndUpdate(
      {
        _id: id,
        userId: user.id,
      },
      {
        projectId,
        title: title.trim(),
        description: description || "",
        status: status || "Pending",
        priority: priority || "Medium",
        dueDate: dueDate || null,
      },
      {
        new: true,
        runValidators: true,
      }
    ).populate("projectId", "name");

    if (!task) {
      return NextResponse.json(
        {
          success: false,
          message: "Task not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Task updated successfully",
      task,
    });
  } catch (error) {
    console.error("PUT Task Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to update task",
      },
      { status: 500 }
    );
  }
}

// DELETE - Delete Task
export async function DELETE(request, { params }) {
  try {
    await connectDB();

    const user = await getAuthenticatedUser();

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized",
        },
        { status: 401 }
      );
    }

    const { id } = await params;

    const task = await Task.findOneAndDelete({
      _id: id,
      userId: user.id,
    });

    if (!task) {
      return NextResponse.json(
        {
          success: false,
          message: "Task not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Task deleted successfully",
    });
  } catch (error) {
    console.error("DELETE Task Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to delete task",
      },
      { status: 500 }
    );
  }
}