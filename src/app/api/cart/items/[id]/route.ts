/*
PUT /cart/items/:id → update quantity
DELETE /cart/items/:id → remove product from cart
*/
import { ParamsId } from "@/types/auth.type";
import prisma from "@/utils/db";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken"
export async function PUT(req: NextRequest, {params}: ParamsId) {

    const productId = params.id

    try {
        const item = await prisma.cartItem.findFirst({
            where: {
                id: productId
            }
        })

        if(!item) {

            // TODO: implment here the logic for add item in cart
            return NextResponse.json({
                message: "Pls. first item in cart",
                success: false
            }, {status: 400})
        }

        const update = await prisma.cartItem.update({
            where: {
                id: item.id
            },
            data: {
                
            }
        })

        NextResponse.json({
            message: "successfuly updated",
            success: true
        }, {status: 200})

    } catch (error) {
        console.error(error)
           NextResponse.json({
            message: "Internal server error",
            success: false
        }, {status: 500})

    }
}

export async function DELETE(req: NextRequest,{params}: ParamsId) {
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
    const productId = await params.id;

    console.log(productId)
        const cart = await prisma.cart.findFirst({
            where: {
                userId: user.id
            }
        })

        console.log(cart)
        if(!cart){
            NextResponse.json({
                message: "Cart do no exits",
                success: false
            }, {status: 404})
        }
        const product = await prisma.cartItem.findFirst({
            where: {
                productId,
                cartId: cart?.id
            }
        })
        console.log(product)

        if(!product){
            return NextResponse.json({
                message: "Invalid product"
            })
        }
        await prisma.cartItem.delete({
            where: {
                id: product.id
            }
        })

        NextResponse.json({
            message: "successfuly delect",
            success: true
        }, {status: 200})

    } catch (error) {
        console.error(error)
           NextResponse.json({
            message: "Internal server error",
            success: false
        }, {status: 500})

    }
}