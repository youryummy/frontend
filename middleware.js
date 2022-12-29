import { NextResponse } from "next/server"
import * as jwt from 'jose';

const enc = new TextEncoder();

function redirect(url, redirectPath) {
    if (url.pathname === redirectPath) return NextResponse.next();
    else {
        url.pathname = redirectPath;
        return NextResponse.redirect(url);
    }
}

export async function middleware(req) {
    const session = req.cookies.get("authToken");
    const { pathname } = req.nextUrl;
    let user;

    /* Needed to render the views */
    if (pathname.startsWith("/_next")) {
        return NextResponse.next();
    }

    /* Paths that need no authentication */
    if (pathname === "/about/terms") return NextResponse.next();

    /* Verify token and redirect to login if token not found */
    if (session) {
        try {
            user = await jwt.jwtVerify(session.value, process.env.JWT_SECRET ?? enc.encode("testsecret"), { issuer: process.env.JWT_ISSUER ?? "youryummy"});
        } catch(e) {
            return redirect(req.nextUrl, "/error");
        }
    } else {
        return redirect(req.nextUrl, "/login");
    }

    /* Check permissions and redirect to error pages */
    if (user && pathname === "/login") {
        return redirect(req.nextUrl, "/");
    }

    return NextResponse.next();
}