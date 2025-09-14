import { NextRequest, NextResponse, NextMiddleware } from "next/server";
import jwt from "jsonwebtoken"
import { jwtItems } from "@/types/auth.type";

export default async function middleware(req: NextRequest){
    const SECRET = process.env.SECRET || ""
    const token = req.cookies.get("token")?.value

    if (!token) return NextResponse.redirect(new URL("/sign-in", req.url))

    try {
        const decoded = jwt.verify(token, SECRET) as jwtItems

        const requestHeader = new Headers(req.headers);
        requestHeader.set("user", JSON.stringify(decoded))


        return NextResponse.next({
            request: {
                headers: requestHeader
            }
        })
    } catch (error) {
         return NextResponse.redirect(new URL("/sign-in", req.url));
    }
}


export const config = {
  matcher: ["/api/:path*"], // protect all API routes
}