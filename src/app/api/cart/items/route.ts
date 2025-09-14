/*
POST /cart/items → add product to cart
PUT /cart/items/:id → update quantity
DELETE /cart/items/:id → remove product from cart
 */

import { jwtItems } from "@/types/auth.type";
import prisma from "@/utils/db";
import { NextRequest, NextResponse } from "next/server";
import { POST } from "../route";

export default async function (req: NextRequest) {  
    try {
      const body = await req.json();
      const { productId } = body;
    
      const userDetails: jwtItems = JSON.parse(req.headers.get("user")!);
    
      let cart = await prisma.cart.findFirst({
        where: { userId: userDetails.id },
      });
    
      if (!cart) {
        cart = await prisma.cart.create({
          data: {
            userId: userDetails.id,
          },
        });
      }
      
      const cartItem = await prisma.cartItem.create({
        data: {
            cartId: cart.id,
            productId: productId 
        }
      })
    
      NextResponse.json({
        message: "Item added successfuly",
        success: true,
        data: cartItem
      }, {status: 200})
    

  } catch (error) {
    console.error(error);
    NextResponse.json({
        message: "Internal Server error",
        success: false
    }, {status: 500})
  }
}
