/*
POST /orders → create new order from cart
GET /orders → get all orders (for admin/user)
GET /orders/:id → get single order
PUT /orders/:id/status → update order status (admin)
DELETE /orders/:id → cancel order (user/admin)
*/

import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import prisma from "@/utils/db";
import { itemType } from "@/types/order.type";
import { success } from "zod";
import { error } from "console";

export async function POST(req: NextRequest) {
  const SECRET = process.env.SECRET || "";
  const token = req.cookies.get("token")?.value;

  if (!token) {
    return NextResponse.json(
      { message: "Unauthorized: No token provided", success: false },
      { status: 401 }
    );
  }

  try {
    const user = jwt.verify(token, SECRET) as {
      id: string;
      [key: string]: any;
    };
    const items: itemType[] = await req.json();

    const order = await prisma.order.create({
      data: {
        userId: user.id,
        OrderItems: {
          create: items.map((item: itemType) => ({
            productId: item.productId,
            quantity: item.quantity,
          })),
        },
      },
      include: {
        OrderItems: true,
      },
    });

    return NextResponse.json(
      {
        message: "Order has been placed",
        success: true,
        data: order,
      },
      { status: 201 }
    );
  } catch {
    console.error(error);
    return NextResponse.json(
      {
        message: "Internal server error",
        success: false,
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const orders = await prisma.order.findMany();

    return NextResponse.json(
      {
        message: "Orders has been send",
        data: orders,
        success: true,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        message: "Internal server error",
        success: false,
      },
      { status: 500 }
    );
  }
}
