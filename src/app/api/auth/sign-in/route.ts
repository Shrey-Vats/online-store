import { signInSchema } from "@/schemas/auth.schema";
import prisma from "@/utils/db";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken"

export default async function POST(req: NextRequest) {
    try {
            const body = await req.json()
    const {email, password} = body;

    const cookiesStore = await cookies()

    const result = signInSchema.safeParse(body);
    const SECRET = process.env.SECRET || ""

    if (!result.success){
        return NextResponse.json({
            message: result.error.message[0],
            success: false
        }, {status: 404})
    }

    const isEmailExit = await prisma.user.findUnique({
        where: {email}
    })

    if(!isEmailExit){
        return NextResponse.json({
            message: "Email does not exits in db"
        })
    }

    const isPasswordMatch = await bcrypt.compare(password, isEmailExit.password);

    if(!isPasswordMatch){
        return NextResponse.json({
            message: "Password is Invalid",
            success: false
        }, {status: 402})
    }

    const token = jwt.sign({
        email,
        name: isEmailExit.name,
        phoneNum: isEmailExit.phoneNum,
        id: isEmailExit.id
    }, SECRET)

    const setCookies = cookiesStore.set("token", token)
    console.log(setCookies);

    return NextResponse.json({
        message: "User login successfuly",
        success: true
    }, {status: 200})
    } catch (error) {
        console.error(error);
        return NextResponse.json({
            message: "Internal server error",
            success: false
        }, {status: 500})
    }
}