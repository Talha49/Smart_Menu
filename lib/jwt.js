import { SignJWT, jwtVerify } from 'jose';

if (!process.env.AUTH_SECRET) {
  throw new Error("AUTH_SECRET environment variable is required");
}
const secret = new TextEncoder().encode(process.env.AUTH_SECRET);

export async function signJWT(payload) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('30d')
    .sign(secret);
}

export async function verifyJWT(token) {
  // Local-dev-only convenience - see middleware.js for why this can't fire
  // in a deployed build regardless of leftover env vars.
  const isAuthBypassed = process.env.NODE_ENV !== "production" &&
    (process.env.BYPASS_AUTH === "true" || process.env.NEXT_PUBLIC_BYPASS_AUTH === "true");

  if (isAuthBypassed && (!token || token === "mock-bypass-token")) {
    try {
      const dbConnect = (await import("@/lib/mongodb")).default;
      const User = (await import("@/models/User")).default;

      await dbConnect();
      // Look up the pre-created SQA test user (Testing@gmail.com)
      let user = await User.findOne({ email: "testing@gmail.com" });
      
      if (!user) {
        // Fallback: Create locally if not present in the environment
        user = await User.create({
          name: "Testing User",
          email: "testing@gmail.com",
          password: "$2a$10$placeholderpasswordhashforsecurity12345"
        });
      }

      return {
        id: user._id.toString(),
        name: user.name,
        email: user.email
      };
    } catch (e) {
      console.error("Bypass user resolution error:", e);
      return {
        id: "659d8721c54b73b53f36a5a0",
        name: "Testing User",
        email: "testing@gmail.com"
      };
    }
  }

  try {
    const { payload } = await jwtVerify(token, secret);
    return payload;
  } catch (error) {
    return null;
  }
}
