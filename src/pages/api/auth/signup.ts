import { connectToDatabase, insertDocument } from "@/lib/database";
import { NextApiRequest, NextApiResponse } from "next";

type ResponseData = {};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>,
) {
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

  const client = await connectToDatabase();
  await insertDocument(client, "users", { email, password });
}
