import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials"; // for building custom provider
import { connectToDatabase, findDocument } from "@/lib/server/database";
import { verifyPassword } from "@/lib/server/auth";

const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  providers: [
    CredentialsProvider({
      credentials: {
        email: { label: "email", type: "text" },
        password: { label: "password", type: "password" },
      },
      authorize: async (credentials) => {
        if (!credentials) {
          // validate input here (zod) https://nextjs.org/learn/dashboard-app/adding-authentication
          throw new Error("Invalid input");
        }

        const client = await connectToDatabase();

        // check if user exists

        const user = await findDocument(client, "users", {
          email: credentials.email,
        });
        if (!user) {
          throw new Error("User not found");
        }

        // check if password is correct
        const isValid = await verifyPassword(
          credentials.password,
          user.password,
        );
        if (!isValid) {
          throw new Error("Could not log you in");
        }

        //return custom data for JWT
        return { email: user.email, id: user.id };
      },
    }),
  ],
};

const handler = NextAuth(authOptions);

export default handler;
