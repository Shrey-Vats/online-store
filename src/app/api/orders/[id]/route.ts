/*
GET /orders/:id → get single order
PUT /orders/:id/status → update order status (admin)
DELETE /orders/:id → cancel order (user/admin)
*/

import { ParamsId } from "@/types/auth.type";
import prisma from "@/utils/db";
import { NextResponse } from "next/server";

export async function GET({params}: ParamsId){
    const orderId = await params.id;

    try {
    
        const order = await prisma.order.findFirst({
            where: {
                id: orderId
            },
            select: {
                OrderItems: true
            }
        })

        if(!order){
            return NextResponse.json({
                message: "Order no longer exit here"
            })
        }

        return NextResponse.json({
            message: "Order has been send",
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

export async function DELETE({params}: ParamsId){
    try {
          const orderId = await params.id;

    const order = await prisma.order.findUnique({
        where:{
            id: orderId
        }
    })

    if (!order ){
        return NextResponse.json({
            message: "order not found",
            success: false
        }, {status: 400})
    }

    const delectedOrder = await prisma.order.delete({
        where: {
            id: order.id
        }
    })

    return NextResponse.json({
        message: "Order has been delete",
        success: true,
        data: delectedOrder
    }, {status: 200})
    } catch (error) {
            console.error(error)
    return NextResponse.json({
        message: "Internal server error",
        success: false
    }, {status: 500})
    }
}