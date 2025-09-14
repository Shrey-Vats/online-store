/*
GET /products/:id → get single product details
PUT /products/:id → update product (admin/seller)
DELETE /products/:id → remove product
*/
import { productSchema } from "@/schemas/product.schema";
import { ParamsId } from "@/types/auth.type";
import prisma from "@/utils/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params }: ParamsId) {
  const productId = params.id;

  try {
    const product = prisma.product.findUnique({
      where: { id: productId },
    });

    return NextResponse.json(
      {
        message: "Product detailed send successfuly",
        success: true,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        message: "Internal Server Problem",
        success: false,
      },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest, { params }: ParamsId) {
  const productId = params.id;
  const body = await req.json();

  const { title, description, price, quantity } = body;
  const result = productSchema.safeParse(body);

  if (!result.success) {
    return NextResponse.json(
      {
        message: result.error.message[0],
        success: false,
      },
      { status: 400 }
    );
  }

  const product = prisma.product.findUnique({
    where: { id: productId },
  });

  const UpdatedProduct = prisma.product.update({
    where: { id: productId },
    data: {
      title,
      description,
      price,
      quantity,
    },
  });

  return NextResponse.json(
    {
      message: "Updated successfuly",
      success: true,
      data: UpdatedProduct,
    },
    { status: 200 }
  );
}

export async function DELECT(req: NextRequest, { params }: ParamsId) {
  try {
    const productId = params.id;

    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return NextResponse.json(
        {
          message: "Product does not exit's",
          success: false,
        },
        { status: 401 }
      );
    }

    await prisma.product.delete({
      where: { id: productId },
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        message: "Internal Server Problem",
        success: false,
      },
      { status: 500 }
    );
  }
}