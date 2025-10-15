// import { clerkMiddleware, createRouteMatcher, auth } from '@clerk/nextjs/server'
// import { NextResponse } from 'next/server';


// const isPublicRoute = createRouteMatcher(["/","/sign-in(.*)", "/sign-up(.*)"]);

// export default clerkMiddleware(async (auth,request) => {
//     const user = auth();
//     const userId = (await user).userId;
//     const url = new URL(request.url)

//     if(userId && isPublicRoute(request) && url.pathname !== "/"){
//         return NextResponse.redirect(new URL("/dashboard", request.url))
//     }

//     // Protect non-public routes
//     if (!isPublicRoute(request)) {
//         await auth.protect()
//     }

// });



// export const config = {
//   matcher: [
//     // Skip Next.js internals and all static files, unless found in search params
//     '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
//     // Always run for API routes
//     '/(api|trpc)(.*)',
//   ],
// }


// middleware.ts (replace your current file with this)
import { clerkMiddleware, createRouteMatcher, auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server';

const isPublicRoute = createRouteMatcher(["/","/sign-in(.*)", "/sign-up(.*)"]);

export default clerkMiddleware(async (auth, request) => {
  const url = new URL(request.url);

  // If this is a public route, only call auth() when needed for redirect.
  if (isPublicRoute(request)) {
    const t0 = Date.now();
    try {
      console.log("[middleware] public route, checking auth() for possible redirect");
      const tAuthStart = Date.now();
      const user = await auth(); // only called for public routes now
      console.log("[middleware] auth() ms:", Date.now() - tAuthStart);

      const userId = user?.userId;
      if (userId && url.pathname !== "/") {
        console.log("[middleware] redirecting logged-in user to /dashboard");
        return NextResponse.redirect(new URL("/dashboard", request.url));
      }
    } catch (err) {
      // log but do not block — we still want public pages to load
      console.warn("[middleware] auth() error (public route):", err);
    } finally {
      console.log("[middleware] public-route total ms:", Date.now() - t0);
    }

    // Allow public route to continue
    return NextResponse.next();
  }

  // Non-public routes: protect the route (this may call Clerk under the hood)
  const tProtectStart = Date.now();
  try {
    console.log("[middleware] protecting non-public route:", url.pathname);
    await auth.protect();
    console.log("[middleware] auth.protect() ms:", Date.now() - tProtectStart);
  } catch (err) {
    console.error("[middleware] auth.protect() error:", err);
    // Let Clerk handle redirects/errors normally by rethrowing
    throw err;
  } finally {
    console.log("[middleware] middleware total ms (non-public):", Date.now() - tProtectStart);
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};
