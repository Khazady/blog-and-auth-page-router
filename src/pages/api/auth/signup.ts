import {
  connectToDatabase,
  findDocument,
  insertDocument,
} from "@/lib/server/database";
import { NextApiRequest, NextApiResponse } from "next";
import { hashPassword } from "@/lib/server/auth";

type ResponseData = {};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>,
) {
  if (req.method !== "POST") return;

  const { email, password } = req.body;

  if (!email || !email.includes("@") || !email.includes(".") || !password) {
    res.status(422).json({ message: "Invalid input" });
    return;
  }
  if (password.trim().length < 8) {
    res
      .status(422)
      .json({ message: "Password must be at least 8 characters long" });
    return;
  }

  let client;
  try {
    client = await connectToDatabase();
  } catch (error) {
    res.status(500).json({ message: "Connection to database failed" });
    return;
  }

  const existingUser = await findDocument(client, "users", { email });
  if (existingUser) {
    // uniqueness check
    res.status(422).json({ message: "User already exists" });
    return;
  }

  const hashedPassword = await hashPassword(password);

  const newUser = {
    email,
    password: hashedPassword,
  };

  try {
    await insertDocument(client, "users", newUser);
  } catch (error) {
    res.status(500).json({ message: "Inserting data failed" });
    return;
  }

  res.status(201).json({ message: "Created User!" });
}
