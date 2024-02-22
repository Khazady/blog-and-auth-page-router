import { hashPassword, verifyPassword } from "@/lib/server/auth";
import {
  connectToDatabase,
  findDocument,
  updateDocument,
} from "@/lib/server/database";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "PATCH") return;

  // protect route from unauthenticated access
  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    res.status(401).json({ message: "Not authenticated" });
    return;
  }

  const userEmail = session.user.email;
  const oldPassword = req.body.oldPassword;
  const newPassword = req.body.newPassword;

  if (oldPassword === newPassword) {
    res
      .status(422)
      .json({ message: "New password cannot be the same as the old password" });
    return;
  }
  let client;
  try {
    client = await connectToDatabase();
  } catch (error) {
    res.status(500).json({ message: "Connection to database failed" });
    return;
  }

  const user = await findDocument(client, "users", {
    email: userEmail,
  });
  if (!user) {
    // it's impossible, we already checked that user with such email logged in, but just in case
    res.status(401).json({ message: "User not found" });
    return;
  }

  const currentPassword = user.password;

  const passwordsAreEqual = await verifyPassword(oldPassword, currentPassword);
  if (!passwordsAreEqual) {
    res.status(403).json({ message: "Invalid password" });
    return;
  }

  const hashedPassword = await hashPassword(newPassword);
  await updateDocument(
    client,
    "users",
    { email: userEmail },
    { $set: { password: hashedPassword } },
  );
  res.status(200).json({ message: "Password changed!" });
}
