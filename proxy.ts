import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { AUTH_ROUTES, normalizeCurrentUser } from "@/lib/authShared";

export async function proxy(request: NextRequest) {
  let response = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options);
          });
        },
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const currentUser = normalizeCurrentUser(user);
  const { pathname } = request.nextUrl;
  const isAuthRoute = AUTH_ROUTES.includes(pathname as (typeof AUTH_ROUTES)[number]);
  const isPendingRoute = pathname === "/pending";
  const isInviteSignup =
    pathname === "/signup" &&
    (
      request.nextUrl.searchParams.has("code") ||
      request.nextUrl.searchParams.has("token_hash") ||
      request.nextUrl.searchParams.get("type") === "invite"
    );

  if (!currentUser && !isAuthRoute) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (currentUser?.role === "pending" && !isPendingRoute && !isInviteSignup) {
    return NextResponse.redirect(new URL("/pending", request.url));
  }

  if (currentUser && isAuthRoute && currentUser.role !== "pending" && !isInviteSignup) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|mockServiceWorker\\.js|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
