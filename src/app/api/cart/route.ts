/*
GET /cart → get current user’s cart
POST /cart → create a new cart (usually created on first add-to-cart)
POST /cart/items → add product to cart
PUT /cart/items/:id → update quantity
DELETE /cart/items/:id → remove product from cart
DELETE /cart → clear cart
*/

import { jwtItems } from "@/types/auth.type";
import prisma from "@/utils/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const user: jwtItems = JSON.parse(req.headers.get("user")!);

  try {
    const cart = await prisma.cart.findFirst({
      where: {
        userId: user.id,
      },
      select: {
        cartItems: true,
      },
    });

    if (!cart) {
      return NextResponse.json(
        {
          message: "Add any item in the cart",
          success: false,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        message: "cart found successfuly",
        success: true,
        data: cart,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    NextResponse.json(
      {
        message: "Internal Server error",
        success: false,
      },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  const userDetails: jwtItems = JSON.parse(req.headers.get("user")!);

  let user = await prisma.cart.findFirst({
    where: { userId: userDetails.id },
  });

  if (!user) {
    user = await prisma.cart.create({
      data: {
        userId: userDetails.id,
      },
    });
  }

  return NextResponse.json(
    {
      message: "Cart created successfully",
      success: false,
      data: user,
    },
    { status: 200 }
  );
}

export async function DELECT(req: NextRequest) {
  try {
    const user: jwtItems = JSON.parse(req.headers.get("user")!);

    const cart = await prisma.cart.findFirst({
      where: {
        userId: user.id,
      },
    });

    const deleteMany = await prisma.cartItem.deleteMany({
      where: {
        cartId: cart?.id,
      },
    });

    return NextResponse.json(
      {
        message: "All product removed successfully",
      },
      { status: 200 }
    );
  } catch (error) {}
}


// 