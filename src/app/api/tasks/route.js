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

// GET - User's Tasks
export async function GET() {
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

    const tasks = await Task.find({
      userId: user.id,
    })
      .populate("projectId", "name")
      .sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      tasks,
    });
  } catch (error) {
    console.error("GET Tasks Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch tasks",
      },
      { status: 500 }
    );
  }
}

// POST - Create Task
export async function POST(request) {
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

    // Check that project belongs to logged-in user
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

    // Create task
    const task = await Task.create({
      userId: user.id,
      projectId,
      title: title.trim(),
      description: description || "",
      status: status || "Pending",
      priority: priority || "Medium",
      dueDate: dueDate || null,
    });

    // Get project name also
    const populatedTask = await Task.findById(task._id).populate(
      "projectId",
      "name"
    );

    return NextResponse.json(
      {
        success: true,
        message: "Task created successfully",
        task: populatedTask,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST Tasks Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to create task",
      },
      { status: 500 }
    );
  }
}