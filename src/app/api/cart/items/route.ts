/*
POST /cart/items → add product to cart
PUT /cart/items/:id → update quantity
DELETE /cart/items/:id → remove product from cart
 */

import { jwtItems } from "@/types/auth.type";
import prisma from "@/utils/db";
import jwt from "jsonwebtoken"
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {  
  try {
   const SECRET = process.env.SECRET || "";
   const token = req.cookies.get("token")?.value;
           
   const {productId} = await req.json()

     if (!token) {
       return NextResponse.json(
         { message: "Unauthorized: No token provided", success: false },
         { status: 401 }
       );
     }

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
      
      const cartItem = await prisma.cartItem.create({
        data: {
            cartId: cart.id,
            productId: productId 
        }
      })
    
      return NextResponse.json({
        message: "Item added successfuly",
        success: true,
        data: cartItem
      }, {status: 200})
    

  } catch (error) {
    console.error(error);
    return NextResponse.json({
        message: "Internal Server error",
        success: false
    }, {status: 500})
  }
}
