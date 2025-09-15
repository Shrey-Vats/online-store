/*
GET /cart → get current user’s cart
POST /cart → create a new cart (usually created on first add-to-cart)
POST /cart/items → add product to cart
PUT /cart/items/:id → update quantity
DELETE /cart/items/:id → remove product from cart
DELETE /cart → clear cart
*/
import jwt from "jsonwebtoken"
import { jwtItems } from "@/types/auth.type";
import prisma from "@/utils/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {

 const SECRET = process.env.SECRET || "";
  const token = req.cookies.get("token")?.value;
        
  if (!token) {
    return NextResponse.json(
      { message: "Unauthorized: No token provided", success: false },
      { status: 401 }
    );
  }

  try {

    const user = jwt.verify(token, SECRET) as { id: string; [key: string]: any };

    const cart = await prisma.cart.findFirst({
      where: { userId: user.id },
      select: { cartItems: true },
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
    return NextResponse.json(
      {
        message: "Internal Server error",
        success: false,
      },
      { status: 500 }
    );
  }
}

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
    const user = jwt.verify(token, SECRET) as { id: string; [key: string]: any };

  let cart = await prisma.cart.findFirst({
    where: { userId: user.id },
  });

  if (!cart) {
    cart = await prisma.cart.create({
      data: {
        userId: user.id,
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
} catch {

}
}

export async function DELECT(req: NextRequest) {
  try {
  const SECRET = process.env.SECRET || "";
  const token = req.cookies.get("token")?.value;
        
  if (!token) {
    return NextResponse.json(
      { message: "Unauthorized: No token provided", success: false },
      { status: 401 }
    );
  }
    const user = jwt.verify(token, SECRET) as { id: string; [key: string]: any };


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