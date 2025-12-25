import { NextResponse, type NextRequest } from "next/server";
const routePages = ["/"];

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("access_token")?.value ?? null;

  if (routePages.includes(request.nextUrl.pathname)) {
    if (token) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    } else {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  if (request.method === "GET") {
    const response = NextResponse.next();

    if (token !== null) {
      response.cookies.set("access_token", token, {
        path: "/",
        maxAge: 60 * 60 * 24 * 30,
        sameSite: "lax",
        httpOnly: true,
      });
    }

    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|public|_next/static|_next/image|.*\\.png$).*)"],
};
