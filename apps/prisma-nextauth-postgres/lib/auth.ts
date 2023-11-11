import { PrismaAdapter } from "@auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";
import { AuthOptions } from "next-auth";
import EmailProvider from "next-auth/providers/email";
import db from "./db";
import { Adapter } from "next-auth/adapters";

export const options = {
  providers: [
    EmailProvider({
      server: {
        host: process.env.EMAIL_SERVER_HOST,
        port: process.env.EMAIL_SERVER_PORT,
        auth: {
          user: process.env.EMAIL_SERVER_USER,
          pass: process.env.EMAIL_SERVER_PASSWORD,
        },
      },
      from: process.env.EMAIL_FROM,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  adapter: PrismaAdapter(db) as Adapter,
  session: {
    strategy: "database",
    maxAge: 30 * 24 * 60 * 60,
  },
  pages: {
    signIn: "/auth/signIn",
    verifyRequest: "/auth/verifyRequest",
  },
  callbacks: {
    async session({ session, user }) {
      session.user = user;
      return session;
    },
  },
  events: {
    async signIn(message) {
      console.log("Signed in!", { message });
    },
    async signOut(message) {
      console.log("Signed out!", { message });
    },
    async createUser(message) {
      console.log("User created!", { message });
    },
  },
} satisfies AuthOptions;
