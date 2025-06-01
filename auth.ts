import { DefaultSession } from "next-auth";
import type { User, Account } from "next-auth";
import type { JWT } from "next-auth/jwt";
import { db } from "./lib/database.connection";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { getUserById, getUserByEmail } from "./lib/actions/user.action";
import { UserRole } from "@prisma/client";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import Github from "next-auth/providers/github";
import bcrypt from "bcryptjs";
import { Session } from "next-auth";
import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: UserRole;
      createdAt?: Date;
    } & DefaultSession["user"];
  }

  interface User {
    role: UserRole;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role: UserRole;
  }
}
export const config = {
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    Github({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
    Credentials({
      async authorize(credentials: Record<string, unknown>) {
        const email = credentials.email as string;
        const password = credentials.password as string;

        const user = await getUserByEmail(email);
        if (!user || !user.password) return null;

        const passwordsMatch = await bcrypt.compare(password, user.password);
        if (passwordsMatch) {
          return user;
        }
        return null;
      },
    }),
  ],
  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
  },
  trustHost: true,
  callbacks: {
    async signIn({ user, account }: { user: User; account: Account | null }) {
      if (account?.provider !== "credentials") {
        if (!user.email) return false;

        const existingUser = await getUserByEmail(user.email);

        if (existingUser) {
          return true;
        }

        await db.user.create({
          data: {
            email: user.email,
            name: user.name,
            image: user.image,
            role: UserRole.USER,
          },
        });
        return true;
      }

      if (!user.id) return false;
      const existingUser = await getUserById(user.id);
      if (!existingUser) return false;

      return true;
    },

    async session({ token, session }: { token: JWT; session: Session }) {
      if (token.sub && session.user) {
        const user = await getUserById(token.sub);
        session.user.id = token.sub;
        session.user.name = token.name as string;
        session.user.email = token.email as string;
        session.user.role = token.role as UserRole;
        session.user.image = token.picture as string | undefined;
        session.user.createdAt = user?.createdAt;
      }
      return session;
    },

    async jwt({ token }: { token: JWT }) {
      if (!token.sub) return token;

      const existingUser = await db.user.findUnique({
        where: { id: token.sub },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          image: true,
        },
      });

      if (!existingUser) return token;

      return {
        ...token,
        id: existingUser.id,
        name: existingUser.name,
        email: existingUser.email,
        role: existingUser.role,
        picture: existingUser.image,
      };
    },

    async redirect({ url, baseUrl }: { url: string; baseUrl: string }) {
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },
  },
  adapter: PrismaAdapter(db),
  session: {
    strategy: "jwt" as const,
  },
};

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth(config as any);
