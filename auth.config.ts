import { decodeJwt } from "jose";
import { AuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import handleLogout from "./src/shared/utitlity/log-out";

interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  // profile: UserProfile;
}

export async function refreshAccessToken(token: any) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_APP_API}/auth/refresh`,
      {
        method: "GET",
        headers: {
          "x-refresh-token": token.refreshToken,
        },
      }
    );
    if (!response.ok) {
      if (response.status === 401) {
        console.warn("Refresh token expired");
        return { ...token, error: "RefreshTokenExpired" };
      }
      throw new Error("Failed to refresh token");
    }

    const data = await response.json();
    console.log("refresh token data", data);
    const returnData = {
      ...token,
      accessToken: data.token,
      refreshToken: data.refreshToken,
    };
    console.log("returnData", returnData);
    return returnData;
  } catch (error: any) {
    console.error("Error refreshing access token:", error.message);
    await handleLogout();
    return { ...token, error: "RefreshTokenError" };
  }
}

// Function to update token with new user data
export async function updateTokenWithUserData(session: any) {
  try {
    return {
      ...session,
      accessToken: session.accessToken,
      refreshToken: session.refreshToken,
    };
  } catch (error: any) {
    console.error("Error updating token with user data:", error);
    return session;
  }
}

export const authConfig: AuthOptions = {
  session: { strategy: "jwt" },
  secret:
    process.env.AUTH_SECRET || "072+s5MdhjIugCd9Z0BEmhBVnkCRVQuxbzymIWASSuo=",

  callbacks: {
    // Handle JWT callback
    async jwt({ token, user, trigger, session }) {
      // First login
      if (user) {
        const authUser = user as unknown as AuthResponse;
        return {
          accessToken: authUser.accessToken,
          refreshToken: authUser.refreshToken,
        };
      }

      // Handle user profile update
      if (trigger === "update") {
        return updateTokenWithUserData(session);
      }

      // Handle token expiration
      if (token.accessToken) {
        const currentTimestamp = Math.floor(Date.now() / 1000);
        const decodedToken = decodeJwt(token.accessToken as string);

        const tokenExpiry = decodedToken.exp;
        const bufferTime = 30;

        if (tokenExpiry && currentTimestamp >= tokenExpiry - bufferTime) {
          console.log("Token needs refresh, requesting new token...");
          const newToken = await refreshAccessToken(token);
          if (newToken.error) {
            console.log("Token refresh failed:", newToken.error);
            return { ...token };
          }

          return newToken;
        }
      }

      return token;
    },

    // Handle session callback
    async session({ session, token }: any) {
      if (token.error) {
        // Handle session error with proper error message
        throw new Error(token.error as string);
      }

      return {
        ...session,
        accessToken: token.accessToken as string,
        refreshToken: token.refreshToken as string,
      };
    },

    // Removed the 'authorized' callback as it is not supported by next-auth
  },

  // Removed 'redirectProxyUrl' as it is not a valid property of 'AuthOptions'
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
    verifyRequest: "/auth/verify-request",
  },

  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) {
            throw new Error("Please enter your email and password.");
          }

          const response = await fetch(
            `${process.env.NEXT_PUBLIC_APP_API}/auth/login`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                email: credentials.email,
                password: credentials.password,
              }),
            }
          );
          const { accessToken, refreshToken, profile } = await response.json();
          if (!accessToken) {
            throw new Error("Login failed");
          }

          return {
            id: profile?.id || accessToken, // Ensure 'id' is included
            accessToken,
            refreshToken,
            profile,
          };
        } catch (error: any) {
          console.error("Login error:", error.message);
          return null;
        }
      },
    }),
  ],
};
