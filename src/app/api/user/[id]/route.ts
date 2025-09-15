import prisma from "@/utils/db";
import { NextRequest, NextResponse } from "next/server";
import { ParamsId } from "@/types/auth.type";

export async function GET(req: NextRequest, { params }: ParamsId) {
  try {
    const userId = await params.id;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        email: true,
        name: true,
        phoneNum: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        {
          message: "User does not exit with given id",
          success: false,
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        message: "User detailed has been send",
        data: user,
        success: true,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        message: "Internal Server error",
        success: false,
      },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest, { params }: ParamsId) {
  try {
    const body = await req.json();
    const userId = await params.id;

    const { name } = body;

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json({
        message: "User does not exits",
        success: false,
      });
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { name },
    });

    return NextResponse.json(
      {
        message: "User Updated successfully",
        success: true,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        message: "Internal Server error",
        success: false,
      },
      { status: 500 }
    );
  }
}

export async function DELECT({ params }: ParamsId) {
  try {
    const userId = await params.id;

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json(
        {
          message: "User no longer exit",
        },
        { status: 400 }
      );
    }

    await prisma.user.delete({
      where: { id: userId },
    });

    return NextResponse.json(
      {
        message: "User delect successfuly",
        success: true,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        message: "Internal Server error",
        success: false,
      },
      { status: 500 }
    );
  }
}
