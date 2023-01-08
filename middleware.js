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

    /* Verify token */
    if (session) {
        try {
            user = (await jwt.jwtVerify(session.value, enc.encode(process.env.JWT_SECRET ?? "testsecret"), { issuer: process.env.JWT_ISSUER ?? "youryummy"}))?.payload;
        } catch(e) {
            return redirect(req.nextUrl, "/error");
        }
    } else {
        /* Paths that need no authentication */
        if (pathname === "/about/terms") return NextResponse.next();
        if (pathname === "/register") return NextResponse.next();
        
        /* Redirect to login when no token found*/
        else return redirect(req.nextUrl, "/login");
    }

    /* Check permissions and redirect to error pages */
    if (user && pathname === "/login") {
        return redirect(req.nextUrl, "/");
    }
    else if (user && pathname === "/register") {
        return redirect(req.nextUrl, "/");
    }
    else if (user && pathname === "/profile") {
        return redirect(req.nextUrl, `/profile/${user.username}`);
    }

    return NextResponse.next();
}