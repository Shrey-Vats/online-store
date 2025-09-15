/*
POST /products/:id/reviews → add review
GET /products/:id/reviews → get reviews for a product
PUT /reviews/:id → edit review (author only)
DELETE /reviews/:id → delete review
*/

import { ParamsId } from "@/types/auth.type";
import prisma from "@/utils/db";
import { NextRequest, NextResponse } from "next/server";
import {reviewScheam} from "@/schemas/review.schema"
export async function GET({params}: ParamsId){
    try {
        const productId = await params.id

        const product = await prisma.product.findUnique({
            where: {
                id: productId
            }
        })

        if (!product){
            return NextResponse.json({
                message: "Product not found",
                success: false
            }, {status: 404})
        }

        const review = await prisma.review.findMany();

        return NextResponse.json({
            message: "All review visible",
            success: true,
            data: review
        }, {status: 200})

    } catch (error) {
            console.error(error)
    return NextResponse.json({
        message: "Internal server error",
        success: false
    }, {status: 500})
    }
}

export async function POST(req: NextRequest,{params}: ParamsId){
    try {
        const productId = await params.id
        const body = await req.json()
        
        const result = reviewScheam.safeParse(body);
        const {title, description, rating} = body

        if(!result.success){
            return NextResponse.json({
                message: result.error.issues[0]
            })
        }

              const product = await prisma.product.findUnique({
            where: {
                id: productId
            }
        })
        if (!product){
            return NextResponse.json({
                message: "Product not found",
                success: false
            }, {status: 404})
        }
        
        const review = await prisma.review.create({
            data: {
                title,
                description,
                rating,
                productId: productId
            }
        })

        return NextResponse.json({
            message: "Reviw is added",
            success: true
        }, {status: 200})
      
    } catch (error) {
            console.error(error)
    return NextResponse.json({
        message: "Internal server error",
        success: false
    }, {status: 500})
    }
}

//TODO: add delect and edit 