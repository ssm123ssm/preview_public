import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isProtectedRoute = createRouteMatcher([
  "/dashboard(.*)",
  "/protected/(.*)",
  "/how-to",
]);
console.log("isProtectedRoute");
export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) await auth.protect();
});

export const config = {
  matcher: [
    "/((?!.*\\..*|_next).*)",
    "/",
    "/protected/(.*)",
    "/how-to/(.*)",
    "/api/:path*",
  ],
};
