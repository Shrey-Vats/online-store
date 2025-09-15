/*
GET /products → list all products (with pagination & filters)
GET /products/:id → get single product details
POST /products → add new product (admin/seller)
PUT /products/:id → update product (admin/seller)
DELETE /products/:id → remove product
*/

import { productSchema } from "@/schemas/product.schema";
import prisma from "@/utils/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const allProduct = await prisma.product.findMany();

    return NextResponse.json(
      {
        message: "Product send successfuly",
        data: allProduct,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    NextResponse.json(
      {
        message: "Internal server error",
        success: false,
      },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
    
    try {
       const body = await req.json();
     
       const { title, description, price, quantity } = body;
       const result = productSchema.safeParse(body);
     
       if (!result.success) {
         return NextResponse.json(
           {
             message: result.error.message[0],
             success: false,
           },
           { status: 401 }
         );
       }
     
       const slug = title
         .toLowerCase()
         .trim()
         .replace(/[^\w\s-]/g, "")
         .replace(/\s+/g, "-")
         .replace(/-+/g, "-");
     
        const isSlugMatch = await prisma.product.findUnique({
         where: {slug}
        })
     
        if(isSlugMatch){
         return NextResponse.json({
             message: "title already exit, change the title",
             success: false
         }, {status: 400})
        }
     
        const product = await prisma.product.create({
         data: {
             title,
             description,
             slug,
             price: parseFloat(price),
             quantity: parseInt(quantity)
         }
        })
     
        return NextResponse.json({
         message: "Product Created successfuly",
         success: true,
         data: product
        }, {status: 200})
     
    

   } catch (error) {
    console.error(error);
    return NextResponse.json({
        message: "Internal Server Problem",
        success: false
    }, {status: 500})
   }
}
