import { connectToDatabase, insertDocument } from "@/lib/server/database";
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

  //catch database connection errors
  const client = await connectToDatabase();

  const hashedPassword = hashPassword(password);

  //catch database insert errors
  const result = await insertDocument(client, "users", {
    email,
    password: hashedPassword,
  });

  res.status(201).json({ message: "Created User!" });
}
