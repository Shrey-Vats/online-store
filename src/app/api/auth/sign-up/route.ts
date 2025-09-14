import { NextRequest, NextResponse } from "next/server";
import prisma from "@/utils/db";
import { signUpSchema } from "@/schemas/auth.schema";
import bcrypt from "bcryptjs";

export default async function POST(req: NextRequest, res: NextResponse) {
  try {
      const body = await req.json()
    
    const result = signUpSchema.safeParse(body);

    const {name, email, phoneNum ,password } = body

    if (!result.success){
         NextResponse.json({
            success: false,
            message: result.error.message[0]
        }, {status: 400})
    }

    const isPhoneNumAlreadyExits = await prisma.user.findUnique({
        where : {phoneNum}
    })

    if(isPhoneNumAlreadyExits){
       return NextResponse.json({
            success: false,
            message: "Phone Number already linked to other account"
        }, {status: 400})
    }

    const isEmailAlreadyExits = await prisma.user.findUnique({
        where: {email}
    })

    if (isEmailAlreadyExits){
       return  NextResponse.json({
            message: "Email already exit in db",
            success: false
        }, {status: 401})
    }

    const hashPassowrd = await bcrypt.hash(password, 10)

    const user = await prisma.user.create({
        data: {
            name,
            email,
            phoneNum,
            password: hashPassowrd
        }
    })

   return NextResponse.json({
        message: "User Created successfully",
        success: true,
        user
    }, {status: 200})
  } catch (error) {
    console.error(error);
    return NextResponse.json({
        message: "Internal server error",
        success: false
    }, {status: 500})
  }
}